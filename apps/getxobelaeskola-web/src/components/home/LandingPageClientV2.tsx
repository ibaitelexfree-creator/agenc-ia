'use client'

import { ScrollEngineV2 } from '@/components/layout/ScrollEngineV2'
import { CanvasV2 } from '@/components/layout/CanvasV2'
import { Section1Hero } from '@/components/sections/Section1Hero'
import { WindParticles } from '@/components/decorative/WindParticles'
import { useOceanGradient } from '@/hooks/useOceanGradient'
import { SectionTransitionOverlay } from '@/components/layout/SectionTransitionOverlay'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { ReducedMotionCanvas } from '@/components/layout/ReducedMotionCanvas'
import dynamic from 'next/dynamic'

const Section2Identity = dynamic(() => import('@/components/sections/Section2Identity').then(mod => mod.Section2Identity), { ssr: true })
const Section3Adapts = dynamic(() => import('@/components/sections/Section3Adapts').then(mod => mod.Section3Adapts), { ssr: true })
const Section3Path = dynamic(() => import('@/components/sections/Section3Path').then(mod => mod.Section3Path), { ssr: true })
const Section4Why = dynamic(() => import('@/components/sections/Section4Why').then(mod => mod.Section4Why), { ssr: true })
const ReviewsSection = dynamic(() => import('@/components/sections/Reviews/ReviewsSection'), { ssr: true })
const BlogSection = dynamic(() => import('@/components/sections/Blog/BlogSection'), { ssr: true })

const HomeStatsSection = dynamic(() => import('@/components/sections/HomeStatsSection'), { ssr: true })
const NewsletterSection = dynamic(() => import('@/components/sections/NewsletterSection'), { ssr: true })

function OceanGradientActivator() {
  useOceanGradient()
  return null
}

export function LandingPageClientV2() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div>
        <ReducedMotionCanvas>
          <Section1Hero />
          <Section2Identity />
          <Section3Adapts />
          <Section3Path />
          <Section4Why />
          <BlogSection />
          <ReviewsSection />
        </ReducedMotionCanvas>
      </div>
    )
  }

  return (
    <ScrollEngineV2>
      <OceanGradientActivator />
      {/* Elementos fijos en pantalla (no se mueven con el canvas) */}
      <WindParticles />
      <SectionTransitionOverlay />

      {/* Canvas que contiene las secciones alineadas verticalmente */}
      <CanvasV2>
        <Section1Hero />
        <Section2Identity />
        <Section3Adapts />
        <Section3Path />
        <Section4Why />
        <BlogSection />
        <ReviewsSection />
      </CanvasV2>
    </ScrollEngineV2>
  )
}
