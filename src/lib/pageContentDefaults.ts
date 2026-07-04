import { ABOUT_US_DEFAULTS } from "@/lib/aboutUsDefaults";
import { deepMerge } from "@/lib/deepMerge";

export type EditablePageSlug = "/" | "/services" | "/about-us" | "/contact-us" | "/blog";

export const CMS_PAGE_SLUGS: EditablePageSlug[] = ["/", "/services", "/about-us", "/contact-us", "/blog"];

/** English defaults for CMS-backed page copy (used for display + DeepL bootstrap). */
export const PAGE_CONTENT_DEFAULTS: Record<EditablePageSlug, Record<string, unknown>> = {
  "/": {
    hero: {
      eyebrow: "Custom Apparel Manufacturing",
      title: "Reliable garment factory for global brands & startups",
      subtitle:
        "From design development to bulk production, Suhu Custom helps you turn ideas into high-quality collections – with flexible MOQ, stable lead time and factory-direct pricing.",
      primaryCtaText: "Get an Instant Quote",
      primaryCtaHref: "/contact-us",
      secondaryCtaText: "View Manufacturing Services",
      secondaryCtaHref: "/services/t-shirts",
      heroImage: "/generated/home/hero.png",
    },
    factoryIntro: {
      image: "/generated/home/factory-intro.png",
      overlayTitle: "Your Reliable Apparel Manufacturing Partner",
      overlaySubtitle: "In‑house sampling, cutting, sewing & QC for stable quality.",
      eyebrow: "About Our Factory",
      title: "Apparel factory built for brands that care about quality, lead time and communication.",
      body: "Based in China, Suhu Custom focuses on export‑oriented garment manufacturing for Europe and North America. We speak the same language as your buying team – clear specs, transparent costs and predictable timelines.",
      stat1Label: "Production Capacity",
      stat1Value: "80,000+ pcs / month",
      stat1Detail: "Flexible lines for knitwear, activewear & fashion basics.",
      stat2Label: "Product Coverage",
      stat2Value: "4 major categories",
      stat2Detail: "Tops, bottoms, underwear, accessories & uniforms.",
      stat3Label: "Quality & Compliance",
      stat3Value: "Export‑grade QC",
      stat3Detail: "Inline inspection, final AQL check & full traceability.",
      stat4Label: "Service Model",
      stat4Value: "OEM / ODM support",
      stat4Detail: "Tech pack development, fabric sourcing & branding.",
      ctaText: "Learn More About Our Factory",
    },
    categories: {
      title: "Core Product Categories",
      subtitle:
        "Browse all apparel categories we manufacture. Each tile links directly to a detailed service page with fabrics, MOQ and customization options.",
      viewDetails: "View service details",
      taglines: {
        "t-shirts": "Soft cotton bases with sharp, durable prints.",
        "hoodies-sweatshirts": "Heavyweight fleece, clean sewing and stable fit.",
        "activewear-athleisure": "Quick‑dry, 4‑way stretch, anti‑pilling fabrics.",
        "gym-sportswear": "Moisture‑wicking performance knits for training use.",
        leggings: "Squat‑proof opacity with high‑recovery stretch.",
        "jeans-denim": "Consistent washing, strong stitching and true sizing.",
        "underwear-bras": "Seamless construction with skin‑friendly materials.",
        swimwear: "Shape‑holding stretch with chlorine‑resistant prints.",
        "hats-headwear": "Clean embroidery and crisp logo placement.",
        socks: "High needle count, soft handfeel and firm rib.",
        "neck-gaiters": "Breathable, all‑over print with smooth edges.",
        "leather-goods": "Precise edge painting and neat top‑stitching.",
        uniforms: "Color‑fast, wrinkle‑resistant fabrics for daily wear.",
        "baby-kids-clothing": "Gentle, comfortable fabrics with safe trims.",
        towels: "High‑GSM loops for strong absorption and softness.",
        "cushion-covers": "Shape‑stable fabric and clean hidden zippers.",
        default: "Factory‑level sewing quality and consistent sizing.",
      },
    },
    trust: {
      eyebrow: "Social Proof",
      title: "Trusted by global brands & customers",
      subtitle:
        "Real feedback and real partnerships from Europe, North America and beyond. Our clients rely on us for consistent quality, honest communication and on‑time delivery.",
      footnote: "* Click images to view in full size (optional lightbox can be added later).",
      logosLabel: "Selected brands & retailers we work with",
      reviews: [
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
      ],
    },
    caseStudies: {
      eyebrow: "Case Studies",
      title: "Case Studies | Our Successful Projects",
      subtitle:
        "Real projects showing how we support brands from idea to finished product across different apparel categories.",
      clientBriefLabel: "Client brief",
      highlightsLabel: "Key highlights",
      outcomeLabel: "Outcome",
      viewDetails: "View Details",
      footerNote: "Fits your category? We can create a similar project.",
      cases: [
        {
          id: "activewear",
          title: "US Sports Brand – Performance Activewear Capsule",
          category: "Tops & Activewear",
          cover: "/generated/home/case-activewear.png",
          requirement: "OEM Activewear for US sports brand | MOQ 500 pcs / style",
          highlights: [
            "Custom sublimation print",
            "Moisture‑wicking recycled fabric",
            "15‑day repeat delivery",
          ],
          result: "Sell‑through rate 82% in first 8 weeks, extended to 3rd season.",
        },
        {
          id: "underwear",
          title: "European DTC Label – Seamless Underwear Collection",
          category: "Bottoms & Underwear",
          cover: "/generated/home/case-underwear.png",
          requirement: "ODM underwear line with branded waistband | MOQ 300 pcs / colour",
          highlights: [
            "Soft touch micro‑modal",
            "Custom jacquard elastic",
            "Color‑matched packaging",
          ],
          result: "Return rate under 2%, average review score 4.8 / 5.",
        },
        {
          id: "streetwear",
          title: "UK Streetwear Brand – Heavyweight Hoodie Program",
          category: "Accessories & Outerwear",
          cover: "/generated/home/case-hoodies.png",
          requirement: "Oversized hoodies with puff print logo | MOQ 800 pcs total",
          highlights: [
            "460gsm brushed fleece",
            "Puff & 3D embroidery logo",
            "Bulk produced within 25 days",
          ],
          result: "First drop sold out in 48 hours; reordered 2x within the season.",
        },
        {
          id: "uniforms",
          title: "Global Franchise – Staff Uniform & Kids Merch",
          category: "Uniforms & Kids",
          cover: "/generated/home/case-uniforms.png",
          requirement: "Uniform polos and kids T‑shirts for 50+ stores worldwide",
          highlights: [
            "Color‑fastness tested to EU standard",
            "Size grading for EU & US markets",
            "Consolidated multi‑country shipping",
          ],
          result: "On‑brand, consistent look across all markets with simplified re‑ordering.",
        },
      ],
    },
    cta: {
      title: "Let's build your next collection together.",
      subtitle:
        "Share your tech packs, reference samples or ideas — our team will respond with a clear production solution.",
      primaryCtaText: "Get a Factory Quote",
      primaryCtaHref: "/contact-us",
      secondaryCtaText: "View More Case Studies",
      secondaryCtaHref: "/company/case-studies",
      backgroundImage: "/generated/home/cta-background.png",
    },
  },
  "/services": {
    hero: {
      title: "Our Services",
      subtitle:
        "Comprehensive apparel manufacturing for every category. Browse by category or find your product below.",
    },
  },
  "/about-us": ABOUT_US_DEFAULTS,
  "/contact-us": {
    hero: {
      eyebrow: "Contact Us",
      title: "Let's talk about your next collection",
      subtitle:
        "Share your product ideas, quantities, and timeline. Our team will respond with a clear manufacturing plan.",
    },
  },
  "/blog": {
    hero: {
      eyebrow: "SuhuCustom Blog",
      titlePart1: "Expert insights.",
      titlePart2: "Practical techniques.",
      titlePart3: "Industry trends.",
      subtitle:
        "Created for apparel brands and manufacturing professionals — actionable knowledge on custom production, sourcing, and quality you can apply directly.",
      heroImage: "/blog/placeholder.svg",
    },
    listing: {
      title: "Latest Articles",
      subtitle: "Manufacturing tips, MOQ guides, and updates from our Dongguan team.",
    },
    cta: {
      eyebrow: "Ready to produce?",
      title: "Turn your apparel idea into a real collection",
      subtitle:
        "Get a quote for custom hoodies, uniforms, caps, and more - flexible MOQ and hands-on support from our Humen, Dongguan team.",
      primaryButton: "Start Your Project",
      secondaryButton: "View Services",
    },
  },
};

export function getPageContentDefaults(pageSlug: string): Record<string, unknown> {
  return (PAGE_CONTENT_DEFAULTS as Record<string, Record<string, unknown>>)[pageSlug] ?? {};
}

export function mergePageContent(
  pageSlug: string,
  dbContent: Record<string, unknown>
): Record<string, unknown> {
  const defaults = getPageContentDefaults(pageSlug);
  if (Object.keys(defaults).length === 0) return dbContent;
  if (Object.keys(dbContent).length === 0) return structuredClone(defaults);
  return deepMerge(structuredClone(defaults), dbContent) as Record<string, unknown>;
}
