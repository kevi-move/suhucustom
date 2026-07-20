import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import { categoryToJson, rowToCategory } from "@/lib/categoryRow";

const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
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

  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Admin category fetch error:", error);
    return NextResponse.json({ error: "Failed to load category" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ category: categoryToJson(rowToCategory(data)) });
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
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Admin category update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
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

  await supabase.from("blog_posts").update({ category_id: null }).eq("category_id", id);

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Admin category delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
