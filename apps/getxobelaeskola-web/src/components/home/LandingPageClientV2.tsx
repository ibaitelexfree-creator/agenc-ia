'use client'

import { ScrollEngineV2 } from '@/components/layout/ScrollEngineV2'
import { CanvasV2 } from '@/components/layout/CanvasV2'
import { Section1Hero } from '@/components/sections/Section1Hero'
import { Section2Adapts } from '@/components/sections/Section2Adapts'
import { Section3Path } from '@/components/sections/Section3Path'
import { Section4Why } from '@/components/sections/Section4Why'
import { WindParticles } from '@/components/decorative/WindParticles'
import { useOceanGradient } from '@/hooks/useOceanGradient'
import { SectionTransitionOverlay } from '@/components/layout/SectionTransitionOverlay'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ReducedMotionCanvas } from '@/components/layout/ReducedMotionCanvas'
import { CTASection } from '@/components/sections/CTASection'
import { LandingSidebar } from '@/components/layout/LandingSidebar'
import ReviewsSection from '@/components/sections/Reviews/ReviewsSection'
import BlogSection from '@/components/sections/Blog/BlogSection'

function OceanGradientActivator() {
  useOceanGradient()
  return null
}

export function LandingPageClientV2() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div>
        <LandingSidebar />
        <ReducedMotionCanvas>
          <Section1Hero />
          <Section2Adapts />
          <Section3Path />
          <Section4Why />
          <ReviewsSection />
          <BlogSection />
          <CTASection />
        </ReducedMotionCanvas>
      </div>
    )
  }

  return (
    <ScrollEngineV2>
      <OceanGradientActivator />
      {/* Elementos fijos en pantalla (no se mueven con el canvas) */}
      <LandingSidebar />
      <WindParticles />
      <SectionTransitionOverlay />

      {/* Canvas que contiene las secciones alineadas verticalmente */}
      <CanvasV2>
        <Section1Hero />
        <Section2Adapts />
        <Section3Path />
        <Section4Why />
        <ReviewsSection />
        <BlogSection />
      </CanvasV2>
    </ScrollEngineV2>
  )
}
