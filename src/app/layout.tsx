import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { STATIC_SEO } from "@/lib/seoDefaults";
import { getRequestLocale } from "@/lib/i18n/server";
import { LOCALE_HTML_LANG } from "@/lib/i18n/locales";
import { buildHreflangAlternates } from "@/lib/i18n/paths";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: STATIC_SEO["/"].title,
    template: "%s",
  },
  description: STATIC_SEO["/"].description,
  keywords: STATIC_SEO["/"].keywords,
  alternates: {
    languages: buildHreflangAlternates("/"),
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
