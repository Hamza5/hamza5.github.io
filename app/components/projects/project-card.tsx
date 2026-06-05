"use client";

import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { ProjectEntry, ProjectCategory } from "@/app/data/profile";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  personal:  "Personal",
  freelance: "Freelance",
  work:      "Work",
  research:  "Research",
  writing:   "Writing",
};

function formatDate(year: number, month?: number): string {
  if (month) return `${MONTH_NAMES[month - 1]} ${year}`;
  return String(year);
}

interface Props {
  entry: ProjectEntry;
  index: number;
}

export default function ProjectCard({ entry, index }: Props) {
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dateLabel = formatDate(entry.year, entry.month);
  const badgeClass = `timeline-badge project-badge-${entry.category}`;

  return (
    <div
      className="timeline-entry"
      ref={rowRef}
      style={{ transitionDelay: `${Math.min(index, 5) * 60}ms` }}
    >
      {/* Spine dot */}
      <div className="timeline-node-col">
        <div className="timeline-node" />
      </div>

      {/* Card */}
      <div className="timeline-card-col">
        <div className="timeline-card project-card">
          <div className="project-card-top">
            <div className="project-card-title-row">
              <span className="project-card-title">{entry.title}</span>
              <span className={badgeClass}>{CATEGORY_LABELS[entry.category]}</span>
              <span className="timeline-year-mobile project-card-date">{dateLabel}</span>
            </div>
            <p className="project-card-desc">{entry.description}</p>
          </div>

          {entry.tags.length > 0 && (
            <div className="project-tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          )}

          {(entry.githubUrl || entry.url) && (
            <div className="project-links">
              {entry.githubUrl && (
                <a
                  href={entry.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-btn"
                  aria-label="GitHub repository"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span>GitHub</span>
                </a>
              )}
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-btn project-link-btn-live"
                  aria-label="Live site"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  <span>Live</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
