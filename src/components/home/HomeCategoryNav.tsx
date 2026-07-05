"use client";

import Link from "next/link";
import { useState } from "react";
import { EditableImage, EditableText } from "@/components/cms";
import { useCMS } from "@/contexts/CMSContext";
import { serviceGroups } from "@/lib/navigation";
import { categoryImages } from "@/lib/generated/categoryImages";

const DEFAULT_TAGLINES: Record<string, string> = {
  "t-shirts": "Soft cotton bases with sharp, durable prints.",
  "hoodies-sweatshirts": "Heavyweight fleece, clean sewing and stable fit.",
  "activewear-athleisure": "Quick‑dry, 4‑way stretch, anti‑pilling fabrics.",
  "gym-sportswear": "Moisture‑wicking performance knits for training use.",
  leggings: "Squat‑proof opacity with high‑recovery stretch.",
  "jeans-denim": "Consistent washing, strong stitching and true sizing.",
  "underwear-bras": "Seamless construction with skin‑friendly materials.",
  swimwear: "Shape‑holding stretch with chlorine‑resistant prints.",
  "hats-headwear": "Clean embroidery and crisp logo placement.",
  socks: "High needle count, soft handfeel and firm rib.",
  "neck-gaiters": "Breathable, all‑over print with smooth edges.",
  "leather-goods": "Precise edge painting and neat top‑stitching.",
  uniforms: "Color‑fast, wrinkle‑resistant fabrics for daily wear.",
  "baby-kids-clothing": "Gentle, comfortable fabrics with safe trims.",
  towels: "High‑GSM loops for strong absorption and softness.",
  "cushion-covers": "Shape‑stable fabric and clean hidden zippers.",
};

export default function HomeCategoryNav() {
  const { getDisplayValue, isEditMode } = useCMS();
  const taglines = getDisplayValue<Record<string, string>>("categories.taglines", DEFAULT_TAGLINES);
  const defaultTagline = getDisplayValue<string>(
    "categories.taglines.default",
    "Factory‑level sewing quality and consistent sizing."
  );

  const allServiceItems = serviceGroups.flatMap((group) =>
    group.items.map((item) => ({
      slug: item.slug,
      title: item.nameEn,
      href: `/services/${item.slug}`,
      tagline: taglines[item.slug] ?? defaultTagline,
    }))
  );

  const [page, setPage] = useState(0);
  const pageSize = 8;
  const pageCount = Math.ceil(allServiceItems.length / pageSize);
  const start = page * pageSize;
  const currentItems = allServiceItems.slice(start, start + pageSize);

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              <EditableText path="categories.title" value="Core Product Categories" />
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              <EditableText
                path="categories.subtitle"
                value="Browse all apparel categories we manufacture. Each tile links directly to a detailed service page with fabrics, MOQ and customization options."
              />
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {currentItems.map((item) => {
            const defaultImage =
              categoryImages[item.slug] ?? `/generated/home/category-${item.slug}.webp`;
            const cardClassName =
              "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl";

            const cardBody = (
              <>
                <div className="relative h-32 overflow-hidden sm:h-36">
                  <EditableImage
                    path={`categories.images.${item.slug}`}
                    src={defaultImage}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-90" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-xs font-semibold text-amber-600 ring-1 ring-amber-100 group-hover:bg-amber-500 group-hover:text-white group-hover:ring-amber-500">
                      {item.title.charAt(0)}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    <EditableText
                      path={`categories.taglines.${item.slug}`}
                      value={DEFAULT_TAGLINES[item.slug] ?? defaultTagline}
                    />
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-amber-600 group-hover:text-amber-700">
                    <EditableText path="categories.viewDetails" value="View service details" />
                    <svg
                      className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </>
            );

            if (isEditMode) {
              return (
                <div key={item.slug} className={cardClassName}>
                  {cardBody}
                </div>
              );
            }

            return (
              <Link key={item.slug} href={item.href} className={cardClassName}>
                {cardBody}
              </Link>
            );
          })}
        </div>

        {pageCount > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                aria-label={`Go to category page ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === page ? "bg-amber-500" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
