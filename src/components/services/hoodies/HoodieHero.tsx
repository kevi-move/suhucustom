import Link from "next/link";

export default function HoodieHero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src="YOUR_HOODIE_HERO_IMAGE_URL"
          alt="Custom hoodie and sweatshirt manufacturing"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="pt-8 text-sm text-slate-400">
          <Link href="/services" className="hover:text-amber-400 transition">
            Services
          </Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="hover:text-amber-400 transition">
            Tops &amp; Activewear
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Hoodies &amp; Sweatshirts</span>
        </nav>

        <div className="flex min-h-[55vh] flex-col items-center justify-center py-16 text-center lg:py-24">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Custom{" "}
            <span className="text-amber-400">Hoodies &amp; Sweatshirts</span>{" "}
            Manufacturing – OEM/ODM for Global Brands &amp; Retailers
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Heavyweight Fleece, Reinforced Seams, and Flexible MOQ for Your
            Brand&apos;s Cozy Staple
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
