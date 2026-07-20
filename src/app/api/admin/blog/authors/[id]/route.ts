import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import { authorInputToRow, authorToJson, rowToAuthor } from "@/lib/authorRow";

const authorInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  bio: z.string(),
  avatarUrl: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialLinkedin: z.string().optional(),
});

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function missingServiceRole() {
  return NextResponse.json(
    {
      error: "missing_service_role",
      message: "请在 Vercel / .env.local 配置 SUPABASE_SERVICE_ROLE_KEY",
    },
    { status: 503 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase.from("authors").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Admin author fetch error:", error);
    return NextResponse.json({ error: "Failed to load author" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ author: authorToJson(rowToAuthor(data)) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const { id } = await params;
  const body = await request.json();
  const parsed = authorInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { error } = await supabase
    .from("authors")
    .update({
      ...authorInputToRow(parsed.data),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Admin author update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update author" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const { id } = await params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  await supabase.from("blog_posts").update({ author_ref: null }).eq("author_ref", id);

  const { error } = await supabase.from("authors").delete().eq("id", id);

  if (error) {
    console.error("Admin author delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete author" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
