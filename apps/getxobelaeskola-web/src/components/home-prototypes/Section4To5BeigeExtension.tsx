'use client'

import React, { useEffect, useRef } from 'react'

export type S4ToS5BeigeTransitionVariant = 'home-10' | 'home-11' | 'home-12' | 'home-13' | 'none' | string

interface Section4To5BeigeExtensionProps {
  variant?: S4ToS5BeigeTransitionVariant
}

export function Section4To5BeigeExtension({ variant = 'none' }: Section4To5BeigeExtensionProps) {
  // =========================================================================
  // Ondas Trocoidales Gerstner (Estandarizadas desde Home 13 ganadora)
  // Espectro marino turbulento con rebote en extremos y física de oleaje continuo
  // =========================================================================
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (variant !== 'home-10' && variant !== 'home-11' && variant !== 'home-12' && variant !== 'home-13') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    // Algoritmo ganador de Home 13 para todas
    const waves = [
      { a: 16, k: 0.0055, w: 1.4, dir: 1, phase: 0 },
      { a: 12, k: 0.0092, w: 2.1, dir: -1, phase: 1.2 },
      { a: 9,  k: 0.0145, w: 3.0, dir: 1, phase: 2.7 },
      { a: 7,  k: 0.0210, w: 3.8, dir: -1, phase: 0.8 },
      { a: 5,  k: 0.0350, w: 5.2, dir: 1, phase: 4.1 },
    ]

    // Velocidad del agua de Home 13 (ultra pausada, majestuosa y relajante) estandarizada para las 4 (Home 10, 11, 12, 13)
    const speed = 0.0018

    // Colores de la ola según el fondo:
    // Home 10, 11, 12, 13: Blanco Puro Cristalino (#FFFFFF) detrás del mapa
    const isWhiteVariant = variant === 'home-10' || variant === 'home-11' || variant === 'home-12' || variant === 'home-13'
    const solidFillColor = isWhiteVariant ? '#FFFFFF' : '#F6F2EC'
    const translucentFillColor = isWhiteVariant 
      ? 'rgba(255, 255, 255, 0.45)'
      : 'rgba(246, 242, 236, 0.42)'

    const renderGerstner = () => {
      t += speed
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const baselineY = h * 0.50
      const steps = 180

      // Capa previa de marea translúcida
      ctx.beginPath()
      ctx.moveTo(0, h)
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w
        let dy = 0
        for (const wave of waves) {
          const angle = wave.k * x * wave.dir + wave.w * t + wave.phase
          dy += wave.a * Math.sin(angle)
        }
        const y = baselineY + dy * 0.65 - 12
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fillStyle = translucentFillColor
      ctx.fill()

      // Masa principal blanca o beige continua con amplificación en bordes
      ctx.beginPath()
      ctx.moveTo(0, h)
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w
        let dy = 0
        for (const wave of waves) {
          const angle = wave.k * x * wave.dir + wave.w * t + wave.phase
          dy += wave.a * Math.sin(angle)
        }
        const edgeFactor = 1 + 0.35 * Math.pow(Math.abs(x - w / 2) / (w / 2), 2)
        const y = baselineY + dy * edgeFactor
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fillStyle = solidFillColor
      ctx.fill()

      animId = requestAnimationFrame(renderGerstner)
    }

    animId = requestAnimationFrame(renderGerstner)
    return () => cancelAnimationFrame(animId)
  }, [variant])

  if (variant !== 'home-10' && variant !== 'home-11' && variant !== 'home-12' && variant !== 'home-13') {
    return null
  }

  // Variantes de sombra encima del mapa adyacente a él:
  // Home 10: Sombra suave de referencia
  // Home 11: Variante 1 - Sombra atenuada al mínimo (micro-sombra difusa apenas perceptible)
  // Home 12: Variante 2 - Sombra 100% eliminada (cero sombra, borde puro)
  // Home 13: Variante 3 - Sombra 100% eliminada + fusión perfecta anti-reborde (clean flat blend)
  const shadowClass = 
    variant === 'home-12' ? '' :
    variant === 'home-13' ? '' :
    variant === 'home-11' ? 'drop-shadow-[0_-3px_8px_rgba(0,18,38,0.05)]' :
    'drop-shadow-[0_-7px_18px_rgba(0,18,38,0.13)]'

  // Calibración perfecta del agua: อยู่ที่ขอบล่างพอดี ไม่ล้ำซ้อนทับการ์ด
  const waterOffsetY = '-82%'

  return (
    <div
      className="absolute top-0 left-0 right-0 w-full pointer-events-none select-none z-20 overflow-visible s4-s5-wave-extension"
      style={{
        transform: `translateY(${waterOffsetY})`,
        transition: 'transform 0.4s ease'
      }}
      aria-hidden="true"
    >
      <div className="w-full relative h-[120px] sm:h-[160px] lg:h-[200px]">
        <canvas
          ref={canvasRef}
          width={1440}
          height={200}
          className={`w-full h-full block overflow-visible ${shadowClass}`}
        />
      </div>
    </div>
  )
}
