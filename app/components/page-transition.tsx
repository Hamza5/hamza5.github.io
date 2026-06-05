"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useNavDirection } from "./nav-direction-context";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { direction } = useNavDirection();

  // Forward (+1): enter from below, exit upward.
  // Backward (-1): enter from above, exit downward.
  const enterY = direction > 0 ? 40 : -40;
  const exitY  = direction > 0 ? -30 : 30;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: enterY }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        }}
        exit={{
          opacity: 0,
          y: exitY,
          transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] as [number, number, number, number] },
        }}
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
