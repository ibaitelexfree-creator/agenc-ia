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
import { LandingSidebar } from '@/components/layout/LandingSidebar'
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
      <LandingSidebar />
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
