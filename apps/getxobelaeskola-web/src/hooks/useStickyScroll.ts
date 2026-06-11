import { useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export const useStickyScroll = (itemCount: number) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const targetRef = { current: element };

  const { scrollYProgress } = useScroll({ 
    target: element ? targetRef : undefined,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(itemCount - 1) * 100}%`]);
  return { setElement, x, scrollYProgress };
};
