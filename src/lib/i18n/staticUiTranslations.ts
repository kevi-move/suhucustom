import {
  companyDropdownItems,
  customizationItems,
  serviceGroups,
} from "@/lib/navigation";
import type { Locale } from "./locales";

type PartialCatalog = Record<string, string>;

const ZH_TW_BASE: PartialCatalog = {
  "nav.home": "首頁",
  "nav.services": "服務項目",
  "nav.customization": "定制工藝",
  "nav.blog": "部落格",
  "nav.resource": "資源",
  "nav.contact": "聯絡我們",
  "nav.allPosts": "全部文章",
  "nav.requestQuote": "立即獲取報價",
  "footer.tagline":
    "高端定制服飾與批發製造——助力全球品牌與零售商。",
  "footer.services": "服務項目",
  "footer.resource": "資源",
  "footer.contact": "聯絡方式",
  "footer.quality": "品質與流程",
  "footer.rights": "版權所有。",
  "footer.privacy": "隱私政策",
  "footer.terms": "條款與條件",
  "footer.viewAllServices": "查看全部服務 →",
  "search.placeholder": "搜尋服務、部落格…",
  "lang.switch": "語言",
  "footer.link.t-shirts": "T恤衫",
  "footer.link.hoodies": "連帽衫/運動衫",
  "footer.link.activewear": "運動服飾",
  "footer.link.about": "關於我們",
  "footer.link.caseStudies": "案例研究",
  "footer.link.contact": "聯絡我們",
  "footer.link.search": "搜尋",
  "nav.custom.printing": "印花",
  "nav.custom.embroidery": "刺繡",
  "nav.custom.private-label": "自有品牌",
  "nav.custom.tech-pack-design": "技術包設計",
  "nav.company./about-us": "關於我們",
  "nav.company./company/case-studies": "案例研究",
};

const JA_BASE: PartialCatalog = {
  "nav.home": "ホーム",
  "nav.services": "サービス",
  "nav.customization": "カスタマイズ",
  "nav.blog": "ブログ",
  "nav.resource": "リソース",
  "nav.contact": "お問い合わせ",
  "nav.allPosts": "すべての記事",
  "nav.requestQuote": "お見積りを依頼",
  "footer.tagline":
    "プレミアムなカスタムアパレル製造で、世界中のブランドと小売業者を支援します。",
  "footer.services": "サービス",
  "footer.resource": "リソース",
  "footer.contact": "連絡先",
  "footer.quality": "品質と工程",
  "footer.rights": "無断転載を禁じます。",
  "footer.privacy": "プライバシーポリシー",
  "footer.terms": "利用規約",
  "footer.viewAllServices": "すべてのサービスを見る →",
  "search.placeholder": "サービス・ブログを検索…",
  "lang.switch": "言語",
  "footer.link.t-shirts": "Tシャツ",
  "footer.link.hoodies": "パーカー・スウェット",
  "footer.link.activewear": "アクティブウェア",
  "footer.link.about": "会社概要",
  "footer.link.caseStudies": "導入事例",
  "footer.link.contact": "お問い合わせ",
  "footer.link.search": "検索",
  "nav.group.Tops & Activewear": "トップス・アクティブウェア",
  "nav.group.Bottoms & Underwear": "ボトムス・下着",
  "nav.group.Accessories & Headwear": "アクセサリー・帽子",
  "nav.group.Specialized & Home": "専門製品・ホーム",
};

const KO_BASE: PartialCatalog = {
  "nav.home": "홈",
  "nav.services": "서비스",
  "nav.customization": "커스터마이징",
  "nav.blog": "블로그",
  "nav.resource": "리소스",
  "nav.contact": "문의하기",
  "nav.allPosts": "전체 글",
  "nav.requestQuote": "즉시 견적 받기",
  "footer.tagline":
    "프리미엄 맞춤 의류 제조로 전 세계 브랜드와 리테일러를 지원합니다.",
  "footer.services": "서비스",
  "footer.resource": "리소스",
  "footer.contact": "연락처",
  "footer.quality": "품질 및 공정",
  "footer.rights": "모든 권리 보유.",
  "footer.privacy": "개인정보 처리방침",
  "footer.terms": "이용 약관",
  "footer.viewAllServices": "전체 서비스 보기 →",
  "search.placeholder": "서비스, 블로그 검색…",
  "lang.switch": "언어",
  "footer.link.t-shirts": "티셔츠",
  "footer.link.hoodies": "후디 & 스웨트셔츠",
  "footer.link.activewear": "액티브웨어",
  "footer.link.about": "회사 소개",
  "footer.link.caseStudies": "사례 연구",
  "footer.link.contact": "문의하기",
  "footer.link.search": "검색",
};

