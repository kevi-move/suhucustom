import type { Metadata } from "next";
import { getPageContent } from "@/lib/pageContent";
import { getCmsModeEnabled } from "@/lib/cmsMode";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";
import ServicesPageClient from "./ServicesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/services");
}

export default async function ServicesPage() {
  const [{ content: displayContent }, { content: englishContent }, modeEnabled] =
    await Promise.all([
      getPageContent("/services"),
      getPageContent("/services", "en"),
      getCmsModeEnabled(),
    ]);

  return (
    <ServicesPageClient
      displayContent={displayContent}
      englishContent={englishContent}
      modeEnabled={modeEnabled}
    />
  );
}
