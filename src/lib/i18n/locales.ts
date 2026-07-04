export const DEFAULT_LOCALE = "en" as const;

export const LOCALES = ["en", "zh-TW", "ko", "ja", "fr", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-TW": "繁體中文",
  ko: "한국어",
  ja: "日本語",
  fr: "Français",
  ru: "Русский",
};

/** BCP 47 for `<html lang>` and hreflang */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  "zh-TW": "zh-TW",
  ko: "ko",
  ja: "ja",
  fr: "fr",
  ru: "ru",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  "zh-TW": "zh-Hant",
  ko: "ko",
  ja: "ja",
  fr: "fr",
  ru: "ru",
};

/** DeepL API target_lang codes */
export const DEEPL_TARGET_LANG: Record<Exclude<Locale, "en">, string> = {
  "zh-TW": "ZH-HANT",
  ko: "KO",
  ja: "JA",
  fr: "FR",
  ru: "RU",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isNonDefaultLocale(locale: Locale): locale is Exclude<Locale, "en"> {
  return locale !== DEFAULT_LOCALE;
}
