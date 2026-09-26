import { svgDataUri } from "./fonts";
import { measureOne, textElement, wrapText, type TextStyle } from "./text";
import { localeMeta, type Locale } from "@/app/lib/locales";
import { getMessage, getOgCopy } from "@/app/lib/messages";
import type { RouteEntry } from "@/app/lib/site";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const COLOR = {
  ink: "#e8ecff",
  muted: "#9aa4c8",
  faint: "#6f7ba3",
  cyan: "#00d4ff",
  purple: "#9d65f0",
  artBoard: "#eef1fb",
};

const NAME = "Hamza Abbad";
const TAGLINE_KEY = "og.tagline";

const PAD_X = 64;
const COLUMN = 648;
const ART = 352;
const ART_INSET = 72;
const AVATAR = 82;
const AVATAR_GAP = 22;
const TITLE_LINE = 56;
const DESC_LINE = 34;
const IDENTITY_BOTTOM = 150;
const FOOTER_TOP = 556;

const round = (n: number) => Math.round(n * 100) / 100;

export async function buildCardSvg({
  locale,
  route,
}: {
  locale: Locale;
  route: RouteEntry;
}): Promise<string> {
  const rtl = localeMeta[locale].dir === "rtl";
  const arabic = locale === "ar";

  const { title, description } = getOgCopy(locale, route.seoKey);
  const tagline = getMessage(locale, TAGLINE_KEY);
  const tag = route.ogTag ? getMessage(locale, route.ogTag) : null;

  const bodyFamily = arabic ? "Cairo" : "Space Grotesk";
  const titleStyle: TextStyle = { rtl, family: bodyFamily, weight: 700, size: 46 };
  const descStyle: TextStyle = { rtl, family: bodyFamily, weight: 400, size: 23 };
  const nameStyle: TextStyle = {
    rtl,
    family: arabic ? "Cairo" : "Orbitron",
    weight: 900,
    size: 27,
    letterSpacing: arabic ? undefined : 2,
  };
  const taglineStyle: TextStyle = {
    rtl,
    family: bodyFamily,
    weight: arabic ? 600 : 500,
    size: 18,
  };
  const tagStyle: TextStyle = {
    rtl,
    family: bodyFamily,
    weight: 700,
    size: 15,
    letterSpacing: arabic ? undefined : 1.6,
  };
  const footStyle: TextStyle = { rtl, family: bodyFamily, weight: 500, size: 19 };

  const titleLines = await wrapText(title, COLUMN, titleStyle, 2);
  const descLines = await wrapText(description, COLUMN, descStyle, 3);
  const tagWidth = tag ? (await measureOne(tag, tagStyle)) + 36 : 0;

  // Fail the build rather than ship a clipped card. Wrapping is measured from
  // real shaped ink, so an overflow here means the copy or the column changed
  // in a way the layout no longer accommodates.
  await assertFits(titleLines, titleStyle, `${route.seoKey} title`);
  await assertFits(descLines, descStyle, `${route.seoKey} description`);
  if (tag && tagWidth > COLUMN) {
    throw new Error(`OG card ${locale}/${route.seoKey}: sector tag is wider than the column`);
  }

  // Identity is pinned to the top, the footer to the bottom, and the
  // title/description group is centred in whatever space is left.
  const groupHeight =
    (tag ? 46 : 0) +
    titleLines.length * TITLE_LINE +
    16 +
    descLines.length * DESC_LINE;
  const groupTop = IDENTITY_BOTTOM + (FOOTER_TOP - IDENTITY_BOTTOM - groupHeight) / 2;
  const titleY = groupTop + (tag ? 46 : 0) + 34;
  const descY = titleY + titleLines.length * TITLE_LINE + 16;
  if (groupTop < IDENTITY_BOTTOM || descY + (descLines.length - 1) * DESC_LINE > FOOTER_TOP - 12) {
    throw new Error(
      `OG card ${locale}/${route.seoKey}: copy does not fit between the identity and the footer`,
    );
  }

  // In SVG, text-anchor="start" aligns the *logical* start of the run, which is
  // the right-hand character for an RTL run. So the same anchor works for both
  // directions as long as x is the correct edge of the column.
  const anchorX = rtl ? OG_SIZE.width - PAD_X : PAD_X;
  const anchor = "start";
  const block = (x: number, lines: string[], style: TextStyle, color: string, step: number, y0: number) =>
    `<g text-anchor="${anchor}">${lines
      .map((line, i) => textElement(x, round(y0 + i * step), line, style, color))
      .join("")}</g>`;

  const avatarCx = rtl ? OG_SIZE.width - PAD_X - AVATAR / 2 : PAD_X + AVATAR / 2;
  const avatarX = rtl ? OG_SIZE.width - PAD_X - AVATAR : PAD_X;
  const nameX = rtl ? anchorX - (AVATAR + AVATAR_GAP) : anchorX + (AVATAR + AVATAR_GAP);
  const artX = rtl ? ART_INSET : OG_SIZE.width - ART_INSET - ART;
  const artY = (OG_SIZE.height - ART) / 2;
  const ruleX = rtl ? OG_SIZE.width - PAD_X - 112 : PAD_X;
  const urlX = rtl ? anchorX - 128 : anchorX + 128;
  const tagX = rtl ? OG_SIZE.width - PAD_X - tagWidth : PAD_X;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${OG_SIZE.width}" height="${OG_SIZE.height}" viewBox="0 0 ${OG_SIZE.width} ${OG_SIZE.height}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#05050f"/><stop offset="0.52" stop-color="#141136"/><stop offset="1" stop-color="#1c1046"/>
</linearGradient>
<linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${COLOR.cyan}"/><stop offset="1" stop-color="${COLOR.purple}"/>
</linearGradient>
<radialGradient id="violet" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="${COLOR.purple}" stop-opacity="0.55"/><stop offset="0.66" stop-color="${COLOR.purple}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="cyan" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="${COLOR.cyan}" stop-opacity="0.42"/><stop offset="0.68" stop-color="${COLOR.cyan}" stop-opacity="0"/>
</radialGradient>
<clipPath id="avatarClip"><circle cx="${round(avatarCx)}" cy="107" r="40"/></clipPath>
</defs>

<rect width="${OG_SIZE.width}" height="${OG_SIZE.height}" fill="url(#bg)"/>
<ellipse cx="${rtl ? 190 : OG_SIZE.width - 190}" cy="70" rx="400" ry="400" fill="url(#violet)"/>
<ellipse cx="${rtl ? OG_SIZE.width - 230 : 230}" cy="600" rx="440" ry="330" fill="url(#cyan)"/>
${horizon()}
<rect x="24" y="24" width="${OG_SIZE.width - 48}" height="${OG_SIZE.height - 48}" rx="24" fill="none" stroke="${COLOR.ink}" stroke-opacity="0.13"/>

<g transform="rotate(${rtl ? 3 : -3} ${round(artX + ART / 2)} ${round(artY + ART / 2)})">
<rect x="${round(artX)}" y="${round(artY)}" width="${ART}" height="${ART}" rx="36" fill="${COLOR.artBoard}" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
<image x="${round(artX + (ART - 268) / 2)}" y="${round(artY + (ART - 268) / 2)}" width="268" height="268" preserveAspectRatio="xMidYMid meet" xlink:href="${svgDataUri(route.ogImage)}"/>
</g>

<circle cx="${round(avatarCx)}" cy="107" r="42" fill="#141136"/>
<g clip-path="url(#avatarClip)">
<image x="${round(avatarX)}" y="66" width="${AVATAR}" height="${AVATAR}" preserveAspectRatio="xMidYMid slice" xlink:href="${svgDataUri("/avatar.svg")}"/>
</g>
<circle cx="${round(avatarCx)}" cy="107" r="42" fill="none" stroke="${COLOR.cyan}" stroke-width="3"/>
<g text-anchor="${anchor}">
${textElement(round(nameX), 102, NAME, nameStyle, COLOR.ink)}
${textElement(round(nameX), 132, tagline, taglineStyle, COLOR.cyan)}
</g>

${
  tag
    ? `<rect x="${round(tagX)}" y="${round(groupTop)}" width="${round(tagWidth)}" height="32" rx="16" fill="${COLOR.purple}" fill-opacity="0.13" stroke="${COLOR.purple}" stroke-opacity="0.6" stroke-width="2"/>
<g text-anchor="${anchor}">${textElement(round(rtl ? OG_SIZE.width - PAD_X - 18 : PAD_X + 18), round(groupTop + 22), tag, tagStyle, COLOR.purple)}</g>`
    : ""
}
${block(anchorX, titleLines, titleStyle, COLOR.ink, TITLE_LINE, titleY)}
${block(anchorX, descLines, descStyle, COLOR.muted, DESC_LINE, descY)}

<rect x="${round(ruleX)}" y="${FOOTER_TOP}" width="112" height="4" rx="2" fill="url(#rule)"/>
<g text-anchor="${anchor}">${textElement(round(urlX), FOOTER_TOP + 6, "hamza5.github.io", footStyle, COLOR.faint)}</g>
</svg>`;
}

async function assertFits(
  lines: string[],
  style: TextStyle,
  label: string,
): Promise<void> {
  for (const line of lines) {
    const width = await measureOne(line, style);
    if (width > COLUMN) {
      throw new Error(
        `OG card ${label}: line exceeds the ${COLUMN}px column (${Math.round(width)}px): "${line}"`,
      );
    }
  }
}

/** Synthwave horizon: vertical rays and evenly spaced lines behind the copy. */
function horizon(): string {
  const parts: string[] = [];
  for (let x = 0; x < OG_SIZE.width; x += 75) {
    parts.push(
      `<rect x="${x}" y="${OG_SIZE.height - 250}" width="1" height="250" fill="${COLOR.cyan}" fill-opacity="0.15"/>`,
    );
  }
  for (const y of [0, 26, 58, 96, 140, 190]) {
    parts.push(
      `<rect x="0" y="${OG_SIZE.height - 26 - y}" width="${OG_SIZE.width}" height="1" fill="${COLOR.cyan}" fill-opacity="${(0.3 - y / 760).toFixed(3)}"/>`,
    );
  }
  return parts.join("");
}
