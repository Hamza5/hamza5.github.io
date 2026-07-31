"use client";

import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { QRCodeSVG } from "qrcode.react";
import { profile } from "../data/profile";
import { buildVCard } from "../utils/vcard";
import { useLocalizedProfile } from "../hooks/use-localized-profile";

// ---------------------------------------------------------------------------
// Business card — 525 × 300 CSS px display size, captured at 2× for print.
// Standard business card dimensions: 3.5" × 2" at 300 DPI = 1050 × 600 px.
// ---------------------------------------------------------------------------

const CARD_W = 525;
const CARD_H = 300;
const LEFT_W = 175; // ~33% — QR + avatar panel

const NAV_BG_START = "#0d1b3e";
const NAV_BG_END   = "#0a4d6e";
const ACCENT_CYAN  = "#0099bb";
const TEXT_NAVY    = "#0d1b3e";
const TEXT_MUTED   = "#4a6080";

const email          = profile.contact.emails[0] ?? "";
const phone          = profile.contact.phones[0]?.label ?? "";
const portfolioUrl   = profile.socialLinks.find((l) => l.label === "Portfolio")?.url ?? "";
const portfolioDisplay = portfolioUrl.replace(/^https?:\/\//, "");

const BusinessCard = forwardRef<HTMLDivElement>(function BusinessCard(_props, ref) {
  const { fullName, shortDescription } = useLocalizedProfile();
  const vCard = buildVCard(shortDescription);
  return (
    <div
      ref={ref}
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 0,
        overflow: "hidden",
        display: "flex",
        flexShrink: 0,
        boxShadow:
          "0 8px 30px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
        fontFamily: "var(--font-space), 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      {/* ── Left panel — gradient + QR ─────────────────────────────────── */}
      <div
        style={{
          width: LEFT_W,
          flexShrink: 0,
          background: `linear-gradient(155deg, ${NAV_BG_START} 0%, ${NAV_BG_END} 52%, #0e6b8a 100%)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "8px 8px",
        }}
      >
        {/* Right-edge diagonal slice */}
        <div style={{
          position: "absolute",
          top: 0, right: 0,
          width: 42, height: "100%",
          background: "rgba(0,212,255,0.10)",
          clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)",
          pointerEvents: "none",
        }} />
        {/* Top-left corner shape */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: LEFT_W, height: 42,
          background: "rgba(255,255,255,0.05)",
          clipPath: "polygon(0% 0%, 100% 0%, 55% 100%, 0% 100%)",
          pointerEvents: "none",
        }} />
        {/* Bottom-left glow circle */}
        <div style={{
          position: "absolute",
          bottom: -24, left: -24,
          width: 80, height: 80,
          borderRadius: "50%",
          background: "rgba(0,212,255,0.15)",
          pointerEvents: "none",
        }} />

        {/* Avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.svg"
          alt=""
          width={96}
          height={96}
          style={{
            borderRadius: "50%",
            border: `2.5px solid rgba(255,255,255,0.4)`,
            position: "relative",
            zIndex: 1,
            boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
          }}
        />

        {/* QR code */}
        <div style={{
          background: "#ffffff",
          borderRadius: 8,
          padding: 4,
          position: "relative",
          zIndex: 1,
          boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
        }}>
          <QRCodeSVG
            value={vCard}
            size={124}
            level="M"
            bgColor="#ffffff"
            fgColor={TEXT_NAVY}
          />
        </div>

        <p style={{
          color: "rgba(255,255,255,0.58)",
          fontSize: 9,
          textAlign: "center",
          margin: 0,
          letterSpacing: "0.045em",
          position: "relative",
          zIndex: 1,
        }}>
          Scan to save contact
        </p>
      </div>

      {/* ── Right panel — white with subtle effects ────────────────────── */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "36px 14px 36px 12px",
        }}
      >
        {/* Decorative: subtle dot grid across entire panel */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(0,153,187,0.12) 1px, transparent 1px)",
          backgroundSize: "11px 11px",
          pointerEvents: "none",
        }} />
        {/* Decorative: soft cyan glow in top-right corner */}
        <div style={{
          position: "absolute",
          top: -44, right: -44,
          width: 140, height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,153,187,0.11) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        {/* Decorative: subtle left-edge bleed — bridges the two panels visually */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: 24, height: "100%",
          background: "linear-gradient(to right, rgba(0,153,187,0.06), transparent)",
          pointerEvents: "none",
        }} />
        {/* Decorative: very faint purple accent at bottom-right */}
        <div style={{
          position: "absolute",
          bottom: -18, right: 10,
          width: 72, height: 72,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* ── Content column — three zones pushed to fill full height ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}>
          {/* Zone 1: Name + title */}
          <div>
            {/* Full name */}
            <div style={{
              fontFamily: "var(--font-orbitron), 'Orbitron', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 25,
              color: TEXT_NAVY,
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
              marginBottom: 3,
              wordBreak: "break-word",
            }}>
              {fullName}
            </div>

            {/* Title / role */}
            <div style={{
              fontSize: 15,
              color: ACCENT_CYAN,
              lineHeight: 1.35,
              fontWeight: 600,
              wordBreak: "break-word",
            }}>
              {shortDescription}
            </div>
          </div>

          {/* Zone 2: Divider with cyan dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 5, height: 5,
              borderRadius: "50%",
              background: ACCENT_CYAN,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, borderTop: "1px solid #dce8f0" }} />
          </div>

          {/* Zone 3: Contact rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <ContactRow
              icon={<FontAwesomeIcon icon={faEnvelope} style={{ width: 13, height: 13, color: ACCENT_CYAN }} />}
              text={email}
            />
            <ContactRow
              icon={<FontAwesomeIcon icon={faPhone} style={{ width: 13, height: 13, color: ACCENT_CYAN }} />}
              text={phone}
            />
            <ContactRow
              icon={<FontAwesomeIcon icon={faGlobe} style={{ width: 13, height: 13, color: ACCENT_CYAN }} />}
              text={portfolioDisplay}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{
        width: 22, height: 22,
        borderRadius: 6,
        background: "rgba(0,153,187,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 14,
        color: TEXT_MUTED,
        fontWeight: 500,
        lineHeight: 1,
      }}>
        {text}
      </span>
    </div>
  );
}

export default BusinessCard;
