const steps = [
  {
    step: "01",
    title: "Design & Tech Pack",
    description:
      "We refine your design, develop patterns, and create a tech pack with full specs for your approval.",
    image: "YOUR_JEANS_PROCESS_DESIGN_IMAGE_URL",
  },
  {
    step: "02",
    title: "Fabric Sourcing",
    description:
      "Premium denim selection from trusted mills, with lab dips and hand-feel swatches for your review.",
    image: "YOUR_JEANS_PROCESS_FABRIC_IMAGE_URL",
  },
  {
    step: "03",
    title: "Cutting & Sewing",
    description:
      "Precision laser cutting and expert sewing with chain-stitch, bar-tack, and felled seam construction.",
    image: "YOUR_JEANS_PROCESS_SEWING_IMAGE_URL",
  },
  {
    step: "04",
    title: "Washing & Finishing",
    description:
      "Industrial washing, distressing, and finishing treatments to achieve your desired look and hand-feel.",
    image: "YOUR_JEANS_PROCESS_WASHING_IMAGE_URL",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "Every pair inspected for stitching, wash consistency, hardware, and measurements before approval.",
    image: "YOUR_JEANS_PROCESS_QC_IMAGE_URL",
  },
  {
    step: "06",
    title: "Packaging & Shipping",
    description:
      "Custom packaging, labeling, and consolidation for sea/air freight to your global warehouse.",
    image: "YOUR_JEANS_PROCESS_SHIPPING_IMAGE_URL",
  },
];

export default function JeansProcess() {
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
            A transparent, 6-step workflow that ensures quality at every stage
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
