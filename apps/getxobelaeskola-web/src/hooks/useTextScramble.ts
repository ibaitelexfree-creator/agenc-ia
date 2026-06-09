// src/hooks/useTextScramble.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useTextScramble(finalText: string, triggerOnView = true) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [displayText, setDisplayText] = useState(finalText)
  const [isScrambling, setIsScrambling] = useState(false)
  const frameRef = useRef<number>()

  const scramble = () => {
    if (isScrambling) return
    setIsScrambling(true)

    const totalFrames = finalText.length * 4  // 4 frames por carácter
    let frame = 0

    const tick = () => {
      const revealed = Math.floor(frame / 4)

      const scrambled = finalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < revealed) return finalText[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setDisplayText(scrambled)
      frame++

      if (frame <= totalFrames) {
        frameRef.current = window.setTimeout(tick, 40)
      } else {
        setDisplayText(finalText)
        setIsScrambling(false)
      }
    }

    tick()
  }

  useEffect(() => {
    if (triggerOnView && isInView) {
      scramble()
    }
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [isInView, triggerOnView])

  return { ref, displayText, scramble }
}
