# PLAN DE MAGIA — GETXO BELA ESKOLA
> **Documento complementario al Plan de Implementación base.**
> Este plan asume que las Fases 0–8 del plan original están completadas.
> Cada sección aquí es una **capa de encantamiento** que se aplica encima de lo ya construido.
> Ejecutar en orden. No saltar fases. No simplificar nada.

---

## ÍNDICE DE FASES MÁGICAS

| Fase | Nombre | Prioridad |
|------|--------|-----------|
| M1 | Sistema de cursor magnético + aura global | 🔥 Alta |
| M2 | Gradiente oceánico reactivo al scroll | 🔥 Alta |
| M3 | Hero — parallax multicapa + texto scramble + olas 3D | 🔥 Alta |
| M4 | Transiciones entre secciones — dissolve + blur + wave reveal | 🔥 Alta |
| M5 | Sección 2 — tarjetas 3D + image morph + ripple al toggle | 🟡 Media |
| M6 | Sección 3 — SVG path drawing + árbol coreografiado | 🟡 Media |
| M7 | Sección 4 — pilares con shimmer + contadores orquestados | 🟡 Media |
| M8 | CTA final — explosión de partículas + viento dramático | 🟡 Media |
| M9 | Criaturas avanzadas — trails, morphing, reacción al cursor | 🟢 Baja |
| M10 | Micro-magia global — ripples, focus rings, hover states | 🟢 Baja |
| M11 | Modo reducción de movimiento — fallbacks elegantes | 🔥 Alta |

---

## DECISIONES GLOBALES DEL PLAN DE MAGIA

### Nuevas dependencias a instalar

```bash
npm install \
  lottie-react@2.4.0 \
  use-sound@4.0.1
```

> `lottie-react` para animaciones de ilustración complejas en el CTA.
> `use-sound` para efectos de sonido opcionales (deshabilitados por defecto, activables).

### Tabla de efectos nuevos — valores exactos para Framer Motion

| Efecto | Configuración exacta | Dónde se usa |
|--------|----------------------|--------------|
| Parallax lento | `useTransform(scrollYProgress, [0,1], ['0%', '-25%'])` | Capas de imagen en Hero |
| Parallax medio | `useTransform(scrollYProgress, [0,1], ['0%', '-45%'])` | Capa de texto en Hero |
| Spring magnético | `stiffness: 400, damping: 30, mass: 0.5` | Cursor y botones CTA |
| Blur de transición | `filter: blur(0px→12px→0px)`, duration `0.6s` | Cambios de sección |
| Shimmer sweep | `background: linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)`, `translateX: -100%→100%`, `3s repeat` | Badges y contadores |
| Text scramble | 12 chars aleatorios → texto real, 40ms por carácter | Títulos H2 al entrar |
| Path draw SVG | `pathLength: 0→1`, `duration: 1.2`, `ease: 'easeInOut'` | Árbol S3, ruta brújula |
| Card 3D hover | `rotateX: -8→8, rotateY: -8→8`, `perspective: 800px` | Cards S2 y S4 |
| Ripple click | `scale: 0→4`, `opacity: 0.6→0`, `duration: 0.6` | Todos los botones |
| Glow pulse | `boxShadow: 0 0 0 0px → 0 0 24px 8px`, `repeat: Infinity` | CTA coral, badges gold |
| Ocean gradient shift | `background` interpolado en 5 colores según `scrollYProgress` | `body` background |
| Stagger cascade | `staggerChildren: 0.08` con `y: 40→0` + `opacity: 0→1` | Listas de cursos S3 |
| Float perpetuo | `y: [0, -14, 0]`, `duration: 4s`, `ease: easeInOut`, `repeat: Infinity` | Criaturas idle |
| Trail de partículas | 6 partículas con `delay: i * 0.06` siguiendo al cursor sobre criaturas | Pez, gaviota |
| Morph SVG | `d` interpolado entre 2 paths, `duration: 0.8` | Medusa al hover |
| Entrada desde el mar | `y: 80→0`, `opacity: 0→1`, `scale: 0.85→1`, `blur: 8px→0px` | Todos los títulos H2 |

---

## FASE M1 — SISTEMA DE CURSOR MAGNÉTICO + AURA GLOBAL

### M1.1 — Crear `hooks/useMagneticCursor.ts`

Este hook detecta la posición del cursor y expone valores de spring para que los elementos "se atraigan" hacia él.

```typescript
// src/hooks/useMagneticCursor.ts
'use client'

import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect, RefObject } from 'react'

type MagneticOptions = {
  strength?: number    // 0.0 – 1.0 — cuánto se atrae el elemento. Default: 0.4
  radius?: number      // px dentro del cual actúa el campo. Default: 80
}

export function useMagneticCursor<T extends HTMLElement>(
  ref: RefObject<T>,
  options: MagneticOptions = {}
) {
  const { strength = 0.4, radius = 80 } = options

  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)

  const springX = useSpring(magnetX, { stiffness: 400, damping: 30, mass: 0.5 })
  const springY = useSpring(magnetY, { stiffness: 400, damping: 30, mass: 0.5 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        magnetX.set(dx * strength)
        magnetY.set(dy * strength)
      } else {
        magnetX.set(0)
        magnetY.set(0)
      }
    }

    const handleMouseLeave = () => {
      magnetX.set(0)
      magnetY.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, magnetX, magnetY, strength, radius])

  return { x: springX, y: springY }
}
```

### M1.2 — Crear `components/layout/MagicCursor.tsx`

Cursor personalizado — sólo en desktop. Un círculo fluido que sigue al ratón con lag de spring. Desaparece en touch devices.

