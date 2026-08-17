// src/components/sections/CTASection.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ParticleExplosion } from '@/components/decorative/ParticleExplosion'
import { DramaticWind } from '@/components/decorative/DramaticWind'
import { GlowButton } from '@/components/ui/GlowButton'

export function CTASection() {
  const t = useTranslations('cta')

  return (
    <div
      className="section-cta"
      style={{
        gridArea: 'cta',
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <DramaticWind />

      {/* Imagen de fondo */}
      <Image
        src="/images/ai/cta-sunset.webp"
        alt="Atardecer en el puerto de Getxo"
        fill
        quality={80}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      {/* Overlay oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(13,33,55,0.8) 0%, rgba(0,91,154,0.7) 100%)',
        }}
      />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '680px',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          {t('title')}
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          {t('subtitle')}
        </p>
        
        <ParticleExplosion>
          <GlowButton href={t('href')} color="coral" size="lg" external>
            {t('button')}
          </GlowButton>
        </ParticleExplosion>
      </motion.div>
    </div>
  )
}
