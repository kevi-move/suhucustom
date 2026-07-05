"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric & Tech",
    image: "/generated/services/swimwear/custom-swimwear-fabric-options-recycled-nylon-upf-spandex.png",
    highlights: [
      "Recycled Nylon (ECONYL®)",
      "Chlorine-Resistant Polyester Blend",
      "UPF 50+ Sun Protection Fabric",
      "Quick-Dry Lycra / Spandex",
    ],
    note: "Custom fabric sourcing available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Styles",
    image: "/generated/services/swimwear/custom-swimwear-style-options-bikini-one-piece-rash-guard-trunks.png",
    highlights: [
      "Bikini (Triangle, Bandeau, Halter)",
      "One-Piece & Monokini",
      "Board Shorts & Swim Trunks",
      "Rash Guards & Swim Leggings",
    ],
    note: "Custom patterns supported",
    cta: "View Style Options",
  },
  {
    id: "print",
    category: "Printing & Decoration",
    image: "/generated/services/swimwear/custom-swimwear-printing-decoration-sublimation-foil-labels.png",
    highlights: [
      "Full Sublimation (Unlimited Colors)",
      "Placement Prints & Panels",
      "Metallic Foil & Glitter Effects",
      "Custom Woven Labels & Hang Tags",
    ],
    note: "Wash-tested for 100+ cycles",
    cta: "View Print Options",
  },
  {
    id: "sizing",
    category: "Sizing & Fit",
    image: "/generated/services/swimwear/custom-swimwear-sizing-fit-options-inclusive-adjustable-padding.png",
    highlights: [
      "Sizes XS – 3XL",
      "Cup Sizes A – G",
      "Adjustable Ties & Straps",
      "Removable Padding & Boning",
    ],
    note: "Inclusive size range available",
    cta: "View Sizing Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/swimwear/custom-swimwear-packaging-options-polybag-hanger-beach-pouch.png",
    highlights: [
      "Individual polybag packaging",
      "Custom swing tags with UPF info",
      "Branded bikini hangers",
      "Retail-ready beach pouches",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function SwimwearCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Swimwear" />
  );
}
