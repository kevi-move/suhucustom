const steps = [
  {
    step: "01",
    title: "Design & Sampling",
    description:
      "We refine your artwork/tech pack and produce a pre-production sample for approval (3–5 days), including fabric stretch and sweat-wicking performance testing.",
    image: "YOUR_GYM_PROCESS_DESIGN_IMAGE_URL",
  },
  {
    step: "02",
    title: "Fabric Cutting",
    description:
      "Automated precision cutting ensures consistent sizing and minimal fabric waste, especially critical for compression and stretch gym fabrics.",
    image: "YOUR_GYM_PROCESS_CUTTING_IMAGE_URL",
  },
  {
    step: "03",
    title: "Sewing & Assembly",
    description:
      "Skilled seamstresses handle flatlock stitching (chafe-resistant), elastic waistband attachment, and mesh panel integration for optimal comfort.",
    image: "YOUR_GYM_PROCESS_SEWING_IMAGE_URL",
  },
  {
    step: "04",
    title: "Decoration Application",
    description:
      "Custom sublimation/print/embroidery applied per your design, with color matching and sweat-resistance testing.",
    image: "YOUR_GYM_PROCESS_DECORATION_IMAGE_URL",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "Every piece is checked for stitching integrity, fabric stretch, decoration alignment, and performance defects (e.g., sweat-wicking ability).",
    image: "YOUR_GYM_PROCESS_QC_IMAGE_URL",
  },
  {
    step: "06",
    title: "Packaging & Shipping",
    description:
      "Final packaging and consolidation for sea/air freight to your US/EU warehouse.",
    image: "YOUR_GYM_PROCESS_SHIPPING_IMAGE_URL",
  },
];

export default function GymProcess() {
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
