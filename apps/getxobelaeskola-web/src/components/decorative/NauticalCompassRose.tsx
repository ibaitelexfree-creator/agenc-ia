// src/components/decorative/NauticalCompassRose.tsx
'use client'

import { motion } from 'framer-motion'

export function NauticalCompassRose() {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '340px',
        height: '340px',
        opacity: 0.04,
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* N */}
        <path d="M100 5 L107 30 L100 25 L93 30 Z" fill="var(--ocean-deep)" />
        {/* S */}
        <path d="M100 195 L107 170 L100 175 L93 170 Z" fill="var(--ocean-deep)" />
        {/* E */}
        <path d="M195 100 L170 107 L175 100 L170 93 Z" fill="var(--ocean-deep)" />
        {/* W */}
        <path d="M5 100 L30 107 L25 100 L30 93 Z" fill="var(--ocean-deep)" />
        {/* Líneas cardinales */}
        <line x1="100" y1="10" x2="100" y2="190" stroke="var(--ocean-deep)" strokeWidth="1.5" opacity="0.5" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="var(--ocean-deep)" strokeWidth="1.5" opacity="0.5" />
        {/* Líneas diagonales */}
        <line x1="29" y1="29" x2="171" y2="171" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        <line x1="171" y1="29" x2="29" y2="171" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        {/* Círculos concéntricos */}
        <circle cx="100" cy="100" r="60" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="100" r="30" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="100" r="8" fill="var(--ocean-deep)" opacity="0.4" />
      </svg>
    </motion.div>
  )
}
