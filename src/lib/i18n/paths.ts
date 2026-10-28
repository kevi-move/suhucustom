import {
  DEFAULT_LOCALE,
  LOCALE_HREFLANG,
  LOCALES,
  NON_DEFAULT_LOCALES,
  type Locale,
  isLocale,
} from "./locales";

const LOCALE_PREFIX_PATTERN =
  NON_DEFAULT_LOCALES.length === 0
    ? /a^/ // never matches while no public non-default locales
    : new RegExp(
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
  let result: string;
  if (locale === DEFAULT_LOCALE) {
    result = normalized;
  } else if (normalized === "/") {
    result = `/${locale}`;
  } else {
    result = `/${locale}${normalized}`;
  }

  if (result === "/") return "/";
  return result.endsWith("/") ? result : `${result}/`;
}

export function getSiteBaseUrl(): string {
  // Prefer the public production domain (set on Vercel after DNS is live).
  const fromSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromSite) return fromSite.replace(/\/$/, "");
  const fromFrontend = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim();
  if (fromFrontend) return fromFrontend.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function buildLocalizedUrl(path: string, locale: Locale): string {
  return `${getSiteBaseUrl()}${localizePath(path, locale)}`;
}

/**
 * Hreflang cluster for multilingual pages.
 * English-only site: return {} — a self-only en/x-default cluster makes Google
 * treat the URL as an "alternate" and pick a different canonical (vercel.app / slash variants).
 */
export function buildHreflangAlternates(path: string): Record<string, string> {
  if (LOCALES.length <= 1) return {};
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
    // Japanese is paused on the public site — treat as English for now.
    if (part.startsWith("en") || part.startsWith("ja")) return "en";
  }
  return null;
}

export function parseLocaleSegment(segment: string): Locale | null {
  return isLocale(segment) ? segment : null;
}
