import Link from "next/link";

const stats = [
  { value: "100 PCS", label: "MOQ (small-batch friendly)" },
  { value: "15-20 Days", label: "Lead Time (sample + production)" },
  { value: "Certified", label: "OEKO-TEX Standard 100, BSCI" },
  { value: "4+ Options", label: "Denim Fabric Choices" },
];

const fabrics = [
  "Raw Denim",
  "Stretch Denim",
  "Heavyweight Twill Denim",
  "Recycled Denim",
];

export default function JeansOverview() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Custom Jeans &amp; Denim Production for Global Brands
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition hover:border-amber-300 hover:shadow-md"
                >
                  <p className="text-2xl font-extrabold text-slate-900">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-slate-200 pl-5">
              <p className="text-base leading-relaxed text-slate-600">
                We specialize in custom jeans and denim apparel production for
                global fashion brands, streetwear labels, DTC retailers, and
                wholesale clients. From classic straight-leg jeans and skinny
                fits to denim jackets, shorts and distressed styles, our
                full-service OEM/ODM solution covers design, sampling, mass
                production, custom washing treatments and global shipping-built
                for premium quality, long-lasting durability and on-trend denim
                styles.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {fabrics.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200/60"
                >
                  {f}
                </span>
              ))}
            </div>

            <Link
              href="/about-us"
              className="mt-6 inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Learn More About Our Factory
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="YOUR_JEANS_OVERVIEW_IMAGE_URL"
                alt="Suhu Custom jeans and denim manufacturing overview"
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
