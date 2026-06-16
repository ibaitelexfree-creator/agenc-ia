'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        bottom: '24px',
        right: '24px',
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
            href="https://wa.me/34944000000"
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
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.1, boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Contactar por WhatsApp"
          >
            <img
              src="/images/icons8-whatsapp.gif"
              alt="WhatsApp"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '50%',
              }}
            />
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
        <WhatsAppFloatingButton />
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
      <WhatsAppFloatingButton />

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
