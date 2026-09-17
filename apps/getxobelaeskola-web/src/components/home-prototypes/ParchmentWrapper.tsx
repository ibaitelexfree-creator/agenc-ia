'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export type ParchmentEffectType = 'classic' | 'cylindrical' | 'spring' | 'none'

interface ParchmentWrapperProps {
  variant?: ParchmentEffectType
  children: React.ReactNode
  triggerKey?: string | number
  onToggleRoll?: () => void
}

export function ParchmentWrapper({
  variant = 'none',
  children,
  triggerKey,
  onToggleRoll,
}: ParchmentWrapperProps) {
  const [isManualRolled, setIsManualRolled] = useState(false)
  const [pulseCounter, setPulseCounter] = useState(0)

  // Disparar animación de enrollado / desenrollado al cambiar de paso (nivel/perfil)
  useEffect(() => {
    if (triggerKey !== undefined && triggerKey !== null) {
      setPulseCounter((prev) => prev + 1)
    }
  }, [triggerKey])

  if (variant === 'none') {
    return <>{children}</>
  }

  const handleRollClick = () => {
    setIsManualRolled((prev) => !prev)
    setPulseCounter((prev) => prev + 1)
    onToggleRoll?.()
  }

  // Animaciones según variante
  const getContentAnimation = () => {
    if (isManualRolled) {
      return {
        scaleY: 0.05,
        opacity: 0,
        height: '0px',
        overflow: 'hidden',
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
      }
    }

    if (variant === 'classic') {
      return {
        scaleY: [0.93, 1],
        opacity: [0.75, 1],
        transition: {
          duration: 0.65,
          ease: [0.25, 1, 0.5, 1] as const,
        },
      }
    }

    if (variant === 'cylindrical') {
      return {
        rotateX: [12, -4, 0],
        scale: [0.96, 1],
        opacity: [0.8, 1],
        transition: {
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      }
    }

    // Spring
    return {
      scale: [0.92, 1.025, 0.99, 1],
      y: [-10, 4, -1, 0],
      opacity: [0.7, 1],
      transition: {
        type: 'spring' as const,
        stiffness: 280,
        damping: 18,
        mass: 0.9,
      },
    }
  }

  const getTopRollerAnimation = () => {
    if (variant === 'cylindrical') {
      return {
        rotateX: isManualRolled ? 180 : [0, -40, 10, 0],
        y: isManualRolled ? 20 : [0, -4, 0],
      }
    }
    if (variant === 'spring') {
      return {
        y: isManualRolled ? 20 : [-6, 3, 0],
        scale: isManualRolled ? 0.98 : [1, 1.015, 1],
      }
    }
    // Classic
    return {
      y: isManualRolled ? 20 : [-4, 2, 0],
    }
  }

  const getBottomRollerAnimation = () => {
    if (variant === 'cylindrical') {
      return {
        rotateX: isManualRolled ? -180 : [0, 40, -10, 0],
        y: isManualRolled ? -20 : [0, 4, 0],
      }
    }
    if (variant === 'spring') {
      return {
        y: isManualRolled ? -20 : [6, -3, 0],
        scale: isManualRolled ? 0.98 : [1, 1.015, 1],
      }
    }
    // Classic
    return {
      y: isManualRolled ? -20 : [4, -2, 0],
    }
  }

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center my-2 select-none"
      style={{
        perspective: variant === 'cylindrical' ? '1200px' : undefined,
      }}
    >
      {/* Barra de Rodillo Pergamino Superior - Altura muy estrecha */}
      <motion.div
        key={`top-${pulseCounter}-${isManualRolled}`}
        animate={getTopRollerAnimation()}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onClick={handleRollClick}
        role="button"
        tabIndex={0}
        aria-label={isManualRolled ? 'Desenrollar pergamino' : 'Enrollar pergamino'}
        className="relative z-30 w-full max-w-[960px] px-2 sm:px-4 cursor-pointer group"
        title="Haz clic para enrollar / desenrollar el pergamino"
      >
        <div className="relative w-full h-7 sm:h-9 md:h-11 lg:h-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-[1.008]">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="/images/parchment/pergamino-superior-sm.webp"
              type="image/webp"
            />
            <Image
              src="/images/parchment/pergamino-superior.webp"
              alt="Pergamino náutico superior enrollado"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
              className="object-fill sm:object-cover pointer-events-none"
            />
          </picture>

          {/* Indicador interactivo flotante sutil */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0D2137]/80 text-[#D4AF37] text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm pointer-events-none shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <span>📜</span>
            <span>{isManualRolled ? 'Clic para desenrollar' : 'Clic para enrollar'}</span>
          </div>
        </div>
      </motion.div>

      {/* Cuerpo del Pergamino que se Enrolla / Desenrolla */}
      <div className="relative w-full overflow-hidden flex flex-col items-center">
        <motion.div
          key={`content-${pulseCounter}-${isManualRolled}`}
          animate={getContentAnimation()}
          style={{
            transformOrigin: 'top center',
            transformStyle: variant === 'cylindrical' ? 'preserve-3d' : undefined,
          }}
          className="relative w-full flex flex-col items-center"
        >
          {/* Luz/Sombra ambiental sobre el papel náutico */}
          {variant === 'cylindrical' && (
            <motion.div
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.45, 0] }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-amber-900/15 via-transparent to-amber-900/15"
            />
          )}

          {variant === 'spring' && (
            <motion.div
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-20 pointer-events-none ring-2 ring-[#0A7EC8]/30 rounded-xl"
            />
          )}

          {/* Contenido envuelto (Sección de Cursos y Línea Náutica) */}
          <div className="relative w-full">{children}</div>
        </motion.div>
      </div>

      {/* Si está enrollado manualmente, banner de aviso para reabrir */}
      <AnimatePresence>
        {isManualRolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleRollClick}
            className="my-4 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2b] text-[#0D2137] font-bold text-sm rounded-full shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>📜</span>
            <span>Desenrollar carta de navegación</span>
            <span>⚓</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Barra de Rodillo Pergamino Inferior - Altura muy estrecha */}
      <motion.div
        key={`bot-${pulseCounter}-${isManualRolled}`}
        animate={getBottomRollerAnimation()}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onClick={handleRollClick}
        role="button"
        tabIndex={0}
        aria-label={isManualRolled ? 'Desenrollar pergamino' : 'Enrollar pergamino'}
        className="relative z-30 w-full max-w-[960px] px-2 sm:px-4 cursor-pointer group"
        title="Haz clic para enrollar / desenrollar el pergamino"
      >
        <div className="relative w-full h-7 sm:h-9 md:h-11 lg:h-12 drop-shadow-[0_-4px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-[1.008]">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="/images/parchment/pergamino-inferior-sm.webp"
              type="image/webp"
            />
            <Image
              src="/images/parchment/pergamino-inferior.webp"
              alt="Pergamino náutico inferior enrollado"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
              className="object-fill sm:object-cover pointer-events-none"
            />
          </picture>

          {/* Indicador interactivo inferior */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0D2137]/80 text-[#D4AF37] text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm pointer-events-none shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <span>📜</span>
            <span>{isManualRolled ? 'Clic para desenrollar' : 'Clic para enrollar'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
