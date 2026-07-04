"use client";
import { resolveImageSrc } from "@/lib/imageFallback";
import { QuoteButton } from "@/components/contact/QuoteButton";

import { useState } from "react";
import Link from "next/link";

const options = [
  {
    id: "fabric",
    category: "Fabric & Material",
    image: "YOUR_UNIFORM_FABRIC_IMAGE_URL",
    highlights: [
      "Wrinkle-Resistant Poly-Cotton Blend",
      "Stain-Repellent Workwear Twill",
      "Moisture-Wicking Performance Fabric",
      "Easy-Care Jersey",
      "Durable Canvas",
      "Soft Scrub Fabric (Healthcare)",
      "Formal Dress Fabric",
    ],
    note: "Built for durability, comfort, and easy maintenance",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Uniform Styles",
    image: "YOUR_UNIFORM_STYLE_IMAGE_URL",
    highlights: [
      "Corporate Polos & Button-Downs",
      "Hospitality Server & Front Desk Uniforms",
      "Industrial Work Shirts & Pants",
      "Healthcare Scrubs",
      "Retail Team Wear",
      "School & Institutional Uniforms",
      "Custom Team Jackets & Vests",
    ],
    note: "Full-range styles for business and organization needs",
    cta: "View Style Options",
  },
  {
    id: "fit",
    category: "Fit & Function",
    image: "YOUR_UNIFORM_FIT_FUNCTION_IMAGE_URL",
    highlights: [
      "Tailored Professional Fit",
      "Relaxed Workwear Fit",
      "Unisex Sizing",
      "Gender-Specific Fits",
      "Reinforced Pockets",
      "Wrinkle-Resistant Finish",
      "Stain Repellent Treatment",
      "Breathable Vents",
      "Stretch Panels for Mobility",
    ],
    note: "Professional look with all-day comfort and movement",
    cta: "View Fit Options",
  },
  {
    id: "branding",
    category: "Branding & Details",
    image: "YOUR_UNIFORM_BRANDING_IMAGE_URL",
    highlights: [
      "Professional Embroidery (Chest/Sleeve)",
      "Screen Printing",
      "Heat Transfer Logos",
      "Custom Woven Labels",
      "Name Embroidery",
      "Department Badging",
      "Custom Collar & Cuff Detailing",
      "Pantone Color Matching",
    ],
    note: "Durable branding built for repeated laundering",
    cta: "View Branding Options",
  },
  {
    id: "packaging",
    category: "Sizing & Packaging",
    image: "YOUR_UNIFORM_PACKAGING_IMAGE_URL",
    highlights: [
      "Sizes XS-4XL (plus size & tall options available)",
      "Individual Polybag Packaging",
      "Size Labeling",
      "Branded Hang Tags",
      "Retail-Ready & Bulk Shipping Packaging",
    ],
    note: "Optimized for team distribution and bulk logistics",
    cta: "View Packaging Options",
  },
];

export default function UniformCustomization() {
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
                  productCategory="Uniforms"
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
