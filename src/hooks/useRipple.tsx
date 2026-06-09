// src/hooks/useRipple.tsx
'use client'

import React, { useState, useCallback } from 'react'

type RippleItem = {
  id: number
  x: number
  y: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([])

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  const RippleContainer = () => (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%) scale(0)',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            animation: 'rippleExpand 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )

  return { createRipple, RippleContainer }
}
