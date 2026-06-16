// src/components/layout/MagicCursor.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsMobile } from '@/hooks/useMediaQuery'

export function MagicCursor() {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Cursor exterior — lag suave
  const cursorX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.8 })
  const cursorY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.8 })

  // Punto interior — responde instantáneo
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 40 })
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 40 })

  useEffect(() => {
    if (isMobile) return

    const lastX = { current: -100 }
    const lastY = { current: -100 }

    const handleMove = (e: MouseEvent) => {
      lastX.current = e.clientX
      lastY.current = e.clientY
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    let frameId: number

    const checkElementUnderCursor = () => {
      if (lastX.current >= 0 && lastY.current >= 0) {
        const target = document.elementFromPoint(lastX.current, lastY.current)
        if (target) {
          const clickable = target.closest('a, button, [role="button"], input, select, [cursor-pointer]')
          setIsPointer(!!clickable)
        } else {
          setIsPointer(false)
        }
      }
      frameId = requestAnimationFrame(checkElementUnderCursor)
    }

    window.addEventListener('mousemove', handleMove)
    frameId = requestAnimationFrame(checkElementUnderCursor)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(frameId)
    }
  }, [isMobile, isVisible, mouseX, mouseY])

  if (isMobile || !isVisible) return null

  return (
    <>
      {/* Cursor exterior — el anillo */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? '48px' : '32px',
          height: isPointer ? '48px' : '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(74, 175, 232, 0.6)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transition: 'width 0.3s ease, height 0.3s ease',
        }}
      />
      {/* Punto interior */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--ocean-light)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
