import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { LEGAL_LAST_UPDATED, privacyPolicySections } from "@/lib/legalContent";
import { buildPageMetadata } from "@/lib/seoDefaults";

export const metadata: Metadata = {
  ...buildPageMetadata("/privacy-policy"),
  robots: { index: false, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={privacyPolicySections}
    />
  );
}
