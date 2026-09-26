import { renderOgPng, OG_SIZE } from "@/app/lib/og";
import { locales, normalizeLocale } from "@/app/lib/locales";
import { findRoute, ogSlug, pathFromOgSlug, routes } from "@/app/lib/site";

export const dynamic = "force-static";
export const runtime = "nodejs";

/** One PNG per page per language: /{lang}/og/{slug}.png */
export function generateStaticParams() {
  return locales.flatMap((lang) => routes.map((route) => ({ lang, slug: ogSlug(route.path) })));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  const locale = normalizeLocale(lang);
  const path = pathFromOgSlug(slug);
  const route = path === null ? undefined : findRoute(path);

  if (!route) {
    return new Response("Not found", { status: 404 });
  }

  const png = await renderOgPng({ locale, route });
  return new Response(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
      "x-og-size": `${OG_SIZE.width}x${OG_SIZE.height}`,
    },
  });
}
