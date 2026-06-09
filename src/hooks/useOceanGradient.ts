// src/hooks/useOceanGradient.ts
'use client'

import { useMotionValueEvent } from 'framer-motion'
import { useScrollContext } from '@/components/layout/ScrollEngine'

// Los 5 estados del océano (por sección)
const OCEAN_STATES = [
  // S1 Hero — amanecer dorado sobre el mar
  'linear-gradient(180deg, #0D2137 0%, #1a3a5c 40%, #2d5a8a 100%)',
  // S2 La vela — azul marino brillante
  'linear-gradient(180deg, #001a33 0%, #005B9A 50%, #0A7EC8 100%)',
  // S3 Descubre — turquesa profundo
  'linear-gradient(180deg, #012030 0%, #013d5a 50%, #018a8a 100%)',
  // S4 Por qué — azul medianoche
  'linear-gradient(180deg, #020d1a 0%, #0D2137 50%, #0a4a7a 100%)',
  // CTA — atardecer en el puerto
  'linear-gradient(180deg, #1a0a05 0%, #3d1a0a 40%, #0D2137 100%)',
]

export function useOceanGradient() {
  const { currentSection } = useScrollContext()

  useMotionValueEvent(currentSection, 'change', (sectionIndex) => {
    const idx = Math.min(Math.round(sectionIndex), OCEAN_STATES.length - 1)
    document.documentElement.style.setProperty(
      '--current-ocean-gradient',
      OCEAN_STATES[idx]
    )
  })
}
