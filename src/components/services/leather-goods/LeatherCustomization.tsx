"use client";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "leather",
    category: "Leather Type",
    image: "YOUR_LEATHER_TYPE_IMAGE_URL",
    highlights: [
      "Full-Grain Italian Leather",
      "Top-Grain Cowhide — smooth & durable",
      "Crazy Horse / Pull-Up Leather",
      "Vegan PU Leather — eco-friendly option",
    ],
    note: "Custom tanning & finishes available",
    cta: "View Leather Options",
  },
  {
    id: "hardware",
    category: "Hardware & Fittings",
    image: "YOUR_LEATHER_HARDWARE_OPT_IMAGE_URL",
    highlights: [
      "YKK / SBS branded zippers",
      "Solid brass buckles & clasps",
      "Custom-engraved snaps & rivets",
      "Gold, silver, gunmetal, antique brass plating",
    ],
    note: "Custom hardware molds available",
    cta: "View Hardware Options",
  },
  {
    id: "branding",
    category: "Embossing & Branding",
    image: "YOUR_LEATHER_BRANDING_IMAGE_URL",
    highlights: [
      "Blind debossing (no color)",
      "Gold / Silver foil hot stamping",
      "Laser engraving for precision logos",
      "Custom woven & leather labels",
    ],
    note: "Custom die creation included",
    cta: "View Branding Options",
  },
  {
    id: "color",
    category: "Colors & Finish",
    image: "YOUR_LEATHER_COLOR_IMAGE_URL",
    highlights: [
      "Natural vegetable-tanned colors",
      "Aniline & semi-aniline dyeing",
      "Matte, glossy, or distressed finishes",
      "Custom Pantone color matching",
    ],
    note: "Color swatch sampling included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_LEATHER_PACKAGING_IMAGE_URL",
    highlights: [
      "Luxury gift box with magnetic closure",
      "Branded dust bags & tissue wrap",
      "Custom care cards & certificates",
      "Retail-ready display packaging",
    ],
    note: "Premium unboxing experience",
    cta: "View Packaging Options",
  },
];

export default function LeatherCustomization() {
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
                src={active.image}
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
