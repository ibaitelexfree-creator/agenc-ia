# PLAN DE IMPLEMENTACIÓN — GETXO BELA ESKOLA LANDING PAGE
> **Norma única para la IA ejecutora:** No tomes ninguna decisión. Todo está aquí. Si un valor no está especificado en este documento, escríbelo en un comentario `// TODO: preguntar` y detente. No inventes nada. No simplifiques nada. No combines pasos. Ejecuta cada sub-sección en el orden indicado.

---

## ÍNDICE DE FASES

| Fase | Nombre | Semana |
|------|--------|--------|
| 0 | Setup, dependencias, estructura y assets | 1 |
| 1 | Motor de scroll no lineal | 2 |
| 2 | Sección 1 — Hero / ¿Qué es GBE? | 2–3 |
| 3 | Sección 2 — La vela se adapta a ti | 3–4 |
| 4 | Sección 3 — Descubre tu camino | 4–5 |
| 5 | Sección 4 — ¿Por qué navegar con nosotros? | 5 |
| 6 | Criaturas SVG, partículas y micro-animaciones globales | 5–6 |
| 7 | i18n completo (ES / EU / EN / FR) | Paralelo |
| 8 | Rendimiento, SEO y deploy | 6 |

---

## DECISIONES GLOBALES (leer antes de empezar cualquier fase)

### Concepto de navegación del canvas

El usuario **nunca se mueve**. El **canvas se mueve** alrededor suyo.
La metáfora central es "estás en cubierta": la proa del barco siempre visible en el borde inferior de pantalla. El scroll vertical del usuario se intercepta y se convierte en movimiento del canvas en 4 direcciones siguiendo esta ruta de tablero:

```
[S1: Hero]  ──────────────────►  [S2: La vela se adapta]
    ▲                                         │
    │                                         ▼
[S4: Por qué nosotros]  ◄──────  [S3: Descubre tu camino]
    │
    ▼
[CTA Final]
```

Coordenadas absolutas del canvas (las secciones son celdas de `100vw × 100vh`):

| Sección | translateX | translateY |
|---------|-----------|-----------|
| S1 Hero | `0` | `0` |
| S2 La vela | `-100vw` | `0` |
| S3 Descubre | `-100vw` | `-100vh` |
| S4 Por qué | `0` | `-100vh` |
| CTA Final | `0` | `-200vh` |

> **Nota sobre el signo:** el canvas se mueve en la dirección OPUESTA a donde va el contenido. Si el contenido está a la derecha (S2), el canvas se desplaza translateX negativo. Usar `useMotionValue` y `useSpring` de Framer Motion para animar estas coordenadas.

- El canvas total mide `200vw × 300vh`.
- El scroll ficticio forzado es de `500vh` (el contenedor sticky tiene `height: 500vh`).
- `scrollYProgress` (0→1) se divide en 4 segmentos iguales (0–0.25, 0.25–0.5, 0.5–0.75, 0.75–1.0) para los 4 movimientos de sección más el CTA.

### Paleta de colores (valores exactos — no cambiar)

```css
--ocean-deep:     #0D2137;   /* texto principal, fondos oscuros */
--ocean-mid:      #005B9A;   /* azul medio, iconos */
--ocean-bright:   #0A7EC8;   /* azul vivo, primario interactivo */
--ocean-light:    #4AAFE8;   /* azul claro, highlights */
--foam:           #E8F4FD;   /* fondo muy claro, cards */
--white:          #FFFFFF;
--gold:           #F5A623;   /* acento dorado, estrellas, badges */
--coral:          #E8593C;   /* CTA, botones de acción */
--text-primary:   #0D2137;
--text-secondary: #3D6080;
--text-muted:     #7A9AB5;
```

### Tipografía

- Fuente única: `Plus Jakarta Sans` (Google Fonts)
- Pesos a importar: `300, 400, 500, 600, 700`
- Fallback: `system-ui, -apple-system, sans-serif`
- Escala tipográfica:

| Rol | Tamaño desktop | Tamaño móvil | Peso |
|-----|---------------|-------------|------|
| Display hero | `clamp(3rem, 6vw, 5.5rem)` | `clamp(2.2rem, 8vw, 3.5rem)` | 700 |
| H2 sección | `clamp(2rem, 4vw, 3.5rem)` | `clamp(1.6rem, 6vw, 2.5rem)` | 600 |
| H3 subsección | `clamp(1.2rem, 2.5vw, 1.8rem)` | `1.3rem` | 600 |
| Body | `1.05rem` | `1rem` | 400 |
| Caption | `0.85rem` | `0.8rem` | 400 |
| Badge / label | `0.75rem` | `0.7rem` | 600 |

### Tabla de animaciones — valores exactos para Framer Motion

| Tipo | `duration` | `ease` | Nota de implementación |
|------|-----------|--------|----------------------|
| Entrada de texto (fade+slide) | `0.7` | `[0.25, 0.1, 0.25, 1]` | `y: 30 → 0, opacity: 0 → 1` |
| Transición de sección (canvas) | `0.9` | `[0.4, 0, 0.2, 1]` | spring stiffness 120, damping 20 |
| Aparición de criatura SVG | `0.5` | `easeOut` | `opacity: 0→1, scale: 0.8→1` |
| Contador numérico | `1.5` | `easeOut` | `useMotionValue + useSpring` |
| Hover en tarjeta | `0.2` | `easeInOut` | `scale: 1→1.03` |
| Ola de fondo (CSS keyframe) | `8s` | `ease-in-out` | `infinite alternate` |
| Balanceo de horizonte | `6s` | `ease-in-out` | `rotate: -0.5deg → 0.5deg, infinite` |
| Partícula de viento | `3s–6s` | `linear` | velocidad aleatoria en ese rango |
| Línea de ruta SVG (path draw) | `0.4` | `easeIn` | `pathLength: 0 → 1`, por sección |
| Proa del barco (rotación) | `0.6` | `[0.4, 0, 0.2, 1]` | `rotate: 0 → ±20deg` según dirección |
| Entrada de criatura desde borde | `0.8` | `[0.25, 0.1, 0.25, 1]` | `x: ±150 → 0` |

---

## FASE 0 — SETUP, DEPENDENCIAS Y ESTRUCTURA

### 0.1 — Crear el proyecto

Ejecutar exactamente estos comandos en orden:

```bash
npx create-next-app@14.2.5 getxo-bela-eskola \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

cd getxo-bela-eskola
```

### 0.2 — Instalar dependencias exactas

```bash
npm install \
  framer-motion@11.3.8 \
  next-intl@3.17.2 \
  @next/font@14.2.5

npm install -D \
  @types/node@20.14.9 \
  prettier@3.3.2
```

Verificar que el `package.json` contiene exactamente estas versiones antes de continuar.

### 0.3 — Estructura de carpetas a crear

Crear exactamente esta estructura. Los archivos marcados con `← CREAR VACÍO` se crean ahora como archivos vacíos. Los marcados con `← VER FASE X` se rellenan en esa fase:

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           ← VER 0.7
│   │   └── page.tsx             ← VER 0.8
│   └── globals.css              ← VER 0.6
├── components/
│   ├── layout/
│   │   ├── ScrollEngine.tsx     ← VER FASE 1
│   │   ├── Canvas.tsx           ← VER FASE 1
│   │   ├── Prow.tsx             ← VER FASE 1
│   │   └── CompassNav.tsx       ← VER FASE 1
│   ├── sections/
│   │   ├── Section1Hero.tsx     ← VER FASE 2
│   │   ├── Section2Adapts.tsx   ← VER FASE 3
│   │   ├── Section3Path.tsx     ← VER FASE 4
│   │   └── Section4Why.tsx      ← VER FASE 5
│   ├── ui/
│   │   ├── AnimatedText.tsx     ← CREAR VACÍO
│   │   ├── CounterNumber.tsx    ← CREAR VACÍO
│   │   ├── CourseCard.tsx       ← CREAR VACÍO
│   │   ├── ExperienceToggle.tsx ← CREAR VACÍO
│   │   └── LanguageSwitcher.tsx ← CREAR VACÍO
│   ├── creatures/
│   │   ├── Fish.tsx             ← VER FASE 6
│   │   ├── Seagull.tsx          ← VER FASE 6
│   │   ├── Jellyfish.tsx        ← VER FASE 6
│   │   ├── Starfish.tsx         ← VER FASE 6
│   │   ├── Crab.tsx             ← VER FASE 6
│   │   └── Windsurfer.tsx       ← VER FASE 6
│   └── decorative/
│       ├── WindParticles.tsx    ← VER FASE 6
│       ├── HorizonLine.tsx      ← VER FASE 6
│       └── WaveBackground.tsx   ← VER FASE 6
├── hooks/
│   ├── useScrollEngine.ts       ← VER FASE 1
│   └── useMediaQuery.ts         ← VER 0.9
├── lib/
│   └── scroll-map.ts            ← VER FASE 1
├── messages/
│   ├── es.json                  ← VER FASE 7
│   ├── eu.json                  ← VER FASE 7
│   ├── en.json                  ← VER FASE 7
│   └── fr.json                  ← VER FASE 7
├── public/
│   └── images/
│       ├── ai/                  ← directorio vacío (imágenes van aquí)
│       └── svg/                 ← directorio vacío (iconos estáticos)
├── styles/
│   └── animations.css           ← VER 0.10
├── i18n.ts                      ← VER 0.7
└── middleware.ts                ← VER 0.7
```

Comando para crear todos los directorios de una vez:

```bash
mkdir -p src/app/\[locale\] \
  src/components/layout \
  src/components/sections \
  src/components/ui \
  src/components/creatures \
  src/components/decorative \
  src/hooks \
  src/lib \
  src/messages \
  src/public/images/ai \
  src/public/images/svg \
  src/styles
```

### 0.4 — Configurar `tailwind.config.ts`

Reemplazar el contenido generado por `create-next-app` con exactamente este archivo:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ocean-deep':    '#0D2137',
        'ocean-mid':     '#005B9A',
        'ocean-bright':  '#0A7EC8',
        'ocean-light':   '#4AAFE8',
        'foam':          '#E8F4FD',
        'gold':          '#F5A623',
        'coral-accent':  '#E8593C',
        'text-secondary':'#3D6080',
        'text-muted':    '#7A9AB5',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'wave':          'wave 8s ease-in-out infinite alternate',
        'horizon-rock':  'horizonRock 6s ease-in-out infinite',
        'float':         'float 4s ease-in-out infinite',
        'drift':         'drift 12s linear infinite',
        'drift-reverse': 'driftReverse 15s linear infinite',
        'pulse-slow':    'pulseSlow 3s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        horizonRock: {
          '0%, 100%': { transform: 'rotate(-0.5deg)' },
          '50%':      { transform: 'rotate(0.5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        drift: {
          '0%':   { transform: 'translateX(-10vw)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        driftReverse: {
          '0%':   { transform: 'translateX(110vw)' },
          '100%': { transform: 'translateX(-10vw)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}

export default config
```

### 0.5 — Prompts para generar las imágenes IA

Generar estas imágenes con Midjourney v6 o DALL-E 3. Guardar como `.webp` a **1920×1080px máximo, calidad 85**. Colocarlas en `src/public/images/ai/`.

