import { NextRequest, NextResponse } from "next/server";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/adminServer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminLocalGateEnabled } from "@/lib/adminLocalGate";

const FILE_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
};

function verifyWebp(buffer: Buffer): boolean {
  return (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  );
}

function verifyFileSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/webp") {
    return verifyWebp(buffer);
  }

  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) return false;

  return signatures.some((signature) =>
    signature.every((byte, index) => buffer[index] === byte)
  );
}

function generateSafeFilename(mimeType: string): string {
  const ext = mimeType.split("/")[1] === "jpeg" ? "jpg" : mimeType.split("/")[1];
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}.${ext}`;
}

const BUCKET = "cms";

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

function resolveMimeType(file: File): string | null {
  const declared = file.type?.toLowerCase().trim() || "";
  if (declared === "image/jpg") return "image/jpeg";
  if (declared.startsWith("image/")) return declared;

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  return EXT_TO_MIME[ext] ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const adminEmail = await resolveAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: "Forbidden - admin access required" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = resolveMimeType(file);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!mimeType || !allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!verifyFileSignature(buffer, mimeType)) {
      return NextResponse.json(
        { error: "File content does not match declared type." },
        { status: 400 }
      );
    }

    const safeFilename = generateSafeFilename(mimeType);
    const storagePath = `uploads/${safeFilename}`;

    const adminClient = createAdminSupabaseClient();
    const supabase =
      adminClient ??
      (isAdminLocalGateEnabled() ? null : await createServerSupabaseClient());

    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Storage upload requires SUPABASE_SERVICE_ROLE_KEY when using local admin gate.",
        },
        { status: 503 }
      );
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Supabase storage upload:", uploadError);
      }
      return NextResponse.json(
        { error: uploadError.message || "Storage upload failed" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Upload error:", error);
    }
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
