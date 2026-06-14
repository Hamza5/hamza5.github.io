"use client";

import { faTimeline } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/app/components/section-heading";
import TimelineCard from "@/app/components/timeline/timeline-card";
import { useLocalizedProfile } from "@/app/hooks/use-localized-profile";

export default function TimelineSection() {
  const { t } = useTranslation();
  const { timeline } = useLocalizedProfile();

  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <SectionHeading icon={faTimeline} title={t("career.timeline")} id="timeline" />

        <div className="timeline-spine-wrapper" style={{ marginTop: "2.5rem" }}>
          {timeline.map((entry) => (
            <TimelineCard key={`${entry.institution}-${entry.id}`} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
