"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { EditableImage, EditableText } from "@/components/cms";
import { ABOUT_US_PLACEHOLDER, splitLines } from "@/lib/aboutUsDefaults";
import { useCMS } from "@/contexts/CMSContext";

export default function AboutFactory() {
  const { getValue } = useCMS();
  const capabilities = splitLines(
    getValue<string>(
      "factory.capabilities",
      "Custom apparel\nEmbroidery & printing\nPrivate label manufacturing\nSmall-batch and bulk orders\nPackaging & labeling"
    )
  );

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              <EditableText path="factory.eyebrow" value="Factory & Production" />
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              <EditableText path="factory.title" value="Inside Our Production Process" />
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              <EditableText
                path="factory.intro"
                value="We work with experienced manufacturing teams to ensure every order meets quality and delivery expectations."
              />
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <EditableText
                path="factory.capabilitiesIntro"
                value="Our production network supports:"
              />
            </p>
            <ul className="mt-4 space-y-2">
              {capabilities.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <svg
                    className="h-5 w-5 shrink-0 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-slate-600">
              <EditableText
                path="factory.closing"
                value="Every order goes through sampling, production checks, and final inspection before shipping."
              />
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-slate-200/80">
            <EditableImage
              path="factory.image"
              src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
              alt="Garment production floor and quality inspection"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/50 to-transparent p-6">
              <p className="text-sm font-medium text-white/90">Sampling · QC · Final inspection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
