"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric & Material",
    image: "YOUR_BABYKIDS_FABRIC_IMAGE_URL",
    highlights: [
      "100% Organic Cotton",
      "Soft Interlock Cotton",
      "Bamboo Viscose",
      "Lightweight Fleece",
      "Breathable Cotton Jersey",
      "Thermal Knit (Winter)",
      "Muslin Cotton (Baby)",
    ],
    note: "OEKO-TEX Class 1 and skin-safe options available",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Style & Age Range",
    image: "YOUR_BABYKIDS_STYLE_AGE_IMAGE_URL",
    highlights: [
      "Newborn Onesies & Rompers",
      "Baby Footies",
      "Toddler Tees & Bottoms",
      "Kids Hoodies & Sweatpants",
      "Pajama Sets",
      "Seasonal Tops",
      "Gender-Neutral Styles",
      "Sizes Newborn - 14 Youth",
    ],
    note: "Covers newborn, infant, toddler, and youth ranges",
    cta: "View Style Options",
  },
  {
    id: "safety",
    category: "Safety & Comfort Details",
    image: "YOUR_BABYKIDS_SAFETY_COMFORT_IMAGE_URL",
    highlights: [
      "Tagless Interior",
      "Flatlock Stitching",
      "Soft Snap Closures",
      "Stretch Neck Openings",
      "Gentle Elastic Waistbands",
      "Pre-Shrunk Fabric",
      "Non-Toxic Dyes",
      "Choke-Hazard Free Design",
    ],
    note: "Built for baby-safe and child-comfort-first wear",
    cta: "View Safety Options",
  },
  {
    id: "branding",
    category: "Branding & Design",
    image: "YOUR_BABYKIDS_BRANDING_IMAGE_URL",
    highlights: [
      "Water-Based Printing (Cartoons/Logos)",
      "Tagless Heat-Transfer Branding",
      "Soft Backed Embroidery",
      "Woven Outer Labels",
      "Custom Pantone Colors",
      "Fun Prints & Solid Colors",
    ],
    note: "Child-safe branding materials with wash durability",
    cta: "View Branding Options",
  },
  {
    id: "packaging",
    category: "Sizing & Packaging",
    image: "YOUR_BABYKIDS_PACKAGING_IMAGE_URL",
    highlights: [
      "Newborn, 0-3M, 3-6M, 6-12M, 18-24M, 2T-14 Youth",
      "Individual Polybag Packaging",
      "Soft Tissue Wrapping",
      "Branded Hang Tags",
      "Retail-Ready & Bulk Packaging",
    ],
    note: "Optimized for boutique, retail, and wholesale shipment",
    cta: "View Packaging Options",
  },
];

export default function BabyKidsCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Baby & Kids Clothing" />
  );
}
