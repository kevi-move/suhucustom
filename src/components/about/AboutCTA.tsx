"use client";

import Link from "next/link";
import { EditableImage, EditableText } from "@/components/cms";
import { QuoteButton } from "@/components/contact/QuoteButton";
import { ABOUT_US_PLACEHOLDER } from "@/lib/aboutUsDefaults";
import { resolveImageSrc } from "@/lib/imageFallback";
import { useCMS } from "@/contexts/CMSContext";

export default function AboutCTA() {
  const { getValue } = useCMS();
  const secondaryHref = getValue("cta.secondaryCtaHref", "/contact-us");

  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <EditableImage
          path="cta.backgroundImage"
          src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
          alt="Custom apparel collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/85" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          <EditableText path="cta.eyebrow" value="Get Started" />
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          <EditableText path="cta.title" value="Let's Build Your Next Apparel Collection" />
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200">
          <EditableText
            path="cta.subtitle"
            value="Whether you need custom hoodies, caps, gloves, or uniforms, we're ready to help you bring your ideas into production."
          />
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <QuoteButton
            title="Start Your Project"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
          >
            <EditableText path="cta.primaryCtaText" value="Start Your Project" />
          </QuoteButton>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:text-amber-200"
          >
            <EditableText path="cta.secondaryCtaText" value="Talk to Our Team" />
          </Link>
        </div>
      </div>
    </section>
  );
}
