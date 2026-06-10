"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const HOLD_MS = 2200;
const TRANSITION_MS = 500;
const ITEM_H = "3.5rem";

export default function SlidingTexts() {
  const { t } = useTranslation();

  const ITEMS = [
    t("hero.roles.webDev"),
    t("hero.roles.desktopDev"),
    t("hero.roles.webScraper"),
    t("hero.roles.automationSpecialist"),
    t("hero.roles.aiEngineer"),
    t("hero.roles.graphicsDesigner"),
  ];

  // Duplicate first item at end for seamless loop
  const TRACK = [...ITEMS, ITEMS[0]];

  const [idx, setIdx] = useState(0);
  const [animated, setAnimated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const advance = () => {
      setAnimated(true);
      setIdx((i) => i + 1);
      timerRef.current = setTimeout(advance, HOLD_MS + TRANSITION_MS);
    };
    timerRef.current = setTimeout(advance, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (idx !== ITEMS.length) return;
    const id = setTimeout(() => {
      setAnimated(false);
      setIdx(0);
    }, TRANSITION_MS + 40);
    return () => clearTimeout(id);
  }, [idx, ITEMS.length]);

  return (
    <div
      aria-live="polite"
      aria-label="Role carousel"
      style={{ height: ITEM_H, overflow: "hidden" }}
    >
      <div
        style={{
          transform: `translateY(calc(${-idx} * ${ITEM_H}))`,
          transition: animated
            ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : "none",
        }}
      >
        {TRACK.map((item, i) => (
          <div
            key={i}
            style={{
              height: ITEM_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-cyan)",
              fontFamily: "var(--font-orbitron), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
              textShadow: "0 0 16px var(--glow-cyan)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
