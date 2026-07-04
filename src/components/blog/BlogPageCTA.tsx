"use client";

import Link from "next/link";
import { EditableText } from "@/components/cms";
import { QuoteButton } from "@/components/contact/QuoteButton";

export default function BlogPageCTA() {
  return (
    <section className="border-t border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          <EditableText path="cta.eyebrow" value="Ready to produce?" />
        </p>
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          <EditableText path="cta.title" value="Turn your apparel idea into a real collection" />
        </h2>
        <p className="mt-4 text-slate-300">
          <EditableText
            path="cta.subtitle"
            value="Get a quote for custom hoodies, uniforms, caps, and more - flexible MOQ and hands-on support from our Humen, Dongguan team."
          />
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <QuoteButton
            title="Start Your Project"
            className="inline-flex rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
          >
            <EditableText path="cta.primaryButton" value="Start Your Project" />
          </QuoteButton>
          <Link
            href="/services"
            className="inline-flex rounded-full border border-white/50 px-8 py-3 text-sm font-semibold text-white transition hover:border-amber-300 hover:text-amber-200"
          >
            <EditableText path="cta.secondaryButton" value="View Services" />
          </Link>
        </div>
      </div>
    </section>
  );
}
