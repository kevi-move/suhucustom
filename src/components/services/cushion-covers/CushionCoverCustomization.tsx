"use client";
import { resolveImageSrc } from "@/lib/imageFallback";
import { QuoteButton } from "@/components/contact/QuoteButton";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/cushion-covers/custom-cushion-cover-fabric-options-velvet-linen-polyester.png",
    highlights: [
      "Velvet — soft, luxurious sheen",
      "Linen — natural, textured look",
      "Cotton Canvas — durable & printable",
      "Outdoor Polyester — UV & water resistant",
    ],
    note: "Custom fabric blends available",
    cta: "View Fabric Options",
  },
  {
    id: "size",
    category: "Size & Shape",
    image: "/generated/services/cushion-covers/custom-cushion-cover-size-shape-options-square-round-bolster.png",
    highlights: [
      "Square — 45×45 cm / 50×50 cm",
      "Rectangular — 30×50 cm / 40×60 cm",
      "Round — 40 cm / 50 cm diameter",
      "Custom shapes — bolster, lumbar, etc.",
    ],
    note: "Custom dimensions supported",
    cta: "View Size Options",
  },
  {
    id: "decoration",
    category: "Printing & Embroidery",
    image: "/generated/services/cushion-covers/custom-cushion-cover-printing-embroidery-decoration-options.png",
    highlights: [
      "Digital printing — unlimited colors",
      "Screen printing — solid designs",
      "Hand embroidery & machine embroidery",
      "Appliqué, beading, and tufting",
    ],
    note: "Wash-tested for colorfastness",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Patterns",
    image: "/generated/services/cushion-covers/custom-cushion-cover-colors-patterns-botanical-geometric-abstract.png",
    highlights: [
      "Pantone-matched solid colors",
      "Botanical, geometric, abstract patterns",
      "Custom artwork & photo prints",
      "Seasonal & trend collections",
    ],
    note: "Design assistance available",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/cushion-covers/custom-cushion-cover-packaging-options-polybag-belly-band-gift-box.png",
    highlights: [
      "Individual polybag packaging",
      "Custom belly band & hang tags",
      "Gift box packaging (single or set)",
      "Retail-ready shelf display packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function CushionCoverCustomization() {
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
                  productCategory="Cushion Covers"
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
