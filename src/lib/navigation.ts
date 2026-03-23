// 导航配置 - Suhu Custom 官网
// 服务分类 (用于 Mega Menu)

export type ServiceItem = {
  slug: string;
  nameEn: string;
  nameZh: string;
};

export type ServiceGroup = {
  titleEn: string;
  titleZh: string;
  items: ServiceItem[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    titleEn: "Tops & Activewear",
    titleZh: "上装与运动",
    items: [
      { slug: "t-shirts", nameEn: "T-shirts", nameZh: "T恤衫" },
      { slug: "hoodies-sweatshirts", nameEn: "Hoodies & Sweatshirts", nameZh: "连帽衫/运动衫" },
      { slug: "activewear-athleisure", nameEn: "Activewear & Athleisure", nameZh: "运动与休闲服" },
      { slug: "gym-sportswear", nameEn: "Gym & Sportswear", nameZh: "专业运动服" },
    ],
  },
  {
    titleEn: "Bottoms & Underwear",
    titleZh: "下装与内衣",
    items: [
      { slug: "leggings", nameEn: "Leggings", nameZh: "紧身裤" },
      { slug: "jeans-denim", nameEn: "Jeans & Denim", nameZh: "牛仔系列" },
      { slug: "underwear-bras", nameEn: "Underwear & Bras", nameZh: "内衣/胸罩" },
      { slug: "swimwear", nameEn: "Swimwear", nameZh: "泳装" },
    ],
  },
  {
    titleEn: "Accessories & Headwear",
    titleZh: "配饰与头部",
    items: [
      { slug: "hats-headwear", nameEn: "Hats & Headwear", nameZh: "帽子" },
      { slug: "socks", nameEn: "Socks", nameZh: "袜子" },
      { slug: "neck-gaiters", nameEn: "Neck Gaiters", nameZh: "颈套" },
      { slug: "leather-goods", nameEn: "Leather Goods", nameZh: "皮革制品" },
    ],
  },
  {
    titleEn: "Specialized & Home",
    titleZh: "专业定制与家居",
    items: [
      { slug: "uniforms", nameEn: "Uniforms", nameZh: "制服定制" },
      { slug: "baby-kids-clothing", nameEn: "Baby & Kids Clothing", nameZh: "婴童装" },
      { slug: "towels", nameEn: "Towels", nameZh: "毛巾" },
      { slug: "cushion-covers", nameEn: "Cushion Covers", nameZh: "靠垫套" },
    ],
  },
];

export const customizationItems = [
  { slug: "printing", nameEn: "Printing", nameZh: "印花" },
  { slug: "embroidery", nameEn: "Embroidery", nameZh: "刺绣" },
  { slug: "private-label", nameEn: "Private Label", nameZh: "自有品牌" },
  { slug: "tech-pack-design", nameEn: "Tech Pack Design", nameZh: "技术包设计" },
];

export const mainNavItems = [
  { href: "/", label: "Home", type: "link" as const },
  { href: "/services", label: "Services", type: "mega" as const },
  { href: "/customization", label: "Customization", type: "dropdown" as const },
  { href: "/blog", label: "Blog", type: "dropdown" as const },
  { href: "/company", label: "Company", type: "dropdown" as const },
  { href: "/contact-us", label: "Contact Us", type: "button" as const },
];

export const companyDropdownItems = [
  { href: "/about-us", label: "About Us" },
  { href: "/company/case-studies", label: "Case Studies" },
];
