# 🌊 Plan de Implementación — Getxo Bela Eskola
### Nueva Sección Hero · Estética Apple × Bonka · Magia total

> **Stack asumido:** Next.js 14 + Tailwind CSS + Framer Motion + GSAP
> **Objetivo:** Sección principal que deje sin palabras. Blanca, limpia, viva.

---

## 🎨 Sistema de Diseño — Token System

```
COLORES
──────────────────────────────────────────────
#FFFFFF   → Fondo base (blanco puro, Apple)
#F7F9FB   → Fondo sección alternas (casi blanco)
#0A0A0A   → Texto principal
#1D6FA4   → Azul mar (acento primario — identidad Getxo)
#F4A623   → Naranja vela (acento secundario — energía)
#2EC4B6   → Verde agua (acento terciario — naturaleza)
#E8EFF5   → Gris hielo (bordes sutiles)

TIPOGRAFÍA
──────────────────────────────────────────────
Display:   "Neue Haas Grotesk" o fallback "DM Sans" — grandes, bold, tracking negativo
Body:      "Inter" 400/500 — neutro, legible
Accent:    "Playfair Display" italic — para palabras clave en titulares (mar, vela...)

ESPACIADO
──────────────────────────────────────────────
Base 8px · Secciones 120px top/bottom · Elementos 32px gap

SIGNATURE ELEMENT ⭐
──────────────────────────────────────────────
Las 5 secciones inferiores se convierten en "charcos orgánicos animados":
formas SVG que respiran (morphing continuo), con video dentro que
se activa al hover (desktop) o al entrar en viewport-center (mobile).
```

---

## 📐 Arquitectura de Componentes

```
/components
  /hero
    HeroSection.tsx          ← Componente raíz
    HeroBackground.tsx       ← Video/imagen de fondo con parallax
    HeroHeadline.tsx         ← Texto animado letra a letra
    HeroCTA.tsx              ← Botón "Hazte socia" con efecto ripple
  /blobs
    BlobSection.tsx          ← Contenedor de los 5 charcos
    BlobCard.tsx             ← Charco individual (SVG morphing + video)
    useBlobMorph.ts          ← Hook para la animación de forma
    useVideoHover.ts         ← Hook para activar video en hover/viewport
  /shared
    ScrollReveal.tsx         ← Wrapper de animaciones de scroll
    MagneticButton.tsx       ← Botón con efecto magnético
```

---

## 🗺️ Mapa Visual de la Página

```
┌─────────────────────────────────────────────────────────┐
│  ░░░░░░░░  HERO FULL VIEWPORT  ░░░░░░░░░░░░░░░░░░░░░░   │
│                                                          │
│   [VIDEO FONDO con overlay gradiente azul 40%]          │
│                                                          │
│   · · · · · · · · · · · · · · · · · · · · · · ·         │
│   Navega.                          ← aparece palabra    │
│   Aprende.                         ← con 200ms delay    │
│   Comparte.                        ← con 400ms delay    │
│   · · · · · · · · · · · · · · · · · · · · · · ·         │
│                                                          │
│   Club de Navegación a Vela en Getxo                    │
│   [subtítulo pequeño, Inter 400]                        │
│                                                          │
│   [ Hazte Socia ↗ ]  ← botón magnético naranja         │
│                                                          │
│   ↓ scroll indicator animado                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ░░░░░░  SECCIÓN CHARCOS (BLOB CARDS)  ░░░░░░░░░░░░░░   │
│                                                          │
│    Fondo: #F7F9FB · Texto encima: "Lo que ofrecemos"   │
│                                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │      │  │      │  │      │  │      │  │      │     │
│  │VIDEO │  │VIDEO │  │VIDEO │  │VIDEO │  │VIDEO │     │
│  │charco│  │charco│  │charco│  │charco│  │charco│     │
│  │      │  │      │  │      │  │      │  │      │     │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘     │
│  CURSOS   CLUB SOCIAS EQUIPOS   UDAL.    ENTIDADES     │
│  [verde]  [naranja]  [azul]    [violeta] [cyan]        │
│                                                          │
│  Cada charco: morphing continuo 4s · video en hover    │
└─────────────────────────────────────────────────────────┘
```

