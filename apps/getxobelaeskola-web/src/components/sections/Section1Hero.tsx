// src/components/sections/Section1Hero.tsx
'use client'

import { useRef, useContext, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Seagull } from '@/components/creatures/Seagull'
import { Fish } from '@/components/creatures/Fish'
import { GlowButton } from '@/components/ui/GlowButton'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { ScrollContext } from '@/components/layout/ScrollEngine'
import { BlobCard } from '@/components/blobs/BlobCard'
import { BLOB_PATHS } from '@/data/blobPaths'

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
  const locale = useLocale()
  const scrollCtx = useContext(ScrollContext)
  
  const [videoLoaded, setVideoLoaded] = useState(false)
  
  // Parallax Setup
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: localHeroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  } as any)

  const activeScroll = scrollCtx ? scrollCtx.scrollYProgress : localHeroScroll

  // 3 capas de parallax con velocidades distintas
  // Si hay ScrollContext (V2), la animación ocurre al transicionar entre sección 1 y 2 (0.0 a 0.20)
  const layer1Y = useTransform(
    activeScroll,
    scrollCtx ? [0, 0.20, 1] : [0, 1],
    scrollCtx ? ['0%', '15%', '15%'] : ['0%', '15%']
  )
  const layer2Y = useTransform(
    activeScroll,
    scrollCtx ? [0, 0.20, 1] : [0, 1],
    scrollCtx ? ['0%', '25%', '25%'] : ['0%', '25%']
  )
  const layer3Y = useTransform(
    activeScroll,
    scrollCtx ? [0, 0.20, 1] : [0, 1],
    scrollCtx ? ['0%', '35%', '35%'] : ['0%', '35%']
  )

  const CARDS = [
    {
      title: t('card_cursos_title'),
      subtitle: t('card_cursos_subtitle'),
      color: '#2EC4B6',
      videoSrc: '/videos/cursos_optimized.webm',
      imageSrc: '/images/cursos.jpg',
      paths: BLOB_PATHS.cursos,
      href: `/${locale}/servicios/cursos`,
    },
    {
      title: t('card_club_title'),
      subtitle: t('card_club_subtitle'),
      color: '#F4A623',
      videoSrc: '/videos/club_optimized.webm',
      imageSrc: '/images/club.jpg',
      paths: BLOB_PATHS.clubSocias,
      href: `/${locale}/servicios/socias`,
    },
    {
      title: t('card_equipos_title'),
      subtitle: t('card_equipos_subtitle'),
      color: '#1D6FA4',
      videoSrc: '/videos/equipos_optimized.webm',
      imageSrc: '/images/equipos.jpg',
      paths: BLOB_PATHS.equipos,
      href: `/${locale}/servicios/equipos`,
    },
    {
      title: t('card_udalekuak_title'),
      subtitle: t('card_udalekuak_subtitle'),
      color: '#8B5CF6',
      videoSrc: '/videos/udalekuak_optimized.webm',
      imageSrc: '/images/udalekuak.jpg',
      paths: BLOB_PATHS.udalekuak,
      href: `/${locale}/servicios/udalekuak`,
    },
    {
      title: t('card_entidades_title'),
      subtitle: t('card_entidades_subtitle'),
      color: '#0A0A0A',
      videoSrc: '/videos/entidades_optimized.webm',
      imageSrc: '/images/entidades.jpg',
      paths: BLOB_PATHS.entidades,
      href: `/${locale}/servicios/team-building`,
    },
  ]

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
      {/* Capa 1: Cielo (con parallax de scroll y balanceo de cámara sincronizado) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer1Y,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, 10, 0, -10, 0],
            x: [0, -3, 0, 3, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/images/home/parallax/cielo extendido v2.jpeg?v=3"
            alt="Cielo Abra de Getxo"
            style={{
              position: 'absolute',
              inset: '-20px',
              width: 'calc(100% + 40px)',
              height: 'calc(100% + 40px)',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1,
            }}
          />
          <video
            src="/images/home/parallax/Fluffy_clouds_drifting_across_sky_202606160528.mp4"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            style={{
              position: 'absolute',
              inset: '-20px',
              width: 'calc(100% + 40px)',
              height: 'calc(100% + 40px)',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 2,
              opacity: videoLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Capa 2: Costa y mar (con parallax de scroll, escala y balanceo sincronizado de oleaje) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer2Y,
          width: '100%',
          height: '100%',
          zIndex: 2,
          scale: 1.015,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, 18, 0, -18, 0],
            x: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/images/home/parallax/tierra.png?v=3"
            alt="Costa y mar del Abra de Getxo"
            style={{
              position: 'absolute',
              inset: '-10px',
              width: 'calc(100% + 20px)',
              height: 'calc(100% + 20px)',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Capa 3: Velero (con parallax de scroll y balanceo de cabeceo contrario al mar) */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: layer3Y,
          width: '100%',
          height: '100%',
          zIndex: 3,
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', position: 'relative' }}
          animate={{
            y: [0, -35, 0, 35, 0],
            x: [0, 6, 0, -6, 0],
            rotate: [0, 0.8, 0, -0.8, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/images/home/parallax/velero.png?v=3"
            alt="Velero navegando en Getxo"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Overlay gradiente oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,33,55,0.1) 0%, rgba(13,33,55,0.7) 100%)',
          zIndex: 4,
          pointerEvents: 'none',
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
          zIndex: 5,
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

      {/* Contenido principal — centrado y elevado para evitar colisión */}
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
          marginTop: '-180px',
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

      {/* Los 5 blobs interactivos alineados en fila al pie del Hero */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 40px)',
          padding: '0 24px',
          zIndex: 15,
        }}
      >
        {CARDS.map((card) => (
          <BlobCard key={card.title} {...card} />
        ))}
      </div>

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
