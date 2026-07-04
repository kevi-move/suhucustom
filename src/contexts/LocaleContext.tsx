"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localizePath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/locales";
import { EN_UI_STRINGS, uiText, type UiStringCatalog } from "@/lib/i18n/uiCatalog";

type LocaleContextValue = {
  locale: Locale;
  ui: UiStringCatalog;
  t: (key: string, fallback?: string) => string;
  localizePath: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui?: UiStringCatalog;
  children: ReactNode;
}) {
  const catalog = ui ?? EN_UI_STRINGS;
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      ui: catalog,
      t: (key, fallback) => uiText(catalog, key, fallback),
      localizePath: (path) => localizePath(path, locale),
    }),
    [locale, catalog]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      ui: EN_UI_STRINGS,
      t: (key: string, fallback?: string) => uiText(EN_UI_STRINGS, key, fallback),
      localizePath: (path: string) => localizePath(path, "en"),
    };
  }
  return ctx;
}
