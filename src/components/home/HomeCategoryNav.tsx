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
              "group relative block aspect-[4/3] overflow-hidden rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg sm:aspect-[5/4]";

            const cardBody = (
              <>
                <div className="absolute inset-0">
                  <EditableImage
                    path={`categories.images.${item.slug}`}
                    src={defaultImage}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Full-card dark scrim: clear at top, deep at bottom — matches reference */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/90 sm:text-sm">
                    <EditableText
                      path={`categories.taglines.${item.slug}`}
                      value={DEFAULT_TAGLINES[item.slug] ?? defaultTagline}
                    />
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-amber-300">
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