| Nombre de archivo | Prompt exacto |
|------------------|--------------|
| `hero-deck-getxo.webp` | `View from the deck of a sailing boat entering Getxo harbor, Basque Country Spain, early morning golden light, calm sea, distant green hills, wide angle lens, photorealistic, cinematic, no people visible, 16:9` |
| `section2-action-sea.webp` | `Sailing boat on the open Cantabrian Sea near Getxo, strong wind 25 knots, dynamic heeling, vivid blues and whites, aerial drone shot, photorealistic, cinematic` |
| `section2-calm-bay.webp` | `Peaceful sheltered bay of Getxo Abra interior, small sailboat, glassy water reflections, morning light, photorealistic, serene atmosphere, no people visible` |
| `section2-small-boat.webp` | `Small dinghy sailboat on calm water near Getxo coast, Basque Country, 2-3 people sailing, participatory sailing, bright day, photorealistic` |
| `section2-cruiser.webp` | `Large sailing cruiser boat with 6-8 people on deck, Cantabrian Sea, sunny day, social sailing, photorealistic, warm light` |
| `section3-nautical-map.webp` | `Vintage nautical chart of Basque coast near Bilbao Getxo, worn paper texture, compass rose, depth soundings, artistic overhead view, warm sepia and blue tones, no text` |
| `section4-community.webp` | `Group of diverse adults laughing on a sailing boat deck, Getxo harbor background, golden hour, authentic candid moment, photorealistic, joyful community` |
| `cta-sunset.webp` | `Getxo marina at sunset, sailboats moored in rows, orange and pink sky reflection in water, photorealistic, cinematic wide angle, no people` |

### 0.6 — Configurar `app/globals.css`

Reemplazar el `globals.css` generado por `create-next-app` con exactamente este contenido:

```css
/* src/app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
@import '../styles/animations.css';

:root {
  --ocean-deep:     #0D2137;
  --ocean-mid:      #005B9A;
  --ocean-bright:   #0A7EC8;
  --ocean-light:    #4AAFE8;
  --foam:           #E8F4FD;
  --white:          #FFFFFF;
  --gold:           #F5A623;
  --coral:          #E8593C;
  --text-primary:   #0D2137;
  --text-secondary: #3D6080;
  --text-muted:     #7A9AB5;
  --section-w:      100vw;
  --section-h:      100vh;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: var(--text-primary);
  background: var(--white);
  /* Ocultar scrollbar nativa, mantener scroll funcional */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  display: none;
}

body {
  overflow-x: hidden;
  /* El body tiene exactamente la altura del scroll ficticio */
  /* NOTA: No añadir height aquí — lo controla ScrollEngine */
}

/* Accesibilidad: respetar reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus visible para teclado */
:focus-visible {
  outline: 3px solid var(--ocean-bright);
  outline-offset: 3px;
  border-radius: 4px;
}
```

### 0.7 — Configurar next-intl (3 archivos)

**Archivo 1: `src/middleware.ts`**

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['es', 'eu', 'en', 'fr'],
  defaultLocale: 'es',
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*)(?!favicon\\.ico).*)'],
}
```

**Archivo 2: `src/i18n.ts`**

```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))
```

**Archivo 3: `next.config.ts`** (en la raíz del proyecto, NO dentro de `src/`):

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const nextConfig = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [375, 768, 1024, 1280, 1920],
  },
}

export default withNextIntl(nextConfig)
```

### 0.8 — Crear `app/[locale]/layout.tsx` y `page.tsx`

**Archivo: `src/app/[locale]/layout.tsx`**

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import '../globals.css'

const locales = ['es', 'eu', 'en', 'fr']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ['/images/ai/hero-deck-getxo.webp'],
      locale: locale,
      type: 'website',
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Archivo: `src/app/[locale]/page.tsx`**

```typescript
// src/app/[locale]/page.tsx
'use client'

import { ScrollEngine } from '@/components/layout/ScrollEngine'
import { Canvas } from '@/components/layout/Canvas'
import { Prow } from '@/components/layout/Prow'
import { CompassNav } from '@/components/layout/CompassNav'
import { Section1Hero } from '@/components/sections/Section1Hero'
import { Section2Adapts } from '@/components/sections/Section2Adapts'
import { Section3Path } from '@/components/sections/Section3Path'
import { Section4Why } from '@/components/sections/Section4Why'
import { WindParticles } from '@/components/decorative/WindParticles'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default function LandingPage() {
  return (
    <ScrollEngine>
      {/* Elementos fijos en pantalla (no se mueven con el canvas) */}
      <Prow />
      <CompassNav />
      <WindParticles />
      <LanguageSwitcher />

      {/* Canvas que contiene las 4 secciones en cuadrícula 2x2 + CTA */}
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

### 0.9 — Crear `hooks/useMediaQuery.ts`

```typescript
// src/hooks/useMediaQuery.ts
'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Hooks de conveniencia — usarlos en los componentes en lugar del query raw
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
```

### 0.10 — Crear `styles/animations.css`

```css
/* src/styles/animations.css */

/* ─── Olas del fondo ─── */
@keyframes waveScroll {
  0%   { transform: translateX(0) scaleY(1); }
  50%  { transform: translateX(-25%) scaleY(1.05); }
  100% { transform: translateX(-50%) scaleY(1); }
}

/* ─── Balanceo suave del horizonte ─── */
@keyframes horizonRock {
  0%, 100% { transform: rotate(-0.5deg); }
  50%       { transform: rotate(0.5deg); }
}

/* ─── Flotación de criaturas ─── */
@keyframes floatY {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
}

/* ─── Deriva de partículas (izquierda a derecha) ─── */
@keyframes driftRight {
  0%   { transform: translateX(-5vw) translateY(0); opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.7; }
  100% { transform: translateX(105vw) translateY(-20px); opacity: 0; }
}

/* ─── Deriva inversa (derecha a izquierda) ─── */
@keyframes driftLeft {
  0%   { transform: translateX(105vw) translateY(0); opacity: 0; }
  10%  { opacity: 0.5; }
  90%  { opacity: 0.5; }
  100% { transform: translateX(-5vw) translateY(10px); opacity: 0; }
}

/* ─── Pulso lento para badges y CTAs ─── */
@keyframes pulseSlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(10, 126, 200, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(10, 126, 200, 0); }
}

/* ─── Aparición desde el fondo (scale) ─── */
@keyframes emergeFromSea {
  0%   { transform: translateY(40px) scale(0.9); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

/* ─── Movimiento de aleta de pez ─── */
@keyframes fishTail {
  0%, 100% { transform: rotate(-8deg); }
  50%       { transform: rotate(8deg); }
}

/* ─── Parpadeo suave de medusa ─── */
@keyframes jellyfishPulse {
  0%, 100% { transform: scaleY(1) scaleX(1); }
  40%       { transform: scaleY(0.85) scaleX(1.1); }
  70%       { transform: scaleY(1.05) scaleX(0.97); }
}
```

---

## FASE 1 — MOTOR DE SCROLL NO LINEAL

> Esta es la fase más crítica. Debe quedar perfecta antes de continuar.

### 1.1 — Crear `lib/scroll-map.ts`

Este archivo define el mapa completo de la ruta no lineal. Es la fuente de verdad para todo el proyecto:

```typescript
// src/lib/scroll-map.ts

export type ScrollStep = {
  id: string
  sectionIndex: number          // qué sección se ve (0=S1, 1=S2, 2=S3, 3=S4, 4=CTA)
  canvasX: string               // translateX del canvas (en unidades CSS, e.g. '0vw', '-100vw')
  canvasY: string               // translateY del canvas
  scrollStart: number           // 0.0 → 1.0 en scrollYProgress
  scrollEnd: number             // 0.0 → 1.0 en scrollYProgress
  prowRotation: number          // grados de rotación de la proa (0 = abajo, -20 = derecha, 20 = izquierda)
  prowLabel: 'down' | 'right' | 'down2' | 'left' | 'down3'
  compassAngle: number          // grados del indicador brújula
}

export const SCROLL_MAP: ScrollStep[] = [
  {
    id: 's1-hero',
    sectionIndex: 0,
    canvasX: '0vw',
    canvasY: '0vh',
    scrollStart: 0,
    scrollEnd: 0.2,
    prowRotation: 0,
    prowLabel: 'right',
    compassAngle: 0,
  },
  {
    id: 's1-to-s2',          // transición: scroll derecha hacia S2
    sectionIndex: 1,
    canvasX: '-100vw',
    canvasY: '0vh',
    scrollStart: 0.2,
    scrollEnd: 0.4,
    prowRotation: -20,
    prowLabel: 'down',
    compassAngle: 90,
  },
  {
    id: 's2-to-s3',          // transición: scroll hacia abajo hacia S3
    sectionIndex: 2,
    canvasX: '-100vw',
    canvasY: '-100vh',
    scrollStart: 0.4,
    scrollEnd: 0.6,
    prowRotation: 0,
    prowLabel: 'left',
    compassAngle: 180,
  },
  {
    id: 's3-to-s4',          // transición: scroll izquierda hacia S4
    sectionIndex: 3,
    canvasX: '0vw',
    canvasY: '-100vh',
    scrollStart: 0.6,
    scrollEnd: 0.8,
    prowRotation: 20,
    prowLabel: 'down3',
    compassAngle: 270,
  },
  {
    id: 's4-to-cta',         // transición: scroll hacia abajo hacia CTA
    sectionIndex: 4,
    canvasX: '0vw',
    canvasY: '-200vh',
    scrollStart: 0.8,
    scrollEnd: 1.0,
    prowRotation: 0,
    prowLabel: 'down3',
    compassAngle: 360,
  },
]

// Altura total del scroll ficticio en vh
export const TOTAL_SCROLL_HEIGHT_VH = 500

// Breakpoint para lógica condicional
export const MOBILE_BREAKPOINT_PX = 768
```

### 1.2 — Crear `hooks/useScrollEngine.ts`

```typescript
// src/hooks/useScrollEngine.ts
'use client'

import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { SCROLL_MAP, TOTAL_SCROLL_HEIGHT_VH } from '@/lib/scroll-map'

type ScrollEngineReturn = {
  containerRef: React.RefObject<HTMLDivElement>
  canvasX: MotionValue<string>
  canvasY: MotionValue<string>
  prowRotation: MotionValue<number>
  compassAngle: MotionValue<number>
  scrollYProgress: MotionValue<number>
  currentSection: MotionValue<number>
}

export function useScrollEngine(): ScrollEngineReturn {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Canvas X: interpolar entre las posiciones X del mapa ──────────────────
  // Extraer los keyframes del mapa
  const xScrollPoints = SCROLL_MAP.map((s) => s.scrollStart)
  const xValues = SCROLL_MAP.map((s) => s.canvasX)

  // useTransform con arrays (keyframe multi-punto)
  const rawCanvasX = useTransform(scrollYProgress, xScrollPoints, xValues)
  const canvasX = useSpring(rawCanvasX, { stiffness: 120, damping: 20, mass: 1 })

  // ── Canvas Y ────────────────────────────────────────────────────────────────
  const yScrollPoints = SCROLL_MAP.map((s) => s.scrollStart)
  const yValues = SCROLL_MAP.map((s) => s.canvasY)
  const rawCanvasY = useTransform(scrollYProgress, yScrollPoints, yValues)
  const canvasY = useSpring(rawCanvasY, { stiffness: 120, damping: 20, mass: 1 })

  // ── Rotación de proa ────────────────────────────────────────────────────────
  const prowScrollPoints = SCROLL_MAP.map((s) => s.scrollStart)
  const prowValues = SCROLL_MAP.map((s) => s.prowRotation)
  const rawProw = useTransform(scrollYProgress, prowScrollPoints, prowValues)
  const prowRotation = useSpring(rawProw, { stiffness: 80, damping: 15, mass: 1 })

  // ── Ángulo de brújula ───────────────────────────────────────────────────────
  const compassScrollPoints = SCROLL_MAP.map((s) => s.scrollStart)
  const compassValues = SCROLL_MAP.map((s) => s.compassAngle)
  const rawCompass = useTransform(scrollYProgress, compassScrollPoints, compassValues)
  const compassAngle = useSpring(rawCompass, { stiffness: 60, damping: 12 })

  // ── Índice de sección actual ────────────────────────────────────────────────
  const currentSection = useTransform(scrollYProgress, (progress: number) => {
    const step = SCROLL_MAP.find(
      (s) => progress >= s.scrollStart && progress < s.scrollEnd
    )
    return step ? step.sectionIndex : 4
  })

  return {
    containerRef,
    canvasX,
    canvasY,
    prowRotation,
    compassAngle,
    scrollYProgress,
    currentSection,
  }
}
```

### 1.3 — Crear `components/layout/ScrollEngine.tsx`

```typescript
// src/components/layout/ScrollEngine.tsx
'use client'

import React, { createContext, useContext } from 'react'
import { MotionValue } from 'framer-motion'
import { useScrollEngine } from '@/hooks/useScrollEngine'
import { TOTAL_SCROLL_HEIGHT_VH } from '@/lib/scroll-map'

// ── Context para pasar valores a hijos ────────────────────────────────────────
type ScrollContextType = {
  canvasX: MotionValue<string>
  canvasY: MotionValue<string>
  prowRotation: MotionValue<number>
  compassAngle: MotionValue<number>
  scrollYProgress: MotionValue<number>
  currentSection: MotionValue<number>
}

export const ScrollContext = createContext<ScrollContextType | null>(null)

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScrollContext must be used inside ScrollEngine')
  return ctx
}

// ── Componente principal ──────────────────────────────────────────────────────
export function ScrollEngine({ children }: { children: React.ReactNode }) {
  const engine = useScrollEngine()

  return (
    <ScrollContext.Provider value={engine}>
      {/*
        Contenedor sticky: define la altura de scroll ficticio.
        El hijo sticky ocupa 100vh y es el viewport real.
      */}
      <div
        ref={engine.containerRef}
        style={{ height: `${TOTAL_SCROLL_HEIGHT_VH}vh` }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  )
}
```

### 1.4 — Crear `components/layout/Canvas.tsx`

```typescript
// src/components/layout/Canvas.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { useScrollContext } from './ScrollEngine'

export function Canvas({ children }: { children: React.ReactNode }) {
  const { canvasX, canvasY } = useScrollContext()

  return (
    <motion.div
      style={{
        // El canvas mide 200vw × 300vh para albergar la cuadrícula 2×2 + CTA
        width: '200vw',
        height: '300vh',
        position: 'absolute',
        top: 0,
        left: 0,
        // Animamos con las MotionValues del ScrollEngine
        translateX: canvasX,
        translateY: canvasY,
        // Cuadrícula CSS:
        // Col 1: S1 Hero (x=0)    Col 2: S2 La vela (x=100vw)
        // Row 1: y=0     Row 2: y=100vh    Row 3 (solo col 1): y=200vh = CTA
        display: 'grid',
        gridTemplateColumns: '100vw 100vw',
        gridTemplateRows: '100vh 100vh 100vh',
        gridTemplateAreas: `
          "s1 s2"
          "s4 s3"
          "cta cta"
        `,
      }}
    >
      {/*
        Los hijos se posicionan en las grid areas.
        Section1Hero → area "s1"
        Section2Adapts → area "s2"
        Section3Path → area "s3"
        Section4Why → area "s4"
        El CTA ocupa "cta" — se añade en Fase 5
      */}
      {children}
    </motion.div>
  )
}
```

### 1.5 — Crear `components/layout/Prow.tsx`

La proa siempre visible en el borde inferior de pantalla. Rota suavemente según la dirección de scroll.

```typescript
// src/components/layout/Prow.tsx
'use client'

import { motion } from 'framer-motion'
import { useScrollContext } from './ScrollEngine'

export function Prow() {
  const { prowRotation } = useScrollContext()

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        translateX: '-50%',
        zIndex: 50,
        pointerEvents: 'none',
        // La rotación anima según el scroll
        rotate: prowRotation,
        transformOrigin: 'bottom center',
      }}
    >
      {/* SVG de la proa — vista frontal de un casco de velero */}
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Casco del barco — forma de proa */}
        <path
          d="M60 0 C40 20 10 50 5 80 L115 80 C110 50 80 20 60 0Z"
          fill="#0D2137"
          opacity="0.9"
        />
        {/* Línea de cubierta */}
        <path
          d="M20 60 Q60 45 100 60"
          stroke="#4AAFE8"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
        {/* Mástil */}
        <line
          x1="60"
          y1="5"
          x2="60"
          y2="45"
          stroke="#0A7EC8"
          strokeWidth="2"
          opacity="0.6"
        />
        {/* Reflejo en el agua (blur simulado) */}
        <ellipse
          cx="60"
          cy="78"
          rx="45"
          ry="5"
          fill="#4AAFE8"
          opacity="0.15"
        />
      </svg>

      {/* Texto indicador de scroll — aparece/desaparece según dirección */}
      <motion.p
        style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginTop: '4px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 600,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        scroll
      </motion.p>
    </motion.div>
  )
}
```

### 1.6 — Crear `components/layout/CompassNav.tsx`

Brújula en la esquina inferior derecha que indica en qué sección está el usuario:

```typescript
// src/components/layout/CompassNav.tsx
'use client'

