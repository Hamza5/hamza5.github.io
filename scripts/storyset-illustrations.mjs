/**
 * Builds the service/sector illustrations from Storyset.
 *
 * Why a script rather than hand-downloaded files: the recolour is per-file. A
 * blind hue rotation is wrong here because Pana's skin tones and its accent
 * tints sit in the same hue band with opposite jobs — in `ecommerce-campaign`
 * `#ff9a6c` paints shoes (recolour) while `#ffbf9d` paints faces (leave), and
 * in `digital-transformation` `#ff9a6c` is hands (leave). Only the `recolor`
 * lists below are recoloured; every other fill keeps its value, so ink,
 * neutrals and skin survive intact.
 *
 * One file per slot, in its authored colours. The dark theme deliberately does
 * *not* get a re-palette: the art keeps its white lab coats, light screens and
 * true skin tones, and separation from the dark card is handled in CSS with a
 * light rim. Re-colouring for dark was built and then rejected — mirroring the
 * light palette turns every white garment into a glare patch and every light
 * screen into a black hole, which changes the picture far more than the legibility
 * problem warrants. A CSS `invert()` filter is not an alternative either: it
 * inverts *apparent skin tone*, silently swapping which figure reads as light-
 * or dark-skinned.
 *
 * Storyset's own "Change color" is deliberately not used: it only runs inside
 * the Animate modal and rewrites all sixteen canonical preset colours,
 * including the `#263238` ink used 100+ times per file, which flattens the art.
 *
 * Licence: the Storyset/Freepik free licence covers personal and commercial use
 * *with attribution* — the credit lives in the site footer. Please read
 * https://storyset.com/terms before re-running this. It fetches one page and one
 * SVG per illustration, which is what clicking through by hand would do; the
 * terms forbid bulk downloading, so please keep it to the files listed here.
 *
 * Usage: node scripts/storyset-illustrations.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://storyset.com";
const OUT_DIR = "public/images/services";

/** The brand primary the accent is pulled onto. */
const BRAND = "#6d5efc";

/**
 * One entry per slot. `topic` is the Storyset slug, `recolor` lists only the
 * fills that carry the accent; anything not listed is left alone.
 */
const ILLUSTRATIONS = [
  { slot: "offer-website", topic: "website-designer", recolor: ["#FF725E"] },
  { slot: "offer-data", topic: "analysis", recolor: ["#FF725E"] },
  { slot: "offer-automation", topic: "processing", recolor: ["#FF725E"] },
  { slot: "offer-digitization", topic: "digital-transformation", recolor: ["#FF725E"] },
  { slot: "sector-real-estate", topic: "realtor", recolor: ["#FF725E"] },
  { slot: "sector-ecommerce", topic: "ecommerce-campaign", recolor: ["#FF725E"] },
  { slot: "sector-social-media", topic: "social-media", recolor: ["#FF725E"] },
  // The nurse's scrubs are drawn with the accent *and* a lighter accent tint.
  { slot: "sector-healthcare", topic: "medical-care", recolor: ["#FF725E", "#f6957f"] },
  { slot: "sector-manufacturing", topic: "manufacturing-process", recolor: ["#FF725E"] },
];

const STYLE = "pana";

/** Layer ids dropped to get the "hidden background" variant. */
const DROP_GROUPS = ["background-complete", "background-simple", "Floor"];

/** Coordinate precision kept by `optimize`. At a 500-unit canvas 0.01 unit is ~0.008px. */
const PRECISION = 2;

// ---------------------------------------------------------------------------
// Colour
// ---------------------------------------------------------------------------

function hexToRgb(hex) {
  const h = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex.slice(0, 7);
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return [h * 60, s, l];
}

function hslToRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r, g, b] =
    hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x]
    : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

/**
 * Moves a colour onto the brand hue while keeping the illustration's own tonal
 * relationships. Each source is expressed as a ratio against the illustration's
 * primary and that ratio is re-applied to the brand, so the primary lands
 * exactly on the brand colour and its tints stay proportionally lighter or
 * darker. Rotating raw HSL instead would blow every accent out to full
 * saturation, and scaling by the brand/source ratio would collapse all tints
 * onto the brand colour.
 */
function toBrand(sourceHex, primaryHex) {
  const [, sSrc, lSrc] = rgbToHsl(hexToRgb(sourceHex));
  const [, sPrimary, lPrimary] = rgbToHsl(hexToRgb(primaryHex));
  const [hBrand, sBrand, lBrand] = rgbToHsl(hexToRgb(BRAND));
  if (sSrc < 0.05) return BRAND; // greys have no hue to carry; snap to the brand
  const ratioL = lSrc / lPrimary;
  const ratioS = sSrc / sPrimary;
  return rgbToHex(
    hslToRgb([hBrand, Math.min(1, sBrand * ratioS), Math.min(0.97, Math.max(0.03, lBrand * ratioL))]),
  );
}

