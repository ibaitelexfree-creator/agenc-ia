'use client';

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMagicMotion } from "@/lib/useMagicMotion";

interface MagneticCTAProps {
  href: string;
  children: React.ReactNode;
}

export default function MagneticCTA({ href, children }: MagneticCTAProps) {
  const { magicEnabled } = useMagicMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!magicEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className="magnetic-cta"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
      <motion.span className="arrow" whileHover={{ x: 4 }}>→</motion.span>
    </motion.a>
  );
}
