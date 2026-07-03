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

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

const pillars = ['pillar1', 'pillar2', 'pillar3'] as const

// Define ocean-inspired card gradients
const CARD_GRADIENTS = {
  pillar1: 'linear-gradient(135deg, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.95) 100%)', // Sky/Light Blue
  pillar2: 'linear-gradient(135deg, rgba(204, 251, 241, 0.95) 0%, rgba(153, 246, 228, 0.95) 100%)', // Mint/Turquoise
  pillar3: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.95) 100%)', // Yellow/Sand
}

function PillarCard({ 
  pillar, 
  i, 
  t, 
  isOpen, 
  onClick 
}: { 
  pillar: 'pillar1' | 'pillar2' | 'pillar3'; 
  i: number; 
  t: any; 
  isOpen: boolean; 
  onClick: () => void; 
}) {
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
      whileHover={isOpen ? undefined : "hover"}
      onClick={onClick}
      className="w-full aspect-square relative flex flex-col justify-between items-center text-center"
      animate={{
        scale: isOpen ? 1.05 : 1,
        y: isOpen ? -10 : 0,
        boxShadow: isOpen
          ? '0 25px 50px rgba(10, 126, 200, 0.2), 0 0 0 3px rgba(10, 126, 200, 0.3)'
          : '0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)',
        borderColor: isOpen ? 'rgba(10, 126, 200, 0.5)' : 'rgba(10, 126, 200, 0.06)',
      }}
      variants={{
        hover: {
          y: -14,
          scale: 1.03,
          boxShadow: '0 20px 45px rgba(10, 126, 200, 0.12), 0 4px 12px rgba(10, 126, 200, 0.03)',
          borderColor: 'rgba(10, 126, 200, 0.35)',
          transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
      style={{
        background: CARD_GRADIENTS[pillar],
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        borderWidth: '2px',
        borderStyle: 'solid',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Decorative Wave SVG Pattern inside card */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '60px',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 C360 120 720 0 1080 60 C1260 90 1380 60 1440 60 L1440 120 L0 120 Z"
          fill="var(--ocean-deep)"
        />
      </svg>

      {/* Icon at the top (with hover float and click pulse variants) */}
      <motion.span 
        style={{ fontSize: '3.4rem', display: 'inline-block', lineHeight: 1, zIndex: 2 }}
        variants={{
          initial: { scale: 1, y: 0, rotate: 0 },
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
        animate={isOpen ? {
          scale: [1, 1.25, 1],
          transition: { duration: 0.4, ease: 'easeInOut' }
        } : undefined}
      >
        {t(`${pillar}.icon`)}
      </motion.span>

      {/* Middle & Bottom Layout wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%', zIndex: 2 }}>
        <h3
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'var(--ocean-deep)',
            letterSpacing: '-0.02em',
            marginTop: '0.75rem',
            marginBottom: '0.25rem',
          }}
        >
          {t(`${pillar}.title`)}
        </h3>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyBetween: 'space-between', flex: 1, width: '100%' }}
            >
              {/* Pillar description */}
              <p style={{ fontSize: '0.9rem', color: 'var(--ocean-deep)', opacity: 0.8, lineHeight: 1.6, maxWidth: '280px', margin: '0.75rem 0', flex: 1, display: 'flex', alignItems: 'center' }}>
                {t(`${pillar}.body`)}
              </p>

              {/* Modern Rounded Learn More Button */}
              <motion.div
                variants={{
                  initial: { scale: 0.95 },
                  hover: { scale: 1.05 }
                }}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '50px',
                  backgroundColor: 'var(--ocean-deep)',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(13, 33, 55, 0.15)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '0.5rem',
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
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%' }}
            >
              {/* Back Content Details */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', margin: '0.5rem 0', flex: 1, justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--ocean-bright)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t(`${pillar}.backTitle`)}
                </span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ocean-deep)', opacity: 0.85 }}>
                  {t(`${pillar}.backSubtitle`)}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflowY: 'auto', maxHeight: '110px', paddingRight: '4px', marginTop: '0.25rem' }}>
                  {t(`${pillar}.backBody`)}
                </p>
              </div>

              {/* Modern Collapse / Volver Button */}
              <div
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '50px',
                  backgroundColor: 'rgba(10, 126, 200, 0.1)',
                  color: 'var(--ocean-bright)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.5rem',
                }}
              >
                <span>← Volver</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function Section4Why() {
  const t = useTranslations('s4')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
          <PillarCard 
            key={pillar} 
            pillar={pillar} 
            i={i} 
            t={t} 
            isOpen={activeIndex === i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          />
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
