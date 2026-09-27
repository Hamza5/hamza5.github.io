import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Cairo } from "next/font/google";
import { getMessages } from "@/app/lib/messages";
import { absoluteUrl, localeAlternates, localePath, ogImageUrl } from "@/app/lib/site";
import { defaultLocale } from "@/app/lib/locales";
import {
  localeRedirectConfig,
  localeRedirectScript,
  localeUrl,
} from "@/app/lib/locale-redirect";
import LocaleGateLinks from "./components/locale-gate-links";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

const messages = getMessages("en");

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Canonical points at /en because that is where this page's content lives; the
 * hreflang set is the same one every other page uses, in absolute form since
 * this page has no layout to inherit metadataBase from.
 *
 * noindex because the page is a redirect stub rather than a page of its own: the
 * copy below is a fallback for browsers that never run the redirect, and
 * indexing it would put a near-duplicate of /en in the index.
 */
export const metadata: Metadata = {
  title: messages.seo.home.title,
  description: messages.seo.home.description,
  alternates: {
    canonical: absoluteUrl(localePath("en", "")),
    languages: Object.fromEntries(
      Object.entries(localeAlternates("")).map(([code, path]) => [code, absoluteUrl(path)]),
    ),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl(localePath("en", "")),
    siteName: "Hamza Abbad",
    title: messages.seo.home.title,
    description: messages.seo.home.description,
    images: [{ url: absoluteUrl(ogImageUrl("en", "")), width: 1200, height: 630, alt: messages.og.home.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: messages.seo.home.title,
    description: messages.seo.home.description,
    images: [absoluteUrl(ogImageUrl("en", ""))],
  },
  robots: { index: false, follow: true },
};

const themeScript = `(function(){
  var s=localStorage.getItem('theme');
  var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark)document.documentElement.classList.add('dark');
})();`;

/**
 * The root path.
 *
 * This used to be a hand-written file in public/ that only redirected. Rendering
 * a real page instead means the export produces out/index.html the same way it
 * produces every other file, so the site cannot end up with a missing or stale
 * homepage.
 *
 * The visitor is never asked to choose. Three layers, in order of preference:
 * the blocking script in <head> redirects to their saved language or their
 * browser's, before anything is painted; a <noscript> refresh covers scripting
 * being off; the language links below are what remains if both are unavailable.
 * Nothing here should ever be the page somebody reads, which is why the copy is
 * just a name, a tagline and those links.
 *
 * There is no root layout, so the document shell and the stylesheet are declared
 * here, the way app/not-found.tsx does it.
 */
export default function RootPage() {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* First thing in the document: the language is resolved, and the
            navigation started, before the browser has anything to paint. */}
        <script dangerouslySetInnerHTML={{ __html: localeRedirectScript() }} />
        {/* Read back by scripts/generate-entry-points.mjs, which writes the
            same redirect for every un-prefixed path. */}
        <script
          type="application/json"
          id="locale-config"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localeRedirectConfig()) }}
        />
        <noscript>
          <meta http-equiv="refresh" content={`0; url=${localeUrl(defaultLocale)}`} />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className={`locale-gate ${orbitron.variable} ${spaceGrotesk.variable} ${cairo.variable}`}>
          <div className="locale-gate-inner">
            <h1 className="locale-gate-name">{messages.profile.fullName}</h1>
            <p className="locale-gate-subtitle">{messages.profile.shortDescription}</p>

            <LocaleGateLinks />
          </div>
        </main>
      </body>
    </html>
  );
}
