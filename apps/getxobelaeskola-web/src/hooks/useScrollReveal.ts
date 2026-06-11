// hooks/useScrollReveal.ts
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: threshold });
  return { ref, isInView };
};
