// src/components/ui/CounterNumber.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useInView } from 'framer-motion'

type CounterNumberProps = {
  from: number
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number            // segundos, default 1.5
  style?: React.CSSProperties
}

export function CounterNumber({
  from,
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.5,
  style,
}: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(to)
    }
  }, [isInView, motionValue, to])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix + latest.toFixed(decimals).replace('.', ',') + suffix
      }
    })
    return unsubscribe
  }, [springValue, prefix, suffix, decimals])

  return (
    <span ref={ref} style={style}>
      {prefix}{from.toFixed(decimals).replace('.', ',')}{suffix}
    </span>
  )
}
