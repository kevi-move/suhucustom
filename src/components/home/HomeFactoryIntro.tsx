"use client";

import Link from "next/link";
import { EditableImage, EditableText } from "@/components/cms";

export default function HomeFactoryIntro() {
  return (
    <div className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-sm sm:aspect-[3/2]">
          <EditableImage
            path="factoryIntro.image"
            src="/generated/home/factory-intro.png"
            alt="Suhu Custom garment factory floor"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-900/10 via-transparent to-slate-900/10" />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 text-xs text-slate-800 shadow-lg sm:text-sm">
            <p className="font-semibold">
              <EditableText
                path="factoryIntro.overlayTitle"
                value="Your Reliable Apparel Manufacturing Partner"
              />
            </p>
            <p className="mt-1 text-slate-600">
              <EditableText
                path="factoryIntro.overlaySubtitle"
                value="In‑house sampling, cutting, sewing & QC for stable quality."
              />
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            <EditableText path="factoryIntro.eyebrow" value="About Our Factory" />
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText
              path="factoryIntro.title"
              value="Apparel factory built for brands that care about quality, lead time and communication."
            />
          </h2>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            <EditableText
              path="factoryIntro.body"
              value="Based in China, Suhu Custom focuses on export‑oriented garment manufacturing for Europe and North America. We speak the same language as your buying team – clear specs, transparent costs and predictable timelines."
            />
          </p>

          <dl className="mt-6 grid gap-4 text-sm text-slate-800 sm:grid-cols-2">
            {[
              { label: "stat1Label", value: "stat1Value", detail: "stat1Detail" },
              { label: "stat2Label", value: "stat2Value", detail: "stat2Detail" },
              { label: "stat3Label", value: "stat3Value", detail: "stat3Detail" },
              { label: "stat4Label", value: "stat4Value", detail: "stat4Detail" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <EditableText
                    path={`factoryIntro.${stat.label}`}
                    value={
                      stat.label === "stat1Label"
                        ? "Production Capacity"
                        : stat.label === "stat2Label"
                          ? "Product Coverage"
                          : stat.label === "stat3Label"
                            ? "Quality & Compliance"
                            : "Service Model"
                    }
                  />
                </dt>
                <dd className="mt-2 text-lg font-semibold text-slate-900">
                  <EditableText
                    path={`factoryIntro.${stat.value}`}
                    value={
                      stat.value === "stat1Value"
                        ? "80,000+ pcs / month"
                        : stat.value === "stat2Value"
                          ? "4 major categories"
                          : stat.value === "stat3Value"
                            ? "Export‑grade QC"
                            : "OEM / ODM support"
                    }
                  />
                </dd>
                <p className="mt-1 text-xs text-slate-600">
                  <EditableText
                    path={`factoryIntro.${stat.detail}`}
                    value={
                      stat.detail === "stat1Detail"
                        ? "Flexible lines for knitwear, activewear & fashion basics."
                        : stat.detail === "stat2Detail"
                          ? "Tops, bottoms, underwear, accessories & uniforms."
                          : stat.detail === "stat3Detail"
                            ? "Inline inspection, final AQL check & full traceability."
                            : "Tech pack development, fabric sourcing & branding."
                    }
                  />
                </p>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <Link
              href="/about-us"
              className="inline-flex items-center rounded-full bg-amber-500 px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
            >
              <EditableText path="factoryIntro.ctaText" value="Learn More About Our Factory" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
