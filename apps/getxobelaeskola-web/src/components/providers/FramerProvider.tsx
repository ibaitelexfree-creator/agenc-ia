'use client';

import React, { useEffect } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

export function FramerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Small timeout ensures browser restoration has occurred and we override it.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
