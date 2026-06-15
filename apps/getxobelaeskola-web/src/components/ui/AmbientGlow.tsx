'use client';

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMagicMotion } from "@/lib/useMagicMotion";

export default function AmbientGlow() {
  const { magicEnabled } = useMagicMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!magicEnabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [magicEnabled, x, y]);

  if (!magicEnabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        left: springX,
        top: springY,
        width: 400,
        height: 400,
        marginLeft: -200,
        marginTop: -200,
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--gbe-gold-soft) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(40px)",
      }}
    />
  );
}
