"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavDirection } from "./components/nav-direction-context";

export default function Template({ children }: { children: React.ReactNode }) {
  const { direction } = useNavDirection();

  // template.tsx re-mounts on every navigation — reset scroll each time.
  // The page starts at opacity 0, so the user never sees the bottom position.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      }}
    >
      {children}
    </motion.div>
  );
}
