import type { Metadata } from "next";
import { getPageContent } from "@/lib/pageContent";
import { getCmsModeEnabled } from "@/lib/cmsMode";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";
import AboutUsPageClient from "./AboutUsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/about-us");
}

export default async function AboutUsPage() {
  const [{ content: displayContent }, { content: englishContent }, modeEnabled] =
    await Promise.all([
      getPageContent("/about-us"),
      getPageContent("/about-us", "en"),
      getCmsModeEnabled(),
    ]);

  return (
    <AboutUsPageClient
      displayContent={displayContent}
      englishContent={englishContent}
      modeEnabled={modeEnabled}
    />
  );
}
