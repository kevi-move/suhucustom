"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { EditableImage, EditableText } from "@/components/cms";
import { ABOUT_US_PLACEHOLDER } from "@/lib/aboutUsDefaults";

export default function AboutTeam() {
  return (
    <section className="bg-slate-900 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-square max-w-lg overflow-hidden rounded-3xl bg-slate-800 shadow-2xl ring-1 ring-white/10 lg:mx-0">
            <EditableImage
              path="team.image"
              src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
              alt="SuhuCustom team working with clients"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              <EditableText path="team.eyebrow" value="Our Team" />
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              <EditableText path="team.title" value="Meet the Team" />
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-300">
              <p>
                <EditableText
                  path="team.paragraph1"
                  value="At SuhuCustom, we believe good manufacturing starts with good communication."
                />
              </p>
              <p>
                <EditableText
                  path="team.paragraph2"
                  value="As a small and hands-on team, we work closely with every client throughout sampling and production."
                />
              </p>
              <p>
                <EditableText
                  path="team.paragraph3"
                  value="From fabric sourcing to shipment updates, we stay involved in every step."
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
