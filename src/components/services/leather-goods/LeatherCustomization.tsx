"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "leather",
    category: "Leather Type",
    image: "/generated/services/leather-goods/custom-leather-type-options-full-grain-top-grain-pull-up-vegan.png",
    highlights: [
      "Full-Grain Italian Leather",
      "Top-Grain Cowhide — smooth & durable",
      "Crazy Horse / Pull-Up Leather",
      "Vegan PU Leather — eco-friendly option",
    ],
    note: "Custom tanning & finishes available",
    cta: "View Leather Options",
  },
  {
    id: "hardware",
    category: "Hardware & Fittings",
    image: "/generated/services/leather-goods/custom-leather-hardware-fittings-options-buckles-rivets-zippers.png",
    highlights: [
      "YKK / SBS branded zippers",
      "Solid brass buckles & clasps",
      "Custom-engraved snaps & rivets",
      "Gold, silver, gunmetal, antique brass plating",
    ],
    note: "Custom hardware molds available",
    cta: "View Hardware Options",
  },
  {
    id: "branding",
    category: "Embossing & Branding",
    image: "/generated/services/leather-goods/custom-leather-embossing-branding-options-debossing-foil.png",
    highlights: [
      "Blind debossing (no color)",
      "Gold / Silver foil hot stamping",
      "Laser engraving for precision logos",
      "Custom woven & leather labels",
    ],
    note: "Custom die creation included",
    cta: "View Branding Options",
  },
  {
    id: "color",
    category: "Colors & Finish",
    image: "/generated/services/leather-goods/custom-leather-colors-finish-options-matte-glossy-distressed.png",
    highlights: [
      "Natural vegetable-tanned colors",
      "Aniline & semi-aniline dyeing",
      "Matte, glossy, or distressed finishes",
      "Custom Pantone color matching",
    ],
    note: "Color swatch sampling included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/leather-goods/custom-leather-goods-packaging-options-gift-box-dust-bag.png",
    highlights: [
      "Luxury gift box with magnetic closure",
      "Branded dust bags & tissue wrap",
      "Custom care cards & certificates",
      "Retail-ready display packaging",
    ],
    note: "Premium unboxing experience",
    cta: "View Packaging Options",
  },
];

export default function LeatherCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Leather Goods" />
  );
}