---

# 🔬 FASES DE IMPLEMENTACIÓN ATÓMICAS

---

## FASE 0 — Setup · ⏱ 30 min

### 0.1 · Instalar dependencias

```bash
npm install framer-motion
npm install gsap @gsap/react
npm install @studio-freight/lenis   # scroll suave tipo Bonka
```

### 0.2 · Configurar Lenis (scroll suave global)

```tsx
// app/providers/SmoothScroll.tsx
'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
  return <>{children}</>
}
```

### 0.3 · Añadir fuentes en `layout.tsx`

```tsx
import { DM_Sans, Playfair_Display } from 'next/font/google'
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400','500','700'] })
const playfair = Playfair_Display({ subsets: ['latin'], style: ['italic'] })
```

---

## FASE 1 — Hero Section · ⏱ 2h

### 1.1 · Estructura base del Hero

```tsx
// components/hero/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <HeroBackground />      {/* capa 0: video/imagen */}
      <HeroOverlay />         {/* capa 1: gradiente oscurecedor */}
      <HeroContent />         {/* capa 2: texto + CTA */}
      <ScrollIndicator />     {/* capa 3: flecha animada abajo */}
    </section>
  )
}
```

### 1.2 · Video de fondo con parallax

```tsx
// components/hero/HeroBackground.tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroBackground() {
  const { scrollY } = useScroll()
  // El video se mueve más lento que el scroll → efecto parallax
  const y = useTransform(scrollY, [0, 600], [0, 150])

  return (
    <motion.div style={{ y }} className="absolute inset-0 scale-110">
      <video
        autoPlay muted loop playsInline
        className="w-full h-full object-cover"
        src="/videos/sailing-hero.mp4"
        poster="/images/hero-poster.jpg"   // fallback
      />
    </motion.div>
  )
}
```

**Overlay:** gradiente de izquierda (negro 60%) a derecha (transparente) para legibilidad del texto.

```css
.hero-overlay {
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.65) 0%,
    rgba(10,35,60,0.3) 50%,
    transparent 100%
  );
}
```

### 1.3 · Titular animado — palabras que aparecen en cascada

```tsx
// components/hero/HeroHeadline.tsx
'use client'
import { motion } from 'framer-motion'

const WORDS = ['Navega.', 'Aprende.', 'Comparte.']

export function HeroHeadline() {
  return (
    <div className="flex flex-col gap-2">
      {WORDS.map((word, i) => (
        <motion.span
          key={word}
          className="block text-white font-bold"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1.05 }}
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: 0.3 + i * 0.18,   // cascada: 0.3, 0.48, 0.66s
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1]  // easing expo.out → sensación premium
          }}
        >
          {/* Última palabra en itálica Playfair para diferenciar */}
          {i === 2
            ? <><span className="font-normal italic" style={{ fontFamily: 'Playfair Display' }}>Comparte</span>.</>
            : word
          }
        </motion.span>
      ))}
    </div>
  )
}
```

### 1.4 · Botón CTA con efecto magnético

El botón se "pega" levemente al cursor cuando el ratón pasa cerca (efecto visto en webs como Bonka, Linear).

```tsx
// components/shared/MagneticButton.tsx
'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function MagneticButton({ children, href }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // Desplazamiento máximo 15px — sutil, no mareante
    setPosition({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-block px-8 py-4 rounded-full font-semibold text-white cursor-pointer"
      style={{ background: '#F4A623', fontSize: '1.1rem' }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  )
}
```

### 1.5 · Scroll indicator

```tsx
// Flecha que rebota suavemente indicando que hay más contenido
<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
  className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-70"
>
  ↓
</motion.div>
```

---

## FASE 2 — Charcos Mágicos (BLOB CARDS) · ⏱ 3-4h

Esta es la sección más compleja y espectacular. Cada "charco" es un SVG con una ruta que cambia de forma continuamente (morphing), con el video o imagen dentro recortado por esa forma.

### 2.1 · Cómo funciona el morphing de forma

