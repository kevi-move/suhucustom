"use client";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutProducts from "@/components/about/AboutProducts";
import AboutCompany from "@/components/about/AboutCompany";
import AboutFactory from "@/components/about/AboutFactory";
import AboutHowToWork from "@/components/about/AboutHowToWork";
import AboutFAQ from "@/components/about/AboutFAQ";
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
        {/* 1. 首屏 */}
        <AboutHero />
        {/* 2. 故事 */}
        <AboutStory />
        {/* 3. 我们提供的服务 */}
        <AboutProducts />
        {/* 4. 工厂介绍 + 员工介绍 */}
        <AboutCompany />
        {/* 5. Inside Our Production Process */}
        <AboutFactory />
        {/* 6. 合作流程 */}
        <AboutHowToWork />
        {/* 7. FAQs */}
        <AboutFAQ />
        {/* 8. 底部 CTA */}
        <AboutCTA />
      </main>
      {canEdit && <PageEditToolbar />}
    </CMSProvider>
  );
}
