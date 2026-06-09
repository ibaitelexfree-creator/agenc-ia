// src/hooks/useMagneticCursor.ts
'use client'

import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect, RefObject } from 'react'

type MagneticOptions = {
  strength?: number
  radius?: number
}

export function useMagneticCursor<T extends HTMLElement>(
  ref: RefObject<T>,
  options: MagneticOptions = {}
) {
  const { strength = 0.4, radius = 80 } = options

  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)

  const springX = useSpring(magnetX, { stiffness: 400, damping: 30, mass: 0.5 })
  const springY = useSpring(magnetY, { stiffness: 400, damping: 30, mass: 0.5 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        magnetX.set(dx * strength)
        magnetY.set(dy * strength)
      } else {
        magnetX.set(0)
        magnetY.set(0)
      }
    }

    const handleMouseLeave = () => {
      magnetX.set(0)
      magnetY.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, magnetX, magnetY, strength, radius])

  return { x: springX, y: springY }
}
