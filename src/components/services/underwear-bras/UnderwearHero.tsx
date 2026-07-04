import { resolveImageSrc } from "@/lib/imageFallback";
import { QuoteButton } from "@/components/contact/QuoteButton";
import Link from "next/link";
import { SITE_WHATSAPP_URL } from "@/lib/siteContact";


export default function UnderwearHero() {
  return (
    <div className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src={resolveImageSrc("YOUR_UNDERWEAR_HERO_IMAGE_URL")}
          alt="Custom underwear and bras manufacturing"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/30 to-slate-900/45" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            OEM / ODM Custom Manufacturing
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Custom <span className="text-amber-400">Underwear &amp; Bras</span>{" "}
            Manufacturing
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            From everyday essentials to luxury intimates — full-service design,
            prototyping, mass production, and fulfillment for intimate apparel
            brands worldwide.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <QuoteButton
              title="Get a Free Quote"
              productCategory="Underwear & Bras"
              className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              Get a Free Quote
            </QuoteButton>
            <Link href={SITE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-amber-400 hover:text-amber-300"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.56 4.143 1.54 5.885L0 24l6.305-1.654A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.93 0-3.72-.564-5.227-1.536l-.375-.224-3.888 1.02 1.037-3.79-.246-.39A9.716 9.716 0 012.25 12 9.75 9.75 0 0112 2.25 9.75 9.75 0 0121.75 12 9.75 9.75 0 0112 21.75z" />
              </svg>
              Chat with Expert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
