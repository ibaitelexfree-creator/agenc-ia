// src/components/creatures/Fish.tsx
'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreatureTrail } from '@/hooks/useCreatureTrail'

type FishProps = {
  style?: React.CSSProperties
  enterDelay?: number
  direction?: 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
  color?: string
}

export function Fish({
  style,
  enterDelay = 0,
  direction = 'right',
  size = 'medium',
  color = '#4AAFE8',
}: FishProps) {
  const sizes = { small: 0.6, medium: 1, large: 1.5 }
  const scale = sizes[size]
  const enterX = direction === 'right' ? -120 : 120

  const { trail, addDot } = useCreatureTrail(5)
  const posRef = useRef({ x: 0, y: 0 })

  return (
    <motion.div
      style={{ ...style, scale }}
      initial={{ opacity: 0, x: enterX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: enterDelay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {/* Movimiento de deriva lento */}
      <motion.div
        animate={{ x: direction === 'right' ? [0, 8, 0] : [0, -8, 0], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        onUpdate={(latest) => {
          const newX = typeof latest.x === 'number' ? latest.x : 0
          const newY = typeof latest.y === 'number' ? latest.y : 0
          if (Math.abs(newX - posRef.current.x) > 1 || Math.abs(newY - posRef.current.y) > 1) {
            addDot(newX, newY)
            posRef.current = { x: newX, y: newY }
          }
        }}
        style={{ position: 'relative' }}
      >
        <svg
          width="60"
          height="35"
          viewBox="0 0 60 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
          aria-hidden="true"
        >
          {/* Cuerpo del pez */}
          <ellipse cx="28" cy="17" rx="22" ry="12" fill={color} opacity="0.85" />
          {/* Cola */}
          <motion.path
            d="M50 17 L60 8 L60 26 Z"
            fill={color}
            opacity="0.7"
            animate={{ d: ['M50 17 L60 8 L60 26 Z', 'M52 17 L60 10 L60 24 Z'] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          {/* Ojo */}
          <circle cx="14" cy="14" r="3" fill="white" />
          <circle cx="14" cy="14" r="1.5" fill="#0D2137" />
          {/* Aleta dorsal */}
          <path d="M20 6 C24 2 30 4 34 6" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
          {/* Escamas sutiles */}
          <path d="M22 14 C24 12 26 14 24 16" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M30 12 C32 10 34 12 32 14" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
        </svg>

        {/* Burbujas del trail */}
        <AnimatePresence>
          {trail.map((dot, i) => (
            <motion.div
              key={dot.id}
              aria-hidden="true"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 0, opacity: 0, y: -10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                border: '1px solid rgba(74, 175, 232, 0.6)',
                left: direction === 'right' ? 45 + dot.x : 15 - dot.x,
                top: 17 + dot.y,
                pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

