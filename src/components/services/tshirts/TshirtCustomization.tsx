"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/t-shirts/custom-t-shirt-fabric-options-cotton-polyester-bamboo.png",
    highlights: [
      "100% Ring-Spun Cotton (180–220 GSM)",
      "Poly-Cotton Blend for durability",
      "Moisture-Wicking Polyester",
      "Bamboo Viscose — eco-friendly & soft",
    ],
    note: "Custom GSM available",
    cta: "View Fabric Options",
  },
  {
    id: "fit",
    category: "Fit & Cut",
    image: "/generated/services/t-shirts/custom-t-shirt-fit-cut-options-blank-silhouettes.png",
    highlights: [
      "Crew Neck, V-Neck, Scoop Neck",
      "Slim Fit, Regular Fit, Relaxed Fit",
      "Short Sleeve / Long Sleeve",
      "Oversized & Drop-Shoulder available",
    ],
    note: "Custom patterns supported",
    cta: "View Fit Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "/generated/services/t-shirts/custom-t-shirt-decoration-options-screen-print-embroidery.png",
    highlights: [
      "Screen Printing (up to 8 colors)",
      "Direct-to-Garment (DTG)",
      "Embroidery (3D / Flat)",
      "Heat Transfer & Custom Woven Labels",
    ],
    note: "Wash-tested for 50+ cycles",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Sizing",
    image: "/generated/services/t-shirts/custom-t-shirt-colors-sizing-custom-colorways.png",
    highlights: [
      "Pantone-matched solid colors",
      "Sizes XS – 4XL",
      "Plus size options available",
      "Custom colorways for 500+ MOQ",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/t-shirts/custom-t-shirt-packaging-options-polybag-hangtag-box.png",
    highlights: [
      "Individual polybag packaging",
      "Custom hang tags & care labels",
      "Branded poly mailers",
      "Retail-ready gift box packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function TshirtCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="T-shirts" />
  );
}