```
CONCEPTO:
  - Cada charco tiene 2-3 rutas SVG predefinidas (formas orgánicas distintas)
  - Framer Motion o GSAP interpola entre ellas en bucle
  - La imagen/video está recortada usando clipPath que referencia esa forma SVG
  - El morphing es continuo, suave, sin fin → el charco "respira"

HERRAMIENTAS:
  - Para generar las rutas SVG → usar flubber.js (interpolación de paths SVG)
  - O definir manualmente 3 estados de ruta y animar con Framer Motion
```

### 2.2 · Instalar flubber para morphing fluido

```bash
npm install flubber
```

### 2.3 · Definir las 3 formas de cada charco

Cada blob tiene 3 rutas SVG que define su "personalidad". Aquí las formas para CURSOS (ejemplo):

```tsx
// data/blobPaths.ts

export const BLOB_PATHS = {
  cursos: [
    // Estado A — forma de gota hacia la derecha
    "M50,10 C80,5 95,30 90,55 C85,80 65,95 45,90 C25,85 5,70 10,45 C15,20 20,15 50,10Z",
    // Estado B — forma más redondeada
    "M55,8 C85,10 95,35 88,60 C80,85 60,98 35,92 C10,86 3,65 8,40 C13,15 25,6 55,8Z",
    // Estado C — forma más alargada verticalmente
    "M48,5 C75,8 92,28 93,58 C94,88 70,98 42,95 C14,92 2,72 5,45 C8,18 21,2 48,5Z",
  ],
  clubSocias: [ /* ... otras 3 rutas ... */ ],
  equipos:    [ /* ... */ ],
  udalekuak:  [ /* ... */ ],
  entidades:  [ /* ... */ ],
}
```

