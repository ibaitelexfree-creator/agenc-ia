# 🌊 GETXO BELA ESKOLA — PLAN MAESTRO DE IMPLEMENTACIÓN
## `getxobelaeskola.cloud` · Nueva Sección Home · "La Vela Se Adapta a Ti"
### 📋 Nivel: ATÓMICO | Stack: Next.js + Framer Motion | Estilo: Apple × Bonka

---

> **🤖 PARA LA IA IMPLEMENTADORA**
> Lee el documento COMPLETO antes de tocar código.
> Ejecuta cada tarea EN ORDEN. No improvises. No combines pasos.
> Si algo no está claro, el documento está mal escrito — regresa aquí.
> Cada `[ ]` es una tarea atómica. Márcala `[x]` al completar.

---

## 📑 ÍNDICE

| # | Fase | Descripción |
|---|------|-------------|
| 0 | Setup | Proyecto, deps, variables de entorno |
| 1 | Design System | Tokens, fuentes, componentes base |
| 2 | Page Loader | Animación de entrada épica |
| 3 | Navegación | Nav sticky + scroll behavior |
| 4 | Hero | Pantalla completa, título animado |
| 5 | Manifiesto | Quote section |
| 6 | "Se Adapta a Ti" | Sección interactiva 3 tipos |
| 7 | Qué Ofrecemos | Grid de servicios |
| 8 | Tipos de Velero | Horizontal scroll carousel |
| 9 | Stats | Contador animado |
| 10 | Proceso | Cómo es navegar con nosotros |
| 11 | Equipo | Instructores |
| 12 | Getxo & Mar | Sección ubicación/atmosfera |
| 13 | Testimonios | Carousel de testimonios |
| 14 | Booking / CTA | Sección reserva |
| 15 | Footer | Links, social, newsletter |
| 16 | Magia Global | Cursor, transiciones, scroll global |
| 17 | Performance | Optimización final |

---

## 🎨 DESIGN BRIEF — Leer antes de empezar

### Concepto Central
> *La vela es la más antigua tecnología de adaptación del ser humano al mar.*
> *Esta web debe sentirse así: silenciosa, poderosa, precisa. Como el viento que llena una vela.*

### Paleta de Colores (6 tokens, NO más)

```css
:root {
  --bianco:    #FFFFFF;  /* El alma blanca — background principal */
  --profondo:  #0B2C55;  /* Azul Atlántico profundo — headings, CTA */
  --horizonte: #4A7FA5;  /* La línea del horizonte — accents */
  --bruma:     #F0F4F8;  /* Niebla marina — sections alternas */
  --arena:     #1A1A1A;  /* Arena oscura — body text */
  --espuma:    #D6E4F0;  /* Espuma — borders, dividers sutiles */
}
```

### Tipografía (2 familias, NO más)

| Rol | Familia | Peso | Import |
|-----|---------|------|--------|
| Display (títulos) | `Cormorant Garamond` | 300, 600, 700 | Google Fonts |
| Body / UI | `Inter` | 300, 400, 500, 600 | Google Fonts |

```css
/* ESCALA TIPOGRÁFICA — NO cambiar */
--text-xs:   0.75rem;   /* 12px — labels, captions */
--text-sm:   0.875rem;  /* 14px — nav, metadata */
--text-base: 1rem;      /* 16px — body */
--text-lg:   1.125rem;  /* 18px — lead text */
--text-xl:   1.5rem;    /* 24px — subtítulos */
--text-2xl:  2rem;      /* 32px — títulos sección */
--text-3xl:  2.75rem;   /* 44px — títulos grandes */
--text-hero: clamp(4rem, 9vw, 9rem); /* Hero title — fluido */
```

### Espaciado (sistema 8px)

```css
--space-1:  0.5rem;   /*  8px */
--space-2:  1rem;     /* 16px */
--space-3:  1.5rem;   /* 24px */
--space-4:  2rem;     /* 32px */
--space-6:  3rem;     /* 48px */
--space-8:  4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 8rem;     /* 128px */
--space-24: 12rem;    /* 192px */
```

### Principios de Animación (Framer Motion)

```js
// EASING FUNCTIONS — usar SIEMPRE estos valores
const ease = {
  smooth:   [0.25, 0.46, 0.45, 0.94],
  bounce:   [0.34, 1.56, 0.64, 1],
  ocean:    [0.2,  0.65, 0.3,  0.9],   // La curva signature
  swift:    [0.4,  0,    0.2,  1],
}

// DURACIONES ESTÁNDAR
const duration = {
  fast:   0.2,
  normal: 0.5,
  slow:   0.8,
  epic:   1.2,
}

// STAGGER PARA LISTAS
const staggerChildren = 0.08  // 80ms entre hijos
```

### La Firma Visual — El Wave Morphing
El elemento único que nadie más tiene: **entre cada sección principal hay una ola SVG que se anima** cuando la sección entra en el viewport. Usa `<AnimatedWaveDivider />` (FASE 1, componente base).

---

## 🗂 FASE 0 — SETUP DEL PROYECTO

### 0.1 Estructura de Archivos

```
getxobelaeskola/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── base/
│   │   ├── AnimatedWaveDivider.tsx   ← FIRMA VISUAL
│   │   ├── ScrollReveal.tsx
│   │   ├── CounterNumber.tsx
│   │   └── MagneticButton.tsx
│   ├── sections/
│   │   ├── PageLoader.tsx
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Manifesto.tsx
│   │   ├── AdaptaATi.tsx
│   │   ├── QueOfrecemos.tsx
│   │   ├── TiposVelero.tsx
│   │   ├── Stats.tsx
│   │   ├── Proceso.tsx
│   │   ├── Equipo.tsx
│   │   ├── GetxoMar.tsx
│   │   ├── Testimonios.tsx
│   │   ├── Booking.tsx
│   │   └── Footer.tsx
│   └── providers/
│       └── SmoothScrollProvider.tsx
├── lib/
│   ├── animations.ts       ← TODAS las variantes de Framer Motion
│   └── constants.ts        ← TODOS los textos y datos
├── hooks/
│   ├── useScrollDirection.ts
│   └── useMediaQuery.ts
└── public/
    ├── images/
    │   ├── hero-ocean.jpg       (1920x1080, WebP preferido)
    │   ├── velero-optimist.jpg
    │   ├── velero-laser.jpg
    │   ├── velero-420.jpg
    │   ├── velero-crucero.jpg
    │   ├── getxo-aerial.jpg
    │   ├── instructor-1.jpg
    │   ├── instructor-2.jpg
    │   └── instructor-3.jpg
    └── icons/
        ├── anchor.svg
        ├── compass.svg
        ├── wind.svg
        └── wave.svg
```

### 0.2 Instalación de Dependencias

```bash
# [ ] TAREA 0.2.1 — Crear proyecto Next.js
npx create-next-app@latest getxobelaeskola \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias="@/*"

# [ ] TAREA 0.2.2 — Instalar Framer Motion
npm install framer-motion

# [ ] TAREA 0.2.3 — Instalar Lenis (smooth scroll)
npm install @studio-freight/lenis

# [ ] TAREA 0.2.4 — Instalar utilidades
npm install clsx tailwind-merge

# [ ] TAREA 0.2.5 — Instalar fuentes (Google Fonts via next/font)
# Las fuentes se cargan en app/layout.tsx, no hay que instalar nada
```

### 0.3 Configurar Tailwind

