"use client";

import Link from "next/link";
import { useState } from "react";
import { serviceGroups, customizationItems, companyDropdownItems } from "@/lib/navigation";

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto relative flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          Suhu<span className="text-amber-600">Custom</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Home
          </Link>

          {/* Services Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Services
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {megaOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-[70vw] max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                  <div className="grid grid-cols-4 gap-6">
                    {serviceGroups.map((group) => (
                      <div key={group.titleEn}>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900">
                          {group.titleEn}
                        </h3>
                        <ul className="space-y-2">
                          {group.items.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/services/${item.slug}`}
                                className="block rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                              >
                                {item.nameEn}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customization Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCustomOpen(true)}
            onMouseLeave={() => setCustomOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Customization
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {customOpen && (
              <div className="absolute left-0 top-full pt-1">
                <div className="w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
                  {customizationItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/customization/${item.slug}`}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                    >
                      {item.nameEn}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Blog
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {blogOpen && (
              <div className="absolute left-0 top-full pt-1">
                <div className="w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
                  <Link href="/blog" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600">
                    All Posts
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCompanyOpen(true)}
            onMouseLeave={() => setCompanyOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Company
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {companyOpen && (
              <div className="absolute left-0 top-full pt-1">
                <div className="w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
                  {companyDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <Link
            href="/contact-us"
            className="ml-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="rounded-md p-2 lg:hidden" aria-label="Open menu">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
