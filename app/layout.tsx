import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ThemeToggle from "./components/theme-toggle";
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

export const metadata: Metadata = {
  title: "Hamza Abbad",
  description: "Engineer in Artificial Intelligence and Computer Science",
};

// Inline script run before CSS loads — sets .dark class to avoid FOUC.
// Stores localStorage key only when the chosen mode differs from system default.
const themeScript = `(function(){
  var s=localStorage.getItem('theme');
  var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(dark)document.documentElement.classList.add('dark');
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orbitron.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
