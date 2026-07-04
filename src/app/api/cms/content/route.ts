import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { upsertPageContent, getPageContent } from "@/lib/pageContent";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { syncPageContentTranslation } from "@/lib/translations/sync";
import { isDeepLConfigured } from "@/lib/deepl/client";

function validateContent(content: unknown): { valid: boolean; error?: string } {
  if (!content || typeof content !== "object") {
    return { valid: false, error: "Content must be a non-null object" };
  }

  const json = JSON.stringify(content);
  if (json.length > 1_000_000) {
    return { valid: false, error: "Content too large (max 1MB)" };
  }

  function checkDepth(obj: unknown, depth: number): boolean {
    if (depth > 10) return false;
    if (obj && typeof obj === "object") {
      for (const value of Object.values(obj as Record<string, unknown>)) {
        if (!checkDepth(value, depth + 1)) return false;
      }
    }
    return true;
  }

  if (!checkDepth(content, 0)) {
    return { valid: false, error: "Content nesting too deep (max 10 levels)" };
  }

  return { valid: true };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("pageSlug");

  if (!pageSlug) {
    return NextResponse.json({ error: "Missing pageSlug parameter" }, { status: 400 });
  }

  try {
    const { content, version } = await getPageContent(pageSlug);
    return NextResponse.json({ content, version });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userEmail = await resolveAdminEmail(request);

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized - please log in" }, { status: 401 });
    }

    const body = await request.json();
    const { pageSlug, content } = body;

    if (!pageSlug || typeof pageSlug !== "string") {
      return NextResponse.json({ error: "Missing or invalid pageSlug" }, { status: 400 });
    }

    const validation = validateContent(content);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await upsertPageContent(pageSlug, content, userEmail);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save" }, { status: 500 });
    }

    revalidateTag(`page-content:${pageSlug}`, "default");
    revalidatePath(pageSlug);

    if (isDeepLConfigured()) {
      after(async () => {
        try {
          await syncPageContentTranslation(pageSlug, content, result.version ?? 1);
        } catch (error) {
          console.error("Page translation sync failed:", error);
        }
      });
    }

    return NextResponse.json({ success: true, newVersion: result.version });
  } catch (error) {
    console.error("CMS update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update content" },
      { status: 500 }
    );
  }
}
