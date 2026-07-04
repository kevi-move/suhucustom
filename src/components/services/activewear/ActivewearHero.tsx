import { resolveImageSrc } from "@/lib/imageFallback";
import { QuoteButton } from "@/components/contact/QuoteButton";
import Link from "next/link";
import { SITE_WHATSAPP_URL } from "@/lib/siteContact";


export default function ActivewearHero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src={resolveImageSrc("/generated/services/activewear-athleisure/custom-activewear-athleisure-manufacturing-hero-small-workshop.png")}
          alt="Custom activewear and athleisure manufacturing"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-900/35 to-slate-900/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="pt-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="hover:text-amber-400 transition">
            Core Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Activewear &amp; Athleisure</span>
        </nav>

        <div className="flex min-h-[55vh] flex-col justify-center py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            OEM / ODM Custom Manufacturing
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Custom <span className="text-amber-400">Activewear &amp; Athleisure</span>{" "}
            Manufacturing
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Moisture-Wicking Performance, 4-Way Stretch, and Flexible MOQ for
            Your Brand&apos;s Athletic Staple
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <QuoteButton
              title="Get a Free Quote"
              productCategory="Activewear & Athleisure"
              className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              Get a Free Quote
            </QuoteButton>
            <Link href={SITE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
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
