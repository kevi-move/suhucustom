import Link from "next/link";
import { customizationItems } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seoDefaults";

export const metadata = buildPageMetadata("/customization");

export default function Customization() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Customization Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        From printing to tech packs, we offer full customization solutions for your apparel brand.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {customizationItems.map((item) => (
          <Link
            key={item.slug}
            href={`/customization/${item.slug}`}
            className="rounded-lg border border-slate-200 p-6 hover:border-amber-300 hover:bg-amber-50/50"
          >
            <h2 className="font-semibold text-slate-900">{item.nameEn}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.nameZh}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
