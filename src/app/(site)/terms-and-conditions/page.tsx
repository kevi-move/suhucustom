import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { LEGAL_LAST_UPDATED, termsSections } from "@/lib/legalContent";
import { buildPageMetadata } from "@/lib/seoDefaults";

export const metadata = buildPageMetadata("/terms-and-conditions");

export default function TermsAndConditions() {
  return (
    <LegalDocumentLayout
      title="Terms and Conditions"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={termsSections}
    />
  );
}
