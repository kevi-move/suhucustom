"use client";

import { EditableImage, EditableText } from "@/components/cms";

export default function BlogHero() {
  return (
    <section className="relative min-h-[280px] overflow-hidden bg-slate-900 sm:min-h-[320px]">
      <div className="absolute inset-0">
        <EditableImage
          path="hero.heroImage"
          src="/blog/placeholder.svg"
          alt="SuhuCustom blog"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/45" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
          <EditableText path="hero.eyebrow" value="SuhuCustom Blog" />
        </p>
        <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
          <span className="text-amber-400">
            <EditableText path="hero.titlePart1" value="Expert insights." />
          </span>{" "}
          <span className="text-white">
            <EditableText path="hero.titlePart2" value="Practical techniques." />
          </span>{" "}
          <span className="text-slate-300">
            <EditableText path="hero.titlePart3" value="Industry trends." />
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          <EditableText
            path="hero.subtitle"
            value="Created for apparel brands and manufacturing professionals — actionable knowledge on custom production, sourcing, and quality you can apply directly."
          />
        </p>
      </div>
    </section>
  );
}
