'use client'

import React from 'react'

export type S3ToS4CurveVariant = 'home-3' | 'home-4' | 'home-5' | 'home-6' | 'home-7' | 'home-8' | 'home-9' | 'home-10' | 'home-11' | 'home-12' | 'home-13' | string

interface Section3To4CurvedExtensionProps {
  variant: S3ToS4CurveVariant
}

export function Section3To4CurvedExtension({ variant }: Section3To4CurvedExtensionProps) {
  // Se renderiza para las variantes home-3 a home-13
  const isSupported = ['home-3', 'home-4', 'home-5', 'home-6', 'home-7', 'home-8', 'home-9', 'home-10', 'home-11', 'home-12', 'home-13'].includes(variant)
  if (!isSupported) {
    return null
  }

  // Estrategias de eliminación de la mini-sombra de 3px entre Sección 3 y la curva beige de Sección 4:
  // Home 4: Base original
  // Home 5 (Método 1): Sin drop-shadow CSS ni sombra difusa interna
  // Home 6 (Método 2): Solape negativo vertical (-3px hacia arriba) para fusionar el empalme
  // Home 7 (Método 3): Sellado geométrico SVG (comienza en -4px hacia arriba, limpio sin capas translúcidas)
  // Home 8-13 (Método 4): Fusión perfecta: Sin sombras, sin filtros, extendido -4px hacia arriba y con tono beige puro continuo

  const isHome5 = variant === 'home-5'
  const isHome6 = variant === 'home-6'
  const isHome7 = variant === 'home-7'
  const isHome8 = ['home-8', 'home-9', 'home-10', 'home-11', 'home-12', 'home-13'].includes(variant)

  const topOffset = isHome6 ? '-3px' : isHome8 ? '-4px' : '0px'
  const dropShadowClass = (isHome5 || isHome7 || isHome8) ? '' : 'drop-shadow-[0_8px_18px_rgba(0,18,38,0.18)]'

  return (
    <>
      <div
        className="absolute right-0 z-10 pointer-events-none select-none overflow-visible w-[84%] sm:w-[86%] lg:w-[56%] s3-s4-extension-curve"
        style={{ top: topOffset }}
        aria-hidden="true"
      >
        {/* ========================================================================= */}
        {/* CURVA BEIGE SUPERIOR DERECHA (SECCIÓN 4 PROLONGANDO SECCIÓN 3)            */}
        {/* ========================================================================= */}
        <div className="w-full relative h-[60px] sm:h-[125px] lg:h-[150px]">
          <svg
            viewBox="0 0 600 150"
            preserveAspectRatio="none"
            className={`w-full h-full block overflow-visible ${dropShadowClass}`}
          >
            {/* Estela náutica translúcida (omitida en Home 7 y Home 8 para máxima limpieza) */}
            {!isHome7 && !isHome8 && (
              <path
                d={isHome6 || isHome8 ? "M 0,-4 L 0,4 C 35,70 120,128 245,108 C 345,88 465,132 600,70 L 600,-4 Z" : "M 0,-2 L 0,4 C 35,70 120,128 245,108 C 345,88 465,132 600,70 L 600,-2 Z"}
                fill="rgba(246, 242, 236, 0.28)"
              />
            )}

            {/* Sombra difusa marina (omitida en Home 5, 7 y 8 para evitar la sombra de 3px) */}
            {!isHome5 && !isHome7 && !isHome8 && (
              <path
                d="M 0,-2 L 0,5 C 25,62 105,118 230,98 C 330,78 450,122 600,59 L 600,-2 Z"
                fill="rgba(8, 25, 45, 0.24)"
                filter="blur(5px)"
              />
            )}

            {/* Masa beige principal continua que empalma con la Sección 3 */}
            <path
              d={isHome7 || isHome8 ? "M 0,-6 L 0,0 C 25,58 105,112 230,92 C 330,72 450,118 600,54 L 600,-6 Z" : "M 0,-1 L 0,0 C 25,58 105,112 230,92 C 330,72 450,118 600,54 L 600,-1 Z"}
              fill="#F6F2EC"
            />
          </svg>
        </div>
      </div>
      <style jsx>{`
        @media (max-height: 420px) {
          .s3-s4-extension-curve {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}