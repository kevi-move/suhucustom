import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seoJsonLd";

export default function SiteJsonLd() {
  const website = getWebSiteJsonLd();
  const organization = getOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
