"use client";

import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { EditableText } from "@/components/cms";
import { CMSProvider } from "@/contexts/CMSContext";
import { PageEditToolbar } from "@/components/cms/PageEditToolbar";
import { useAuth } from "@/contexts/AuthContext";
import { SITE_COMPANY_ADDRESS, SITE_COMPANY_LEGAL_NAME, SITE_EMAIL } from "@/lib/siteContact";

const TRUST_ITEMS = [
  "MOQ from 100 pcs",
  "Sample in 3–5 days",
  "Reply within 24 hours",
  "OEKO-TEX certified factory",
];

export default function ContactUsPageClient({
  displayContent,
  englishContent,
  modeEnabled,
}: {
  displayContent: Record<string, unknown>;
  englishContent: Record<string, unknown>;
  modeEnabled: boolean;
}) {
  const { isAdmin } = useAuth();
  const canEdit = isAdmin && modeEnabled;
  const hero = (displayContent.hero || {}) as Record<string, string>;

  return (
    <CMSProvider
      pageSlug="/contact-us"
      initialContent={englishContent}
      displayContent={displayContent}
      modeEnabled={canEdit}
    >
      <div className="bg-slate-50">
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_45%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              <EditableText path="hero.eyebrow" value={hero.eyebrow || "Contact Us"} />
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              <EditableText
                path="hero.title"
                value={hero.title || "Let's talk about your next collection"}
              />
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              <EditableText
                path="hero.subtitle"
                value={
                  hero.subtitle ||
                  "Share your product ideas, quantities, and timeline. Our team will respond with a clear manufacturing plan."
                }
              />
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
              <p className="mt-2 text-sm text-slate-600">
                Fill in the form and we&apos;ll get back to you within one business day.
              </p>
              <div className="mt-8">
                <ContactInquiryForm sourcePage="/contact-us" />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <h3 className="font-semibold text-amber-900">Why brands choose us</h3>
                <ul className="mt-4 space-y-3">
                  {TRUST_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-amber-950">
                      <span className="mt-0.5 text-amber-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Direct contact</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  <span className="block font-medium text-slate-800">{SITE_COMPANY_LEGAL_NAME}</span>
                  <span className="mt-1 block">{SITE_COMPANY_ADDRESS}</span>
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="mt-3 inline-block font-medium text-amber-600 hover:text-amber-700"
                  >
                    {SITE_EMAIL}
                  </a>
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">What to include</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Product type, target quantity, fabric or print requirements, destination market, and
                  expected launch date. Attachments can be shared after we reply.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
      {canEdit && <PageEditToolbar />}
    </CMSProvider>
  );
}
