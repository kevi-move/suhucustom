import { translateTexts } from "@/lib/deepl/client";
import { getStaticUiStrings } from "@/lib/i18n/staticUiTranslations";
import { NON_DEFAULT_LOCALES, type Locale } from "@/lib/i18n/locales";
import { EN_UI_STRINGS, collectUiStringCatalog } from "@/lib/i18n/uiCatalog";
import { ALL_SEO_DEFAULTS } from "@/lib/seoDefaults";
import { getCachedTranslation, upsertTranslation } from "@/lib/translations/store";
import { translateJsonStrings } from "@/lib/translations/jsonTranslator";

const UI_SOURCE_ID = "site";

export async function getUiStrings(locale: Locale): Promise<Record<string, string>> {
  if (locale === "en") return EN_UI_STRINGS;

  const cached = await getCachedTranslation("ui", UI_SOURCE_ID, locale);
  if (cached) return { ...EN_UI_STRINGS, ...(cached as Record<string, string>) };

  const staticUi = getStaticUiStrings(locale);
  if (staticUi) return { ...EN_UI_STRINGS, ...staticUi };

  return EN_UI_STRINGS;
}

export async function syncUiTranslations(): Promise<void> {
  const catalog = collectUiStringCatalog();
  const keys = Object.keys(catalog);
  const values = keys.map((key) => catalog[key]);

  for (const locale of NON_DEFAULT_LOCALES) {
    const translatedValues = await translateTexts(values, locale);
    const translated: Record<string, string> = {};
    keys.forEach((key, index) => {
      translated[key] = translatedValues[index] ?? catalog[key];
    });
    await upsertTranslation("ui", UI_SOURCE_ID, locale, translated, 1);
  }
}

export async function syncSeoTranslations(): Promise<void> {
  for (const [pageSlug, seo] of Object.entries(ALL_SEO_DEFAULTS)) {
    const payload = {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
    };

    for (const locale of NON_DEFAULT_LOCALES) {
      const translated = await translateJsonStrings(payload, (texts) => translateTexts(texts, locale));
      await upsertTranslation("seo", pageSlug, locale, translated, 1);
    }
  }
}

export async function syncPageContentTranslation(
  pageSlug: string,
  content: Record<string, unknown>,
  version: number
): Promise<void> {
  for (const locale of NON_DEFAULT_LOCALES) {
    const translated = await translateJsonStrings(content, (texts) => translateTexts(texts, locale));
    await upsertTranslation("page", pageSlug, locale, translated, version);
  }
}

export async function getTranslatedSeo(
  pageSlug: string,
  locale: Locale,
  fallback: { title: string; description: string; keywords: string[] }
): Promise<{ title: string; description: string; keywords: string[] }> {
  if (locale === "en") return fallback;

  const cached = await getCachedTranslation("seo", pageSlug, locale);
  if (!cached) return fallback;

  return {
    title: (cached.title as string) || fallback.title,
    description: (cached.description as string) || fallback.description,
    keywords: (cached.keywords as string[]) || fallback.keywords,
  };
}

export async function bootstrapAllTranslations(
  pageSlugs: string[],
  loadPageContent: (slug: string) => Promise<{ content: Record<string, unknown>; version: number }>
): Promise<{ ui: boolean; seo: boolean; pages: string[] }> {
  await syncUiTranslations();
  await syncSeoTranslations();

  const syncedPages: string[] = [];
  for (const slug of pageSlugs) {
    const { content, version } = await loadPageContent(slug);
    if (Object.keys(content).length > 0) {
      await syncPageContentTranslation(slug, content, version);
      syncedPages.push(slug);
    }
  }

  return { ui: true, seo: true, pages: syncedPages };
}
