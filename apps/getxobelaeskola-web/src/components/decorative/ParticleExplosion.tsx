// src/components/decorative/ParticleExplosion.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useCallback } from 'react'

type Particle = {
  id: number
  angle: number   // grados — dirección de la explosión
  distance: number
  size: number
  color: string
}

const COLORS = ['#F5A623', '#4AAFE8', '#ffffff', '#E8593C', '#0A7EC8']

function generateExplosion(count = 16): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + Math.random() * 20 - 10,
    distance: 40 + Math.random() * 50,
    size: 3 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }))
}

export function ParticleExplosion({ children }: { children: React.ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isExploding, setIsExploding] = useState(false)

  const explode = useCallback(() => {
    if (isExploding) return
    setParticles(generateExplosion())
    setIsExploding(true)
    setTimeout(() => {
      setParticles([])
      setIsExploding(false)
    }, 700)
  }, [isExploding])

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={explode}
    >
      {children}

      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180
          const targetX = Math.cos(rad) * p.distance
          const targetY = Math.sin(rad) * p.distance

          return (
            <motion.span
              key={p.id}
              aria-hidden="true"
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: targetX, y: targetY, scale: 0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: p.color,
                pointerEvents: 'none',
                zIndex: 20,
              }}
            />
          )
        })}
      </AnimatePresence>
    </span>
  )
}
