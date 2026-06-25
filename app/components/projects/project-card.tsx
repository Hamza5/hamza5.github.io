"use client";

import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import type { ProjectCategory } from "@/app/data/profile";
import type { LocalizedProjectEntry } from "@/app/hooks/use-localized-profile";
import ProjectScreenshotGallery from "./project-screenshot-gallery";

interface Props {
  entry: LocalizedProjectEntry;
  index: number;
  screenshots?: string[];
}

export default function ProjectCard({ entry, index, screenshots }: Props) {
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dateLabel = entry.month
    ? `${t(`projects.months.${entry.month}`)} ${entry.year}`
    : String(entry.year);

  const badgeClass = `timeline-badge project-badge-${entry.category}`;

  return (
    <div
      className="timeline-entry"
      ref={rowRef}
      style={{ transitionDelay: `${Math.min(index, 5) * 60}ms` }}
    >
      <div className="timeline-node-col">
        <div className="timeline-node" />
      </div>

      <div className="timeline-card-col">
        <div className="timeline-card project-card">
          <div className="project-card-top">
            <div className="project-card-title-row">
              <span className="project-card-title">{entry.title}</span>
              <span className={badgeClass}>{t(`projects.categories.${entry.category as ProjectCategory}`)}</span>
              <span className="timeline-year-mobile project-card-date">{dateLabel}</span>
            </div>
            <p className="project-card-desc">{entry.description}</p>
          </div>

          {screenshots && screenshots.length > 0 && (
            <ProjectScreenshotGallery screenshots={screenshots} projectTitle={entry.title} />
          )}

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
                  <span>{t("projects.github")}</span>
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
                  <span>{t("projects.live")}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

