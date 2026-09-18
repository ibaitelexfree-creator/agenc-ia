'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export type ParchmentEffectType =
  | 'home-10'
  | 'home-11'
  | 'home-12'
  | 'home-13'
  | 'classic'
  | 'cylindrical'
  | 'spring'
  | 'none'

interface ParchmentWrapperProps {
  variant?: ParchmentEffectType
  children: React.ReactNode
  isExpanded?: boolean
  _hasCourses?: boolean
}

export function ParchmentWrapper({
  variant = 'none',
  children,
  isExpanded = false,
  _hasCourses = false,
}: ParchmentWrapperProps) {
  if (variant === 'none') {
    return <>{children}</>
  }

  const isHome10 = variant === 'home-10'
  const isHome11 = variant === 'home-11'
  const isHome12 = variant === 'home-12'
  const isHome13 = variant === 'home-13'
  const isParchmentSuite = isHome10 || isHome11 || isHome12 || isHome13
  const isCylindrical = isParchmentSuite || variant === 'cylindrical'

  // 1. Anchura: En Home 10, 11, 12 y 13 es tan ancho como la pantalla (100vw)
  const isFullWidth = isParchmentSuite || variant === 'classic'
  const widthClasses = isFullWidth
    ? 'w-full max-w-[100vw] px-0'
    : 'w-full max-w-4xl px-3 sm:px-6'

  // 2. Eliminación de cajas amarillas / bordes pesados en toda la suite moderna
  const noYellowBox = isParchmentSuite

  // 3. Muelle ultra suave de Home 13 como base ganadora para todos
  const containerTransition = isHome12
    ? { type: 'spring' as const, stiffness: 45, damping: 20, mass: 1.8 }
    : { type: 'spring' as const, stiffness: 35, damping: 24, mass: 2.2 }

  const rollerTransition = isHome12
    ? { type: 'spring' as const, stiffness: 45, damping: 20, mass: 1.8 }
    : { type: 'spring' as const, stiffness: 35, damping: 24, mass: 2.2 }

  const topRollerAnimate = isCylindrical
    ? { rotateX: isExpanded ? -15 : 0 }
    : { y: 0 }

  const bottomRollerAnimate = isCylindrical
    ? { rotateX: isExpanded ? 15 : 0 }
    : { y: 0 }

  // 4. Variantes de sombra en el rodillo superior sobre el mapa:
  // Home 10: Sombra estándar de referencia
  // Home 11: Variante 1 - Sombra atenuada al 25% (micro-sombra)
  // Home 12: Variante 2 - Sombra eliminada (drop-shadow: none)
  // Home 13: Variante 3 - Sombra eliminada al 100% y sin relieve (plano inmaculado)
  const topRollerShadow = 
    variant === 'home-12' || variant === 'home-13' ? '' :
    variant === 'home-11' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]' :
    'drop-shadow-[0_4px_10px_rgba(0,0,0,0.22)]'

  const bottomRollerShadow = 
    variant === 'home-12' || variant === 'home-13' ? '' :
    variant === 'home-11' ? 'drop-shadow-[0_-2px_4px_rgba(0,0,0,0.06)]' :
    'drop-shadow-[0_-4px_10px_rgba(0,0,0,0.22)]'

  return (
    <div
      className={`relative mx-auto flex flex-col items-center justify-center my-0 select-none transition-all duration-300 ${widthClasses}`}
      style={{
        perspective: isCylindrical ? '1200px' : undefined,
      }}
    >
      {/* ========================================================================= */}
      {/* 1. RODILLO PERGAMINO SUPERIOR (Tan ancho como la pantalla)                */}
      {/* ========================================================================= */}
      <motion.div
        layout
        animate={topRollerAnimate}
        transition={rollerTransition}
        className="relative z-30 w-full"
      >
        <div className={`relative w-full h-8 sm:h-10 md:h-12 lg:h-14 ${topRollerShadow}`}>
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="/images/parchment/pergamino-superior-sm.webp"
              type="image/webp"
            />
            <Image
              src="/images/parchment/pergamino-superior.webp"
              alt="Pergamino náutico superior"
              fill
              priority
              sizes="100vw"
              className="object-fill pointer-events-none"
            />
          </picture>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. CUERPO DEL PERGAMINO                                                   */}
      {/* ========================================================================= */}
      <motion.div
        layout
        transition={containerTransition}
        className={`relative w-full overflow-hidden flex flex-col items-center ${
          noYellowBox ? '' : 'shadow-[inset_0_0_40px_rgba(180,140,90,0.15)]'
        }`}
        style={{
          transformStyle: isCylindrical ? 'preserve-3d' : undefined,
          // Manera de fondo interior:
          // Home 10: Blanco Cristalino Minimalista (#FFFFFF)
          // Home 11: Fondo totalmente transparente sobre el blanco puro con mapa náutico
          // Home 12: Fondo blanco puro (#FFFFFF) con sombra sutil perimetral
          // Home 13: Fondo blanco cristalino (#FFFFFF) directo sin sombras ni bordes
          backgroundColor: isHome11 ? 'transparent' : '#FFFFFF',
          borderLeft: noYellowBox ? 'none' : '2px solid rgba(190, 155, 110, 0.4)',
          borderRight: noYellowBox ? 'none' : '2px solid rgba(190, 155, 110, 0.4)',
          boxShadow: isHome12 ? '0 10px 30px -10px rgba(0, 32, 64, 0.08)' : undefined
        }}
      >
        {/* ================================================================= */}
        {/* FONDO DEL MAPA / PERGAMINO: 3 POSIBILIDADES SIN FONDO BEIGE       */}
        {/* ================================================================= */}

        {/* POSIBILIDAD 1 (Home 11): PERGAMINO.png con fondo extraído por canal alpha (recorte puro de papel) */}
        {isHome11 && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/parchment/pergamino-cuerpo-transparent.png"
              alt="Cuerpo del pergamino sin fondo"
              fill
              quality={95}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        {/* POSIBILIDAD 2 (Home 12 y Home 10): PERGAMINO.png original directo con mix-blend-multiply sobre blanco puro (elimina 100% el fondo plano convirtiéndolo en blanco inmaculado) */}
        {(isHome12 || isHome10) && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/parchment/pergamino-png-original.png"
              alt="Pergamino original sobre blanco"
              fill
              quality={95}
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        )}

        {/* POSIBILIDAD 3 (Home 13): PERGAMINO.png con filtro de contraste/brillo balanceado que funde a blanco absoluto los tonos de fondo beige */}
        {isHome13 && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Image
              src="/images/parchment/pergamino-png-original.png"
              alt="Pergamino blanco cristalino sin fondo"
              fill
              quality={95}
              sizes="100vw"
              className="object-cover"
              style={{
                filter: 'brightness(1.06) contrast(1.08)',
                mixBlendMode: 'multiply'
              }}
            />
          </div>
        )}

        {/* Efecto de luz ambiental cilíndrico en Home 11 y 12 */}
        {isCylindrical && isExpanded && !isHome13 && (
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.25, 0] }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-amber-900/10 via-transparent to-amber-900/10"
          />
        )}

        {/* Contenido: Árbol de opciones de cursos náuticos */}
        <div className="relative z-20 w-full py-4 sm:py-6">
          {children}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. RODILLO PERGAMINO INFERIOR (Tan ancho como la pantalla)                */}
      {/* ========================================================================= */}
      <motion.div
        layout
        animate={bottomRollerAnimate}
        transition={rollerTransition}
        className="relative z-30 w-full"
      >
        <div className={`relative w-full h-8 sm:h-10 md:h-12 lg:h-14 ${bottomRollerShadow}`}>
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="/images/parchment/pergamino-inferior-sm.webp"
              type="image/webp"
            />
            <Image
              src="/images/parchment/pergamino-inferior.webp"
              alt="Pergamino náutico inferior"
              fill
              priority
              sizes="100vw"
              className="object-fill pointer-events-none"
            />
          </picture>
        </div>
      </motion.div>
    </div>
  )
}
