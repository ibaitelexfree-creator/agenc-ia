'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
const CTASection = dynamic(() => import('@/components/sections/CTASection').then(mod => mod.CTASection), { ssr: true })

function OceanGradientActivator() {
  useOceanGradient()
  return null
}

function WhatsAppFloatingButton() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 'clamp(16px, 3vw, 32px)',
        right: 'clamp(16px, 3vw, 32px)',
        zIndex: 9999,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <AnimatePresence mode="wait">
        {!showBackToTop ? (
          <motion.a
            key="whatsapp"
            href="https://wa.me/34944916632"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ rotate: -180, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 180, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'clamp(48px, 6vmax, 68px)',
              height: 'clamp(48px, 6vmax, 68px)',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
              cursor: 'pointer',
              color: '#ffffff',
            }}
            whileHover={{ scale: 1.1, boxShadow: '0 6px 24px rgba(37, 211, 102, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Contactar por WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              width="60%"
              height="60%"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461v-.001c-1.816 0-3.593-.489-5.145-1.414l-.369-.219-3.824 .999 1.018-3.722-.241-.383A9.878 9.878 0 0 1 2.04 12.002c0-5.454 4.437-9.89 9.897-9.89 2.64 0 5.122 1.03 6.988 2.898 1.867 1.868 2.894 4.35 2.893 6.991 0 5.454-4.438 9.892-9.895 9.892m0-18.012c-6.19 0-11.22 5.03-11.22 11.22 0 2.152.615 4.237 1.78 6.035L1 23l6.236-1.635a11.18 11.18 0 0 0 5.016 1.212h.005c6.189 0 11.22-5.031 11.22-11.22 0-2.996-1.167-5.812-3.287-7.933A11.144 11.144 0 0 0 12.051 3.84" />
            </svg>
          </motion.a>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
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
          <ReviewsSection />
          <BlogSection />
          <CTASection />
        </ReducedMotionCanvas>
        <WhatsAppFloatingButton />
      </div>
    )
  }

  return (
    <ScrollEngineV2>
      <OceanGradientActivator />
      {/* Elementos fijos en pantalla (no se mueven con el canvas) */}
      <WindParticles />
      <SectionTransitionOverlay />
      <WhatsAppFloatingButton />

      {/* Canvas que contiene las secciones alineadas verticalmente */}
      <CanvasV2>
        <Section1Hero />
        <Section2Identity />
        <Section3Adapts />
        <Section3Path />
        <Section4Why />
        <ReviewsSection />
        <BlogSection />
      </CanvasV2>
    </ScrollEngineV2>
  )
}
