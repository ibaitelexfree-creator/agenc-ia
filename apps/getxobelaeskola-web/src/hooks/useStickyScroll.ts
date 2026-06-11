import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export const useStickyScroll = (itemCount: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({ 
    target: mounted ? ref : undefined,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(itemCount - 1) * 100}%`]);
  return { ref, x, scrollYProgress };
};
