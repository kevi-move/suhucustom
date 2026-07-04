import { resolveImageSrc } from "@/lib/imageFallback";
const steps = [
  {
    step: "01",
    title: "Design & Sampling",
    description:
      "We digitize your artwork into a knitting pattern and produce a sample for approval (3–5 days).",
    image: "/generated/services/socks/custom-sock-design-sampling-knitting-pattern-yarn-swatches.png",
  },
  {
    step: "02",
    title: "Yarn Preparation",
    description:
      "Selected yarns are lab-tested for color fastness, shrinkage, and pilling resistance before production.",
    image: "/generated/services/socks/custom-sock-yarn-preparation-small-factory.png",
  },
  {
    step: "03",
    title: "Knitting",
    description:
      "Computer-controlled knitting machines produce each sock with precise stitch counts and consistent tension.",
    image: "/generated/services/socks/custom-sock-knitting-process-computerized-machine.png",
  },
  {
    step: "04",
    title: "Toe Linking & Finishing",
    description:
      "Seamless toe-closing, shaping, and heat-setting ensure a smooth, comfortable fit.",
    image: "/generated/services/socks/custom-sock-toe-linking-finishing-small-workshop.png",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "Each pair is inspected for defects in knitting, color, sizing, and elasticity.",
    image: "/generated/services/socks/custom-sock-quality-inspection-qc-sizing-elasticity.png",
  },
  {
    step: "06",
    title: "Packaging & Shipping",
    description:
      "Pairs are paired, banded, tagged, and packed for sea or air freight to your warehouse.",
    image: "/generated/services/socks/custom-sock-packaging-shipping-small-batch-cartons.png",
  },
];

export default function SockProcess() {
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
