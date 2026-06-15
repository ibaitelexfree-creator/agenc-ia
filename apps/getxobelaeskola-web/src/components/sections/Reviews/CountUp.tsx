'use client';

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import styles from "./Reviews.module.css";

interface CountUpProps {
  to?: number;
  suffix?: string;
}

export default function CountUp({ to = 100, suffix = "%" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.8 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v) + suffix);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 1.4, ease: "easeOut" });
      return () => controls.stop();
    } else {
      count.set(0);
    }
  }, [isInView, count, to]);

  return (
    <motion.span ref={ref} className={styles.highlight}>
      {rounded}
    </motion.span>
  );
}
