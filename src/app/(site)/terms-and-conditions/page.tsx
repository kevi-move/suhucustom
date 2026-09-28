import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { LEGAL_LAST_UPDATED, termsSections } from "@/lib/legalContent";
import { buildPageMetadata } from "@/lib/seoDefaults";

export const metadata: Metadata = {
  ...buildPageMetadata("/terms-and-conditions"),
  robots: { index: false, follow: true },
};

export default function TermsAndConditions() {
  return (
    <LegalDocumentLayout
      title="Terms and Conditions"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={termsSections}
    />
  );
}
