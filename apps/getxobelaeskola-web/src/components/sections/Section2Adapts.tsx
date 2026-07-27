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
  const tAdapts = useTranslations('s3_adapts')
  const [experienceType, setExperienceType] = useState<'a' | 'b'>('a')
  const [scenarioType, setScenarioType] = useState<'a' | 'b'>('a')
  const [boatType, setBoatType] = useState<'a' | 'b'>('a')

  // La imagen cambia según el tipo de experiencia seleccionado
  const bgImage = experienceType === 'a'
    ? '/images/ai/section2-calm-bay.webp'
    : '/images/ai/section2-action-sea.webp'

  const experienceKey = experienceType === 'a' ? 'calm' : 'action'
  const scenarioKey = scenarioType === 'a' ? 'int' : 'ext'
  const boatKey = boatType === 'a' ? 'small' : 'big'
  const comboKey = `combo_${experienceKey}_${scenarioKey}_${boatKey}` as const

  return (
    <section
      style={{
        gridArea: 's3',
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
          viewport={{ once: false, margin: '-50px' }}
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t('subtitle')}
          </p>
          <motion.div
            key={comboKey}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(10, 126, 200, 0.08)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--ocean-bright)',
              display: 'inline-block',
            }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ocean-deep)' }}>
              {tAdapts(comboKey as any)}
            </span>
          </motion.div>
        </motion.div>

        {/* Grid de 4 tarjetas toggle */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-30px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Tarjeta 1: Tipo de experiencia */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(10, 126, 200, 0.12)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ borderRadius: '16px' }}
          >
            <ExperienceToggle
              label={t('card1.label')}
              optionA={{ label: t('card1.option_a'), description: t('card1.option_a_desc') }}
              optionB={{ label: t('card1.option_b'), description: t('card1.option_b_desc') }}
              onToggle={setExperienceType}
            />
          </motion.div>

          {/* Tarjeta 2: El escenario */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(10, 126, 200, 0.12)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ borderRadius: '16px' }}
          >
            <ExperienceToggle
              label={t('card2.label')}
              optionA={{ label: t('card2.option_a'), description: t('card2.option_a_desc') }}
              optionB={{ label: t('card2.option_b'), description: t('card2.option_b_desc') }}
              onToggle={setScenarioType}
            />
          </motion.div>

          {/* Tarjeta 3: Con quién navegar */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(10, 126, 200, 0.12)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ borderRadius: '16px' }}
          >
            <ExperienceToggle
              label={t('card3.label')}
              optionA={{ label: t('card3.option_a'), description: t('card3.option_a_desc') }}
              optionB={{ label: t('card3.option_b'), description: t('card3.option_b_desc') }}
              onToggle={setBoatType}
            />
          </motion.div>

          {/* Tarjeta 4: Forma moderna (sin toggle — solo informativa) */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(10, 126, 200, 0.12)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              backgroundColor: 'var(--foam)',
              borderRadius: '16px',
              padding: '1.25rem',
              color: 'var(--ocean-deep)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              border: '1px solid rgba(10, 126, 200, 0.15)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--ocean-bright)',
                color: 'white',
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
                color: 'var(--text-secondary)',
              }}
            >
              {t('card4.body')}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Ola decorativa animada en la parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          overflow: 'hidden',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        {/* Dos capas de ola SVG que se mueven en bucle */}
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: '200%', height: '100%' }}
        >
          <WaveSVG3D opacity={0.4} />
          <WaveSVG3D opacity={0.4} />
        </motion.div>
      </div>

    </section>
  )
}

// ── WaveSVG3D: Ola con perspectiva y ondulación interactiva ────────────────────
function WaveSVG3D({ opacity }: { opacity: number }) {
  return (
    <motion.div
      style={{
        perspective: '200px',
        width: '50%',
        height: '100%',
        flexShrink: 0,
      }}
      animate={{ rotateX: [0, 2, 0, -2, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        {/* Capa 1 — ola posterior */}
        <motion.path
          d="M0 80 C180 40 360 110 540 70 C720 30 900 110 1080 70 C1260 30 1380 90 1440 60 L1440 120 L0 120 Z"
          fill={`rgba(10, 126, 200, ${opacity * 0.5})`}
          animate={{
            d: [
              "M0 80 C180 40 360 110 540 70 C720 30 900 110 1080 70 C1260 30 1380 90 1440 60 L1440 120 L0 120 Z",
              "M0 65 C200 100 400 40 580 80 C760 120 940 50 1120 80 C1280 105 1400 55 1440 75 L1440 120 L0 120 Z",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        {/* Capa 2 — ola frontal */}
        <motion.path
          d="M0 60 C180 20 360 100 540 60 C720 20 900 100 1080 60 C1260 20 1380 90 1440 60 L1440 120 L0 120 Z"
          fill={`rgba(74, 175, 232, ${opacity})`}
          animate={{
            d: [
              "M0 60 C180 20 360 100 540 60 C720 20 900 100 1080 60 C1260 20 1380 90 1440 60 L1440 120 L0 120 Z",
              "M0 75 C220 110 440 30 620 70 C800 110 980 40 1160 70 C1320 95 1410 50 1440 65 L1440 120 L0 120 Z",
            ],
          }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
        />
      </svg>
    </motion.div>
  )
}
