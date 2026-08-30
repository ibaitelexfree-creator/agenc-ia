'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { useScrollContext } from './ScrollEngine'


export function CanvasV2({ children }: { children: React.ReactNode }) {
  const { canvasX, canvasY } = useScrollContext()
  return (
    <motion.div
      className="canvas-container"
      style={{
        width: '100%',
        translateX: canvasX,
        translateY: canvasY,
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}
