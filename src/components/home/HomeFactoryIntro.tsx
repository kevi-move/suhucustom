import Link from "next/link";

export default function HomeFactoryIntro() {
  return (
    <div className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8 lg:min-h-[380px]">
        {/* 左侧工厂场景图占位 */}
        <div className="relative mb-10 h-72 overflow-hidden rounded-3xl bg-slate-200 shadow-sm sm:h-80 lg:mb-0 lg:h-full lg:min-h-[380px]">
          <img
            src="FACTORY_INTRO_IMAGE_URL"
            alt="Suhu Custom garment factory floor"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-slate-900/10" />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 text-xs text-slate-800 shadow-lg sm:text-sm">
            <p className="font-semibold">Your Reliable Apparel Manufacturing Partner</p>
            <p className="mt-1 text-slate-600">
              In‑house sampling, cutting, sewing & QC for stable quality.
            </p>
          </div>
        </div>

        {/* 右侧文字介绍 */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            About Our Factory
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Apparel factory built for brands that care about quality, lead time and communication.
          </h2>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Based in China, Suhu Custom focuses on export‑oriented garment manufacturing for Europe and North America.
            We speak the same language as your buying team – clear specs, transparent costs and predictable timelines.
          </p>

          <dl className="mt-6 grid gap-4 text-sm text-slate-800 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Production Capacity
              </dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900">
                80,000+ pcs / month
              </dd>
              <p className="mt-1 text-xs text-slate-600">
                Flexible lines for knitwear, activewear & fashion basics.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Product Coverage
              </dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900">
                4 major categories
              </dd>
              <p className="mt-1 text-xs text-slate-600">
                Tops, bottoms, underwear, accessories & uniforms.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quality & Compliance
              </dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900">
                Export‑grade QC
              </dd>
              <p className="mt-1 text-xs text-slate-600">
                Inline inspection, final AQL check & full traceability.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Service Model
              </dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900">
                OEM / ODM support
              </dd>
              <p className="mt-1 text-xs text-slate-600">
                Tech pack development, fabric sourcing & branding.
              </p>
            </div>
          </dl>

          <div className="mt-6">
            <Link
              href="/about-us"
              className="inline-flex items-center rounded-full bg-amber-500 px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
            >
              Learn More About Our Factory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

