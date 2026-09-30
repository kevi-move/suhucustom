export const DEFAULT_LOCALE = "en" as const;

/** Public site languages: English (default) + Japanese (/ja/). */
export const LOCALES = ["en", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/**
 * Retired locale URL prefixes. Middleware 301s these to the English path.
 * Keep for redirects even though they are not in LOCALES.
 */
export const RETIRED_LOCALE_PREFIXES = ["zh-TW", "ko", "fr", "ru"] as const;

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

/** DeepL API target_lang codes */
export const DEEPL_TARGET_LANG: Record<Exclude<Locale, "en">, string> = {
  ja: "JA",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isNonDefaultLocale(locale: Locale): locale is Exclude<Locale, "en"> {
  return locale !== DEFAULT_LOCALE;
}

export function isRetiredLocalePrefix(value: string): value is RetiredLocalePrefix {
  return (RETIRED_LOCALE_PREFIXES as readonly string[]).includes(value);
}
