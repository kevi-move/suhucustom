import type { Metadata } from "next";
import { getPageContent } from "@/lib/pageContent";
import { getCmsModeEnabled } from "@/lib/cmsMode";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";
import HomePageClient from "./HomePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/");
}

export default async function Home() {
  const [{ content: displayContent }, { content: englishContent }, modeEnabled] =
    await Promise.all([
      getPageContent("/"),
      getPageContent("/", "en"),
      getCmsModeEnabled(),
    ]);

  return (
    <HomePageClient
      displayContent={displayContent}
      englishContent={englishContent}
      modeEnabled={modeEnabled}
    />
  );
}
