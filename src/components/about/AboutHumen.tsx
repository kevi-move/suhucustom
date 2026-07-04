"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { EditableImage, EditableText } from "@/components/cms";
import { ABOUT_US_PLACEHOLDER, splitLines } from "@/lib/aboutUsDefaults";
import { useCMS } from "@/contexts/CMSContext";

export default function AboutHumen() {
  const { getValue } = useCMS();
  const benefits = splitLines(
    getValue<string>(
      "humen.benefits",
      "Faster sampling\nBetter material sourcing\nFlexible production capacity\nStable lead times\nCompetitive pricing"
    )
  );

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-slate-200 shadow-lg ring-1 ring-slate-200/80">
            <EditableImage
              path="humen.image"
              src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
              alt="Humen Dongguan garment manufacturing district"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              <EditableText path="humen.eyebrow" value="Why Humen, Dongguan Matters" />
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              <EditableText path="humen.title" value="Why We Manufacture in Humen" />
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              <EditableText
                path="humen.intro"
                value="Located in Humen, Dongguan, we work closely with experienced garment factories, fabric markets, embroidery workshops, and printing suppliers."
              />
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <EditableText path="humen.benefitsIntro" value="This gives us:" />
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {benefits.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-slate-600">
              <EditableText
                path="humen.closing"
                value="From startup streetwear brands to corporate uniform orders, we help clients move from idea to production efficiently."
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
