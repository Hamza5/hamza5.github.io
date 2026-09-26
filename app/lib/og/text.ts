import sharp from "sharp";
// Installs the card faces with fontconfig. Measurement has to read back the ink
// of the real typefaces, not a host fallback, or the wrapping it decides is
// whatever sans-serif the build machine ships.
import "./fonts";

/**
 * Text measurement for the SVG cards.
 *
 * There is no width API here: librsvg rasterises, so a line's width is read back
 * from the ink it actually laid out. That is what makes the wrapping correct —
 * measuring Arabic requires the shaper, and summing raw glyph advances is
 * exactly what goes wrong for joined script.
 *
 * All candidate lines go into one image and are measured in a single pass over
 * the raw pixels, because a rasterisation costs far more than a scan.
 */

export interface TextStyle {
  family: string;
  weight: 400 | 500 | 600 | 700 | 900;
  size: number;
  letterSpacing?: number;
  /** Must match the direction used when rendering, so shaping is identical. */
  rtl: boolean;
}

const CANVAS = 1600;
const rowHeight = (style: TextStyle) => Math.ceil(style.size * 2.6);
const round = (n: number) => Math.round(n * 100) / 100;

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function textElement(
  x: number,
  y: number,
  text: string,
  style: TextStyle,
  color: string,
): string {
  return (
    `<text x="${round(x)}" y="${round(y)}" font-family="${style.family}" ` +
    `font-weight="${style.weight}" font-size="${style.size}" fill="${color}"` +
    (style.letterSpacing ? ` letter-spacing="${style.letterSpacing}"` : "") +
    (style.rtl ? ` direction="rtl"` : "") +
    `>${escapeXml(text)}</text>`
  );
}

/**
 * Ink width of each string. A candidate wider than the canvas is reported as
 * the canvas width plus a flag, so the caller can retry against a wider one
 * rather than silently wrapping on a clipped measurement.
 */
async function measureBatch(
  texts: string[],
  style: TextStyle,
  canvas = CANVAS,
): Promise<{ widths: number[]; clipped: boolean }> {
  const unique = [...new Set(texts.filter((t) => t.length > 0))];
  if (unique.length === 0) return { widths: [], clipped: false };

  const rowH = rowHeight(style);
  const height = rowH * unique.length;
  // Letter spacing is applied when rendering, not here, so it is dropped and
  // added back per glyph afterwards.
  const plain: TextStyle = { ...style, letterSpacing: undefined };

  // An RTL run is anchored by its right edge, so it has to start from the right
  // of the canvas; placing it at the left would push it out of frame.
  const measureX = style.rtl ? canvas - 6 : 6;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${height}">` +
    unique
      .map((text, i) =>
        textElement(measureX, rowH * i + style.size * 1.6, text, plain, "#ffffff"),
      )
      .join("") +
    `</svg>`;

  // No flatten(): compositing onto a transparent background yields a fully
  // opaque image, which would make every pixel read as ink. librsvg already
  // gives us alpha, so the raw channels are used as they come.
  const { data, info } = await sharp(Buffer.from(svg))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = Math.min(info.width, canvas);
  const stride = info.width * info.channels;
  const widths: number[] = [];
  let clipped = false;

  for (let i = 0; i < unique.length; i++) {
    const top = rowH * i;
    const bottom = Math.min(top + rowH, info.height);
    let min = width;
    let max = -1;
    for (let y = top; y < bottom; y++) {
      const rowStart = y * stride;
      for (let x = 0; x < width; x++) {
        if (data[rowStart + x * info.channels + 3] > 8) {
          if (x < min) min = x;
          if (x > max) max = x;
        }
      }
    }
    if (max < 0) {
      widths.push(0);
    } else {
      if (max >= width - 2) clipped = true;
      // Letter spacing is per glyph in SVG, so add it back explicitly.
      const tracking = style.letterSpacing
        ? style.letterSpacing * Math.max(0, [...unique[i]].length - 1)
        : 0;
      widths.push(max - min + 1 + tracking);
    }
  }

  return { widths, clipped };
}

const measureCache = new Map<string, Promise<{ widths: number[]; clipped: boolean }>>();

function cachedBatch(
  texts: string[],
  style: TextStyle,
): Promise<{ widths: number[]; clipped: boolean }> {
  const key =
    `${style.family}|${style.weight}|${style.size}|${style.letterSpacing ?? 0}|` +
    `${style.rtl}|${texts.join("")}`;
  let hit = measureCache.get(key);
  if (!hit) {
    hit = (async () => {
      const first = await measureBatch(texts, style, CANVAS);
      if (!first.clipped) return first;
      // Something was wider than the canvas; re-measure with room.
      return measureBatch(texts, style, CANVAS * 3);
    })();
    measureCache.set(key, hit);
  }
  return hit;
}

/** Width of a single string, for centring pills and rules. */
export async function measureOne(text: string, style: TextStyle): Promise<number> {
  const { widths } = await cachedBatch([text], style);
  return widths[0] ?? 0;
}

/**
 * Greedy word wrap. Anything still unplaced when `maxLines` is reached is
 * appended to the last line rather than dropped — these are short display
 * strings, and silently losing words would be worse than a long last line.
 */
export async function wrapText(
  text: string,
  maxWidth: number,
  style: TextStyle,
  maxLines = 3,
): Promise<string[]> {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words.length === 1 ? [words[0]] : [];

  // Every prefix of the word list is a candidate line; measuring them all in one
  // pass is cheaper than measuring each line separately.
  const candidates: string[] = [];
  for (let i = 0; i < words.length; i++) candidates.push(words.slice(0, i + 1).join(" "));
  const { widths } = await cachedBatch(candidates, style);

  const lines: string[] = [];
  let start = 0;

  while (start < words.length && lines.length < maxLines) {
    let end = words.length;
    for (let i = start; i < words.length; i++) {
      if (widths[i] > maxWidth && i > start) {
        end = i;
        break;
      }
    }
    lines.push(words.slice(start, end).join(" "));
    start = end;
  }

  if (start < words.length && lines.length > 0) {
    lines[lines.length - 1] += " " + words.slice(start).join(" ");
  }

  return lines;
}
