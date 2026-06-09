// src/components/layout/SectionTransitionOverlay.tsx
'use client'

import { motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollContext } from './ScrollEngine'
import { SCROLL_MAP } from '@/lib/scroll-map'

export function SectionTransitionOverlay() {
  const { scrollYProgress } = useScrollContext()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)

  // Detectar cuando el scroll pasa por un punto de transición
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const isNearTransition = SCROLL_MAP.some((step) => {
      const t = step.scrollEnd
      return Math.abs(progress - t) < 0.015 && t > 0 && t < 1
    })

    if (isNearTransition && !isTransitioning) {
      setIsTransitioning(true)
      setTransitionKey((k) => k + 1)
      setTimeout(() => setIsTransitioning(false), 700)
    }
  })

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={transitionKey}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Ola que barre de abajo hacia arriba */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] as const }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,126,200,0.25) 0%, rgba(13,33,55,0.5) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