// ---------------------------------------------------------------------------
// SVG surgery
// ---------------------------------------------------------------------------

/** Removes `<g id="...">…</g>` including its whole subtree, by depth counting. */
function dropGroups(svg, ids) {
  let out = svg;
  for (const id of ids) {
    const start = out.search(new RegExp(`<g id="${id}"[^>]*>`));
    if (start === -1) continue;
    let depth = 0;
    const tags = /<g\b[^>]*>|<\/g>/g;
    tags.lastIndex = start;
    let match;
    while ((match = tags.exec(out)) !== null) {
      depth += match[0] === "</g>" ? -1 : 1;
      if (depth === 0) {
        out = out.slice(0, start) + out.slice(match.index + match[0].length);
        break;
      }
    }
  }
  return out;
}

/**
 * Swaps fill colours through a single decision per source colour, so repeated
 * occurrences can never drift apart.
 */
function remapFills(svg, resolve) {
  const cache = new Map();
  return svg.replace(/fill:\s*(#[0-9A-Fa-f]{3,6})/gi, (_, hex) => {
    const key = hex.toLowerCase();
    if (!cache.has(key)) cache.set(key, resolve(key));
    return `fill:${cache.get(key)}`;
  });
}

/**
 * Size trims that cannot change the rendered pixels.
 *
 * `style="fill:#x"` becomes the shorter `fill="#x"`: these files are loaded
 * through <img> and inlined as data URIs for the social cards, so no stylesheet
 * can outrank the presentation attribute. Coordinates are rounded to
 * PRECISION, which at this canvas size is far below one device pixel.
 */
function optimize(svg) {
  return svg
    .replace(/<\?xml[^>]*\?>\s*/, "")
    .replace(/style="fill:\s*(#[0-9A-Fa-f]{3,6})\s*"/g, 'fill="$1"')
    .replace(/>\s+</g, "><")
    .replace(/>\s*$/, ">")
    .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10 ** PRECISION) / 10 ** PRECISION));
}

function intrinsicSize(svg) {
  const [, , , w, h] = svg.match(/viewBox="([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)"/).map(Number);
  return { width: w, height: h };
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

/**
 * The illustration page embeds a `ld+json` block per style whose `contentUrl` is
 * the same SVG the page renders from, so one page read resolves the download.
 */
async function resolveSvgUrl(topic, style) {
  const page = await (await fetch(`${SITE}/illustration/${topic}/${style}`)).text();
  const blocks = page.matchAll(
    /href="\/illustration\/[^"]+\/([a-z]+)"(?:(?!href=).){0,1500}?contentUrl\\?":\\?"(https:\/\/[^"\\]+\.svg)/gs,
  );
  for (const [, found, url] of blocks) {
    if (found === style) return url.replace(/\\u002F/g, "/");
  }
  throw new Error(`no SVG URL for ${topic}/${style}`);
}

// ---------------------------------------------------------------------------

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const sizes = [];
  let rawTotal = 0;
  let optimizedTotal = 0;

  for (const { slot, topic, recolor } of ILLUSTRATIONS) {
    const url = await resolveSvgUrl(topic, STYLE);
    const original = await (await fetch(url)).text();
    const base = dropGroups(original, DROP_GROUPS);

    // The first entry is the style's own primary and anchors the ratios.
    const [primary] = recolor;
    const brandMap = new Map(recolor.map((c) => [c.toLowerCase(), toBrand(c, primary)]));
    const svg = optimize(remapFills(base, (hex) => brandMap.get(hex) ?? hex));

    const { width, height } = intrinsicSize(svg);
    writeFileSync(join(OUT_DIR, `${slot}.svg`), svg);
    rawTotal += base.length;
    optimizedTotal += svg.length;
    sizes.push({ slot, width, height });

    console.log(
      `${slot.padEnd(24)} ${topic.padEnd(24)} ${String(width).padStart(3)}x${String(height).padEnd(3)} ` +
        `raw ${String(base.length).padStart(7)}B -> opt ${String(svg.length).padStart(7)}B`,
    );
  }

  console.log(
    `\n${ILLUSTRATIONS.length} files: raw ${rawTotal} B -> optimized ${optimizedTotal} B ` +
      `(-${Math.round((1 - optimizedTotal / rawTotal) * 100)}%)`,
  );
  console.log("\nIntrinsic sizes for app/data/services.ts:");
  for (const s of sizes) console.log(`  ${s.slot}: width ${s.width}, height ${s.height}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
