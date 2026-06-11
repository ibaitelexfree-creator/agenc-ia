import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export const useStickyScroll = (itemCount: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref,
    offset: ["start start", "end end"],
    layoutEffect: false
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(itemCount - 1) * 100}%`]);
  return { ref, x, scrollYProgress };
};
