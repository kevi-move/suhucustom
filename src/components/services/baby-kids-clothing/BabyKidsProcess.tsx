import { resolveImageSrc } from "@/lib/imageFallback";
const steps = [
  {
    step: "01",
    title: "Design & Safety Sampling",
    description:
      "We review your brand guidelines, style specs and safety requirements, then produce a pre-production sample within 3-5 days, including softness, safety and fit testing for the target age group.",
    image: "YOUR_BABYKIDS_PROCESS_DESIGN_IMAGE_URL",
  },
  {
    step: "02",
    title: "Fabric Preparation",
    description:
      "All fabrics undergo pre-washing and pre-shrinking treatment to eliminate shrinkage and remove any residual irritants, followed by strict safety testing to confirm OEKO-TEX compliance.",
    image: "YOUR_BABYKIDS_PROCESS_FABRIC_PREP_IMAGE_URL",
  },
  {
    step: "03",
    title: "Precision Cutting",
    description:
      "Automated child-safe precision cutting ensures consistent sizing across all pieces, with smooth edge finishing to avoid rough seams on delicate skin.",
    image: "YOUR_BABYKIDS_PROCESS_CUTTING_IMAGE_URL",
  },
  {
    step: "04",
    title: "Sewing & Assembly",
    description:
      "Skilled artisans complete flatlock stitching, soft closure attachment and gentle elastic installation, following strict child-safe construction standards with no rough edges.",
    image: "YOUR_BABYKIDS_PROCESS_SEWING_IMAGE_URL",
  },
  {
    step: "05",
    title: "Safe Branding Application",
    description:
      "Non-toxic, skin-friendly branding applied per your guidelines, with extra checks to ensure no rough backing or small hazards are present.",
    image: "YOUR_BABYKIDS_PROCESS_BRANDING_IMAGE_URL",
  },
  {
    step: "06",
    title: "Safety & Quality Inspection",
    description:
      "Every piece is individually checked for safety compliance, softness, stitching quality and branding, with full safety certification before packaging.",
    image: "YOUR_BABYKIDS_PROCESS_QC_IMAGE_URL",
  },
  {
    step: "07",
    title: "Packaging & Shipping",
    description:
      "Gentle, protective packaging and consolidated sea/air freight delivery to your US/EU warehouse or retail location.",
    image: "YOUR_BABYKIDS_PROCESS_SHIPPING_IMAGE_URL",
  },
];

export default function BabyKidsProcess() {
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
            A transparent, 7-step workflow that ensures safety and quality at
            every stage
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
