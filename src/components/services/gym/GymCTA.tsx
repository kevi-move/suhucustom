import Link from "next/link";

export default function GymCTA() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
          Free Sample Available
        </div>

        <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Ready to Create Your{" "}
          <span className="text-amber-400">Custom Gym &amp; Sportswear</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Get a free quote and sample in 3 days — no obligation to order, with
          performance fabric testing included.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact-us"
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-10 py-4 text-base font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 sm:w-auto"
          >
            Get a Free Quote
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a
            href="https://wa.me/YOUR_PHONE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-10 py-4 text-base font-semibold text-white transition hover:border-amber-400 hover:text-amber-300 sm:w-auto"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.56 4.143 1.54 5.885L0 24l6.305-1.654A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.93 0-3.72-.564-5.227-1.536l-.375-.224-3.888 1.02 1.037-3.79-.246-.39A9.716 9.716 0 012.25 12 9.75 9.75 0 0112 2.25 9.75 9.75 0 0121.75 12 9.75 9.75 0 0112 21.75z" />
            </svg>
            Chat with Our Expert
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          MOQ as low as 100 PCS · Sample ready in 3–5 days · OEKO-TEX &amp;
          BSCI certified
        </p>
      </div>
    </div>
  );
}
