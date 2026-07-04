import { QuoteButton } from "@/components/contact/QuoteButton";

interface ServiceQuoteCTAProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  buttonText?: string;
  footnote?: string;
  productCategory?: string;
}

export default function ServiceQuoteCTA({
  badge = "Free Sample Available",
  title,
  titleHighlight,
  subtitle,
  buttonText = "Get a Free Quote",
  footnote = "MOQ as low as 100 PCS · Sample ready in 3–5 days · OEKO-TEX certified",
  productCategory,
}: ServiceQuoteCTAProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
          {badge}
        </div>

        <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {title}
          {titleHighlight ? (
            <>
              {" "}
              <span className="text-amber-400">{titleHighlight}</span>?
            </>
          ) : null}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">{subtitle}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <QuoteButton
            productCategory={productCategory}
            title={buttonText}
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-10 py-4 text-base font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 sm:w-auto"
          >
            {buttonText}
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </QuoteButton>
        </div>

        <p className="mt-6 text-sm text-slate-500">{footnote}</p>
      </div>
    </div>
  );
}
