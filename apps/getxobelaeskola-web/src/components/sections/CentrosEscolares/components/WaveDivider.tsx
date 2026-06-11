// WaveDivider.tsx
import { motion } from 'framer-motion';
import styles from '../CentrosEscolares.module.css';

interface WaveDividerProps {
  className?: string;
  fillColor?: string;
  inverse?: boolean;
}

export default function WaveDivider({ className = "", fillColor = "var(--color-offwhite)", inverse = false }: WaveDividerProps) {
  return (
    <div className={`${styles['wave-container']} ${className} ${inverse ? styles['wave-container--inverse'] : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" width="100%" height="100%" preserveAspectRatio="none" className={styles['wave-svg']}>
        <motion.path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={fillColor}
          animate={{
            d: [
              "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z",
              "M0,30 C240,60 480,10 720,50 C960,70 1200,10 1440,30 L1440,80 L0,80 Z",
              "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
