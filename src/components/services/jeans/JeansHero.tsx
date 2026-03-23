import Link from "next/link";

export default function JeansHero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
          <img
            src="YOUR_JEANS_HERO_MODEL_IMAGE_URL"
            alt="Custom-fit denim jeans on a model"
            className="h-full w-full object-cover opacity-45"
          />
          <img
            src="YOUR_JEANS_HERO_STITCHING_IMAGE_URL"
            alt="Close-up of reinforced stitching, hardware, and denim texture"
            className="hidden h-full w-full object-cover opacity-45 lg:block"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/65 to-slate-900/85" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="pt-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-amber-400">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/services" className="transition hover:text-amber-400">
            Core Categories
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white">Jeans &amp; Denim</span>
        </nav>

        <div className="flex min-h-[55vh] flex-col items-center justify-center py-16 text-center lg:py-24">
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Custom Jeans &amp; Denim Manufacturing - OEM/ODM for Global Brands
            &amp; Retailers
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Premium Denim Selection, Durable Construction, Custom Wash Finishes,
            and Flexible MOQ for Your Brand&apos;s Denim Collection
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-amber-400 hover:text-amber-300"
            >
              Request a Sample
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
