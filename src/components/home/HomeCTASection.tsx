"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import Link from "next/link";
import { EditableImage, EditableText } from "@/components/cms";
import { QuoteButton } from "@/components/contact/QuoteButton";

export default function HomeCTASection() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <EditableImage
          path="cta.backgroundImage"
          src={resolveImageSrc("/generated/home/cta-background.png")}
          alt="Suhu Custom factory and products"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center text-white sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          Ready to start?
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          <EditableText path="cta.title" value="Let's build your next collection together." />
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
          <EditableText
            path="cta.subtitle"
            value="Share your tech packs, reference samples or ideas – our team will respond with a clear production solution, lead time and estimated costing within 24 hours."
          />
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <QuoteButton
            title="Get a Factory Quote"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
          >
            <EditableText path="cta.primaryCtaText" value="Get a Factory Quote" />
          </QuoteButton>
          <Link
            href="/company/case-studies"
            className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:text-amber-200"
          >
            <EditableText path="cta.secondaryCtaText" value="View More Case Studies" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 sm:text-sm">
          <span>Flexible MOQ for new collections</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>Support for brands, wholesalers & online stores</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>Dedicated account manager for every project</span>
        </div>
      </div>
    </div>
  );
}
