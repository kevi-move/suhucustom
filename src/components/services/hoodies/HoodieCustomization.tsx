"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric",
    image: "/generated/services/hoodies-sweatshirts/custom-hoodie-fabric-options-cotton-fleece-recycled-polyester.png",
    highlights: [
      "100% Cotton Fleece (280–350 GSM)",
      "Poly-Cotton Blend for comfort & durability",
      "Recycled Polyester Fleece — eco-friendly",
      "Thermal Lined Fleece for cold-weather styles",
    ],
    note: "Custom GSM & blends available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Cut",
    image: "/generated/services/hoodies-sweatshirts/custom-hoodie-style-cut-options-pullover-zip-up-sweatshirt.png",
    highlights: [
      "Pullover Hoodie / Zip-Up Hoodie",
      "Crew Neck Sweatshirt (no hood)",
      "Hood with/without drawstring",
      "Kangaroo Pocket / Side Pockets",
    ],
    note: "Custom patterns & fits supported",
    cta: "View Style Options",
  },
  {
    id: "decoration",
    category: "Decoration",
    image: "/generated/services/hoodies-sweatshirts/custom-hoodie-decoration-options-puff-embroidery-screen-print.png",
    highlights: [
      "Embroidery (3D puff / flat stitch)",
      "Screen Printing (up to 8 colors)",
      "Direct-to-Garment (DTG) for complex designs",
      "Appliqué, Custom Woven Labels, Drawstring Tips",
    ],
    note: "Wash-tested for 50+ cycles",
    cta: "View Decoration Options",
  },
  {
    id: "color",
    category: "Colors & Sizing",
    image: "/generated/services/hoodies-sweatshirts/custom-hoodie-colors-sizing-heather-plus-size-options.png",
    highlights: [
      "Pantone-matched solid colors",
      "Heather blends & two-tone options",
      "Sizes XS – 4XL",
      "Plus size options available",
    ],
    note: "Color lab dipping included",
    cta: "View Color Options",
  },
  {
    id: "packaging",
    category: "Packaging",
    image: "/generated/services/hoodies-sweatshirts/custom-hoodie-packaging-options-polybag-hangtag-mailer.png",
    highlights: [
      "Individual polybag packaging",
      "Custom hang tags & care labels",
      "Branded poly mailers",
      "Retail-ready packaging options",
    ],
    note: "Eco-friendly options available",
    cta: "View Packaging Options",
  },
];

export default function HoodieCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Hoodies & Sweatshirts" />
  );
}
