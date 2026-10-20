'use client'

import React from 'react'

export type WaveBorderVariant = 'home-1' | 'home-2' | 'home-3' | 'home-4' | string

interface Section4TopWaveBorderProps {
  variant?: WaveBorderVariant
}

export function Section4TopWaveBorder({ variant = 'home-1' }: Section4TopWaveBorderProps) {
  // La variante ganadora elegida por el usuario es 'home-1' (doble espesor hacia arriba con ondulación fluida viva).
  // Se aplica como diseño definitivo tanto a 'home-1' como a la home principal ('home-12' o default).
  const isTargetVariant = ['home-1', 'home-2', 'home-3', 'home-4', 'home-12'].includes(variant) || !variant
  if (!isTargetVariant) {
    return null
  }

  // =========================================================================
  // BASADO EN EL GANADOR (HOME 4): ONDULACIÓN Y FLUCTUACIÓN BÉZIER PURA
  // - Todo el espesor extra crece HACIA ARRIBA invadiendo el vídeo superior,
  //   haciendo la franja beige claramente visible y gorda.
  // - Los extremos permanecen anclados y la forma no sube/baja en bloque:
  //   solo ondea el oleaje líquido interno con amplitud reforzada.
  // - 4 variaciones progresivas de espesor hacia arriba:
  //   * Home 1: Doble de espesor hacia arriba (dTop = -0.16)
  //   * Home 2: Doble + extra moderado hacia arriba (dTop = -0.26)
  //   * Home 3: Doble + extra generoso hacia arriba (dTop = -0.36)
  //   * Home 4: Gran cresta prominente hacia arriba (dTop = -0.48)
  // =========================================================================

  let pathA = ''
  let pathB = ''
  let pathC = ''
  let duration = '5s'

  if (variant === 'home-2') {
    pathA = 'M 0,0.190 C 0.28,-0.150 0.52,0.452 0.75,0.125 C 0.88,0.012 0.95,0.616 1,1 L 1,1 C 0.95,0.769 0.88,0.365 0.75,0.467 C 0.52,0.728 0.28,0.203 0,0.510 Z'
    pathB = 'M 0,0.190 C 0.28,-0.040 0.52,0.320 0.75,0.180 C 0.88,0.100 0.95,0.550 1,1 L 1,1 C 0.95,0.725 0.88,0.420 0.75,0.500 C 0.52,0.640 0.28,0.280 0,0.510 Z'
    pathC = 'M 0,0.190 C 0.28,0.081 0.52,0.221 0.75,0.235 C 0.88,0.199 0.95,0.495 1,1 L 1,1 C 0.95,0.681 0.88,0.486 0.75,0.533 C 0.52,0.574 0.28,0.368 0,0.510 Z'
    duration = '5.0s'
  } else if (variant === 'home-3') {
    pathA = 'M 0,0.090 C 0.28,-0.270 0.52,0.376 0.75,0.015 C 0.88,-0.104 0.95,0.578 1,1 L 1,1 C 0.95,0.785 0.88,0.365 0.75,0.471 C 0.52,0.754 0.28,0.199 0,0.520 Z'
    pathB = 'M 0,0.090 C 0.28,-0.140 0.52,0.220 0.75,0.080 C 0.88,0.000 0.95,0.500 1,1 L 1,1 C 0.95,0.733 0.88,0.430 0.75,0.510 C 0.52,0.650 0.28,0.290 0,0.520 Z'
    pathC = 'M 0,0.090 C 0.28,0.003 0.52,0.103 0.75,0.145 C 0.88,0.117 0.95,0.435 1,1 L 1,1 C 0.95,0.680 0.88,0.508 0.75,0.549 C 0.52,0.572 0.28,0.394 0,0.520 Z'
    duration = '4.8s'
  } else if (variant === 'home-4') {
    pathA = 'M 0,-0.030 C 0.28,-0.410 0.52,0.280 0.75,-0.115 C 0.88,-0.240 0.95,0.530 1,1 L 1,1 C 0.95,0.800 0.88,0.365 0.75,0.475 C 0.52,0.780 0.28,0.195 0,0.530 Z'
    pathB = 'M 0,-0.030 C 0.28,-0.260 0.52,0.100 0.75,-0.040 C 0.88,-0.120 0.95,0.440 1,1 L 1,1 C 0.95,0.740 0.88,0.440 0.75,0.520 C 0.52,0.660 0.28,0.300 0,0.530 Z'
    pathC = 'M 0,-0.030 C 0.28,-0.095 0.52,-0.035 0.75,0.035 C 0.88,0.015 0.95,0.365 1,1 L 1,1 C 0.95,0.680 0.88,0.530 0.75,0.565 C 0.52,0.570 0.28,0.420 0,0.530 Z'
    duration = '4.5s'
  } else {
    // Ganador Home 1: aplicado por defecto y en home-12 (la home principal)
    pathA = 'M 0,0.290 C 0.28,-0.030 0.52,0.528 0.75,0.235 C 0.88,0.128 0.95,0.654 1,1 L 1,1 C 0.95,0.754 0.88,0.365 0.75,0.463 C 0.52,0.702 0.28,0.207 0,0.500 Z'
    pathB = 'M 0,0.290 C 0.28,0.060 0.52,0.420 0.75,0.280 C 0.88,0.200 0.95,0.600 1,1 L 1,1 C 0.95,0.718 0.88,0.410 0.75,0.490 C 0.52,0.630 0.28,0.270 0,0.500 Z'
    pathC = 'M 0,0.290 C 0.28,0.159 0.52,0.339 0.75,0.325 C 0.88,0.281 0.95,0.555 1,1 L 1,1 C 0.95,0.681 0.88,0.464 0.75,0.517 C 0.52,0.576 0.28,0.342 0,0.500 Z'
    duration = '5.2s'
  }

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none overflow-visible" aria-hidden="true">
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="w-full h-full block overflow-visible"
      >
        <path
          d={pathB}
          fill="#F6F2EC"
        >
          <animate
            attributeName="d"
            dur={duration}
            repeatCount="indefinite"
            values={`${pathB};${pathA};${pathC};${pathB}`}
            keyTimes="0;0.35;0.7;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </path>
      </svg>
    </div>
  )
}
