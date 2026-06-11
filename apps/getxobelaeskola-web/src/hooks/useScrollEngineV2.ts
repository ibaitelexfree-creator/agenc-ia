'use client'

import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

type ScrollEngineReturn = {
  containerRef: React.RefObject<HTMLDivElement>
  canvasX: MotionValue<string>
  canvasY: MotionValue<string>
  prowRotation: MotionValue<number>
  compassAngle: MotionValue<number>
  scrollYProgress: MotionValue<number>
  currentSection: MotionValue<number>
}

export function useScrollEngineV2(): ScrollEngineReturn {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
    layoutEffect: false
  } as any)

  const scrollPoints = [0, 0.12, 0.28, 0.40, 0.68, 0.78, 0.92, 1.0]
  const prowValues = [0, 0, 0, 0, 0, 0, 0, 0] // always pointing forward/down
  const compassValues = [0, 90, 90, 180, 180, 270, 270, 360]

  // Canvas X stays at 0vw
  const xScrollPoints = [0, 0.12, 0.28, 0.40, 0.68, 0.78, 0.92, 1.0]
  const rawCanvasX = useTransform(scrollYProgress, xScrollPoints, [0, 0, 0, 0, 0, 0, 0, 0])
  const springX = useSpring(rawCanvasX, { stiffness: 120, damping: 20, mass: 1 })
  const canvasX = useTransform(springX, (v) => `${v}vw`)

  // Canvas Y translates vertically
  const yScrollPoints = [0, 0.12, 0.28, 0.40, 0.68, 0.78, 0.92, 1.0]
  const rawCanvasY = useTransform(scrollYProgress, yScrollPoints, [0, 0, -100, -100, -200, -200, -300, -400])
  const springY = useSpring(rawCanvasY, { stiffness: 120, damping: 20, mass: 1 })
  const canvasY = useTransform(springY, (v) => `${v}vh`)

  const rawProw = useTransform(scrollYProgress, scrollPoints, prowValues)
  const prowRotation = useSpring(rawProw, { stiffness: 80, damping: 15, mass: 1 })

  const rawCompass = useTransform(scrollYProgress, scrollPoints, compassValues)
  const compassAngle = useSpring(rawCompass, { stiffness: 60, damping: 12 })

  const currentSection = useTransform(scrollYProgress, (progress: number): number => {
    if (progress < 0.12) return 0
    if (progress < 0.40) return 1
    if (progress < 0.78) return 2
    if (progress < 0.92) return 3
    return 4
  })

  return {
    containerRef,
    canvasX,
    canvasY,
    prowRotation,
    compassAngle,
    scrollYProgress,
    currentSection,
  }
}
