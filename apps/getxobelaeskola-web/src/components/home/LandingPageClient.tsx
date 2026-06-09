'use client'

import { ScrollEngine } from '@/components/layout/ScrollEngine'
import { Canvas } from '@/components/layout/Canvas'
import { Prow } from '@/components/layout/Prow'
import { CompassNav } from '@/components/layout/CompassNav'
import { Section1Hero } from '@/components/sections/Section1Hero'
import { Section2Adapts } from '@/components/sections/Section2Adapts'
import { Section3Path } from '@/components/sections/Section3Path'
import { Section4Why } from '@/components/sections/Section4Why'
import { WindParticles } from '@/components/decorative/WindParticles'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useOceanGradient } from '@/hooks/useOceanGradient'
import { SectionTransitionOverlay } from '@/components/layout/SectionTransitionOverlay'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ReducedMotionCanvas } from '@/components/layout/ReducedMotionCanvas'
import { CTASection } from '@/components/sections/CTASection'

function OceanGradientActivator() {
  useOceanGradient()
  return null
}

export function LandingPageClient() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div>
        <Prow />
        <LanguageSwitcher />
        <ReducedMotionCanvas>
          <Section1Hero />
          <Section2Adapts />
          <Section3Path />
          <Section4Why />
          <CTASection />
        </ReducedMotionCanvas>
      </div>
    )
  }

  return (
    <ScrollEngine>
      <OceanGradientActivator />
      {/* Elementos fijos en pantalla (no se mueven con el canvas) */}
      <Prow />
      <CompassNav />
      <WindParticles />
      <SectionTransitionOverlay />
      <LanguageSwitcher />

      {/* Canvas que contiene las 4 secciones en cuadrícula 2x2 + CTA */}
      <Canvas>
        <Section1Hero />
        <Section2Adapts />
        <Section3Path />
        <Section4Why />
      </Canvas>
    </ScrollEngine>
  )
}
