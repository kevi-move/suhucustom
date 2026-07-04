"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { useRef } from "react";
import Link from "next/link";

const features = [
  {
    title: "Premium Uniform-Grade Fabric Sourcing",
    description:
      "We source heavy-duty, professional-grade fabrics built for daily repeated wear, frequent washing and long-term durability. Our selection includes wrinkle-resistant easy-care blends, stain-repellent workwear materials, moisture-wicking performance fabrics and soft breathable options for all-day comfort, fully compliant with OEKO-TEX standards and free of harmful chemicals. All fabrics hold their shape and color through countless washes, maintaining a polished professional look for teams.",
    image: "YOUR_UNIFORM_PREMIUM_FABRIC_IMAGE_URL",
  },
  {
    title: "Reinforced Industrial Construction",
    description:
      "Every uniform is built with reinforced double-needle stitching at high-stress points including seams, pockets, collars and cuffs to prevent fraying and tearing during daily use. We add sturdy bartack reinforcements, clean finished seams and durable hem construction, with tailored fits that balance professionalism and mobility. For workwear and industrial uniforms, we include extra durable panels and reinforced pocketing for heavy-duty functionality.",
    image: "YOUR_UNIFORM_REINFORCED_CONSTRUCTION_IMAGE_URL",
  },
  {
    title: "Professional Custom Branding",
    description:
      "We offer durable, professional branding solutions tailored for uniforms, including embroidery, screen printing, heat transfer and custom woven labels, all designed to withstand frequent laundering without fading, peeling or cracking. Logos and branding are placed strategically for a polished, cohesive team look, with strict Pantone color matching to ensure full brand consistency across every uniform piece. We also accommodate custom name embroidery and department badging for personalized team wear.",
    image: "YOUR_UNIFORM_CUSTOM_BRANDING_IMAGE_URL",
  },
  {
    title: "Strict Quality Control",
    description:
      "Our 5-step full inspection process guarantees consistent, defect-free uniforms for every order: fabric durability and colorfastness test, precision cutting, sewing and reinforcement, branding application, and final pressing and packaging. Every piece is checked for sizing accuracy, stitching integrity, branding placement and overall finish to meet strict professional standards, ensuring a uniform, polished look for entire teams.",
    image: "YOUR_UNIFORM_QC_IMAGE_URL",
  },
  {
    title: "Full Customization Flexibility",
    description:
      "We support full customization for all uniform types, with adjustable styles, fits, colors and detailing to match any business or industry requirement. From formal corporate attire and casual team polos to heavy-duty workwear and specialized hospitality uniforms, we cater to all industry needs. Our flexible production accommodates small team orders and large enterprise bulk orders, with consistent sizing and quality across every order quantity.",
    image: "YOUR_UNIFORM_CUSTOMIZATION_FLEXIBILITY_IMAGE_URL",
  },
];

export default function UniformFeatures() {
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
              Every detail matters - from fabric durability to branding
              placement. Explore our core capabilities that set us apart.
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
