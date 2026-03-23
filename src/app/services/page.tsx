import Link from "next/link";
import { serviceGroups } from "@/lib/navigation";

export default function Services() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Our Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Comprehensive apparel manufacturing for every category. Browse by category or find your product below.
      </p>

      <div className="mt-12 space-y-12">
        {serviceGroups.map((group) => (
          <section key={group.titleEn}>
            <h2 className="text-xl font-semibold text-amber-600">{group.titleEn}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="rounded-lg border border-slate-200 p-4 hover:border-amber-300 hover:bg-amber-50/50"
                >
                  <span className="font-medium text-slate-900">{item.nameEn}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
