import { ALL_SEO_DEFAULTS } from "@/lib/seoDefaults";

export interface PageMeta {
  id: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: Date;
}

export interface PageMetaInput {
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
}

export const DEFAULT_PAGE_META: Record<string, { title: string; description: string }> =
  Object.fromEntries(
    Object.entries(ALL_SEO_DEFAULTS).map(([slug, seo]) => [
      slug,
      { title: seo.title, description: seo.description },
    ])
  );
