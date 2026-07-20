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

export async function GET(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Admin categories list error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }

  return NextResponse.json({
    categories: (data || []).map((row) => categoryToJson(rowToCategory(row))),
  });
}

export async function POST(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) return unauthorized();
  if (!isSupabaseAdminConfigured) return missingServiceRole();

  const body = await request.json();
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Admin category create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id });
}
