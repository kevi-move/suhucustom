"use client";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "material",
    category: "Materials",
    image: "YOUR_HAT_MATERIAL_OPTION_IMAGE_URL",
    highlights: [
      "Cotton Twill (Structured)",
      "Wool Blend (Premium Feel)",
      "Polyester Mesh (Breathable)",
      "Corduroy & Suede Options",
    ],
    note: "Custom material sourcing available",
    cta: "View Material Options",
  },
  {
    id: "style",
    category: "Styles & Shapes",
    image: "YOUR_HAT_STYLE_IMAGE_URL",
    highlights: [
      "Snapback, Fitted, Dad Hat",
      "Trucker, 5-Panel, Bucket Hat",
      "Beanie, Cuffed, Pom-Pom",
      "Visor, Military, Fedora",
    ],
    note: "Custom shapes supported",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "YOUR_HAT_DECO_IMAGE_URL",
    highlights: [
      "3D Puff Embroidery",
      "Flat Embroidery (up to 12 colors)",
      "Screen Print & Heat Transfer",
      "Woven / PVC / Leather Patches",
    ],
    note: "Wash-tested for durability",
    cta: "View Decoration Options",
  },
  {
    id: "closure",
    category: "Closures & Sizing",
    image: "YOUR_HAT_CLOSURE_IMAGE_URL",
    highlights: [
      "Plastic Snap Closure",
      "Leather Strap with Metal Buckle",
      "Elastic Fitted Band",
      "Adjustable Velcro Strap",
    ],
    note: "One-size & fitted options",
    cta: "View Closure Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_HAT_PACKAGING_IMAGE_URL",
    highlights: [
      "Individual polybag packaging",
      "Custom sticker seal labels",
      "Branded hat boxes",
      "Retail-ready display packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function HatCustomization() {
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
