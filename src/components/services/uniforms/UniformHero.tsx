import { resolveImageSrc } from "@/lib/imageFallback";
import { QuoteButton } from "@/components/contact/QuoteButton";
import Link from "next/link";

export default function UniformHero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <div className="grid h-full w-full grid-cols-2">
          <img
            src={resolveImageSrc("YOUR_UNIFORM_HERO_MODEL_IMAGE_URL")}
            alt="Custom branded professional uniforms on models"
            className="h-full w-full object-cover opacity-70"
          />
          <img
            src={resolveImageSrc("YOUR_UNIFORM_HERO_STITCHING_FABRIC_LOGO_IMAGE_URL")}
            alt="Reinforced stitching, wrinkle-resistant fabric and custom logo details close-up"
            className="h-full w-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/30 to-slate-900/45" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="pt-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/services" className="hover:text-amber-400 transition">
            Core Categories
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white">Uniforms</span>
        </nav>

        <div className="flex min-h-[55vh] flex-col items-center justify-center py-16 text-center lg:py-24">
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Custom <span className="text-amber-400">Uniforms Manufacturing</span>{" "}
            - OEM/ODM for Global Businesses &amp; Organizations
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Durable, Professional, Wrinkle-Resistant Uniforms with Flexible MOQ
            and Custom Branding for Teams and Businesses
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <QuoteButton
              title="Get a Free Quote"
              productCategory="Uniforms"
              className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              Get a Free Quote
            </QuoteButton>
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
