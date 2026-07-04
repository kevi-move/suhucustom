"use client";

import HomeHero from "@/components/home/HomeHero";
import HomeCategoryNav from "@/components/home/HomeCategoryNav";
import HomeFactoryIntro from "@/components/home/HomeFactoryIntro";
import HomeTrustSection from "@/components/home/HomeTrustSection";
import HomeCaseStudies from "@/components/home/HomeCaseStudies";
import HomeCTASection from "@/components/home/HomeCTASection";
import { CMSProvider } from "@/contexts/CMSContext";
import { PageEditToolbar } from "@/components/cms/PageEditToolbar";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePageClient({
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
      pageSlug="/"
      initialContent={englishContent}
      displayContent={displayContent}
      modeEnabled={canEdit}
    >
      <div className="bg-white">
        <section>
          <HomeHero />
        </section>
        <section>
          <HomeCategoryNav />
        </section>
        <section>
          <HomeFactoryIntro />
        </section>
        <section>
          <HomeTrustSection />
        </section>
        <section>
          <HomeCaseStudies />
        </section>
        <section>
          <HomeCTASection />
        </section>
      </div>
      {canEdit && <PageEditToolbar />}
    </CMSProvider>
  );
}
