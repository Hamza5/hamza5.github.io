"use client";

import dynamic from "next/dynamic";
import {
  faEnvelope,
  faPhone,
  faIdCard,
  faEarthAfrica,
  faLocationDot,
  faCakeCandles,
  faPassport,
  faMosque,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { profile } from "../../data/profile";
import SectionHeading from "../section-heading";
import ContactItem from "./contact-item";
import LanguageItem from "./language-item";
import ContactQrModal from "../contact-qr-modal";

// Dynamically imported with no SSR — Leaflet depends on `window`
const LocationMap = dynamic(() => import("./location-map"), { ssr: false });

function calculateAge(dateOfBirth: string): string {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Days remaining from the previous month
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [`${years} year${years !== 1 ? "s" : ""}` ];
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0) parts.push(`and ${days} day${days !== 1 ? "s" : ""}`);
  return parts.join(", ");
}

export default function BasicInfoSection() {
  const { contact, personal, languages, location } = profile;
  // Compute age client-side to avoid hydration mismatch in static export
  const [age, setAge] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  useEffect(() => {
    setAge(calculateAge(personal.dateOfBirth));
  }, [personal.dateOfBirth]);

  return (
    <>
    <section className="basic-info-section" id="about">
      <div className="basic-info-container">

        {/* ── Row 1: Contact + Personal ─────────────────────────────────── */}
        <div className="basic-info-grid">
          {/* Contact */}
          <div className="basic-info-card">
            <SectionHeading icon={faEnvelope} title="Contact" />
            <div className="basic-info-card-body">
              {contact.emails.map((email) => (
                <ContactItem
                  key={email}
                  icon={faEnvelope}
                  label={email}
                  href={`mailto:${email}`}
                />
              ))}
              {contact.phones.map((phone) => (
                <ContactItem
                  key={phone.number}
                  icon={faPhone}
                  label={`${phone.flag} ${phone.label}`}
                  href={`tel:${phone.number}`}
                />
              ))}
            </div>
            {/* Share Contact via QR */}
            <button
              onClick={() => setQrOpen(true)}
              className="btn-secondary btn-qr"
              style={{ alignSelf: "flex-start" }}
              aria-label="Share contact as QR code"
            >
              <FontAwesomeIcon
                icon={faQrcode}
                style={{ width: "0.875rem", height: "0.875rem" }}
              />
              <span>Share Contact</span>
            </button>
          </div>

          {/* Personal */}
          <div className="basic-info-card">
            <SectionHeading icon={faIdCard} title="Personal" />
            <div className="basic-info-card-body">
              <ContactItem icon={faCakeCandles} label={age} />
              <ContactItem icon={faPassport} label={personal.nationality} />
              <ContactItem icon={faMosque} label={personal.religion} />
            </div>
          </div>
        </div>

        {/* ── Row 2: Languages ──────────────────────────────────────────── */}
        <div className="basic-info-full-row">
          <SectionHeading icon={faEarthAfrica} title="Spoken Languages" />
          <div className="languages-grid">
            {languages.map((lang) => (
              <LanguageItem key={lang.name} language={lang} />
            ))}
          </div>
        </div>

        {/* ── Row 3: Location ───────────────────────────────────────────── */}
        <div className="basic-info-full-row">
          <SectionHeading icon={faLocationDot} title="Location" />
          <LocationMap location={location} />
        </div>

      </div>
    </section>

      <ContactQrModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
