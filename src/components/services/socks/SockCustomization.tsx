"use client";
import { resolveImageSrc } from "@/lib/imageFallback";
import { QuoteButton } from "@/components/contact/QuoteButton";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "yarn",
    category: "Yarn & Material",
    image: "/generated/services/socks/custom-sock-yarn-material-options-cotton-wool-bamboo-nylon.png",
    highlights: [
      "Combed Cotton (80–200 needle count)",
      "Merino Wool — premium warmth",
      "Bamboo Fiber — eco-friendly & breathable",
      "Coolmax / Nylon blends for performance",
    ],
    note: "Custom yarn blends available",
    cta: "View Yarn Options",
  },
  {
    id: "style",
    category: "Length & Style",
    image: "/generated/services/socks/custom-sock-length-style-options-no-show-ankle-crew-knee-high.png",
    highlights: [
      "No-Show / Invisible Socks",
      "Ankle / Quarter Length",
      "Crew / Mid-Calf Socks",
      "Knee-High & Over-the-Calf",
    ],
    note: "Custom lengths available",
    cta: "View Style Options",
  },
  {
    id: "pattern",
    category: "Pattern & Design",
    image: "/generated/services/socks/custom-sock-pattern-design-options-jacquard-sublimation.png",
    highlights: [
      "Full Jacquard Knitting (up to 6 colors)",
      "360° Sublimation Printing",
      "Embroidered logos & icons",
      "Custom woven labels & grip dots",
    ],
    note: "Pantone color matching included",
    cta: "View Pattern Options",
  },
  {
    id: "size",
    category: "Colors & Sizing",
    image: "/generated/services/socks/custom-sock-colors-sizing-options-kids-women-men.png",
    highlights: [
      "Pantone-matched solid or gradient colors",
      "Kids / Women / Men sizing",
      "EU 35–48, US 5–14",
      "Custom size charts for niche markets",
    ],
    note: "Size sampling included",
    cta: "View Size Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/socks/custom-sock-packaging-options-belly-band-header-card-box.png",
    highlights: [
      "Belly band / header card packaging",
      "Custom hang tags & stickers",
      "Gift box & tin packaging",
      "Retail-ready display bundles",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function SockCustomization() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = options[activeIdx];

  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Customization Options
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {options.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                    idx === activeIdx
                      ? "border-l-[3px] border-amber-500 bg-amber-50 text-slate-900"
                      : "border-l-[3px] border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {opt.category}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-center lg:col-span-5">
            <div className="relative w-full overflow-hidden rounded-2xl bg-slate-50">
              <img
                src={resolveImageSrc(active.image)}
                alt={active.category}
                className="h-auto min-h-[320px] w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                {active.category}
              </h3>

              <ul className="mt-5 space-y-3">
                {active.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {h}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-slate-400">{active.note}</p>

              <div className="mt-6 space-y-3">
                <QuoteButton
                  title="Get a Quote"
                  productCategory="Socks"
                  className="flex w-full items-center justify-center rounded-full bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Get a Quote
                </QuoteButton>
                <Link
                  href="/contact-us"
                  className="flex w-full items-center justify-center rounded-full border border-slate-200 py-3 text-sm font-semibold text-amber-600 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  {active.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
