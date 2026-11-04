import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteBaseUrl } from "@/lib/i18n/paths";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerStore = await headers();
  const host = (
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    ""
  )
    .split(",")[0]
    .split(":")[0]
    .toLowerCase();
  // The old production alias must be crawlable so Google can see its redirects.
  // Only independent preview deployments are blocked.
  if (host.endsWith(".vercel.app") && host !== "suhucustom.vercel.app") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const base = getSiteBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/search/",
          "/*/search/",
          "/privacy-policy/",
          "/*/privacy-policy/",
          "/terms-and-conditions/",
          "/*/terms-and-conditions/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
