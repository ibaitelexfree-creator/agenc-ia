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
  const boundsRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  // Cache bounds on mount and resize
  import { useEffect } from "react";
  useEffect(() => {
    if (!ref.current) return;
    const updateBounds = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      boundsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
      };
    };
    
    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(ref.current);
    window.addEventListener('resize', updateBounds, { passive: true });
    updateBounds();
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!magicEnabled || !boundsRef.current.width) return;
    const bounds = boundsRef.current;
    x.set((e.pageX - bounds.left - bounds.width / 2) * 0.3);
    y.set((e.pageY - bounds.top - bounds.height / 2) * 0.3);
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
