// src/components/decorative/DramaticWind.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type WindLine = {
  id: number
  y: number
  width: number
  duration: number
  delay: number
  opacity: number
}

export function DramaticWind() {
  const [lines, setLines] = useState<WindLine[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setLines(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        y: Math.random() * 100,
        width: 20 + Math.random() * 80,
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 3,
        opacity: 0.06 + Math.random() * 0.12,
      }))
    )
  }, [])

  if (prefersReducedMotion || lines.length === 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {lines.map((line) => (
        <motion.div
          key={line.id}
          style={{
            position: 'absolute',
            top: `${line.y}%`,
            height: '1px',
            width: `${line.width}px`,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '1px',
            opacity: line.opacity,
          }}
          animate={{
            x: ['-10vw', '110vw'],
            opacity: [0, line.opacity, line.opacity, 0],
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
