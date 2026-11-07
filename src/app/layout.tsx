import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { STATIC_SEO } from "@/lib/seoDefaults";
import { getRequestLocale } from "@/lib/i18n/server";
import { LOCALE_HTML_LANG } from "@/lib/i18n/locales";
import { getSiteBaseUrl } from "@/lib/i18n/paths";
import { SITE_BRAND_NAME } from "@/lib/siteContact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_BRAND_NAME,
  authors: [{ name: SITE_BRAND_NAME, url: siteUrl }],
  creator: SITE_BRAND_NAME,
  publisher: SITE_BRAND_NAME,
  title: {
    default: STATIC_SEO["/"].title,
    template: "%s",
  },
  description: STATIC_SEO["/"].description,
  keywords: STATIC_SEO["/"].keywords,
  // Canonical + hreflang are set per-page (resolvePageMetadata / blog generateMetadata).
  // Do not put homepage languages here — child pages would inherit them.
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }, { url: "/brand/apple-touch-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/`,
    siteName: SITE_BRAND_NAME,
    title: STATIC_SEO["/"].title,
    description: STATIC_SEO["/"].description,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: SITE_BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: STATIC_SEO["/"].title,
    description: STATIC_SEO["/"].description,
  },
  verification: {
    google: "GWs3ZpEK1vKHSMhz4f1UfC8gsbyv0U2LGwIDOm2AN_0",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={LOCALE_HTML_LANG[locale]}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
