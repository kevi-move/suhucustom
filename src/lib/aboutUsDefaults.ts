/** Default CMS content for /about-us */
export const ABOUT_US_PLACEHOLDER = "/about-us/placeholder.svg";

/** Shared FAQ copy used on About Us and Home. */
export const FAQ_DEFAULTS = {
  eyebrow: "Support",
  title: "Frequently Asked Questions",
  q1: "How Can I Communicate With Your Team?",
  a1: "You can contact us by email or submit the inquiry form on our website. We’ll follow up through the contact method you provide, such as WhatsApp or email, to discuss your product requirements.",
  q2: "How Do I Get a Quote?",
  a2: "Send us your product details, design, reference images, tech pack, quantity, materials, or any other requirements you have. We’ll review the information and discuss the details with you before preparing a quote.",
  q3: "How Can I Place an Order?",
  a3: "Once your product requirements, sample, pricing, and production details are confirmed, we can proceed with the order and production.",
  q4: "What Payment Methods Do You Accept?",
  a4: "We accept bank transfers and PayPal. You can also place orders through our Alibaba store if you prefer to use Alibaba for the transaction.",
  q5: "Can I Order Through Alibaba?",
  a5: "Yes. We have an Alibaba store and can process orders through the Alibaba platform.",
  q6: "Can I Send You My Own Design?",
  a6: "Yes. You can send us your design, tech pack, reference images, measurements, or product samples. We’ll review your requirements and discuss how to develop the product.",
  q7: "Do You Make Products Other Than Clothing?",
  a7: "Yes. We work with a range of custom soft goods, including apparel, gloves, hats, bags, socks, bedding, home textiles, and other textile products.",
} as const;

