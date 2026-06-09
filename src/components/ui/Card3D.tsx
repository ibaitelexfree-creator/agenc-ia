// src/components/ui/Card3D.tsx
'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { use3DCard } from '@/hooks/use3DCard'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Card3DProps = {
  children: React.ReactNode
  style?: React.CSSProperties
  intensity?: number
}

export function Card3D({ children, style, intensity = 12 }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { rotateX, rotateY, scale, glareOpacity, onMouseMove, onMouseLeave } = use3DCard(
    ref,
    prefersReducedMotion ? 0 : intensity
  )

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '800px',
        rotateX,
        rotateY,
        scale,
        ...style,
      }}
    >
      {children}

      {/* Capa de destello de luz — sigue al cursor */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%)',
          opacity: glareOpacity,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </motion.div>
  )
}
