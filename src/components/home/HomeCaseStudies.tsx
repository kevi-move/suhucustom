import Link from "next/link";

const cases = [
  {
    id: "activewear",
    title: "US Sports Brand – Performance Activewear Capsule",
    category: "Tops & Activewear",
    cover: "CASE_IMAGE_ACTIVEWEAR_URL",
    requirement: "OEM Activewear for US sports brand | MOQ 500 pcs / style",
    highlights: ["Custom sublimation print", "Moisture‑wicking recycled fabric", "15‑day repeat delivery"],
    result: "Sell‑through rate 82% in first 8 weeks, extended to 3rd season.",
  },
  {
    id: "underwear",
    title: "European DTC Label – Seamless Underwear Collection",
    category: "Bottoms & Underwear",
    cover: "CASE_IMAGE_UNDERWEAR_URL",
    requirement: "ODM underwear line with branded waistband | MOQ 300 pcs / colour",
    highlights: ["Soft touch micro‑modal", "Custom jacquard elastic", "Color‑matched packaging"],
    result: "Return rate under 2%, average review score 4.8 / 5.",
  },
  {
    id: "streetwear",
    title: "UK Streetwear Brand – Heavyweight Hoodie Program",
    category: "Accessories & Outerwear",
    cover: "CASE_IMAGE_HOODIES_URL",
    requirement: "Oversized hoodies with puff print logo | MOQ 800 pcs total",
    highlights: ["460gsm brushed fleece", "Puff & 3D embroidery logo", "Bulk produced within 25 days"],
    result: "First drop sold out in 48 hours; reordered 2x within the season.",
  },
  {
    id: "uniforms",
    title: "Global Franchise – Staff Uniform & Kids Merch",
    category: "Uniforms & Kids",
    cover: "CASE_IMAGE_UNIFORMS_URL",
    requirement: "Uniform polos and kids T‑shirts for 50+ stores worldwide",
    highlights: ["Color‑fastness tested to EU standard", "Size grading for EU & US markets", "Consolidated multi‑country shipping"],
    result: "On‑brand, consistent look across all markets with simplified re‑ordering.",
  },
];

export default function HomeCaseStudies() {
  return (
    <div className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center sm:gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            Case Studies
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Case Studies | Our Successful Projects
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            Real projects showing how we support brands from idea to finished product across different apparel
            categories.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cases.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden">
                {/* 案例封面占位图，替换 src 即可 */}
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      {item.category}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold sm:text-base">{item.title}</h3>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5 text-sm text-slate-700 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Client brief
                  </p>
                  <p className="mt-1 text-sm text-slate-800">{item.requirement}</p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Key highlights
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Outcome
                  </p>
                  <p className="mt-1 text-sm text-slate-800">{item.result}</p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <Link
                    href="/company/case-studies"
                    className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                  >
                    View Details
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <p className="text-[11px] text-slate-500">Fits your category? We can create a similar project.</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

