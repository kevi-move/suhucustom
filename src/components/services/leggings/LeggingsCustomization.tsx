"use client";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "fabric",
    category: "Fabric",
    image: "YOUR_LEGGINGS_FABRIC_OPT_IMAGE_URL",
    highlights: [
      "4-Way Stretch Spandex Blend (180–220 GSM)",
      "Moisture-Wicking Polyester",
      "Buttery Soft Bamboo Viscose",
      "Compression Fabric",
      "High-Shine Metallic Blend",
    ],
    note: "Custom GSM and blends available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Cut",
    image: "YOUR_LEGGINGS_STYLE_IMAGE_URL",
    highlights: [
      "High-Waisted Leggings",
      "Mid-Waisted Leggings",
      "Compression Leggings",
      "Capri & Cropped Leggings",
      "Pocket Options (side / back waist)",
    ],
    note: "Custom patterns supported",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "YOUR_LEGGINGS_DECO_IMAGE_URL",
    highlights: [
      "Sublimation Printing (full-color patterns)",
      "Heat Transfer Vinyl",
      "Embroidery (waist/leg logos)",
      "Custom Woven Labels",
      "Reflective Accents (for safety)",
    ],
    note: "Wash-tested for 50+ cycles",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Sizing",
    image: "YOUR_LEGGINGS_COLORS_IMAGE_URL",
    highlights: [
      "Pantone-matched solid colors",
      "Heather blends & custom printed patterns",
      "Sizes XS – 4XL",
      "Plus size options available",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_LEGGINGS_PKG_IMAGE_URL",
    highlights: [
      "Individual polybag packaging",
      "Custom hang tags (with size/fabric labels)",
      "Branded poly mailers",
      "Retail-ready leggings packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function LeggingsCustomization() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = options[activeIdx];

  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Customization Options
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Left: tab list */}
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

          {/* Center: product image */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className="relative w-full overflow-hidden rounded-2xl bg-slate-50">
              <img
                src={active.image}
                alt={active.category}
                className="h-auto min-h-[320px] w-full object-cover"
              />
            </div>
          </div>

          {/* Right: details card */}
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
                <Link
                  href="/contact-us"
                  className="flex w-full items-center justify-center rounded-full bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Get a Quote
                </Link>
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