```typescript
// src/components/layout/MagicCursor.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsMobile } from '@/hooks/useMediaQuery'

export function MagicCursor() {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Cursor exterior — lag suave
  const cursorX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.8 })
  const cursorY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.8 })

  // Punto interior — responde instantáneo
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 40 })
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 40 })

  useEffect(() => {
    if (isMobile) return

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Detectar si hay un elemento clickeable bajo el cursor
      const target = e.target as HTMLElement
      const clickable = target.closest('a, button, [role="button"], input, select')
      setIsPointer(!!clickable)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isMobile, isVisible, mouseX, mouseY])

  if (isMobile || !isVisible) return null

  return (
    <>
      {/* Cursor exterior — el anillo */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? '48px' : '32px',
          height: isPointer ? '48px' : '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(74, 175, 232, 0.6)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transition: 'width 0.3s ease, height 0.3s ease',
        }}
      />
      {/* Punto interior */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--ocean-light)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
```

### M1.3 — Añadir `MagicCursor` al layout

En `src/app/[locale]/layout.tsx`, dentro del `<body>`, antes del `{children}`:

```typescript
// Añadir import:
import { MagicCursor } from '@/components/layout/MagicCursor'

// Añadir dentro del <body>, como primer hijo:
<MagicCursor />
```

También añadir en `globals.css` para ocultar el cursor nativo en desktop:

```css
/* Al final de globals.css */
@media (pointer: fine) {
  /* Solo en dispositivos con puntero preciso (mouse) */
  *, *:hover {
    cursor: none !important;
  }
}
```

### M1.4 — Aplicar efecto magnético a los botones CTA

En `Section1Hero.tsx`, el botón CTA principal usa el hook `useMagneticCursor`. Reemplazar el bloque `<motion.a>` del CTA con:

```typescript
// Añadir al inicio de Section1Hero.tsx:
import { useRef } from 'react'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

// Dentro del componente Section1Hero, antes del return:
const ctaRef = useRef<HTMLAnchorElement>(null)
const { x: ctaMagX, y: ctaMagY } = useMagneticCursor(ctaRef, { strength: 0.5, radius: 90 })

// En el JSX, añadir al <motion.a> del CTA:
// ref={ctaRef}
// style={{ ...(estilos existentes), x: ctaMagX, y: ctaMagY }}
```

---

## FASE M2 — GRADIENTE OCEÁNICO REACTIVO AL SCROLL

### M2.1 — Crear `hooks/useOceanGradient.ts`

El fondo del `<html>` cambia de color gradualmente según en qué sección está el usuario, creando la sensación de navegar bajo el agua.

```typescript
// src/hooks/useOceanGradient.ts
'use client'

import { useMotionValueEvent } from 'framer-motion'
import { useScrollContext } from '@/components/layout/ScrollEngine'
import { useEffect } from 'react'

// Los 5 estados del océano (por sección)
const OCEAN_STATES = [
  // S1 Hero — amanecer dorado sobre el mar
  'linear-gradient(180deg, #0D2137 0%, #1a3a5c 40%, #2d5a8a 100%)',
  // S2 La vela — azul marino brillante
  'linear-gradient(180deg, #001a33 0%, #005B9A 50%, #0A7EC8 100%)',
  // S3 Descubre — turquesa profundo
  'linear-gradient(180deg, #012030 0%, #013d5a 50%, #018a8a 100%)',
  // S4 Por qué — azul medianoche
  'linear-gradient(180deg, #020d1a 0%, #0D2137 50%, #0a4a7a 100%)',
  // CTA — atardecer en el puerto
  'linear-gradient(180deg, #1a0a05 0%, #3d1a0a 40%, #0D2137 100%)',
]

export function useOceanGradient() {
  const { currentSection } = useScrollContext()

  useMotionValueEvent(currentSection, 'change', (sectionIndex) => {
    const idx = Math.min(Math.round(sectionIndex), OCEAN_STATES.length - 1)
    document.documentElement.style.setProperty(
      '--current-ocean-gradient',
      OCEAN_STATES[idx]
    )
  })
}
```

### M2.2 — Añadir variable CSS y transición

En `globals.css`, añadir al bloque `:root`:

```css
:root {
  /* ... variables existentes ... */
  --current-ocean-gradient: linear-gradient(180deg, #0D2137 0%, #1a3a5c 40%, #2d5a8a 100%);
}

html {
  background: var(--current-ocean-gradient);
  transition: background 1.2s ease;
}
```

### M2.3 — Activar el hook en `page.tsx`

Crear un componente wrapper mínimo en `page.tsx` que active el gradiente:

```typescript
// Añadir en page.tsx, nuevo componente:
function OceanGradientActivator() {
  useOceanGradient()
  return null
}

// Y dentro de <ScrollEngine> en el JSX:
<OceanGradientActivator />
```

---

## FASE M3 — HERO: PARALLAX MULTICAPA + TEXT SCRAMBLE + OLAS 3D

### M3.1 — Crear `hooks/useParallaxLayers.ts`

```typescript
// src/hooks/useParallaxLayers.ts
'use client'

import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { RefObject } from 'react'

type ParallaxLayer = {
  speed: number    // 0 = estático, 1 = mueve igual que el scroll, -1 = inverso
}

export function useParallaxLayers(
  containerRef: RefObject<HTMLElement>,
  layers: ParallaxLayer[]
): MotionValue<string>[] {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  return layers.map((layer) =>
    useTransform(scrollYProgress, [0, 1], ['0%', `${-layer.speed * 40}%`])
  )
}
```

### M3.2 — Crear `hooks/useTextScramble.ts`

Efecto que "descifra" el texto revelándolo desde caracteres aleatorios. Activado cuando el elemento entra en viewport.

