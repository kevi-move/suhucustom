import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";

function rowToInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    email: row.email as string,
    company: (row.company as string) || null,
    phone: (row.phone as string) || null,
    productCategory: (row.product_category as string) || null,
    estimatedQty: (row.estimated_qty as string) || null,
    targetMarket: (row.target_market as string) || null,
    leadTime: (row.lead_time as string) || null,
    message: row.message as string,
    sourcePage: row.source_page as string,
    status: row.status as InquiryStatus,
    createdAt: new Date(row.created_at as string),
  };
}

export async function GET(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured) {
    return NextResponse.json(
      {
        error: "missing_service_role",
        message: "请在 .env.local 配置 SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 503 }
    );
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin inquiries fetch error:", error);
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
  }

  return NextResponse.json({
    inquiries: (data || []).map(rowToInquiry),
  });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "processing", "closed"]),
});

export async function PATCH(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: "missing_service_role" }, { status: 503 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  const { error } = await supabase
    .from("inquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("Admin inquiry update error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
