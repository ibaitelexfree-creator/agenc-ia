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
      whileHover="hover"
      className="w-full aspect-square relative flex flex-col justify-between items-center text-center"
      variants={{
        initial: { 
          y: 0, 
          scale: 1,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)',
          borderColor: 'rgba(10, 126, 200, 0.06)',
        },
        hover: {
          y: -14,
          scale: 1.03,
          boxShadow: '0 20px 45px rgba(10, 126, 200, 0.1), 0 4px 12px rgba(10, 126, 200, 0.03)',
          borderColor: 'rgba(10, 126, 200, 0.35)',
          transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(20px)',
        borderRadius: '26px',
        padding: '2.5rem 2rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Icon at the top (with hover bounce/rotation) */}
      <motion.span 
        style={{ fontSize: '3.2rem', display: 'inline-block', lineHeight: 1 }}
        variants={{
          initial: { y: 0, rotate: 0 },
          hover: { 
            y: [0, -8, 0],
            rotate: [0, 6, -6, 0],
            transition: { 
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }
        }}
      >
        {t(`${pillar}.icon`)}
      </motion.span>

      {/* Middle: Title & Description */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'center', margin: '1rem 0' }}>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--ocean-deep)',
            letterSpacing: '-0.02em',
          }}
        >
          {t(`${pillar}.title`)}
        </h3>
        {pillar === 'pillar1' && (
          <div style={{ transform: 'scale(1.05)', marginBottom: '0.25rem' }}>
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
          </div>
        )}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '280px' }}>
          {t(`${pillar}.body`)}
        </p>
      </div>

      {/* Bottom: Learn More button (revealed with smooth fade-up on hover) */}
      <motion.div
        variants={{
          initial: { opacity: 0, y: 15, scale: 0.95 },
          hover: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.3, ease: 'easeOut' } 
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--ocean-bright)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <span>{t('learn_more')}</span>
        <motion.span
          variants={{
            initial: { x: 0 },
            hover: { x: 4, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.4 } }
          }}
        >
          →
        </motion.span>
      </motion.div>
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
          padding: 'clamp(1rem, 2vh, 1.5rem) clamp(1.5rem, 6vw, 4rem)',
          gap: '2.25rem',
          alignContent: 'center',
          maxWidth: '1350px',
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