```js
// tailwind.config.ts — COPIAR EXACTAMENTE
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bianco:    '#FFFFFF',
        profondo:  '#0B2C55',
        horizonte: '#4A7FA5',
        bruma:     '#F0F4F8',
        arena:     '#1A1A1A',
        espuma:    '#D6E4F0',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(4rem, 9vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        '5xl':  ['3.5rem',  { lineHeight: '1.05' }],
        '4xl':  ['2.75rem', { lineHeight: '1.1' }],
      },
      animation: {
        'wave': 'wave 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%':      { transform: 'translateX(-25%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
    },
  },
}
export default config
```

### 0.4 Crear lib/animations.ts

```typescript
// lib/animations.ts — TODAS las variantes reutilizables
import { Variants } from 'framer-motion'

// ─── EASINGS ───────────────────────────────────────────────
export const easings = {
  smooth:  [0.25, 0.46, 0.45, 0.94] as const,
  bounce:  [0.34, 1.56, 0.64, 1]    as const,
  ocean:   [0.2,  0.65, 0.3,  0.9]  as const,
  swift:   [0.4,  0,    0.2,  1]    as const,
}

// ─── VARIANTES ESTÁNDAR ─────────────────────────────────────

// [ ] TAREA 0.4.1 — Copiar ESTE bloque exacto

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: easings.ocean }
  },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: easings.smooth } },
}

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easings.ocean } },
}

export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easings.ocean } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easings.bounce } },
}

export const container: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  },
}

export const letterVariant: Variants = {
  hidden:  { y: '110%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%', opacity: 1,
    transition: { delay: i * 0.04, duration: 0.8, ease: easings.ocean }
  }),
}

// Card hover — usar en whileHover
export const cardHover = {
  y: -8,
  boxShadow: '0 32px 80px rgba(11, 44, 85, 0.18)',
  transition: { duration: 0.3, ease: easings.swift },
}

// Viewport trigger estándar — usar en viewport prop
export const viewport = {
  once: true,
  margin: '-100px',
}
```

### 0.5 Crear lib/constants.ts

```typescript
// lib/constants.ts — TODOS los textos y datos del sitio
// [ ] TAREA 0.5.1 — Completar con los textos de los documentos oficiales

export const SITE = {
  name:    'Getxo Bela Eskola',
  tagline: 'La Vela Se Adapta a Ti',
  email:   '/* EMAIL OFICIAL */',
  phone:   '/* TELÉFONO OFICIAL */',
  address: '/* DIRECCIÓN PUERTO DE GETXO */',
}

export const NAV_LINKS = [
  { label: 'Nosotros',  href: '#nosotros'  },
  { label: 'Cursos',    href: '#cursos'    },
  { label: 'Veleros',   href: '#veleros'   },
  { label: 'Equipo',    href: '#equipo'    },
  { label: 'Contacto',  href: '#contacto'  },
]

export const ADAPTA_CARDS = [
  {
    id: 'principiante',
    emoji: '⚓',
    title: 'Primera vez en el agua',
    subtitle: 'Aguas tranquilas, veleros seguros, instructores pacientes.',
    description: '/* TEXTO OFICIAL: descripción cursos iniciación */',
    bg: '#EBF4FF',
  },
  {
    id: 'intermedio',
    emoji: '🧭',
    title: 'Ya navegas, quieres más',
    subtitle: 'Técnica, maniobras, viento real.',
    description: '/* TEXTO OFICIAL: descripción cursos intermedios */',
    bg: '#E8F5E9',
  },
  {
    id: 'experto',
    emoji: '🌊',
    title: 'Mar abierta y regatas',
    subtitle: 'Competición, planificación, adrenalina pura.',
    description: '/* TEXTO OFICIAL: descripción cursos avanzados */',
    bg: '#FFF8E1',
  },
]

export const VELEROS = [
  { id: 'optimist',  name: 'Optimist',  desc: 'El primer velero. Para los más jóvenes.', edad: '7-15 años', image: '/images/velero-optimist.jpg' },
  { id: 'laser',     name: 'Laser',     desc: 'Velocidad y técnica pura.', edad: '14+ años',  image: '/images/velero-laser.jpg'   },
  { id: '420',       name: '420',       desc: 'Trabajo en equipo, dos tripulantes.', edad: '12+ años',  image: '/images/velero-420.jpg'    },
  { id: 'crucero',   name: 'Crucero',   desc: 'El océano sin límites.', edad: 'Adultos',    image: '/images/velero-crucero.jpg' },
]

export const STATS = [
  { value: 40,   suffix: '+', label: 'Años navegando' },
  { value: 3000, suffix: '+', label: 'Alumnos formados' },
  { value: 12,   suffix: '',  label: 'Tipos de embarcación' },
  { value: 98,   suffix: '%', label: 'Alumnos satisfechos' },
]

export const PROCESO_STEPS = [
  { num: '01', title: 'Elige tu nivel',      desc: 'Hablamos contigo para entender dónde estás y a dónde quieres llegar.' },
  { num: '02', title: 'Reserva tu curso',    desc: 'Online o por teléfono. Sin complicaciones, confirmación inmediata.' },
  { num: '03', title: 'Llega al puerto',     desc: 'Todo el material está listo. Solo trae ganas.' },
  { num: '04', title: 'Navega',              desc: 'Con instructores titulados, en grupos reducidos, a tu ritmo.' },
]

export const EQUIPO = [
  { name: '/* NOMBRE */', role: '/* ROL */', bio: '/* BIO OFICIAL */', image: '/images/instructor-1.jpg' },
  { name: '/* NOMBRE */', role: '/* ROL */', bio: '/* BIO OFICIAL */', image: '/images/instructor-2.jpg' },
  { name: '/* NOMBRE */', role: '/* ROL */', bio: '/* BIO OFICIAL */', image: '/images/instructor-3.jpg' },
]

export const TESTIMONIOS = [
  { quote: '/* TESTIMONIO OFICIAL */', author: '/* NOMBRE */', curso: '/* CURSO */' },
  { quote: '/* TESTIMONIO OFICIAL */', author: '/* NOMBRE */', curso: '/* CURSO */' },
  { quote: '/* TESTIMONIO OFICIAL */', author: '/* NOMBRE */', curso: '/* CURSO */' },
]
```

---

## 🔤 FASE 1 — DESIGN SYSTEM & COMPONENTES BASE

### 1.1 Configurar Fuentes (app/layout.tsx)

```typescript
// [ ] TAREA 1.1.1 — Crear app/layout.tsx con este contenido exacto
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'Getxo Bela Eskola — La Vela Se Adapta a Ti',
  description: '/* DESCRIPCIÓN OFICIAL */',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-bianco text-arena font-body overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
```

### 1.2 globals.css

```css
/* [ ] TAREA 1.2.1 — Copiar en app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  
  h1, h2, h3, h4 { font-family: var(--font-display); }
  p, a, span, button, li { font-family: var(--font-body); }
  
  ::selection {
    background-color: #0B2C55;
    color: #FFFFFF;
  }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #F0F4F8; }
  ::-webkit-scrollbar-thumb { background: #4A7FA5; border-radius: 3px; }
}

@layer utilities {
  .text-hero {
    font-size: clamp(3.5rem, 9vw, 9rem);
    line-height: 0.92;
    letter-spacing: -0.03em;
  }
  
  .section-padding {
    padding-top: clamp(4rem, 10vw, 8rem);
    padding-bottom: clamp(4rem, 10vw, 8rem);
  }
  
  .container-wide {
    max-width: 1440px;
    margin-inline: auto;
    padding-inline: clamp(1.5rem, 5vw, 6rem);
  }
}
```

