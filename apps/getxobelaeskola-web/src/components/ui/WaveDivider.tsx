'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WaveDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <div ref={ref} style={{ width: "100%", height: 80, overflow: "hidden", display: "flex", alignItems: "center" }}>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" width="100%" height="80">
        <motion.path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40"
          fill="none"
          stroke="var(--gbe-navy-900)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
