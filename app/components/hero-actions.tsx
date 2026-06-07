"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare, faQrcode } from "@fortawesome/free-solid-svg-icons";
import ContactQrModal from "./contact-qr-modal";

export default function HeroActions() {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <>
      <div className="entrance-5 flex flex-wrap items-center justify-center gap-3">
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

        {/* Share Contact — opens QR modal */}
        <button
          onClick={() => setQrOpen(true)}
          className="btn-secondary btn-qr"
          aria-label="Share contact as QR code"
        >
          <FontAwesomeIcon
            icon={faQrcode}
            style={{ width: "1rem", height: "1rem" }}
          />
          <span>Share Contact</span>
        </button>
      </div>

      <ContactQrModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
