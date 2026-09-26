import sharp from "sharp";
import { buildCardSvg, OG_SIZE } from "./card";
import type { Locale } from "@/app/lib/locales";
import type { RouteEntry } from "@/app/lib/site";

export { OG_SIZE } from "./card";

/**
 * Renders one social card to PNG.
 *
 * The card is authored as SVG and rasterised by sharp, which delegates to
 * librsvg. That matters for Arabic: Pango and HarfBuzz shape and reorder the
 * script correctly, which satori (the usual next/og path) cannot do — it
 * mis-measures shaped runs and spreads words apart to compensate.
 *
 * sharp is already a Next.js dependency, so this adds nothing to the install.
 */
export async function renderOgPng({
  locale,
  route,
}: {
  locale: Locale;
  route: RouteEntry;
}): Promise<Buffer> {
  const svg = await buildCardSvg({ locale, route });
  return sharp(Buffer.from(svg), { density: 96 })
    .resize(OG_SIZE.width, OG_SIZE.height)
    .png({ compressionLevel: 9 })
    .toBuffer();
}
