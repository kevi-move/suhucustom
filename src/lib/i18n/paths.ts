import {
  DEFAULT_LOCALE,
  LOCALE_HREFLANG,
  LOCALES,
  NON_DEFAULT_LOCALES,
  type Locale,
  isLocale,
} from "./locales";

const LOCALE_PREFIX_PATTERN = new RegExp(
  `^/(${NON_DEFAULT_LOCALES.map((l) => l.replace("-", "\\-")).join("|")})(?=/|$)`
);

export function stripLocalePrefix(pathname: string): { locale: Locale; pathname: string } {
  const match = pathname.match(LOCALE_PREFIX_PATTERN);
  if (!match) {
    return { locale: DEFAULT_LOCALE, pathname: pathname || "/" };
  }
  const locale = match[1] as Locale;
  const rest = pathname.slice(match[0].length) || "/";
  return { locale, pathname: rest.startsWith("/") ? rest : `/${rest}` };
}

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function getSiteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function buildLocalizedUrl(path: string, locale: Locale): string {
  return `${getSiteBaseUrl()}${localizePath(path, locale)}`;
}

export function buildHreflangAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of LOCALES) {
    alternates[LOCALE_HREFLANG[locale]] = buildLocalizedUrl(path, locale);
  }
  alternates["x-default"] = buildLocalizedUrl(path, DEFAULT_LOCALE);
  return alternates;
}

export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.trim().split(";")[0]?.toLowerCase());
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("zh-tw") || part.startsWith("zh-hant")) return "zh-TW";
    if (part.startsWith("ko")) return "ko";
    if (part.startsWith("ja")) return "ja";
    if (part.startsWith("fr")) return "fr";
    if (part.startsWith("ru")) return "ru";
    if (part.startsWith("en")) return "en";
  }
  return null;
}

export function parseLocaleSegment(segment: string): Locale | null {
  return isLocale(segment) ? segment : null;
}
