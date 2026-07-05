"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "YOUR_GYM_FABRIC_OPTION_IMAGE_URL",
    highlights: [
      "Sweat-Wicking Polyester (160–190 GSM)",
      "4-Way Stretch Compression Spandex",
      "Quick-Dry Mesh Blend",
      "Moisture-Wicking Poly-Cotton",
    ],
    note: "Custom fabric blends available upon request",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Cut",
    image: "YOUR_GYM_STYLE_IMAGE_URL",
    highlights: [
      "Compression Shirts",
      'Gym Shorts (7"/9" inseam)',
      "High-Waisted Training Leggings",
      "Gym Tank Tops & Lightweight Workout Jackets",
    ],
    note: "Compression / Regular Fit available",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "YOUR_GYM_DECORATION_IMAGE_URL",
    highlights: [
      "Sublimation Printing (full-color patterns)",
      "Heat Transfer Vinyl",
      "Embroidery (chest/arm logos)",
      "Custom Woven Labels & Reflective Tape (for safety)",
    ],
    note: "Sweat-resistance tested for all prints",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Sizing",
    image: "YOUR_GYM_COLORS_IMAGE_URL",
    highlights: [
      "Pantone-matched solid colors",
      "Custom printed designs",
      "Sizes XS – 4XL",
      "Plus size options available",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_GYM_PACKAGING_IMAGE_URL",
    highlights: [
      "Polybag with custom hang tags",
      "Size/performance labels included",
      "Branded poly mailers",
      "Retail-ready gym wear packaging",
    ],
    note: "Eco-friendly packaging options available",
    cta: "View Packaging Options",
  },
];

export default function GymCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Gym & Sportswear" />
  );
}