```typescript
// src/hooks/useTextScramble.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useTextScramble(finalText: string, triggerOnView = true) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [displayText, setDisplayText] = useState(finalText)
  const [isScrambling, setIsScrambling] = useState(false)
  const frameRef = useRef<number>()
  const iterationRef = useRef(0)

  const scramble = () => {
    if (isScrambling) return
    setIsScrambling(true)
    iterationRef.current = 0

    const totalFrames = finalText.length * 4  // 4 frames por carácter
    let frame = 0

    const tick = () => {
      // Calcular cuántos caracteres ya están revelados
      const revealed = Math.floor(frame / 4)

      const scrambled = finalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < revealed) return finalText[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setDisplayText(scrambled)
      frame++

      if (frame <= totalFrames) {
        // 40ms por frame = 4 frames por carácter × 40ms = 160ms por letra
        frameRef.current = window.setTimeout(tick, 40)
      } else {
        setDisplayText(finalText)
        setIsScrambling(false)
      }
    }

    tick()
  }

  useEffect(() => {
    if (triggerOnView && isInView) {
      scramble()
    }
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [isInView, triggerOnView])

  return { ref, displayText, scramble }
}
```

### M3.3 — Crear `components/ui/AnimatedText.tsx` (reemplaza el vacío de la Fase 0)

```typescript
// src/components/ui/AnimatedText.tsx
'use client'

import { motion } from 'framer-motion'
import { useTextScramble } from '@/hooks/useTextScramble'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type AnimatedTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  effect?: 'scramble' | 'fade-up' | 'chars'
  delay?: number
  style?: React.CSSProperties
  className?: string
}

// Efecto "chars" — cada letra entra individualmente
const charVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

export function AnimatedText({
  text,
  as: Tag = 'span',
  effect = 'fade-up',
  delay = 0,
  style,
  className,
}: AnimatedTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { ref: scrambleRef, displayText } = useTextScramble(text)

  // Sin animación si el usuario lo prefiere
  if (prefersReducedMotion) {
    return <Tag style={style} className={className}>{text}</Tag>
  }

  if (effect === 'scramble') {
    return (
      <Tag
        ref={scrambleRef as React.Ref<any>}
        style={{ fontVariantNumeric: 'tabular-nums', ...style }}
        className={className}
      >
        {displayText}
      </Tag>
    )
  }

  if (effect === 'chars') {
    return (
      <Tag style={{ display: 'inline', ...style }} className={className}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i + delay / 0.03}
            variants={charVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    )
  }

  // Default: fade-up
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Tag style={style} className={className}>{text}</Tag>
    </motion.div>
  )
}
```

### M3.4 — Mejorar `Section1Hero.tsx` con parallax multicapa

Dentro de `Section1Hero.tsx`, reemplazar la estructura de imagen por un sistema de 3 capas con velocidades distintas:

```typescript
// Añadir imports en Section1Hero.tsx:
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Dentro del componente, antes del return:
const heroRef = useRef<HTMLElement>(null)
const { scrollYProgress: heroScroll } = useScroll({
  target: heroRef,
  offset: ['start start', 'end start'],
})

// 3 capas de parallax con velocidades distintas
const layer1Y = useTransform(heroScroll, [0, 1], ['0%', '-20%'])   // imagen fondo — mueve lento
const layer2Y = useTransform(heroScroll, [0, 1], ['0%', '-35%'])   // overlay de color
const layer3Y = useTransform(heroScroll, [0, 1], ['0%', '-55%'])   // texto — mueve rápido

// En el JSX, añadir ref={heroRef} al <section> y envolver cada capa en <motion.div style={{ y: layerXY }}>.
// La imagen usa layer1Y, el overlay usa layer2Y, el contenido de texto usa layer3Y.
```

### M3.5 — Ola 3D animada en el hero

Sustituir el componente `WaveSVG` interno en `Section1Hero.tsx` por uno con perspectiva 3D:

```typescript
// Nuevo WaveSVG3D — reemplaza WaveSVG en Section1Hero.tsx
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
        {/* Capa 1 — ola posterior más rápida */}
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
        {/* Capa 2 — ola frontal más lenta */}
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
```

---

## FASE M4 — TRANSICIONES ENTRE SECCIONES: DISSOLVE + BLUR + WAVE REVEAL

### M4.1 — Crear `components/layout/SectionTransitionOverlay.tsx`

Al cambiar de sección, un overlay de ola barre la pantalla. Esto crea la sensación de que las secciones "emergen del mar".

```typescript
// src/components/layout/SectionTransitionOverlay.tsx
'use client'

import { motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollContext } from './ScrollEngine'
import { SCROLL_MAP } from '@/lib/scroll-map'

export function SectionTransitionOverlay() {
  const { scrollYProgress } = useScrollContext()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)

  // Detectar cuando el scroll pasa por un punto de transición
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const isNearTransition = SCROLL_MAP.some((step) => {
      const t = step.scrollEnd
      return Math.abs(progress - t) < 0.015 && t > 0 && t < 1
    })

    if (isNearTransition && !isTransitioning) {
      setIsTransitioning(true)
      setTransitionKey((k) => k + 1)
      setTimeout(() => setIsTransitioning(false), 700)
    }
  })

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={transitionKey}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Ola que barre de abajo hacia arriba */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,126,200,0.25) 0%, rgba(13,33,55,0.5) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### M4.2 — Añadir `SectionTransitionOverlay` en `page.tsx`

```typescript
// Añadir import en page.tsx:
import { SectionTransitionOverlay } from '@/components/layout/SectionTransitionOverlay'

