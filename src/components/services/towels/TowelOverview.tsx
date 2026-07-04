import { resolveImageSrc } from "@/lib/imageFallback";
import Link from "next/link";

const stats = [
  { value: "300,000+", label: "Towels Produced / Month" },
  { value: "20+", label: "Jacquard & Dobby Looms" },
  { value: "180+", label: "Skilled Workers" },
  { value: "10,000+ ㎡", label: "Factory Area" },
];

export default function TowelOverview() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Trusted Custom Towel Manufacturer
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
                We manufacture custom towels for hotels, resorts, spas, sports
                brands, and retail lines worldwide. From Egyptian cotton bath
                towels to sublimation-printed beach towels, our full OEM/ODM
                solution covers weaving, dyeing, finishing, and global shipping.
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
                src={resolveImageSrc("/generated/services/towels/suhucustom-towel-sample-room-overview-oem-odm.png")}
                alt="Suhu Custom towel factory overview"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -right-3 top-8 rounded-2xl bg-white px-5 py-3 shadow-lg ring-1 ring-slate-100 sm:-right-6">
              <p className="text-xl font-extrabold text-slate-900">120+</p>
              <p className="text-xs text-slate-500">Countries Shipped</p>
            </div>
            <div className="absolute -left-3 bottom-12 rounded-2xl bg-white px-5 py-3 shadow-lg ring-1 ring-slate-100 sm:-left-6">
              <p className="text-xl font-extrabold text-slate-900">5,000+</p>
              <p className="text-xs text-slate-500">Hotel &amp; Brand Partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
