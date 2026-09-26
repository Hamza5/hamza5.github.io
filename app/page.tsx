import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Cairo } from "next/font/google";
import { getMessages } from "@/app/lib/messages";
import { absoluteUrl, localeAlternates, localePath, ogImageUrl } from "@/app/lib/site";
import LocaleRedirect from "./components/locale-redirect";
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

/**
 * Canonical points at /en because this page renders the English content; the
 * hreflang set is the same one every other page uses, in absolute form since
 * this page has no layout to inherit metadataBase from.
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
  robots: { index: true, follow: true },
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
 * homepage, and there is something meaningful to show if scripting is off.
 *
 * The visitor is not asked to choose: LocaleRedirect sends them to their saved
 * language, or the one their browser asks for, without a chooser in the way.
 * What is left here is the name and a small set of language links, which cover
 * the case where detection cannot decide and the case where scripting never runs
 * at all.
 *
 * There is no root layout, so the document shell and the stylesheet are declared
 * here, the way app/not-found.tsx does it.
 */
export default function RootPage() {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className={`locale-gate ${orbitron.variable} ${spaceGrotesk.variable} ${cairo.variable}`}>
          <LocaleRedirect />

          <div className="locale-gate-inner">
            <h1 className="locale-gate-name">{messages.profile.fullName}</h1>
            <p className="locale-gate-subtitle">{messages.profile.shortDescription}</p>

            <LocaleGateLinks />

            <a href={absoluteUrl("/")} className="locale-gate-services">
              {messages.nav.services}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
