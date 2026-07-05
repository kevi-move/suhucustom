"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/activewear-athleisure/custom-activewear-fabric-options-moisture-wicking-spandex.png",
    highlights: [
      "Moisture-Wicking Polyester (150–180 GSM)",
      "4-Way Stretch Spandex Blend",
      "Recycled Polyester Performance Fabric",
      "Quick-Dry Poly-Cotton",
    ],
    note: "Custom GSM and blend ratios available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Cut",
    image: "/generated/services/activewear-athleisure/custom-activewear-style-cut-options-leggings-tanks-sports-bras.png",
    highlights: [
      "High-Waisted Leggings, Compression Leggings",
      "Racerback Tank, Sports Bra, Cropped Active Top",
      "Slim / Regular / Athletic Fit",
      "Custom pattern development available",
    ],
    note: "Samples for each style available",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "/generated/services/activewear-athleisure/custom-activewear-decoration-options-sublimation-heat-transfer.png",
    highlights: [
      "Sublimation Printing (full-color custom patterns)",
      "Screen Printing (up to 8 colors)",
      "Heat Transfer Vinyl",
      "Embroidery & Custom Woven Labels",
    ],
    note: "Wash-tested for 50+ cycles",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Sizing",
    image: "/generated/services/activewear-athleisure/custom-activewear-colors-sizing-options-muted-colorways.png",
    highlights: [
      "Pantone-matched solid colors",
      "Custom printed patterns",
      "Sizes XS – 4XL",
      "Plus size options available",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/activewear-athleisure/custom-activewear-packaging-options-polybag-hangtag-mailer.png",
    highlights: [
      "Individual polybag packaging",
      "Custom hang tags with size/performance labels",
      "Branded poly mailers",
      "Retail-ready activewear packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function ActivewearCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Activewear & Athleisure" />
  );
}
