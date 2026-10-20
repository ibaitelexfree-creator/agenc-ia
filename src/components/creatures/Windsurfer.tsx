// src/components/creatures/Windsurfer.tsx
'use client'

import { motion } from 'framer-motion'

type WindsurferProps = {
  style?: React.CSSProperties
  enterDelay?: number
}

export function Windsurfer({ style, enterDelay = 0 }: WindsurferProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: 100, y: 10 }}
      animate={{ opacity: 0.85, x: 0, y: 0 }}
      transition={{ delay: enterDelay, duration: 1.1, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {/* Movimiento ondulante en el agua */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="44"
          height="56"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Vela */}
          <path d="M40 10 L10 70 L40 65 Z" fill="var(--ocean-bright)" opacity="0.85" />
          <path d="M40 10 L70 75 L40 65 Z" fill="var(--ocean-mid)" opacity="0.7" />
          {/* Mástil */}
          <line x1="40" y1="10" x2="40" y2="75" stroke="var(--ocean-deep)" strokeWidth="2" />
          {/* Tabla */}
          <ellipse cx="40" cy="82" rx="22" ry="6" fill="var(--ocean-deep)" opacity="0.8" />
          {/* Surfista simplificado */}
          <circle cx="38" cy="72" r="5" fill="var(--gold)" />
          <path d="M33 77 L38 72 L43 77" stroke="var(--gold)" strokeWidth="2" fill="none" />
          {/* Olas bajo la tabla */}
          <path d="M18 88 Q28 84 40 88 Q52 92 62 88" stroke="var(--ocean-light)" strokeWidth="2" fill="none" opacity="0.6" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
