import { resolveImageSrc } from "@/lib/imageFallback";
import Link from "next/link";

const stats = [
  { value: "100,000+", label: "Gaiters Produced / Month" },
  { value: "8+", label: "Sublimation Printers" },
  { value: "120+", label: "Skilled Workers" },
  { value: "4,000+ ㎡", label: "Factory Area" },
];

export default function NeckGaiterOverview() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Reliable Custom Neck Gaiter Manufacturer
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition hover:border-amber-300 hover:shadow-md"
                >
                  <p className="text-3xl font-extrabold text-slate-900">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-slate-200 pl-5">
              <p className="text-base leading-relaxed text-slate-600">
                We produce custom neck gaiters for outdoor brands, sports teams,
                and promotional campaigns worldwide. Our full OEM/ODM solution
                covers fabric sourcing, sublimation printing, cutting, sewing,
                and global logistics.
              </p>
            </div>

            <Link
              href="/about-us"
              className="mt-6 inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Learn More About Our Factory
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={resolveImageSrc("YOUR_NECKGAITER_OVERVIEW_IMAGE_URL")}
                alt="Suhu Custom neck gaiter factory overview"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -right-3 top-8 rounded-2xl bg-white px-5 py-3 shadow-lg ring-1 ring-slate-100 sm:-right-6">
              <p className="text-xl font-extrabold text-slate-900">180+</p>
              <p className="text-xs text-slate-500">Countries Covered</p>
            </div>
            <div className="absolute -left-3 bottom-12 rounded-2xl bg-white px-5 py-3 shadow-lg ring-1 ring-slate-100 sm:-left-6">
              <p className="text-xl font-extrabold text-slate-900">10,000+</p>
              <p className="text-xs text-slate-500">Clients Worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
