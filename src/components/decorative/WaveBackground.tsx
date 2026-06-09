// src/components/decorative/WaveBackground.tsx
'use client'

// Ola decorativa de fondo que se usa en múltiples secciones como separador
// Props: position 'top' | 'bottom', color de la ola, color del fondo

type WaveBackgroundProps = {
  position?: 'top' | 'bottom'
  waveColor?: string
  opacity?: number
}

export function WaveBackground({
  position = 'bottom',
  waveColor = '#E8F4FD',
  opacity = 0.5,
}: WaveBackgroundProps) {
  const flipStyle = position === 'top' ? { transform: 'rotate(180deg)' } : {}

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        right: 0,
        height: '80px',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...flipStyle,
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 40 C200 0 400 80 600 40 C800 0 1000 80 1200 40 C1320 20 1400 60 1440 40 L1440 80 L0 80 Z"
          fill={waveColor}
        />
      </svg>
    </div>
  )
}
