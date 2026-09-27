import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Cairo } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { GoogleTagManager } from "@next/third-parties/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ThemeToggle from "../components/theme-toggle";
import LangToggle from "../components/lang-toggle";
import Nav from "../components/nav";
import ScrollNavigator from "../components/scroll-navigator";
import Credits from "../components/credits";
import I18nProvider from "../components/i18n-provider";
import { NavDirectionProvider } from "../components/nav-direction-context";
import StructuredData from "../components/structured-data";
import "../globals.css";
import { localeMeta, locales, normalizeLocale } from "@/app/lib/locales";
import { localePath, localeAlternates, ogImageUrl, SITE_URL } from "@/app/lib/site";
import { getMessages } from "@/app/lib/messages";
import { buildPersonSchema, buildWebSiteSchema } from "@/app/lib/seo";

config.autoAddCss = false;

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/** Only the three supported locales are prerendered; anything else 404s. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizeLocale(lang);
  const messages = getMessages(locale);
  const home = localePath(locale, "");

  return {
    metadataBase: new URL(SITE_URL),
    // Page-level titles are written out in full, so no template is applied.
    title: messages.seo.home.title,
    description: messages.seo.home.description,
    applicationName: messages.profile.fullName,
    icons: {
      icon: "/avatar.svg",
      apple: "/avatar.svg",
    },
    authors: [{ name: messages.profile.fullName, url: home }],
    creator: messages.profile.fullName,
    publisher: messages.profile.fullName,
    alternates: {
      canonical: home,
      languages: localeAlternates(""),
    },
    openGraph: {
      type: "website",
      url: home,
      siteName: messages.profile.fullName,
      title: messages.seo.home.title,
      description: messages.seo.home.description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      images: [
        {
          url: ogImageUrl(locale, ""),
          width: 1200,
          height: 630,
          alt: messages.og.home.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.seo.home.title,
      description: messages.seo.home.description,
      images: [ogImageUrl(locale, "")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}

// Runs before CSS loads so the stored/system theme never flashes.
const themeScript = `(function(){
  var s=localStorage.getItem('theme');
  var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark)document.documentElement.classList.add('dark');
})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizeLocale(lang);
  const meta = localeMeta[locale];
  const resources = getMessages(locale);

  return (
    // No className on <html> on purpose. React reconciles the attributes of
    // elements it renders, so a className here would be rewritten whenever the
    // [lang] segment changes, stripping the `dark` class that the theme script
    // and ThemeToggle own. The font variables live on <body> instead, where
    // they still cascade to everything.
    <html lang={meta.htmlLang} dir={meta.dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${orbitron.variable} ${spaceGrotesk.variable} ${cairo.variable}`}>
        <I18nProvider locale={locale} resources={resources}>
          <NavDirectionProvider>
            {/* Absolute ids keep the Person/WebSite graph identical across the
                three locale copies, so they merge into single nodes. */}
            <StructuredData
              data={[buildPersonSchema(resources), buildWebSiteSchema(resources, locale)]}
            />
            <ThemeToggle />
            <LangToggle locale={locale} />
            <Nav />
            <ScrollNavigator />
            {children}
            <Credits />
            <GoogleTagManager gtmId="G-WP1TDQXLS6" />
          </NavDirectionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
