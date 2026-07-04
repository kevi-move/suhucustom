import CaseStudyImage from "@/components/services/CaseStudyImage";

const results = [
  { label: "Units Delivered", value: "5,000+" },
  { label: "Re-order Volume", value: "12,000+" },
  { label: "Quality Issues", value: "Zero" },
  { label: "Delivery", value: "3 Days Early" },
];

export default function SwimwearCaseStudy() {
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
                Australian Resort Brand
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Custom Resort Swimwear Collection
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Challenge
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Need 5,000 bikinis and one-pieces in 8 tropical prints with
                    recycled fabric, UPF 50+ protection, and branded packaging
                    within 20 days.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Solution
                  </p>
                  <ul className="mt-1 space-y-1.5 text-sm leading-relaxed text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Selected recycled nylon (ECONYL®) with UPF 50+
                      certification for eco-conscious branding
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Full sublimation printing with vibrant tropical designs —
                      zero fading after 100+ washes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Custom removable cups, adjustable straps, and branded
                      beach pouch packaging
                    </li>
                  </ul>
                </div>
              </div>

              <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 text-sm italic text-slate-500">
                &ldquo;The print quality and fabric feel are incredible — our
                customers love the sustainable story and the swimwear practically
                sells itself.&rdquo;
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