// Dentro de <ScrollEngine>, después de <WindParticles />:
<SectionTransitionOverlay />
```

### M4.3 — Efecto de blur en el canvas durante la transición

En `Canvas.tsx`, añadir un `useMotionValueEvent` que aplica un blur temporal al canvas cuando el scroll se mueve rápidamente:

```typescript
// Añadir en Canvas.tsx:
import { useMotionValueEvent, useVelocity } from 'framer-motion'
import { useState } from 'react'
import { useScrollContext } from './ScrollEngine'

// Dentro del componente Canvas, antes del return:
const { scrollYProgress } = useScrollContext()
const scrollVelocity = useVelocity(scrollYProgress)
const [blurAmount, setBlurAmount] = useState(0)

useMotionValueEvent(scrollVelocity, 'change', (velocity) => {
  // Mapear velocidad de scroll a cantidad de blur: max 6px
  const blur = Math.min(Math.abs(velocity) * 8, 6)
  setBlurAmount(blur)
})

// En el style del <motion.div> del canvas, añadir:
// filter: `blur(${blurAmount}px)`,
// transition: 'filter 0.1s ease',
```

---

## FASE M5 — SECCIÓN 2: TARJETAS 3D + IMAGE MORPH + RIPPLE

### M5.1 — Crear `hooks/use3DCard.ts`

```typescript
// src/hooks/use3DCard.ts
'use client'

import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { RefObject } from 'react'

export function use3DCard(ref: RefObject<HTMLElement>, intensity = 15) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const scale = useSpring(1, { stiffness: 300, damping: 30 })
  const glareOpacity = useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.1, 0.25])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
    scale.set(1.03)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    scale.set(1)
  }

  return {
    rotateX,
    rotateY,
    scale,
    glareOpacity,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}
```

### M5.2 — Crear `components/ui/Card3D.tsx`

Wrapper que convierte cualquier tarjeta en una tarjeta con efecto 3D y destello de luz:

```typescript
// src/components/ui/Card3D.tsx
'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { use3DCard } from '@/hooks/use3DCard'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Card3DProps = {
  children: React.ReactNode
  style?: React.CSSProperties
  intensity?: number
}

export function Card3D({ children, style, intensity = 12 }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { rotateX, rotateY, scale, glareOpacity, onMouseMove, onMouseLeave } = use3DCard(
    ref,
    prefersReducedMotion ? 0 : intensity
  )

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '800px',
        rotateX,
        rotateY,
        scale,
        ...style,
      }}
    >
      {children}

      {/* Capa de destello de luz — sigue al cursor */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%)',
          opacity: glareOpacity,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </motion.div>
  )
}
```

### M5.3 — Actualizar `ExperienceToggle.tsx` para usar `Card3D`

En `Section2Adapts.tsx`, envolver cada `<motion.div variants={cardVariant}>` con `<Card3D>`:

```typescript
// Añadir import en Section2Adapts.tsx:
import { Card3D } from '@/components/ui/Card3D'

// Reemplazar cada <motion.div variants={cardVariant}> por:
<motion.div variants={cardVariant}>
  <Card3D intensity={8}>
    <ExperienceToggle ... />
  </Card3D>
</motion.div>
```

### M5.4 — Crear `hooks/useRipple.ts` — efecto de ola al hacer click

```typescript
// src/hooks/useRipple.ts
'use client'

import { useState, useCallback } from 'react'

type RippleItem = {
  id: number
  x: number
  y: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([])

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  const RippleContainer = () => (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%) scale(0)',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            animation: 'rippleExpand 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )

  return { createRipple, RippleContainer }
}
```

En `globals.css`, añadir el keyframe:

```css
@keyframes rippleExpand {
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}
```

### M5.5 — Aplicar `useRipple` a todos los botones interactivos

En `ExperienceToggle.tsx`, añadir `overflow: hidden` al wrapper y usar `createRipple` en los `onClick` de los botones. El `RippleContainer` va dentro del botón como elemento hijo posicionado absolutamente.

---

## FASE M6 — SECCIÓN 3: SVG PATH DRAWING + ÁRBOL COREOGRAFIADO

### M6.1 — Crear `components/decorative/RoutePath.tsx`

SVG animado de la ruta de navegación — se dibuja progresivamente siguiendo el scroll:

```typescript
// src/components/decorative/RoutePath.tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// El path dibuja una ruta curva tipo náutica de S1 → S2 → S3 → S4
const ROUTE_PATH =
  'M 50 450 C 100 400 200 350 300 300 C 400 250 450 200 500 150 C 550 100 600 80 650 60'

export function RoutePath() {
  const ref = useRef<SVGSVGElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1])

  return (
    <svg
      ref={ref}
      viewBox="0 0 700 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.15,
      }}
    >
      {/* Ruta trazada */}
      <motion.path
        d={ROUTE_PATH}
        stroke="var(--ocean-bright)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 6"
        fill="none"
        style={{ pathLength }}
      />

      {/* Puntos de escala en cada sección */}
      {[
        { cx: 50, cy: 450, label: 'S1' },
        { cx: 300, cy: 300, label: 'S2' },
        { cx: 500, cy: 150, label: 'S3' },
        { cx: 650, cy: 60, label: 'S4' },
      ].map((point, i) => (
        <motion.circle
          key={point.label}
          cx={point.cx}
          cy={point.cy}
          r="5"
          fill="var(--ocean-light)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.3, duration: 0.4 }}
        />
      ))}
    </svg>
  )
}
```

### M6.2 — Crear `components/decorative/NauticalCompassRose.tsx`

Rosa de los vientos decorativa que gira lentamente en el fondo de S3:

```typescript
// src/components/decorative/NauticalCompassRose.tsx
'use client'

import { motion } from 'framer-motion'