import { motion } from 'framer-motion'
import { useScrollContext } from './ScrollEngine'

const SECTION_LABELS = {
  es: ['Inicio', 'La vela', 'Tu camino', 'Por qué', 'Únete'],
  eu: ['Hasiera', 'Vela', 'Zure bidea', 'Zergatik', 'Bat egin'],
  en: ['Home', 'Sailing', 'Your path', 'Why us', 'Join'],
  fr: ['Accueil', 'La voile', 'Ton chemin', 'Pourquoi', 'Rejoindre'],
}

// Los 4 dots representan las 4 secciones + CTA
const DOT_POSITIONS = [
  { x: 0, y: 0, label: 0 },    // S1: arriba izquierda del mapa
  { x: 1, y: 0, label: 1 },    // S2: arriba derecha
  { x: 1, y: 1, label: 2 },    // S3: abajo derecha
  { x: 0, y: 1, label: 3 },    // S4: abajo izquierda
]

export function CompassNav() {
  const { currentSection, compassAngle } = useScrollContext()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      {/* Mini-mapa 2×2 con dots */}
      <div
        style={{
          width: '44px',
          height: '44px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '4px',
          backgroundColor: 'rgba(13, 33, 55, 0.6)',
          borderRadius: '8px',
          padding: '6px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(74, 175, 232, 0.3)',
        }}
      >
        {DOT_POSITIONS.map((dot) => (
          <motion.div
            key={dot.label}
            style={{
              borderRadius: '50%',
              backgroundColor:
                dot.label === 0 ? 'var(--ocean-bright)' : 'var(--text-muted)',
              opacity: 0.6,
            }}
            animate={(progress: number) => {
              // El dot activo se ilumina — lógica simplificada con motion values
            }}
          />
        ))}
      </div>

      {/* Aguja de brújula */}
      <motion.div
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--gold)',
          borderRadius: '50%',
          margin: '4px auto 0',
          rotate: compassAngle,
        }}
      />
    </div>
  )
}
```

> **NOTA para la IA ejecutora:** La lógica de iluminar el dot activo requiere subscribe a la MotionValue `currentSection`. Implementar con `useMotionValueEvent` de Framer Motion para leer el valor y hacer `useState` local. Ejemplo:
> ```typescript
> const [activeSection, setActiveSection] = useState(0)
> useMotionValueEvent(currentSection, 'change', (v) => setActiveSection(Math.round(v)))
> ```

### 1.7 — Test de la Fase 1

Ejecutar `npm run dev` y verificar:
1. La página muestra el contenedor con `height: 500vh` (verificar con DevTools → computed styles).
2. Hacer scroll con mouse/trackpad: la proa del barco debe rotar suavemente.
3. No debe haber errores en consola relacionados con Framer Motion.
4. En `prefers-reduced-motion: reduce` el scroll debe seguir funcionando (sin animaciones).

---

## FASE 2 — SECCIÓN 1: HERO / ¿QUÉ ES GETXO BELA ESKOLA?

### 2.1 — Concepto visual de la sección

- Posición en el canvas: `grid-area: s1` (columna 1, fila 1 — `x=0, y=0`)
- Fondo: imagen `hero-deck-getxo.webp` cubriendo todo el 100vw × 100vh, con overlay gradiente.
- Overlay: `linear-gradient(to bottom, rgba(13,33,55,0.2) 0%, rgba(13,33,55,0.75) 100%)`
- Contenido: centrado horizontal y verticalmente con flexbox.
- Criaturas que aparecen: **gaviota** (entra desde arriba derecha), **pez pequeño** (entra desde abajo izquierda) — ver Fase 6.
- Animaciones de entrada: el logo y el título aparecen con `emergeFromSea` al cargar la página (una vez).

### 2.2 — Textos exactos para la Sección 1 (en los 4 idiomas)

> Estos textos van en los archivos `messages/*.json` (Fase 7), pero se listan aquí para que el componente los referencia correctamente.

| Clave i18n | ES | EU | EN | FR |
|-----------|----|----|----|----|
| `s1.eyebrow` | `Getxo · Bizkaia` | `Getxo · Bizkaia` | `Getxo · Bizkaia` | `Getxo · Bizkaia` |
| `s1.title` | `No somos una escuela. Somos tu mar.` | `Ez gara eskola bat. Zu zaren itsasoa gara.` | `We're not a school. We're your sea.` | `On n'est pas une école. On est ta mer.` |
| `s1.subtitle` | `Un punto de encuentro donde la vela es el pretexto para compartir, crecer y sentir el mar sin presión.` | `Elkargune bat non bela aitzakia den partekatzeko, hazteko eta itsasoa sentitzeko presiorik gabe.` | `A meeting point where sailing is the excuse to share, grow and feel the sea without pressure.` | `Un lieu de rencontre où la voile est le prétexte pour partager, grandir et ressentir la mer sans pression.` |
| `s1.cta` | `Descubrir →` | `Aurkitu →` | `Discover →` | `Découvrir →` |
| `s1.scroll_hint` | `Sigue navegando` | `Jarraitu nabigatzera` | `Keep sailing` | `Continue à naviguer` |

### 2.3 — Crear `components/sections/Section1Hero.tsx`

```typescript
// src/components/sections/Section1Hero.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Seagull } from '@/components/creatures/Seagull'
import { Fish } from '@/components/creatures/Fish'

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
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function Section1Hero() {
  const t = useTranslations('s1')

  return (
    <section
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
      {/* Imagen de fondo — fotograma del Abra */}
      <Image
        src="/images/ai/hero-deck-getxo.webp"
        alt="Vista desde cubierta del velero en el Abra de Getxo"
        fill
        priority
        quality={85}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* Overlay gradiente oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,33,55,0.2) 0%, rgba(13,33,55,0.75) 100%)',
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
        }}
      >
        {/* Dos capas de ola SVG que se mueven en bucle */}
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', width: '200%', height: '100%' }}
        >
          {/* Repetir el mismo SVG de ola dos veces para el loop seamless */}
          <WaveSVG opacity={0.4} />
          <WaveSVG opacity={0.4} />
        </motion.div>
      </div>

      {/* Contenido principal — centrado en el viewport */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '800px',
          color: 'var(--white)',
        }}
      >
        {/* Eyebrow — ubicación */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ocean-light)',
            marginBottom: '1rem',
          }}
        >
          {t('eyebrow')}
        </motion.p>

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

        {/* CTA */}
        <motion.a
          variants={itemVariants}
          href="#"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--coral)',
            color: 'var(--white)',
            padding: '0.85rem 2.5rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.03em',
            boxShadow: '0 4px 24px rgba(232, 89, 60, 0.4)',
            animation: 'pulseSlow 3s ease-in-out infinite',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {t('cta')}
        </motion.a>
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
      {/* Velero pequeño SVG como icono */}
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

