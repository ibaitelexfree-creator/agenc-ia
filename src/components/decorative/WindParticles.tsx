// src/components/decorative/WindParticles.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Particle = {
  id: number
  x: number      // posición inicial X en vw (0–100)
  y: number      // posición inicial Y en vh (0–100)
  size: number   // tamaño en px (2–5)
  duration: number  // duración animación (3–6s)
  delay: number     // delay inicial (0–5s)
  opacity: number   // 0.1–0.4
}

const PARTICLE_COUNT = 12

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.3,
  }))
}

export function WindParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setParticles(generateParticles())
  }, [])

  // No renderizar si el usuario prefiere sin movimiento
  if (prefersReducedMotion) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: `${p.y}vh`,
            left: `${p.x}vw`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            backgroundColor: 'var(--ocean-light)',
            borderRadius: '50px',
            opacity: p.opacity,
          }}
          animate={{
            x: ['0vw', '30vw'],
            y: ['0vh', '-5vh'],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
