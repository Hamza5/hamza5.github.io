// Two jobs, both after `next build`:
//
// 1. Next's static export writes a prerendered route handler's body to the route
//    path with the extension stripped: /en/og/home.png lands on disk as
//    out/en/og/home. GitHub Pages then serves it as application/octet-stream,
//    and Facebook/WhatsApp/Slack refuse to render an image with the wrong
//    content type — so the social card would never appear in a link preview.
//    This renames each generated card to the .png path the metadata points at.
//
// 2. It then validates what was produced: right dimensions, and no two cards
//    accidentally identical (which is what happens when a locale is ignored).
//
// Runs via npm's postbuild hook, so CI must call `npm run build`.
import { createHash } from "node:crypto";
import { readdir, readFile, rename } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";
const EXPECTED = { width: 1200, height: 630 };
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]); // ‰PNG
const CARDS_PER_LOCALE = 14;

const localeDirs = await readdir(OUT, { withFileTypes: true })
  .then((entries) =>
    entries
      .filter((entry) => entry.isDirectory() && /^[a-z]{2}$/.test(entry.name))
      .map((entry) => entry.name),
  )
  .catch(() => []);

if (localeDirs.length === 0) {
  console.error("[og] no locale directories in out/ — did the export run?");
  process.exit(1);
}

/** PNG dimensions live in the IHDR chunk, 16 bytes in. */
function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

let renamed = 0;
const problems = [];
const hashes = new Map();

for (const locale of localeDirs) {
  const dir = join(OUT, locale, "og");
  const files = await readdir(dir).catch(() => {
    problems.push(`${locale}: no og/ directory`);
    return [];
  });

  const targets = files.filter((file) => !file.endsWith(".png"));
  if (targets.length !== CARDS_PER_LOCALE) {
    problems.push(`${locale}: ${targets.length} cards generated, expected ${CARDS_PER_LOCALE}`);
  }

  for (const file of targets) {
    const source = join(dir, file);
    const target = join(dir, `${file}.png`);
    const buffer = await readFile(source);

    if (!buffer.subarray(0, 4).equals(PNG_MAGIC)) {
      // The handler answers a plain "Not found" body for an unrecognised slug.
      problems.push(`${locale}/og/${file}: not a PNG (${buffer.length} bytes) — check the slug map`);
      continue;
    }

    const { width, height } = pngSize(buffer);
    if (width !== EXPECTED.width || height !== EXPECTED.height) {
      problems.push(`${locale}/og/${file}: ${width}x${height}, expected ${EXPECTED.width}x${EXPECTED.height}`);
    }

    const digest = createHash("md5").update(buffer).digest("hex");
    if (hashes.has(digest)) {
      problems.push(`${locale}/og/${file}: byte-identical to ${hashes.get(digest)}`);
    }
    hashes.set(digest, `${locale}/og/${file}`);

    await rename(source, target);
    renamed++;
  }
}

console.log(`[og] renamed ${renamed} social card(s) to .png, ${hashes.size} unique`);

if (problems.length > 0) {
  console.error(`[og] ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
