"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { publishedServiceGroups, publishedCustomizationItems, publishedCompanyDropdownItems } from "@/lib/navigation";
import HeaderSearch from "@/components/search/HeaderSearch";
import { QuoteButton } from "@/components/contact/QuoteButton";
import { useLocale } from "@/contexts/LocaleContext";

function ServicesMegaMenu({
  open,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 top-16 z-50 flex justify-center px-4 pt-3 sm:px-6 lg:px-8"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-['']">
        <div className="w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-900/5">
          {children}
        </div>
      </div>
    </div>
  );
}

function DropdownPanel({
  open,
  align = "left",
  children,
}: {
  open: boolean;
  align?: "left" | "center";
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className={`absolute top-full pt-2 before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-[''] ${
        align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"
      }`}
    >
      <div className="w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
        {children}
      </div>
    </div>
  );
}

export default function Header() {
  const { t, localizePath } = useLocale();
  const [megaOpen, setMegaOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMegaMenu = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setMegaOpen(true);
  };

  const closeMegaMenu = () => {
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  useEffect(() => {
    return () => {
      if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    };
  }, []);

  const companyLinks = publishedCompanyDropdownItems;
  const navLinkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  const mobileLinkClass =
    "block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
        <Link
          href={localizePath("/")}
          className="shrink-0 text-xl font-bold tracking-tight text-slate-900"
        >
          Suhu<span className="text-amber-600">Custom</span>
        </Link>

        <div className="relative z-20 hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          <Link href={localizePath("/")} className={navLinkClass}>
            {t("nav.home", "Home")}
          </Link>

          <div
            className="relative"
            onMouseEnter={openMegaMenu}
            onMouseLeave={closeMegaMenu}
          >
            <button className={`flex items-center gap-1 ${navLinkClass}`}>
              {t("nav.services", "Services")}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ServicesMegaMenu open={megaOpen} onMouseEnter={openMegaMenu} onMouseLeave={closeMegaMenu}>
              <div className="grid grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-4">
                {publishedServiceGroups.map((group) => (
                  <div key={group.titleEn} className="min-w-0">
                    <h3 className="border-b border-slate-100 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                      {t(`nav.group.${group.titleEn}`, group.titleEn)}
                    </h3>
                    <ul className="mt-4 space-y-1">
                      {group.items.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={localizePath(`/services/${item.slug}`)}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                          >
                            {t(`nav.service.${item.slug}`, item.nameEn)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ServicesMegaMenu>
          </div>

          {publishedCustomizationItems.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setCustomOpen(true)}
            onMouseLeave={() => setCustomOpen(false)}
          >
            <button className={`flex items-center gap-1 ${navLinkClass}`}>
              {t("nav.customization", "Customization")}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <DropdownPanel open={customOpen}>
              {publishedCustomizationItems.map((item) => (
                <Link
                  key={item.slug}
                  href={localizePath(`/customization/${item.slug}`)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                >
                  {t(`nav.custom.${item.slug}`, item.nameEn)}
                </Link>
              ))}
            </DropdownPanel>
          </div>
          )}

          <div
            className="relative"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
          >
            <button className={`flex items-center gap-1 ${navLinkClass}`}>
              {t("nav.blog", "Blog")}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <DropdownPanel open={blogOpen}>
              <Link
                href={localizePath("/blog")}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
              >
                {t("nav.allPosts", "All Posts")}
              </Link>
            </DropdownPanel>
          </div>

          <Link href={localizePath("/about-us")} className={navLinkClass}>
            {t("footer.link.about", "About Us")}
          </Link>

          {companyLinks.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setCompanyOpen(true)}
            onMouseLeave={() => setCompanyOpen(false)}
          >
            <button className={`flex items-center gap-1 ${navLinkClass}`}>
              {t("nav.resource", "Resource")}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <DropdownPanel open={companyOpen}>
              {companyLinks.map((item) => (
                <Link
                  key={item.href}
                  href={localizePath(item.href)}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                >
                  {t(`nav.company.${item.href}`, item.label)}
                </Link>
              ))}
            </DropdownPanel>
          </div>
          )}
        </div>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <QuoteButton
            title={t("nav.requestQuote", "Get an Instant Quote")}
            className="hidden whitespace-nowrap rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 lg:inline-flex"
          >
            {t("nav.requestQuote", "Get an Instant Quote")}
          </QuoteButton>
          <HeaderSearch />
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1">
            <Link href={localizePath("/")} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {t("nav.home", "Home")}
            </Link>
            <Link href={localizePath("/services")} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {t("nav.services", "Services")}
            </Link>
            {publishedServiceGroups.flatMap((group) =>
              group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={localizePath(`/services/${item.slug}`)}
                  className="block rounded-md py-1.5 pl-6 pr-3 text-sm text-slate-600 hover:text-amber-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(`nav.service.${item.slug}`, item.nameEn)}
                </Link>
              ))
            )}
            {publishedCustomizationItems.length > 0 && (
              <>
                <Link
                  href={localizePath("/customization")}
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav.customization", "Customization")}
                </Link>
                {publishedCustomizationItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={localizePath(`/customization/${item.slug}`)}
                    className="block rounded-md py-1.5 pl-6 pr-3 text-sm text-slate-600 hover:text-amber-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(`nav.custom.${item.slug}`, item.nameEn)}
                  </Link>
                ))}
              </>
            )}
            <Link href={localizePath("/blog")} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {t("nav.blog", "Blog")}
            </Link>
            <Link href={localizePath("/about-us")} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {t("footer.link.about", "About Us")}
            </Link>
            {companyLinks.map((item) => (
              <Link
                key={item.href}
                href={localizePath(item.href)}
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(`nav.company.${item.href}`, item.label)}
              </Link>
            ))}
            <Link href={localizePath("/contact-us")} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {t("nav.contact", "Contact Us")}
            </Link>
            <QuoteButton
              title={t("nav.requestQuote", "Get an Instant Quote")}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white"
            >
              {t("nav.requestQuote", "Get an Instant Quote")}
            </QuoteButton>
          </div>
        </div>
      )}
    </header>
  );
}
