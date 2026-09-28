import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/i18n/paths";

export default function robots(): MetadataRoute.Robots {
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
          "/search",
          "/*/search",
          "/privacy-policy",
          "/*/privacy-policy",
          "/terms-and-conditions",
          "/*/terms-and-conditions",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
