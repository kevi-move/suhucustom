"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { EditableImage, EditableText } from "@/components/cms";
import { ABOUT_US_PLACEHOLDER } from "@/lib/aboutUsDefaults";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <EditableImage
          path="hero.heroImage"
          src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
          alt="SuhuCustom founders and garment manufacturing"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/75 to-slate-900/50" />
      </div>

      <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[68vh] lg:px-8 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          <EditableText path="hero.eyebrow" value="About SuhuCustom" />
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          <EditableText
            path="hero.title"
            value="Built by Two Sisters Who Know Garment Manufacturing Inside Out"
          />
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
          <EditableText
            path="hero.subtitle"
            value="We help brands, startups, and creators turn apparel ideas into high-quality custom products �?from hoodies and caps to gloves and uniforms."
          />
        </p>
      </div>
    </section>
  );
}
