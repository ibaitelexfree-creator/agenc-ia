// src/hooks/use3DCard.ts
'use client'

import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { RefObject } from 'react'

export function use3DCard(ref: RefObject<HTMLElement>, intensity = 15) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const scale = useSpring(1, { stiffness: 300, damping: 30 })
  const glareOpacity = useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.1, 0.25])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
    scale.set(1.03)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    scale.set(1)
  }

  return {
    rotateX,
    rotateY,
    scale,
    glareOpacity,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}
