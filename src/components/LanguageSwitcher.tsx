"use client";

import { usePathname } from "next/navigation";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/locales";
import { localizePath, stripLocalePrefix } from "@/lib/i18n/paths";
import { useLocale } from "@/contexts/LocaleContext";

type LanguageSwitcherProps = {
  variant?: "header" | "footer";
};

export default function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const { locale, t } = useLocale();
  const { pathname: barePath } = stripLocalePrefix(pathname);

  const selectClass =
    variant === "footer"
      ? "h-9 w-full min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 hover:border-amber-400/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
      : "h-9 min-w-[7.5rem] rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:border-amber-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200";

  return (
    <div className="relative">
      <label
        htmlFor="site-language"
        className={variant === "footer" ? "mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90" : "sr-only"}
      >
        {t("lang.switch", "Language")}
      </label>
      <select
        id="site-language"
        value={locale}
        onChange={(event) => {
          const next = event.target.value as Locale;
          window.location.href = localizePath(barePath, next);
        }}
        className={selectClass}
        aria-label={t("lang.switch", "Language")}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
