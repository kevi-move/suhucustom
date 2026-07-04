import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { LEGAL_LAST_UPDATED, privacyPolicySections } from "@/lib/legalContent";
import { buildPageMetadata } from "@/lib/seoDefaults";

export const metadata = buildPageMetadata("/privacy-policy");

export default function PrivacyPolicy() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={privacyPolicySections}
    />
  );
}
