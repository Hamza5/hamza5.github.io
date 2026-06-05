"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface SkillItemProps {
  name: string;
  description: string;
  proficiency: number;
  /** Resolved from simple-icons server-side; null when using fallback image. */
  iconSvg: string | null;
  iconHex: string | null;
  fallbackImageSrc: string | null;
}

export default function SkillItem({
  name,
  description,
  proficiency,
  iconSvg,
  iconHex,
  fallbackImageSrc,
}: SkillItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const barGradient = iconHex
    ? `linear-gradient(90deg, var(--accent-cyan), #${iconHex})`
    : "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))";

  return (
    <div ref={ref} className="skill-item">
      <div className="skill-item-header">
        {/* Icon */}
        <div className="skill-icon-bg">
          {iconSvg && iconHex ? (
            <svg
              role="img"
              aria-label={name}
              viewBox="0 0 24 24"
              width={28}
              height={28}
              fill={`#${iconHex}`}
              dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
          ) : fallbackImageSrc ? (
            <Image
              src={fallbackImageSrc}
              alt={name}
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
            />
          ) : null}
        </div>

        {/* Text */}
        <div className="skill-item-meta">
          <span className="skill-item-name">{name}</span>
          <span className="skill-item-desc">{description}</span>
        </div>
      </div>

      {/* Proficiency bar */}
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: visible ? `${proficiency * 100}%` : "0%",
            background: barGradient,
          }}
        />
      </div>
    </div>
  );
}
