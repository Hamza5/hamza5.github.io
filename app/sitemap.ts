import type { MetadataRoute } from "next";
import { allLocalizedPaths, absoluteUrl, localePath } from "@/app/lib/site";
import { locales } from "@/app/lib/locales";

// Generated at build time; with output: "export" this becomes a static
// /sitemap.xml listing every locale-prefixed URL. The hreflang alternates in
// each page's <head> already tie the siblings together, so the sitemap itself
// stays a flat list.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return allLocalizedPaths().map(({ locale, path }) => ({
    url: absoluteUrl(localePath(locale, path)),
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: priorityFor(path),
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, absoluteUrl(localePath(l, path))]),
      ),
    },
  }));
}

/** The services pages are the commercial entry points, so they rank highest. */
function priorityFor(path: string): number {
  if (path === "") return 1;
  if (path === "/services") return 0.9;
  if (path.startsWith("/services/")) return 0.8;
  if (path === "/case-studies" || path === "/contact") return 0.8;
  if (path === "/projects") return 0.7;
  return 0.6;
}
