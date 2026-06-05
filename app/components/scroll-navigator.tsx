"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useNavDirection } from "./nav-direction-context";

const PAGE_ORDER = ["/", "/about", "/career", "/skills"] as const;

/** How many pixels past the boundary (top or bottom) before we navigate. */
const THRESHOLD = 80;
/** Minimum ms between two navigations to prevent double-fires. */
const COOLDOWN = 900;

export default function ScrollNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const lastNav = useRef(0);
  const accumulated = useRef(0);
  const { setDirection } = useNavDirection();

  useEffect(() => {
    const currentIdx = PAGE_ORDER.indexOf(pathname as (typeof PAGE_ORDER)[number]);

    const navigate = (direction: 1 | -1) => {
      const now = Date.now();
      if (now - lastNav.current < COOLDOWN) return;
      const nextIdx = currentIdx + direction;
      if (nextIdx < 0 || nextIdx >= PAGE_ORDER.length) return;
      lastNav.current = now;
      accumulated.current = 0;
      setDirection(direction);
      router.push(PAGE_ORDER[nextIdx]);
    };

    const onWheel = (e: WheelEvent) => {
      const atTop = window.scrollY <= 0;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (e.deltaY > 0 && atBottom) {
        accumulated.current += e.deltaY;
        if (accumulated.current >= THRESHOLD) navigate(1);
      } else if (e.deltaY < 0 && atTop) {
        accumulated.current += e.deltaY; // negative
        if (accumulated.current <= -THRESHOLD) navigate(-1);
      } else {
        // Not at boundary — reset accumulation
        accumulated.current = 0;
      }
    };

    // Touch support
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      const atTop = window.scrollY <= 0;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (delta > THRESHOLD && atBottom) navigate(1);
      else if (delta < -THRESHOLD && atTop) navigate(-1);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, router]);

  return null;
}
