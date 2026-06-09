'use client'

import { useState } from 'react'
import { motion, useMotionValueEvent } from 'framer-motion'
import { useScrollContext } from './ScrollEngine'

const DOT_POSITIONS = [
  { x: 0, y: 0, label: 0 },    // S1: arriba izquierda del mapa
  { x: 1, y: 0, label: 1 },    // S2: arriba derecha
  { x: 1, y: 1, label: 2 },    // S3: abajo derecha
  { x: 0, y: 1, label: 3 },    // S4: abajo izquierda
]

export function CompassNav() {
  const { currentSection, compassAngle } = useScrollContext()
  const [activeSection, setActiveSection] = useState(0)

  useMotionValueEvent(currentSection, 'change', (v) => {
    setActiveSection(Math.round(v))
  })

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      {/* Mini-mapa 2×2 con dots */}
      <div
        style={{
          width: '44px',
          height: '44px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '4px',
          backgroundColor: 'rgba(13, 33, 55, 0.6)',
          borderRadius: '8px',
          padding: '6px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(74, 175, 232, 0.3)',
        }}
      >
        {DOT_POSITIONS.map((dot) => (
          <div key={dot.label} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor:
                  activeSection === dot.label ? 'var(--ocean-bright)' : 'var(--text-muted)',
                opacity: activeSection === dot.label ? 1 : 0.4,
              }}
            />
            {/* Aura pulsante en el dot activo */}
            {activeSection === dot.label && (
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--ocean-light)',
                }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Aguja de brújula */}
      <motion.div
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--gold)',
          borderRadius: '50%',
          margin: '4px auto 0',
          rotate: compassAngle,
        }}
      />
    </div>
  )
}
