import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Cairo } from "next/font/google";
import { defaultLocale } from "@/app/lib/locales";
import { localePath } from "@/app/lib/site";
import { getSeo } from "@/app/lib/messages";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "Page not found — Hamza Abbad",
  robots: { index: false, follow: true },
};

const themeScript = `(function(){
  var s=localStorage.getItem('theme');
  var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark)document.documentElement.classList.add('dark');
})();`;

/**
 * GitHub Pages serves /404.html for any unmatched path. There is no root
 * layout to inherit from — the language is unknown at this point — so this page
 * brings its own styles, fonts and theme script, and links to all three roots.
 */
export default function NotFound() {
  const { description } = getSeo(defaultLocale, "notFound");

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main
          className={`notfound ${orbitron.variable} ${spaceGrotesk.variable} ${cairo.variable}`}
        >
          <div className="notfound-inner">
            <p className="notfound-code" aria-hidden="true">
              404
            </p>
            <h1 className="notfound-title">Page not found</h1>
            <p className="notfound-body">{description}</p>
            <nav className="notfound-links" aria-label="Suggested pages">
              <a href={localePath("en", "/services")} className="btn-primary">
                Services
              </a>
              <a href={localePath("en", "/case-studies")} className="btn-secondary">
                Case studies
              </a>
              <a href={localePath("en", "/contact")} className="btn-secondary">
                Contact
              </a>
              <a href={localePath("en", "")} className="btn-secondary">
                Home
              </a>
            </nav>
            <p className="notfound-langs">
              Also available in{" "}
              <a href={localePath("fr", "")} hrefLang="fr">
                Français
              </a>{" "}
              ·{" "}
              <a href={localePath("ar", "")} hrefLang="ar">
                العربية
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
