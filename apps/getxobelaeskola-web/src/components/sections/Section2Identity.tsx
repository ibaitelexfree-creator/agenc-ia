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
  const startScrollVal = scrollCtx ? 0.125 : 0.1
  const endScrollVal = scrollCtx ? 0.25 : 0.6

  // Efecto 1: En lugar de animar `filter: grayscale`, usaremos una capa oscura que se desvanece
  // para revelar el color, lo cual es miles de veces más rápido en la GPU y evita crashes.
  const colorRevealOpacity = useTransform(
    activeScroll,
    [startScrollVal, endScrollVal],
    [0, 1] // de 0 (gris/oscuro) a 1 (color completo)
  )

  // Efecto 2: Zoom sutil (Ken Burns)
  const scaleVal = useTransform(
    activeScroll,
    [startScrollVal, endScrollVal],
    [1.08, 1.0]
  )

  // Efecto 3: Opacidad del gradiente del amanecer (en lugar de animar el string del gradiente)
  const gradientOverlayOpacity = useTransform(
    activeScroll,
    [startScrollVal, endScrollVal],
    [0.75, 0.45]
  )

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

  // Generamos partículas mágicas flotando (DETERMINISTAS para evitar hydration mismatch)
  const particles = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    size: 3 + (i % 3) * 2,
    opacity: 0.2 + (i % 3) * 0.1,
    left: 10 + i * 14,
    top: 15 + (i % 2 === 0 ? i * 8 : i * -5 + 40),
    yAnim: [0, -30 - (i * 10), 0],
    xAnim: [0, (i % 2 === 0 ? 15 : -15), 0],
    duration: 10 + i,
  }))

  return (
    <section
      ref={containerRef}
      style={{
        gridArea: 's2',
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--gbe-navy-900)',
      }}
    >
      {/* Fondo cinematográfico base (Gris/Desaturado por defecto usando CSS estático) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          scale: scaleVal,
          zIndex: 1,
          filter: 'grayscale(100%) contrast(1.1)', // Capa base gris
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

      {/* Capa de Color (Se revela con el scroll para mejor rendimiento que animar filter) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          scale: scaleVal,
          zIndex: 2,
          opacity: colorRevealOpacity,
        }}
      >
        <Image
          src="/images/course-detail-header-sailing.webp"
          alt=""
          fill
          quality={85}
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Capas de gradientes para contraste y profundidad */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0, 27, 58, 0.2) 0%, rgba(0, 27, 58, 1) 100%)',
          zIndex: 3,
          pointerEvents: 'none',
          opacity: gradientOverlayOpacity, // Animamos la opacidad del div en lugar del string del gradiente
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0, 27, 58, 0.3) 0%, rgba(0, 27, 58, 0.7) 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Partículas de luz dorada flotando con movimiento infinito */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--gbe-gold)',
            filter: 'blur(1px)',
            opacity: p.opacity,
            left: `${p.left}%`,
            top: `${p.top}%`,
            zIndex: 4,
            pointerEvents: 'none',
          }}
          animate={{
            y: p.yAnim,
            x: p.xAnim,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Contenido principal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-50px' }}
        transition={{ staggerChildren: 0.15 }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '850px',
          padding: '0 clamp(1rem, 4vw, 3rem)',
          color: 'var(--gbe-white)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Título de la sección con Shimmer en el logo e historia */}
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3.8rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: 'var(--gbe-white)',
            marginBottom: 'clamp(0.5rem, 2.5vh, 1.8rem)',
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
            gap: '1rem',
            width: '140px',
            marginBottom: 'clamp(0.8rem, 2vh, 1.8rem)',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, var(--gbe-gold-soft), transparent)' }} />
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ color: 'var(--gbe-gold)', fontSize: '1rem', display: 'inline-block', textShadow: '0 0 4px var(--gbe-gold)' }}
          >
            ✦
          </motion.span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--gbe-gold-soft), transparent)' }} />
        </motion.div>

        {/* Frases de valores y comunidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.5vh, 1.2rem)', marginBottom: 'clamp(1rem, 3vh, 2.2rem)' }}>
          <motion.p
            variants={lineVariants}
            style={{
              fontSize: 'clamp(0.85rem, 2.2vw, 1.35rem)',
              lineHeight: 1.45,
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
              fontSize: 'clamp(0.85rem, 2.2vw, 1.35rem)',
              lineHeight: 1.45,
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
            hidden: { scale: 0.95, opacity: 1 },
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
