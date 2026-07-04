import type { Metadata } from "next";
import { getPageMeta } from "@/lib/pageMeta";
import { getSeoDefaults, buildMetadata } from "@/lib/seoDefaults";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslatedSeo } from "@/lib/translations/sync";

const BRAND = "Suhu Custom";

export async function resolvePageMetadata(pageSlug: string): Promise<Metadata> {
  const locale = await getRequestLocale();
  const defaults = getSeoDefaults(pageSlug);
  const meta = await getPageMeta(pageSlug);

  const baseTitle = meta?.metaTitle?.trim() || defaults?.title || `${BRAND}`;
  const baseDescription =
    meta?.metaDescription?.trim() ||
    defaults?.description ||
    "Custom apparel manufacturing from China.";
  const baseKeywords = defaults?.keywords ?? [];

  const translated = await getTranslatedSeo(pageSlug, locale, {
    title: baseTitle,
    description: baseDescription,
    keywords: baseKeywords,
  });

  return buildMetadata(
    {
      title: locale === "en" ? baseTitle : translated.title,
      description: locale === "en" ? baseDescription : translated.description,
      keywords: locale === "en" ? baseKeywords : translated.keywords,
    },
    pageSlug,
    locale
  );
}
