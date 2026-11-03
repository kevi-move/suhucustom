import type { MetadataRoute } from "next";
import { ALL_SEO_DEFAULTS } from "@/lib/seoDefaults";
import { LOCALES } from "@/lib/i18n/locales";
import { buildLocalizedUrl } from "@/lib/i18n/paths";
import { getPublishedPostSlugs } from "@/lib/blog";
import { isUnpublishedPath } from "@/lib/unpublishedPaths";
import { getPublishedCustomizationItems } from "@/lib/navigation";

export const revalidate = 3600;

function getPublishedSitemapPaths(): string[] {
  try {
    const hasCustomizationPages = getPublishedCustomizationItems().length > 0;
    const noindexPaths = new Set([
      "/search",
      "/privacy-policy",
      "/terms-and-conditions",
    ]);

    return Object.keys(ALL_SEO_DEFAULTS).filter((path) => {
      if (isUnpublishedPath(path)) return false;
      if (noindexPaths.has(path)) return false;
      if (path === "/customization" && !hasCustomizationPages) return false;
      return true;
    });
  } catch (err) {
    console.error("sitemap: failed to list static paths", err);
    return ["/", "/services", "/about-us", "/contact-us", "/blog"];
  }
}

function homepageEntry(now: Date): MetadataRoute.Sitemap[number] {
  return {
    url: buildLocalizedUrl("/", "en"),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    const paths = getPublishedSitemapPaths();
    let blogSlugs: string[] = [];
    try {
      blogSlugs = await getPublishedPostSlugs();
    } catch (err) {
      console.error("sitemap: failed to load blog slugs (continuing without them)", err);
    }

    const entries: MetadataRoute.Sitemap = [];

    for (const path of paths) {
      for (const locale of LOCALES) {
        entries.push({
          url: buildLocalizedUrl(path, locale),
          lastModified: now,
          changeFrequency: path === "/" ? "weekly" : "monthly",
          priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.6,
        });
      }
    }

    for (const slug of blogSlugs) {
      const blogPath = `/blog/${slug}`;
      for (const locale of LOCALES) {
        entries.push({
          url: buildLocalizedUrl(blogPath, locale),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    return entries.length ? entries : [homepageEntry(now)];
  } catch (err) {
    console.error("sitemap: unexpected failure; returning homepage only", err);
    return [homepageEntry(now)];
  }
}
