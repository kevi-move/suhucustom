import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import { inputToUpdateRow, postToJson, rowToPost } from "@/lib/blogRow";

const blogPostPatchSchema = z
  .object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
    categoryId: z.string().uuid().nullable().optional(),
    authorRef: z.string().uuid().nullable().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function missingServiceRole() {
  return NextResponse.json(
    {
      error: "missing_service_role",
      message: "请在 .env.local 配置 SUPABASE_SERVICE_ROLE_KEY",
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

  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Admin blog fetch error:", error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ post: postToJson(rowToPost(data)) });
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
  const parsed = blogPostPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const updateData = {
    ...inputToUpdateRow(parsed.data),
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.status === "published") {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("published_at")
      .eq("id", id)
      .single();

    if (existing && !existing.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from("blog_posts").update(updateData).eq("id", id);

  if (error) {
    console.error("Admin blog update error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
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

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    console.error("Admin blog delete error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
