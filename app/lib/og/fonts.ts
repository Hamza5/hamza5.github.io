import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Typefaces for the social cards.
 *
 * Satori (the usual next/og renderer) cannot shape Arabic script and silently
 * mis-measures shaped runs, so the cards are rendered as SVG through sharp,
 * which uses librsvg — Pango and HarfBuzz give correct Arabic shaping and bidi.
 * That means the fonts have to be embedded in the SVG rather than passed to a
 * text API.
 *
 * The files in assets/fonts are static instances subset from the same Google
 * Fonts variable originals the site already loads via next/font. Build-time
 * only; nothing is shipped to visitors. All SIL Open Font License.
 */

export interface FontFace {
  family: string;
  weight: 400 | 500 | 600 | 700 | 900;
  file: string;
}

export const CAIRO: FontFace[] = [
  { family: "Cairo", weight: 400, file: "Cairo-Regular.ttf" },
  { family: "Cairo", weight: 600, file: "Cairo-SemiBold.ttf" },
  { family: "Cairo", weight: 700, file: "Cairo-Bold.ttf" },
  // The Arabic wordmark asks for 900; map it to the real bold face so librsvg
  // does not synthesise a smeared weight.
  { family: "Cairo", weight: 900, file: "Cairo-Bold.ttf" },
];

export const SPACE: FontFace[] = [
  { family: "Space Grotesk", weight: 400, file: "SpaceGrotesk-Regular.ttf" },
  { family: "Space Grotesk", weight: 500, file: "SpaceGrotesk-Medium.ttf" },
  { family: "Space Grotesk", weight: 700, file: "SpaceGrotesk-Bold.ttf" },
];

export const ORBITRON: FontFace[] = [
  { family: "Orbitron", weight: 700, file: "Orbitron-Bold.ttf" },
  { family: "Orbitron", weight: 900, file: "Orbitron-Black.ttf" },
];

const base64Cache = new Map<string, string>();

function fontBase64(file: string): string {
  const cached = base64Cache.get(file);
  if (cached) return cached;
  const data = readFileSync(join(process.cwd(), "assets/fonts", file)).toString("base64");
  base64Cache.set(file, data);
  return data;
}

/** @font-face rules for the given faces, inlined as data URIs. */
export function fontFaceCss(faces: FontFace[]): string {
  return faces
    .map(
      (face) =>
        `@font-face{font-family:'${face.family}';font-weight:${face.weight};` +
        `src:url(data:font/ttf;base64,${fontBase64(face.file)}) format('truetype');}`,
    )
    .join("\n");
}

/** Everything an Arabic card needs: Cairo for text, Orbitron for the wordmark. */
export function fontsFor(arabic: boolean): FontFace[] {
  return arabic ? [...CAIRO, ...ORBITRON] : [...SPACE, ...ORBITRON];
}

const assetCache = new Map<string, string>();

/** Inlines an SVG from public/ as a data URI so librsvg can embed it. */
export function svgDataUri(publicPath: string): string {
  const cached = assetCache.get(publicPath);
  if (cached) return cached;
  const svg = readFileSync(join(process.cwd(), "public", publicPath), "utf8");
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  assetCache.set(publicPath, uri);
  return uri;
}
