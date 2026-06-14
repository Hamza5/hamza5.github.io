"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { TimelineEntryType } from "@/app/data/profile";
import type { LocalizedTimelineEntry } from "@/app/hooks/use-localized-profile";

function formatYears(startYear: number, endYear: number, present: string): string {
  if (startYear === endYear) return String(startYear);
  if (endYear > new Date().getFullYear()) return `${startYear} – ${present}`;
  return `${startYear} – ${endYear}`;
}

interface Props {
  entry: LocalizedTimelineEntry;
}

export default function TimelineCard({ entry }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([ioEntry]) => {
        if (ioEntry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const badgeClass =
    entry.category === "education"
      ? "timeline-badge timeline-badge-education"
      : "timeline-badge timeline-badge-work";

  const yearLabel = formatYears(entry.startYear, entry.endYear, t("career.present"));

  return (
    <div className="timeline-entry" ref={rowRef}>
      <div className="timeline-node-col">
        <div className="timeline-node" />
      </div>

      <div className="timeline-card-col">
        <div className="timeline-card">
          <div className="timeline-card-header">
            <a
              href={entry.institutionUrl}
              target="_blank"
              rel="noreferrer"
              className="timeline-logo-link"
              aria-label={entry.institution}
            >
              <Image
                src={entry.logoSrc}
                alt={entry.institution}
                width={40}
                height={40}
                style={{ objectFit: "contain", width: 40, height: 40 }}
              />
            </a>
            <div className="timeline-card-meta">
              <span className="timeline-year-mobile">{yearLabel}</span>
              <span className="timeline-institution">{entry.institution}</span>
              <span className="timeline-title">{entry.title}</span>
            </div>
          </div>
          <span className={badgeClass}>{t(`career.badges.${entry.type as TimelineEntryType}`)}</span>
        </div>
      </div>
    </div>
  );
}