> 💡 **Truco:** Puedes generar formas orgánicas bonitas en [blobmaker.app](https://blobmaker.app) y copiar el path SVG.

### 2.4 · Componente BlobCard — el charco completo

```tsx
// components/blobs/BlobCard.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { interpolate } from 'flubber'

interface BlobCardProps {
  title: string
  subtitle: string
  color: string         // color del título
  videoSrc: string      // ruta del video
  imageSrc: string      // fallback imagen
  paths: string[]       // las 3 rutas de morphing
  href: string
}

export function BlobCard({ title, subtitle, color, videoSrc, imageSrc, paths, href }: BlobCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [inView, setInView] = useState(false)         // para mobile
  const videoRef = useRef<HTMLVideoElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const clipId = `clip-${title.replace(/\s/g, '')}`

  // ── Morphing continuo del blob ──────────────────────────────
  useEffect(() => {
    let frame: number
    let t = 0
    const SPEED = 0.003   // velocidad del morphing — más bajo = más lento y zen

    // Interpoladores entre pares de formas
    const interp01 = interpolate(paths[0], paths[1], { maxSegmentLength: 4 })
    const interp12 = interpolate(paths[1], paths[2], { maxSegmentLength: 4 })
    const interp20 = interpolate(paths[2], paths[0], { maxSegmentLength: 4 })

    function tick() {
      t += SPEED
      const cycle = t % 3     // 3 segmentos: 0→1, 1→2, 2→0

      let d: string
      if (cycle < 1)      d = interp01(cycle)
      else if (cycle < 2) d = interp12(cycle - 1)
      else                d = interp20(cycle - 2)

      // Actualizar el path del clipPath Y la forma visible del blob
      if (pathRef.current) {
        pathRef.current.setAttribute('d', d)
        // También actualizar el path del clipPath (mismo id)
        document.querySelector(`#${clipId}-path`)?.setAttribute('d', d)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paths, clipId])

  // ── Control de video (hover desktop / viewport-center mobile) ─
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const shouldPlay = isHovered || inView
    if (shouldPlay) {
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered, inView])

  // ── Intersection Observer para mobile ──────────────────────────
  useEffect(() => {
    const card = document.getElementById(`blob-card-${title}`)
    if (!card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // En mobile, activar cuando está al 60% del centro de la pantalla
        setInView(entry.intersectionRatio > 0.6)
      },
      { threshold: [0.6] }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [title])

  return (
    <a
      id={`blob-card-${title}`}
      href={href}
      className="relative flex flex-col items-center gap-4 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── El charco SVG ── */}
      <div className="relative" style={{ width: 200, height: 200 }}>

        {/* DefS: clipPath que usa la misma forma que el blob */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path id={`${clipId}-path`} d={paths[0]} />
            </clipPath>
          </defs>
        </svg>

        {/* Forma visible del blob (con color de fondo) */}
        <svg
          viewBox="0 0 100 100"
          width="200" height="200"
          className="absolute inset-0"
        >
          <motion.path
            ref={pathRef}
            d={paths[0]}
            fill={`${color}22`}    // color con 13% opacidad — tono sutil
            stroke={color}
            strokeWidth="0.8"
          />
        </svg>

        {/* Media dentro del blob: imagen por defecto, video en hover */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `url(#${clipId})` }}
        >
          {/* Imagen base (siempre visible) */}
          <motion.img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ opacity: isHovered || inView ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Video (aparece en hover/viewport) */}
          <motion.video
            ref={videoRef}
            src={videoSrc}
            loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: isHovered || inView ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Shine effect en hover — destello de luz */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
            clipPath: `url(#${clipId})`,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* ── Texto bajo el charco ── */}
      <div className="text-center">
        <motion.p
          className="font-bold tracking-widest text-sm uppercase"
          style={{ color }}
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {title}
        </motion.p>
        {subtitle && (
          <motion.p
            className="text-xs text-gray-500 mt-1"
            animate={{ opacity: isHovered ? 1 : 0.6, y: isHovered ? -2 : 0 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Indicador de "Ver más" que aparece en hover */}
      <motion.span
        className="text-xs font-medium"
        style={{ color }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        Descubrir →
      </motion.span>
    </a>
  )
}
```

### 2.5 · Sección contenedora de los 5 charcos

```tsx
// components/blobs/BlobSection.tsx
'use client'
import { motion } from 'framer-motion'
import { BlobCard } from './BlobCard'
import { BLOB_PATHS } from '@/data/blobPaths'

const CARDS = [
  {
    title: 'Cursos',
    subtitle: 'Aprende a navegar',
    color: '#2EC4B6',
    videoSrc: '/videos/cursos.mp4',
    imageSrc: '/images/cursos.jpg',
    paths: BLOB_PATHS.cursos,
    href: '/cursos',
  },
  {
    title: 'Club Socias',
    subtitle: 'Únete a la comunidad',
    color: '#F4A623',
    videoSrc: '/videos/club.mp4',
    imageSrc: '/images/club.jpg',
    paths: BLOB_PATHS.clubSocias,
    href: '/club',
  },
  {
    title: 'Equipos de Entrenamiento',
    subtitle: 'Compite y supérate',
    color: '#1D6FA4',
    videoSrc: '/videos/equipos.mp4',
    imageSrc: '/images/equipos.jpg',
    paths: BLOB_PATHS.equipos,
    href: '/equipos',
  },
  {
    title: 'Udalekuak',
    subtitle: 'Campamentos de vela',
    color: '#8B5CF6',
    videoSrc: '/videos/udalekuak.mp4',
    imageSrc: '/images/udalekuak.jpg',
    paths: BLOB_PATHS.udalekuak,
    href: '/udalekuak',
  },
  {
    title: 'Entidades',
    subtitle: 'Colabora con nosotros',
    color: '#0A0A0A',
    videoSrc: '/videos/entidades.mp4',
    imageSrc: '/images/entidades.jpg',
    paths: BLOB_PATHS.entidades,
    href: '/entidades',
  },
]

// Animación de entrada escalonada al hacer scroll
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}

export function BlobSection() {
  return (
    <section className="w-full py-32 px-6" style={{ background: '#F7F9FB' }}>
      {/* Eyebrow text */}
      <motion.p
        className="text-center text-xs tracking-widest uppercase text-gray-400 mb-4"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      >
        Todo lo que ofrecemos
      </motion.p>

      {/* Título de sección */}
      <motion.h2
        className="text-center font-bold mb-16 text-gray-900"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Tu mar. Tu club.
      </motion.h2>

      {/* Los 5 charcos */}
      <motion.div
        className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {CARDS.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <BlobCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Nota legal en femenino */}
      <p className="text-center text-xs text-gray-400 mt-16 italic">
        * Todo lo expuesto en "femenino" se refiere a personas
      </p>
    </section>
  )
}
```

---

## FASE 3 — Micro-animaciones adicionales · ⏱ 1.5h

### 3.1 · Cursor personalizado (solo desktop)

Un cursor circular que sigue al ratón y cambia de tamaño sobre elementos interactivos. Refuerza la sensación premium tipo Bonka.

```tsx
// components/shared/CustomCursor.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)

    // Detectar hover sobre elementos clickables
    const links = document.querySelectorAll('a, button')
    links.forEach(el => {
      el.addEventListener('mouseenter', () => setHovered(true))
      el.addEventListener('mouseleave', () => setHovered(false))
    })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      {/* Punto central — sigue exactamente al cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-600 pointer-events-none z-[9999]"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: 'spring', stiffness: 800, damping: 35 }}
      />
      {/* Círculo exterior — sigue con lag → sensación de peso */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-blue-400 pointer-events-none z-[9999]"
        animate={{
          x: pos.x - (hovered ? 24 : 16),
          y: pos.y - (hovered ? 24 : 16),
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          opacity: hovered ? 0.6 : 0.4,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
    </>
  )
}
```

### 3.2 · Texto flotante sobre el hero

Pequeñas palabras que aparecen flotando (olas, viento, vela...) como partículas de texto — efecto muy usado en webs artesanales premium.

```tsx
const FLOATING_WORDS = ['olas', 'viento', 'vela', 'mar', 'Getxo', 'libertad']

// Posiciones aleatorias fijas (para evitar hydration mismatch)
const POSITIONS = [
  { x: '10%', y: '20%', delay: 0 },
  { x: '85%', y: '15%', delay: 0.5 },
  { x: '70%', y: '75%', delay: 1.1 },
  { x: '15%', y: '65%', delay: 0.8 },
  { x: '50%', y: '85%', delay: 1.4 },
  { x: '40%', y: '30%', delay: 0.3 },
]

export function FloatingWords() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FLOATING_WORDS.map((word, i) => (
        <motion.span
          key={word}
          className="absolute text-white/20 text-sm font-light tracking-widest uppercase select-none"
          style={{ left: POSITIONS[i].x, top: POSITIONS[i].y }}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{
            duration: 4 + i * 0.7,
            delay: POSITIONS[i].delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
```

### 3.3 · Contador animado (datos de impacto)

Pequeña franja entre hero y blobs con datos que se incrementan al entrar en viewport:

```
┌─────────────────────────────────────────────────────────┐
│   +500         +20           +30           1984         │
│   Socias    Años de mar    Cursos/año    Fundación      │
└─────────────────────────────────────────────────────────┘
```

```tsx
// Hook para número animado
function useCountUp(target: number, inView: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(easeOut(progress) * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])
  return count
}
```

---

## FASE 4 — Responsive & Accesibilidad · ⏱ 1h

### 4.1 · Mobile: Blob en scroll-center

En móvil el hover no existe. La solución:

```
• IntersectionObserver con threshold 0.6
• Cuando el blob entra en el 60% central de la pantalla → activa el video
• Cuando sale → pausa el video
• El usuario hace scroll y los blobs "se despiertan" uno a uno
```

Esta lógica ya está incluida en el BlobCard (ver sección 2.4, `setInView`).

### 4.2 · Layout responsive de los blobs

```css
/* Mobile: 2 columnas + 1 centrado al final */
.blob-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Desktop: 5 en línea */
@media (min-width: 1024px) {
  .blob-grid { grid-template-columns: repeat(5, 1fr); }
}
```

### 4.3 · Reduced Motion

```tsx
import { useReducedMotion } from 'framer-motion'

// En todos los componentes con animación:
const prefersReduced = useReducedMotion()

<motion.div
  animate={prefersReduced ? {} : { y: [0, -10, 0] }}
  // ...
/>
```

---

## FASE 5 — Assets & Videos · ⏱ 1-2h

### 5.1 · Lista de assets necesarios

```
/public
  /videos
    sailing-hero.mp4        ← Video hero (≤5MB, 1920x1080, H.264)
    cursos.mp4              ← Video para blob Cursos (≤2MB, 400x400, cuadrado)
    club.mp4                ← Video para blob Club Socias
    equipos.mp4             ← Video para blob Equipos
    udalekuak.mp4           ← Video para blob Udalekuak
    entidades.mp4           ← Video para blob Entidades
  /images
    hero-poster.jpg         ← Fallback imagen del hero (para SEO y carga lenta)
    cursos.jpg              ← Imagen estática blob Cursos
    club.jpg                ← Imagen estática blob Club
    equipos.jpg             ← etc.
    udalekuak.jpg
    entidades.jpg
```

### 5.2 · Optimización de video para web

```bash
# Comprimir video hero (mantener calidad, reducir tamaño)
ffmpeg -i hero-original.mp4 \
  -vcodec libx264 -crf 28 -preset slow \
  -vf scale=1920:-2 -movflags +faststart \
  sailing-hero.mp4

# Comprimir videos de blobs (pequeños, bucles cortos)
ffmpeg -i cursos-original.mp4 \
  -vcodec libx264 -crf 30 -preset slow \
  -vf scale=400:400:force_original_aspect_ratio=increase,crop=400:400 \
  -t 8 -movflags +faststart \
  cursos.mp4
```

---

## FASE 6 — Ensamblaje final · ⏱ 30 min

### 6.1 · Página principal

```tsx
// app/page.tsx
import { HeroSection } from '@/components/hero/HeroSection'
import { StatsStrip } from '@/components/sections/StatsStrip'
import { BlobSection } from '@/components/blobs/BlobSection'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { SmoothScroll } from '@/app/providers/SmoothScroll'

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <main>
        <HeroSection />
        <StatsStrip />
        <BlobSection />
      </main>
    </SmoothScroll>
  )
}
```

---

## 📋 Checklist de QA Final

```
□ Video hero se reproduce sin sonido (autoPlay muted)
□ Blobs se cargan con imagen fallback antes del video
□ Morphing es suave en 60fps — sin saltos
□ CustomCursor solo aparece en desktop (CSS: @media hover: hover)
□ En Safari: comprobar clipPath con video (puede necesitar workaround)
□ Lenis no interfiere con formularios ni inputs
□ prefers-reduced-motion deshabilita todas las animaciones
□ Videos blobs se pausan cuando salen del viewport (ahorro de batería)
□ Texto del hero es legible sobre el video (contraste mínimo 4.5:1)
□ Responsive verificado en: iPhone SE, iPhone 14, iPad, 1440px, 1920px
```

---

## ⚡ Nota sobre Safari y clipPath + video

Safari a veces tiene problemas para recortar un `<video>` con `clip-path: url(#...)`. Solución alternativa:

```tsx
// En Safari: usar mask-image en lugar de clip-path
// Detectar con CSS:
@supports (-webkit-appearance: none) {
  .blob-media {
    -webkit-mask-image: url('#clip-svg-inline');
    mask-image: url('#clip-svg-inline');
    clip-path: none;
  }
}
```

---

## 🎯 Resumen de Horas

| Fase | Descripción | Tiempo |
|------|-------------|--------|
| 0 | Setup + dependencias | 30 min |
| 1 | Hero Section completo | 2 h |
| 2 | Blob Cards con morphing | 3-4 h |
| 3 | Micro-animaciones extra | 1.5 h |
| 4 | Responsive + accesibilidad | 1 h |
| 5 | Assets y optimización de video | 1-2 h |
| 6 | Ensamblaje final + QA | 30 min |
| **Total** | | **~10-11 h** |

---

*Plan generado para getxobelaeskola.cloud · Estética Apple × Bonka · 2025*
