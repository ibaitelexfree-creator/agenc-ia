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
    <div
      onClick={onClick}
      className="w-full aspect-square relative"
      style={{
        perspective: '1800px',
        zIndex: isOpen ? 50 : 1,
        cursor: 'pointer',
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
        whileHover={isOpen ? undefined : "hover"}
        animate={{
          y: isOpen ? -10 : 0,
          scale: isOpen ? 1.05 : 1,
          transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }}
      >
        {/* Right Inside Page (Base page of the book) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#faf8f5', // Clean paper texture
            backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            borderRadius: isOpen ? '0 24px 24px 0' : '24px', // Folds at left spine when open
            borderLeft: isOpen ? '2px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(13, 33, 55, 0.08)',
            padding: '2rem 1.75rem',
            borderRight: '1px solid rgba(13, 33, 55, 0.08)',
            borderTop: '1px solid rgba(13, 33, 55, 0.08)',
            borderBottom: '1px solid rgba(13, 33, 55, 0.08)',
            boxShadow: isOpen 
              ? '10px 15px 35px rgba(0, 0, 0, 0.05), inset 10px 0 15px rgba(0,0,0,0.03)' 
              : '0 4px 15px rgba(0,0,0,0.02)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            backfaceVisibility: 'hidden',
            transition: 'border-radius 0.4s ease, border-left 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Subtle Decorative Wave for Inside Page */}
          <svg
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '15px',
              opacity: 0.08,
              pointerEvents: 'none',
            }}
            viewBox="0 0 100 30"
          >
            <path d="M0 15 Q25 0 50 15 T100 15" fill="none" stroke="var(--ocean-deep)" strokeWidth="3" />
          </svg>

          {/* Top: Icon in the opened page header */}
          <motion.span 
            style={{ fontSize: '2.5rem', display: 'inline-block', lineHeight: 1 }}
            animate={isOpen ? {
              scale: [1, 1.2, 1],
              transition: { duration: 0.5, ease: 'easeInOut' }
            } : { scale: 1 }}
          >
            {t(`${pillar}.icon`)}
          </motion.span>

          {/* Middle: Title & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--ocean-bright)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t(`${pillar}.backTitle`)}
            </span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--ocean-deep)', opacity: 0.9, fontFamily: 'Georgia, serif' }}>
              {t(`${pillar}.backSubtitle`)}
            </h4>
            {/* Description fades and appears naturally */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={isOpen ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55, overflowY: 'auto', maxHeight: '110px', paddingRight: '4px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}
            >
              "{t(`${pillar}.backBody`)}"
            </motion.p>
          </div>

          {/* Bottom: Close / Volver link */}
          <div
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              backgroundColor: 'rgba(10, 126, 200, 0.08)',
              color: 'var(--ocean-bright)',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>← Cerrar Diario</span>
          </div>
        </div>

        {/* Rotating cover wrapper (Front Cover & Left Inside Page) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center', // Open spine from left edge
            zIndex: 2,
          }}
          animate={{
            rotateY: isOpen ? -180 : 0, // Swings 180 degrees open
          }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Double-Sided cover - Front Face (Hardcover) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0d2137 0%, #0a7ec8 100%)', // Vibrant Ocean gradients
              borderRadius: '24px',
              padding: '2.25rem 2rem',
              border: '2px solid rgba(212, 175, 55, 0.25)', // Sunset Gold accent
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            {/* Light reflection sweeping across surface on hover */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(110deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 80%)',
                top: 0,
                left: '-100%',
                zIndex: 3,
                pointerEvents: 'none',
              }}
              variants={{
                hover: {
                  left: '200%',
                  transition: { duration: 1.4, ease: 'easeInOut' }
                }
              }}
            />

            {/* Top: Icon (floats on hover) */}
            <motion.span 
              style={{ fontSize: '3.4rem', display: 'inline-block', lineHeight: 1 }}
              variants={{
                initial: { y: 0, rotate: 0 },
                hover: { 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0],
                  transition: { 
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }
              }}
            >
              {t(`${pillar}.icon`)}
            </motion.span>

            {/* Middle: Title & Main Text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.15)',
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
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '280px' }}>
                {t(`${pillar}.body`)}
              </p>
            </div>

            {/* Bottom: Learn More bookmark button */}
            <div
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#ffd700',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
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
            </div>
          </div>

          {/* Double-Sided cover - Back Face (Left Page of open book) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#faf8f5', // Matching paper texture
              backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 0)',
              backgroundSize: '16px 16px',
              borderRadius: '24px 0 0 24px', // Spine folds on right edge when cover swings 180deg
              borderRight: '3px solid rgba(0, 0, 0, 0.12)', // Subtle spine shadow/line
              padding: '2rem 1.75rem',
              borderTop: '1px solid rgba(13, 33, 55, 0.08)',
              borderBottom: '1px solid rgba(13, 33, 55, 0.08)',
              borderLeft: '1px solid rgba(13, 33, 55, 0.08)',
              boxShadow: '-10px 15px 35px rgba(0, 0, 0, 0.05)',
              transform: 'rotateY(180deg)', // Rotated so it aligns as left page when open
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Compass / Sailing log illustration for visual immersion */}
            <span style={{ fontSize: '3rem', opacity: 0.75 }}>📖</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ocean-deep)', fontFamily: 'Georgia, serif', marginTop: '1.25rem', letterSpacing: '-0.01em' }}>
              Diario de a bordo
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: '0.5rem', maxWidth: '200px', lineHeight: 1.4 }}>
              "El mar une los destinos que la tierra separa."
            </p>
            {/* Subtle Decorative Wave at bottom left page */}
            <svg
              style={{
                width: '60px',
                height: '15px',
                opacity: 0.1,
                pointerEvents: 'none',
                marginTop: '1.25rem'
              }}
              viewBox="0 0 100 30"
            >
              <path d="M0 15 Q25 0 50 15 T100 15" fill="none" stroke="var(--ocean-deep)" strokeWidth="3" />
            </svg>
          </div>
        </motion.div>

        {/* Soft glowing ocean-blue border highlight on the active book */}
        {isOpen && (
          <motion.div
            layoutId="activeBorderGlow"
            className="absolute -inset-1 pointer-events-none rounded-[26px]"
            style={{
              border: '2.5px solid rgba(10, 126, 200, 0.5)',
              boxShadow: '0 0 20px rgba(10, 126, 200, 0.25)',
              zIndex: 3,
            }}
          />
        )}
      </motion.div>
    </div>
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