### 1.3 Componente: AnimatedWaveDivider (LA FIRMA VISUAL)

```
╔══════════════════════════════════════════════════════════════╗
║  SECCIÓN ANTERIOR                                            ║
║                                                              ║
║  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~         ║
║    ~~~~   ~~~~   ~~~~   ~~~~   ~~~~   ~~~~   ~~~~            ║
║      ~~~~~~~~~     ~~~~~~~~~     ~~~~~~~~~     ~~~            ║
║                                                              ║
║  SECCIÓN SIGUIENTE                                           ║
╚══════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 1.3.1 — Crear components/base/AnimatedWaveDivider.tsx

'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  fromColor?: string  // color de la sección de arriba
  toColor?: string    // color de la sección de abajo
  flip?: boolean      // voltear la ola
}

export function AnimatedWaveDivider({ 
  fromColor = '#FFFFFF', 
  toColor = '#F0F4F8',
  flip = false 
}: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  
  const pathA = 'M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z'
  const pathB = 'M0,80 C200,20 400,100 720,50 C900,20 1200,90 1440,40 L1440,120 L0,120 Z'
  
  return (
    <div style={{ background: fromColor }} className="relative -mb-1">
      <svg
        ref={ref}
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        style={{ transform: flip ? 'scaleY(-1)' : 'none', display: 'block' }}
        preserveAspectRatio="none"
      >
        <motion.path
          fill={toColor}
          initial={{ d: pathA }}
          animate={inView ? { d: pathB } : { d: pathA }}
          transition={{
            duration: 2,
            ease: [0.2, 0.65, 0.3, 0.9],
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </svg>
    </div>
  )
}
```

### 1.4 Componente: ScrollReveal (wrapper reutilizable)

```typescript
// [ ] TAREA 1.4.1 — Crear components/base/ScrollReveal.tsx

'use client'
import { motion } from 'framer-motion'
import { fadeUp, viewport } from '@/lib/animations'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
}

export function ScrollReveal({ children, delay = 0, className, variant = 'fadeUp' }: Props) {
  // [ ] TAREA 1.4.2 — Mapear variantes desde lib/animations.ts
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}  // usar la variante correcta según prop
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### 1.5 Componente: MagneticButton

```typescript
// [ ] TAREA 1.5.1 — Crear components/base/MagneticButton.tsx
// El botón que "atrae" el cursor hacia sí mismo (efecto magnético)

'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline'
  className?: string
}

