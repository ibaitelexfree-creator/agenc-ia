// src/components/decorative/RoutePath.tsx
'use client'

import { motion } from 'framer-motion'

// El path dibuja una ruta curva tipo náutica de S1 → S2 → S3 → S4
const ROUTE_PATH =
  'M 50 450 C 100 400 200 350 300 300 C 400 250 450 200 500 150 C 550 100 600 80 650 60'

export function RoutePath({ progress = 0 }: { progress?: number }) {
  return (
    <svg
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
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
      />

      {/* Puntos de escala en cada sección */}
      {[
        { cx: 50, cy: 450, label: 'S1', activeAt: 0 },
        { cx: 300, cy: 300, label: 'S2', activeAt: 0.5 },
        { cx: 500, cy: 150, label: 'S3', activeAt: 1.0 },
        { cx: 650, cy: 60, label: 'S4', activeAt: 1.0 },
      ].map((point, i) => (
        <motion.circle
          key={point.label}
          cx={point.cx}
          cy={point.cy}
          r="5"
          fill="#4AAFE8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: progress >= point.activeAt ? 1.3 : 1.0, 
            opacity: progress >= point.activeAt ? 1.0 : 0.4,
            fill: progress >= point.activeAt ? '#0A7EC8' : '#4AAFE8'
          }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </svg>
  )
}