export function NauticalCompassRose() {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '340px',
        height: '340px',
        opacity: 0.04,
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* N */}
        <path d="M100 5 L107 30 L100 25 L93 30 Z" fill="var(--ocean-deep)" />
        {/* S */}
        <path d="M100 195 L107 170 L100 175 L93 170 Z" fill="var(--ocean-deep)" />
        {/* E */}
        <path d="M195 100 L170 107 L175 100 L170 93 Z" fill="var(--ocean-deep)" />
        {/* W */}
        <path d="M5 100 L30 107 L25 100 L30 93 Z" fill="var(--ocean-deep)" />
        {/* Líneas cardinales */}
        <line x1="100" y1="10" x2="100" y2="190" stroke="var(--ocean-deep)" strokeWidth="1.5" opacity="0.5" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="var(--ocean-deep)" strokeWidth="1.5" opacity="0.5" />
        {/* Líneas diagonales */}
        <line x1="29" y1="29" x2="171" y2="171" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        <line x1="171" y1="29" x2="29" y2="171" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        {/* Círculos concéntricos */}
        <circle cx="100" cy="100" r="60" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="100" r="30" stroke="var(--ocean-deep)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="100" r="8" fill="var(--ocean-deep)" opacity="0.4" />
      </svg>
    </motion.div>
  )
}
```

### M6.3 — Actualizar `Section3Path.tsx` para usar los nuevos decorativos

```typescript
// Añadir imports en Section3Path.tsx:
import { RoutePath } from '@/components/decorative/RoutePath'
import { NauticalCompassRose } from '@/components/decorative/NauticalCompassRose'

// Añadir dentro del <section>, antes del contenido (como primeros hijos):
<RoutePath />
<NauticalCompassRose />
```

### M6.4 — Animación de aparición en cascada para los `CourseCard`

En `Section3Path.tsx`, el array de cursos ya tiene stagger. Mejorar añadiendo que las tarjetas entran con un ligero rotateY inicial (como si se dieran la vuelta desde el mar):

```typescript
// En el bloque de mapeo de courses, reemplazar el <motion.div> wrapper por:
<motion.div
  key={course.key}
  initial={{ opacity: 0, y: 24, rotateY: -15, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
  transition={{
    delay: i * 0.08,
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  }}
  style={{ perspective: '600px' }}
>
  <CourseCard ... />
</motion.div>
```

---

## FASE M7 — SECCIÓN 4: SHIMMER + CONTADORES ORQUESTADOS

### M7.1 — Crear `components/ui/ShimmerBadge.tsx`

Badge con efecto de brillo que barre de izquierda a derecha en bucle. Para el precio "52,5 €/mes".

```typescript
// src/components/ui/ShimmerBadge.tsx
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type ShimmerBadgeProps = {
  children: React.ReactNode
  color?: 'gold' | 'ocean' | 'coral'
}

const colorMap = {
  gold: {
    bg: 'var(--gold)',
    text: 'var(--ocean-deep)',
    shimmer: 'rgba(255,255,255,0.6)',
  },
  ocean: {
    bg: 'var(--ocean-bright)',
    text: 'white',
    shimmer: 'rgba(255,255,255,0.4)',
  },
  coral: {
    bg: 'var(--coral)',
    text: 'white',
    shimmer: 'rgba(255,255,255,0.4)',
  },
}

export function ShimmerBadge({ children, color = 'gold' }: ShimmerBadgeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { bg, text, shimmer } = colorMap[color]

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        backgroundColor: bg,
        color: text,
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: '20px',
        overflow: 'hidden',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}

      {/* Barrido de brillo */}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '60%',
            height: '100%',
            background: `linear-gradient(90deg, transparent 0%, ${shimmer} 50%, transparent 100%)`,
            pointerEvents: 'none',
          }}
          animate={{ translateX: ['-100%', '250%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        />
      )}
    </span>
  )
}
```

### M7.2 — Actualizar `Section4Why.tsx` para usar `ShimmerBadge`

```typescript
// Añadir import en Section4Why.tsx:
import { ShimmerBadge } from '@/components/ui/ShimmerBadge'

// Reemplazar el badge del pillar1 por:
<ShimmerBadge color="gold">
  Desde <CounterNumber from={0} to={52.5} decimals={1} suffix="€/mes" />
</ShimmerBadge>
```

### M7.3 — Crear efecto de "entrada desde el mar" para los pilares

En `Section4Why.tsx`, mejorar la animación de los 3 pilares — cada uno entra como si emergiera del agua:

```typescript
// Reemplazar el <motion.div> de cada pilar por este patrón:
<motion.div
  key={pillar}
  initial={{ opacity: 0, y: 60, filter: 'blur(8px)', scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
  viewport={{ once: true, margin: '-30px' }}
  transition={{
    delay: i * 0.15,
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1],
    filter: { duration: 0.5 },
  }}
  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  style={{
    display: 'flex',
    // ... resto de estilos existentes
  }}
>
```

---

## FASE M8 — CTA FINAL: EXPLOSIÓN DE PARTÍCULAS + VIENTO DRAMÁTICO

### M8.1 — Crear `components/decorative/ParticleExplosion.tsx`

Al hacer hover sobre el CTA, explotan partículas doradas desde el centro del botón.

```typescript
// src/components/decorative/ParticleExplosion.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'

type Particle = {
  id: number
  angle: number   // grados — dirección de la explosión
  distance: number
  size: number
  color: string
}

const COLORS = ['#F5A623', '#4AAFE8', '#ffffff', '#E8593C', '#0A7EC8']

function generateExplosion(count = 16): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + Math.random() * 20 - 10,
    distance: 40 + Math.random() * 50,
    size: 3 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }))
}

