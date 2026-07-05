"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "material",
    category: "Material",
    image: "/generated/services/towels/custom-towel-material-options-cotton-microfiber-organic.png",
    highlights: [
      "100% Egyptian Cotton (500–900 GSM)",
      "Turkish Cotton — quick-dry & lightweight",
      "Organic Cotton — GOTS certified",
      "Microfiber Blend — ultra-lightweight travel towels",
    ],
    note: "Custom GSM & blend ratios available",
    cta: "View Material Options",
  },
  {
    id: "size",
    category: "Size & Weight",
    image: "/generated/services/towels/custom-towel-size-weight-options-face-hand-bath-beach.png",
    highlights: [
      "Face Towel — 30×30 cm",
      "Hand Towel — 40×70 cm",
      "Bath Towel — 70×140 cm",
      "Beach Towel — 90×180 cm / custom sizes",
    ],
    note: "Custom dimensions supported",
    cta: "View Size Options",
  },
  {
    id: "design",
    category: "Pattern & Design",
    image: "/generated/services/towels/custom-towel-pattern-design-jacquard-dobby-embroidery.png",
    highlights: [
      "Jacquard woven logos & patterns",
      "Dobby border designs",
      "Reactive printed full-color graphics",
      "Embroidered logos & monograms",
    ],
    note: "Design assistance available",
    cta: "View Design Options",
  },
  {
    id: "color",
    category: "Colors & Dyeing",
    image: "/generated/services/towels/custom-towel-colors-dyeing-options-lab-dips-colorways.png",
    highlights: [
      "Reactive dyed solid colors (100+ shades)",
      "Yarn-dyed stripes & patterns",
      "Bleached white for hotel/spa",
      "Pantone color matching for brands",
    ],
    note: "Color fastness 4+ rating guaranteed",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/towels/custom-towel-packaging-options-gift-box-belly-band-bulk.png",
    highlights: [
      "Ribbon-tied bundle packaging",
      "Custom belly band & hang tags",
      "Gift box sets (3-piece, 6-piece)",
      "Bulk hotel/hospitality packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function TowelCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Towels" />
  );
}
