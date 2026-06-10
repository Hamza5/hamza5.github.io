"use client";

import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { profile } from "@/app/data/profile";
import SectionHeading from "@/app/components/section-heading";
import PublicationCard from "./publication-card";

export default function PublicationsSection() {
  const { t } = useTranslation();
  const { publications } = profile;

  return (
    <section className="publications-section">
      <div className="publications-container">

        {/* ── Research Publications ─────────────────────────────────────── */}
        <div className="publications-block">
          <SectionHeading icon={faBookOpen} title={t("publications.researchPublications")} />
          <div className="timeline-spine-wrapper" style={{ marginTop: "2rem" }}>
            {publications.map((pub, i) => (
              <PublicationCard key={pub.doi} entry={pub} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
