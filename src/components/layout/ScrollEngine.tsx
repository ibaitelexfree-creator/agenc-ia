'use client'

import React, { createContext, useContext } from 'react'
import { MotionValue } from 'framer-motion'
import { useScrollEngine } from '@/hooks/useScrollEngine'
import { TOTAL_SCROLL_HEIGHT_VH } from '@/lib/scroll-map'

// ── Context para pasar valores a hijos ────────────────────────────────────────
type ScrollContextType = {
  canvasX: MotionValue<string>
  canvasY: MotionValue<string>
  prowRotation: MotionValue<number>
  compassAngle: MotionValue<number>
  scrollYProgress: MotionValue<number>
  currentSection: MotionValue<number>
}

export const ScrollContext = createContext<ScrollContextType | null>(null)

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScrollContext must be used inside ScrollEngine')
  return ctx
}

// ── Componente principal ──────────────────────────────────────────────────────
export function ScrollEngine({ children }: { children: React.ReactNode }) {
  const engine = useScrollEngine()

  return (
    <ScrollContext.Provider value={engine}>
      {/*
        Contenedor sticky: define la altura de scroll ficticio.
        El hijo sticky ocupa 100vh y es el viewport real.
      */}
      <div
        ref={engine.containerRef}
        style={{ height: `${TOTAL_SCROLL_HEIGHT_VH}vh` }}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  )
}
