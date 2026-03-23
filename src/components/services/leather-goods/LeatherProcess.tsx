const steps = [
  {
    step: "01",
    title: "Design & Prototyping",
    description:
      "Our designers create detailed tech packs and produce a handmade prototype for your approval (5–7 days).",
    image: "YOUR_LEATHER_PROCESS_DESIGN_IMAGE_URL",
  },
  {
    step: "02",
    title: "Leather Selection",
    description:
      "Premium hides are hand-selected, graded for quality, and matched to your specified color and texture.",
    image: "YOUR_LEATHER_PROCESS_SELECT_IMAGE_URL",
  },
  {
    step: "03",
    title: "Precision Cutting",
    description:
      "Die-cutting or hand-cutting ensures each piece is accurately shaped with minimal waste.",
    image: "YOUR_LEATHER_PROCESS_CUTTING_IMAGE_URL",
  },
  {
    step: "04",
    title: "Stitching & Assembly",
    description:
      "Master artisans hand-stitch or machine-stitch each component, install hardware, and assemble the final product.",
    image: "YOUR_LEATHER_PROCESS_STITCHING_IMAGE_URL",
  },
  {
    step: "05",
    title: "Edge Finishing & QC",
    description:
      "Edges are burnished and dyed, surfaces conditioned, and each piece inspected for flawless quality.",
    image: "YOUR_LEATHER_PROCESS_QC_IMAGE_URL",
  },
  {
    step: "06",
    title: "Packaging & Shipping",
    description:
      "Dust-bagged, gift-boxed, and carefully packed for worldwide delivery via air or sea.",
    image: "YOUR_LEATHER_PROCESS_SHIPPING_IMAGE_URL",
  },
];

export default function LeatherProcess() {
  return (
    <div className="bg-slate-900 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Production Process
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            From Concept to Delivery
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            A meticulous, 6-step workflow that ensures luxury quality at every stage
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur transition hover:border-amber-500/50 hover:bg-slate-800"
            >
              <div className="relative h-48 overflow-hidden bg-slate-700">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white shadow-lg">
                  {s.step}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
