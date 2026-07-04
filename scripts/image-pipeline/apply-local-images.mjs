/**
 * Apply images from public/generated to source placeholders.
 * Only maps pages that have dedicated image folders (home, about-us, homepage-seo, 8 services).
 *
 * Usage: node scripts/image-pipeline/apply-local-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "src");
const PUBLIC_GEN = path.join(ROOT, "public", "generated");

/** @param {string} rel path under public/generated */
function p(rel) {
  return `/generated/${rel.replace(/^\/+/, "")}`;
}

/** token → path, scoped replacements: { srcDirs: string[], mapping: Record<string,string> } */
const SCOPED = [
  {
    srcDirs: ["components/home", "app/admin/content"],
    mapping: {
      YOUR_HERO_IMAGE_URL: p("home/hero.png"),
      FACTORY_INTRO_IMAGE_URL: p("home/factory-intro.png"),
      CTA_BACKGROUND_IMAGE_URL: p("home/cta-background.png"),
      CASE_IMAGE_ACTIVEWEAR_URL: p("home/case-activewear.png"),
      CASE_IMAGE_UNDERWEAR_URL: p("home/case-underwear.png"),
      CASE_IMAGE_HOODIES_URL: p("home/case-hoodies.png"),
      CASE_IMAGE_UNIFORMS_URL: p("home/case-uniforms.png"),
      REVIEW_IMAGE_1_URL: p("homepage-seo-images/customer-review-germany-custom-apparel-quality-delivery.png"),
      REVIEW_IMAGE_2_URL: p("homepage-seo-images/customer-review-usa-western-sizing-apparel-samples.png"),
      REVIEW_IMAGE_3_URL: p("homepage-seo-images/customer-review-uk-private-label-hoodie-tech-pack.png"),
      REVIEW_IMAGE_4_URL: p("homepage-seo-images/customer-review-canada-seasonal-activewear-drops.png"),
      REVIEW_IMAGE_5_URL: p("homepage-seo-images/customer-review-france-boutique-apparel-moq-pricing.png"),
      REVIEW_IMAGE_6_URL: p("homepage-seo-images/customer-review-australia-sports-club-bulk-sample-match.png"),
    },
  },
  {
    srcDirs: ["components/services/tshirts"],
    mapping: {
      YOUR_TSHIRT_HERO_IMAGE_URL: p("services/t-shirts/custom-t-shirt-manufacturing-hero-model-right-side.png"),
      YOUR_OVERVIEW_IMAGE_URL: p("services/t-shirts/suhucustom-t-shirt-factory-overview-oem-odm-production.png"),
      YOUR_FABRIC_SOURCING_IMAGE_URL: p("services/t-shirts/custom-t-shirt-premium-fabric-sourcing-cotton-jersey.png"),
      YOUR_STITCHING_IMAGE_URL: p("services/t-shirts/custom-t-shirt-precision-stitching-double-needle-seams.png"),
      YOUR_DECORATION_CRAFT_IMAGE_URL: p("services/t-shirts/custom-t-shirt-printing-embroidery-decoration-craft.png"),
      YOUR_QUALITY_CONTROL_IMAGE_URL: p("services/t-shirts/custom-t-shirt-quality-inspection-qc-measurement.png"),
      YOUR_CUSTOMIZATION_IMAGE_URL: p("services/t-shirts/custom-t-shirt-flexible-customization-fits-sizes-colors.png"),
      YOUR_FABRIC_IMAGE_URL: p("services/t-shirts/custom-t-shirt-fabric-options-cotton-polyester-bamboo.png"),
      YOUR_FIT_CUT_IMAGE_URL: p("services/t-shirts/custom-t-shirt-fit-cut-options-blank-silhouettes.png"),
      YOUR_DECORATION_IMAGE_URL: p("services/t-shirts/custom-t-shirt-decoration-options-screen-print-embroidery.png"),
      YOUR_COLORS_IMAGE_URL: p("services/t-shirts/custom-t-shirt-colors-sizing-custom-colorways.png"),
      YOUR_PACKAGING_IMAGE_URL: p("services/t-shirts/custom-t-shirt-packaging-options-polybag-hangtag-box.png"),
      YOUR_PROCESS_DESIGN_IMAGE_URL: p("services/t-shirts/custom-t-shirt-design-sampling-tech-pack-fabric-swatches.png"),
      YOUR_PROCESS_CUTTING_IMAGE_URL: p("services/t-shirts/custom-t-shirt-fabric-cutting-pattern-table-production.png"),
      YOUR_PROCESS_SEWING_IMAGE_URL: p("services/t-shirts/custom-t-shirt-sewing-assembly-industrial-production-line.png"),
      YOUR_PROCESS_PRINT_IMAGE_URL: p("services/t-shirts/custom-t-shirt-print-embroidery-production-process.png"),
      YOUR_PROCESS_QC_IMAGE_URL: p("services/t-shirts/custom-t-shirt-quality-control-inspection-process.png"),
      YOUR_PROCESS_SHIPPING_IMAGE_URL: p("services/t-shirts/custom-t-shirt-packaging-shipping-export-cartons.png"),
    },
  },
  {
    srcDirs: ["components/services/hoodies"],
    mapping: {
      YOUR_HOODIE_HERO_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-sweatshirt-manufacturing-hero-model-right-side.png"),
      YOUR_HOODIE_OVERVIEW_IMAGE_URL: p("services/hoodies-sweatshirts/suhucustom-hoodie-sweatshirt-factory-overview-oem-odm-production.png"),
      YOUR_HOODIE_FLEECE_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-premium-fleece-sourcing-heavyweight-fabric.png"),
      YOUR_HOODIE_CONSTRUCTION_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-reinforced-construction-seams-rib-cuffs.png"),
      YOUR_HOODIE_DECORATION_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-embroidery-printing-decoration-craft.png"),
      YOUR_HOODIE_QC_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-quality-inspection-qc-measurement.png"),
      YOUR_HOODIE_CUSTOM_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-flexible-customization-styles-fits-colors.png"),
      YOUR_HOODIE_FABRIC_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-fabric-options-cotton-fleece-recycled-polyester.png"),
      YOUR_HOODIE_STYLE_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-style-cut-options-pullover-zip-up-sweatshirt.png"),
      YOUR_HOODIE_DECO_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-decoration-options-puff-embroidery-screen-print.png"),
      YOUR_HOODIE_COLOR_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-colors-sizing-heather-plus-size-options.png"),
      YOUR_HOODIE_PACKAGING_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-packaging-options-polybag-hangtag-mailer.png"),
      YOUR_HOODIE_PROCESS_DESIGN_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-design-sampling-tech-pack-fleece-swatches.png"),
      YOUR_HOODIE_PROCESS_CUTTING_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-fabric-cutting-pattern-table-production.png"),
      YOUR_HOODIE_PROCESS_SEWING_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-sewing-assembly-industrial-production-line.png"),
      YOUR_HOODIE_PROCESS_DECO_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-decoration-application-embroidery-screen-print.png"),
      YOUR_HOODIE_PROCESS_QC_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-quality-control-inspection-process.png"),
      YOUR_HOODIE_PROCESS_SHIPPING_IMAGE_URL: p("services/hoodies-sweatshirts/custom-hoodie-packaging-shipping-export-cartons.png"),
    },
  },
  {
    srcDirs: ["components/services/leggings"],
    mapping: {
      YOUR_LEGGINGS_HERO_IMAGE_URL: p("services/leggings/custom-leggings-manufacturing-hero-model-right-side.png"),
      YOUR_LEGGINGS_OVERVIEW_IMAGE_URL: p("services/leggings/suhucustom-leggings-small-factory-overview-oem-odm-production.png"),
      YOUR_LEGGINGS_FABRIC_IMAGE_URL: p("services/leggings/custom-leggings-premium-stretch-fabric-sourcing-spandex.png"),
      YOUR_LEGGINGS_CONSTRUCTION_IMAGE_URL: p("services/leggings/custom-leggings-flatlock-stitching-high-waistband-construction.png"),
      YOUR_LEGGINGS_BRANDING_IMAGE_URL: p("services/leggings/custom-leggings-branding-design-sublimation-heat-transfer.png"),
      YOUR_LEGGINGS_QC_IMAGE_URL: p("services/leggings/custom-leggings-quality-control-stretch-fit-inspection.png"),
      YOUR_LEGGINGS_CUSTOM_IMAGE_URL: p("services/leggings/custom-leggings-flexible-customization-lengths-pockets-colors.png"),
      YOUR_LEGGINGS_FABRIC_OPT_IMAGE_URL: p("services/leggings/custom-leggings-fabric-options-spandex-polyester-viscose-compression.png"),
      YOUR_LEGGINGS_STYLE_IMAGE_URL: p("services/leggings/custom-leggings-style-cut-options-high-waisted-capri-pocket.png"),
      YOUR_LEGGINGS_DECO_IMAGE_URL: p("services/leggings/custom-leggings-decoration-options-sublimation-heat-transfer-labels.png"),
      YOUR_LEGGINGS_COLORS_IMAGE_URL: p("services/leggings/custom-leggings-colors-sizing-printed-pattern-plus-size.png"),
      YOUR_LEGGINGS_PKG_IMAGE_URL: p("services/leggings/custom-leggings-packaging-options-polybag-hangtag-mailer.png"),
      YOUR_LEGGINGS_PROCESS_DESIGN_IMAGE_URL: p("services/leggings/custom-leggings-design-sampling-tech-pack-stretch-swatches.png"),
      YOUR_LEGGINGS_PROCESS_CUTTING_IMAGE_URL: p("services/leggings/custom-leggings-fabric-cutting-pattern-table-small-factory.png"),
      YOUR_LEGGINGS_PROCESS_SEWING_IMAGE_URL: p("services/leggings/custom-leggings-sewing-assembly-flatlock-waistband-small-workshop.png"),
      YOUR_LEGGINGS_PROCESS_DECO_IMAGE_URL: p("services/leggings/custom-leggings-decoration-application-sublimation-heat-transfer.png"),
      YOUR_LEGGINGS_PROCESS_QC_IMAGE_URL: p("services/leggings/custom-leggings-quality-inspection-qc-stretch-measurement.png"),
      YOUR_LEGGINGS_PROCESS_SHIPPING_IMAGE_URL: p("services/leggings/custom-leggings-packaging-shipping-small-batch-cartons.png"),
    },
  },
  {
    srcDirs: ["components/services/jeans"],
    mapping: {
      YOUR_JEANS_HERO_MODEL_IMAGE_URL: p("services/jeans-denim/custom-jeans-denim-manufacturing-hero-model-right-side.png"),
      YOUR_JEANS_HERO_STITCHING_IMAGE_URL: p("services/jeans-denim/custom-jeans-precision-construction-chain-stitch-felled-seams.png"),
      YOUR_JEANS_OVERVIEW_IMAGE_URL: p("services/jeans-denim/suhucustom-denim-jeans-factory-overview-oem-odm-production.png"),
      YOUR_JEANS_FEATURE_SOURCING_IMAGE_URL: p("services/jeans-denim/custom-jeans-premium-denim-sourcing-selvedge-stretch-fabric.png"),
      YOUR_JEANS_FEATURE_CONSTRUCTION_IMAGE_URL: p("services/jeans-denim/custom-jeans-cutting-sewing-chain-stitch-production.png"),
      YOUR_JEANS_FEATURE_WASH_IMAGE_URL: p("services/jeans-denim/custom-jeans-washing-finishing-stone-enzyme-acid-wash.png"),
      YOUR_JEANS_FEATURE_QC_IMAGE_URL: p("services/jeans-denim/custom-jeans-quality-control-wash-hardware-measurement.png"),
      YOUR_JEANS_FEATURE_CUSTOM_IMAGE_URL: p("services/jeans-denim/custom-jeans-wash-finish-options-distressed-overdyed-denim.png"),
      YOUR_JEANS_CUSTOM_FABRIC_IMAGE_URL: p("services/jeans-denim/custom-jeans-denim-fabric-options-raw-selvedge-stretch.png"),
      YOUR_JEANS_CUSTOM_STYLE_IMAGE_URL: p("services/jeans-denim/custom-jeans-fit-style-options-skinny-slim-wide-leg.png"),
      YOUR_JEANS_CUSTOM_FINISHING_IMAGE_URL: p("services/jeans-denim/custom-jeans-washing-finishing-industrial-denim-process.png"),
      YOUR_JEANS_CUSTOM_BRANDING_IMAGE_URL: p("services/jeans-denim/custom-jeans-hardware-detail-options-rivets-zippers-patches.png"),
      YOUR_JEANS_CUSTOM_PACKAGING_IMAGE_URL: p("services/jeans-denim/custom-jeans-packaging-options-polybag-hangtag-gift-box.png"),
      YOUR_JEANS_PROCESS_DESIGN_IMAGE_URL: p("services/jeans-denim/custom-jeans-design-tech-pack-denim-swatches-patterns.png"),
      YOUR_JEANS_PROCESS_CUTTING_IMAGE_URL: p("services/jeans-denim/custom-jeans-fabric-sourcing-lab-dips-selvedge-samples.png"),
      YOUR_JEANS_PROCESS_SEWING_IMAGE_URL: p("services/jeans-denim/custom-jeans-cutting-sewing-chain-stitch-production.png"),
      YOUR_JEANS_PROCESS_WASH_IMAGE_URL: p("services/jeans-denim/custom-jeans-washing-finishing-industrial-denim-process.png"),
      YOUR_JEANS_PROCESS_QC_IMAGE_URL: p("services/jeans-denim/custom-jeans-quality-inspection-qc-measurement-hardware.png"),
      YOUR_JEANS_PROCESS_SHIPPING_IMAGE_URL: p("services/jeans-denim/custom-jeans-packaging-shipping-export-cartons.png"),
    },
  },
  {
    srcDirs: ["components/services/socks"],
    mapping: {
      YOUR_SOCK_HERO_IMAGE_URL: p("services/socks/custom-sock-manufacturing-hero-model-right-side.png"),
      YOUR_SOCK_OVERVIEW_IMAGE_URL: p("services/socks/suhucustom-small-sock-factory-overview-oem-odm-production.png"),
      YOUR_SOCK_YARN_IMAGE_URL: p("services/socks/custom-socks-premium-yarn-selection-cotton-wool-bamboo-nylon.png"),
      YOUR_SOCK_KNITTING_IMAGE_URL: p("services/socks/custom-socks-computerized-knitting-machine-small-workshop.png"),
      YOUR_SOCK_PATTERN_IMAGE_URL: p("services/socks/custom-socks-jacquard-pattern-design-sample-table.png"),
      YOUR_SOCK_MOISTURE_IMAGE_URL: p("services/socks/custom-socks-moisture-wicking-performance-mesh-zones.png"),
      YOUR_SOCK_CONSTRUCTION_IMAGE_URL: p("services/socks/custom-socks-reinforced-heel-toe-arch-support-construction.png"),
      YOUR_SOCK_YARN_OPT_IMAGE_URL: p("services/socks/custom-sock-yarn-material-options-cotton-wool-bamboo-nylon.png"),
      YOUR_SOCK_STYLE_IMAGE_URL: p("services/socks/custom-sock-length-style-options-no-show-ankle-crew-knee-high.png"),
      YOUR_SOCK_PATTERN_OPT_IMAGE_URL: p("services/socks/custom-sock-pattern-design-options-jacquard-sublimation.png"),
      YOUR_SOCK_SIZE_IMAGE_URL: p("services/socks/custom-sock-colors-sizing-options-kids-women-men.png"),
      YOUR_SOCK_PACKAGING_IMAGE_URL: p("services/socks/custom-sock-packaging-options-belly-band-header-card-box.png"),
      YOUR_SOCK_PROCESS_DESIGN_IMAGE_URL: p("services/socks/custom-sock-design-sampling-knitting-pattern-yarn-swatches.png"),
      YOUR_SOCK_PROCESS_YARN_IMAGE_URL: p("services/socks/custom-sock-yarn-preparation-small-factory.png"),
      YOUR_SOCK_PROCESS_KNITTING_IMAGE_URL: p("services/socks/custom-sock-knitting-process-computerized-machine.png"),
      YOUR_SOCK_PROCESS_FINISHING_IMAGE_URL: p("services/socks/custom-sock-toe-linking-finishing-small-workshop.png"),
      YOUR_SOCK_PROCESS_QC_IMAGE_URL: p("services/socks/custom-sock-quality-inspection-qc-sizing-elasticity.png"),
      YOUR_SOCK_PROCESS_SHIPPING_IMAGE_URL: p("services/socks/custom-sock-packaging-shipping-small-batch-cartons.png"),
    },
  },
  {
    srcDirs: ["components/services/swimwear"],
    mapping: {
      YOUR_SWIMWEAR_HERO_IMAGE_URL: p("services/swimwear/custom-swimwear-manufacturing-hero-model-right-side.png"),
      YOUR_SWIMWEAR_OVERVIEW_IMAGE_URL: p("services/swimwear/suhucustom-small-swimwear-factory-overview-oem-odm.png"),
      YOUR_SWIMWEAR_FABRIC_IMAGE_URL: p("services/swimwear/custom-swimwear-performance-fabric-uv-chlorine-quick-dry.png"),
      YOUR_SWIMWEAR_PRINT_IMAGE_URL: p("services/swimwear/custom-swimwear-sublimation-printing-tropical-patterns.png"),
      YOUR_SWIMWEAR_CONSTRUCTION_IMAGE_URL: p("services/swimwear/custom-swimwear-flatlock-stitching-precision-construction.png"),
      YOUR_SWIMWEAR_TESTING_IMAGE_URL: p("services/swimwear/custom-swimwear-fabric-testing-chlorine-uv-stretch-recovery.png"),
      YOUR_SWIMWEAR_DESIGN_IMAGE_URL: p("services/swimwear/custom-swimwear-design-options-cuts-linings-straps-padding.png"),
      YOUR_SWIMWEAR_FABRIC_OPTION_IMAGE_URL: p("services/swimwear/custom-swimwear-fabric-options-recycled-nylon-upf-spandex.png"),
      YOUR_SWIMWEAR_STYLE_IMAGE_URL: p("services/swimwear/custom-swimwear-style-options-bikini-one-piece-rash-guard-trunks.png"),
      YOUR_SWIMWEAR_PRINT_OPTION_IMAGE_URL: p("services/swimwear/custom-swimwear-printing-decoration-sublimation-foil-labels.png"),
      YOUR_SWIMWEAR_SIZING_IMAGE_URL: p("services/swimwear/custom-swimwear-sizing-fit-options-inclusive-adjustable-padding.png"),
      YOUR_SWIMWEAR_PACKAGING_IMAGE_URL: p("services/swimwear/custom-swimwear-packaging-options-polybag-hanger-beach-pouch.png"),
      YOUR_SWIMWEAR_PROCESS_DESIGN_IMAGE_URL: p("services/swimwear/custom-swimwear-design-sampling-patterns-fabric-swatches.png"),
      YOUR_SWIMWEAR_PROCESS_TESTING_IMAGE_URL: p("services/swimwear/custom-swimwear-uv-chlorine-fabric-testing.png"),
      YOUR_SWIMWEAR_PROCESS_CUTTING_IMAGE_URL: p("services/swimwear/custom-swimwear-sublimation-print-cut-process.png"),
      YOUR_SWIMWEAR_PROCESS_SEWING_IMAGE_URL: p("services/swimwear/custom-swimwear-sewing-assembly-flatlock-elastic-lining.png"),
      YOUR_SWIMWEAR_PROCESS_QC_IMAGE_URL: p("services/swimwear/custom-swimwear-quality-inspection-print-seam-elastic-fit.png"),
      YOUR_SWIMWEAR_PROCESS_SHIPPING_IMAGE_URL: p("services/swimwear/custom-swimwear-packaging-shipping-small-batch-cartons.png"),
    },
  },
  {
    srcDirs: ["components/services/leather-goods"],
    mapping: {
      YOUR_LEATHER_HERO_IMAGE_URL: p("services/leather-goods/custom-leather-goods-manufacturing-hero-model-right-side.png"),
      YOUR_LEATHER_OVERVIEW_IMAGE_URL: p("services/leather-goods/suhucustom-small-leather-goods-workshop-overview-oem-odm.png"),
      YOUR_LEATHER_SOURCING_IMAGE_URL: p("services/leather-goods/custom-leather-goods-premium-leather-sourcing-swatches.png"),
      YOUR_LEATHER_STITCHING_IMAGE_URL: p("services/leather-goods/custom-leather-goods-expert-hand-stitching-wallet.png"),
      YOUR_LEATHER_EMBOSSING_IMAGE_URL: p("services/leather-goods/custom-leather-goods-embossing-branding-hot-stamping.png"),
      YOUR_LEATHER_HARDWARE_IMAGE_URL: p("services/leather-goods/custom-leather-goods-premium-hardware-buckles-zippers-clasps.png"),
      YOUR_LEATHER_EDGE_IMAGE_URL: p("services/leather-goods/custom-leather-goods-precision-edge-finishing-burnished-painted.png"),
      YOUR_LEATHER_TYPE_IMAGE_URL: p("services/leather-goods/custom-leather-type-options-full-grain-top-grain-pull-up-vegan.png"),
      YOUR_LEATHER_HARDWARE_OPT_IMAGE_URL: p("services/leather-goods/custom-leather-hardware-fittings-options-buckles-rivets-zippers.png"),
      YOUR_LEATHER_BRANDING_IMAGE_URL: p("services/leather-goods/custom-leather-embossing-branding-options-debossing-foil.png"),
      YOUR_LEATHER_COLOR_IMAGE_URL: p("services/leather-goods/custom-leather-colors-finish-options-matte-glossy-distressed.png"),
      YOUR_LEATHER_PACKAGING_IMAGE_URL: p("services/leather-goods/custom-leather-goods-packaging-options-gift-box-dust-bag.png"),
      YOUR_LEATHER_PROCESS_DESIGN_IMAGE_URL: p("services/leather-goods/custom-leather-goods-design-prototyping-tech-pack-patterns.png"),
      YOUR_LEATHER_PROCESS_SELECT_IMAGE_URL: p("services/leather-goods/custom-leather-selection-process-premium-hides-grading.png"),
      YOUR_LEATHER_PROCESS_CUTTING_IMAGE_URL: p("services/leather-goods/custom-leather-precision-cutting-process-wallet-bag-parts.png"),
      YOUR_LEATHER_PROCESS_STITCHING_IMAGE_URL: p("services/leather-goods/custom-leather-stitching-assembly-process-hardware-installation.png"),
      YOUR_LEATHER_PROCESS_QC_IMAGE_URL: p("services/leather-goods/custom-leather-edge-finishing-quality-control-inspection.png"),
      YOUR_LEATHER_PROCESS_SHIPPING_IMAGE_URL: p("services/leather-goods/custom-leather-goods-packaging-shipping-small-batch-boxes.png"),
    },
  },
  {
    srcDirs: ["components/services/cushion-covers"],
    mapping: {
      YOUR_CUSHION_HERO_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-manufacturing-hero-home-textile-workshop.png"),
      YOUR_CUSHION_OVERVIEW_IMAGE_URL: p("services/cushion-covers/suhucustom-small-cushion-cover-workshop-overview-oem-odm.png"),
      YOUR_CUSHION_FABRIC_IMAGE_URL: p("services/cushion-covers/custom-cushion-covers-premium-fabric-options-velvet-linen-canvas.png"),
      YOUR_CUSHION_PRINT_IMAGE_URL: p("services/cushion-covers/custom-cushion-covers-digital-printing-botanical-patterns.png"),
      YOUR_CUSHION_SEWING_IMAGE_URL: p("services/cushion-covers/custom-cushion-covers-precision-sewing-piped-edge.png"),
      YOUR_CUSHION_ZIPPER_IMAGE_URL: p("services/cushion-covers/custom-cushion-covers-zipper-closure-options-invisible-envelope-button.png"),
      YOUR_CUSHION_DESIGN_IMAGE_URL: p("services/cushion-covers/custom-cushion-covers-design-flexibility-embroidery-tassels-applique.png"),
      YOUR_CUSHION_FABRIC_OPT_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-fabric-options-velvet-linen-polyester.png"),
      YOUR_CUSHION_SIZE_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-size-shape-options-square-round-bolster.png"),
      YOUR_CUSHION_DECO_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-printing-embroidery-decoration-options.png"),
      YOUR_CUSHION_COLOR_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-colors-patterns-botanical-geometric-abstract.png"),
      YOUR_CUSHION_PACKAGING_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-packaging-options-polybag-belly-band-gift-box.png"),
      YOUR_CUSHION_PROCESS_DESIGN_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-design-sampling-fabric-swatches-prototype.png"),
      YOUR_CUSHION_PROCESS_FABRIC_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-fabric-sourcing-texture-quality-check.png"),
      YOUR_CUSHION_PROCESS_PRINT_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-printing-embroidery-production-process.png"),
      YOUR_CUSHION_PROCESS_SEWING_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-cutting-sewing-process-invisible-zipper.png"),
      YOUR_CUSHION_PROCESS_QC_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-quality-inspection-qc-stitching-zipper.png"),
      YOUR_CUSHION_PROCESS_SHIPPING_IMAGE_URL: p("services/cushion-covers/custom-cushion-cover-packaging-shipping-small-batch-cartons.png"),
    },
  },
];

