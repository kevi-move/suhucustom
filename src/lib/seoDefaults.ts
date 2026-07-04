import type { Metadata } from "next";
import { serviceGroups, customizationItems } from "@/lib/navigation";
import { buildHreflangAlternates, buildLocalizedUrl } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/locales";

export type SeoDefaults = {
  title: string;
  description: string;
  keywords: string[];
};

const BRAND = "Suhu Custom";
const BASE_KEYWORDS = [
  "custom apparel manufacturer",
  "clothing factory China",
  "garment manufacturing",
  "OEM ODM clothing",
  "private label apparel",
  "bulk clothing production",
  "Dongguan garment factory",
  "Humen apparel manufacturer",
  "MOQ clothing factory",
  "B2B apparel supplier",
];

export function buildMetadata(
  defaults: SeoDefaults,
  path?: string,
  locale: Locale = "en"
): Metadata {
  return {
    title: defaults.title,
    description: defaults.description,
    keywords: defaults.keywords,
    alternates: path
      ? {
          canonical: buildLocalizedUrl(path, locale),
          languages: buildHreflangAlternates(path),
        }
      : undefined,
    openGraph: {
      title: defaults.title,
      description: defaults.description,
      type: "website",
      locale: locale === "zh-TW" ? "zh_TW" : locale,
    },
  };
}

