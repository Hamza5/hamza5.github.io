"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SlidingTexts from "./components/sliding-texts";
import HeroActions from "./components/hero-actions";
import HeroBio from "./components/hero-bio";
import { useLocalizedProfile } from "./hooks/use-localized-profile";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { fullName } = useLocalizedProfile();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  return (
    <main>
      <div className="synthwave-hero min-h-screen flex items-center justify-center" style={{ position: "relative" }}>
        <div
          style={{ position: "relative", zIndex: 10 }}
          className="flex flex-col items-center text-center px-6 py-20 gap-6"
        >
          <div className="entrance-1">
            <Image
              src="/avatar.svg"
              alt="Hamza Abbad"
              width={108}
              height={108}
              priority
              className="rounded-full avatar-glow"
              style={{ width: 108, height: 108 }}
            />
          </div>

          <h1
            className="entrance-2 gradient-text"
            style={{
              fontFamily: isAr
                ? "var(--font-cairo), 'Cairo', sans-serif"
                : "var(--font-orbitron), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {fullName}
          </h1>

          <div className="entrance-3">
            <SlidingTexts />
          </div>

          <HeroBio />

          <HeroActions />
        </div>

        <Link href="/about" className="scroll-chevron" aria-label="Go to About page">
          <FontAwesomeIcon icon={faChevronDown} />
        </Link>
      </div>
    </main>
  );
}
