"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { useRef } from "react";
import Link from "next/link";

const features = [
  {
    title: "Baby-Safe Ultra-Soft Fabric Sourcing",
    description:
      "We exclusively source OEKO-TEX Standard 100 Class 1 certified fabrics, the highest safety grade for baby and children's wear, meaning all materials are free of harmful chemicals, toxins, azo dyes and irritants. Our selection includes ultra-soft organic cotton, breathable bamboo viscose and gentle interlock cotton, designed specifically for delicate, sensitive children's skin. All fabrics are pre-washed and pre-shrunk to prevent shrinkage after wear and washing, ensuring long-lasting fit and softness.",
    image: "YOUR_BABYKIDS_SAFE_FABRIC_IMAGE_URL",
  },
  {
    title: "Child-Friendly Comfort Construction",
    description:
      "Every piece is crafted with flatlock stitching to eliminate rough seams that irritate skin, with tagless interior designs to avoid scratchy labels against delicate skin. For baby styles, we use soft, adjustable snap closures and stretchy neck openings for easy dressing and diaper changes, with no rough buttons or hard embellishments that pose choking hazards. Reinforced, gentle elastic at waistbands and cuffs stays secure without digging into skin, perfect for active kids all day long.",
    image: "YOUR_BABYKIDS_COMFORT_CONSTRUCTION_IMAGE_URL",
  },
  {
    title: "Safe, Durable Custom Branding",
    description:
      "Our custom branding options are fully child-safe, including soft water-based printing, tagless heat-transfer logos, gentle embroidery with soft backing, and woven labels stitched to the outside or seam to avoid skin contact. All branding materials are non-toxic and crack-resistant, holding up to frequent washing without fading or peeling. We avoid small buttons, rhinestones or loose embellishments on baby styles to meet strict CPSIA and international children's safety standards.",
    image: "YOUR_BABYKIDS_SAFE_BRANDING_IMAGE_URL",
  },
  {
    title: "Strict Safety & Quality Control",
    description:
      "We follow a rigorous 6-step inspection process tailored for children's apparel: fabric safety and softness test, pre-shrinking treatment, precision cutting, skin-friendly stitching, safe branding application, and final safety and finish check. Every piece is inspected for choking hazards, rough edges, toxic materials and sizing consistency, ensuring full compliance with CPSIA, OEKO-TEX and global children's clothing safety regulations, with zero defects guaranteed.",
    image: "YOUR_BABYKIDS_SAFETY_QC_IMAGE_URL",
  },
  {
    title: "Full Customization Flexibility",
    description:
      "We offer full customization for all baby and kids styles, covering newborn to youth sizes, with adjustable fits, gender-neutral or gender-specific designs, and seasonal options. Our flexible production accommodates small boutique orders and large bulk retail orders, with consistent quality and safety across all quantities. We support custom color matching, fun prints and minimalist designs, catering to boutique, everyday and premium children's brand aesthetics.",
    image: "YOUR_BABYKIDS_CUSTOMIZATION_FLEXIBILITY_IMAGE_URL",
  },
];

export default function BabyKidsFeatures() {
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
              Safety, softness, and comfort come first. Explore our core
              capabilities for children's apparel manufacturing.
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
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
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
