// src/components/sections/Section2Adapts.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ExperienceToggle } from '@/components/ui/ExperienceToggle'
import { Windsurfer } from '@/components/creatures/Windsurfer'
import { Card3D } from '@/components/ui/Card3D'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function Section2Adapts() {
  const t = useTranslations('s2')
  const [experienceType, setExperienceType] = useState<'a' | 'b'>('a')

  // La imagen cambia según el tipo de experiencia seleccionado
  const bgImage = experienceType === 'a'
    ? '/images/ai/section2-calm-bay.webp'
    : '/images/ai/section2-action-sea.webp'

  return (
    <section
      style={{
        gridArea: 's2',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Zona superior — imagen reactiva */}
      <div style={{ position: 'relative', height: '45%', overflow: 'hidden' }}>
        <motion.div
          key={bgImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={bgImage}
            alt="Experiencia de navegación"
            fill
            quality={80}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>
        {/* Gradiente fade hacia blanco */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13,33,55,0.15) 0%, #ffffff 100%)',
          }}
        />
      </div>

      {/* Zona inferior — tarjetas de opciones */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--white)',
          padding: 'clamp(1rem, 3vh, 2rem) clamp(1.5rem, 5vw, 4rem)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
          style={{ marginBottom: '1.5rem' }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-bright)" />
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--ocean-deep)',
              lineHeight: 1.15,
              marginBottom: '0.5rem',
            }}
          >
            {t('title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid de 4 tarjetas toggle */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Tarjeta 1: Tipo de experiencia */}
          <motion.div variants={cardVariant}>
            <Card3D intensity={8}>
              <ExperienceToggle
                label={t('card1.label')}
                optionA={{ label: t('card1.option_a'), description: t('card1.option_a_desc') }}
                optionB={{ label: t('card1.option_b'), description: t('card1.option_b_desc') }}
                onToggle={setExperienceType}
              />
            </Card3D>
          </motion.div>

          {/* Tarjeta 2: El escenario */}
          <motion.div variants={cardVariant}>
            <Card3D intensity={8}>
              <ExperienceToggle
                label={t('card2.label')}
                optionA={{ label: t('card2.option_a'), description: t('card2.option_a_desc') }}
                optionB={{ label: t('card2.option_b'), description: t('card2.option_b_desc') }}
              />
            </Card3D>
          </motion.div>

          {/* Tarjeta 3: Con quién navegar */}
          <motion.div variants={cardVariant}>
            <Card3D intensity={8}>
              <ExperienceToggle
                label={t('card3.label')}
                optionA={{ label: t('card3.option_a'), description: t('card3.option_a_desc') }}
                optionB={{ label: t('card3.option_b'), description: t('card3.option_b_desc') }}
              />
            </Card3D>
          </motion.div>

          {/* Tarjeta 4: Forma moderna (sin toggle — solo informativa) */}
          <motion.div variants={cardVariant}>
            <Card3D
              intensity={8}
              style={{
                backgroundColor: 'var(--ocean-deep)',
                borderRadius: '16px',
                padding: '1.25rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--ocean-deep)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  marginBottom: '0.75rem',
                }}
              >
                {t('card4.badge')}
              </span>
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                {t('card4.body')}
              </p>
              {/* Decoración: ola subtle en la esquina */}
              <svg
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  opacity: 0.1,
                }}
                width="80"
                height="50"
                viewBox="0 0 80 50"
              >
                <path d="M0 30 C20 10 40 40 60 20 C70 10 80 30 80 30 L80 50 L0 50 Z" fill="white" />
              </svg>
            </Card3D>
          </motion.div>
        </motion.div>
      </div>

      {/* Criatura — windsurf entrando desde la derecha */}
      <Windsurfer
        style={{ position: 'absolute', top: '20%', right: '-5%', zIndex: 20 }}
        enterDelay={0.5}
      />
    </section>
  )
}