export function ParticleExplosion({ children }: { children: React.ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isExploding, setIsExploding] = useState(false)

  const explode = useCallback(() => {
    if (isExploding) return
    setParticles(generateExplosion())
    setIsExploding(true)
    setTimeout(() => {
      setParticles([])
      setIsExploding(false)
    }, 700)
  }, [isExploding])

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={explode}
    >
      {children}

      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180
          const targetX = Math.cos(rad) * p.distance
          const targetY = Math.sin(rad) * p.distance

          return (
            <motion.span
              key={p.id}
              aria-hidden="true"
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: targetX, y: targetY, scale: 0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: p.color,
                pointerEvents: 'none',
                zIndex: 20,
              }}
            />
          )
        })}
      </AnimatePresence>
    </span>
  )
}
```

### M8.2 — Aplicar `ParticleExplosion` en `CTASection.tsx`

```typescript
// Añadir import en CTASection.tsx:
import { ParticleExplosion } from '@/components/decorative/ParticleExplosion'

// Envolver el botón CTA:
<ParticleExplosion>
  <motion.a href={t('href')} ...>
    {t('button')}
  </motion.a>
</ParticleExplosion>
```

### M8.3 — Crear `components/decorative/DramaticWind.tsx`

Para el CTA final, viento más intenso con partículas de 3 tamaños y una línea de horizonte tensa:

```typescript
// src/components/decorative/DramaticWind.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type WindLine = {
  id: number
  y: number
  width: number
  duration: number
  delay: number
  opacity: number
}

