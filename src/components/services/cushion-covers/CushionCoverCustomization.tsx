"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/cushion-covers/custom-cushion-cover-fabric-options-velvet-linen-polyester.png",
    highlights: [
      "Velvet — soft, luxurious sheen",
      "Linen — natural, textured look",
      "Cotton Canvas — durable & printable",
      "Outdoor Polyester — UV & water resistant",
    ],
    note: "Custom fabric blends available",
    cta: "View Fabric Options",
  },
  {
    id: "size",
    category: "Size & Shape",
    image: "/generated/services/cushion-covers/custom-cushion-cover-size-shape-options-square-round-bolster.png",
    highlights: [
      "Square — 45×45 cm / 50×50 cm",
      "Rectangular — 30×50 cm / 40×60 cm",
      "Round — 40 cm / 50 cm diameter",
      "Custom shapes — bolster, lumbar, etc.",
    ],
    note: "Custom dimensions supported",
    cta: "View Size Options",
  },
  {
    id: "decoration",
    category: "Printing & Embroidery",
    image: "/generated/services/cushion-covers/custom-cushion-cover-printing-embroidery-decoration-options.png",
    highlights: [
      "Digital printing — unlimited colors",
      "Screen printing — solid designs",
      "Hand embroidery & machine embroidery",
      "Appliqué, beading, and tufting",
    ],
    note: "Wash-tested for colorfastness",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Patterns",
    image: "/generated/services/cushion-covers/custom-cushion-cover-colors-patterns-botanical-geometric-abstract.png",
    highlights: [
      "Pantone-matched solid colors",
      "Botanical, geometric, abstract patterns",
      "Custom artwork & photo prints",
      "Seasonal & trend collections",
    ],
    note: "Design assistance available",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/cushion-covers/custom-cushion-cover-packaging-options-polybag-belly-band-gift-box.png",
    highlights: [
      "Individual polybag packaging",
      "Custom belly band & hang tags",
      "Gift box packaging (single or set)",
      "Retail-ready shelf display packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function CushionCoverCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Cushion Covers" />
  );
}
