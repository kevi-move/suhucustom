"use client";

import ServiceCustomizationPanel, {
  type ServiceCustomizationOption,
} from "@/components/services/ServiceCustomizationPanel";

const options: ServiceCustomizationOption[] = [
  {
    id: "fabric",
    category: "Fabric & Material",
    image: "YOUR_UNIFORM_FABRIC_IMAGE_URL",
    highlights: [
      "Wrinkle-Resistant Poly-Cotton Blend",
      "Stain-Repellent Workwear Twill",
      "Moisture-Wicking Performance Fabric",
      "Easy-Care Jersey",
      "Durable Canvas",
      "Soft Scrub Fabric (Healthcare)",
      "Formal Dress Fabric",
    ],
    note: "Built for durability, comfort, and easy maintenance",
    cta: "View Fabric Options",
  },
  {
    id: "style",
    category: "Uniform Styles",
    image: "YOUR_UNIFORM_STYLE_IMAGE_URL",
    highlights: [
      "Corporate Polos & Button-Downs",
      "Hospitality Server & Front Desk Uniforms",
      "Industrial Work Shirts & Pants",
      "Healthcare Scrubs",
      "Retail Team Wear",
      "School & Institutional Uniforms",
      "Custom Team Jackets & Vests",
    ],
    note: "Full-range styles for business and organization needs",
    cta: "View Style Options",
  },
  {
    id: "fit",
    category: "Fit & Function",
    image: "YOUR_UNIFORM_FIT_FUNCTION_IMAGE_URL",
    highlights: [
      "Tailored Professional Fit",
      "Relaxed Workwear Fit",
      "Unisex Sizing",
      "Gender-Specific Fits",
      "Reinforced Pockets",
      "Wrinkle-Resistant Finish",
      "Stain Repellent Treatment",
      "Breathable Vents",
      "Stretch Panels for Mobility",
    ],
    note: "Professional look with all-day comfort and movement",
    cta: "View Fit Options",
  },
  {
    id: "branding",
    category: "Branding & Details",
    image: "YOUR_UNIFORM_BRANDING_IMAGE_URL",
    highlights: [
      "Professional Embroidery (Chest/Sleeve)",
      "Screen Printing",
      "Heat Transfer Logos",
      "Custom Woven Labels",
      "Name Embroidery",
      "Department Badging",
      "Custom Collar & Cuff Detailing",
      "Pantone Color Matching",
    ],
    note: "Durable branding built for repeated laundering",
    cta: "View Branding Options",
  },
  {
    id: "packaging",
    category: "Sizing & Packaging",
    image: "YOUR_UNIFORM_PACKAGING_IMAGE_URL",
    highlights: [
      "Sizes XS-4XL (plus size & tall options available)",
      "Individual Polybag Packaging",
      "Size Labeling",
      "Branded Hang Tags",
      "Retail-Ready & Bulk Shipping Packaging",
    ],
    note: "Optimized for team distribution and bulk logistics",
    cta: "View Packaging Options",
  },
];

export default function UniformCustomization() {
  return (
    <ServiceCustomizationPanel options={options} productCategory="Uniforms" />
  );
}