export function DramaticWind() {
  const [lines, setLines] = useState<WindLine[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setLines(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        y: Math.random() * 100,
        width: 20 + Math.random() * 80,
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 3,
        opacity: 0.06 + Math.random() * 0.12,
      }))
    )
  }, [])

  if (prefersReducedMotion || lines.length === 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {lines.map((line) => (
        <motion.div
          key={line.id}
          style={{
            position: 'absolute',
            top: `${line.y}%`,
            height: '1px',
            width: `${line.width}px`,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '1px',
            opacity: line.opacity,
          }}
          animate={{
            x: ['-10vw', '110vw'],
            opacity: [0, line.opacity, line.opacity, 0],
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
```

---

## FASE M9 — CRIATURAS AVANZADAS: TRAILS, MORPHING, REACCIÓN AL CURSOR

### M9.1 — Crear `hooks/useCreatureTrail.ts`

Las criaturas dejan una estela de partículas al moverse:

```typescript
// src/hooks/useCreatureTrail.ts
'use client'

import { useState, useCallback, useRef } from 'react'

type TrailDot = {
  id: number
  x: number
  y: number
}

export function useCreatureTrail(maxDots = 6) {
  const [trail, setTrail] = useState<TrailDot[]>([])
  const counterRef = useRef(0)

  const addDot = useCallback((x: number, y: number) => {
    const id = counterRef.current++
    setTrail((prev) => {
      const next = [...prev, { id, x, y }]
      return next.slice(-maxDots)
    })
    setTimeout(() => {
      setTrail((prev) => prev.filter((d) => d.id !== id))
    }, 600)
  }, [maxDots])

  return { trail, addDot }
}
```

### M9.2 — Mejorar `Fish.tsx` con trail de burbujas

```typescript
// Añadir import en Fish.tsx:
import { useCreatureTrail } from '@/hooks/useCreatureTrail'
import { motion, AnimatePresence } from 'framer-motion'

// Dentro del componente Fish, antes del return:
const { trail, addDot } = useCreatureTrail(5)
const posRef = useRef({ x: 0, y: 0 })

// En el <motion.div> externo, añadir:
// onUpdate={(latest) => {
//   const newX = typeof latest.x === 'number' ? latest.x : 0
//   const newY = typeof latest.y === 'number' ? latest.y : 0
//   if (Math.abs(newX - posRef.current.x) > 5) {
//     addDot(newX, newY)
//     posRef.current = { x: newX, y: newY }
//   }
// }}

// Antes del cierre del return del componente, añadir las burbujas del trail:
<AnimatePresence>
  {trail.map((dot, i) => (
    <motion.div
      key={dot.id}
      aria-hidden="true"
      initial={{ scale: 1, opacity: 0.5 }}
      animate={{ scale: 0, opacity: 0, y: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      style={{
        position: 'absolute',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        border: '1px solid rgba(74, 175, 232, 0.6)',
        left: dot.x,
        top: dot.y,
        pointerEvents: 'none',
      }}
    />
  ))}
</AnimatePresence>
```

### M9.3 — Mejorar `Jellyfish.tsx` con morphing de tentáculos al hover

Añadir `whileHover` al wrapper de la medusa para que al pasar el cursor los tentáculos se contraigan más rápido:

```typescript
// En Jellyfish.tsx, el <motion.div> con el pulso pasa de:
// animate={{ scaleY: [1, 0.85, 1], scaleX: [1, 1.1, 1] }}
// transition={{ duration: 1.8, repeat: Infinity }}

// A:
// animate={{ scaleY: [1, 0.85, 1], scaleX: [1, 1.1, 1] }}
// whileHover={{ scaleY: 0.7, scaleX: 1.2, transition: { duration: 0.2 } }}
// transition={{ duration: 1.8, repeat: Infinity }}
```

### M9.4 — Crear `components/creatures/SeahorseSVG.tsx` — nueva criatura

La caballito de mar aparece en la Sección 4, flotando en la esquina izquierda arriba. No estaba en el plan original.

```typescript
// src/components/creatures/Seahorse.tsx
'use client'

import { motion } from 'framer-motion'

type SeahorseProps = {
  style?: React.CSSProperties
  enterDelay?: number
  color?: string
}

export function Seahorse({ style, enterDelay = 0, color = '#4AAFE8' }: SeahorseProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: -40, rotate: -20 }}
      animate={{ opacity: 0.7, x: 0, rotate: 0 }}
      transition={{ delay: enterDelay, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Flotación en forma de S */}
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="35"
          height="65"
          viewBox="0 0 35 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Cuerpo en forma de S */}
          <path
            d="M20 5 C28 5 32 12 28 18 C24 24 16 24 14 30 C12 36 16 42 20 46 C24 50 22 58 15 60"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {/* Cabeza */}
          <circle cx="20" cy="7" r="5" fill={color} opacity="0.85" />
          {/* Hocico */}
          <path d="M25 5 L32 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Ojo */}
          <circle cx="22" cy="5" r="1.5" fill="white" />
          {/* Aletas animadas */}
          <motion.path
            d="M14 22 C8 20 6 24 10 25"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
            animate={{ d: ['M14 22 C8 20 6 24 10 25', 'M14 22 C9 18 5 22 8 26'] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
          />
          {/* Cola enrollada */}
          <path
            d="M15 60 C8 60 5 65 10 65 C15 65 18 62 15 60"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

---

## FASE M10 — MICRO-MAGIA GLOBAL

### M10.1 — Crear `components/ui/GlowButton.tsx`

Reemplaza el `<motion.a>` del CTA principal con un botón que tiene aura pulsante:

```typescript
// src/components/ui/GlowButton.tsx
'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'
import { useRipple } from '@/hooks/useRipple'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type GlowButtonProps = {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  color?: 'coral' | 'ocean'
  size?: 'md' | 'lg'
  external?: boolean
}

export function GlowButton({
  href,
  onClick,
  children,
  color = 'coral',
  size = 'md',
  external = false,
}: GlowButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { x: magX, y: magY } = useMagneticCursor(ref, { strength: 0.45, radius: 80 })
  const { createRipple, RippleContainer } = useRipple()

  const bgColor = color === 'coral' ? 'var(--coral)' : 'var(--ocean-bright)'
  const glowColor =
    color === 'coral' ? 'rgba(232, 89, 60, 0.5)' : 'rgba(10, 126, 200, 0.5)'

  const padding = size === 'lg' ? '1rem 3rem' : '0.85rem 2.5rem'
  const fontSize = size === 'lg' ? '1.1rem' : '1rem'

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={(e) => {
        createRipple(e as any)
        onClick?.()
      }}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        position: 'relative',
        display: 'inline-block',
        backgroundColor: bgColor,
        color: 'white',
        padding,
        borderRadius: '50px',
        fontSize,
        fontWeight: 700,
        textDecoration: 'none',
        letterSpacing: '0.04em',
        overflow: 'hidden',
        x: magX,
        y: magY,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              boxShadow: [
                `0 4px 20px ${glowColor}`,
                `0 6px 32px ${glowColor}`,
                `0 4px 20px ${glowColor}`,
              ],
            }
      }
    >
      {children}
      <RippleContainer />
    </motion.a>
  )
}
```

### M10.2 — Actualizar `Section1Hero.tsx` y `CTASection.tsx` para usar `GlowButton`

```typescript
// En Section1Hero.tsx, reemplazar el <motion.a> del CTA por:
<GlowButton href="#" color="coral" size="md">
  {t('cta')}
</GlowButton>

// En CTASection.tsx, reemplazar el <motion.a> por:
<GlowButton href={t('href')} color="coral" size="lg" external>
  {t('button')}
</GlowButton>
```

### M10.3 — Crear `components/ui/SectionEyebrow.tsx`

Eyebrow animado reutilizable — la línea decorativa crece desde 0 al entrar:

```typescript
// src/components/ui/SectionEyebrow.tsx
'use client'

import { motion } from 'framer-motion'

type SectionEyebrowProps = {
  text: string
  color?: string
}

export function SectionEyebrow({ text, color = 'var(--ocean-bright)' }: SectionEyebrowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '0.75rem',
      }}
    >
      {/* Línea decorativa que crece */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: '32px',
          height: '2px',
          backgroundColor: color,
          transformOrigin: 'left',
          flexShrink: 0,
        }}
      />
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color,
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}
```

### M10.4 — Actualizar todos los eyebrows en las secciones

En `Section1Hero.tsx`, `Section2Adapts.tsx`, `Section3Path.tsx` y `Section4Why.tsx`, reemplazar los `<p>` de eyebrow por `<SectionEyebrow text={t('eyebrow')} />`.

### M10.5 — Mejorar `CompassNav.tsx` — dot activo con brillo animado

En `CompassNav.tsx`, el dot de la sección activa tiene un aura que pulsa:

```typescript
// En el mapeo de DOT_POSITIONS en CompassNav.tsx, reemplazar el <motion.div> por:
<div style={{ position: 'relative', width: '100%', height: '100%' }}>
  <motion.div
    style={{
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor:
        dot.label === activeSection ? 'var(--ocean-bright)' : 'var(--text-muted)',
      opacity: dot.label === activeSection ? 1 : 0.4,
    }}
  />
  {/* Aura pulsante en el dot activo */}
  {dot.label === activeSection && (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-3px',
        borderRadius: '50%',
        border: '1.5px solid var(--ocean-light)',
      }}
      animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )}
</div>
```

---

## FASE M11 — MODO REDUCCIÓN DE MOVIMIENTO: FALLBACKS ELEGANTES

### M11.1 — Crear `components/layout/ReducedMotionCanvas.tsx`

Para usuarios con `prefers-reduced-motion: reduce`, el canvas NO se mueve. En su lugar, se usa una navegación por anclas con scroll vertical nativo.

```typescript
// src/components/layout/ReducedMotionCanvas.tsx
'use client'

// Este componente reemplaza Canvas.tsx + ScrollEngine.tsx cuando
// el usuario prefiere sin movimiento.
// Las secciones se apilan verticalmente y se navega con scroll normal.

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

export function ReducedMotionCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
      }}
    >
      {children}
    </div>
  )
}

// En page.tsx, detectar y usar el componente adecuado:
// if (prefersReducedMotion) → <ReducedMotionCanvas> en lugar de <ScrollEngine> + <Canvas>
```

### M11.2 — Lógica condicional en `page.tsx`

```typescript
// Modificar LandingPage en page.tsx para detectar el modo:
'use client'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

export default function LandingPage() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div>
        <Prow />
        <LanguageSwitcher />
        {/* Sin WindParticles, sin CompassNav, sin SectionTransitionOverlay */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100vw' }}>
          <Section1Hero />
          <Section2Adapts />
          <Section3Path />
          <Section4Why />
          <CTASection />
        </div>
      </div>
    )
  }

  // Renderizado completo con magia:
  return (
    <ScrollEngine>
      <MagicCursor />
      <OceanGradientActivator />
      <Prow />
      <CompassNav />
      <WindParticles />
      <LanguageSwitcher />
      <SectionTransitionOverlay />
      <Canvas>
        <Section1Hero />
        <Section2Adapts />
        <Section3Path />
        <Section4Why />
      </Canvas>
    </ScrollEngine>
  )
}
```

---

## APÉNDICE M-A — ORDEN DE IMPLEMENTACIÓN MÁGICA

Ejecutar exactamente en este orden. No combinar pasos. Punto de control después de cada fase: `npm run dev` sin errores.

```
M1.1 → M1.2 → M1.3 → M1.4
→ M2.1 → M2.2 → M2.3
→ M3.1 → M3.2 → M3.3 → M3.4 → M3.5
→ M4.1 → M4.2 → M4.3
→ M5.1 → M5.2 → M5.3 → M5.4 → M5.5
→ M6.1 → M6.2 → M6.3 → M6.4
→ M7.1 → M7.2 → M7.3
→ M8.1 → M8.2 → M8.3
→ M9.1 → M9.2 → M9.3 → M9.4
→ M10.1 → M10.2 → M10.3 → M10.4 → M10.5
→ M11.1 → M11.2
```

---

## APÉNDICE M-B — RESUMEN DE ARCHIVOS NUEVOS

| Archivo | Fase | Descripción |
|---------|------|-------------|
| `hooks/useMagneticCursor.ts` | M1 | Atracción magnética de botones al cursor |
| `hooks/useParallaxLayers.ts` | M3 | Capas de parallax multi-velocidad |
| `hooks/useTextScramble.ts` | M3 | Efecto descifrado de texto |
| `hooks/use3DCard.ts` | M5 | Rotación 3D de tarjetas al hover |
| `hooks/useRipple.ts` | M5 | Efecto ola al click en botones |
| `hooks/useCreatureTrail.ts` | M9 | Estela de burbujas tras las criaturas |
| `hooks/useOceanGradient.ts` | M2 | Gradiente de fondo reactivo al scroll |
| `components/layout/MagicCursor.tsx` | M1 | Cursor personalizado con spring |
| `components/layout/SectionTransitionOverlay.tsx` | M4 | Ola de transición entre secciones |
| `components/layout/ReducedMotionCanvas.tsx` | M11 | Fallback sin movimiento |
| `components/ui/AnimatedText.tsx` | M3 | Texto scramble + chars + fade-up |
| `components/ui/Card3D.tsx` | M5 | Wrapper de tarjeta con efecto 3D |
| `components/ui/ShimmerBadge.tsx` | M7 | Badge con barrido de brillo |
| `components/ui/GlowButton.tsx` | M10 | Botón con aura + magnético + ripple |
| `components/ui/SectionEyebrow.tsx` | M10 | Eyebrow con línea animada |
| `components/decorative/RoutePath.tsx` | M6 | Ruta náutica SVG auto-dibujada |
| `components/decorative/NauticalCompassRose.tsx` | M6 | Rosa de vientos giratoria |
| `components/decorative/ParticleExplosion.tsx` | M8 | Explosión de partículas en el CTA |
| `components/decorative/DramaticWind.tsx` | M8 | Líneas de viento en el CTA |
| `components/creatures/Seahorse.tsx` | M9 | Nueva criatura: caballito de mar |

---

## APÉNDICE M-C — CHEQUEO FINAL DE MAGIA

Antes de deploy, verificar visualmente cada efecto:

- [ ] El cursor personalizado aparece en desktop y desaparece en mobile
- [ ] El gradiente de fondo del `<html>` cambia suavemente al cambiar de sección
- [ ] El hero tiene parallax visible entre la imagen y el texto al hacer scroll
- [ ] Los títulos H2 tienen efecto scramble al entrar en viewport
- [ ] Las transiciones de sección tienen la ola de blur visible
- [ ] Las tarjetas de S2 se inclinan en 3D al mover el cursor
- [ ] Los botones tienen efecto ripple al hacer click
- [ ] La ruta SVG de S3 se dibuja progresivamente
- [ ] Los pilares de S4 emergen con blur desde abajo
- [ ] El badge de precio tiene el shimmer activo
- [ ] El botón CTA tiene explosión de partículas al hover
- [ ] El viento de la sección CTA tiene líneas de velocidad
- [ ] El cangrejo y el caballito de mar están visibles en S4
- [ ] En `prefers-reduced-motion: reduce` toda la magia se desactiva y la web sigue siendo usable
- [ ] No hay errores de consola en producción
- [ ] El First Load JS no supera 280KB (magia tiene un coste — acceptable)
