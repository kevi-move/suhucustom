import Link from "next/link";

export default function HomeHero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* 背景大图占位，替换 src 即可 */}
      <div className="absolute inset-0">
        <img
          src="YOUR_HERO_IMAGE_URL"
          alt="Suhu Custom apparel manufacturing"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-20 text-left text-white sm:px-6 lg:flex-row lg:items-center lg:py-28 lg:px-8">
        <div className="max-w-xl lg:mr-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Custom Apparel Manufacturing
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Reliable <span className="text-amber-300">garment factory</span> for global brands & startups
          </h1>
          <p className="mt-4 text-base text-slate-100 sm:text-lg">
            From design development to bulk production, Suhu Custom helps you turn ideas into high‑quality collections –
            with flexible MOQ, stable lead time and factory‑direct pricing.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-7 py-3 text-sm font-medium text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
            >
              Get an Instant Quote
            </Link>
            <Link
              href="/services/t-shirts"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:text-amber-200"
            >
              View Manufacturing Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

