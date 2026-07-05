"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric & Material",
    image: "YOUR_UNDERWEAR_FABRIC_OPTION_IMAGE_URL",
    highlights: [
      "Modal & Micro-Modal (Ultra Soft)",
      "Organic Cotton (GOTS Certified)",
      "Nylon/Spandex Seamless Knit",
      "Bamboo Viscose — Antibacterial",
    ],
    note: "Custom fabric blends available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Styles & Cuts",
    image: "YOUR_UNDERWEAR_STYLE_IMAGE_URL",
    highlights: [
      "Briefs, Boxers, Trunks, Thongs",
      "Bralettes, Push-Up, Sports Bras",
      "High-Waist, Bikini, Hipster",
      "Matching Sets Available",
    ],
    note: "Custom patterns supported",
    cta: "View Style Options",
  },
  {
    id: "support",
    category: "Support & Structure",
    image: "YOUR_UNDERWEAR_SUPPORT_IMAGE_URL",
    highlights: [
      "Underwire, Wireless, Molded Cup",
      "Adjustable Straps & Closures",
      "Removable Padding Options",
      "Compression & Shaping Panels",
    ],
    note: "Bra engineering expertise",
    cta: "View Support Options",
  },
  {
    id: "color",
    category: "Colors & Prints",
    image: "YOUR_UNDERWEAR_COLOR_IMAGE_URL",
    highlights: [
      "Pantone-Matched Solid Colors",
      "All-Over Sublimation Prints",
      "Lace & Mesh Overlays",
      "Custom Elastic Waistband Prints",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_UNDERWEAR_PACKAGING_IMAGE_URL",
    highlights: [
      "Individual polybag packaging",
      "Custom hang tags & care labels",
      "Branded tissue paper wrapping",
      "Retail-ready gift box sets",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function UnderwearCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Underwear & Bras" />
  );
}