export function MagneticButton({ children, onClick, variant = 'primary', className }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.35)
    y.set((e.clientY - centerY) * 0.35)
  }

  const handleMouseLeave = () => { x.set(0); y.set(0) }

  const base = 'relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-body font-500 text-base tracking-wide cursor-pointer overflow-hidden'
  const styles = {
    primary: 'bg-profondo text-white hover:bg-[#0d3666]',
    outline: 'border-2 border-profondo text-profondo hover:bg-bruma',
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`${base} ${styles[variant]} transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.button>
  )
}
```

### 1.6 Componente: CounterNumber

```typescript
// [ ] TAREA 1.6.1 — Crear components/base/CounterNumber.tsx

'use client'
import { motion, useMotionValue, animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  suffix?: string
  duration?: number
}

export function CounterNumber({ value, suffix = '', duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.2, 0.65, 0.3, 0.9],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {display.toLocaleString('es')}{suffix}
    </span>
  )
}
```

---

## ⌛ FASE 2 — PAGE LOADER (Animación de entrada)

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  [PANTALLA AZUL PROFUNDO - FULL SCREEN]                      ║
║                                                              ║
║              ⚓  GETXO BELA ESKOLA                           ║
║                                                              ║
║  ████████████████░░░░░░░░░░░░░░░░░░░░░  40%                 ║
║                                                              ║
║  [PROGRESS BAR ANIMADA CON OLA]                              ║
║                                                              ║
║  [La pantalla sube como una ola revelando el blanco]         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 2.1 — Crear components/sections/PageLoader.tsx

'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Simular carga: 0→60 rápido, 60→90 más lento, 90→100 al cargar
    const fast = setTimeout(() => setProgress(60), 300)
    const medium = setTimeout(() => setProgress(90), 800)
    const finish = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setDone(true)
        onComplete()
      }, 500)
    }, 1200)
    return () => { clearTimeout(fast); clearTimeout(medium); clearTimeout(finish) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-profondo flex flex-col items-center justify-center"
          exit={{
            clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Logo animado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            {/* Ola SVG animada */}
            <motion.svg
              width="60" height="40" viewBox="0 0 60 40"
              animate={{ d: [
                'M0,20 Q15,5 30,20 Q45,35 60,20',
                'M0,20 Q15,35 30,20 Q45,5 60,20',
              ]}}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            >
              <motion.path
                d="M0,20 Q15,5 30,20 Q45,35 60,20"
                stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ d: [
                  'M0,20 Q15,5 30,20 Q45,35 60,20',
                  'M0,20 Q15,35 30,20 Q45,5 60,20',
                ]}}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </motion.svg>
            <span className="text-white font-display text-2xl font-300 tracking-[0.2em] uppercase">
              Getxo Bela Eskola
            </span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-48 h-[1px] bg-white/20 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 bg-white"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
            />
          </motion.div>
          <motion.span
            className="text-white/40 font-body text-xs mt-3 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

```typescript
// [ ] TAREA 2.2 — Integrar en app/page.tsx

'use client'
import { useState } from 'react'
import { PageLoader } from '@/components/sections/PageLoader'
import { Navigation } from '@/components/sections/Navigation'
// ... importar todas las secciones

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <PageLoader onComplete={() => setLoaded(true)} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navigation />
        <Hero />
        <AnimatedWaveDivider fromColor="#FFFFFF" toColor="#F0F4F8" />
        <Manifesto />
        <AnimatedWaveDivider fromColor="#F0F4F8" toColor="#FFFFFF" flip />
        <AdaptaATi />
        <AnimatedWaveDivider fromColor="#FFFFFF" toColor="#F0F4F8" />
        <QueOfrecemos />
        <AnimatedWaveDivider fromColor="#F0F4F8" toColor="#FFFFFF" flip />
        <TiposVelero />
        <AnimatedWaveDivider fromColor="#FFFFFF" toColor="#0B2C55" />
        <Stats />
        <AnimatedWaveDivider fromColor="#0B2C55" toColor="#FFFFFF" flip />
        <Proceso />
        <AnimatedWaveDivider fromColor="#FFFFFF" toColor="#F0F4F8" />
        <Equipo />
        <AnimatedWaveDivider fromColor="#F0F4F8" toColor="#FFFFFF" flip />
        <GetxoMar />
        <AnimatedWaveDivider fromColor="#FFFFFF" toColor="#F0F4F8" />
        <Testimonios />
        <AnimatedWaveDivider fromColor="#F0F4F8" toColor="#FFFFFF" flip />
        <Booking />
        <Footer />
      </motion.main>
    </>
  )
}
```

---

## 🧭 FASE 3 — NAVEGACIÓN

```
╔══════════════════════════════════════════════════════════════╗
║  [SCROLL ARRIBA — transparente]                              ║
║  ─────────────────────────────────────────────────────────   ║
║  ⚓ GETXO BELA    Nosotros  Cursos  Veleros  Equipo  [Reservar]
║  ─────────────────────────────────────────────────────────   ║
║                                                              ║
║  [SCROLL ABAJO — frosted glass]                              ║
║  ╔═══════════════════════════════════════════════════════╗   ║
║  ║ backdrop-blur  ⚓ GETXO BELA  ···  Cursos  [Reservar]║   ║
║  ╚═══════════════════════════════════════════════════════╝   ║
╚══════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 3.1 — Crear components/sections/Navigation.tsx

'use client'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { MagneticButton } from '@/components/base/MagneticButton'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // [ ] TAREA 3.2 — Detectar scroll
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 50))

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid rgba(214,228,240,0.8)' : '1px solid transparent',
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-wide flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            {/* SVG Ola como logo */}
            <motion.svg
              width="32" height="20" viewBox="0 0 32 20"
              className={scrolled ? 'stroke-profondo' : 'stroke-white'}
              animate={{ stroke: scrolled ? '#0B2C55' : '#FFFFFF' }}
              transition={{ duration: 0.3 }}
            >
              <motion.path
                d="M0,10 Q8,3 16,10 Q24,17 32,10"
                strokeWidth="2.5" fill="none" strokeLinecap="round"
                animate={{ d: [
                  'M0,10 Q8,3 16,10 Q24,17 32,10',
                  'M0,10 Q8,17 16,10 Q24,3 32,10',
                ]}}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            </motion.svg>
            <motion.span
              className="font-display font-600 text-lg tracking-wide"
              animate={{ color: scrolled ? '#0B2C55' : '#FFFFFF' }}
              transition={{ duration: 0.3 }}
            >
              {SITE.name}
            </motion.span>
          </motion.a>

          {/* Links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="font-body text-sm font-500 tracking-wide relative group"
                animate={{ color: scrolled ? '#1A1A1A' : '#FFFFFF' }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                // [ ] TAREA 3.3 — Underline hover
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-current group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <MagneticButton variant="primary">
              Reservar curso
            </MagneticButton>
          </div>

          {/* Hamburger — mobile */}
          {/* [ ] TAREA 3.4 — Implementar menú mobile con AnimatePresence */}
        </div>
      </motion.nav>
    </>
  )
}
```

---

## 🌊 FASE 4 — HERO

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  [IMAGEN OCÉANO GETXO — FULL SCREEN]                             ║
║  [Overlay azul muy sutil, 0.3 opacity]                           ║
║                                                                  ║
║                                                                  ║
║  L  A      V  E  L  A         ← cada letra animada individualmente
║  S  E      A  D  A  P  T  A  ← stagger 40ms entre letras         ║
║  A      T  I                 ← delay escalonado por línea         ║
║                                                                  ║
║  ─────────────────────────────────────────                        ║
║  Veleros pequeños o grandes, días de calma                        ║
║  o de acción. Tú eliges cómo quieres navegar.                     ║
║                                                                  ║
║  [Reservar mi primer curso ↓]    [Ver qué ofrecemos]             ║
║                                                                  ║
║  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ← AnimatedWave
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 4.1 — Crear components/sections/Hero.tsx

'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { MagneticButton } from '@/components/base/MagneticButton'

const HERO_LINES = [
  'La Vela',
  'Se Adapta',
  'A Ti',
]

// [ ] TAREA 4.2 — Componente para animar letra a letra
function AnimatedTitle({ lines }: { lines: string[] }) {
  return (
    <div className="overflow-hidden">
      {lines.map((line, lineIndex) => (
        <div key={line} className="overflow-hidden">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04, delayChildren: lineIndex * 0.15 + 0.8 } }
            }}
            className="flex flex-wrap gap-x-[0.2em]"
          >
            {line.split('').map((letter, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden:  { y: '110%', opacity: 0 },
                  visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
                }}
                className="inline-block text-hero font-display font-600 text-white leading-[0.9]"
                style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  
  // [ ] TAREA 4.3 — Parallax: imagen sube más despacio que el scroll
  const imageY    = useTransform(scrollYProgress, [0, 1], ['0%',   '30%'])
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%',   '20%'])
  const opacity   = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden">
      
      {/* Imagen de fondo con parallax */}
      <motion.div className="absolute inset-0 scale-[1.1]" style={{ y: imageY }}>
        <Image
          src="/images/hero-ocean.jpg"
          alt="Mar de Getxo"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-profondo/40 via-profondo/20 to-profondo/60" />
      </motion.div>

      {/* Contenido */}
      <motion.div
        className="relative z-10 container-wide h-full flex flex-col justify-center pt-20"
        style={{ y: contentY, opacity }}
      >
        {/* Eyebrow — aparece antes del título */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-body text-white/70 text-sm tracking-[0.3em] uppercase mb-8"
        >
          Escuela de vela · Getxo · País Vasco
        </motion.p>

        {/* Título animado */}
        <AnimatedTitle lines={HERO_LINES} />

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="font-body text-white/80 text-lg md:text-xl max-w-xl mt-8 leading-relaxed"
        >
          Veleros pequeños o grandes, días de calma o de acción, 
          aguas tranquilas o mar abierta. Tú eliges cómo quieres navegar.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="flex flex-wrap gap-4 mt-10"
        >
          <MagneticButton variant="primary">
            Reservar mi primer curso
          </MagneticButton>
          <MagneticButton variant="outline">
            <span className="text-white border-white">Ver qué ofrecemos</span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs tracking-widest uppercase font-body">Scroll</span>
        <motion.div
          className="w-[1px] h-12 bg-white/30"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
```

---

## 📜 FASE 5 — MANIFIESTO

```
╔══════════════════════════════════════════════════════════════════╗
║                    [FONDO: #F0F4F8]                              ║
║                                                                  ║
║  " La vela es la tecnología más antigua que el ser humano usó    ║
║    para adaptarse al mar. Nosotros te enseñamos a dominarla. "   ║
║                                                                  ║
║                              — Getxo Bela Eskola                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 5.1 — Crear components/sections/Manifesto.tsx

'use client'
import { motion } from 'framer-motion'
import { viewport } from '@/lib/animations'

export function Manifesto() {
  const text = `La vela es la tecnología más antigua que el ser humano usó para adaptarse al mar. Nosotros te enseñamos a dominarla.`
  const words = text.split(' ')

  return (
    <section className="section-padding bg-bruma">
      <div className="container-wide max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ visible: { transition: { staggerChildren: 0.025 } } }}
          className="relative"
        >
          {/* Comilla decorativa */}
          <motion.span
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.08 } }}
            className="absolute -top-8 -left-4 font-display text-[12rem] text-profondo leading-none select-none"
          >
            "
          </motion.span>
          
          <p className="font-display text-3xl md:text-4xl lg:text-5xl font-300 text-arena leading-[1.3] relative z-10">
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden:  { opacity: 0.2, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] } }
                }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </p>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.8 } } }}
            className="mt-8 font-body text-sm tracking-[0.2em] text-horizonte uppercase"
          >
            — Getxo Bela Eskola
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 🏄 FASE 6 — "LA VELA SE ADAPTA A TI" (Sección Interactiva)

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO BLANCO]                                                  ║
║                                                                  ║
║  La vela se adapta a ti                  ← título grande         ║
║                                                                  ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           ║
║  │   ⚓          │  │   🧭          │  │   🌊          │           ║
║  │              │  │              │  │              │           ║
║  │ Primera vez  │  │ Ya navegas,  │  │ Mar abierta  │           ║
║  │ en el agua   │  │ quieres más  │  │ y regatas    │           ║
║  │              │  │              │  │              │           ║
║  │ Aguas tranq. │  │ Técnica,     │  │ Competición  │           ║
║  │ veleros      │  │ maniobras,   │  │ planificación│           ║
║  │ seguros      │  │ viento real  │  │ adrenalina   │           ║
║  │              │  │              │  │              │           ║
║  │ [Ver cursos] │  │ [Ver cursos] │  │ [Ver cursos] │           ║
║  └──────────────┘  └──────────────┘  └──────────────┘           ║
║         ↑ hover: card se eleva 8px + sombra profunda             ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 6.1 — Crear components/sections/AdaptaATi.tsx

