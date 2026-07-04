"use client";

import Link from "next/link";
import {
  SITE_COMPANY_ADDRESS,
  SITE_COMPANY_LEGAL_NAME,
  SITE_EMAIL,
} from "@/lib/siteContact";
import { getFooterServices } from "@/lib/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { QuoteButton } from "@/components/contact/QuoteButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const footerServices = getFooterServices();

export default function Footer() {
  const { t, localizePath } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              href={localizePath("/")}
              className="text-2xl font-bold tracking-tight text-white"
            >
              Suhu<span className="text-amber-400">Custom</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {t(
                "footer.tagline",
                "Premium custom apparel manufacturing for global brands, retailers, and startups — from sampling to bulk production."
              )}
            </p>
            <p className="mt-3 text-sm text-slate-500">{SITE_COMPANY_ADDRESS}</p>
            <QuoteButton
              title="Get an Instant Quote"
              className="mt-6 inline-flex items-center rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
            >
              {t("nav.requestQuote", "Get an Instant Quote")}
            </QuoteButton>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                {t("footer.services", "Services")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {footerServices.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={localizePath(`/services/${item.slug}`)}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {t(`nav.service.${item.slug}`, item.nameEn)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={localizePath("/services")}
                    className="text-sm font-medium text-amber-400/90 transition hover:text-amber-300"
                  >
                    {t("footer.viewAllServices", "View all services →")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                {t("footer.resource", "Resource")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href={localizePath("/about-us")}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {t("footer.link.about", "About Us")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizePath("/blog")}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {t("nav.blog", "Blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizePath("/contact-us")}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {t("footer.link.contact", "Contact Us")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                {t("footer.contact", "Contact")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {SITE_EMAIL}
                  </a>
                </li>
                <li>
                  <Link
                    href={localizePath("/search")}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {t("footer.link.search", "Search")}
                  </Link>
                </li>
              </ul>
              <div className="mt-6">
                <LanguageSwitcher variant="footer" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            © {currentYear} {SITE_COMPANY_LEGAL_NAME}. {t("footer.rights", "All rights reserved.")}{" "}
            <span className="text-slate-600">· Trading as Suhu Custom</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href={localizePath("/privacy-policy")}
              className="text-slate-500 transition hover:text-slate-300"
            >
              {t("footer.privacy", "Privacy Policy")}
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href={localizePath("/terms-and-conditions")}
              className="text-slate-500 transition hover:text-slate-300"
            >
              {t("footer.terms", "Terms & Conditions")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
