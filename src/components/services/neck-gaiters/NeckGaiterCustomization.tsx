"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "YOUR_NG_FABRIC_IMAGE_URL",
    highlights: [
      "Polyester Microfiber (UPF 50+)",
      "Merino Wool Blend — cold weather",
      "Bamboo / Spandex — eco-stretch",
      "Fleece-Lined — insulated warmth",
    ],
    note: "Custom blends available",
    cta: "View Fabric Options",
  },
  {
    id: "size",
    category: "Size & Fit",
    image: "YOUR_NG_SIZE_IMAGE_URL",
    highlights: [
      "Standard Adult (25×50 cm)",
      "Youth / Kids sizes",
      "Extended length for balaclava style",
      "Adjustable drawstring option",
    ],
    note: "Custom dimensions available",
    cta: "View Size Options",
  },
  {
    id: "printing",
    category: "Printing",
    image: "YOUR_NG_PRINTING_IMAGE_URL",
    highlights: [
      "360° Dye-Sublimation Printing",
      "Photographic full-color graphics",
      "Pantone color matching",
      "Edge-to-edge seamless prints",
    ],
    note: "Wash-tested 50+ cycles",
    cta: "View Printing Options",
  },
  {
    id: "color",
    category: "Colors & Patterns",
    image: "YOUR_NG_COLOR_IMAGE_URL",
    highlights: [
      "Unlimited color sublimation",
      "Camo, paisley, geometric patterns",
      "Custom artwork & brand logos",
      "Seasonal & themed collections",
    ],
    note: "Design assistance available",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "YOUR_NG_PACKAGING_IMAGE_URL",
    highlights: [
      "Individual polybag with header card",
      "Custom cardboard sleeve packaging",
      "Retail-ready hang packaging",
      "Bulk bundle packaging",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function NeckGaiterCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Neck Gaiters" />
  );
}
