import {
  companyDropdownItems,
  customizationItems,
  serviceGroups,
} from "@/lib/navigation";

/** Flat English UI strings for navigation, header, footer. */
export function collectUiStringCatalog(): Record<string, string> {
  const catalog: Record<string, string> = {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.customization": "Customization",
    "nav.blog": "Blog",
    "nav.resource": "Resource",
    "nav.contact": "Contact Us",
    "nav.allPosts": "All Posts",
    "nav.requestQuote": "Get an Instant Quote",
    "footer.viewAllServices": "View all services →",
    "footer.tagline":
      "Premium custom apparel & wholesale manufacturing—powering brands and retailers worldwide.",
    "footer.services": "Services",
    "footer.resource": "Resource",
    "footer.contact": "Contact",
    "footer.quality": "Quality & Process",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "search.placeholder": "Search services, blog…",
    "lang.switch": "Language",
  };

  for (const group of serviceGroups) {
    catalog[`nav.group.${group.titleEn}`] = group.titleEn;
    for (const item of group.items) {
      catalog[`nav.service.${item.slug}`] = item.nameEn;
    }
  }

  for (const item of customizationItems) {
    catalog[`nav.custom.${item.slug}`] = item.nameEn;
  }

  for (const item of companyDropdownItems) {
    catalog[`nav.company.${item.href}`] = item.label;
  }

  catalog["footer.link.t-shirts"] = "T-shirts";
  catalog["footer.link.hoodies"] = "Hoodies & Sweatshirts";
  catalog["footer.link.activewear"] = "Activewear";
  catalog["footer.link.about"] = "About Us";
  catalog["footer.link.caseStudies"] = "Case Studies";
  catalog["footer.link.contact"] = "Contact Us";
  catalog["footer.link.search"] = "Search";

  return catalog;
}

export type UiStringCatalog = Record<string, string>;

export const EN_UI_STRINGS: UiStringCatalog = collectUiStringCatalog();

export function uiText(catalog: UiStringCatalog, key: string, fallback?: string): string {
  return catalog[key] ?? fallback ?? key;
}
