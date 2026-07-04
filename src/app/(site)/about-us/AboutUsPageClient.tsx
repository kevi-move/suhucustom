"use client";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutHumen from "@/components/about/AboutHumen";
import AboutFactory from "@/components/about/AboutFactory";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";
import { CMSProvider } from "@/contexts/CMSContext";
import { PageEditToolbar } from "@/components/cms/PageEditToolbar";
import { useAuth } from "@/contexts/AuthContext";

export default function AboutUsPageClient({
  displayContent,
  englishContent,
  modeEnabled,
}: {
  displayContent: Record<string, unknown>;
  englishContent: Record<string, unknown>;
  modeEnabled: boolean;
}) {
  const { isAdmin } = useAuth();
  const canEdit = isAdmin && modeEnabled;

  return (
    <CMSProvider
      pageSlug="/about-us"
      initialContent={englishContent}
      displayContent={displayContent}
      modeEnabled={canEdit}
    >
      <main className="bg-white">
        <AboutHero />
        <AboutStory />
        <AboutHumen />
        <AboutFactory />
        <AboutTeam />
        <AboutCTA />
      </main>
      {canEdit && <PageEditToolbar />}
    </CMSProvider>
  );
}
