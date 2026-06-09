'use client'

import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { SCROLL_MAP } from '@/lib/scroll-map'

type ScrollEngineReturn = {
  containerRef: React.RefObject<HTMLDivElement>
  canvasX: MotionValue<string>
  canvasY: MotionValue<string>
  prowRotation: MotionValue<number>
  compassAngle: MotionValue<number>
  scrollYProgress: MotionValue<number>
  currentSection: MotionValue<number>
}

export function useScrollEngine(): ScrollEngineReturn {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Keyframes de interpolación que incluyen el punto final 1.0 ──────────────
  const scrollPoints = [0, 0.2, 0.54, 0.66, 0.8, 1.0]
  const prowValues = [0, -20, 0, 20, 0, 0]
  const compassValues = [0, 90, 180, 270, 360, 360]

  // ── Canvas X ──────────────────────────────────────────────────────────────
  const xScrollPoints = [0, 0.2, 0.54, 0.66, 0.8, 1.0]
  const rawCanvasX = useTransform(scrollYProgress, xScrollPoints, [0, -100, -100, -100, 0, 0])
  const springX = useSpring(rawCanvasX, { stiffness: 120, damping: 20, mass: 1 })
  const canvasX = useTransform(springX, (v) => `${v}vw`)

  // ── Canvas Y ──────────────────────────────────────────────────────────────
  const yScrollPoints = [0, 0.2, 0.54, 0.70, 0.8, 1.0]
  const rawCanvasY = useTransform(scrollYProgress, yScrollPoints, [0, 0, 0, -100, -100, -200])
  const springY = useSpring(rawCanvasY, { stiffness: 120, damping: 20, mass: 1 })
  const canvasY = useTransform(springY, (v) => `${v}vh`)

  // ── Rotación de proa ────────────────────────────────────────────────────────
  const rawProw = useTransform(scrollYProgress, scrollPoints, prowValues)
  const prowRotation = useSpring(rawProw, { stiffness: 80, damping: 15, mass: 1 })

  // ── Ángulo de brújula ───────────────────────────────────────────────────────
  const rawCompass = useTransform(scrollYProgress, scrollPoints, compassValues)
  const compassAngle = useSpring(rawCompass, { stiffness: 60, damping: 12 })

  // ── Índice de sección actual ────────────────────────────────────────────────
  const currentSection = useTransform(scrollYProgress, (progress: number): number => {
    if (progress < 0.2) return 0
    if (progress < 0.54) return 1
    if (progress < 0.70) return 2
    if (progress < 0.8) return 3
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