/** Homepage category nav — only slugs with images in homepage-seo-images pack */
const CATEGORY_IMAGES = {
  "t-shirts": p("homepage-seo-images/custom-t-shirts-manufacturing-cotton-blank-tshirt-samples.png"),
  "hoodies-sweatshirts": p("homepage-seo-images/custom-hoodies-sweatshirts-manufacturing-heavyweight-fleece.png"),
  "activewear-athleisure": p("homepage-seo-images/activewear-athleisure-manufacturing-performance-fabric-samples.png"),
  "gym-sportswear": p("homepage-seo-images/gym-sportswear-manufacturing-moisture-wicking-training-apparel.png"),
  leggings: p("homepage-seo-images/custom-leggings-manufacturing-stretch-fabric-samples.png"),
  "jeans-denim": p("homepage-seo-images/jeans-denim-manufacturing-wash-stitching-hardware-samples.png"),
  "underwear-bras": p("homepage-seo-images/underwear-bras-manufacturing-soft-modal-elastic-trims.png"),
  swimwear: p("homepage-seo-images/custom-swimwear-manufacturing-stretch-print-fabric-samples.png"),
  "hats-headwear": p("homepage-seo-images/custom-hats-headwear-manufacturing-embroidery-cap-samples.png"),
  socks: p("homepage-seo-images/custom-socks-manufacturing-yarn-knit-rib-samples.png"),
  "neck-gaiters": p("homepage-seo-images/neck-gaiters-manufacturing-breathable-stretch-print-samples.png"),
  "leather-goods": p("homepage-seo-images/leather-goods-manufacturing-wallet-accessory-stitching-samples.png"),
  uniforms: p("homepage-seo-images/custom-uniforms-manufacturing-staff-polo-workwear-samples.png"),
  "baby-kids-clothing": p("homepage-seo-images/baby-kids-clothing-manufacturing-soft-cotton-safe-trims.png"),
  towels: p("homepage-seo-images/custom-towels-manufacturing-high-gsm-terry-loop-samples.png"),
  "cushion-covers": p("homepage-seo-images/cushion-covers-manufacturing-hidden-zipper-home-textile-samples.png"),
};

