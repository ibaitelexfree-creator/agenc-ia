'use client'

import { motion } from 'framer-motion'

type SeahorseProps = {
  style?: React.CSSProperties
  enterDelay?: number
  color?: string
}

export function Seahorse({ style, enterDelay = 0, color = '#4AAFE8' }: SeahorseProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: -40, rotate: -20 }}
      animate={{ opacity: 0.7, x: 0, rotate: 0 }}
      transition={{ delay: enterDelay, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Flotación en forma de S */}
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="35"
          height="65"
          viewBox="0 0 35 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Cuerpo en forma de S */}
          <path
            d="M20 5 C28 5 32 12 28 18 C24 24 16 24 14 30 C12 36 16 42 20 46 C24 50 22 58 15 60"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {/* Cabeza */}
          <circle cx="20" cy="7" r="5" fill={color} opacity="0.85" />
          {/* Hocico */}
          <path d="M25 5 L32 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Ojo */}
          <circle cx="22" cy="5" r="1.5" fill="white" />
          {/* Aletas animadas - Transformación CSS en lugar de morphing de path para evitar crashes */}
          <motion.g
            animate={{ rotateZ: [-10, 15], scaleY: [0.9, 1.1] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            style={{ transformOrigin: '14px 22px' }}
          >
            <path
              d="M14 22 C8 20 6 24 10 25"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />
          </motion.g>
          {/* Cola cola */}
          <path
            d="M15 60 C8 60 5 65 10 65 C15 65 18 62 15 60"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}
