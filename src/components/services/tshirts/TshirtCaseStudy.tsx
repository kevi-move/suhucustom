const results = [
  { label: "Units Delivered", value: "5,000+" },
  { label: "Re-order Volume", value: "10,000+" },
  { label: "Quality Issues", value: "Zero" },
  { label: "Delivery", value: "2 Days Early" },
];

export default function TshirtCaseStudy() {
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
          <div className="grid lg:grid-cols-5">
            {/* Left: image placeholder */}
            <div className="relative flex items-center justify-center bg-slate-100 lg:col-span-2">
              <div className="flex h-full min-h-[280px] w-full items-center justify-center p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100">
                    <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    Project photo placeholder
                  </p>
                </div>
              </div>
            </div>

            {/* Right: content */}
            <div className="p-8 lg:col-span-3 lg:p-12">
              <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                US Fitness Brand
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Custom Performance Gym Wear Line
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Challenge
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Need 5,000 custom performance tees with moisture-wicking
                    fabric and brand embroidery, within a 20-day lead time.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Solution
                  </p>
                  <ul className="mt-1 space-y-1.5 text-sm leading-relaxed text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Recommended 90% Poly / 10% Spandex blend for
                      breathability and stretch
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Applied 3D chest embroidery and custom neck labels
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      Delivered full order 2 days ahead of schedule, with 0
                      quality issues reported
                    </li>
                  </ul>
                </div>
              </div>

              <blockquote className="mt-6 border-l-2 border-amber-400 pl-4 text-sm italic text-slate-500">
                &ldquo;Consistent quality and reliable delivery — we re-ordered
                10,000+ pieces for our next collection.&rdquo;
              </blockquote>

              {/* Result stats */}
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