const ABOUT_US_PATCHES = [
  { section: "hero", field: "heroImage", path: p("about-us/suhucustom-about-us-founders-garment-manufacturing-hero.png") },
  { section: "story", field: "image", path: p("about-us/suhucustom-two-sisters-garment-factory-story-dongguan.png") },
  { section: "factory", field: "image", path: p("about-us/suhucustom-small-garment-production-process-quality-inspection.png") },
  { section: "team", field: "image", path: p("about-us/suhucustom-custom-apparel-team-client-communication.png") },
  { section: "cta", field: "backgroundImage", path: p("about-us/custom-apparel-collection-sample-room-cta-background.png") },
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function fileExists(publicPath) {
  const disk = path.join(ROOT, "public", publicPath.replace(/^\//, ""));
  return fs.existsSync(disk);
}

function applyScopedReplacements() {
  let total = 0;
  const allFiles = walk(SRC);

  for (const { srcDirs, mapping } of SCOPED) {
    const targets = allFiles.filter((f) => {
      const rel = path.relative(SRC, f).replace(/\\/g, "/");
      return srcDirs.some((d) => rel.startsWith(d));
    });

    for (const file of targets) {
      let content = fs.readFileSync(file, "utf8");
      let changed = false;

      for (const [token, imgPath] of Object.entries(mapping)) {
        if (!fileExists(imgPath)) {
          console.warn(`Missing file for ${token}: ${imgPath}`);
          continue;
        }
        const before = content;
        content = content.split(token).join(imgPath);
        if (content !== before) {
          changed = true;
          total += (before.split(token).length - 1);
        }
      }

      if (changed) {
        fs.writeFileSync(file, content, "utf8");
        console.log("Updated:", path.relative(ROOT, file));
      }
    }
  }

  return total;
}

function writeCategoryImages() {
  const lines = Object.entries(CATEGORY_IMAGES)
    .filter(([, imgPath]) => fileExists(imgPath))
    .map(([slug, imgPath]) => `  "${slug}": "${imgPath}",`);

  const outPath = path.join(SRC, "lib/generated/categoryImages.ts");
  const content = `/** Auto-generated by scripts/image-pipeline/apply-local-images.mjs — do not edit manually */\nexport const categoryImages: Record<string, string> = {\n${lines.join("\n")}\n};\n`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, "utf8");
  console.log(`Wrote categoryImages.ts (${lines.length} entries)`);
}

function patchAboutUsDefaults() {
  const defaultsPath = path.join(SRC, "lib/aboutUsDefaults.ts");
  let content = fs.readFileSync(defaultsPath, "utf8");
  let changed = 0;

  for (const { section, field, path: imgPath } of ABOUT_US_PATCHES) {
    if (!fileExists(imgPath)) {
      console.warn(`Missing about-us image: ${imgPath}`);
      continue;
    }
    const re = new RegExp(`(${section}:\\s*\\{[\\s\\S]*?${field}:\\s*)ABOUT_US_PLACEHOLDER`);
    if (re.test(content)) {
      content = content.replace(re, `$1"${imgPath}"`);
      changed++;
    }
  }

  if (changed) {
    fs.writeFileSync(defaultsPath, content, "utf8");
    console.log(`Updated aboutUsDefaults.ts (${changed} fields)`);
  }
}

function fixHomeFactoryIntro() {
  const file = path.join(SRC, "components/home/HomeFactoryIntro.tsx");
  let content = fs.readFileSync(file, "utf8");
  const imgPath = p("home/factory-intro.png");
  if (content.includes('src="FACTORY_INTRO_IMAGE_URL"')) {
    content = content.replace(
      'src="FACTORY_INTRO_IMAGE_URL"',
      `src={resolveImageSrc("${imgPath}")}`
    );
    if (!content.includes("resolveImageSrc")) {
      content = `import { resolveImageSrc } from "@/lib/imageFallback";\n${content}`;
    }
    fs.writeFileSync(file, content, "utf8");
    console.log("Updated: src/components/home/HomeFactoryIntro.tsx");
  }
}

const total = applyScopedReplacements();
writeCategoryImages();
patchAboutUsDefaults();
fixHomeFactoryIntro();
console.log(`\nDone. Replaced ${total} placeholder token(s).`);
