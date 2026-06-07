import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SlidingTexts from "./components/sliding-texts";
import HeroActions from "./components/hero-actions";

export default function Home() {
  return (
    <main>
      <div className="synthwave-hero min-h-screen flex items-center justify-center" style={{ position: "relative" }}>
      {/* All hero content sits above the CSS pseudo-element grid */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="flex flex-col items-center text-center px-6 py-20 gap-6"
      >
        {/* Avatar */}
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

        {/* Name */}
        <h1
          className="entrance-2 gradient-text"
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          Hamza Abbad
        </h1>

        {/* Role carousel */}
        <div className="entrance-3">
          <SlidingTexts />
        </div>

        {/* Bio */}
        <p
          className="entrance-4"
          style={{
            color: "var(--fg-muted)",
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            maxWidth: "26rem",
            lineHeight: 1.6,
            marginTop: "-0.25rem",
          }}
        >
          Engineer in Artificial Intelligence and Computer Science
        </p>

        {/* CTA buttons */}
        <HeroActions />
      </div>

      {/* Scroll indicator — links to About page */}
      <Link href="/about" className="scroll-chevron" aria-label="Go to About page">
        <FontAwesomeIcon icon={faChevronDown} />
      </Link>
    </div>
    </main>
  );
}