// ── Componente interno: ola SVG ────────────────────────────────────────────────
function WaveSVG({ opacity }: { opacity: number }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '50%', height: '100%', flexShrink: 0 }}
      preserveAspectRatio="none"
    >
      <path
        d="M0 60 C180 20 360 100 540 60 C720 20 900 100 1080 60 C1260 20 1380 90 1440 60 L1440 120 L0 120 Z"
        fill={`rgba(10, 126, 200, ${opacity})`}
      />
    </svg>
  )
}
```

---

## FASE 3 — SECCIÓN 2: LA VELA SE ADAPTA A TI

### 3.1 — Concepto visual de la sección

- Posición en el canvas: `grid-area: s2` (columna 2, fila 1 — `x=100vw, y=0`)
- Fondo: base blanca `var(--white)` con una franja de imagen `section2-open-sea.webp` en el 50% superior.
- Overlay de imagen: `linear-gradient(to bottom, rgba(13,33,55,0.3) 0%, #ffffff 90%)`
- Layout en dos zonas verticales: zona imagen (50% superior) + zona de opciones (50% inferior, blanca).
- Las 4 opciones (Tipo, Escenario, Con quién, Forma moderna) se muestran como **tarjetas toggle** interactivas.
- El toggle `Calma / Acción` cambia la imagen de fondo al hacer click.
- Criaturas: **windsurf SVG** entra desde la derecha durante la transición hacia esta sección.

### 3.2 — Textos exactos para Sección 2

| Clave i18n | ES |
|-----------|-----|
| `s2.eyebrow` | `La experiencia` |
| `s2.title` | `La vela se adapta a ti` |
| `s2.subtitle` | `No hay dos días iguales en el mar. Tú eliges cómo vivirlo.` |
| `s2.card1.label` | `Tipo de experiencia` |
| `s2.card1.option_a` | `☁️ Calma` |
| `s2.card1.option_a_desc` | `Desconectar sin prisa, aguas tranquilas` |
| `s2.card1.option_b` | `💨 Acción` |
| `s2.card1.option_b_desc` | `Viento fuerte, sensaciones intensas` |
| `s2.card2.label` | `El escenario` |
| `s2.card2.option_a` | `🌊 Abra interior` |
| `s2.card2.option_a_desc` | `Aguas protegidas, ideal para empezar` |
| `s2.card2.option_b` | `🌊🌊 Abra exterior` |
| `s2.card2.option_b_desc` | `Mar abierto, olas, aventura` |
| `s2.card3.label` | `Con quién navegar` |
| `s2.card3.option_a` | `⛵ Velero pequeño` |
| `s2.card3.option_a_desc` | `2–6 personas, muy participativo` |
| `s2.card3.option_b` | `🚢 Crucero` |
| `s2.card3.option_b_desc` | `Hasta 8 personas, espacio y comodidad` |
| `s2.card4.label` | `Forma de navegar` |
| `s2.card4.body` | `Los partes meteorológicos actuales permiten prever exactamente las condiciones. Sales cuando quieres, con lo que buscas.` |
| `s2.card4.badge` | `Vela moderna ✦` |

> Traducir al EU/EN/FR en Fase 7.

### 3.3 — Crear `components/ui/ExperienceToggle.tsx`

```typescript
// src/components/ui/ExperienceToggle.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ExperienceToggleProps = {
  label: string
  optionA: { label: string; description: string }
  optionB: { label: string; description: string }
  onToggle?: (selected: 'a' | 'b') => void
}

export function ExperienceToggle({ label, optionA, optionB, onToggle }: ExperienceToggleProps) {
  const [selected, setSelected] = useState<'a' | 'b'>('a')

  const handleSelect = (option: 'a' | 'b') => {
    setSelected(option)
    onToggle?.(option)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--foam)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(10, 126, 200, 0.15)',
      }}
    >
      {/* Etiqueta */}
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
        }}
      >
        {label}
      </p>

      {/* Botones de toggle */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '0.75rem',
        }}
      >
        {(['a', 'b'] as const).map((opt) => {
          const option = opt === 'a' ? optionA : optionB
          const isActive = selected === opt
          return (
            <motion.button
              key={opt}
              onClick={() => handleSelect(opt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                border: isActive
                  ? '2px solid var(--ocean-bright)'
                  : '2px solid transparent',
                backgroundColor: isActive ? 'var(--ocean-bright)' : 'white',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {option.label}
            </motion.button>
          )
        })}
      </div>

      {/* Descripción animada */}
      <AnimatePresence mode="wait">
        <motion.p
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {selected === 'a' ? optionA.description : optionB.description}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
```

### 3.4 — Crear `components/sections/Section2Adapts.tsx`

```typescript
// src/components/sections/Section2Adapts.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ExperienceToggle } from '@/components/ui/ExperienceToggle'
import { Windsurfer } from '@/components/creatures/Windsurfer'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function Section2Adapts() {
  const t = useTranslations('s2')
  const [experienceType, setExperienceType] = useState<'a' | 'b'>('a')

  // La imagen cambia según el tipo de experiencia seleccionado
  const bgImage = experienceType === 'a'
    ? '/images/ai/section2-calm-bay.webp'
    : '/images/ai/section2-action-sea.webp'

  return (
    <section
      style={{
        gridArea: 's2',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Zona superior — imagen reactiva */}
      <div style={{ position: 'relative', height: '45%', overflow: 'hidden' }}>
        <motion.div
          key={bgImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={bgImage}
            alt="Experiencia de navegación"
            fill
            quality={80}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>
        {/* Gradiente fade hacia blanco */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13,33,55,0.15) 0%, #ffffff 100%)',
          }}
        />
      </div>

      {/* Zona inferior — tarjetas de opciones */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--white)',
          padding: 'clamp(1rem, 3vh, 2rem) clamp(1.5rem, 5vw, 4rem)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ marginBottom: '1.5rem' }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ocean-bright)',
              marginBottom: '0.5rem',
            }}
          >
            {t('eyebrow')}
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--ocean-deep)',
              lineHeight: 1.15,
              marginBottom: '0.5rem',
            }}
          >
            {t('title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid de 4 tarjetas toggle */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Tarjeta 1: Tipo de experiencia */}
          <motion.div variants={cardVariant}>
            <ExperienceToggle
              label={t('card1.label')}
              optionA={{ label: t('card1.option_a'), description: t('card1.option_a_desc') }}
              optionB={{ label: t('card1.option_b'), description: t('card1.option_b_desc') }}
              onToggle={setExperienceType}
            />
          </motion.div>

          {/* Tarjeta 2: El escenario */}
          <motion.div variants={cardVariant}>
            <ExperienceToggle
              label={t('card2.label')}
              optionA={{ label: t('card2.option_a'), description: t('card2.option_a_desc') }}
              optionB={{ label: t('card2.option_b'), description: t('card2.option_b_desc') }}
            />
          </motion.div>

          {/* Tarjeta 3: Con quién navegar */}
          <motion.div variants={cardVariant}>
            <ExperienceToggle
              label={t('card3.label')}
              optionA={{ label: t('card3.option_a'), description: t('card3.option_a_desc') }}
              optionB={{ label: t('card3.option_b'), description: t('card3.option_b_desc') }}
            />
          </motion.div>

          {/* Tarjeta 4: Forma moderna (sin toggle — solo informativa) */}
          <motion.div
            variants={cardVariant}
            style={{
              backgroundColor: 'var(--ocean-deep)',
              borderRadius: '16px',
              padding: '1.25rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--gold)',
                color: 'var(--ocean-deep)',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '20px',
                marginBottom: '0.75rem',
              }}
            >
              {t('card4.badge')}
            </span>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {t('card4.body')}
            </p>
            {/* Decoración: ola subtle en la esquina */}
            <svg
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                opacity: 0.1,
              }}
              width="80"
              height="50"
              viewBox="0 0 80 50"
            >
              <path d="M0 30 C20 10 40 40 60 20 C70 10 80 30 80 30 L80 50 L0 50 Z" fill="white" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Criatura — windsurf entrando desde la derecha */}
      <Windsurfer
        style={{ position: 'absolute', top: '20%', right: '-5%', zIndex: 20 }}
        enterDelay={0.5}
      />
    </section>
  )
}
```

---

## FASE 4 — SECCIÓN 3: DESCUBRE TU CAMINO

### 4.1 — Concepto visual de la sección

- Posición en el canvas: `grid-area: s3` (columna 2, fila 2 — `x=100vw, y=100vh`)
- Fondo: imagen `section3-nautical-map.webp` como fondo tenue (opacity 0.08) sobre `var(--foam)`.
- Layout: centrado, ancho máximo 900px.
- Estructura: **árbol de decisión interactivo** con dos ramas principales (Nivel básico / Nivel medio) que se expanden al hacer click, revelando subramas (Jóvenes / Adultos/as).
- Las líneas del árbol se **dibujan con SVG animado** (`pathLength: 0 → 1`) cuando la sección entra en viewport.
- Criaturas: **estrella de mar** aparece en la esquina inferior izquierda.
- **Importante:** los botones finales del árbol llevan a la URL de la web existente para cada curso.

### 4.2 — Textos exactos para Sección 3

| Clave i18n | ES |
|-----------|-----|
| `s3.eyebrow` | `Formación` |
| `s3.title` | `Descubre tu camino` |
| `s3.subtitle` | `¿Cuál es tu nivel y cuánto tiempo tienes?` |
| `s3.level_basic` | `Nivel básico` |
| `s3.level_mid` | `Nivel medio` |
| `s3.youth` | `Jóvenes` |
| `s3.adult` | `Adultos / Adultas` |
| `s3.course.txikigune` | `Días sueltos (Txikigune)` |
| `s3.course.udalekuak` | `5 días seguidos (Udalekuak)` |
| `s3.course.continuous_kids` | `3 días/mes todo el año` |
| `s3.course.cruiser_init` | `Crucero iniciación` |
| `s3.course.vl_init` | `Vela ligera iniciación (3 días)` |
| `s3.course.vl_advanced` | `Vela ligera avanzado (2 días)` |
| `s3.course.cruiser_perf` | `Crucero perfeccionamiento (2 días)` |
| `s3.course.gennaker` | `Crucero con gennaker (2 días)` |
| `s3.course.tech_team` | `Equipo tecnificación (3 días/mes)` |
| `s3.cta_course` | `Ver programa →` |

### 4.3 — Crear `components/ui/CourseCard.tsx`

```typescript
// src/components/ui/CourseCard.tsx
'use client'

import { motion } from 'framer-motion'

type CourseCardProps = {
  name: string
  duration?: string
  href?: string
  highlight?: boolean
  ctaLabel: string
}

export function CourseCard({ name, duration, href = '#', highlight = false, ctaLabel }: CourseCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{
        display: 'block',
        backgroundColor: highlight ? 'var(--ocean-bright)' : 'white',
        color: highlight ? 'white' : 'var(--ocean-deep)',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        border: highlight ? 'none' : '1px solid rgba(10, 126, 200, 0.2)',
        textDecoration: 'none',
        boxShadow: highlight
          ? '0 4px 20px rgba(10, 126, 200, 0.3)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '0.5rem',
      }}
    >
      <p
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          lineHeight: 1.3,
          marginBottom: duration ? '0.3rem' : 0,
        }}
      >
        {name}
      </p>
      {duration && (
        <p
          style={{
            fontSize: '0.75rem',
            opacity: highlight ? 0.85 : 0.6,
            fontWeight: 400,
          }}
        >
          {duration}
        </p>
      )}
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          marginTop: '0.5rem',
          color: highlight ? 'rgba(255,255,255,0.9)' : 'var(--ocean-bright)',
          letterSpacing: '0.05em',
        }}
      >
        {ctaLabel}
      </p>
    </motion.a>
  )
}
```

### 4.4 — Crear `components/sections/Section3Path.tsx`

```typescript
// src/components/sections/Section3Path.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CourseCard } from '@/components/ui/CourseCard'
import { Starfish } from '@/components/creatures/Starfish'

// Estructura de datos del árbol de cursos
// href: URL de la sección correspondiente en getxobelaeskola.cloud/es/
const COURSE_TREE = {
  basic: {
    youth: [
      { key: 'txikigune', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'udalekuak', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'continuous_kids', href: 'https://getxobelaeskola.cloud/es/' },
    ],
    adult: [
      { key: 'cruiser_init', href: 'https://getxobelaeskola.cloud/es/', highlight: true },
    ],
  },
  mid: {
    youth: [
      { key: 'txikigune', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'udalekuak', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'continuous_kids', href: 'https://getxobelaeskola.cloud/es/' },
    ],
    adult: [
      { key: 'vl_init', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'vl_advanced', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'cruiser_perf', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'gennaker', href: 'https://getxobelaeskola.cloud/es/' },
      { key: 'tech_team', href: 'https://getxobelaeskola.cloud/es/', highlight: true },
    ],
  },
}

type Level = 'basic' | 'mid' | null
type Profile = 'youth' | 'adult' | null

export function Section3Path() {
  const t = useTranslations('s3')
  const [selectedLevel, setSelectedLevel] = useState<Level>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile>(null)

  const handleLevelClick = (level: Level) => {
    setSelectedLevel(level === selectedLevel ? null : level)
    setSelectedProfile(null)
  }

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile === selectedProfile ? null : profile)
  }

  const courses = selectedLevel && selectedProfile
    ? COURSE_TREE[selectedLevel][selectedProfile]
    : []

  return (
    <section
      style={{
        gridArea: 's3',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--foam)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Mapa náutico de fondo — muy sutil */}
      <Image
        src="/images/ai/section3-nautical-map.webp"
        alt=""
        fill
        quality={60}
        style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.07 }}
        aria-hidden
      />

      {/* Contenido */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '800px',
          padding: 'clamp(1.5rem, 4vh, 3rem) clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ocean-bright)',
              marginBottom: '0.5rem',
            }}
          >
            {t('eyebrow')}
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--ocean-deep)',
              marginBottom: '0.5rem',
            }}
          >
            {t('title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* PASO 1: Seleccionar nivel */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {(['basic', 'mid'] as Level[]).map((level) => (
            <motion.button
              key={level}
              onClick={() => handleLevelClick(level)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1,
                maxWidth: '220px',
                padding: '1rem 1.5rem',
                borderRadius: '14px',
                border: selectedLevel === level
                  ? '2px solid var(--ocean-bright)'
                  : '2px solid rgba(10, 126, 200, 0.2)',
                backgroundColor: selectedLevel === level ? 'var(--ocean-bright)' : 'white',
                color: selectedLevel === level ? 'white' : 'var(--ocean-deep)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: selectedLevel === level
                  ? '0 4px 20px rgba(10, 126, 200, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
              }}
            >
              {level === 'basic' ? `⚓ ${t('level_basic')}` : `🌊 ${t('level_mid')}`}
            </motion.button>
          ))}
        </div>

        {/* PASO 2: Seleccionar perfil (aparece cuando hay nivel) */}
        <AnimatePresence>
          {selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}
            >
              {(['youth', 'adult'] as Profile[]).map((profile) => (
                <motion.button
                  key={profile}
                  onClick={() => handleProfileClick(profile)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '0.7rem 1.25rem',
                    borderRadius: '50px',
                    border: selectedProfile === profile
                      ? '2px solid var(--ocean-mid)'
                      : '2px solid rgba(0, 91, 154, 0.2)',
                    backgroundColor: selectedProfile === profile ? 'var(--ocean-mid)' : 'white',
                    color: selectedProfile === profile ? 'white' : 'var(--ocean-mid)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {profile === 'youth' ? `🧒 ${t('youth')}` : `🧑 ${t('adult')}`}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PASO 3: Lista de cursos (aparece cuando hay nivel + perfil) */}
        <AnimatePresence>
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {courses.map((course, i) => (
                <motion.div
                  key={course.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <CourseCard
                    name={t(`course.${course.key}`)}
                    href={course.href}
                    highlight={'highlight' in course ? course.highlight as boolean : false}
                    ctaLabel={t('cta_course')}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Criatura — estrella de mar esquina inferior izquierda */}
      <Starfish
        style={{ position: 'absolute', bottom: '5%', left: '3%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
```

---

## FASE 5 — SECCIÓN 4: ¿POR QUÉ NAVEGAR CON NOSOTROS? + CTA

### 5.1 — Concepto visual de la sección

- Posición en el canvas: `grid-area: s4` (columna 1, fila 2 — `x=0, y=100vh`)
- Fondo: blanco con imagen `section4-community.webp` en el 50% superior.
- Overlay de imagen: `linear-gradient(to bottom, rgba(13,33,55,0.25) 0%, #ffffff 85%)`
- Los 3 pilares se muestran como **cards grandes** con iconos SVG propios, con el contador animado de `52,5€`.
- CTA final: sección separada a `y=200vh` con imagen `cta-sunset.webp` de fondo.
- Criaturas: **cangrejo** aparece en la esquina inferior derecha de la S4.

### 5.2 — Textos exactos Sección 4

| Clave i18n | ES |
|-----------|-----|
| `s4.eyebrow` | `Nuestra promesa` |
| `s4.title` | `¿Por qué navegar con nosotros?` |
| `s4.pillar1.icon` | `💶` |
| `s4.pillar1.title` | `Accesible para todos` |
| `s4.pillar1.body` | `Escuela municipal. Si te haces socio, navegas desde 52,5 €/mes.` |
| `s4.pillar1.badge` | `Desde 52,5 €/mes` |
| `s4.pillar2.icon` | `🤝` |
| `s4.pillar2.title` | `Una comunidad real` |
| `s4.pillar2.body` | `Conocerás gente con las mismas ganas de mar. Vínculos que duran más allá del velero.` |
| `s4.pillar3.icon` | `🧭` |
| `s4.pillar3.title` | `A tu medida` |
| `s4.pillar3.body` | `Adaptamos cada salida a tu ritmo, tus objetivos y tus ganas del día.` |
| `cta.title` | `Zarpa con nosotros` |
| `cta.subtitle` | `Tu primera salida puede ser este fin de semana.` |
| `cta.button` | `Reservar ahora` |
| `cta.href` | `https://getxobelaeskola.cloud/es/` |

### 5.3 — Crear `components/ui/CounterNumber.tsx`

```typescript
// src/components/ui/CounterNumber.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useInView, motion } from 'framer-motion'

type CounterNumberProps = {
  from: number
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number            // segundos, default 1.5
  style?: React.CSSProperties
}

export function CounterNumber({
  from,
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.5,
  style,
}: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(to)
    }
  }, [isInView, motionValue, to])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix + latest.toFixed(decimals).replace('.', ',') + suffix
      }
    })
    return unsubscribe
  }, [springValue, prefix, suffix, decimals])

  return (
    <span ref={ref} style={style}>
      {prefix}{from.toFixed(decimals).replace('.', ',')}{suffix}
    </span>
  )
}
```

### 5.4 — Crear `components/sections/Section4Why.tsx`

```typescript
// src/components/sections/Section4Why.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CounterNumber } from '@/components/ui/CounterNumber'
import { Crab } from '@/components/creatures/Crab'

const pillars = ['pillar1', 'pillar2', 'pillar3'] as const

export function Section4Why() {
  const t = useTranslations('s4')

  return (
    <section
      style={{
        gridArea: 's4',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* Imagen superior */}
      <div style={{ position: 'relative', height: '40%', overflow: 'hidden' }}>
        <Image
          src="/images/ai/section4-community.webp"
          alt="Comunidad de vela en Getxo"
          fill
          quality={80}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13,33,55,0.25) 0%, #ffffff 90%)',
          }}
        />
        {/* Título flotando sobre la imagen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: 'clamp(1.5rem, 5vw, 3rem)',
          }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ocean-light)',
              marginBottom: '0.35rem',
            }}
          >
            {t('eyebrow')}
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            {t('title')}
          </h2>
        </motion.div>
      </div>

      {/* Los 3 pilares */}
      <div
        style={{
          flex: 1,
          padding: 'clamp(1rem, 3vh, 1.5rem) clamp(1.5rem, 5vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              delay: i * 0.12,
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              backgroundColor: 'var(--foam)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              border: '1px solid rgba(10, 126, 200, 0.1)',
            }}
          >
            {/* Icono emoji como decorativo */}
            <span style={{ fontSize: '1.8rem', flexShrink: 0, lineHeight: 1 }}>
              {t(`${pillar}.icon`)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--ocean-deep)',
                  }}
                >
                  {t(`${pillar}.title`)}
                </h3>
                {/* Badge especial para el pilar económico */}
                {pillar === 'pillar1' && (
                  <span
                    style={{
                      backgroundColor: 'var(--gold)',
                      color: 'var(--ocean-deep)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {/* Contador animado */}
                    Desde{' '}
                    <CounterNumber
                      from={0}
                      to={52.5}
                      suffix="€/mes"
                      prefix=""
                      decimals={1}
                    />
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {t(`${pillar}.body`)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cangrejo — criatura de la esquina */}
      <Crab
        style={{ position: 'absolute', bottom: '3%', right: '3%', zIndex: 5 }}
        enterDelay={1.0}
      />
    </section>
  )
}
```

### 5.5 — Añadir CTA final al `Canvas.tsx`

En `Canvas.tsx` (Fase 1.4), añadir el bloque CTA **dentro del div del canvas**, ocupando el `grid-area: cta`. No modificar nada más del componente Canvas:

```typescript
// Añadir este import al inicio de Canvas.tsx:
import { CTASection } from '@/components/sections/CTASection'

// Añadir dentro del <motion.div> del canvas, después de los children:
<CTASection />
```

Crear el archivo `src/components/sections/CTASection.tsx`:

```typescript
// src/components/sections/CTASection.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function CTASection() {
  const t = useTranslations('cta')

  return (
    <div
      style={{
        gridColumn: '1 / -1', // ocupa toda la fila — los dos anchos de columna
        position: 'relative',
        width: '200vw',        // necesario porque ocupa las 2 columnas del grid
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Imagen de fondo */}
      <Image
        src="/images/ai/cta-sunset.webp"
        alt="Atardecer en el puerto de Getxo"
        fill
        quality={80}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      {/* Overlay oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(13,33,55,0.8) 0%, rgba(0,91,154,0.7) 100%)',
        }}
      />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '680px',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          {t('title')}
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          {t('subtitle')}
        </p>
        <motion.a
          href={t('href')}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--coral)',
            color: 'white',
            padding: '1rem 3rem',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.04em',
            boxShadow: '0 8px 32px rgba(232, 89, 60, 0.5)',
          }}
        >
          {t('button')}
        </motion.a>
      </motion.div>
    </div>
  )
}
```

---

## FASE 6 — CRIATURAS SVG Y MICRO-ANIMACIONES GLOBALES

### 6.1 — Patrón base para todas las criaturas

Todas las criaturas siguen **exactamente** este patrón. Crear primero la gaviota, luego aplicar el mismo patrón a Fish, Jellyfish, Starfish, Crab, Windsurfer:

```typescript
// PATRÓN BASE (no crear este archivo — es referencia)
'use client'

import { motion } from 'framer-motion'

type CreatureProps = {
  style?: React.CSSProperties
  enterDelay?: number
  direction?: 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
}

export function CreatureXXX({ style, enterDelay = 0, direction = 'right', size = 'medium' }: CreatureProps) {
  const sizes = { small: 40, medium: 70, large: 110 }
  const px = sizes[size]

  const enterX = direction === 'right' ? -px * 2 : px * 2

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: enterX, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: enterDelay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* SVG aquí */}
    </motion.div>
  )
}
```

### 6.2 — Crear `components/creatures/Seagull.tsx`

```typescript
// src/components/creatures/Seagull.tsx
'use client'

import { motion } from 'framer-motion'

type SeagullProps = {
  style?: React.CSSProperties
  enterDelay?: number
  direction?: 'left' | 'right'
}

export function Seagull({ style, enterDelay = 0, direction = 'left' }: SeagullProps) {
  const enterX = direction === 'left' ? 160 : -160

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: enterX, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: enterDelay, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* La gaviota flota verticalmente en bucle */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Ala izquierda */}
          <motion.path
            d="M40 20 C30 15 15 10 0 18"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ['M40 20 C30 15 15 10 0 18', 'M40 20 C30 12 15 6 0 14'] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          {/* Ala derecha */}
          <motion.path
            d="M40 20 C50 15 65 10 80 18"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ['M40 20 C50 15 65 10 80 18', 'M40 20 C50 12 65 6 80 14'] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          {/* Cuerpo */}
          <ellipse cx="40" cy="22" rx="5" ry="3" fill="white" opacity="0.9" />
          {/* Pico */}
          <path d="M45 22 L50 23 L45 24 Z" fill="var(--gold)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

### 6.3 — Crear `components/creatures/Fish.tsx`

```typescript
// src/components/creatures/Fish.tsx
'use client'

import { motion } from 'framer-motion'

type FishProps = {
  style?: React.CSSProperties
  enterDelay?: number
  direction?: 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
  color?: string
}

export function Fish({
  style,
  enterDelay = 0,
  direction = 'right',
  size = 'medium',
  color = '#4AAFE8',
}: FishProps) {
  const sizes = { small: 0.6, medium: 1, large: 1.5 }
  const scale = sizes[size]
  const enterX = direction === 'right' ? -120 : 120

  return (
    <motion.div
      style={{ ...style, scale }}
      initial={{ opacity: 0, x: enterX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: enterDelay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Movimiento de deriva lento */}
      <motion.div
        animate={{ x: direction === 'right' ? [0, 8, 0] : [0, -8, 0], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="60"
          height="35"
          viewBox="0 0 60 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
          aria-hidden="true"
        >
          {/* Cuerpo del pez */}
          <ellipse cx="28" cy="17" rx="22" ry="12" fill={color} opacity="0.85" />
          {/* Cola */}
          <motion.path
            d="M50 17 L60 8 L60 26 Z"
            fill={color}
            opacity="0.7"
            animate={{ d: ['M50 17 L60 8 L60 26 Z', 'M52 17 L60 10 L60 24 Z'] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          {/* Ojo */}
          <circle cx="14" cy="14" r="3" fill="white" />
          <circle cx="14" cy="14" r="1.5" fill="#0D2137" />
          {/* Aleta dorsal */}
          <path d="M20 6 C24 2 30 4 34 6" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
          {/* Escamas sutiles */}
          <path d="M22 14 C24 12 26 14 24 16" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M30 12 C32 10 34 12 32 14" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

### 6.4 — Crear `components/creatures/Jellyfish.tsx`

```typescript
// src/components/creatures/Jellyfish.tsx
'use client'

import { motion } from 'framer-motion'

type JellyfishProps = {
  style?: React.CSSProperties
  enterDelay?: number
  size?: 'small' | 'medium' | 'large'
  color?: string
}

export function Jellyfish({ style, enterDelay = 0, size = 'medium', color = '#4AAFE8' }: JellyfishProps) {
  const sizes = { small: 0.7, medium: 1, large: 1.4 }

  return (
    <motion.div
      style={{ ...style, scale: sizes[size] }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: enterDelay, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Pulso rítmico de la medusa */}
      <motion.div
        animate={{ scaleY: [1, 0.85, 1], scaleX: [1, 1.1, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center top' }}
      >
        <svg
          width="55"
          height="75"
          viewBox="0 0 55 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Campana superior */}
          <path
            d="M5 30 C5 10 50 10 50 30 Q50 42 27.5 42 Q5 42 5 30Z"
            fill={color}
            opacity="0.75"
          />
          {/* Gradiente interno */}
          <ellipse cx="20" cy="22" rx="8" ry="5" fill="white" opacity="0.25" />
          {/* Tentáculos — 5 líneas onduladas */}
          {[12, 18, 27, 36, 43].map((x, i) => (
            <motion.path
              key={i}
              d={`M${x} 42 Q${x - 3} 52 ${x + 2} 60 Q${x - 2} 68 ${x + 1} 75`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              animate={{
                d: [
                  `M${x} 42 Q${x - 3} 52 ${x + 2} 60 Q${x - 2} 68 ${x + 1} 75`,
                  `M${x} 42 Q${x + 3} 50 ${x - 2} 60 Q${x + 2} 68 ${x - 1} 75`,
                ],
              }}
              transition={{
                duration: 1.5 + i * 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

### 6.5 — Crear `components/creatures/Starfish.tsx`

```typescript
// src/components/creatures/Starfish.tsx
'use client'

import { motion } from 'framer-motion'

type StarfishProps = {
  style?: React.CSSProperties
  enterDelay?: number
  color?: string
}

export function Starfish({ style, enterDelay = 0, color = '#F5A623' }: StarfishProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: enterDelay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Balanceo lento */}
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Estrella de 5 puntas */}
          <path
            d="M27.5 3 L31.5 18.5 L47.5 18.5 L34.5 28 L39 44 L27.5 35 L16 44 L20.5 28 L7.5 18.5 L23.5 18.5 Z"
            fill={color}
            opacity="0.85"
          />
          {/* Textura de puntos */}
          <circle cx="27.5" cy="27.5" r="4" fill="white" opacity="0.4" />
          <circle cx="27.5" cy="12" r="2" fill="white" opacity="0.3" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

### 6.6 — Crear `components/creatures/Crab.tsx`

```typescript
// src/components/creatures/Crab.tsx
'use client'

import { motion } from 'framer-motion'

type CrabProps = {
  style?: React.CSSProperties
  enterDelay?: number
  color?: string
}

export function Crab({ style, enterDelay = 0, color = '#E8593C' }: CrabProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: enterDelay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Cangrejo que se mueve lateralmente */}
      <motion.div
        animate={{ x: [0, 8, 0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="65"
          height="45"
          viewBox="0 0 65 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Cuerpo */}
          <ellipse cx="32" cy="28" rx="18" ry="12" fill={color} opacity="0.85" />
          {/* Caparazón superior */}
          <path d="M16 26 Q32 12 48 26" fill={color} opacity="0.7" />
          {/* Pinzas */}
          <path d="M14 24 Q6 18 4 12 Q8 8 12 14 Q16 10 12 18" fill={color} opacity="0.8" />
          <path d="M50 24 Q58 18 60 12 Q56 8 52 14 Q48 10 52 18" fill={color} opacity="0.8" />
          {/* Ojos */}
          <circle cx="26" cy="21" r="3" fill="white" />
          <circle cx="38" cy="21" r="3" fill="white" />
          <circle cx="26" cy="21" r="1.5" fill="#0D2137" />
          <circle cx="38" cy="21" r="1.5" fill="#0D2137" />
          {/* Patas (3 por lado) */}
          {[18, 24, 30].map((x, i) => (
            <motion.line
              key={`left-${i}`}
              x1={x}
              y1="30"
              x2={x - 8}
              y2="42"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ y1: [30, 28, 30], y2: [42, 40, 42] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.15, repeatType: 'reverse' }}
            />
          ))}
          {[36, 42, 48].map((x, i) => (
            <motion.line
              key={`right-${i}`}
              x1={x}
              y1="30"
              x2={x + 8}
              y2="42"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ y1: [30, 28, 30], y2: [42, 40, 42] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.15 + 0.2, repeatType: 'reverse' }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

### 6.7 — Crear `components/creatures/Windsurfer.tsx`

```typescript
// src/components/creatures/Windsurfer.tsx
'use client'

import { motion } from 'framer-motion'

type WindsurferProps = {
  style?: React.CSSProperties
  enterDelay?: number
}

export function Windsurfer({ style, enterDelay = 0 }: WindsurferProps) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: 100, y: 10 }}
      animate={{ opacity: 0.85, x: 0, y: 0 }}
      transition={{ delay: enterDelay, duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Movimiento ondulante en el agua */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="80"
          height="100"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Vela */}
          <path d="M40 10 L10 70 L40 65 Z" fill="var(--ocean-bright)" opacity="0.85" />
          <path d="M40 10 L70 75 L40 65 Z" fill="var(--ocean-mid)" opacity="0.7" />
          {/* Mástil */}
          <line x1="40" y1="10" x2="40" y2="75" stroke="var(--ocean-deep)" strokeWidth="2" />
          {/* Tabla */}
          <ellipse cx="40" cy="82" rx="22" ry="6" fill="var(--ocean-deep)" opacity="0.8" />
          {/* Surfista simplificado */}
          <circle cx="38" cy="72" r="5" fill="var(--gold)" />
          <path d="M33 77 L38 72 L43 77" stroke="var(--gold)" strokeWidth="2" fill="none" />
          {/* Olas bajo la tabla */}
          <path d="M18 88 Q28 84 40 88 Q52 92 62 88" stroke="var(--ocean-light)" strokeWidth="2" fill="none" opacity="0.6" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
```

### 6.8 — Crear `components/decorative/WaveBackground.tsx`

```typescript
// src/components/decorative/WaveBackground.tsx
'use client'

// Ola decorativa de fondo que se usa en múltiples secciones como separador
// Props: position 'top' | 'bottom', color de la ola, color del fondo

type WaveBackgroundProps = {
  position?: 'top' | 'bottom'
  waveColor?: string
  opacity?: number
}

export function WaveBackground({
  position = 'bottom',
  waveColor = '#E8F4FD',
  opacity = 0.5,
}: WaveBackgroundProps) {
  const flipStyle = position === 'top' ? { transform: 'rotate(180deg)' } : {}

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        right: 0,
        height: '80px',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...flipStyle,
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 40 C200 0 400 80 600 40 C800 0 1000 80 1200 40 C1320 20 1400 60 1440 40 L1440 80 L0 80 Z"
          fill={waveColor}
        />
      </svg>
    </div>
  )
}
```

### 6.9 — Crear `components/decorative/WindParticles.tsx`

```typescript
// src/components/decorative/WindParticles.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Particle = {
  id: number
  x: number      // posición inicial X en vw (0–100)
  y: number      // posición inicial Y en vh (0–100)
  size: number   // tamaño en px (2–5)
  duration: number  // duración animación (3–6s)
  delay: number     // delay inicial (0–5s)
  opacity: number   // 0.1–0.4
}

const PARTICLE_COUNT = 12

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.3,
  }))
}

