// src/components/sections/Section2Identity.tsx
'use client'

import { useRef, useContext } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { GlowButton } from '@/components/ui/GlowButton'
import { ScrollContext } from '@/components/layout/ScrollEngine'

export function Section2Identity() {
  const t = useTranslations('s2_identity')
  const locale = useLocale()
  const scrollCtx = useContext(ScrollContext)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Vinculamos la animación al scroll de la sección (entre 0.14 y 0.28 del total de scroll si es V2, o local si no)
  const { scrollYProgress: localScroll } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  } as any)

  const activeScroll = scrollCtx ? scrollCtx.scrollYProgress : localScroll

  // Rangos específicos del Scroll Context V2
  // Si estamos usando ScrollContext (V2), la sección 2 se activa de 0.125 a 0.25 (1/8 del scroll total de 800vh)
  const startScrollVal = scrollCtx ? 0.125 : 0.1
  const endScrollVal = scrollCtx ? 0.25 : 0.6

  // Efecto 1: Grayscale a Color en el fondo (1 = gris, 0 = color)
  const grayscaleVal = useTransform(
    activeScroll,
    [startScrollVal, (startScrollVal + endScrollVal) / 2, endScrollVal],
    ['grayscale(100%) contrast(1.1)', 'grayscale(50%) contrast(1.05)', 'grayscale(0%) contrast(1)']
  )

  // Efecto 2: Zoom sutil (Ken Burns)
  const scaleVal = useTransform(
    activeScroll,
    [startScrollVal, endScrollVal],
    [1.08, 1.0]
  )

  // Efecto 3: Opacidad del gradiente del amanecer
  const gradientOpacity = useTransform(
    activeScroll,
    [startScrollVal, endScrollVal],
    [0.75, 0.45]
  )

  const gradientBackground = useMotionTemplate`radial-gradient(circle at center, rgba(0, 27, 58, 0.2) 0%, rgba(0, 27, 58, ${gradientOpacity}) 100%)`

  // Variantes para reveal de texto
  const lineVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as any } 
    }
  }

  const titleWordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.6,
        ease: 'easeOut' as any
      }
    })
  }

  // Generamos polvo de estrellas/partículas mágicas flotando
  const particles = Array.from({ length: 6 })

  return (
    <section
      ref={containerRef}
      style={{
        gridArea: 's2',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--gbe-navy-900)',
      }}
    >
      {/* Fondo cinematográfico reactivo al scroll */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          filter: grayscaleVal,
          scale: scaleVal,
          zIndex: 1,
        }}
      >
        <Image
          src="/images/course-detail-header-sailing.webp"
          alt="Getxo Bela Eskola Comunidad"
          fill
          quality={85}
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        />
      </motion.div>

      {/* Capas de gradientes para contraste y profundidad */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: gradientBackground,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0, 27, 58, 0.3) 0%, rgba(0, 27, 58, 0.7) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Partículas de luz dorada flotando con movimiento infinito */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--gbe-gold)',
            filter: 'blur(1px)',
            opacity: Math.random() * 0.4 + 0.2,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            zIndex: 3,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, Math.random() * -60 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Contenido principal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-100px' }}
        transition={{ staggerChildren: 0.15 }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '850px',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          color: 'var(--gbe-white)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Título de la sección con Shimmer en el logo e historia */}
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: 'var(--gbe-white)',
            marginBottom: '2rem',
            fontFamily: 'var(--gbe-font-display)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ display: 'flex', gap: '0.4em', flexWrap: 'wrap', justifyContent: 'center' }}>
            {t('title_line1').split(' ').map((word, idx) => (
              <motion.span
                key={idx}
                custom={idx}
                variants={titleWordVariants}
                style={{ display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span
            style={{
              display: 'flex',
              gap: '0.4em',
              flexWrap: 'wrap',
              justifyContent: 'center',
              color: 'var(--gbe-gold)',
              textShadow: '0 0 20px rgba(242, 169, 59, 0.25)',
              marginTop: '0.1em',
            }}
          >
            {t('title_line2').split(' ').map((word, idx) => (
              <motion.span
                key={idx}
                custom={idx + 3}
                variants={titleWordVariants}
                style={{ display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h2>

        {/* Separador de Estrella Giratoria */}
        <motion.div
          variants={lineVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            width: '180px',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, var(--gbe-gold-soft), transparent)' }} />
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ color: 'var(--gbe-gold)', fontSize: '1.2rem', display: 'inline-block', filter: 'drop-shadow(0 0 4px var(--gbe-gold))' }}
          >
            ✦
          </motion.span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--gbe-gold-soft), transparent)' }} />
        </motion.div>

        {/* Frases de valores y comunidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          <motion.p
            variants={lineVariants}
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
              lineHeight: 1.6,
              fontWeight: 300,
              maxWidth: '720px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 auto',
            }}
          >
            {t('value1_prefix')}
            <span
              style={{
                color: 'var(--gbe-gold)',
                fontWeight: 600,
                textShadow: '0 0 15px rgba(242, 169, 59, 0.15)',
              }}
            >
              {t('value1_highlight')}
            </span>
          </motion.p>

          <motion.p
            variants={lineVariants}
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
              lineHeight: 1.6,
              fontWeight: 300,
              maxWidth: '720px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 auto',
            }}
          >
            {t.rich('value2', {
              gold: (chunks) => (
                <span
                  style={{
                    color: 'var(--gbe-gold)',
                    fontWeight: 600,
                    textShadow: '0 0 15px rgba(242, 169, 59, 0.15)',
                  }}
                >
                  {chunks}
                </span>
              )
            })}
          </motion.p>
        </div>

        {/* CTA "Leer más" con spring de entrada */}
        <motion.div
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
          }}
        >
          <GlowButton href={`/${locale}/about`} color="ocean" size="md">
            {t('cta')}
          </GlowButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
