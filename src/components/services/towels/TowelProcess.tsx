import { resolveImageSrc } from "@/lib/imageFallback";
const steps = [
  {
    step: "01",
    title: "Design & Sampling",
    description:
      "We create your custom jacquard pattern or print design and produce a pre-production sample (5–7 days).",
    image: "/generated/services/towels/custom-towel-design-sampling-jacquard-swatches-color-cards.png",
  },
  {
    step: "02",
    title: "Yarn Preparation",
    description:
      "Premium cotton yarn is wound, warped, and sized for optimal weaving performance and softness.",
    image: "/generated/services/towels/custom-towel-yarn-preparation-cotton-warping-process.png",
  },
  {
    step: "03",
    title: "Weaving",
    description:
      "High-speed jacquard or dobby looms weave your design into plush, densely-packed terry fabric.",
    image: "/generated/services/towels/custom-towel-weaving-process-jacquard-terry-loom.png",
  },
  {
    step: "04",
    title: "Dyeing & Finishing",
    description:
      "Reactive dyeing for vibrant colors, followed by softening, tumble-drying, and shearing for a plush hand feel.",
    image: "/generated/services/towels/custom-towel-dyeing-finishing-softening-colorfast-process.png",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "Each batch is tested for absorbency, color fastness, weight, and dimensional stability.",
    image: "/generated/services/towels/custom-towel-quality-inspection-absorbency-gsm-measurement.png",
  },
  {
    step: "06",
    title: "Packaging & Shipping",
    description:
      "Folded, tagged, and bundled for container shipping to your hotel, warehouse, or retail partner.",
    image: "/generated/services/towels/custom-towel-packaging-shipping-small-batch-cartons.png",
  },
];

export default function TowelProcess() {
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
                  src={resolveImageSrc(s.image)}
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
