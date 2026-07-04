import { resolveImageSrc } from "@/lib/imageFallback";
import Link from "next/link";

const metrics = [
  { value: "100 PCS", label: "MOQ (Small-Batch Friendly)" },
  { value: "15–20 Days", label: "Lead Time (Sample + Production)" },
  { value: "OEKO-TEX", label: "Standard 100, BSCI Certified" },
  { value: "4+", label: "Performance Fabric Options" },
];

export default function ActivewearOverview() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Trusted Activewear &amp; Athleisure Partner
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {metrics.map((s) => (
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
                We specialize in custom activewear and athleisure production for
                global sports brands, fitness studios, DTC retailers, and
                athletic clients. From performance leggings to moisture-wicking
                tops, our full-service OEM/ODM solution covers design, sampling,
                mass production, and global shipping.
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
                src={resolveImageSrc("/generated/services/activewear-athleisure/suhucustom-activewear-athleisure-sample-room-overview-oem-odm.png")}
                alt="Activewear manufacturing facility overview"
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="absolute -right-3 top-8 rounded-2xl bg-white px-5 py-3 shadow-lg ring-1 ring-slate-100 sm:-right-6">
              <p className="text-xl font-extrabold text-slate-900">🌿</p>
              <p className="text-xs text-slate-500">OEKO-TEX & BSCI</p>
            </div>

            <div className="absolute -left-3 bottom-12 rounded-2xl bg-white px-5 py-3 shadow-lg ring-1 ring-slate-100 sm:-left-6">
              <p className="text-xl font-extrabold text-slate-900">🧵</p>
              <p className="text-xs text-slate-500">4-Way Stretch Fabrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
