"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { useRef } from "react";
import Link from "next/link";

const features = [
  {
    title: "Premium Performance Fabric Sourcing",
    description:
      "We source moisture-wicking polyester, 4-way stretch spandex, and eco-friendly performance blends for breathability, quick-drying, and long-lasting wear.",
    image: "/generated/services/activewear-athleisure/custom-activewear-performance-fabric-sourcing-stretch-swatches.png",
  },
  {
    title: "Precision Athletic Construction",
    description:
      "Reinforced flatlock stitching, contoured seams, and elasticated waistbands for maximum mobility and comfort during active use.",
    image: "/generated/services/activewear-athleisure/custom-activewear-flatlock-stitching-athletic-construction.png",
  },
  {
    title: "Custom Decoration",
    description:
      "Full support for sublimation printing, screen print, heat transfer, embroidery, and custom woven label/neck tag options for athletic branding.",
    image: "/generated/services/activewear-athleisure/custom-activewear-decoration-heat-transfer-embroidery-labels.png",
  },
  {
    title: "Strict Quality Control",
    description:
      "5-step inspection: fabric → cutting → sewing → decoration → final packaging to ensure zero defects and consistent performance.",
    image: "/generated/services/activewear-athleisure/custom-activewear-quality-control-stretch-measurement.png",
  },
  {
    title: "Flexible Customization",
    description:
      "Fully customizable fits (slim/regular/athletic), styles (leggings/tanks/sports bras), sizes (XS–4XL), and wash-resistant performance designs.",
    image: "/generated/services/activewear-athleisure/custom-activewear-flexible-customization-styles-colors-sizes.png",
  },
];

export default function ActivewearFeatures() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 300;
    const gap = 24;
    const distance = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Craftsmanship &amp; Advantages
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Engineered for performance — every stitch, seam, and fabric choice
              is built for athletes and active lifestyles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/quality"
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              See all services
            </Link>

            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-amber-400 hover:text-amber-600"
              aria-label="Scroll left"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-amber-400 hover:text-amber-600"
              aria-label="Scroll right"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-12 flex gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="group w-[260px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[280px]"
            >
              <div className="relative h-52 overflow-hidden bg-slate-200">
                <img
                  src={resolveImageSrc(f.image)}
                  alt={f.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
