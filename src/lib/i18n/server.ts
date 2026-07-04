import { headers } from "next/headers";
import { DEFAULT_LOCALE, type Locale, isLocale } from "./locales";
import { LOCALE_HEADER } from "./constants";

export { LOCALE_HEADER };

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(LOCALE_HEADER);
  if (fromHeader && isLocale(fromHeader)) return fromHeader;
  return DEFAULT_LOCALE;
}
