// src/components/creatures/Starfish.tsx
'use client'

import { motion } from 'framer-motion'

type StarfishProps = {
  style?: React.CSSProperties
  enterDelay?: number
  color?: string
}

export function Starfish({ style, enterDelay = 0, color = '#F5A623' }: StarfishProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: enterDelay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {/* Balanceo lento */}
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Estrella de 5 puntas */}
          <path
            d="M27.5 3 L31.5 18.5 L47.5 18.5 L34.5 28 L39 44 L27.5 35 L16 44 L20.5 28 L7.5 18.5 L23.5 18.5 Z"
            fill={color}
            opacity="0.85"
          />
          {/* Textura de puntos */}
          <circle cx="27.5" cy="27.5" r="4" fill="white" opacity="0.4" />
          <circle cx="27.5" cy="12" r="2" fill="white" opacity="0.3" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
