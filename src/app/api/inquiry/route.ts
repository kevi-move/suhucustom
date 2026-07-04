import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_EMAIL } from "@/lib/siteContact";
import {
  checkRateLimit,
  getClientIp,
  isFormSubmittedTooFast,
  looksLikeSpam,
} from "@/lib/inquiryProtection";

const inquirySchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  company: z.string().max(160).optional().default(""),
  phone: z.string().max(80).optional().default(""),
  productCategory: z.string().max(120).optional().default(""),
  estimatedQty: z.string().max(120).optional().default(""),
  targetMarket: z.string().max(120).optional().default(""),
  leadTime: z.string().max(120).optional().default(""),
  message: z.string().min(10).max(5000),
  sourcePage: z.string().max(200).optional().default("/contact-us"),
  website: z.string().optional().default(""), // honeypot: must stay empty
  formStartedAt: z.number().optional(),
});

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const data = parsed.data;

    // Honeypot triggered — pretend success so bots stop retrying.
    if (data.website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const clientIp = getClientIp(request);
    const rate = checkRateLimit(clientIp);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    if (isFormSubmittedTooFast(data.formStartedAt)) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    if (
      looksLikeSpam({
        fullName: data.fullName,
        email: data.email,
        message: data.message,
        company: data.company,
      })
    ) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase.from("inquiries").insert({
      full_name: data.fullName,
      email: data.email.toLowerCase(),
      company: data.company || null,
      phone: data.phone || null,
      product_category: data.productCategory || null,
      estimated_qty: data.estimatedQty || null,
      target_market: data.targetMarket || null,
      lead_time: data.leadTime || null,
      message: data.message,
      source_page: data.sourcePage,
      status: "new",
    });

    if (insertError) {
      console.error("Inquiry insert error:", insertError);
      if (insertError.code === "PGRST205") {
        return NextResponse.json(
          {
            error:
              "Database table missing. Run supabase/migrations/20260425_add_inquiries_table.sql in Supabase SQL Editor.",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: "Failed to save your inquiry." },
        { status: 500 }
      );
    }

    const toEmail = process.env.NOTIFY_TO_EMAIL || SITE_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;
    // Resend requires a verified domain for custom from addresses.
    // Use onboarding@resend.dev for testing until your domain is verified.
    const fromEmail =
      process.env.INQUIRY_FROM_EMAIL || "Suhu Custom <onboarding@resend.dev>";

    let emailSent = false;
    let emailError: string | undefined;

    if (!resendApiKey) {
      emailError = "RESEND_API_KEY is not configured";
      console.warn("Inquiry saved but email skipped:", emailError);
    } else {
      try {
        const resend = new Resend(resendApiKey);
        const result = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          subject: `[SuhuCustom] New inquiry from ${data.fullName}`,
          html: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(data.company || "-")}</p>
            <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(data.phone || "-")}</p>
            <p><strong>Product Category:</strong> ${escapeHtml(data.productCategory || "-")}</p>
            <p><strong>Estimated Qty:</strong> ${escapeHtml(data.estimatedQty || "-")}</p>
            <p><strong>Source Page:</strong> ${escapeHtml(data.sourcePage)}</p>
            <p><strong>Message:</strong></p>
            <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(data.message)}</pre>
            <p style="margin-top:16px;color:#666;font-size:12px;">View all inquiries in Admin → 客户询盘</p>
          `,
        });
        if (result.error) {
          emailError = result.error.message || "Resend rejected the email";
          console.error("Inquiry email send error:", result.error);
        } else {
          emailSent = true;
          console.log(`Inquiry email sent to ${toEmail} (id: ${result.data?.id ?? "unknown"})`);
        }
      } catch (mailError) {
        emailError =
          mailError instanceof Error ? mailError.message : "Unexpected email send failure";
        console.error("Inquiry email send error:", mailError);
      }
    }

    return NextResponse.json({
      ok: true,
      ...(process.env.NODE_ENV !== "production"
        ? { emailSent, notifyTo: toEmail, emailError }
        : {}),
    });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