export function WindParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setParticles(generateParticles())
  }, [])

  // No renderizar si el usuario prefiere sin movimiento
  if (prefersReducedMotion) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: `${p.y}vh`,
            left: `${p.x}vw`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            backgroundColor: 'var(--ocean-light)',
            borderRadius: '50px',
            opacity: p.opacity,
          }}
          animate={{
            x: ['0vw', '30vw'],
            y: ['0vh', '-5vh'],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
```

### 6.10 — Crear `components/decorative/HorizonLine.tsx`

```typescript
// src/components/decorative/HorizonLine.tsx
'use client'

import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type HorizonLineProps = {
  color?: string
  opacity?: number
}

export function HorizonLine({ color = 'var(--ocean-light)', opacity = 0.3 }: HorizonLineProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: '1px',
        backgroundColor: color,
        opacity,
        pointerEvents: 'none',
        transformOrigin: 'center',
      }}
      animate={prefersReducedMotion ? {} : {
        rotate: [-0.5, 0.5],
        scaleX: [0.98, 1.02],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  )
}
```

### 6.11 — Crear `components/ui/LanguageSwitcher.tsx`

```typescript
// src/components/ui/LanguageSwitcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const LOCALES = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'eu', label: 'EU', name: 'Euskera' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: string) => {
    // Reemplazar el locale en el pathname actual
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setIsOpen(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
      }}
    >
      {/* Botón del locale actual */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backgroundColor: 'rgba(13, 33, 55, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(74, 175, 232, 0.3)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {locale.toUpperCase()} ▾
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '6px',
              backgroundColor: 'rgba(13, 33, 55, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(74, 175, 232, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              minWidth: '120px',
            }}
          >
            {LOCALES.map((loc) => (
              <motion.button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                whileHover={{ backgroundColor: 'rgba(10, 126, 200, 0.3)' }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px',
                  color: locale === loc.code ? 'var(--ocean-light)' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.85rem',
                  fontWeight: locale === loc.code ? 600 : 400,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ marginRight: '8px', opacity: 0.7 }}>{loc.label}</span>
                {loc.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

## FASE 7 — i18n COMPLETO (ES / EU / EN / FR)

### 7.1 — Crear `messages/es.json`

```json
{
  "meta": {
    "title": "Getxo Bela Eskola — Tu escuela de vela en el Abra",
    "description": "Aprende a navegar con la comunidad de vela de Getxo. Cursos para jóvenes y adultos, vela ligera y cruceros. Desde 52,5€/mes."
  },
  "s1": {
    "eyebrow": "Getxo · Bizkaia",
    "title": "No somos una escuela. Somos tu mar.",
    "subtitle": "Un punto de encuentro donde la vela es el pretexto para compartir, crecer y sentir el mar sin presión.",
    "cta": "Descubrir →",
    "scroll_hint": "Sigue navegando"
  },
  "s2": {
    "eyebrow": "La experiencia",
    "title": "La vela se adapta a ti",
    "subtitle": "No hay dos días iguales en el mar. Tú eliges cómo vivirlo.",
    "card1": {
      "label": "Tipo de experiencia",
      "option_a": "☁️ Calma",
      "option_a_desc": "Desconectar sin prisa, aguas tranquilas, sin presión.",
      "option_b": "💨 Acción",
      "option_b_desc": "Viento fuerte, sensaciones intensas, adrenalina real."
    },
    "card2": {
      "label": "El escenario",
      "option_a": "🌊 Abra interior",
      "option_a_desc": "Aguas protegidas, ideal para iniciarse o disfrutar con calma.",
      "option_b": "🌊🌊 Abra exterior",
      "option_b_desc": "Mar abierto, olas, para quienes buscan la aventura de verdad."
    },
    "card3": {
      "label": "Con quién navegar",
      "option_a": "⛵ Velero pequeño",
      "option_a_desc": "2–6 personas, muy participativo, aprendes haciendo.",
      "option_b": "🚢 Crucero grande",
      "option_b_desc": "Hasta 8 personas, más espacio, navegación más social."
    },
    "card4": {
      "label": "Forma moderna",
      "badge": "Vela moderna ✦",
      "body": "Los partes meteorológicos actuales permiten prever exactamente las condiciones. Sales cuando quieres, con lo que buscas. La vela ahora es consciente, accesible y a tu medida."
    }
  },
  "s3": {
    "eyebrow": "Formación",
    "title": "Descubre tu camino",
    "subtitle": "¿Cuál es tu nivel y cuánto tiempo tienes?",
    "level_basic": "Nivel básico",
    "level_mid": "Nivel medio",
    "youth": "Jóvenes",
    "adult": "Adultos / Adultas",
    "course": {
      "txikigune": "Días sueltos (Txikigune)",
      "udalekuak": "5 días seguidos (Udalekuak)",
      "continuous_kids": "3 días/mes todo el año",
      "cruiser_init": "Crucero iniciación",
      "vl_init": "Vela ligera iniciación (3 días)",
      "vl_advanced": "Vela ligera avanzado (2 días)",
      "cruiser_perf": "Crucero perfeccionamiento (2 días)",
      "gennaker": "Crucero con gennaker (2 días)",
      "tech_team": "Equipo tecnificación crucero (3 días/mes)"
    },
    "cta_course": "Ver programa →"
  },
  "s4": {
    "eyebrow": "Nuestra promesa",
    "title": "¿Por qué navegar con nosotros?",
    "pillar1": {
      "icon": "💶",
      "title": "Accesible para todos",
      "body": "Escuela municipal que democratiza la vela. Hazte socio y navega desde 52,5 €/mes.",
      "badge": "Desde 52,5 €/mes"
    },
    "pillar2": {
      "icon": "🤝",
      "title": "Una comunidad real",
      "body": "Conocerás gente con las mismas ganas de mar. Vínculos que duran más allá del velero.",
      "badge": ""
    },
    "pillar3": {
      "icon": "🧭",
      "title": "A tu medida",
      "body": "Adaptamos cada salida a tu ritmo, tus objetivos y tus ganas del día. Sin moldes.",
      "badge": ""
    }
  },
  "cta": {
    "title": "Zarpa con nosotros",
    "subtitle": "Tu primera salida puede ser este fin de semana.",
    "button": "Reservar ahora",
    "href": "https://getxobelaeskola.cloud/es/"
  }
}
```

### 7.2 — Crear `messages/eu.json`

```json
{
  "meta": {
    "title": "Getxo Bela Eskola — Zure bela-eskola Abraren ondoan",
    "description": "Ikasi nabigatzen Getxoko bela-komunitatearekin. Ikastaroak gazteentzat eta helduentzat. Hilabetean 52,5€-tik."
  },
  "s1": {
    "eyebrow": "Getxo · Bizkaia",
    "title": "Ez gara eskola bat. Zu zaren itsasoa gara.",
    "subtitle": "Topagune bat non bela aitzakia den partekatzeko, hazteko eta itsasoa sentitzeko presiorik gabe.",
    "cta": "Aurkitu →",
    "scroll_hint": "Jarraitu nabigatzera"
  },
  "s2": {
    "eyebrow": "Esperientzia",
    "title": "Bela zuri egokitzen zaizu",
    "subtitle": "Bi egun ez dira berdinak itsasoan. Zuk aukeratzen duzu nola bizi.",
    "card1": {
      "label": "Esperientzia mota",
      "option_a": "☁️ Lasaitasuna",
      "option_a_desc": "Deskonektatu presiorik gabe, ur lasaietan.",
      "option_b": "💨 Ekintza",
      "option_b_desc": "Haize bizia, sentsazio biziak, adrenalina erreala."
    },
    "card2": {
      "label": "Eszenatokia",
      "option_a": "🌊 Barne Abra",
      "option_a_desc": "Ur babestetuak, hasteko edo lasai gozatzeko egokia.",
      "option_b": "🌊🌊 Kanpo Abra",
      "option_b_desc": "Itsaso irekia, olatuak, benetako abenturarako."
    },
    "card3": {
      "label": "Norekin nabigatu",
      "option_a": "⛵ Bela-ontzi txikia",
      "option_a_desc": "2–6 pertsona, oso parte-hartzailea, eginez ikasten.",
      "option_b": "🚢 Kruzero handia",
      "option_b_desc": "8 pertsonaraino, espazio gehiago, nabigazio sozialagoa."
    },
    "card4": {
      "label": "Modu modernoa",
      "badge": "Bela modernoa ✦",
      "body": "Gaur egungo eguraldiaren iragarpenek baldintza zehatzak aurreikusten uzten dute. Nahi duzunean irteten zara, bilatzen duzunarekin. Bela orain kontzienteagoa, eskuragarriagoa eta zure neurrira dago."
    }
  },
  "s3": {
    "eyebrow": "Prestakuntza",
    "title": "Aurkitu zure bidea",
    "subtitle": "Zein da zure maila eta zenbat denbora duzu?",
    "level_basic": "Oinarrizko maila",
    "level_mid": "Maila ertaina",
    "youth": "Gazteak",
    "adult": "Helduak",
    "course": {
      "txikigune": "Egun solteak (Txikigune)",
      "udalekuak": "5 egun jarraian (Udalekuak)",
      "continuous_kids": "3 egun/hilabete urte osoan",
      "cruiser_init": "Kruzeroko hasiera",
      "vl_init": "Bela arina hasiera (3 egun)",
      "vl_advanced": "Bela arina aurreratua (2 egun)",
      "cruiser_perf": "Kruzeroko hobekuntza (2 egun)",
      "gennaker": "Gennakerreko kruzeroa (2 egun)",
      "tech_team": "Teknifikazio taldea kruzeroan (3 egun/hilabete)"
    },
    "cta_course": "Programa ikusi →"
  },
  "s4": {
    "eyebrow": "Gure promesa",
    "title": "Zergatik nabigatu gurekin?",
    "pillar1": {
      "icon": "💶",
      "title": "Guztientzat eskuragarria",
      "body": "Udal-eskola bela demokratizatzen duena. Bazkide egin eta nabigatu 52,5 €/hilabetetik.",
      "badge": "52,5 €/hilabetetik"
    },
    "pillar2": {
      "icon": "🤝",
      "title": "Komunitate erreala",
      "body": "Itsasoaren irrika berarekin jende berria ezagutuko duzu. Belatik harago irauten duten loturak.",
      "badge": ""
    },
    "pillar3": {
      "icon": "🧭",
      "title": "Zure neurrira",
      "body": "Irteera bakoitza zure erritmoari, helburuei eta eguneko gogoari egokitzen diogu.",
      "badge": ""
    }
  },
  "cta": {
    "title": "Atera itsasora gurekin",
    "subtitle": "Zure lehen irteera aste honetan bertan izan daiteke.",
    "button": "Erreserbatu orain",
    "href": "https://getxobelaeskola.cloud/eu/"
  }
}
```

### 7.3 — Crear `messages/en.json`

```json
{
  "meta": {
    "title": "Getxo Bela Eskola — Your sailing school at the Abra",
    "description": "Learn to sail with Getxo's sailing community. Courses for youth and adults. From €52.5/month."
  },
  "s1": {
    "eyebrow": "Getxo · Bizkaia",
    "title": "We're not a school. We're your sea.",
    "subtitle": "A meeting point where sailing is the excuse to share, grow and feel the sea without pressure.",
    "cta": "Discover →",
    "scroll_hint": "Keep sailing"
  },
  "s2": {
    "eyebrow": "The experience",
    "title": "Sailing adapts to you",
    "subtitle": "No two days are the same at sea. You choose how to live it.",
    "card1": {
      "label": "Type of experience",
      "option_a": "☁️ Calm",
      "option_a_desc": "Disconnect without rush, calm waters, no pressure.",
      "option_b": "💨 Action",
      "option_b_desc": "Strong wind, intense sensations, real adrenaline."
    },
    "card2": {
      "label": "The setting",
      "option_a": "🌊 Inner Abra",
      "option_a_desc": "Protected waters, ideal for beginners or a relaxed sail.",
      "option_b": "🌊🌊 Outer Abra",
      "option_b_desc": "Open sea, waves, for those seeking real adventure."
    },
    "card3": {
      "label": "Who to sail with",
      "option_a": "⛵ Small sailboat",
      "option_a_desc": "2–6 people, very hands-on, learn by doing.",
      "option_b": "🚢 Large cruiser",
      "option_b_desc": "Up to 8 people, more space, a more social experience."
    },
    "card4": {
      "label": "Modern sailing",
      "badge": "Modern sailing ✦",
      "body": "Today's weather forecasts let you predict exact conditions. You sail when you want, with the experience you're looking for. Sailing is now mindful, accessible and tailored to you."
    }
  },
  "s3": {
    "eyebrow": "Training",
    "title": "Find your path",
    "subtitle": "What's your level and how much time do you have?",
    "level_basic": "Basic level",
    "level_mid": "Intermediate level",
    "youth": "Youth",
    "adult": "Adults",
    "course": {
      "txikigune": "Single days (Txikigune)",
      "udalekuak": "5-day camp (Udalekuak)",
      "continuous_kids": "3 days/month all year",
      "cruiser_init": "Introductory cruising",
      "vl_init": "Dinghy sailing intro (3 days)",
      "vl_advanced": "Dinghy sailing advanced (2 days)",
      "cruiser_perf": "Cruising development (2 days)",
      "gennaker": "Gennaker cruising (2 days)",
      "tech_team": "Cruising training team (3 days/month)"
    },
    "cta_course": "See programme →"
  },
  "s4": {
    "eyebrow": "Our promise",
    "title": "Why sail with us?",
    "pillar1": {
      "icon": "💶",
      "title": "Accessible for everyone",
      "body": "A municipal school democratising sailing. Become a member and sail from €52.5/month.",
      "badge": "From €52.5/month"
    },
    "pillar2": {
      "icon": "🤝",
      "title": "A real community",
      "body": "You'll meet people with the same love of the sea. Bonds that last beyond the boat.",
      "badge": ""
    },
    "pillar3": {
      "icon": "🧭",
      "title": "On your terms",
      "body": "We adapt every outing to your pace, your goals and your mood that day.",
      "badge": ""
    }
  },
  "cta": {
    "title": "Set sail with us",
    "subtitle": "Your first trip could be this weekend.",
    "button": "Book now",
    "href": "https://getxobelaeskola.cloud/en/"
  }
}
```

### 7.4 — Crear `messages/fr.json`

```json
{
  "meta": {
    "title": "Getxo Bela Eskola — Ton école de voile sur l'Abra",
    "description": "Apprends à naviguer avec la communauté de voile de Getxo. Cours pour jeunes et adultes. Dès 52,5 €/mois."
  },
  "s1": {
    "eyebrow": "Getxo · Bizkaia",
    "title": "On n'est pas une école. On est ta mer.",
    "subtitle": "Un lieu de rencontre où la voile est le prétexte pour partager, grandir et ressentir la mer sans pression.",
    "cta": "Découvrir →",
    "scroll_hint": "Continue à naviguer"
  },
  "s2": {
    "eyebrow": "L'expérience",
    "title": "La voile s'adapte à toi",
    "subtitle": "Il n'y a pas deux jours pareils en mer. Tu choisis comment le vivre.",
    "card1": {
      "label": "Type d'expérience",
      "option_a": "☁️ Calme",
      "option_a_desc": "Déconnecter sans pression, eaux tranquilles.",
      "option_b": "💨 Action",
      "option_b_desc": "Vent fort, sensations intenses, adrénaline réelle."
    },
    "card2": {
      "label": "Le décor",
      "option_a": "🌊 Abra intérieur",
      "option_a_desc": "Eaux protégées, idéal pour débuter ou naviguer sereinement.",
      "option_b": "🌊🌊 Abra extérieur",
      "option_b_desc": "Mer ouverte, vagues, pour ceux qui cherchent la vraie aventure."
    },
    "card3": {
      "label": "Avec qui naviguer",
      "option_a": "⛵ Petit voilier",
      "option_a_desc": "2–6 personnes, très participatif, on apprend en faisant.",
      "option_b": "🚢 Grand croiseur",
      "option_b_desc": "Jusqu'à 8 personnes, plus d'espace, navigation sociale."
    },
    "card4": {
      "label": "Navigation moderne",
      "badge": "Voile moderne ✦",
      "body": "Les prévisions météo actuelles permettent d'anticiper les conditions exactes. Tu pars quand tu veux, avec ce que tu cherches. La voile est maintenant consciente, accessible et à ta mesure."
    }
  },
  "s3": {
    "eyebrow": "Formation",
    "title": "Découvre ton chemin",
    "subtitle": "Quel est ton niveau et de combien de temps disposes-tu ?",
    "level_basic": "Niveau débutant",
    "level_mid": "Niveau intermédiaire",
    "youth": "Jeunes",
    "adult": "Adultes",
    "course": {
      "txikigune": "Journées à la carte (Txikigune)",
      "udalekuak": "5 jours consécutifs (Udalekuak)",
      "continuous_kids": "3 jours/mois toute l'année",
      "cruiser_init": "Croisière initiation",
      "vl_init": "Dériveur initiation (3 jours)",
      "vl_advanced": "Dériveur avancé (2 jours)",
      "cruiser_perf": "Croisière perfectionnement (2 jours)",
      "gennaker": "Croisière avec gennaker (2 jours)",
      "tech_team": "Équipe de technification croisière (3 jours/mois)"
    },
    "cta_course": "Voir le programme →"
  },
  "s4": {
    "eyebrow": "Notre promesse",
    "title": "Pourquoi naviguer avec nous ?",
    "pillar1": {
      "icon": "💶",
      "title": "Accessible à tous",
      "body": "École municipale qui démocratise la voile. Deviens membre et navigue dès 52,5 €/mois.",
      "badge": "Dès 52,5 €/mois"
    },
    "pillar2": {
      "icon": "🤝",
      "title": "Une vraie communauté",
      "body": "Tu rencontreras des gens avec le même amour de la mer. Des liens qui durent au-delà du bateau.",
      "badge": ""
    },
    "pillar3": {
      "icon": "🧭",
      "title": "À ta mesure",
      "body": "On adapte chaque sortie à ton rythme, tes objectifs et tes envies du jour.",
      "badge": ""
    }
  },
  "cta": {
    "title": "Prends le large avec nous",
    "subtitle": "Ta première sortie peut être ce week-end.",
    "button": "Réserver maintenant",
    "href": "https://getxobelaeskola.cloud/fr/"
  }
}
```

---

## FASE 8 — RENDIMIENTO, SEO Y DEPLOY

### 8.1 — Checklist de rendimiento (ejecutar antes del deploy)

Ejecutar cada punto en orden. No pasar al siguiente hasta que el anterior esté marcado:

**[ ] 8.1.1 — Optimizar imágenes WebP**
```bash
# Verificar que todas las imágenes de /public/images/ai/ son WebP
ls -la public/images/ai/
# Comprobar tamaño: ninguna debe superar 250KB
du -sh public/images/ai/*.webp
```

**[ ] 8.1.2 — Activar `next/image` lazy loading**
Verificar que TODOS los `<Image>` de Next.js que NO son `hero-deck-getxo.webp` tienen la prop `loading="lazy"` implícita (es el default). Solo el hero tiene `priority`.

**[ ] 8.1.3 — Eliminar imports no usados**
```bash
npx eslint src/ --fix
```

**[ ] 8.1.4 — Build de producción sin errores**
```bash
npm run build
# NO debe haber errores. Warnings de ESLint son aceptables solo si son de `any`.
# Si hay errores de TypeScript → corregir antes de continuar.
```

**[ ] 8.1.5 — Verificar bundle size**
```bash
npm run build
# En el output de Next.js, verificar que la página principal es < 250KB (First Load JS)
```

### 8.2 — SEO técnico

**Archivo: `src/app/[locale]/page.tsx`** — añadir al final del archivo (fuera del componente):

```typescript
// Añadir al final de page.tsx para generar sitemap estático
export const dynamic = 'force-static'
export const revalidate = 86400 // revalidar cada 24h
```

**Crear `src/app/sitemap.ts`:**

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://getxobelaeskola.cloud' // TODO: cambiar por el dominio real del nuevo proyecto

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['es', 'eu', 'en', 'fr']
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }))
}
```

**Crear `src/app/robots.ts`:**

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://getxobelaeskola.cloud/sitemap.xml', // TODO: dominio real
  }
}
```

