"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Language } from "../../data/profile";

interface LanguageItemProps {
  language: Language;
}

export default function LanguageItem({ language }: LanguageItemProps) {
  const [filled, setFilled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = `${Math.round(language.proficiency * 100)}%`;

  return (
    <div ref={ref} className="language-item">
      <div className="language-item-header">
        <Image
          src={language.flagSrc}
          alt={`${language.name} flag`}
          width={32}
          height={20}
          className="language-flag"
          unoptimized
        />
        <div className="language-item-meta">
          <span className="language-name">{language.name}</span>
          <span className="language-desc">{language.description}</span>
        </div>
      </div>
      <div className="language-bar-track">
        <div
          className="language-bar-fill"
          style={{ width: filled ? pct : "0%" }}
        />
      </div>
    </div>
  );
}
