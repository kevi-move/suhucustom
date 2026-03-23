import HomeHero from "@/components/home/HomeHero";
import HomeCategoryNav from "@/components/home/HomeCategoryNav";
import HomeFactoryIntro from "@/components/home/HomeFactoryIntro";
import HomeTrustSection from "@/components/home/HomeTrustSection";
import HomeCaseStudies from "@/components/home/HomeCaseStudies";
import HomeCTASection from "@/components/home/HomeCTASection";

export default function Home() {
  return (
    <div className="bg-white">
      {/* 首屏：信任建立 Hero */}
      <section>
        <HomeHero />
      </section>

      {/* 区块1：核心品类导航 */}
      <section>
        <HomeCategoryNav />
      </section>

      {/* 区块2：工厂核心介绍 */}
      <section>
        <HomeFactoryIntro />
      </section>

      {/* 区块3：信任背书 */}
      <section>
        <HomeTrustSection />
      </section>

      {/* 区块4：Case Studies 案例研究 */}
      <section>
        <HomeCaseStudies />
      </section>

      {/* 区块5：底部 CTA 转化区 */}
      <section>
        <HomeCTASection />
      </section>
    </div>
  );
}
