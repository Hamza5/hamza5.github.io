"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  "Web developer",
  "Desktop developer",
  "Web Scraper",
  "Automation specialist",
  "AI Engineer",
  "Graphics Designer",
];

// Duplicate the first item at the end for a seamless loop:
// the track animates to the duplicate, then snaps back to index 0 invisibly.
const TRACK = [...ITEMS, ITEMS[0]];

const ITEM_H = "3.5rem"; // keep in sync with the container height below
const HOLD_MS = 2200;
const TRANSITION_MS = 500;

export default function SlidingTexts() {
  const [idx, setIdx] = useState(0);
  const [animated, setAnimated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const advance = () => {
      // Animate forward to next index
      setAnimated(true);
      setIdx((i) => i + 1);
      timerRef.current = setTimeout(advance, HOLD_MS + TRANSITION_MS);
    };

    // Initial pause before the carousel starts moving
    timerRef.current = setTimeout(advance, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // When we land on the duplicate (ITEMS.length), silently reset to index 0
  useEffect(() => {
    if (idx !== ITEMS.length) return;
    const id = setTimeout(() => {
      // Disable transition, jump back to real index 0 (identical visual)
      setAnimated(false);
      setIdx(0);
    }, TRANSITION_MS + 40);
    return () => clearTimeout(id);
  }, [idx]);

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
