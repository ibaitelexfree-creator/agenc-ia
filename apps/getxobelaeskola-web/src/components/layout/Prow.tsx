'use client'

import { motion } from 'framer-motion'
import { useScrollContext } from './ScrollEngine'

export function Prow() {
  const { prowRotation } = useScrollContext()

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        translateX: '-50%',
        zIndex: 50,
        pointerEvents: 'none',
        // La rotación anima según el scroll
        rotate: prowRotation,
        transformOrigin: 'bottom center',
      }}
    >
      {/* SVG de la proa — vista frontal de un casco de velero */}
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Casco del barco — forma de proa */}
        <path
          d="M60 0 C40 20 10 50 5 80 L115 80 C110 50 80 20 60 0Z"
          fill="#0D2137"
          opacity="0.9"
        />
        {/* Línea de cubierta */}
        <path
          d="M20 60 Q60 45 100 60"
          stroke="#4AAFE8"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
        {/* Mástil */}
        <line
          x1="60"
          y1="5"
          x2="60"
          y2="45"
          stroke="#0A7EC8"
          strokeWidth="2"
          opacity="0.6"
        />
        {/* Reflejo en el agua (blur simulado) */}
        <ellipse
          cx="60"
          cy="78"
          rx="45"
          ry="5"
          fill="#4AAFE8"
          opacity="0.15"
        />
      </svg>

      {/* Texto indicador de scroll — aparece/desaparece según dirección */}
      <motion.p
        style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginTop: '4px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 600,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        scroll
      </motion.p>
    </motion.div>
  )
}
