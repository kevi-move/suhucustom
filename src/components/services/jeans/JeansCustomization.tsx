"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/jeans-denim/custom-jeans-denim-fabric-options-raw-selvedge-stretch.png",
    highlights: [
      "9-14oz Raw Denim",
      "2-Way Stretch Denim",
      "Recycled Eco Denim",
      "Black Denim, Light/Medium/Heavy Twill",
    ],
    note: "Custom denim weight and blend options available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Cut",
    image: "/generated/services/jeans-denim/custom-jeans-fit-style-options-skinny-slim-wide-leg.png",
    highlights: [
      "Straight Leg, Slim Fit, Skinny, Tapered",
      "Baggy, Wide Leg, and Cargo Denim",
      "Denim Jackets, Denim Shorts, Denim Skirts",
      "Adjustable rise, inseam, and fit profiles",
    ],
    note: "Custom patterns and fit blocks supported",
    cta: "View Style Options",
  },
  {
    id: "finishing",
    category: "Finishing & Details",
    image: "/generated/services/jeans-denim/custom-jeans-washing-finishing-industrial-denim-process.png",
    highlights: [
      "Stone Wash, Acid Wash, Vintage Fade",
      "Distressing, Whiskering, Ripped Details",
      "Patches and embroidery add-ons",
      "Sanding and tonal dye effects",
    ],
    note: "Color and wash consistency testing included",
    cta: "View Finishing Options",
  },
  {
    id: "branding",
    category: "Hardware & Branding",
    image: "/generated/services/jeans-denim/custom-jeans-hardware-detail-options-rivets-zippers-patches.png",
    highlights: [
      "Custom metal buttons, zippers, and rivets",
      "Leather waist patches and woven labels",
      "Embroidery and printed pocket logos",
      "Matching trims and branded details",
    ],
    note: "Hardware and branding are fully customizable",
    cta: "View Branding Options",
  },
  {
    id: "sizing",
    category: "Sizing & Packaging",
    image: "/generated/services/jeans-denim/custom-jeans-packaging-options-polybag-hangtag-gift-box.png",
    highlights: [
      "Sizes XS-4XL with plus size options",
      "Individual polybag packaging",
      "Custom hang tags and branded mailers",
      "Retail-ready packaging options",
    ],
    note: "Custom fold, labeling and carton marking available",
    cta: "View Packaging Options",
  },
];

export default function JeansCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Jeans & Denim" />
  );
}
