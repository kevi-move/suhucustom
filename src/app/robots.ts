import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteBaseUrl } from "@/lib/i18n/paths";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.split(":")[0]?.toLowerCase() ?? "";
  if (host.endsWith(".vercel.app")) {
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
