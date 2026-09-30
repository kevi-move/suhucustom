import {
  companyDropdownItems,
  customizationItems,
  serviceGroups,
} from "@/lib/navigation";
import type { Locale } from "./locales";

type PartialCatalog = Record<string, string>;

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
  ja: withNavigationStrings(JA_BASE, false),
};

/** Built-in UI translations when Supabase cache is empty (no DeepL bootstrap yet). */
export function getStaticUiStrings(locale: Locale): PartialCatalog | null {
  if (locale === "en") return null;
  return STATIC_UI[locale] ?? null;
}
