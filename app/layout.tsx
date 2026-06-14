import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk, Cairo } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ThemeToggle from "./components/theme-toggle";
import LangToggle from "./components/lang-toggle";
import Nav from "./components/nav";
import ScrollNavigator from "./components/scroll-navigator";
import PageTitle from "./components/page-title";
import I18nProvider from "./components/i18n-provider";
import { NavDirectionProvider } from "./components/nav-direction-context";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Hamza Abbad",
  description: "Engineer in Artificial Intelligence and Computer Science",
  icons: {
    icon: "/avatar.svg",
    apple: "/avatar.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Inline scripts run before CSS loads to avoid FOUC.
const themeScript = `(function(){
  var s=localStorage.getItem('theme');
  var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark)document.documentElement.classList.add('dark');
})();`;

// Reads stored/system locale and sets html[lang] + html[dir] immediately.
const localeScript = `(function(){
  var stored=localStorage.getItem('lang');
  var lang=stored;
  if(!lang){
    var nav=(navigator.language||'').toLowerCase();
    if(nav.startsWith('ar'))lang='ar';
    else if(nav.startsWith('fr'))lang='fr';
    else lang='en';
  }
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${cairo.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body>
        <I18nProvider>
          <NavDirectionProvider>
            <PageTitle />
            <ThemeToggle />
            <LangToggle />
            <Nav />
            <ScrollNavigator />
            {children}
          </NavDirectionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
