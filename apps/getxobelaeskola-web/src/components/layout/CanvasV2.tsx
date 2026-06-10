'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { useScrollContext } from './ScrollEngine'
import { CTASection } from '@/components/sections/CTASection'

export function CanvasV2({ children }: { children: React.ReactNode }) {
  const { canvasX, canvasY } = useScrollContext()
  return (
    <motion.div
      style={{
        width: '100vw',
        height: '500vh',
        position: 'absolute',
        top: 0,
        left: 0,
        translateX: canvasX,
        translateY: canvasY,
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        display: 'grid',
        gridTemplateColumns: '100vw',
        gridTemplateRows: '100vh 100vh 100vh 100vh 100vh',
        gridTemplateAreas: `
          "s1"
          "s2"
          "s3"
          "s4"
          "cta"
        `,
      }}
    >
      {children}
      <CTASection />
    </motion.div>
  )
}
