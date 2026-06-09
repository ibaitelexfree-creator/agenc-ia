// src/components/decorative/HorizonLine.tsx
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type HorizonLineProps = {
  color?: string
  opacity?: number
}

export function HorizonLine({ color = 'var(--ocean-light)', opacity = 0.3 }: HorizonLineProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: '1px',
        backgroundColor: color,
        opacity,
        pointerEvents: 'none',
        transformOrigin: 'center',
      }}
      animate={prefersReducedMotion ? {} : {
        rotate: [-0.5, 0.5],
        scaleX: [0.98, 1.02],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  )
}