### 8.3 — Accesibilidad final checklist

**[ ]** Todos los `<img>` y `<Image>` tienen `alt` (vacío `alt=""` para decorativas, descriptivo para las semánticas).

**[ ]** Todas las criaturas SVG tienen `aria-hidden="true"`.

**[ ]** El `LanguageSwitcher` tiene atributo `aria-label="Cambiar idioma"` en el botón principal.

**[ ]** El `CompassNav` tiene `aria-label="Indicador de posición"` y `aria-hidden="true"` en los elementos decorativos.

**[ ]** La `Prow` tiene `aria-hidden="true"`.

**[ ]** Los botones de `ExperienceToggle` y `Section3Path` tienen tipo `type="button"` explícito para evitar submit accidental.

**[ ]** El CTA principal tiene `rel="noopener noreferrer"` (ya incluido en el código).

**[ ]** Verificar navegación con teclado (Tab): el orden de foco debe ser LanguageSwitcher → CTA de Section1 → botones de Section2 → árbol de Section3 → CTA final.

### 8.4 — Deploy en Vercel

```bash
# 1. Inicializar git
git init
git add .
git commit -m "feat: initial landing page Getxo Bela Eskola"

# 2. Instalar Vercel CLI
npm install -g vercel

# 3. Deploy
vercel

# Cuando pregunte por configuración:
# - Framework: Next.js (autodetectado)
# - Build Command: npm run build (default)
# - Output Directory: .next (default)
# - Install Command: npm install (default)

# 4. Variables de entorno necesarias en Vercel Dashboard:
# (ninguna en esta fase — no hay API keys)
```

