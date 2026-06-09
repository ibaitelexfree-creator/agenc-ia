'use client'

import { useState, useCallback, useRef } from 'react'

type TrailDot = {
  id: number
  x: number
  y: number
}

export function useCreatureTrail(maxDots = 6) {
  const [trail, setTrail] = useState<TrailDot[]>([])
  const counterRef = useRef(0)

  const addDot = useCallback((x: number, y: number) => {
    const id = counterRef.current++
    setTrail((prev) => {
      const next = [...prev, { id, x, y }]
      return next.slice(-maxDots)
    })
    setTimeout(() => {
      setTrail((prev) => prev.filter((d) => d.id !== id))
    }, 600)
  }, [maxDots])

  return { trail, addDot }
}