export const STATIC_SEO: Record<string, SeoDefaults> = {
  "/": {
    title: `${BRAND} | Custom Apparel Manufacturer & Clothing Factory China`,
    description:
      "Suhu Custom is a B2B garment factory in Humen, Dongguan. Custom t-shirts, hoodies, activewear, uniforms & private label apparel. Flexible MOQ, OEM/ODM, global shipping.",
    keywords: [
      ...BASE_KEYWORDS,
      "custom t-shirt manufacturer",
      "hoodie factory",
      "activewear manufacturer",
      "wholesale custom clothing",
      "apparel factory Guangdong",
    ],
  },
  "/services": {
    title: `Apparel Manufacturing Services | ${BRAND}`,
    description:
      "Explore custom clothing manufacturing services: t-shirts, hoodies, activewear, leggings, uniforms, accessories & more. Factory-direct quotes from Dongguan, China.",
    keywords: [
      ...BASE_KEYWORDS,
      "apparel manufacturing services",
      "custom clothing categories",
      "garment product lines",
      "clothing factory services",
    ],
  },
  "/about-us": {
    title: `About Us | ${BRAND} — Garment Factory in Humen, Dongguan`,
    description:
      "Meet Suhu Custom — sisters-led custom apparel manufacturing in Humen, Dongguan. Reliable B2B production for brands, wholesalers and startups worldwide.",
    keywords: [
      ...BASE_KEYWORDS,
      "about Suhu Custom",
      "Humen clothing factory",
      "Dongguan Qingzheng Trade",
      "apparel factory team",
    ],
  },
  "/contact-us": {
    title: `Contact Us | Get a Factory Quote | ${BRAND}`,
    description:
      "Request a custom apparel manufacturing quote. Share your product, MOQ and timeline — our Dongguan factory team replies within 24 hours.",
    keywords: [
      ...BASE_KEYWORDS,
      "clothing factory quote",
      "apparel inquiry",
      "contact garment manufacturer",
      "request sample",
    ],
  },
  "/blog": {
    title: `Blog | Apparel Manufacturing Insights | ${BRAND}`,
    description:
      "Tips on custom clothing production, MOQ, fabrics, quality control and brand building from Suhu Custom garment factory.",
    keywords: [
      ...BASE_KEYWORDS,
      "apparel manufacturing blog",
      "clothing production tips",
      "garment industry insights",
    ],
  },
  "/search": {
    title: `Search | ${BRAND}`,
    description: "Search Suhu Custom services, blog posts and pages.",
    keywords: [...BASE_KEYWORDS, "search apparel factory"],
  },
  "/quality": {
    title: `Quality Control & Production Process | ${BRAND}`,
    description:
      "Learn how Suhu Custom ensures apparel quality — inspection, sampling, production standards and reliable delivery for B2B orders.",
    keywords: [
      ...BASE_KEYWORDS,
      "apparel quality control",
      "garment inspection",
      "clothing production process",
      "factory QC standards",
    ],
  },
  "/customization": {
    title: `Customization Services | Printing, Embroidery & Private Label | ${BRAND}`,
    description:
      "Custom printing, embroidery, private label and tech pack support for your apparel line. Full customization from our China garment factory.",
    keywords: [
      ...BASE_KEYWORDS,
      "custom printing clothing",
      "embroidery manufacturer",
      "private label apparel",
      "tech pack design",
    ],
  },
  "/company/case-studies": {
    title: `Case Studies | Custom Apparel Projects | ${BRAND}`,
    description:
      "See how brands work with Suhu Custom on custom hoodies, activewear, uniforms and more — real manufacturing case studies.",
    keywords: [
      ...BASE_KEYWORDS,
      "apparel case studies",
      "clothing brand manufacturing",
      "factory project examples",
    ],
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${BRAND}`,
    description: "How Suhu Custom collects and uses your information when you visit our website or submit an inquiry.",
    keywords: ["privacy policy", "Suhu Custom", "data protection"],
  },
  "/terms-and-conditions": {
    title: `Terms and Conditions | ${BRAND}`,
    description: "Terms for using Suhu Custom website and B2B apparel manufacturing services.",
    keywords: ["terms and conditions", "Suhu Custom", "B2B manufacturing terms"],
  },
};

function serviceSeo(slug: string, nameEn: string): SeoDefaults {
  const product = nameEn.toLowerCase();
  return {
    title: `Custom ${nameEn} Manufacturer | OEM/ODM ${nameEn} Factory | ${BRAND}`,
    description: `Custom ${product} manufacturing from China. OEM/ODM ${product}, flexible MOQ, sampling, printing & embroidery. Get a factory quote from Suhu Custom in Dongguan.`,
    keywords: [
      ...BASE_KEYWORDS,
      `custom ${product} manufacturer`,
      `${product} factory China`,
      `OEM ${product}`,
      `wholesale ${product}`,
      `private label ${product}`,
    ],
  };
}

function customizationSeo(slug: string, nameEn: string): SeoDefaults {
  const label = nameEn.toLowerCase();
  return {
    title: `${nameEn} for Apparel | ${BRAND} Customization`,
    description: `Professional ${label} services for your clothing line. Work with Suhu Custom garment factory in Humen, Dongguan for bulk production.`,
    keywords: [
      ...BASE_KEYWORDS,
      `apparel ${label}`,
      `clothing ${label}`,
      `custom ${label} service`,
    ],
  };
}

const SERVICE_SEO = Object.fromEntries(
  serviceGroups.flatMap((g) => g.items.map((i) => [`/services/${i.slug}`, serviceSeo(i.slug, i.nameEn)]))
);

const CUSTOMIZATION_SEO = Object.fromEntries(
  customizationItems.map((i) => [`/customization/${i.slug}`, customizationSeo(i.slug, i.nameEn)])
);

export const ALL_SEO_DEFAULTS: Record<string, SeoDefaults> = {
  ...STATIC_SEO,
  ...SERVICE_SEO,
  ...CUSTOMIZATION_SEO,
};

export function getSeoDefaults(pageSlug: string): SeoDefaults | null {
  return ALL_SEO_DEFAULTS[pageSlug] ?? null;
}

export function buildPageMetadata(pageSlug: string, locale: Locale = "en"): Metadata {
  const defaults = getSeoDefaults(pageSlug);
  if (!defaults) {
    return {
      title: BRAND,
      description: "Custom apparel manufacturing from China.",
      keywords: BASE_KEYWORDS,
    };
  }
  return buildMetadata(defaults, pageSlug, locale);
}