### 8.5 — Variables de entorno para producción

Crear `.env.local` (NO hacer commit — añadir a `.gitignore`):

```bash
# .env.local
# No hay variables de entorno requeridas en v1.
# Reservado para integraciones futuras (analytics, CMS).
NEXT_PUBLIC_SITE_URL=https://getxobelaeskola.cloud
```

---

## APÉNDICE A — DECISIONES QUE NO DEBEN TOMARSE SIN PREGUNTAR

Las siguientes decisiones están **deliberadamente dejadas sin resolver** porque requieren input humano:

1. **URLs exactas por curso** en `COURSE_TREE` de `Section3Path.tsx` — actualmente apuntan a la homepage. Cuando existan las páginas de cada curso, sustituir cada `href` por la URL correcta.

2. **Dominio de producción** — aparece como `getxobelaeskola.cloud` en sitemap y robots. Si el nuevo proyecto usa un dominio diferente, cambiar en `sitemap.ts` y `robots.ts`.

3. **Logo oficial** — el componente `LogoGBE` usa un velero SVG genérico. Si existe el logo oficial vectorial, sustituir el SVG por el asset real.

4. **Colores del logo** — si el azul oficial de GBE difiere de `#0A7EC8`, cambiar `--ocean-bright` en `:root`.

5. **Imágenes IA** — los 8 prompts del apartado 0.5 requieren ejecución manual en Midjourney/DALL-E. Las imágenes NO están incluidas en el repositorio.

