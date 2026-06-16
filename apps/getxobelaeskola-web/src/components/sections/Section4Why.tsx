// src/components/sections/Section4Why.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CounterNumber } from '@/components/ui/CounterNumber'
import { Crab } from '@/components/creatures/Crab'
import { Seahorse } from '@/components/creatures/Seahorse'
import { ShimmerBadge } from '@/components/ui/ShimmerBadge'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

import { useState } from 'react'

const pillars = ['pillar1', 'pillar2', 'pillar3'] as const

function PillarCard({ pillar, i, t }: { pillar: 'pillar1' | 'pillar2' | 'pillar3'; i: number; t: any }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      initial={{ opacity: 0, y: 60, filter: 'blur(8px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: false, margin: '-30px' }}
      transition={{
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="flip-card-container"
      style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        cursor: 'pointer',
        minHeight: '110px',
        zIndex: isFlipped ? 10 : 1,
      }}
    >
      <div
        className="flip-card-inner"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <div
          className="flip-card-front"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            backgroundColor: 'var(--foam)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(10, 126, 200, 0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            overflow: 'hidden',
          }}
        >
          {/* Icono emoji */}
          <span style={{ fontSize: '1.8rem', flexShrink: 0, lineHeight: 1 }}>
            {t(`${pillar}.icon`)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--ocean-deep)',
                }}
              >
                {t(`${pillar}.title`)}
              </h3>
              {/* Badge especial con Shimmer y contador animado */}
              {pillar === 'pillar1' && (
                <ShimmerBadge color="gold">
                  Desde{' '}
                  <CounterNumber
                    from={0}
                    to={52.5}
                    suffix="€/mes"
                    prefix=""
                    decimals={1}
                  />
                </ShimmerBadge>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {t(`${pillar}.body`)}
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="flip-card-back"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            backgroundColor: 'var(--ocean-deep)',
            color: 'var(--white)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(10, 126, 200, 0.15)',
            overflow: 'hidden',
          }}
        >
          {/* Icono emoji */}
          <span style={{ fontSize: '1.8rem', flexShrink: 0, lineHeight: 1 }}>
            {t(`${pillar}.icon`)}
          </span>
          <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '0.35rem' }}>
              <h3
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--ocean-bright)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1.1,
                }}
              >
                {t(`${pillar}.backTitle`)}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, lineHeight: 1.2 }}>
                {t(`${pillar}.backSubtitle`)}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.4,
                overflowY: 'auto',
                paddingRight: '4px',
                flex: 1,
              }}
            >
              {t(`${pillar}.backBody`)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Section4Why() {
  const t = useTranslations('s4')

  return (
    <section
      style={{
        gridArea: 's4',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* Seahorse — floating creature on the upper left corner */}
      <Seahorse
        style={{ position: 'absolute', top: '18%', left: '4%', zIndex: 15 }}
        enterDelay={0.5}
      />

      {/* Imagen superior */}
      <div style={{ position: 'relative', height: '40%', overflow: 'hidden' }}>
        <Image
          src="/images/ai/section4-community.webp"
          alt="Comunidad de vela en Getxo"
          fill
          quality={80}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13,33,55,0.25) 0%, #ffffff 90%)',
          }}
        />
        {/* Título flotando sobre la imagen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: 'clamp(1.5rem, 5vw, 3rem)',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-bright)" />
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--ocean-deep)',
              lineHeight: 1.2,
            }}
          >
            {t('title')}
          </h2>
        </motion.div>
      </div>

      {/* Los 3 pilares */}
      <div
        style={{
          flex: 1,
          padding: 'clamp(1rem, 3vh, 1.5rem) clamp(1.5rem, 5vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        {pillars.map((pillar, i) => (
          <PillarCard key={pillar} pillar={pillar} i={i} t={t} />
        ))}
      </div>

      {/* Cangrejo — criatura de la esquina */}
      <Crab
        style={{ position: 'absolute', bottom: '3%', right: '10%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
