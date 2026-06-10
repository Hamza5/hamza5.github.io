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
import { useTranslation } from "react-i18next";
import { profile } from "../../data/profile";
import { useLocalizedProfile } from "@/app/hooks/use-localized-profile";
import SectionHeading from "../section-heading";
import ContactItem from "./contact-item";
import LanguageItem from "./language-item";
import ContactQrModal from "../contact-qr-modal";

// Dynamically imported with no SSR — Leaflet depends on `window`
const LocationMap = dynamic(() => import("./location-map"), { ssr: false });

function calculateAge(dateOfBirth: string): { years: number; months: number; days: number } {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export default function BasicInfoSection() {
  const { t } = useTranslation();
  const { contact, personal, languages, location } = useLocalizedProfile();
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    setAge(calculateAge(profile.personal.dateOfBirth));
  }, []);

  const ageString = (() => {
    if (!age) return "";
    const parts: string[] = [];
    if (age.years > 0) parts.push(t("about.ageYears", { count: age.years }));
    if (age.months > 0) parts.push(t("about.ageMonths", { count: age.months }));
    if (age.days > 0) parts.push(t("about.ageDays", { count: age.days }));
    return parts.join(t("about.ageComma"));
  })();

  return (
    <>
    <section className="basic-info-section" id="about">
      <div className="basic-info-container">

        {/* ── Row 1: Contact + Personal ─────────────────────────────── */}
        <div className="basic-info-grid">
          {/* Contact */}
          <div className="basic-info-card">
            <SectionHeading icon={faEnvelope} title={t("about.contact")} />
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
            <button
              onClick={() => setQrOpen(true)}
              className="btn-secondary btn-qr"
              style={{ alignSelf: "flex-start" }}
              aria-label={t("about.shareContact")}
            >
              <FontAwesomeIcon
                icon={faQrcode}
                style={{ width: "0.875rem", height: "0.875rem" }}
              />
              <span>{t("about.shareContact")}</span>
            </button>
          </div>

          {/* Personal */}
          <div className="basic-info-card">
            <SectionHeading icon={faIdCard} title={t("about.personal")} />
            <div className="basic-info-card-body">
              <ContactItem icon={faCakeCandles} label={ageString} />
              <ContactItem icon={faPassport} label={personal.nationality} />
              <ContactItem icon={faMosque} label={personal.religion} />
            </div>
          </div>
        </div>

        {/* ── Row 2: Languages ───────────────────────────────────────── */}
        <div className="basic-info-full-row">
          <SectionHeading icon={faEarthAfrica} title={t("about.spokenLanguages")} />
          <div className="languages-grid">
            {languages.map((lang) => (
              <LanguageItem key={lang.id} language={lang} />
            ))}
          </div>
        </div>

        {/* ── Row 3: Location ────────────────────────────────────────── */}
        <div className="basic-info-full-row">
          <SectionHeading icon={faLocationDot} title={t("about.location")} />
          <LocationMap location={{ ...location, district: location.district, city: location.city, country: location.country }} />
        </div>

      </div>
    </section>

      <ContactQrModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}

