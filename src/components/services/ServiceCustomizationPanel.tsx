"use client";

import { QuoteButton } from "@/components/contact/QuoteButton";
import { resolveImageSrc } from "@/lib/imageFallback";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type ServiceCustomizationOption = {
  id: string;
  category: string;
  image: string;
  highlights: string[];
  note: string;
  cta: string;
};

type ServiceCustomizationPanelProps = {
  options: ServiceCustomizationOption[];
  productCategory: string;
};

/** Keep every tab image mounted so VisualPageEditor can save/restore all uploads. */
export default function ServiceCustomizationPanel({
  options,
  productCategory,
}: ServiceCustomizationPanelProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = options[activeIdx];
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    options.forEach((opt) => {
      const img = imageRefs.current.get(opt.id);
      if (!img) return;
      if (/^https?:\/\//i.test(img.currentSrc || img.src)) return;
      if (!img.getAttribute("src")) {
        img.src = resolveImageSrc(opt.image);
      }
    });
  }, [options]);

  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Customization Options</h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {options.map((opt, idx) => (
                <button
                  key={opt.id}
                  type="button"
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
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-slate-50"
              data-vedit-customization-panel="true"
            >
              {options.map((opt, idx) => (
                <img
                  key={opt.id}
                  ref={(node) => {
                    if (node) imageRefs.current.set(opt.id, node);
                    else imageRefs.current.delete(opt.id);
                  }}
                  data-vedit-customization-id={opt.id}
                  alt={opt.category}
                  className={`h-auto min-h-[320px] w-full object-cover ${
                    idx === activeIdx ? "relative block" : "pointer-events-none absolute inset-0 opacity-0"
                  }`}
                  aria-hidden={idx !== activeIdx}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">{active.category}</h3>

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
                  productCategory={productCategory}
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
