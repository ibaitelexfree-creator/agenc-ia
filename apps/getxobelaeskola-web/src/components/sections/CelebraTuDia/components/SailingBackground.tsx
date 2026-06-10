// C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\src\components\sections\CelebraTuDia\components\SailingBackground.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import styles from '../CelebraTuDia.module.css';

export default function SailingBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-24 overflow-hidden bg-sky-100/50 border-y border-sky-200 pointer-events-none"
    >
      {/* Wave lines backgrounds */}
      <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path d="M0,40 C150,20 350,60 500,40 C650,20 850,60 1000,40 L1000,100 L0,100 Z" fill="#1B8FCF" />
      </svg>

      {/* Sailboat traversing */}
      {isInView && (
        <motion.div
          className="absolute bottom-2 left-0 w-28 h-28"
          initial={prefersReducedMotion ? { x: '50%', opacity: 1 } : { x: '-150px', opacity: 0 }}
          animate={prefersReducedMotion ? {} : {
            x: 'calc(100vw + 150px)',
            opacity: [0, 1, 1, 0]
          }}
          transition={prefersReducedMotion ? {} : {
            x: { duration: 16, ease: 'linear' },
            opacity: { times: [0, 0.1, 0.9, 1], duration: 16 }
          }}
        >
          {/* Sailboat J80 representation */}
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Hull */}
            <path d="M 15,90 L 105,90 L 115,75 L 5,75 Z" fill="#EF6351" stroke="#0D2B45" strokeWidth="2.5" />
            <path d="M 60,75 L 60,10" stroke="#0D2B45" strokeWidth="3" /> {/* Mast */}
            <path d="M 60,20 L 100,75 L 60,75 Z" fill="#FAFAFA" stroke="#0D2B45" strokeWidth="2" /> {/* Main Sail */}
            <path d="M 58,15 L 20,75 L 58,75 Z" fill="#FFD166" stroke="#0D2B45" strokeWidth="2" /> {/* Jib Sail */}
            {/* Waves trailing */}
            <path d="M -20,95 Q -10,88 0,95 Q 10,102 20,95" fill="none" stroke="#1B8FCF" strokeWidth="2" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
