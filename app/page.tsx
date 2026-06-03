import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import SlidingTexts from "./components/sliding-texts";

export default function Home() {
  return (
    <main className="synthwave-hero min-h-screen flex items-center justify-center">
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

        {/* Role carousel — direct identity statement under the name */}
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
        <div
          className="entrance-5 flex flex-wrap items-center justify-center gap-3"
          style={{ marginTop: "0.5rem" }}
        >
          {/* GitHub — primary CTA */}
          <a
            href="https://github.com/Hamza5"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <FontAwesomeIcon
              icon={faGithub}
              style={{ width: "1.125rem", height: "1.125rem" }}
            />
            <span>Check out my code</span>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              style={{ width: "0.75rem", height: "0.75rem", opacity: 0.7 }}
            />
          </a>

          {/* Stack Overflow — secondary */}
          <a
            href="https://stackoverflow.com/users/5008968/hamza-abbad"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-stackoverflow"
          >
            <FontAwesomeIcon
              icon={faStackOverflow}
              style={{ width: "1rem", height: "1rem" }}
            />
            <span>Stack Overflow</span>
          </a>

          {/* LinkedIn — secondary */}
          <a
            href="https://www.linkedin.com/in/hamza-abbad/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-linkedin"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              style={{ width: "1rem", height: "1rem" }}
            />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </main>
  );
}
