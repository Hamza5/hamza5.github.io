"use client";

import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faLink } from "@fortawesome/free-solid-svg-icons";
import type { Publication } from "@/app/data/profile";

interface Props {
  entry: Publication;
  index: number;
}

export default function PublicationCard({ entry, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([io]) => { if (io.isIntersecting) { el.classList.add("is-visible"); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="pub-card timeline-entry"
      ref={ref}
      style={{ transitionDelay: `${Math.min(index, 4) * 80}ms` }}
    >
      <div className="timeline-node-col">
        <div className="timeline-node" />
      </div>
      <div className="timeline-card-col">
        <div className="timeline-card pub-card-inner">

          {/* Title row with year badge */}
          <div className="pub-title-row">
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="pub-title"
            >
              {entry.title}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="pub-title-icon" />
            </a>
            <span className="timeline-year-mobile pub-year-badge">{entry.year}</span>
          </div>

          <p className="pub-authors">{entry.authors.join(", ")}</p>
          <p className="pub-venue">{entry.venue}</p>

          <div className="pub-footer">
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="project-link-btn"
            >
              <FontAwesomeIcon icon={faLink} style={{ width: "0.75rem", height: "0.75rem" }} />
              DOI: {entry.doi}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