'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ADAPTA_CARDS } from '@/lib/constants'
import { container, fadeUp, viewport, cardHover } from '@/lib/animations'

export function AdaptaATi() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="nosotros" className="section-padding bg-bianco">
      <div className="container-wide">
        
        {/* Título de sección */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={container}
          className="mb-16 md:mb-24"
        >
          <motion.p variants={fadeUp} className="font-body text-horizonte text-sm tracking-[0.3em] uppercase mb-4">
            Para todos
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl lg:text-6xl font-600 text-profondo max-w-2xl leading-[1.05]">
            La vela se adapta a ti
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {ADAPTA_CARDS.map((card) => (
            <motion.div
              key={card.id}
              variants={fadeUp}
              whileHover={cardHover}
              onHoverStart={() => setHovered(card.id)}
              onHoverEnd={() => setHovered(null)}
              className="group relative rounded-3xl p-8 md:p-10 cursor-pointer overflow-hidden"
              style={{ backgroundColor: card.bg }}
            >
              {/* Emoji / Icono */}
              <motion.div
                className="text-5xl mb-6"
                animate={{ 
                  scale: hovered === card.id ? 1.2 : 1,
                  rotate: hovered === card.id ? [0, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {card.emoji}
              </motion.div>

              {/* Contenido */}
              <h3 className="font-display text-2xl font-600 text-profondo mb-3">
                {card.title}
              </h3>
              <p className="font-body text-horizonte font-500 text-base mb-4">
                {card.subtitle}
              </p>
              <p className="font-body text-arena/70 text-sm leading-relaxed mb-8">
                {card.description}
              </p>

              {/* CTA */}
              <motion.div
                className="flex items-center gap-2 text-profondo font-body font-500 text-sm"
                animate={{ x: hovered === card.id ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                Ver cursos
                <motion.span
                  animate={{ x: hovered === card.id ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </motion.div>

              {/* Decoración de ola en esquina */}
              <motion.svg
                className="absolute -bottom-4 -right-4 opacity-10"
                width="120" height="80" viewBox="0 0 120 80"
                animate={{ x: hovered === card.id ? -4 : 0 }}
              >
                <path d="M0,40 Q30,10 60,40 Q90,70 120,40" stroke="#0B2C55" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M0,60 Q30,30 60,60 Q90,90 120,60" stroke="#0B2C55" strokeWidth="8" fill="none" strokeLinecap="round"/>
              </motion.svg>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 📋 FASE 7 — QUÉ OFRECEMOS

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO: #F0F4F8]                                                ║
║                                                                  ║
║  Nuestros cursos                                                 ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │  [IMAGEN LADO IZQUIERDO]    │  Cursos de iniciación        │  ║
║  │                             │  ────────────────────────    │  ║
║  │                             │  Texto descripción...        │  ║
║  │                             │                              │  ║
║  │                             │  [→ Más información]         │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │  Cursos de perfeccionamiento │  [IMAGEN LADO DERECHO]      │  ║
║  │  ────────────────────────    │                             │  ║
║  │  Texto descripción...        │                             │  ║
║  │                              │                             │  ║
║  │  [→ Más información]         │                             │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║  (Cada par alterna imagen izquierda/derecha)                     ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 7.1 — Crear components/sections/QueOfrecemos.tsx

'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { slideInLeft, slideInRight, viewport } from '@/lib/animations'

const CURSOS = [
  {
    title: 'Cursos de Iniciación',
    desc: '/* TEXTO OFICIAL */',
    image: '/images/velero-optimist.jpg',
    tag: 'Desde 7 años',
  },
  {
    title: 'Perfeccionamiento',
    desc: '/* TEXTO OFICIAL */',
    image: '/images/velero-laser.jpg',
    tag: 'Intermedio',
  },
  {
    title: 'Regatas y Competición',
    desc: '/* TEXTO OFICIAL */',
    image: '/images/velero-420.jpg',
    tag: 'Avanzado',
  },
]

export function QueOfrecemos() {
  return (
    <section id="cursos" className="section-padding bg-bruma">
      <div className="container-wide">
        
        {/* Título */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={slideInLeft}
          className="mb-20"
        >
          <p className="font-body text-horizonte text-sm tracking-[0.3em] uppercase mb-4">Formación</p>
          <h2 className="font-display text-4xl md:text-5xl font-600 text-profondo">Nuestros cursos</h2>
        </motion.div>

        {/* Pares imagen + texto alternados */}
        <div className="flex flex-col gap-24">
          {CURSOS.map((curso, i) => {
            const isEven = i % 2 === 0
            return (
              <div
                key={curso.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:[&>*:first-child]:order-last' : ''}`}
              >
                {/* Imagen */}
                <motion.div
                  initial="hidden" whileInView="visible" viewport={viewport}
                  variants={isEven ? slideInLeft : slideInRight}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
                >
                  <Image
                    src={curso.image}
                    alt={curso.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Tag flotante */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-body text-profondo text-xs font-500 tracking-wide">{curso.tag}</span>
                  </div>
                </motion.div>

                {/* Texto */}
                <motion.div
                  initial="hidden" whileInView="visible" viewport={viewport}
                  variants={isEven ? slideInRight : slideInLeft}
                >
                  <h3 className="font-display text-3xl md:text-4xl font-600 text-profondo mb-6">
                    {curso.title}
                  </h3>
                  <p className="font-body text-arena/70 text-lg leading-relaxed mb-8">
                    {curso.desc}
                  </p>
                  <motion.a
                    href="#contacto"
                    className="inline-flex items-center gap-3 text-horizonte font-body font-500 text-base group"
                    whileHover={{ x: 4 }}
                  >
                    Más información
                    <motion.span className="text-xl group-hover:translate-x-1 transition-transform">→</motion.span>
                  </motion.a>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

---

## ⛵ FASE 8 — TIPOS DE VELERO (Horizontal Scroll Carousel)

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO BLANCO]                                                  ║
║                                                                  ║
║  Nuestros veleros           ← / →   (flechas navegación)        ║
║                                                                  ║
║  ←─────── SCROLL HORIZONTAL ──────────────────────────────→     ║
║  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   ║
║  │           │  │           │  │           │  │           │   ║
║  │ [IMAGEN]  │  │ [IMAGEN]  │  │ [IMAGEN]  │  │ [IMAGEN]  │   ║
║  │           │  │           │  │           │  │           │   ║
║  │ Optimist  │  │  Laser    │  │   420     │  │  Crucero  │   ║
║  │ 7-15 años │  │ 14+ años  │  │ 12+ años  │  │ Adultos   │   ║
║  │           │  │           │  │           │  │           │   ║
║  └───────────┘  └───────────┘  └───────────┘  └───────────┘   ║
║                                                                  ║
║  ○  ●  ○  ○   (dots indicator)                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 8.1 — Crear components/sections/TiposVelero.tsx

'use client'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { VELEROS } from '@/lib/constants'
import { fadeUp, viewport } from '@/lib/animations'

export function TiposVelero() {
  const [active, setActive] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)

  return (
    <section id="veleros" className="section-padding bg-bianco overflow-hidden">
      <div className="container-wide">
        
        {/* Header con flechas */}
        <div className="flex items-end justify-between mb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
            <p className="font-body text-horizonte text-sm tracking-[0.3em] uppercase mb-4">Flota</p>
            <h2 className="font-display text-4xl md:text-5xl font-600 text-profondo">Nuestros veleros</h2>
          </motion.div>
          
          {/* Flechas navegación */}
          <div className="flex gap-3">
            {['←', '→'].map((arrow, i) => (
              <motion.button
                key={arrow}
                onClick={() => setActive(prev => 
                  i === 0 
                    ? Math.max(0, prev - 1) 
                    : Math.min(VELEROS.length - 1, prev + 1)
                )}
                className="w-12 h-12 rounded-full border border-espuma flex items-center justify-center font-body text-profondo text-lg"
                whileHover={{ scale: 1.1, backgroundColor: '#0B2C55', color: '#FFFFFF', borderColor: '#0B2C55' }}
                whileTap={{ scale: 0.95 }}
              >
                {arrow}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Carousel con drag */}
        <div ref={constraintsRef} className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            drag="x"
            dragConstraints={constraintsRef}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info: PanInfo) => {
              setIsDragging(false)
              if (info.offset.x < -50) setActive(prev => Math.min(VELEROS.length - 1, prev + 1))
              if (info.offset.x > 50) setActive(prev => Math.max(0, prev - 1))
            }}
            animate={{ x: `calc(-${active * 100}% - ${active * 24}px)` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {VELEROS.map((velero, i) => (
              <motion.div
                key={velero.id}
                className="flex-none w-[280px] md:w-[360px]"
                animate={{ opacity: i === active ? 1 : 0.5, scale: i === active ? 1 : 0.97 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActive(i)}
              >
                {/* Card */}
                <div className="rounded-2xl overflow-hidden bg-bruma">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={velero.image}
                      alt={velero.name}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-2xl font-600 text-profondo">{velero.name}</h3>
                      <span className="font-body text-xs text-horizonte bg-white px-3 py-1 rounded-full">
                        {velero.edad}
                      </span>
                    </div>
                    <p className="font-body text-arena/70 text-sm leading-relaxed">{velero.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {VELEROS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full"
              animate={{
                width: i === active ? 24 : 8,
                backgroundColor: i === active ? '#0B2C55' : '#D6E4F0',
              }}
              style={{ height: 8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 🔢 FASE 9 — STATS (Sección oscura con contadores)

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO: #0B2C55 — AZUL PROFUNDO]                                ║
║                                                                  ║
║  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  ║
║  │            │  │            │  │            │  │           │  ║
║  │    40+     │  │   3.000+   │  │     12     │  │    98%    │  ║
║  │            │  │            │  │            │  │           │  ║
║  │  Años      │  │  Alumnos   │  │ Tipos de   │  │ Alumnos   │  ║
║  │ navegando  │  │ formados   │  │ embarcación│  │ satisf.   │  ║
║  └────────────┘  └────────────┘  └────────────┘  └───────────┘  ║
║                                                                  ║
║   Números que se cuentan animados al entrar en viewport          ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 9.1 — Crear components/sections/Stats.tsx

'use client'
import { motion } from 'framer-motion'
import { STATS } from '@/lib/constants'
import { CounterNumber } from '@/components/base/CounterNumber'
import { viewport } from '@/lib/animations'

export function Stats() {
  return (
    <section className="section-padding bg-profondo relative overflow-hidden">
      
      {/* Fondo decorativo: olas sutiles */}
      <div className="absolute inset-0 opacity-5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{
              backgroundPositionX: ['0%', '100%'],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 100px, white 100px, white 102px)`,
              top: `${20 + i * 30}%`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="flex flex-col items-center text-center gap-3"
            >
              <span className="font-display text-5xl md:text-6xl font-300 text-white leading-none">
                <CounterNumber value={stat.value} suffix={stat.suffix} duration={2} />
              </span>
              <div className="w-8 h-[1px] bg-white/30" />
              <span className="font-body text-white/60 text-sm tracking-wide">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 🗺 FASE 10 — PROCESO (Cómo es navegar con nosotros)

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO BLANCO]                                                  ║
║                                                                  ║
║  Cómo funciona                                                   ║
║                                                                  ║
║  ①                  ②                  ③                  ④      ║
║  │                  │                  │                  │      ║
║  ●──────────────────●──────────────────●──────────────────●      ║
║  │                  │                  │                  │      ║
║  Elige tu nivel    Reserva            Llega al           Navega  ║
║                                        puerto                    ║
║                                                                  ║
║  La línea se va dibujando con una animación de stroke            ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 10.1 — Crear components/sections/Proceso.tsx

'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { PROCESO_STEPS } from '@/lib/constants'
import { fadeUp, viewport } from '@/lib/animations'

export function Proceso() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%']
  })
  
  // La línea se dibuja según el scroll
  const lineProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="section-padding bg-bianco">
      <div className="container-wide">
        
        {/* Título */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={fadeUp} className="mb-20 text-center"
        >
          <p className="font-body text-horizonte text-sm tracking-[0.3em] uppercase mb-4">Simple</p>
          <h2 className="font-display text-4xl md:text-5xl font-600 text-profondo">
            Cómo funciona
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          
          {/* Línea de conexión — desktop */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-[1px] bg-espuma">
            <motion.div
              className="absolute inset-y-0 left-0 bg-horizonte"
              style={{ width: lineProgress }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {PROCESO_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
                className="flex flex-col items-start md:items-center md:text-center gap-4"
              >
                {/* Número */}
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-bruma border-2 border-espuma flex items-center justify-center relative z-10"
                    whileInView={{ borderColor: '#4A7FA5', backgroundColor: '#EBF4FF' }}
                    viewport={viewport}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  >
                    <span className="font-display text-profondo text-xl font-600">{step.num}</span>
                  </motion.div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-600 text-profondo mb-2">{step.title}</h3>
                  <p className="font-body text-arena/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## 👥 FASE 11 — EQUIPO

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO: #F0F4F8]                                                ║
║                                                                  ║
║  Quiénes somos                                                   ║
║                                                                  ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           ║
║  │  [FOTO]      │  │  [FOTO]      │  │  [FOTO]      │           ║
║  │  ────────    │  │  ────────    │  │  ────────    │           ║
║  │  Nombre      │  │  Nombre      │  │  Nombre      │           ║
║  │  Rol         │  │  Rol         │  │  Rol         │           ║
║  │  Bio corta   │  │  Bio corta   │  │  Bio corta   │           ║
║  └──────────────┘  └──────────────┘  └──────────────┘           ║
║                                                                  ║
║   Hover: foto hace zoom sutil, nombre en azul                    ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 11.1 — Crear components/sections/Equipo.tsx

'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { EQUIPO } from '@/lib/constants'
import { container, fadeUp, viewport } from '@/lib/animations'

export function Equipo() {
  return (
    <section id="equipo" className="section-padding bg-bruma">
      <div className="container-wide">
        
        {/* Título */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={fadeUp} className="mb-16"
        >
          <p className="font-body text-horizonte text-sm tracking-[0.3em] uppercase mb-4">Personas</p>
          <h2 className="font-display text-4xl md:text-5xl font-600 text-profondo">Quiénes somos</h2>
        </motion.div>

        {/* Grid equipo */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {EQUIPO.map((person) => (
            <motion.div
              key={person.name}
              variants={fadeUp}
              className="group"
            >
              {/* Foto */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-profondo/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Info */}
              <motion.h3
                className="font-display text-2xl font-600 text-profondo mb-1 transition-colors"
                whileHover={{ color: '#4A7FA5' }}
              >
                {person.name}
              </motion.h3>
              <p className="font-body text-horizonte text-sm tracking-wide mb-3">{person.role}</p>
              <p className="font-body text-arena/70 text-sm leading-relaxed">{person.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 🗺 FASE 12 — GETXO & EL MAR

```
╔══════════════════════════════════════════════════════════════════╗
║  [IMAGEN AÉREA DE GETXO — FULL WIDTH, ALTURA FIJA]              ║
║  [Parallax: imagen sube más lento que el scroll]                 ║
║                                                                  ║
║  ┌─────────────────────────────────────────────────┐            ║
║  │  [overlay semitransparente azul profundo]        │            ║
║  │                                                 │            ║
║  │  Getxo.                                         │            ║
║  │  Puerto de Algorta.                             │            ║
║  │  El Cantábrico.                                 │            ║
║  │                                                 │            ║
║  │  Aquí empieza todo.                             │            ║
║  │                                                 │            ║
║  │  [📍 Ver en mapa]                               │            ║
║  └─────────────────────────────────────────────────┘            ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 12.1 — Crear components/sections/GetxoMar.tsx

'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { fadeUp, viewport } from '@/lib/animations'

const PLACE_WORDS = ['Getxo.', 'Puerto\u00A0de\u00A0Algorta.', 'El\u00A0Cantábrico.', 'Aquí\u00A0empieza\u00A0todo.']

export function GetxoMar() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[500px] overflow-hidden">
      
      {/* Imagen parallax */}
      <motion.div className="absolute inset-0 scale-[1.3]" style={{ y: imageY }}>
        <Image
          src="/images/getxo-aerial.jpg"
          alt="Puerto de Getxo — Algorta"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-profondo/50" />
      </motion.div>

      {/* Contenido */}
      <div className="relative z-10 container-wide h-full flex flex-col justify-center">
        <div className="max-w-xl">
          {PLACE_WORDS.map((word, i) => (
            <motion.p
              key={word}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
              className={`font-display text-white ${i === 3 ? 'text-2xl font-300 mt-4 text-white/70' : 'text-3xl md:text-4xl font-600'}`}
            >
              {word}
            </motion.p>
          ))}
        </div>

        {/* Link al mapa */}
        <motion.a
          href="/* GOOGLE MAPS URL */"
          target="_blank"
          rel="noopener"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ delay: 0.7 }}
          className="mt-8 inline-flex items-center gap-3 text-white/80 font-body text-sm hover:text-white transition-colors group"
          whileHover={{ x: 4 }}
        >
          <span className="text-xl">📍</span>
          Ver en mapa
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </motion.a>
      </div>
    </section>
  )
}
```

---

## 💬 FASE 13 — TESTIMONIOS

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO: #F0F4F8]                                                ║
║                                                                  ║
║  Lo que dicen nuestros alumnos                                   ║
║                                                                  ║
║  ← [ "   Testimonio del alumno aquí.                  " ] →     ║
║         Nombre Alumno                                            ║
║         Curso realizado                                          ║
║                                                                  ║
║  ○  ●  ○   (auto-avanza cada 5 segundos)                        ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 13.1 — Crear components/sections/Testimonios.tsx

'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TESTIMONIOS } from '@/lib/constants'
import { fadeUp, viewport } from '@/lib/animations'

export function Testimonios() {
  const [current, setCurrent] = useState(0)

  // [ ] TAREA 13.2 — Auto-avance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % TESTIMONIOS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const t = TESTIMONIOS[current]

  return (
    <section className="section-padding bg-bruma">
      <div className="container-wide max-w-4xl">

        {/* Título */}
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} className="mb-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-600 text-profondo">Lo que dicen nuestros alumnos</h2>
        </motion.div>

        {/* Testimonio */}
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="text-center"
            >
              {/* Comillas */}
              <span className="font-display text-[6rem] leading-none text-espuma absolute -top-8 left-1/2 -translate-x-1/2 select-none">
                "
              </span>
              
              <blockquote className="font-display text-2xl md:text-3xl font-300 text-profondo leading-relaxed mb-8 relative z-10 pt-8">
                {t.quote}
              </blockquote>
              
              <div className="flex flex-col items-center gap-1">
                <span className="font-body font-600 text-arena">{t.author}</span>
                <span className="font-body text-sm text-horizonte">{t.curso}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {TESTIMONIOS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all"
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? '#0B2C55' : '#D6E4F0',
              }}
              style={{ height: 8 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 📞 FASE 14 — BOOKING / CTA

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO: #0B2C55 — AZUL PROFUNDO]                                ║
║                                                                  ║
║         ¿Listo para                                              ║
║         zarpar?                                                  ║
║                                                                  ║
║         Elige tu curso, reserva online, y                        ║
║         llega al puerto. El resto lo hacemos nosotros.           ║
║                                                                  ║
║         [Reservar ahora]     [Contactar por WhatsApp]            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 14.1 — Crear components/sections/Booking.tsx

'use client'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/base/MagneticButton'
import { SITE } from '@/lib/constants'
import { viewport } from '@/lib/animations'

export function Booking() {
  return (
    <section id="contacto" className="section-padding bg-profondo relative overflow-hidden">
      
      {/* Decoración de olas de fondo */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 40" className="w-[200%] h-full" preserveAspectRatio="none">
          <path d="M0,20 Q25,5 50,20 Q75,35 100,20 Q125,5 150,20 Q175,35 200,20" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M0,30 Q25,15 50,30 Q75,45 100,30 Q125,15 150,30 Q175,45 200,30" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
      </motion.div>

      <div className="container-wide text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
        >
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-600 text-white mb-6 leading-[0.95]">
            ¿Listo para<br />zarpar?
          </h2>
          <p className="font-body text-white/60 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
            Elige tu curso, reserva online, y llega al puerto. 
            El resto lo hacemos nosotros.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <MagneticButton
              variant="primary"
              className="bg-white text-profondo hover:bg-bruma border-0"
            >
              Reservar ahora
            </MagneticButton>
            <a
              href={`https://wa.me/${SITE.phone}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/30 text-white font-body font-500 hover:border-white/70 transition-colors"
            >
              <span>💬</span>
              Contactar por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 🦶 FASE 15 — FOOTER

```
╔══════════════════════════════════════════════════════════════════╗
║  [FONDO: #0B2C55]  (continúa del Booking)                        ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  ⚓ Getxo Bela Eskola    Cursos    Veleros    Equipo    Legal     ║
║                                                                  ║
║  La vela se adapta a ti.     Instagram  Facebook  Twitter        ║
║                                                                  ║
║  © 2024 Getxo Bela Eskola. Todos los derechos reservados.        ║
╚══════════════════════════════════════════════════════════════════╝
```

```typescript
// [ ] TAREA 15.1 — Crear components/sections/Footer.tsx

'use client'
import { motion } from 'framer-motion'
import { SITE, NAV_LINKS } from '@/lib/constants'
import { container, fadeUp, viewport } from '@/lib/animations'

export function Footer() {
  return (
    <footer className="bg-profondo border-t border-white/10">
      <div className="container-wide py-16">
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8"
        >
          {/* Logo + tagline */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="16" viewBox="0 0 24 16" stroke="white" fill="none">
                <path d="M0,8 Q6,2 12,8 Q18,14 24,8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="font-display text-white text-lg font-600">{SITE.name}</span>
            </div>
            <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs">
              {SITE.tagline}.<br/>
              Escuela de vela en el Puerto de Getxo, Bizkaia.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUp}>
            <p className="font-body text-white/30 text-xs tracking-[0.2em] uppercase mb-6">Navegación</p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={fadeUp}>
            <p className="font-body text-white/30 text-xs tracking-[0.2em] uppercase mb-6">Contacto</p>
            <ul className="flex flex-col gap-3">
              <li><a href={`mailto:${SITE.email}`} className="font-body text-white/60 text-sm hover:text-white transition-colors">{SITE.email}</a></li>
              <li><a href={`tel:${SITE.phone}`}  className="font-body text-white/60 text-sm hover:text-white transition-colors">{SITE.phone}</a></li>
              <li className="font-body text-white/60 text-sm">{SITE.address}</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4"
        >
          <p className="font-body text-white/30 text-xs">
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Facebook'].map(social => (
              <a key={social} href={`/* URL ${social.toUpperCase()} */`}
                className="font-body text-white/30 text-xs hover:text-white/60 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
```

---

## ✨ FASE 16 — MAGIA GLOBAL

### 16.1 Cursor personalizado (Brújula)

```typescript
// [ ] TAREA 16.1 — Crear components/base/CustomCursor.tsx
// Cursor: punto pequeño + brújula que sigue con lag

'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)

  // El cursor grande sigue con lag (spring)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 15 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(!!(target.closest('a, button, [role="button"]')))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Punto central — sigue exacto */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] w-2 h-2 bg-profondo rounded-full pointer-events-none"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      {/* Círculo grande — sigue con lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full border border-profondo/30"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: isHovering ? 48 : 32, height: isHovering ? 48 : 32 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
```

### 16.2 Smooth Scroll Provider (Lenis)

```typescript
// [ ] TAREA 16.2 — Crear components/providers/SmoothScrollProvider.tsx

'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
```

```typescript
// [ ] TAREA 16.3 — Integrar en app/layout.tsx
// Wrappear {children} con:
// <SmoothScrollProvider>
//   <CustomCursor />
//   {children}
// </SmoothScrollProvider>
```

---

## 🚀 FASE 17 — PERFORMANCE & DEPLOY

### Checklist de Imágenes

```
[ ] 17.1 — Todas las imágenes convertidas a WebP
[ ] 17.2 — Imágenes hero: 1920×1080 máximo, optimizadas con squoosh.app
[ ] 17.3 — Imágenes card: 800×600 máximo
[ ] 17.4 — Fotos equipo: 600×800, enfocadas en la cara (objeto: face)
[ ] 17.5 — next.config.js configurado con domains de imágenes si son externas
```

### Checklist de Performance

```
[ ] 17.6 — Lighthouse score > 85 en Performance
[ ] 17.7 — Lighthouse score > 90 en Accessibility (añadir aria-labels)
[ ] 17.8 — prefers-reduced-motion: envolver animaciones en check de media query
[ ] 17.9 — Lazy loading en imágenes fuera del fold inicial
[ ] 17.10 — Componentes de sección marcados con 'use client' solo si tienen hooks
```

### Código para Reduced Motion

```typescript
// [ ] TAREA 17.11 — Crear hook hooks/useReducedMotion.ts

import { useReducedMotion as framerReducedMotion } from 'framer-motion'

export function useReducedMotion() {
  const preferReducedMotion = framerReducedMotion()
  
  // Si el usuario prefiere sin movimiento, devolver duración 0
  return {
    duration: preferReducedMotion ? 0 : undefined,
    animate: !preferReducedMotion,
  }
}
```

---

## ✅ CHECKLIST FINAL — Pre-Deploy

```
SETUP
[ ] Proyecto Next.js creado y corriendo en localhost:3000
[ ] Todas las dependencias instaladas
[ ] tailwind.config.ts con tokens correctos
[ ] globals.css con tipografía y utilities

DESIGN SYSTEM
[ ] Fuentes Cormorant Garamond + Inter cargando correctamente
[ ] CustomCursor funcionando en desktop
[ ] SmoothScrollProvider activo
[ ] AnimatedWaveDivider entre todas las secciones

SECCIONES
[ ] PageLoader → aparece y desaparece en 1.5s
[ ] Navigation → transparente arriba, frosted glass al scroll
[ ] Hero → título animado letra a letra, parallax, CTAs
[ ] Manifesto → palabras se iluminan al scroll
[ ] AdaptaATi → 3 cards con hover effects
[ ] QueOfrecemos → pares imagen+texto alternados
[ ] TiposVelero → carousel horizontal con drag
[ ] Stats → contadores animados sobre fondo azul
[ ] Proceso → timeline con línea que se dibuja
[ ] Equipo → grid 3 columnas con hover effects
[ ] GetxoMar → parallax section
[ ] Testimonios → auto-rotating carousel
[ ] Booking → CTA sobre fondo azul con animaciones
[ ] Footer → links + copyright

CONTENIDO
[ ] Todos los /* TEXTOS OFICIALES */ reemplazados con contenido real
[ ] Todas las imágenes subidas a /public/images/
[ ] Email, teléfono y dirección correctos en constants.ts
[ ] URL de Google Maps actualizada en GetxoMar
[ ] URLs de redes sociales actualizadas en Footer

CALIDAD
[ ] Sin errores en consola
[ ] Responsive: funciona en móvil (375px) y desktop (1440px)
[ ] Animaciones respetan prefers-reduced-motion
[ ] Todas las imágenes tienen alt text descriptivo
[ ] Lighthouse Performance > 85
[ ] Lighthouse Accessibility > 90
```

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO (para la IA)

```
DÍA 1 (Setup):
  → FASE 0 completa (setup + dependencias + lib/animations + lib/constants)
  → FASE 1 completa (layout + globals + componentes base)

DÍA 2 (Estructura):
  → FASE 2 (PageLoader)
  → FASE 3 (Navigation)
  → FASE 4 (Hero)
  → FASE 5 (Manifesto)
  → Verificar: la página carga, el loader funciona, el scroll activa la nav

DÍA 3 (Contenido principal):
  → FASE 6 (AdaptaATi)
  → FASE 7 (QueOfrecemos)
  → FASE 8 (TiposVelero)
  → Verificar: interacciones funcionan, carousel hace drag

DÍA 4 (Secciones secundarias):
  → FASE 9 (Stats)
  → FASE 10 (Proceso)
  → FASE 11 (Equipo)
  → FASE 12 (GetxoMar)
  → FASE 13 (Testimonios)

DÍA 5 (Cierre + Magia):
  → FASE 14 (Booking)
  → FASE 15 (Footer)
  → FASE 16 (Cursor + Smooth Scroll)
  → FASE 17 (Performance + Checklist final)
```

---

*Plan generado para getxobelaeskola.cloud · Versión 1.0 · Nivel de detalle: ATÓMICO*
*"La vela se adapta a ti. El código también."*
