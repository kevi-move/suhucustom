"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "yarn",
    category: "Yarn & Material",
    image: "/generated/services/socks/custom-sock-yarn-material-options-cotton-wool-bamboo-nylon.png",
    highlights: [
      "Combed Cotton (80–200 needle count)",
      "Merino Wool — premium warmth",
      "Bamboo Fiber — eco-friendly & breathable",
      "Coolmax / Nylon blends for performance",
    ],
    note: "Custom yarn blends available",
    cta: "View Yarn Options",
  },
  {
    id: "style",
    category: "Length & Style",
    image: "/generated/services/socks/custom-sock-length-style-options-no-show-ankle-crew-knee-high.png",
    highlights: [
      "No-Show / Invisible Socks",
      "Ankle / Quarter Length",
      "Crew / Mid-Calf Socks",
      "Knee-High & Over-the-Calf",
    ],
    note: "Custom lengths available",
    cta: "View Style Options",
  },
  {
    id: "pattern",
    category: "Pattern & Design",
    image: "/generated/services/socks/custom-sock-pattern-design-options-jacquard-sublimation.png",
    highlights: [
      "Full Jacquard Knitting (up to 6 colors)",
      "360° Sublimation Printing",
      "Embroidered logos & icons",
      "Custom woven labels & grip dots",
    ],
    note: "Pantone color matching included",
    cta: "View Pattern Options",
  },
  {
    id: "size",
    category: "Colors & Sizing",
    image: "/generated/services/socks/custom-sock-colors-sizing-options-kids-women-men.png",
    highlights: [
      "Pantone-matched solid or gradient colors",
      "Kids / Women / Men sizing",
      "EU 35–48, US 5–14",
      "Custom size charts for niche markets",
    ],
    note: "Size sampling included",
    cta: "View Size Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/socks/custom-sock-packaging-options-belly-band-header-card-box.png",
    highlights: [
      "Belly band / header card packaging",
      "Custom hang tags & stickers",
      "Gift box & tin packaging",
      "Retail-ready display bundles",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function SockCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Socks" />
  );
}
