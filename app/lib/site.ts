import { normalizeLocale, type Locale } from "./locales";

/** Canonical origin. The site is published as a GitHub Pages user site. */
export const SITE_URL = "https://hamza5.github.io";

/** Public business number, E.164 without the "+" — used to build wa.me links. */
export const WHATSAPP_NUMBER = "213542511063";

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// ---------------------------------------------------------------------------
// Routes
//
// One table is the source of truth for the nav, the scroll navigator, the
// sitemap and the social cards. `path` is always un-prefixed ("" for the home
// page). Everything else is opt-in, so adding a page means one entry here plus
// its page file and translations.
// ---------------------------------------------------------------------------

export type NavGroupId = "personal" | "services";

export interface RouteEntry {
  /** Un-prefixed route, "" for the home page. */
  path: string;
  /** Group the route belongs to; decides which nav menu shows it. */
  group: NavGroupId;
  /** Shown in the nav. */
  inNav: boolean;
  /** Position in the scroll-navigation order. Lower comes first. */
  scrollRank: number;
  /** i18n key for the nav label. */
  navKey: string;
  /** FontAwesome icon id, resolved in fa-icon.tsx. */
  icon: string;
  /** Key into messages: `seo.<seoKey>` and `og.<seoKey>`. */
  seoKey: string;
  /** Storyset illustration shown on this page's social card. */
  ogImage: string;
  /** Short label for the social card's corner tag (services pages only). */
  ogTag?: string;
}

export const routes: RouteEntry[] = [
  // ── Personal group ──────────────────────────────────────────────────────
  {
    path: "", group: "personal", inNav: true, scrollRank: 0,
    navKey: "nav.home", icon: "house", seoKey: "home",
    ogImage: "/images/services/offer-website.svg",
  },
  {
    path: "/about", group: "personal", inNav: true, scrollRank: 10,
    navKey: "nav.about", icon: "user", seoKey: "about",
    ogImage: "/images/services/offer-website.svg",
  },
  {
    path: "/career", group: "personal", inNav: true, scrollRank: 20,
    navKey: "nav.career", icon: "briefcase", seoKey: "career",
    ogImage: "/images/services/offer-automation.svg",
  },
  {
    path: "/projects", group: "personal", inNav: true, scrollRank: 30,
    navKey: "nav.projects", icon: "folderOpen", seoKey: "projects",
    ogImage: "/images/services/offer-data.svg",
  },
  {
    path: "/skills", group: "personal", inNav: true, scrollRank: 40,
    navKey: "nav.skills", icon: "code", seoKey: "skills",
    ogImage: "/images/services/offer-automation.svg",
  },
  {
    path: "/publications", group: "personal", inNav: true, scrollRank: 50,
    navKey: "nav.publications", icon: "award", seoKey: "publications",
    ogImage: "/images/services/offer-digitization.svg",
  },

  // ── Services group ──────────────────────────────────────────────────────
  {
    path: "/services", group: "services", inNav: true, scrollRank: 60,
    navKey: "nav.services", icon: "briefcase", seoKey: "services",
    ogImage: "/images/services/offer-digitization.svg", ogTag: "nav.services",
  },
  {
    path: "/case-studies", group: "services", inNav: true, scrollRank: 120,
    navKey: "nav.caseStudies", icon: "diagramProject", seoKey: "caseStudies",
    ogImage: "/images/services/offer-data.svg", ogTag: "nav.caseStudies",
  },
  {
    path: "/contact", group: "services", inNav: true, scrollRank: 130,
    navKey: "nav.contact", icon: "comments", seoKey: "contact",
    ogImage: "/images/services/offer-automation.svg", ogTag: "nav.contact",
  },

  // ── Sector sub-pages: linked from /services and each other, not in the nav
  {
    path: "/services/real-estate", group: "services", inNav: false, scrollRank: 70,
    navKey: "nav.services", icon: "building", seoKey: "servicesRealEstate",
    ogImage: "/images/services/sector-real-estate.svg",
    ogTag: "services.sectors.realEstate.name",
  },
  {
    path: "/services/ecommerce", group: "services", inNav: false, scrollRank: 80,
    navKey: "nav.services", icon: "cartShopping", seoKey: "servicesEcommerce",
    ogImage: "/images/services/sector-ecommerce.svg",
    ogTag: "services.sectors.ecommerce.name",
  },
  {
    path: "/services/social-media", group: "services", inNav: false, scrollRank: 90,
    navKey: "nav.services", icon: "hashtag", seoKey: "servicesSocialMedia",
    ogImage: "/images/services/sector-social-media.svg",
    ogTag: "services.sectors.socialMedia.name",
  },
  {
    path: "/services/healthcare", group: "services", inNav: false, scrollRank: 100,
    navKey: "nav.services", icon: "stethoscope", seoKey: "servicesHealthcare",
    ogImage: "/images/services/sector-healthcare.svg",
    ogTag: "services.sectors.healthcare.name",
  },
  {
    path: "/services/manufacturing", group: "services", inNav: false, scrollRank: 110,
    navKey: "nav.services", icon: "gears", seoKey: "servicesManufacturing",
    ogImage: "/images/services/sector-manufacturing.svg",
    ogTag: "services.sectors.manufacturing.name",
  },
];

