'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface Burst {
  id: number;
  x: number;
  y: number;
}

interface SparkleBurstProps {
  trigger: React.ReactNode;
}

export default function SparkleBurst({ trigger }: SparkleBurstProps) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  function addBurst(e: React.MouseEvent<HTMLSpanElement>) {
    const id = Date.now();
    const { clientX: x, clientY: y } = e;
    setBursts((b) => [...b, { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 700);
  }

  return (
    <span onClickCapture={addBurst} style={{ display: "contents" }}>
      {trigger}
      <AnimatePresence>
        {bursts.map((b) => (
          <span key={b.id} style={{ position: "fixed", left: b.x, top: b.y, pointerEvents: "none", zIndex: 50 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: Math.cos(angle) * 30, y: Math.sin(angle) * 30, scale: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--gbe-gold)",
                  }}
                />
              );
            })}
          </span>
        ))}
      </AnimatePresence>
    </span>
  );
}
