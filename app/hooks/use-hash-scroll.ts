"use client";

import { useEffect } from "react";

/**
 * Scrolls to the element named by the URL fragment after the page has rendered.
 *
 * Three things break the browser's own fragment handling here: the target is a
 * card React draws after parse time, `scroll-behavior: smooth` makes a plain
 * scrollIntoView animate (and `behavior: "auto"` resolves back to smooth), and
 * lazy images change the page height mid-animation, which cancels it. So the
 * jump is forced to be instant and retried once the layout has settled, unless
 * the visitor scrolls in the meantime.
 */
export function useHashScroll() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const findTarget = () => {
      try {
        return document.getElementById(decodeURIComponent(hash));
      } catch {
        return document.getElementById(hash);
      }
    };

    let placed = false;

    const jump = () => {
      const target = findTarget();
      if (!target) return;
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      // Temporarily opt out of the smooth rule so the jump is not animated and
      // cannot be cancelled by a layout shift.
      root.style.scrollBehavior = "auto";
      const top = window.scrollY + target.getBoundingClientRect().top;
      window.scrollTo(0, Math.max(0, top));
      root.style.scrollBehavior = previous;
      placed = true;
    };

    jump();
    // Cards below the fold hold lazy images, so the page grows after mount.
    const timer = window.setTimeout(() => {
      if (placed) return;
      jump();
    }, 350);

    // One retry after the window finishes loading, in case images still moved.
    const onLoad = () => jump();
    window.addEventListener("load", onLoad);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, []);
}
