import CaseStudyImage from "@/components/services/CaseStudyImage";
const results = [
  { label: "Units Delivered", value: "8,000" },
  { label: "Re-order Volume", value: "11,000+" },
  { label: "Quality Issues", value: "Zero" },
  { label: "Delivery", value: "1 Day Early" },
];

export default function JeansCaseStudy() {
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
                US Streetwear &amp; Fashion Brand
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Seasonal Denim Collection
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Challenge
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Need 8,000 pieces of custom vintage stone-wash straight-leg
                    jeans and lightweight denim jackets, with branded leather
                    patches and hardware, in a 19-day launch window.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Solution
                  </p>
                  <ul className="mt-1 space-y-1.5 text-sm leading-relaxed text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Recommended 10oz medium-weight stretch denim for all-day
                      comfort and shape retention
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Applied vintage stone wash, branded waist leather patches,
                      and custom metal buttons
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Completed sample approval in 4 days with strict QC
                      checkpoints through production
                    </li>
                  </ul>
                </div>
              </div>

              <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 text-sm italic text-slate-500">
                &ldquo;Premium denim feel, consistent stitching and on-brand
                finishing stood out. We re-ordered 11,000+ pieces for our next
                seasonal drop.&rdquo;
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
