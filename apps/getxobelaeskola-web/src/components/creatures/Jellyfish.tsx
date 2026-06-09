// src/components/creatures/Jellyfish.tsx
'use client'

import { motion } from 'framer-motion'

type JellyfishProps = {
  style?: React.CSSProperties
  enterDelay?: number
  size?: 'small' | 'medium' | 'large'
  color?: string
}

export function Jellyfish({ style, enterDelay = 0, size = 'medium', color = '#4AAFE8' }: JellyfishProps) {
  const sizes = { small: 0.7, medium: 1, large: 1.4 }

  return (
    <motion.div
      style={{ ...style, scale: sizes[size] }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: enterDelay, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {/* Pulso rítmico de la medusa */}
      <motion.div
        animate={{ scaleY: [1, 0.85, 1], scaleX: [1, 1.1, 1] }}
        whileHover={{ scaleY: 0.7, scaleX: 1.2, transition: { duration: 0.2 } }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center top' }}
      >
        <svg
          width="55"
          height="75"
          viewBox="0 0 55 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Campana superior */}
          <path
            d="M5 30 C5 10 50 10 50 30 Q50 42 27.5 42 Q5 42 5 30Z"
            fill={color}
            opacity="0.75"
          />
          {/* Gradiente interno */}
          <ellipse cx="20" cy="22" rx="8" ry="5" fill="white" opacity="0.25" />
          {/* Tentáculos — 5 líneas onduladas */}
          {[12, 18, 27, 36, 43].map((x, i) => (
            <motion.path
              key={i}
              d={`M${x} 42 Q${x - 3} 52 ${x + 2} 60 Q${x - 2} 68 ${x + 1} 75`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              animate={{
                d: [
                  `M${x} 42 Q${x - 3} 52 ${x + 2} 60 Q${x - 2} 68 ${x + 1} 75`,
                  `M${x} 42 Q${x + 3} 50 ${x - 2} 60 Q${x + 2} 68 ${x - 1} 75`,
                ],
              }}
              transition={{
                duration: 1.5 + i * 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}
