'use client';

import { motion } from "framer-motion";
import styles from "../TrabajaConNosotras.module.css";

interface SineWaveUnderlineProps {
  isVisible: boolean;
  color?: string;
}

export function SineWaveUnderline({ isVisible, color = "#0A3D5C" }: SineWaveUnderlineProps) {
  return (
    <svg
      className={styles['sine-underline']}
      viewBox="0 0 300 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Línea base — fija, muy tenue */}
      <path
        d="M0 8 L300 8"
        stroke={color}
        strokeWidth="1"
        opacity="0.12"
      />
      {/* Onda sinusoidal — se dibuja al aparecer */}
      <motion.path
        d="M0 8 Q37.5 2 75 8 Q112.5 14 150 8 Q187.5 2 225 8 Q262.5 14 300 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isVisible
          ? { pathLength: 1, opacity: 1 }
          : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {/* Segunda pasada — shimmer continuo */}
      <motion.path
        d="M0 8 Q37.5 2 75 8 Q112.5 14 150 8 Q187.5 2 225 8 Q262.5 14 300 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.3}
        animate={isVisible
          ? { strokeDashoffset: [0, -300], opacity: [0.3, 0.5, 0.3] }
          : {}
        }
        strokeDasharray="300"
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.8 }}
      />
    </svg>
  );
}
