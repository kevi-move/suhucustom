"use client";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "material",
    category: "Material",
    image: "YOUR_TOWEL_MATERIAL_IMAGE_URL",
    highlights: [
      "100% Egyptian Cotton (500–900 GSM)",
      "Turkish Cotton — quick-dry & lightweight",
      "Organic Cotton — GOTS certified",
      "Microfiber Blend — ultra-lightweight travel towels",
    ],
    note: "Custom GSM & blend ratios available",
    cta: "View Material Options",
  },
  {
    id: "size",
    category: "Size & Weight",
    image: "YOUR_TOWEL_SIZE_IMAGE_URL",
    highlights: [
      "Face Towel — 30×30 cm",
      "Hand Towel — 40×70 cm",
      "Bath Towel — 70×140 cm",
      "Beach Towel — 90×180 cm / custom sizes",
    ],
    note: "Custom dimensions supported",
    cta: "View Size Options",
  },
  {
    id: "design",
    category: "Pattern & Design",
    image: "YOUR_TOWEL_DESIGN_IMAGE_URL",
    highlights: [
      "Jacquard woven logos & patterns",
      "Dobby border designs",
      "Reactive printed full-color graphics",
      "Embroidered logos & monograms",
    ],
    note: "Design assistance available",
    cta: "View Design Options",
  },
  {
    id: "color",
    category: "Colors & Dyeing",
    image: "YOUR_TOWEL_COLOR_IMAGE_URL",
    highlights: [
      "Reactive dyed solid colors (100+ shades)",
      "Yarn-dyed stripes & patterns",
      "Bleached white for hotel/spa",
      "Pantone color matching for brands",
    ],
    note: "Color fastness 4+ rating guaranteed",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_TOWEL_PACKAGING_IMAGE_URL",
    highlights: [
      "Ribbon-tied bundle packaging",
      "Custom belly band & hang tags",
      "Gift box sets (3-piece, 6-piece)",
      "Bulk hotel/hospitality packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function TowelCustomization() {
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
