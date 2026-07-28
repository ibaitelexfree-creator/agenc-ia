// src/components/creatures/Seagull.tsx
'use client'

import { motion } from 'framer-motion'

type SeagullProps = {
  style?: React.CSSProperties
  enterDelay?: number
  direction?: 'left' | 'right'
}

export function Seagull({ style, enterDelay = 0, direction = 'left' }: SeagullProps) {
  const enterX = direction === 'left' ? 160 : -160

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: enterX, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: enterDelay, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {/* La gaviota flota verticalmente en bucle */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Ala izquierda */}
          <motion.g
            animate={{ rotateZ: [15, -25], scaleY: [1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            style={{ transformOrigin: '40px 20px' }}
          >
            <path
              d="M40 20 C30 15 15 10 0 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>
          {/* Ala derecha */}
          <motion.g
            animate={{ rotateZ: [-15, 25], scaleY: [1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            style={{ transformOrigin: '40px 20px' }}
          >
            <path
              d="M40 20 C50 15 65 10 80 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>
          {/* Cuerpo */}
          <ellipse cx="40" cy="22" rx="5" ry="3" fill="white" opacity="0.9" />
          {/* Pico */}
          <path d="M45 22 L50 23 L45 24 Z" fill="var(--gold)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
