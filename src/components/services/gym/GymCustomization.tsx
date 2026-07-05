"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/gym-sportswear/custom-gym-sportswear-fabric-options-compression-mesh-spandex.png",
    highlights: [
      "Sweat-Wicking Polyester (160â€?90 GSM)",
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
    image: "/generated/services/gym-sportswear/custom-gym-sportswear-style-cut-options-shirts-shorts-leggings.png",
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
    image: "/generated/services/gym-sportswear/custom-gym-sportswear-decoration-options-sublimation-heat-transfer.png",
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
    image: "/generated/services/gym-sportswear/custom-gym-sportswear-colors-sizing-options-muted-colorways.png",
    highlights: [
      "Pantone-matched solid colors",
      "Custom printed designs",
      "Sizes XS â€?4XL",
      "Plus size options available",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/gym-sportswear/custom-gym-sportswear-packaging-options-polybag-hangtag-mailer.png",
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
