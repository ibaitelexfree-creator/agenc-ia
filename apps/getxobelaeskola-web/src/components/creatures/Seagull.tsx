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
          {/* Unificación completa 100% Geometría y Animación: Alas + Cuerpo + Pico */}
          <g style={{ transform: 'rotate(-3deg)', transformOrigin: '40px 20px' }}>
            <motion.g
              animate={{ y: [0, -3.5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            >
              {/* Ala izquierda (conectada geométricamente al cuerpo) */}
              <motion.path
                d="M 37 20 C 25 12 12 8 0 16"
                stroke="white"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
                animate={{ rotateZ: [-12, 10], scaleY: [0.75, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                style={{ transformOrigin: '37px 20px' }}
              />

              {/* Ala derecha (conectada geométricamente al cuerpo) */}
              <motion.path
                d="M 43 20 C 55 12 68 8 80 16"
                stroke="white"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
                animate={{ rotateZ: [12, -10], scaleY: [0.75, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                style={{ transformOrigin: '43px 20px' }}
              />

              {/* Cuerpo y Pico (se hunden en sincronía cuando las alas suben) */}
              <motion.g
                animate={{ y: [1.8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              >
                <ellipse cx="40" cy="20" rx="7.5" ry="4.5" fill="white" opacity="0.98" />
                <path d="M 47.5 20 L 52.5 21.2 L 47.5 22.4 Z" fill="var(--gold)" />
              </motion.g>
            </motion.g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  )
}
