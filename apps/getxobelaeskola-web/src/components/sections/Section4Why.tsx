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
      initial={{ opacity: 0, y: 60, filter: 'blur(8px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: false, margin: '-30px' }}
      transition={{
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -8,
        boxShadow: isFlipped 
          ? '0 16px 32px rgba(10, 126, 200, 0.25)' 
          : '0 12px 30px rgba(0, 0, 0, 0.08)',
        transition: { duration: 0.3 }
      }}
      className="w-full aspect-square relative"
      style={{
        zIndex: isFlipped ? 10 : 1,
        borderRadius: '20px',
        boxShadow: isFlipped 
          ? '0 8px 24px rgba(10, 126, 200, 0.15)' 
          : '0 4px 20px rgba(0, 0, 0, 0.04)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* 3D card structure (visuals only, pointerEvents: none prevents flickering) */}
      <div
        className="flip-card-inner"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          pointerEvents: 'none',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Front Side */}
        <div
          className="flip-card-front"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            backgroundColor: 'var(--white)',
            borderRadius: '20px',
            padding: '1.75rem',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            height: '100%',
            width: '100%',
          }}
        >
          {/* Top: Icon */}
          <span style={{ fontSize: '2.5rem', flexShrink: 0, lineHeight: 1, marginTop: '0.25rem' }}>
            {t(`${pillar}.icon`)}
          </span>

          {/* Middle: Heading and description */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--ocean-deep)',
              }}
            >
              {t(`${pillar}.title`)}
            </h3>
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
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {t(`${pillar}.body`)}
            </p>
          </div>

          {/* Bottom: Learn More link */}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ocean-bright)', textDecoration: 'underline', marginBottom: '0.25rem' }}>
            {t('learn_more')} →
          </span>
        </div>

        {/* Back Side */}
        <div
          className="flip-card-back"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            backgroundColor: 'var(--ocean-deep)',
            color: 'var(--white)',
            borderRadius: '20px',
            padding: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            height: '100%',
            width: '100%',
          }}
        >
          {/* Top: Icon */}
          <span style={{ fontSize: '2.5rem', flexShrink: 0, lineHeight: 1, marginTop: '0.25rem' }}>
            {t(`${pillar}.icon`)}
          </span>

          {/* Middle: Heading and description */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center' }}>
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
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.4,
                overflowY: 'auto',
                paddingRight: '4px',
                marginTop: '0.25rem',
              }}
            >
              {t(`${pillar}.backBody`)}
            </p>
          </div>

          {/* Bottom: Back side indicator */}
          <span style={{ fontSize: '0.8rem', opacity: 0.7, textDecoration: 'underline', marginBottom: '0.25rem' }}>
            ← Volver
          </span>
        </div>
      </div>

      {/* 2D Flat Hover Shield (handles all interactions safely) */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        className="flip-card-container"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          borderRadius: '20px',
        }}
      />
    </motion.div>
  )
}

export function Section4Why() {
  const t = useTranslations('s4')

  return (
    <section
      style={{
        gridArea: 's5',
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{
          flex: 1,
          padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1.5rem, 5vw, 3rem)',
          gap: '1.5rem',
          alignContent: 'center',
          maxWidth: '1200px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
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
