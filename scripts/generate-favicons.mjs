/**
 * Generates circular favicon PNGs from public/assets/images/logo.jpeg.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public", "assets", "images", "logo.jpeg");
const outDir = path.join(root, "public", "assets", "images");

function circleMask(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`,
  );
}

async function writeCirclePng(size, filename) {
  await sharp(input)
    .resize(size, size, { fit: "cover", position: "centre" })
    .composite([{ input: circleMask(size), blend: "dest-in" }])
    .png()
    .toFile(path.join(outDir, filename));
}

await writeCirclePng(48, "favicon.png");
await writeCirclePng(180, "apple-touch-icon.png");
console.log("Wrote public/assets/images/favicon.png and apple-touch-icon.png");
