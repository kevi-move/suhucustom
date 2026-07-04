import { ABOUT_US_DEFAULTS } from "@/lib/aboutUsDefaults";
import {
  companyDropdownItems,
  customizationItems,
  serviceGroups,
} from "@/lib/navigation";
import type { SearchIndexEntry } from "@/types/search";

function flattenAboutUsText(): string {
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === "string") parts.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object")
      Object.values(node).forEach(walk);
  };
  walk(ABOUT_US_DEFAULTS);
  return parts.join(" ");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildStaticSearchIndex(): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  const add = (
    id: string,
    title: string,
    excerpt: string,
    href: string,
    type: SearchIndexEntry["type"],
    extra = ""
  ) => {
    entries.push({
      id,
      title,
      excerpt,
      href,
      type,
      searchText: [title, excerpt, extra].join(" ").toLowerCase(),
    });
  };

  add(
    "page-home",
    "Home",
    "Custom apparel manufacturing for global brands and startups. T-shirts, hoodies, activewear, uniforms and more.",
    "/",
    "page",
    "factory MOQ quote garment production suhucustom"
  );

  add(
    "page-services",
    "Our Services",
    "Comprehensive apparel manufacturing by category: tops, bottoms, accessories, uniforms and specialized products.",
    "/services",
    "page",
    "manufacturing categories products"
  );

  add(
    "page-blog",
    "Blog",
    "Manufacturing insights, MOQ guides, sampling tips and industry updates from our Dongguan team.",
    "/blog",
    "page",
    "articles insights apparel"
  );

  add(
    "page-contact",
    "Contact Us",
    "Request a quote for custom apparel production. Share your tech pack, MOQ and timeline.",
    "/contact-us",
    "page",
    "inquiry quote factory contact sales"
  );

  add(
    "page-quality",
    "Quality Assurance",
    "Export-grade quality control, inline inspection and compliance for apparel manufacturing.",
    "/quality",
    "page",
    "QC inspection AQL compliance standards"
  );

  add(
    "page-customization",
    "Customization",
    "Printing, embroidery, private label and tech pack design for your apparel line.",
    "/customization",
    "page",
    "decoration branding labels design"
  );

  add(
    "page-case-studies",
    "Case Studies",
    "Real client projects and production results from SuhuCustom manufacturing.",
    "/company/case-studies",
    "page",
    "clients projects examples portfolio"
  );

  const aboutText = flattenAboutUsText();
  add(
    "page-about",
    "About Us",
    "Two sisters from Humen, Dongguan - custom apparel manufacturing with flexible MOQ and hands-on support.",
    "/about-us",
    "page",
    aboutText
  );

  for (const group of serviceGroups) {
    for (const item of group.items) {
      add(
        `service-${item.slug}`,
        item.nameEn,
        `Custom ${item.nameEn.toLowerCase()} manufacturing - ${group.titleEn}. ${item.nameZh}`,
        `/services/${item.slug}`,
        "service",
        `${item.slug} ${group.titleEn} ${group.titleZh} garment apparel`
      );
    }
  }

  for (const item of customizationItems) {
    add(
      `custom-${item.slug}`,
      item.nameEn,
      `Apparel ${item.nameEn.toLowerCase()} services for your collection. ${item.nameZh}`,
      `/customization/${item.slug}`,
      "customization",
      `${item.slug} customization decoration`
    );
  }

  for (const item of companyDropdownItems) {
    if (item.href === "/about-us") continue;
    add(
      `page-${item.href.replace(/\//g, "-")}`,
      item.label,
      `SuhuCustom company - ${item.label}`,
      item.href,
      "page"
    );
  }

  return entries;
}

export function blogPostToSearchEntry(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
}): SearchIndexEntry {
  const body = stripHtml(post.content);
  return {
    id: `blog-${post.id}`,
    title: post.title,
    excerpt: post.excerpt || body.slice(0, 160),
    href: `/blog/${post.slug}`,
    type: "blog",
    searchText: [post.title, post.excerpt, body, post.slug]
      .join(" ")
      .toLowerCase(),
  };
}
