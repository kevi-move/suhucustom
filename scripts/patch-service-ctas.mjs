import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.resolve(__dirname, "../src/components/services");

const CTA_MAP = {
  TshirtCTA: {
    file: "tshirts/TshirtCTA.tsx",
    category: "T-shirts",
    title: "Ready to Create Your",
    highlight: "Custom T-Shirts",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  HoodieCTA: {
    file: "hoodies/HoodieCTA.tsx",
    category: "Hoodies",
    title: "Ready to Create Your",
    highlight: "Custom Hoodies",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  JeansCTA: {
    file: "jeans/JeansCTA.tsx",
    category: "Jeans",
    title: "Ready to Create Your",
    highlight: "Custom Jeans",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  ActivewearCTA: {
    file: "activewear/ActivewearCTA.tsx",
    category: "Activewear",
    title: "Ready to Create Your",
    highlight: "Custom Activewear",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  GymCTA: {
    file: "gym/GymCTA.tsx",
    category: "Gym Sportswear",
    title: "Ready to Create Your",
    highlight: "Custom Gym Wear",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  LeggingsCTA: {
    file: "leggings/LeggingsCTA.tsx",
    category: "Leggings",
    title: "Ready to Create Your",
    highlight: "Custom Leggings",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  SockCTA: {
    file: "socks/SockCTA.tsx",
    category: "Socks",
    title: "Ready to Create Your",
    highlight: "Custom Socks",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  NeckGaiterCTA: {
    file: "neck-gaiters/NeckGaiterCTA.tsx",
    category: "Neck Gaiters",
    title: "Ready to Create Your",
    highlight: "Custom Neck Gaiters",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  LeatherCTA: {
    file: "leather-goods/LeatherCTA.tsx",
    category: "Leather Goods",
    title: "Ready to Create Your",
    highlight: "Custom Leather Products",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  TowelCTA: {
    file: "towels/TowelCTA.tsx",
    category: "Towels",
    title: "Ready to Create Your",
    highlight: "Custom Towels",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  CushionCoverCTA: {
    file: "cushion-covers/CushionCoverCTA.tsx",
    category: "Cushion Covers",
    title: "Ready to Create Your",
    highlight: "Custom Cushion Covers",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  UnderwearCTA: {
    file: "underwear-bras/UnderwearCTA.tsx",
    category: "Underwear & Bras",
    title: "Ready to Create Your",
    highlight: "Custom Underwear",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  SwimwearCTA: {
    file: "swimwear/SwimwearCTA.tsx",
    category: "Swimwear",
    title: "Ready to Create Your",
    highlight: "Custom Swimwear",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  HatCTA: {
    file: "hats-headwear/HatCTA.tsx",
    category: "Hats & Headwear",
    title: "Ready to Create Your",
    highlight: "Custom Headwear",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  UniformCTA: {
    file: "uniforms/UniformCTA.tsx",
    category: "Uniforms",
    title: "Ready to Create Your",
    highlight: "Custom Uniforms",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
  BabyKidsCTA: {
    file: "baby-kids-clothing/BabyKidsCTA.tsx",
    category: "Baby & Kids Clothing",
    title: "Ready to Create Your",
    highlight: "Custom Kids Wear",
    subtitle: "Get a free quote and sample in 3 days — no obligation to order.",
  },
};

for (const [exportName, meta] of Object.entries(CTA_MAP)) {
  const componentName = exportName.replace(/CTA$/, "CTA");
  const content = `import ServiceQuoteCTA from "@/components/services/ServiceQuoteCTA";

export default function ${exportName}() {
  return (
    <ServiceQuoteCTA
      productCategory="${meta.category}"
      title="${meta.title}"
      titleHighlight="${meta.highlight}"
      subtitle="${meta.subtitle}"
    />
  );
}
`;
  const target = path.join(servicesDir, meta.file);
  fs.writeFileSync(target, content, "utf8");
  console.log("Updated", meta.file);
}
