"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { TimelineEntry, TimelineEntryType } from "@/app/data/profile";

const BADGE_LABELS: Record<TimelineEntryType, string> = {
  bachelor:    "Bachelor",
  master:      "Master",
  phd:         "PhD",
  language:    "Language",
  certificate: "Certificate",
  course:      "Course",
  internship:  "Internship",
  job:         "Job",
  freelance:   "Freelance"
};

function formatYears(startYear: number, endYear: number): string {
  if (startYear === endYear) return String(startYear);
  if (endYear > new Date().getFullYear()) return `${startYear} – Present`;
  return `${startYear} – ${endYear}`;
}

interface Props {
  entry: TimelineEntry;
  index: number;
}

export default function TimelineCard({ entry, index }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

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

  const yearLabel = formatYears(entry.startYear, entry.endYear);

  return (
    <div className="timeline-entry" ref={rowRef}>
      {/* Card column — CSS grid positioning handles left/right via nth-child */}
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
              {/* Year shown here on mobile only */}
              <span className="timeline-year-mobile">{yearLabel}</span>
              <span className="timeline-institution">{entry.institution}</span>
              <span className="timeline-title">{entry.title}</span>
            </div>
          </div>
          <span className={badgeClass}>{BADGE_LABELS[entry.type]}</span>
        </div>
      </div>

      {/* Spine dot */}
      <div className="timeline-node-col">
        <div className="timeline-node" />
      </div>

      {/* Year label column (desktop only, hidden on mobile via CSS) */}
      <div className="timeline-year-col">
        <span className="timeline-year">{yearLabel}</span>
      </div>
    </div>
  );
}
