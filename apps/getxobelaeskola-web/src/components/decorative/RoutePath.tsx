// src/components/decorative/RoutePath.tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// El path dibuja una ruta curva tipo náutica de S1 → S2 → S3 → S4
const ROUTE_PATH =
  'M 50 450 C 100 400 200 350 300 300 C 400 250 450 200 500 150 C 550 100 600 80 650 60'

export function RoutePath() {
  const ref = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1])

  return (
    <svg
      ref={ref}
      viewBox="0 0 700 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.15,
      }}
    >
      {/* Ruta trazada */}
      <motion.path
        d={ROUTE_PATH}
        stroke="var(--ocean-bright)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 6"
        fill="none"
        style={{ pathLength }}
      />

      {/* Puntos de escala en cada sección */}
      {[
        { cx: 50, cy: 450, label: 'S1' },
        { cx: 300, cy: 300, label: 'S2' },
        { cx: 500, cy: 150, label: 'S3' },
        { cx: 650, cy: 60, label: 'S4' },
      ].map((point, i) => (
        <motion.circle
          key={point.label}
          cx={point.cx}
          cy={point.cy}
          r="5"
          fill="var(--ocean-light)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: i * 0.3, duration: 0.4 }}
        />
      ))}
    </svg>
  )
}
