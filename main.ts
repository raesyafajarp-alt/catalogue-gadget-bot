// catalogue-gadget-bot — main.ts
//
// Writes one catalogue photograph of an impossible gadget to
// /output/entry.png: the REALITY REMOTE RR-1, a sleek matte-black
// handheld remote that controls reality itself — PAUSE TIME, SKIP
// MONDAY, MUTE NEIGHBOURS, UNDO SPILL, SUNNY NOW — shot as a clean
// studio catalogue photograph with exactly one accessory, a plain
// white coffee mug. Model name and $49.99 price tag are printed on
// the product itself, as a real catalogue shot would show them.
//
// Deterministic, no network, no dependencies: the program emits the
// exact bytes of gadget.png (a 1024x1024 PNG, 444,091 bytes) that
// ships in this repository, so every run writes identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const MAX_DIMENSION = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const assetPath = join(here, "gadget.png");

const outDir = process.env.OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.png");

const png = readFileSync(assetPath);

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("gadget.png is not a PNG file");
}
if (png.length > MAX_BYTES) {
  throw new Error(`entry.png is ${png.length} bytes, over the ${MAX_BYTES} byte limit`);
}
if (png.readUInt32BE(16) > MAX_DIMENSION || png.readUInt32BE(20) > MAX_DIMENSION) {
  throw new Error("entry.png exceeds 1024x1024 pixels");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, png);
console.log(`wrote ${outPath} (${png.length} bytes, 1024x1024 PNG)`);
