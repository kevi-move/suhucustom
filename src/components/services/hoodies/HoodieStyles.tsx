import { resolveImageSrc } from "@/lib/imageFallback";

const PLACEHOLDER = "/services/placeholder.svg";

const STYLES = [
  {
    title: "Custom Pullover Hoodies",
    description:
      "A classic custom hoodie style with a front kangaroo pocket. Customize the fabric, GSM, fit, colors, graphics, labels, and other details to match your product specifications.",
  },
  {
    title: "Custom Zip-Up Hoodies",
    description:
      "Full-zip and half-zip custom hoodies for casualwear, streetwear, uniforms, and branded collections. Customize the fabric, zipper, fit, decoration, and finishing details.",
  },
  {
    title: "Oversized Hoodies",
    description:
      "Relaxed and oversized custom hoodie styles for contemporary and streetwear collections. Specify proportions, fabric weight, ribbing, graphics, and other construction details.",
  },
  {
    title: "Heavyweight Hoodies",
    description:
      "Custom heavyweight hoodies designed for substantial fabric weight and structured silhouettes. Choose the required GSM, fabric composition, fit, and branding details for your project.",
  },
  {
    title: "Custom Crewneck Sweatshirts",
    description:
      "A versatile alternative to hoodies for everyday apparel and branded collections. Customize the fabric, GSM, fit, cuffs, hem, colors, printing, embroidery, and labels.",
  },
  {
    title: "Custom Sweatshirt Styles",
    description:
      "Looking for a different custom sweatshirt style? Share your specifications, reference sample, or design concept, and we can review the requirements for OEM/ODM production.",
  },
] as const;

function StyleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
      <div
        data-vedit-image="true"
        data-vedit-alt={title}
        className="relative aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <img
          src={resolveImageSrc(PLACEHOLDER)}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </article>
  );
}

export default function HoodieStyles() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Custom Hoodie & Sweatshirt Styles
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Explore custom hoodie and sweatshirt styles for streetwear brands, fashion
            labels, retailers, and promotional programs. Choose an existing style or send
            us your design, tech pack, or reference sample for custom production.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((style) => (
            <StyleCard key={style.title} title={style.title} description={style.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
