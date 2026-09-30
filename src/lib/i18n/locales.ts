export const DEFAULT_LOCALE = "en" as const;

/**
 * Public site languages currently published.
 * Japanese (/ja/) is paused until a paid translation API is available —
 * re-add "ja" here to restore the Japanese site.
 */
export const LOCALES = ["en"] as const;

/**
 * Locales kept in types/tooling but not published.
 * `/ja/...` is 301'd to English via RETIRED_LOCALE_PREFIXES.
 */
export type Locale = "en" | "ja";

export const NON_DEFAULT_LOCALES = (["ja"] as const).filter((locale) =>
  (LOCALES as readonly string[]).includes(locale)
) as readonly Exclude<Locale, "en">[];

/**
 * Retired / paused locale URL prefixes. Middleware 301s these to the English path.
 */
export const RETIRED_LOCALE_PREFIXES = ["zh-TW", "ko", "fr", "ru", "ja"] as const;

export type RetiredLocalePrefix = (typeof RETIRED_LOCALE_PREFIXES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

/** BCP 47 for `<html lang>` and hreflang */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  ja: "ja",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  ja: "ja",
};

/** DeepL API target_lang codes (ready when Japanese is re-enabled) */
export const DEEPL_TARGET_LANG: Record<Exclude<Locale, "en">, string> = {
  ja: "JA",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isNonDefaultLocale(locale: Locale): locale is Exclude<Locale, "en"> {
  return (NON_DEFAULT_LOCALES as readonly string[]).includes(locale);
}

export function isRetiredLocalePrefix(value: string): value is RetiredLocalePrefix {
  return (RETIRED_LOCALE_PREFIXES as readonly string[]).includes(value);
}
