"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "material",
    category: "Materials",
    image: "YOUR_HAT_MATERIAL_OPTION_IMAGE_URL",
    highlights: [
      "Cotton Twill (Structured)",
      "Wool Blend (Premium Feel)",
      "Polyester Mesh (Breathable)",
      "Corduroy & Suede Options",
    ],
    note: "Custom material sourcing available",
    cta: "View Material Options",
  },
  {
    id: "style",
    category: "Styles & Shapes",
    image: "YOUR_HAT_STYLE_IMAGE_URL",
    highlights: [
      "Snapback, Fitted, Dad Hat",
      "Trucker, 5-Panel, Bucket Hat",
      "Beanie, Cuffed, Pom-Pom",
      "Visor, Military, Fedora",
    ],
    note: "Custom shapes supported",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "YOUR_HAT_DECO_IMAGE_URL",
    highlights: [
      "3D Puff Embroidery",
      "Flat Embroidery (up to 12 colors)",
      "Screen Print & Heat Transfer",
      "Woven / PVC / Leather Patches",
    ],
    note: "Wash-tested for durability",
    cta: "View Decoration Options",
  },
  {
    id: "closure",
    category: "Closures & Sizing",
    image: "YOUR_HAT_CLOSURE_IMAGE_URL",
    highlights: [
      "Plastic Snap Closure",
      "Leather Strap with Metal Buckle",
      "Elastic Fitted Band",
      "Adjustable Velcro Strap",
    ],
    note: "One-size & fitted options",
    cta: "View Closure Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_HAT_PACKAGING_IMAGE_URL",
    highlights: [
      "Individual polybag packaging",
      "Custom sticker seal labels",
      "Branded hat boxes",
      "Retail-ready display packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function HatCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Hats & Headwear" />
  );
}
