"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faDownload,
  faFilePdf,
  faImage,
  faPrint,
  faQrcode,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { QRCodeSVG } from "qrcode.react";
import { profile } from "../data/profile";
import { buildVCard } from "../utils/vcard";
import { downloadCardAsPng, downloadCardAsPdf, printCard } from "../utils/card-download";
import BusinessCard from "./business-card";

// ---------------------------------------------------------------------------
// .vcf download
// ---------------------------------------------------------------------------
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

type Tab = "qr" | "card";

export default function ContactQrModal({ isOpen, onClose }: ContactQrModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("qr");
  const [isCapturing, setIsCapturing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mount guard — createPortal requires document.body (client-only).
  useEffect(() => { setMounted(true); }, []);

  // Reset tab when modal reopens
  useEffect(() => {
    if (isOpen) setActiveTab("qr");
  }, [isOpen]);

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

  async function handlePng() {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try { await downloadCardAsPng(cardRef.current, profile.fullName); }
    catch (err) { console.error("PNG export failed:", err); }
    finally { setIsCapturing(false); }
  }

  async function handlePdf() {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try { await downloadCardAsPdf(cardRef.current, profile.fullName); }
    catch (err) { console.error("PDF export failed:", err); }
    finally { setIsCapturing(false); }
  }

  async function handlePrint() {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try { await printCard(cardRef.current); }
    catch (err) { console.error("Print failed:", err); }
    finally { setIsCapturing(false); }
  }

  if (!mounted) return null;

  return createPortal(
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

          {/* Modal */}
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
            <p className="qr-modal-eyebrow">Contact</p>
            <h2
              className="qr-modal-name"
              style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
            >
              {profile.fullName}
            </h2>

            {/* Tab switcher */}
            <div className="qr-modal-tabs">
              <button
                className={`qr-modal-tab${activeTab === "qr" ? " qr-modal-tab--active" : ""}`}
                onClick={() => setActiveTab("qr")}
              >
                <FontAwesomeIcon icon={faQrcode} style={{ width: "0.85rem", height: "0.85rem" }} />
                <span>QR Code</span>
              </button>
              <button
                className={`qr-modal-tab${activeTab === "card" ? " qr-modal-tab--active" : ""}`}
                onClick={() => setActiveTab("card")}
              >
                <FontAwesomeIcon icon={faCreditCard} style={{ width: "0.85rem", height: "0.85rem" }} />
                <span>Business Card</span>
              </button>
            </div>

            {/* ── QR tab ──────────────────────────────────────────────── */}
            {activeTab === "qr" && (
              <>
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

                <p className="qr-modal-subtitle">
                  Opens in Contacts on iOS, Android &amp; macOS
                </p>
              </>
            )}

            {/* ── Business Card tab ────────────────────────────────────── */}
            {activeTab === "card" && (
              <div className="qr-modal-card-tab">
                {/* Scrollable preview area so the card fits on small screens */}
                <div className="qr-modal-card-preview">
                  <BusinessCard ref={cardRef} />
                </div>

                {/* Action row: PNG · PDF · Print */}
                <div className="qr-modal-card-actions">
                  <button
                    className="btn-secondary qr-modal-card-action-btn"
                    onClick={handlePng}
                    disabled={isCapturing}
                    aria-label="Download as PNG image"
                  >
                    <FontAwesomeIcon icon={faImage} style={{ width: "0.85rem", height: "0.85rem" }} />
                    <span>PNG</span>
                  </button>
                  <button
                    className="btn-secondary qr-modal-card-action-btn"
                    onClick={handlePdf}
                    disabled={isCapturing}
                    aria-label="Download as PDF"
                  >
                    <FontAwesomeIcon icon={faFilePdf} style={{ width: "0.85rem", height: "0.85rem" }} />
                    <span>PDF</span>
                  </button>
                  <button
                    className="btn-primary qr-modal-card-action-btn"
                    onClick={handlePrint}
                    disabled={isCapturing}
                    aria-label="Print business card"
                  >
                    <FontAwesomeIcon icon={faPrint} style={{ width: "0.85rem", height: "0.85rem" }} />
                    <span>Print</span>
                  </button>
                </div>

                <p className="qr-modal-subtitle">
                  Standard 3.5&Prime; &times; 2&Prime; business card
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
