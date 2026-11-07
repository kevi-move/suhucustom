import {
  SITE_BRAND_NAME,
  SITE_COMPANY_ADDRESS,
  SITE_COMPANY_LEGAL_NAME,
  SITE_EMAIL,
} from "@/lib/siteContact";
import { getSiteBaseUrl } from "@/lib/i18n/paths";

export function getOrganizationJsonLd() {
  const base = getSiteBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND_NAME,
    legalName: SITE_COMPANY_LEGAL_NAME,
    alternateName: ["SuhuCustom", "suhucustom.com"],
    url: `${base}/`,
    logo: `${base}/brand/suhucustom-logo-icon.png`,
    image: `${base}/brand/og-image.png`,
    email: SITE_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Humen",
      addressRegion: "Guangdong",
      addressCountry: "CN",
      streetAddress: SITE_COMPANY_ADDRESS,
    },
  };
}

export function getWebSiteJsonLd() {
  const base = getSiteBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_BRAND_NAME,
    alternateName: ["suhucustom.com", "www.suhucustom.com", "SuhuCustom"],
    url: `${base}/`,
    publisher: {
      "@type": "Organization",
      name: SITE_BRAND_NAME,
      url: `${base}/`,
      logo: {
        "@type": "ImageObject",
        url: `${base}/brand/suhucustom-logo-icon.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
