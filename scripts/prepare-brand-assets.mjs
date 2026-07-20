import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "suhucustom-logo-removebg-preview.png");
const brandDir = path.join(root, "public", "brand");
const appDir = path.join(root, "src", "app");

function removeWhiteFringe(image) {
  const { data } = image;
  const pixels = data.length / 4;

  for (let i = 0; i < pixels; i += 1) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const alpha = data[offset + 3];

    if (alpha === 0) continue;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;
    const brightness = (r + g + b) / 3;

    if (saturation < 18 && brightness > 228) {
      data[offset + 3] = 0;
    }
  }

  return image;
}

async function loadTransparentPng(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  removeWhiteFringe({ data, info });

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
}

async function makeIconPng(inputBuffer) {
  const meta = await sharp(inputBuffer).metadata();
  const cropHeight = Math.round(meta.height * 0.64);

  const { data, info } = await sharp(inputBuffer)
    .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  removeWhiteFringe({ data, info });

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .trim({ threshold: 1 })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

await mkdir(brandDir, { recursive: true });

const sourceBuffer = await sharp(source).png().toBuffer();
const fullTransparentBuffer = await loadTransparentPng(sourceBuffer);
const iconBuffer = await makeIconPng(sourceBuffer);

await sharp(fullTransparentBuffer).toFile(path.join(brandDir, "suhucustom-logo-full.png"));
await sharp(iconBuffer).toFile(path.join(brandDir, "suhucustom-logo-icon.png"));
await sharp(iconBuffer).resize(32, 32).png().toFile(path.join(brandDir, "favicon-32.png"));
await sharp(iconBuffer).resize(180, 180).png().toFile(path.join(brandDir, "apple-touch-icon.png"));
await sharp(iconBuffer).resize(512, 512).png().toFile(path.join(appDir, "icon.png"));
await sharp(iconBuffer).resize(180, 180).png().toFile(path.join(appDir, "apple-icon.png"));

const ogLogo = await sharp(fullTransparentBuffer)
  .resize(520, null, { fit: "inside" })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 15, g: 23, b: 42, alpha: 1 },
  },
})
  .composite([{ input: ogLogo, gravity: "center" }])
  .png()
  .toFile(path.join(brandDir, "og-image.png"));

console.log("Brand assets regenerated from suhucustom-logo-removebg-preview.png");
