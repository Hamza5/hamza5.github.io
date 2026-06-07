"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload } from "@fortawesome/free-solid-svg-icons";
import { QRCodeSVG } from "qrcode.react";
import { profile } from "../data/profile";

// ---------------------------------------------------------------------------
// vCard builder — version 3.0, widest scanner compatibility.
// ---------------------------------------------------------------------------
function buildVCard(): string {
  const { fullName, shortDescription, contact, socialLinks } = profile;
  const email = contact.emails[0] ?? "";
  const phone = contact.phones[0]?.number ?? "";
  // Name split: "Hamza Abbad" → N:Abbad;Hamza;;;
  const parts = fullName.trim().split(/\s+/);
  const givenName = parts[0] ?? "";
  const familyName = parts.slice(1).join(" ");
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${familyName};${givenName};;;`,
    `TITLE:${shortDescription}`,
  ];
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
  for (const link of socialLinks) {
    lines.push(`URL:${link.url}`);
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

function downloadVcf() {
  const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.fullName.replace(/\s+/g, "_")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
interface ContactQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactQrModal({ isOpen, onClose }: ContactQrModalProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const vCardString = buildVCard();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qr-backdrop"
            className="qr-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            key="qr-card"
            role="dialog"
            aria-modal="true"
            aria-label="Share contact card"
            className="qr-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              className="qr-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faXmark} style={{ width: "1rem", height: "1rem" }} />
            </button>

            {/* Heading */}
            <p className="qr-modal-eyebrow">Scan to save contact</p>
            <h2
              className="qr-modal-name"
              style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
            >
              {profile.fullName}
            </h2>

            {/* QR code — always white bg + black modules for reliable scanning */}
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={vCardString}
                size={220}
                level="H"
                bgColor="#ffffff"
                fgColor="#111111"
                imageSettings={{
                  src: "/avatar.svg",
                  width: 46,
                  height: 46,
                  excavate: true,
                }}
              />
            </div>

            {/* Download .vcf */}
            <button className="btn-primary qr-modal-download" onClick={downloadVcf}>
              <FontAwesomeIcon icon={faDownload} style={{ width: "0.875rem", height: "0.875rem" }} />
              <span>Download .vcf</span>
            </button>

            {/* Subtitle */}
            <p className="qr-modal-subtitle">
              Opens in Contacts on iOS, Android &amp; macOS
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
