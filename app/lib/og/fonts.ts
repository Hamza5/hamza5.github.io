import { readFileSync } from "node:fs";
import { join } from "node:path";
import { registerFonts } from "./fontconfig";

/**
 * Typefaces and artwork for the social cards.
 *
 * Satori (the usual next/og renderer) cannot shape Arabic script and silently
 * mis-measures shaped runs, so the cards are rendered as SVG through sharp,
 * which uses librsvg — Pango and HarfBuzz give correct Arabic shaping and bidi.
 * Those resolve a family by name only, so the faces are registered with
 * fontconfig rather than inlined into the SVG; see fontconfig.ts.
 *
 * assets/fonts holds static instances subset from the same Google Fonts variable
 * originals the site already loads via next/font, one file per family and weight,
 * under the family name the cards ask for. Build-time only; nothing is shipped to
 * visitors. All SIL Open Font License.
 */

registerFonts();

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
