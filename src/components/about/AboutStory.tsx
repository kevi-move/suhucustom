"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { EditableImage, EditableText } from "@/components/cms";
import { ABOUT_US_PLACEHOLDER, splitLines } from "@/lib/aboutUsDefaults";
import { useCMS } from "@/contexts/CMSContext";

export default function AboutStory() {
  const { getValue } = useCMS();
  const challenges = splitLines(
    getValue<string>(
      "story.challenges",
      "Some suppliers communicated slowly.\nSome delivered inconsistent quality.\nOthers simply couldn't handle small or growing brands."
    )
  );

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              <EditableText path="story.eyebrow" value="Our Story" />
            </p>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600">
              <p>
                <EditableText
                  path="story.paragraph1"
                  value="SuhuCustom started with two sisters who grew up around garment factories in Humen, Dongguan �?one of China's largest apparel manufacturing hubs."
                />
              </p>
              <p>
                <EditableText
                  path="story.paragraph2"
                  value="After years of working with fabric suppliers, sampling teams, and production factories, we realized many overseas brands struggled to find reliable partners for custom apparel production."
                />
              </p>
              <ul className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4">
                {challenges.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                <EditableText
                  path="story.paragraph3"
                  value="So we built SuhuCustom to make apparel manufacturing easier, faster, and more transparent."
                />
              </p>
              <p>
                <EditableText
                  path="story.paragraph4"
                  value="Today, we help clients worldwide create custom hoodies, hats, gloves, workwear, and more �?with flexible MOQs, hands-on support, and reliable production."
                />
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-slate-200/80 sm:aspect-[5/6]">
              <EditableImage
                path="story.image"
                src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
                alt="SuhuCustom founders in Dongguan garment district"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
