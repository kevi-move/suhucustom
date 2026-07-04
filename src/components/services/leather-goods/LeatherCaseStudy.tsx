import CaseStudyImage from "@/components/services/CaseStudyImage";
const results = [
  { label: "Units Delivered", value: "3,000+" },
  { label: "Re-order Volume", value: "8,000+" },
  { label: "Defect Rate", value: "< 0.1%" },
  { label: "Delivery", value: "On Time" },
];

export default function LeatherCaseStudy() {
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
                UK Luxury Fashion Label
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Premium Leather Wallet &amp; Card Holder Collection
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Challenge
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Required 3,000 full-grain leather wallets and card holders
                    with gold foil embossing, RFID-blocking lining, and luxury
                    gift box packaging within a 25-day lead time.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Solution
                  </p>
                  <ul className="mt-1 space-y-1.5 text-sm leading-relaxed text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Sourced Italian full-grain vegetable-tanned leather with
                      natural patina aging
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Integrated RFID-blocking aluminum layer and custom gold
                      foil branding
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Delivered on schedule with &lt; 0.1% defect rate across the
                      entire run
                    </li>
                  </ul>
                </div>
              </div>

              <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 text-sm italic text-slate-500">
                &ldquo;The leather quality and craftsmanship rivaled our
                European suppliers at a fraction of the cost. Outstanding
                work.&rdquo;
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