/** The five sector sub-paths. */
export type SectorPath =
  | "/services/real-estate"
  | "/services/ecommerce"
  | "/services/social-media"
  | "/services/healthcare"
  | "/services/manufacturing";

export function findRoute(path: string): RouteEntry | undefined {
  return routes.find((route) => route.path === path);
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/**
 * Builds a locale-prefixed href: localePath("fr", "/about") → "/fr/about".
 * Accepts a raw string because it is mostly called with useParams(), and
 * normalises so a bad value can never produce a broken href.
 */
export function localePath(locale: string, path: string): string {
  const lang = normalizeLocale(locale);
  return path === "" ? `/${lang}` : `/${lang}${path}`;
}

/** Strips the /{lang} prefix so route matching stays locale-agnostic. */
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
}

/** True when `path` is the route itself or a page nested under it. */
export function matchesRoute(route: RouteEntry, path: string): boolean {
  return route.path === "" ? path === "/" : path.startsWith(route.path);
}

/**
 * Exact path match, normalising a trailing slash. The scroll navigator needs
 * this rather than matchesRoute: /services is a prefix of
 * /services/manufacturing, so prefix matching would put a sector page at the
 * hub's position in the order.
 */
export function exactMatchRoute(pathname: string): RouteEntry | undefined {
  const path = stripLocale(pathname).replace(/\/$/, "") || "/";
  return routes.find((route) => (route.path === "" ? path === "/" : path === route.path));
}

export function groupForPath(pathname: string): NavGroupId {
  const stripped = stripLocale(pathname);
  return routes.find((route) => matchesRoute(route, stripped))?.group ?? "personal";
}

/** Absolute URL, used by the sitemap, JSON-LD and canonical tags. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * hreflang map for one un-prefixed route, e.g.
 * { en: "/en/about", fr: "/fr/about", ar: "/ar/about", "x-default": "/en/about" }.
 */
export function localeAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of ["en", "fr", "ar"] as const) {
    alternates[locale] = localePath(locale, path);
  }
  alternates["x-default"] = localePath("en", path);
  return alternates;
}

// ---------------------------------------------------------------------------
// Social cards
//
// /{lang}/og/{slug}.png, served by app/[lang]/og/[slug]/route.tsx. Slugs are
// flattened page paths so a single dynamic segment covers every page.
// ---------------------------------------------------------------------------

export function ogSlug(path: string): string {
  if (path === "") return "home";
  return path.replace(/^\//, "").replace(/\//g, "-");
}

export function ogImageUrl(locale: string, path: string): string {
  return `/${normalizeLocale(locale)}/og/${ogSlug(path)}.png`;
}

/**
 * Reverse lookup by regenerating each route's slug. Reconstructing the path by
 * replacing dashes is ambiguous — /case-studies and /services/real-estate both
 * flatten to slugs containing dashes.
 */
const slugToPath = new Map(routes.map((route) => [ogSlug(route.path), route.path]));

export function pathFromOgSlug(slug: string): string | null {
  const bare = slug.replace(/\.png$/i, "");
  return slugToPath.has(bare) ? (slugToPath.get(bare) as string) : null;
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

/** Every indexable URL on the site, in sitemap order. */
export function allLocalizedPaths(): { locale: Locale; path: string }[] {
  const out: { locale: Locale; path: string }[] = [];
  for (const locale of ["en", "fr", "ar"] as const) {
    for (const route of routes) {
      out.push({ locale, path: route.path });
    }
  }
  return out;
}
