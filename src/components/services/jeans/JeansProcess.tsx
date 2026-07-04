import { resolveImageSrc } from "@/lib/imageFallback";
const steps = [
  {
    step: "01",
    title: "Design & Sampling",
    description:
      "We refine your tech pack, denim style and wash requirements, then produce a pre-production sample for approval within 3-5 days.",
    image: "/generated/services/jeans-denim/custom-jeans-design-tech-pack-denim-swatches-patterns.png",
  },
  {
    step: "02",
    title: "Fabric Cutting",
    description:
      "Automated precision cutting with pre-shrinkage testing ensures consistent sizing and minimal fabric waste.",
    image: "/generated/services/jeans-denim/custom-jeans-fabric-sourcing-lab-dips-selvedge-samples.png",
  },
  {
    step: "03",
    title: "Sewing & Hardware",
    description:
      "Skilled tailors complete heavy-duty stitching, rivet/button installation and pocket construction with industrial-grade machinery.",
    image: "/generated/services/jeans-denim/custom-jeans-cutting-sewing-chain-stitch-production.png",
  },
  {
    step: "04",
    title: "Wash & Finishing Treatment",
    description:
      "Professional custom washing, distressing and finishing are applied per your brand specs, with color consistency testing.",
    image: "/generated/services/jeans-denim/custom-jeans-washing-finishing-industrial-denim-process.png",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "Every piece is checked for stitching strength, hardware stability, sizing accuracy, wash effect and overall defects.",
    image: "/generated/services/jeans-denim/custom-jeans-quality-inspection-qc-measurement-hardware.png",
  },
  {
    step: "06",
    title: "Packaging & Shipping",
    description:
      "Final folding, labeling and packaging with consolidated sea/air freight delivery to your US/EU warehouse.",
    image: "/generated/services/jeans-denim/custom-jeans-packaging-shipping-export-cartons.png",
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
            A transparent, 6-step workflow tailored for custom denim production
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
                  src={resolveImageSrc(s.image)}
                  alt={s.title}
                  className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white shadow-lg">
                  {s.step}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
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
