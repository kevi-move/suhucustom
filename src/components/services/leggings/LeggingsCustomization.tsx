"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/leggings/custom-leggings-fabric-options-spandex-polyester-viscose-compression.png",
    highlights: [
      "4-Way Stretch Spandex Blend (180–220 GSM)",
      "Moisture-Wicking Polyester",
      "Buttery Soft Bamboo Viscose",
      "Compression Fabric",
      "High-Shine Metallic Blend",
    ],
    note: "Custom GSM and blends available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Cut",
    image: "/generated/services/leggings/custom-leggings-style-cut-options-high-waisted-capri-pocket.png",
    highlights: [
      "High-Waisted Leggings",
      "Mid-Waisted Leggings",
      "Compression Leggings",
      "Capri & Cropped Leggings",
      "Pocket Options (side / back waist)",
    ],
    note: "Custom patterns supported",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "/generated/services/leggings/custom-leggings-decoration-options-sublimation-heat-transfer-labels.png",
    highlights: [
      "Sublimation Printing (full-color patterns)",
      "Heat Transfer Vinyl",
      "Embroidery (waist/leg logos)",
      "Custom Woven Labels",
      "Reflective Accents (for safety)",
    ],
    note: "Wash-tested for 50+ cycles",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Sizing",
    image: "/generated/services/leggings/custom-leggings-colors-sizing-printed-pattern-plus-size.png",
    highlights: [
      "Pantone-matched solid colors",
      "Heather blends & custom printed patterns",
      "Sizes XS – 4XL",
      "Plus size options available",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/leggings/custom-leggings-packaging-options-polybag-hangtag-mailer.png",
    highlights: [
      "Individual polybag packaging",
      "Custom hang tags (with size/fabric labels)",
      "Branded poly mailers",
      "Retail-ready leggings packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function LeggingsCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Leggings" />
  );
}
