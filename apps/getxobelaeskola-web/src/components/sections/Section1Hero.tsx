// src/components/sections/Section1Hero.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Seagull } from '@/components/creatures/Seagull'
import { Fish } from '@/components/creatures/Fish'
import { GlowButton } from '@/components/ui/GlowButton'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

// Variantes de animación de entrada
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function Section1Hero() {
  const t = useTranslations('s1')
  
  // Parallax Setup
  const heroRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress: heroScroll } = useScroll({
    target: mounted ? heroRef : undefined,
    offset: ['start start', 'end start'],
  })

  // 3 capas de parallax con velocidades distintas
  const layer1Y = useTransform(heroScroll, [0, 1], ['0%', '15%'])   // imagen fondo — mueve lento
  const layer2Y = useTransform(heroScroll, [0, 1], ['0%', '25%'])   // overlay de color
  const layer3Y = useTransform(heroScroll, [0, 1], ['0%', '35%'])   // texto — mueve rápido

  return (
    <section
      ref={heroRef}
      style={{
        gridArea: 's1',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Capa 1: Imagen de fondo — fotograma del Abra (con parallax) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer1Y,
          width: '100%',
          height: '100%',
        }}
      >
        <Image
          src="/images/ai/hero-deck-getxo.webp"
          alt="Vista desde cubierta del velero en el Abra de Getxo"
          fill
          priority
          quality={85}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </motion.div>

      {/* Capa 2: Overlay gradiente oscuro (con parallax) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer2Y,
          background: 'linear-gradient(to bottom, rgba(13,33,55,0.2) 0%, rgba(13,33,55,0.75) 100%)',
          zIndex: 2,
        }}
      />

      {/* Ola decorativa animada en la parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          overflow: 'hidden',
          zIndex: 3,
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

      {/* Capa 3: Contenido principal — centrado en el viewport (con parallax rápido) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '-30px' }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '800px',
          color: 'var(--white)',
          y: layer3Y,
        }}
      >
        {/* Eyebrow — ubicación */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <SectionEyebrow text={t('eyebrow')} color="var(--ocean-light)" />
        </motion.div>

        {/* Logo / Nombre de la escuela */}
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
          <LogoGBE />
        </motion.div>

        {/* Título principal */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--white)',
            marginBottom: '1.25rem',
          }}
        >
          {t('title')}
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '560px',
            margin: '0 auto 2rem',
          }}
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA con atracción magnética */}
        <motion.div variants={itemVariants}>
          <GlowButton href="#" color="coral" size="md">
            {t('cta')}
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* Criaturas animadas — pasan detrás del contenido */}
      <Seagull
        style={{ position: 'absolute', top: '15%', right: '-10%', zIndex: 8 }}
        enterDelay={1.5}
        direction="left"
      />
      <Fish
        style={{ position: 'absolute', bottom: '18%', left: '-8%', zIndex: 8 }}
        enterDelay={2.0}
        direction="right"
        size="small"
      />
    </section>
  )
}

// ── Componente interno: logo GBE ───────────────────────────────────────────────
function LogoGBE() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M18 4 L4 28 L18 26 Z" fill="white" opacity="0.9" />
        <path d="M18 8 L32 28 L18 26 Z" fill="white" opacity="0.5" />
        <line x1="4" y1="30" x2="32" y2="30" stroke="white" strokeWidth="2" />
      </svg>
      <span
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'white',
        }}
      >
        Getxo Bela Eskola
      </span>
    </div>
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
