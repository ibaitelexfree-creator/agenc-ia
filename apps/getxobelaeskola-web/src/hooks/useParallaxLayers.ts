// src/hooks/useParallaxLayers.ts
'use client'

import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { RefObject } from 'react'

type ParallaxLayer = {
  speed: number    // 0 = estático, 1 = mueve igual que el scroll, -1 = inverso
}

export function useParallaxLayers(
  containerRef: RefObject<HTMLElement>,
  layers: ParallaxLayer[]
): MotionValue<string>[] {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  } as any)

  return layers.map((layer) =>
    useTransform(scrollYProgress, [0, 1], ['0%', `${-layer.speed * 40}%`])
  )
}
