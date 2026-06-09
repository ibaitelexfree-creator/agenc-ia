'use client'

import { motion, useMotionValueEvent, useVelocity } from 'framer-motion'
import React, { useState } from 'react'
import { useScrollContext } from './ScrollEngine'
import { CTASection } from '@/components/sections/CTASection'

export function Canvas({ children }: { children: React.ReactNode }) {
  const { canvasX, canvasY, scrollYProgress } = useScrollContext()
  const scrollVelocity = useVelocity(scrollYProgress)
  const [blurAmount, setBlurAmount] = useState(0)

  useMotionValueEvent(scrollVelocity, 'change', (velocity) => {
    const blur = Math.min(Math.abs(velocity) * 8, 6)
    setBlurAmount(blur)
  })

  return (
    <motion.div
      style={{
        // El canvas mide 200vw × 300vh para albergar la cuadrícula 2×2 + CTA
        width: '200vw',
        height: '300vh',
        position: 'absolute',
        top: 0,
        left: 0,
        // Animamos con las MotionValues del ScrollEngine
        translateX: canvasX,
        translateY: canvasY,
        filter: `blur(${blurAmount}px)`,
        transition: 'filter 0.1s ease',
        // Cuadrícula CSS:
        // Col 1: S1 Hero (x=0)    Col 2: S2 La vela (x=100vw)
        // Row 1: y=0     Row 2: y=100vh    Row 3 (solo col 1): y=200vh = CTA
        display: 'grid',
        gridTemplateColumns: '100vw 100vw',
        gridTemplateRows: '100vh 100vh 100vh',
        gridTemplateAreas: `
          "s1 s2"
          "s4 s3"
          "cta ."
        `,
      }}
    >
      {/*
        Los hijos se posicionan en las grid areas.
        Section1Hero → area "s1"
        Section2Adapts → area "s2"
        Section3Path → area "s3"
        Section4Why → area "s4"
        El CTA ocupa "cta" — se añade en Fase 5
      */}
      {children}
      <CTASection />
    </motion.div>
  )
}
