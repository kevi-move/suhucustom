/** Default CMS content for /about-us */
export const ABOUT_US_PLACEHOLDER = "/about-us/placeholder.svg";

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
  cta: {
    eyebrow: "Get Started",
    title: "Let's Build Your Next Apparel Collection",
    subtitle:
      "Whether you need custom hoodies, caps, gloves, or uniforms, we're ready to help you bring your ideas into production.",
    primaryCtaText: "Start Your Project",
    primaryCtaHref: "/contact-us",
    secondaryCtaText: "Talk to Our Team",
    secondaryCtaHref: "/contact-us",
    backgroundImage: "/generated/about-us/custom-apparel-collection-sample-room-cta-background.png",
  },
};

export function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
