"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Certification } from "@/app/data/profile";

interface Props {
  entry: Certification;
  index: number;
}

export default function CertificationCard({ entry, index }: Props) {
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

  const card = (
    <div
      className="cert-card timeline-entry"
      ref={ref}
      style={{ transitionDelay: `${Math.min(index, 4) * 80}ms` }}
    >
      <div className="timeline-node-col">
        <div className="timeline-node" />
      </div>
      <div className="timeline-card-col">
        <div className="timeline-card cert-card-inner">
          <div className="timeline-card-header">
            <div className="timeline-logo-link cert-logo-wrapper">
              <Image
                src={entry.logoSrc}
                alt={entry.issuer}
                width={40}
                height={40}
                style={{ objectFit: "contain", width: 40, height: 40 }}
              />
            </div>
            <div className="timeline-card-meta">
              <span className="timeline-year-mobile">{entry.year}</span>
              <span className="timeline-institution">{entry.issuer}</span>
              <span className="timeline-title">{entry.title}</span>
            </div>
          </div>
          <span className="timeline-badge timeline-badge-education">Certificate</span>
        </div>
      </div>
    </div>
  );

  if (entry.url) {
    return card;
  }
  return card;
}
