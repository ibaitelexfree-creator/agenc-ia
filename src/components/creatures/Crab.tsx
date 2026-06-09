// src/components/creatures/Crab.tsx
'use client'

import { motion } from 'framer-motion'

type CrabProps = {
  style?: React.CSSProperties
  enterDelay?: number
  color?: string
}

export function Crab({ style, enterDelay = 0, color = '#E8593C' }: CrabProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: enterDelay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {/* Cangrejo que se mueve lateralmente */}
      <motion.div
        animate={{ x: [0, 8, 0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="65"
          height="45"
          viewBox="0 0 65 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Cuerpo */}
          <ellipse cx="32" cy="28" rx="18" ry="12" fill={color} opacity="0.85" />
          {/* Caparazón superior */}
          <path d="M16 26 Q32 12 48 26" fill={color} opacity="0.7" />
          {/* Pinzas */}
          <path d="M14 24 Q6 18 4 12 Q8 8 12 14 Q16 10 12 18" fill={color} opacity="0.8" />
          <path d="M50 24 Q58 18 60 12 Q56 8 52 14 Q48 10 52 18" fill={color} opacity="0.8" />
          {/* Ojos */}
          <circle cx="26" cy="21" r="3" fill="white" />
          <circle cx="38" cy="21" r="3" fill="white" />
          <circle cx="26" cy="21" r="1.5" fill="#0D2137" />
          <circle cx="38" cy="21" r="1.5" fill="#0D2137" />
          {/* Patas (3 por lado) */}
          {[18, 24, 30].map((x, i) => (
            <motion.line
              key={`left-${i}`}
              x1={x}
              y1="30"
              x2={x - 8}
              y2="42"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ y1: [30, 28, 30], y2: [42, 40, 42] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.15, repeatType: 'reverse' }}
            />
          ))}
          {[36, 42, 48].map((x, i) => (
            <motion.line
              key={`right-${i}`}
              x1={x}
              y1="30"
              x2={x + 8}
              y2="42"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ y1: [30, 28, 30], y2: [42, 40, 42] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.15 + 0.2, repeatType: 'reverse' }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}
