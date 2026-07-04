"use client";

import { EditableImage, EditableText } from "@/components/cms";
import { useCMS } from "@/contexts/CMSContext";

type Review = { image: string; quote: string; author: string };

const DEFAULT_REVIEWS: Review[] = [
  {
    image:
      "/generated/homepage-seo-images/customer-review-germany-custom-apparel-quality-delivery.png",
    quote: "Great quality, fast delivery! Will order again.",
    author: "Brand X, Germany",
  },
  {
    image:
      "/generated/homepage-seo-images/customer-review-usa-western-sizing-apparel-samples.png",
    quote: "Communication was smooth and they understood Western sizing very well.",
    author: "Retailer Y, USA",
  },
  {
    image:
      "/generated/homepage-seo-images/customer-review-uk-private-label-hoodie-tech-pack.png",
    quote: "Our private label hoodies turned out exactly like our tech packs.",
    author: "Streetwear Label, UK",
  },
  {
    image:
      "/generated/homepage-seo-images/customer-review-canada-seasonal-activewear-drops.png",
    quote: "Reliable partner for our seasonal activewear drops.",
    author: "E‑commerce Brand, Canada",
  },
  {
    image:
      "/generated/homepage-seo-images/customer-review-france-boutique-apparel-moq-pricing.png",
    quote: "MOQ and pricing work perfectly for our growing brand.",
    author: "Boutique Chain, France",
  },
  {
    image:
      "/generated/homepage-seo-images/customer-review-australia-sports-club-bulk-sample-match.png",
    quote: "Samples arrived quickly and bulk matched the approved sample.",
    author: "Sports Club, Australia",
  },
];

export default function HomeTrustSection() {
  const { getDisplayValue } = useCMS();
  const reviews = getDisplayValue<Review[]>("trust.reviews", DEFAULT_REVIEWS);

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center sm:gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            <EditableText path="trust.eyebrow" value="Social Proof" />
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText path="trust.title" value="Trusted by global brands & customers" />
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            <EditableText
              path="trust.subtitle"
              value="Real feedback and real partnerships from Europe, North America and beyond. Our clients rely on us for consistent quality, honest communication and on‑time delivery."
            />
          </p>
        </div>

        <div className="mt-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {reviews.map((item, index) => (
              <article
                key={index}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 sm:aspect-[3/2]">
                  <EditableImage
                    path={`trust.reviews[${index}].image`}
                    src={DEFAULT_REVIEWS[index]?.image ?? item.image}
                    alt={item.author}
                    className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-slate-700">
                    “
                    <EditableText
                      path={`trust.reviews[${index}].quote`}
                      value={DEFAULT_REVIEWS[index]?.quote ?? item.quote}
                    />
                    ”
                  </p>
                  <p className="mt-3 text-xs font-medium text-amber-700">
                    <EditableText
                      path={`trust.reviews[${index}].author`}
                      value={DEFAULT_REVIEWS[index]?.author ?? item.author}
                    />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
