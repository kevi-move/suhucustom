"use client";

import Link from "next/link";
import { EditableText } from "@/components/cms";
import { serviceGroups } from "@/lib/navigation";
import { isUnpublishedServiceSlug } from "@/lib/unpublishedPaths";

const PRODUCT_TAGS = [
  { slug: "t-shirts", label: "T-Shirts" },
  { slug: "hoodies-sweatshirts", label: "Hoodies & Sweatshirts" },
  { slug: "activewear-athleisure", label: "Activewear & Athleisure" },
  { slug: "gym-sportswear", label: "Gym & Sportswear" },
  { slug: "leggings", label: "Leggings" },
  { slug: "jeans-denim", label: "Jeans & Denim" },
  { slug: "underwear-bras", label: "Underwear & Bras" },
  { slug: "swimwear", label: "Swimwear" },
  { slug: "hats-headwear", label: "Hats & Headwear" },
  { slug: "socks", label: "Socks" },
  { slug: "neck-gaiters", label: "Neck Gaiters" },
  { slug: "leather-goods", label: "Leather Goods" },
  { slug: "uniforms", label: "Uniforms" },
  { slug: "baby-kids-clothing", label: "Baby & Kids Clothing" },
  { slug: "towels", label: "Towels" },
  { slug: "cushion-covers", label: "Cushion Covers" },
] as const;

const publishedSlugs = new Set(
  serviceGroups.flatMap((group) => group.items.map((item) => item.slug)).filter(
    (slug) => !isUnpublishedServiceSlug(slug)
  )
);

function hrefForSlug(slug: string): string {
  return publishedSlugs.has(slug) ? `/services/${slug}/` : "/";
}

export default function AboutProducts() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText path="products.title" value="What Can We Make for You?" />
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            <EditableText
              path="products.subtitle"
              value="From a simple idea to a finished custom product, we help bring your designs into production."
            />
          </p>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {PRODUCT_TAGS.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={hrefForSlug(tag.slug)}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 hover:shadow-md"
              >
                {tag.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
