import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import { inputToInsertRow, postToJson, rowToPost } from "@/lib/blogRow";

const blogPostInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  excerpt: z.string(),
  featuredImage: z.string(),
  status: z.enum(["draft", "published"]),
  categoryId: z.string().uuid().nullable().optional(),
  authorRef: z.string().uuid().nullable().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
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

export async function GET(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin blog list error:", error);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }

  return NextResponse.json({
    posts: (data || []).map((row) => postToJson(rowToPost(row))),
  });
}

export async function POST(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const body = await request.json();
  const parsed = blogPostInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const now = new Date().toISOString();
  const insertData = inputToInsertRow(parsed.data, "admin-api", adminEmail, now);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    console.error("Admin blog create error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