6. **Idioma por defecto para el redirect de `/`** — actualmente el middleware redirige a `/es`. Si el mercado principal es euskara, cambiar `defaultLocale: 'es'` a `defaultLocale: 'eu'` en `middleware.ts`.

---

## APÉNDICE B — ORDEN ESTRICTO DE EJECUCIÓN

La IA ejecutora debe completar los pasos exactamente en este orden. No saltar adelante:

```
Fase 0.1 → 0.2 → 0.3 → 0.4 → 0.5 (manual) → 0.6 → 0.7 → 0.8 → 0.9 → 0.10
→ Fase 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → TEST 1.7
→ Fase 2.1 → 2.2 → 2.3
→ Fase 3.1 → 3.2 → 3.3 → 3.4
→ Fase 4.1 → 4.2 → 4.3 → 4.4
→ Fase 5.1 → 5.2 → 5.3 → 5.4 → 5.5
→ Fase 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6 → 6.7 → 6.8 → 6.9 → 6.10 → 6.11
→ Fase 7.1 → 7.2 → 7.3 → 7.4
→ Fase 8.1 → 8.2 → 8.3 → 8.4 → 8.5
```

**Punto de control obligatorio:** después de cada fase, ejecutar `npm run dev` y verificar que no hay errores en consola antes de continuar con la siguiente fase.
