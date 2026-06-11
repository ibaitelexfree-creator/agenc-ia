'use client';

import { motion } from 'framer-motion';
import styles from '../Voluntariado.module.css';

export function WaveBottom() {
  return (
    <div className={styles['wave-container']}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <motion.path
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,120 L0,120 Z"
          fill="var(--color-offwhite, #F8F9FA)"
          animate={{
            d: [
              "M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,120 L0,120 Z",
              "M0,60 C360,0 720,120 1080,60 C1260,30 1380,75 1440,60 L1440,120 L0,120 Z",
              "M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,120 L0,120 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
}
