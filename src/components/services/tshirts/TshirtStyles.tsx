import { resolveImageSrc } from "@/lib/imageFallback";

const PLACEHOLDER = "/services/placeholder.svg";

const STYLES = [
  {
    title: "Basic T-Shirts",
    description:
      "Simple everyday styles for brands, uniforms, promotional products, and retail collections.",
  },
  {
    title: "Oversized T-Shirts",
    description:
      "Relaxed silhouettes with a larger fit for streetwear and contemporary apparel collections.",
  },
  {
    title: "Heavyweight T-Shirts",
    description:
      "Heavier fabrics and structured construction for premium or streetwear-focused products.",
  },
  {
    title: "Performance T-Shirts",
    description:
      "Designed around lightweight or moisture-management fabrics for sports and activewear applications.",
  },
  {
    title: "Private Label T-Shirts",
    description:
      "Develop T-shirts under your own brand with custom branding, labels, and packaging.",
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

export default function TshirtStyles() {
  const topRow = STYLES.slice(0, 3);
  const bottomRow = STYLES.slice(3);

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Custom T-Shirt Styles
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Different products require different fits, fabrics, and construction.
            We can develop custom t-shirts around your target style and specifications.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topRow.map((style) => (
            <StyleCard key={style.title} title={style.title} description={style.description} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-[calc((100%-3rem)/3*2+1.5rem)]">
          {bottomRow.map((style) => (
            <StyleCard key={style.title} title={style.title} description={style.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