const FR_BASE: PartialCatalog = {
  "nav.home": "Accueil",
  "nav.services": "Services",
  "nav.customization": "Personnalisation",
  "nav.blog": "Blog",
  "nav.resource": "Ressources",
  "nav.contact": "Contact",
  "nav.allPosts": "Tous les articles",
  "nav.requestQuote": "Obtenir un devis",
  "footer.tagline":
    "Fabrication premium de vêtements sur mesure pour les marques et détaillants du monde entier.",
  "footer.services": "Services",
  "footer.resource": "Ressources",
  "footer.contact": "Contact",
  "footer.quality": "Qualité et processus",
  "footer.rights": "Tous droits réservés.",
  "footer.privacy": "Politique de confidentialité",
  "footer.terms": "Conditions générales",
  "footer.viewAllServices": "Voir tous les services →",
  "search.placeholder": "Rechercher services, blog…",
  "lang.switch": "Langue",
  "footer.link.t-shirts": "T-shirts",
  "footer.link.hoodies": "Sweats & hoodies",
  "footer.link.activewear": "Activewear",
  "footer.link.about": "À propos",
  "footer.link.caseStudies": "Études de cas",
  "footer.link.contact": "Contact",
  "footer.link.search": "Recherche",
};

const RU_BASE: PartialCatalog = {
  "nav.home": "Главная",
  "nav.services": "Услуги",
  "nav.customization": "Кастомизация",
  "nav.blog": "Блог",
  "nav.resource": "Ресурсы",
  "nav.contact": "Контакты",
  "nav.allPosts": "Все статьи",
  "nav.requestQuote": "Получить расчёт",
  "footer.tagline":
    "Премиальное производство одежды на заказ для брендов и ритейлеров по всему миру.",
  "footer.services": "Услуги",
  "footer.resource": "Ресурсы",
  "footer.contact": "Контакты",
  "footer.quality": "Качество и процессы",
  "footer.rights": "Все права защищены.",
  "footer.privacy": "Политика конфиденциальности",
  "footer.terms": "Условия использования",
  "footer.viewAllServices": "Все услуги →",
  "search.placeholder": "Поиск услуг, блога…",
  "lang.switch": "Язык",
  "footer.link.t-shirts": "Футболки",
  "footer.link.hoodies": "Худи и свитшоты",
  "footer.link.activewear": "Активная одежда",
  "footer.link.about": "О нас",
  "footer.link.caseStudies": "Кейсы",
  "footer.link.contact": "Контакты",
  "footer.link.search": "Поиск",
};

function withNavigationStrings(base: PartialCatalog, useChineseNames: boolean): PartialCatalog {
  const catalog = { ...base };

  for (const group of serviceGroups) {
    catalog[`nav.group.${group.titleEn}`] = useChineseNames
      ? group.titleZh
      : (catalog[`nav.group.${group.titleEn}`] ?? group.titleEn);
    for (const item of group.items) {
      catalog[`nav.service.${item.slug}`] = useChineseNames ? item.nameZh : item.nameEn;
    }
  }

  for (const item of customizationItems) {
    if (!catalog[`nav.custom.${item.slug}`]) {
      catalog[`nav.custom.${item.slug}`] = useChineseNames ? item.nameZh : item.nameEn;
    }
  }

  for (const item of companyDropdownItems) {
    if (!catalog[`nav.company.${item.href}`]) {
      catalog[`nav.company.${item.href}`] = item.label;
    }
  }

  return catalog;
}

const STATIC_UI: Partial<Record<Exclude<Locale, "en">, PartialCatalog>> = {
  "zh-TW": withNavigationStrings(ZH_TW_BASE, true),
  ja: withNavigationStrings(JA_BASE, false),
  ko: withNavigationStrings(KO_BASE, false),
  fr: withNavigationStrings(FR_BASE, false),
  ru: withNavigationStrings(RU_BASE, false),
};

/** Built-in UI translations when Supabase cache is empty (no DeepL bootstrap yet). */
export function getStaticUiStrings(locale: Locale): PartialCatalog | null {
  if (locale === "en") return null;
  return STATIC_UI[locale] ?? null;
}