export const ABOUT_US_DEFAULTS: Record<string, unknown> = {
  hero: {
    eyebrow: "About SuhuCustom",
    title: "Built by Two Sisters Who Know Garment Manufacturing Inside Out",
    subtitle:
      "We help brands, startups, and creators turn apparel ideas into high-quality custom products - from hoodies and caps to gloves and uniforms.",
    heroImage: "/generated/about-us/suhucustom-about-us-founders-garment-manufacturing-hero.png",
  },
  story: {
    eyebrow: "Our Story",
    paragraph1:
      "SuhuCustom started with two sisters who grew up around garment factories in Humen, Dongguan - one of China's largest apparel manufacturing hubs.",
    paragraph2:
      "After years of working with fabric suppliers, sampling teams, and production factories, we realized many overseas brands struggled to find reliable partners for custom apparel production.",
    challenges:
      "Some suppliers communicated slowly.\nSome delivered inconsistent quality.\nOthers simply couldn't handle small or growing brands.",
    paragraph3:
      "So we built SuhuCustom to make apparel manufacturing easier, faster, and more transparent.",
    paragraph4:
      "Today, we help clients worldwide create custom hoodies, hats, gloves, workwear, and more - with flexible MOQs, hands-on support, and reliable production.",
    image: "/generated/about-us/suhucustom-two-sisters-garment-factory-story-dongguan.png",
  },
  humen: {
    eyebrow: "Why Humen, Dongguan Matters",
    title: "Why We Manufacture in Humen",
    intro:
      "Located in Humen, Dongguan, we work closely with experienced garment factories, fabric markets, embroidery workshops, and printing suppliers.",
    benefitsIntro: "This gives us:",
    benefits:
      "Faster sampling\nBetter material sourcing\nFlexible production capacity\nStable lead times\nCompetitive pricing",
    closing:
      "From startup streetwear brands to corporate uniform orders, we help clients move from idea to production efficiently.",
    image: ABOUT_US_PLACEHOLDER,
  },
  factory: {
    eyebrow: "Factory & Production",
    title: "Inside Our Production Process",
    intro:
      "We work with experienced manufacturing teams to ensure every order meets quality and delivery expectations.",
    capabilitiesIntro: "Our production network supports:",
    capabilities:
      "Custom apparel\nEmbroidery & printing\nPrivate label manufacturing\nSmall-batch and bulk orders\nPackaging & labeling",
    closing:
      "Every order goes through sampling, production checks, and final inspection before shipping.",
    image: "/generated/about-us/suhucustom-small-garment-production-process-quality-inspection.png",
  },
  team: {
    eyebrow: "Our Team",
    title: "Meet the Team",
    paragraph1:
      "At SuhuCustom, we believe good manufacturing starts with good communication.",
    paragraph2:
      "As a small and hands-on team, we work closely with every client throughout sampling and production.",
    paragraph3:
      "From fabric sourcing to shipment updates, we stay involved in every step.",
    image: "/generated/about-us/suhucustom-custom-apparel-team-client-communication.png",
  },
  company: {
    eyebrow: "About the Company",
    title: "Learn More about our company",
    body: "Founded in 2025, SuhuCustom is based in Humen, Dongguan, China, with a 50-square-meter workshop and a team backed by 5 years of marketing experience and 10 years of international trade experience. Beyond our own workshop, we manage a network of manufacturing suppliers to support different product types, order volumes, and production requirements.",
    image: ABOUT_US_PLACEHOLDER,
    stat1Label: "Team Members",
    stat2Label: "Workshop",
    stat3Label: "Years International Trade",
    stat4Label: "Materials",
    stat5Label: "Manufacturing Suppliers",
    teamEyebrow: "Our People",
    teamTitle: "Meet Our Team",
    members: {
      kevi: {
        name: "Kevi",
        role: "Marketing & Growth",
        bio: "Handles SuhuCustom’s website, SEO, content, and marketing.",
        image: ABOUT_US_PLACEHOLDER,
      },
      carki: {
        name: "Carki",
        role: "Business Development",
        bio: "Works with customers, understands their requirements, and coordinates projects.",
        image: ABOUT_US_PLACEHOLDER,
      },
      chenxiaomei: {
        name: "Chenxiaomei",
        role: "Product Development",
        bio: "Helps turn product ideas and specifications into workable products.",
        image: ABOUT_US_PLACEHOLDER,
      },
      wangyi: {
        name: "Wangyi",
        role: "Sampling",
        bio: "Coordinates sample development and follows product details through the sampling stage.",
        image: ABOUT_US_PLACEHOLDER,
      },
      linzhongshu: {
        name: "Linzhongshu",
        role: "Production",
        bio: "Coordinates with suppliers and follows orders through production.",
        image: ABOUT_US_PLACEHOLDER,
      },
      chenyike: {
        name: "Chen Yike",
        role: "Quality & Operations",
        bio: "Handles quality checks, order coordination, packing, and shipment preparation.",
        image: ABOUT_US_PLACEHOLDER,
      },
    },
  },
  howToWork: {
    eyebrow: "Our Process",
    title: "How to Work With Us",
    step1Title: "Tell Us What You Need",
    step1Body:
      "Share your design, tech pack, reference image, specifications or simply your idea.",
    step2Title: "Product Review",
    step2Body:
      "We review the requirements, materials, construction and production details.",
    step3Title: "Sampling",
    step3Body: "A sample is developed for you to review and adjust.",
    step4Title: "Production",
    step4Body: "Once the sample is approved, we move into bulk production.",
    step5Title: "QC & Delivery",
    step5Body: "Products are checked before shipment and prepared for delivery.",
  },
  products: {
    title: "What Can We Make for You?",
    subtitle:
      "From a simple idea to a finished custom product, we help bring your designs into production.",
  },
  faqs: FAQ_DEFAULTS,
  cta: {
    eyebrow: "Get Started",
    title: "Let's Build Your Next Apparel Collection",
    subtitle:
      "Whether you need custom hoodies, caps, gloves, or uniforms, we're ready to help you bring your ideas into production.",
    primaryCtaText: "Start Your Project",
    primaryCtaHref: "/contact-us/",
    secondaryCtaText: "Talk to Our Team",
    secondaryCtaHref: "/contact-us/",
    backgroundImage: "/generated/about-us/custom-apparel-collection-sample-room-cta-background.png",
  },
};

export function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
