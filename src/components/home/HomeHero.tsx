"use client";

import Link from "next/link";
import { EditableImage, EditableText } from "@/components/cms";
import { QuoteButton } from "@/components/contact/QuoteButton";

export default function HomeHero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <EditableImage
          path="hero.heroImage"
          src="/generated/home/hero.png"
          alt="Suhu Custom apparel manufacturing"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-20 text-left text-white sm:px-6 lg:flex-row lg:items-center lg:py-28 lg:px-8">
        <div className="max-w-xl lg:mr-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            <EditableText path="hero.eyebrow" value="Custom Apparel Manufacturing" />
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <EditableText
              path="hero.title"
              value="Reliable garment factory for global brands & startups"
            />
          </h1>
          <p className="mt-4 text-base text-slate-100 sm:text-lg">
            <EditableText
              path="hero.subtitle"
              value="From design development to bulk production, Suhu Custom helps you turn ideas into high-quality collections – with flexible MOQ, stable lead time and factory-direct pricing."
            />
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuoteButton
              title="Get an Instant Quote"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-7 py-3 text-sm font-medium text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
            >
              <EditableText path="hero.primaryCtaText" value="Get an Instant Quote" />
            </QuoteButton>
            <Link
              href="/services/t-shirts"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:text-amber-200"
            >
              <EditableText path="hero.secondaryCtaText" value="View Manufacturing Services" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
