import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import { isDeepLConfigured } from "@/lib/deepl/client";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { SITE_EMAIL } from "@/lib/siteContact";

export async function GET(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const adminEmail = await resolveAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const hasEmail =
    Boolean(process.env.NOTIFY_TO_EMAIL?.trim()) &&
    Boolean(process.env.RESEND_API_KEY?.trim());

  const fromEmail =
    process.env.INQUIRY_FROM_EMAIL || "Suhu Custom <onboarding@resend.dev>";
  const resendTestMode = fromEmail.includes("onboarding@resend.dev");

  return NextResponse.json({
    supabasePublic: isSupabaseConfigured,
    supabaseAdmin: isSupabaseAdminConfigured,
    emailNotify: hasEmail,
    notifyToEmail: process.env.NOTIFY_TO_EMAIL?.trim() || SITE_EMAIL,
    siteContactEmail: SITE_EMAIL,
    resendTestMode,
    deepl: isDeepLConfigured(),
    ...(isProduction ? {} : { supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null }),
  });
}
