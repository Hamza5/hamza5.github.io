"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { exactMatchRoute, routes, type RouteEntry } from "@/app/lib/site";
import { useNavDirection } from "./nav-direction-context";

/** How many pixels past the boundary (top or bottom) before we navigate. */
const THRESHOLD = 80;
/** Minimum ms between two navigations to prevent double-fires. */
const COOLDOWN = 900;

/**
 * Wheel/touch navigation between pages.
 *
 * The order is the whole site's reading order, not one menu at a time, so
 * scrolling off the end of the personal pages carries on into the services
 * pages instead of stopping at the boundary between them.
 */
export default function ScrollNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang = "en" } = useParams<{ lang: string }>();
  const lastNav = useRef(0);
  const accumulated = useRef(0);
  const { setDirection } = useNavDirection();

  useEffect(() => {
    const order = [...routes].sort((a, b) => a.scrollRank - b.scrollRank);
    const currentIdx = order.indexOf(exactMatchRoute(pathname)!);

    const navigate = (direction: 1 | -1) => {
      const now = Date.now();
      if (now - lastNav.current < COOLDOWN) return;
      const nextIdx = currentIdx + direction;
      if (nextIdx < 0 || nextIdx >= order.length) return;
      const target: RouteEntry = order[nextIdx];
      lastNav.current = now;
      accumulated.current = 0;
      setDirection(direction);
      router.push(target.path === "" ? `/${lang}` : `/${lang}${target.path}`);
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
        // Not at boundary, so any partial gesture is stale.
        accumulated.current = 0;
      }
    };

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
  }, [pathname, router, lang, setDirection]);

  return null;
}
