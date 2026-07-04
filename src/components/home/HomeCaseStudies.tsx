"use client";

import Link from "next/link";
import { EditableImage, EditableText } from "@/components/cms";
import { useCMS } from "@/contexts/CMSContext";

type CaseStudy = {
  id: string;
  title: string;
  category: string;
  cover: string;
  requirement: string;
  highlights: string[];
  result: string;
};

const DEFAULT_CASES: CaseStudy[] = [
  {
    id: "activewear",
    title: "US Sports Brand – Performance Activewear Capsule",
    category: "Tops & Activewear",
    cover: "/generated/home/case-activewear.png",
    requirement: "OEM Activewear for US sports brand | MOQ 500 pcs / style",
    highlights: [
      "Custom sublimation print",
      "Moisture‑wicking recycled fabric",
      "15‑day repeat delivery",
    ],
    result: "Sell‑through rate 82% in first 8 weeks, extended to 3rd season.",
  },
  {
    id: "underwear",
    title: "European DTC Label – Seamless Underwear Collection",
    category: "Bottoms & Underwear",
    cover: "/generated/home/case-underwear.png",
    requirement: "ODM underwear line with branded waistband | MOQ 300 pcs / colour",
    highlights: [
      "Soft touch micro‑modal",
      "Custom jacquard elastic",
      "Color‑matched packaging",
    ],
    result: "Return rate under 2%, average review score 4.8 / 5.",
  },
  {
    id: "streetwear",
    title: "UK Streetwear Brand – Heavyweight Hoodie Program",
    category: "Accessories & Outerwear",
    cover: "/generated/home/case-hoodies.png",
    requirement: "Oversized hoodies with puff print logo | MOQ 800 pcs total",
    highlights: [
      "460gsm brushed fleece",
      "Puff & 3D embroidery logo",
      "Bulk produced within 25 days",
    ],
    result: "First drop sold out in 48 hours; reordered 2x within the season.",
  },
  {
    id: "uniforms",
    title: "Global Franchise – Staff Uniform & Kids Merch",
    category: "Uniforms & Kids",
    cover: "/generated/home/case-uniforms.png",
    requirement: "Uniform polos and kids T‑shirts for 50+ stores worldwide",
    highlights: [
      "Color‑fastness tested to EU standard",
      "Size grading for EU & US markets",
      "Consolidated multi‑country shipping",
    ],
    result: "On‑brand, consistent look across all markets with simplified re‑ordering.",
  },
];

export default function HomeCaseStudies() {
  const { getDisplayValue } = useCMS();
  const cases = getDisplayValue<CaseStudy[]>("caseStudies.cases", DEFAULT_CASES);

  return (
    <div className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center sm:gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            <EditableText path="caseStudies.eyebrow" value="Case Studies" />
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText
              path="caseStudies.title"
              value="Case Studies | Our Successful Projects"
            />
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            <EditableText
              path="caseStudies.subtitle"
              value="Real projects showing how we support brands from idea to finished product across different apparel categories."
            />
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cases.map((item, index) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden">
                <EditableImage
                  path={`caseStudies.cases[${index}].cover`}
                  src={DEFAULT_CASES[index]?.cover ?? item.cover}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      <EditableText
                        path={`caseStudies.cases[${index}].category`}
                        value={DEFAULT_CASES[index]?.category ?? item.category}
                      />
                    </p>
                    <h3 className="mt-1 text-sm font-semibold sm:text-base">
                      <EditableText
                        path={`caseStudies.cases[${index}].title`}
                        value={DEFAULT_CASES[index]?.title ?? item.title}
                      />
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5 text-sm text-slate-700 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <EditableText path="caseStudies.clientBriefLabel" value="Client brief" />
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    <EditableText
                      path={`caseStudies.cases[${index}].requirement`}
                      value={DEFAULT_CASES[index]?.requirement ?? item.requirement}
                    />
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <EditableText path="caseStudies.highlightsLabel" value="Key highlights" />
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {(DEFAULT_CASES[index]?.highlights ?? item.highlights).map((_, hi) => (
                      <li key={hi}>
                        <EditableText
                          path={`caseStudies.cases[${index}].highlights[${hi}]`}
                          value={
                            DEFAULT_CASES[index]?.highlights[hi] ?? item.highlights[hi] ?? ""
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <EditableText path="caseStudies.outcomeLabel" value="Outcome" />
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    <EditableText
                      path={`caseStudies.cases[${index}].result`}
                      value={DEFAULT_CASES[index]?.result ?? item.result}
                    />
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <Link
                    href="/company/case-studies"
                    className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                  >
                    <EditableText path="caseStudies.viewDetails" value="View Details" />
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <p className="text-[11px] text-slate-500">
                    <EditableText
                      path="caseStudies.footerNote"
                      value="Fits your category? We can create a similar project."
                    />
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
