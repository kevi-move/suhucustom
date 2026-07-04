import CaseStudyImage from "@/components/services/CaseStudyImage";

const results = [
  { label: "Units Delivered", value: "10,000+" },
  { label: "Re-order Volume", value: "25,000+" },
  { label: "Return Rate", value: "Under 2%" },
  { label: "Delivery", value: "On Time" },
];

export default function UnderwearCaseStudy() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Case Study
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Real Results, Real Clients
          </h2>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
          <div className="grid items-stretch lg:grid-cols-5">
            <CaseStudyImage />


            <div className="p-8 lg:col-span-3 lg:p-12">
              <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                US DTC Intimates Brand
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Custom Everyday Essentials Collection
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Challenge
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Need 10,000 pieces of seamless underwear and bralettes in 12
                    colorways with custom waistband branding, within a 18-day
                    lead time.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Solution
                  </p>
                  <ul className="mt-1 space-y-1.5 text-sm leading-relaxed text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Selected premium nylon/spandex seamless knit for
                      buttery-soft hand-feel
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Laser-cut edges and bonded seams for zero-irritation
                      comfort
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Custom woven waistband with brand logo and individual
                      tissue-wrapped packaging
                    </li>
                  </ul>
                </div>
              </div>

              <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 text-sm italic text-slate-500">
                &ldquo;The fit and quality exceeded our expectations — our return
                rate dropped 40% compared to our previous supplier.&rdquo;
              </blockquote>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {results.map((r) => (
                  <div key={r.label} className="text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {r.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{r.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
