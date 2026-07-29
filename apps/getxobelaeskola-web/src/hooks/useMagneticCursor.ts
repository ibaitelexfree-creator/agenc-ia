// src/hooks/useMagneticCursor.ts
'use client'

import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect, RefObject } from 'react'

type MagneticOptions = {
  strength?: number
  radius?: number
  stiffness?: number
  damping?: number
  mass?: number
}

export function useMagneticCursor<T extends HTMLElement>(
  ref: RefObject<T>,
  options: MagneticOptions = {}
) {
  const {
    strength = 0.4,
    radius = 80,
    stiffness = 400,
    damping = 30,
    mass = 0.5
  } = options

  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)

  const springX = useSpring(magnetX, { stiffness, damping, mass })
  const springY = useSpring(magnetY, { stiffness, damping, mass })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let cachedRect: DOMRect | null = null
    let lastRectUpdate = 0

    const updateRect = () => {
      const now = performance.now()
      if (!cachedRect || now - lastRectUpdate > 200) {
        cachedRect = el.getBoundingClientRect()
        lastRectUpdate = now
      }
      return cachedRect
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = updateRect()
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

    // Update rect on scroll or resize just in case
    const handleScrollResize = () => {
      lastRectUpdate = 0 // Force update next time
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScrollResize, { passive: true })
    window.addEventListener('resize', handleScrollResize, { passive: true })
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScrollResize)
      window.removeEventListener('resize', handleScrollResize)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, magnetX, magnetY, strength, radius])

  return { x: springX, y: springY }
}
