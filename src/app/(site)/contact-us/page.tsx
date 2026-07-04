import type { Metadata } from "next";
import { getPageContent } from "@/lib/pageContent";
import { getCmsModeEnabled } from "@/lib/cmsMode";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";
import ContactUsPageClient from "./ContactUsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/contact-us");
}

export default async function ContactUsPage() {
  const [{ content: displayContent }, { content: englishContent }, modeEnabled] =
    await Promise.all([
      getPageContent("/contact-us"),
      getPageContent("/contact-us", "en"),
      getCmsModeEnabled(),
    ]);

  return (
    <ContactUsPageClient
      displayContent={displayContent}
      englishContent={englishContent}
      modeEnabled={modeEnabled}
    />
  );
}
