const reviews = [
  {
    image: "REVIEW_IMAGE_1_URL",
    quote: "Great quality, fast delivery! Will order again.",
    author: "Brand X, Germany",
  },
  {
    image: "REVIEW_IMAGE_2_URL",
    quote: "Communication was smooth and they understood Western sizing very well.",
    author: "Retailer Y, USA",
  },
  {
    image: "REVIEW_IMAGE_3_URL",
    quote: "Our private label hoodies turned out exactly like our tech packs.",
    author: "Streetwear Label, UK",
  },
  {
    image: "REVIEW_IMAGE_4_URL",
    quote: "Reliable partner for our seasonal activewear drops.",
    author: "E‑commerce Brand, Canada",
  },
  {
    image: "REVIEW_IMAGE_5_URL",
    quote: "MOQ and pricing work perfectly for our growing brand.",
    author: "Boutique Chain, France",
  },
  {
    image: "REVIEW_IMAGE_6_URL",
    quote: "Samples arrived quickly and bulk matched the approved sample.",
    author: "Sports Club, Australia",
  },
];

const brandLogos = [
  "BRAND_LOGO_1_URL",
  "BRAND_LOGO_2_URL",
  "BRAND_LOGO_3_URL",
  "BRAND_LOGO_4_URL",
  "BRAND_LOGO_5_URL",
  "BRAND_LOGO_6_URL",
];

export default function HomeTrustSection() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center sm:gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            Social Proof
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Trusted by global brands & customers
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            Real feedback and real partnerships from Europe, North America and beyond. Our clients rely on us for
            consistent quality, honest communication and on‑time delivery.
          </p>
        </div>

        {/* 用户评价九宫格 / 滑动区 */}
        <div className="mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item, index) => (
              <button
                key={index}
                type="button"
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden">
                  {/* 用户评价实拍图占位，替换 src 即可 */}
                  <img
                    src={item.image}
                    alt={item.author}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-50">
                    <p className="font-medium leading-snug">“{item.quote}”</p>
                    <p className="mt-1 text-[11px] text-slate-200">{item.author}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-500">
            * Click images to view in full size (optional lightbox can be added later).
          </p>
        </div>

        {/* 合作品牌 Logo 滚动区 */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Selected brands & retailers we work with
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 overflow-x-auto py-2">
            {brandLogos.map((logo, index) => (
              <div
                key={index}
                className="flex h-14 min-w-[120px] items-center justify-center rounded-xl bg-slate-50 px-4 shadow-sm ring-1 ring-slate-200"
              >
                {/* 合作品牌 Logo 图占位，替换 src 即可 */}
                <img src={logo} alt={`Partner logo ${index + 1}`} className="max-h-8 max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

