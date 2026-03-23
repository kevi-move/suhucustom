import Link from "next/link";

export default function GymHero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src="YOUR_GYM_HERO_IMAGE_URL"
          alt="Custom gym and sportswear manufacturing"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="pt-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-amber-400">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="transition hover:text-amber-400">
            Core Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Gym &amp; Sportswear</span>
        </nav>

        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            OEM / ODM Custom Manufacturing
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Custom <span className="text-amber-400">Gym &amp; Sportswear</span>{" "}
            Manufacturing – OEM/ODM for Global Fitness Brands &amp; Gyms
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            High-Performance, Durable, and Sweat-Resistant Gym Wear with
            Flexible MOQ for Your Fitness Brand
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
