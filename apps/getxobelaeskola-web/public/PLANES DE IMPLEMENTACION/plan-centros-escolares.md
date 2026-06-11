# 🌊 Plan de Implementación — Sección Centros Escolares y Asociaciones
### getxobelaeskola.cloud · Estilo Apple Clean × Bonka Magic

---

> **Referencia visual:** [cafebonka.com](https://cafebonka.com) — scroll narrativo, blanco puro, tipografía expresiva, animaciones que sorprenden sin molestar.
> **Stack animación:** Framer Motion + React + Tailwind CSS
> **Filosofía:** *"Less chrome, more wonder."* Cada elemento entra con intención. Nada se mueve por decorar.

---

## 🗺️ Mapa general de fases

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  FASE 0       FASE 1       FASE 2       FASE 3       FASE 4    │
│  Tokens  →   Hero     →  Cómo       →  Actividades →  Precio  │
│  & Setup     Cinemat.     funciona      3 Cards       & CTA    │
│                                                                 │
│  FASE 5       FASE 6                                           │
│  PDF +    →  Polish &                                          │
│  Botón       Accesib.                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Tiempo estimado total:** 3–5 días de implementación en pares (1 dev + 1 diseñador)

---

# ━━━ FASE 0 · Setup & Design Tokens ━━━━━━━━━━━━━━━━━━━━━━
> ⏱️ Duración estimada: **2–3 horas**
> 👤 Responsable: Dev principal

## 0.1 · Instalar dependencias

```bash
npm install framer-motion
npm install @react-spring/web        # backup suave para SVG paths
npm install lucide-react             # iconos limpios
npm install @fontsource/dm-serif-display
npm install @fontsource/inter
```

## 0.2 · Paleta de color (Apple × Océano)

| Token | Hex | Uso |
|---|---|---|
| `--color-white` | `#FFFFFF` | Fondo principal |
| `--color-offwhite` | `#F8F9FA` | Fondos alternos |
| `--color-ocean` | `#0077B6` | Acentos, CTA |
| `--color-deep` | `#03045E` | Headlines |
| `--color-sky` | `#90E0EF` | Decorativo, ondas |
| `--color-sand` | `#F5F0E8` | Bloques cálidos |
| `--color-text` | `#1A1A2E` | Cuerpo |
| `--color-muted` | `#6B7280` | Secundario |

```css
/* globals.css */
:root {
  --color-white:    #FFFFFF;
  --color-offwhite: #F8F9FA;
  --color-ocean:    #0077B6;
  --color-deep:     #03045E;
  --color-sky:      #90E0EF;
  --color-sand:     #F5F0E8;
  --color-text:     #1A1A2E;
  --color-muted:    #6B7280;
}
```

## 0.3 · Tipografía

```
DISPLAY (titulares grandes)
  → DM Serif Display · 400 · tracking: -0.02em
  → "La mar como herramienta educativa."

HEADING (secciones internas)  
  → Inter · 600–700 · tracking: -0.01em

BODY
  → Inter · 400 · line-height: 1.7

LABEL / EYEBROW
  → Inter · 500 · uppercase · letter-spacing: 0.15em · 11px
  → Color: --color-ocean
```

## 0.4 · Motion Presets (crear `/lib/motionPresets.ts`)

```typescript
// Reutilizable en toda la sección
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9 } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}

export const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}
```

## 0.5 · Hook reutilizable `useScrollReveal`

```typescript
// hooks/useScrollReveal.ts
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}
```

---

# ━━━ FASE 1 · HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⏱️ Duración estimada: **4–6 horas**
> 🎯 Objetivo: Impactar en 3 segundos. La persona siente el océano antes de leer.

## Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ────────── EYEBROW ──────────                               │
│   CENTROS ESCOLARES · ASOCIACIONES                            │
│                                                                │
│                                                                │
│   ┌────────────────────────────────────────────────────────┐  │
│   │                                                        │  │
│   │   La mar como                                          │  │
│   │   herramienta                                          │  │
│   │   educativa.         [imagen velero / ilustración]     │  │
│   │                                                        │  │
│   │   Actividades seguras, inclusivas                      │  │
│   │   y formativas donde aprender                          │  │
│   │   es convivir.                                         │  │
│   │                                                        │  │
│   │   [● Reservar fecha]   [↓ Saber más]                   │  │
│   │                                                        │  │
│   └────────────────────────────────────────────────────────┘  │
│                                                                │
│   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  WAVE DIVIDER  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 1.1 · Animación de entrada (orquestada)

```
SECUENCIA DE ENTRADA — timing en ms:
─────────────────────────────────────────
  0ms   → Fondo blanco aparece (ya visible)
 100ms  → EYEBROW fade-in desde abajo
 350ms  → Headline "La mar como" · fade+slide desde abajo
 500ms  → "herramienta" aparece · stagger
 650ms  → "educativa." aparece · stagger
 800ms  → Subtítulo fade-in
1000ms  → Botones aparecen en stagger
1200ms  → Imagen / ilustración scale-in desde 0.9 → 1.0
1500ms  → Wave SVG anima su path (draw animation)
```

**Código de referencia para el headline staggered:**
```tsx
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {["La mar como", "herramienta", "educativa."].map((line, i) => (
    <motion.h1 key={i} variants={fadeUp} className="display-xl">
      {line}
    </motion.h1>
  ))}
</motion.div>
```

## 1.2 · Wave Divider Animado (SVG Framer Motion)

```tsx
// components/WaveDivider.tsx
// La onda se anima en loop suave, como respirar
<motion.svg viewBox="0 0 1440 80">
  <motion.path
    d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
    fill="var(--color-sky)"
    animate={{
      d: [
        "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z",
        "M0,30 C240,60 480,10 720,50 C960,70 1200,10 1440,30 L1440,80 L0,80 Z",
        "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z",
      ]
    }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  />
</motion.svg>
```

## 1.3 · Números flotantes animados (stat pills)

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Hasta 60 │   │  3 horas │   │  15 € /  │
│  alumnos │   │ de jornada│  │  alumno  │
└──────────┘   └──────────┘   └──────────┘
```

Cada pill: `scaleIn` con stagger + hover lift (`whileHover={{ y: -4 }}`).

---

# ━━━ FASE 2 · ¿CÓMO FUNCIONA? (Sistema de Rotaciones) ━━━━
> ⏱️ Duración estimada: **5–7 horas**
> 🎯 El bloque más pedagógico. Tiene que ser visualmente irresistible.

## Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ─── ¿CÓMO FUNCIONA LA JORNADA? ────────────────────────── │
│                                                                │
│   [Diagrama circular de rotaciones]                           │
│                                                                │
│        ┌─────────┐                                            │
│        │GRUPO A  │ ──────────────────→  Actividad 1 ⛵       │
│        └─────────┘                                            │
│                                                                │
│        ┌─────────┐                                            │
│        │GRUPO B  │ ──────────────────→  Actividad 2 🏄       │
│        └─────────┘                                            │
│                                                                │
│        ┌─────────┐                                            │
│        │GRUPO C  │ ──────────────────→  Actividad 3 🐧       │
│        └─────────┘                                            │
│                                                                │
│              ↕ Cada 50–60 min rotan ↕                        │
│                                                               │
│   ⬤─────────────────────────────────────────── 3h TOTAL      │
│   [barra de progreso animada del día]                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 2.1 · Diagrama de rotación SVG animado

```tsx
// El diagrama se construye en pantalla cuando hace scroll:
// 1. Aparecen los 3 grupos (stagger, fade+slide desde izquierda)
// 2. Las flechas se "dibujan" (pathLength 0 → 1)
// 3. Las actividades aparecen desde la derecha
// 4. La barra de tiempo se llena de izquierda a derecha

<motion.path
  strokeDasharray="0 1"
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
/>
```

## 2.2 · Timeline del día (barra animada)

```
  9:00 ──────────────────────────── 12:00
   │                                  │
   ▼                                  ▼
  [⛵ Velero]──[🏄 Big SUP]──[🐧 Antártida]
    50-60min      50-60min      50-60min
```

```tsx
// Barra que se llena con scroll progress
const { scrollYProgress } = useScroll({ target: sectionRef })
const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

<motion.div style={{ width: barWidth }} className="timeline-fill" />
```

## 2.3 · Cards de datos (aparecen uno a uno)

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │  │                 │
│   👥 3 grupos   │  │  ⏱️ 50–60 min  │  │  👨‍👩‍👧 Hasta 60  │
│   equilibrados  │  │  por actividad  │  │  alumnos / día  │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Hover effect:** `whileHover={{ scale: 1.03, boxShadow: "0 20px 60px rgba(0,119,182,0.12)" }}`

---

# ━━━ FASE 3 · LAS 3 ACTIVIDADES (Cards) ━━━━━━━━━━━━━━━━━
> ⏱️ Duración estimada: **6–8 horas**
> 🎯 Aquí está el corazón del producto. Cada card = una experiencia.

## Wireframe · Vista desktop

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│                  │  │                  │  │                  │
│   ⛵             │  │   🏄             │  │   🐧             │
│                  │  │                  │  │                  │
│ ── 01 ──         │  │ ── 02 ──         │  │ ── 03 ──         │
│                  │  │                  │  │                  │
│ Navegación       │  │ Big SUP          │  │ Taller           │
│ en Velero        │  │                  │  │ Antártida        │
│                  │  │                  │  │                  │
│ Bautismo de      │  │ Tabla gigante    │  │ Ciencia y        │
│ vela. Salida     │  │ 10 alumnos       │  │ conciencia.      │
│ al mar con       │  │ remando juntos.  │  │ Documental       │
│ instructores...  │  │ Equilibrio y...  │  │ Antártida...     │
│                  │  │                  │  │                  │
│ [→ Más info]     │  │ [→ Más info]     │  │ [→ Más info]     │
│                  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## 3.1 · Datos de contenido de cada card

```typescript
const activities = [
  {
    id: "01",
    icon: "⛵",
    emoji_bg: "🌊",
    title: "Navegación en Velero",
    subtitle: "Bautismo de vela",
    description: "Salida al mar con instructoras/es titulados. Aprenden cómo funciona un barco, rumbos, maniobras básicas y normas de seguridad, reforzando la autoestima y la toma de decisiones.",
    tags: ["Autonomía", "Seguridad", "Trabajo en equipo"],
    color_accent: "#0077B6"
  },
  {
    id: "02",
    icon: "🏄",
    emoji_bg: "💧",
    title: "Big SUP",
    subtitle: "Tabla gigante colectiva",
    description: "Unos 10 alumnos reman de forma coordinada. Se trabajan el equilibrio, la cooperación real y la escucha activa en una actividad muy participativa.",
    tags: ["Coordinación", "Cooperación", "Escucha activa"],
    color_accent: "#0077B6"
  },
  {
    id: "03",
    icon: "🐧",
    emoji_bg: "❄️",
    title: "Taller Antártida",
    subtitle: "Ciencia y conciencia",
    description: "A través del documental de la travesía a la Antártida, el alumnado descubre el ecosistema polar, la fauna marina y los efectos del cambio climático.",
    tags: ["Medio ambiente", "Ciencia", "Cambio climático"],
    color_accent: "#0077B6"
  }
]
```

## 3.2 · Animación de las cards (secuencia scroll)

```
TRIGGER: cuando la sección entra en viewport (threshold: 20%)

  1. El número "01" aparece primero (fadeUp, 200ms)
  2. El icono grande hace scaleIn con bounce ligero
     → transition: { type: "spring", stiffness: 200, damping: 15 }
  3. El título fadeUp (delay 150ms)
  4. La descripción fadeUp (delay 250ms)
  5. Los tags aparecen en stagger horizontal (cada 80ms)
  6. El botón aparece último (delay 400ms)

STAGGER entre cards: 0.15s (card 2 empieza 150ms después de card 1)
```

## 3.3 · Hover state en las cards

```
Estado normal:
  background: white
  border: 1px solid #E5E7EB
  shadow: 0 4px 20px rgba(0,0,0,0.06)
  
Estado hover (whileHover):
  background: white
  border: 1px solid #90E0EF
  shadow: 0 20px 60px rgba(0,119,182,0.12)
  y: -8px
  transition: duration 0.3s, ease: easeOut
  
  → El número "01" cambia de color: #1A1A2E → #0077B6
  → El icono hace scale: 1.0 → 1.1 (spring suave)
```

## 3.4 · Vista mobile (scroll horizontal tipo carrusel)

```
Mobile (< 768px):
┌──────────────────────────────────────────────────┐
│  ← swipe →                                       │
│  ┌────────────┐  ┌ · · ┐  ┌────────────┐        │
│  │  ⛵ Velero │  │ · · │  │ Antártida🐧│        │
│  │            │  │     │  │            │        │
│  └────────────┘  └─────┘  └────────────┘        │
│           ●  ○  ○  (dots indicador)             │
└──────────────────────────────────────────────────┘
```

---

# ━━━ FASE 4 · PRECIOS & DISPONIBILIDAD ━━━━━━━━━━━━━━━━━━━━
> ⏱️ Duración estimada: **3–4 horas**
> 🎯 Máxima claridad. El precio justo merece lucirse.

## Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│              Todo incluido por                                 │
│                                                                │
│                 ╔══════════╗                                   │
│                 ║  15 €   ║    ← número anima (count up)     │
│                 ║ alumno  ║                                    │
│                 ╚══════════╝                                   │
│                                                                │
│   ✓ Las 3 actividades completas                               │
│   ✓ Todo el material necesario                                │
│   ✓ Embarcaciones                                             │
│   ✓ Monitorado titulado                                       │
│   ✓ Seguros incluidos                                         │
│                                                                │
│   ──────────────────────────────────                          │
│                                                                │
│   📅  Septiembre → Junio                                       │
│   Primavera y otoño: fechas más demandadas                    │
│   Reserva con antelación                                       │
│                                                                │
│   🌦️  Sujeto a meteorología                                    │
│   En caso adverso: adaptamos o cambiamos fecha                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 4.1 · Animación del número "15 €" (count-up)

```tsx
// El número cuenta de 0 a 15 cuando entra en viewport
import { useMotionValue, useTransform, animate } from 'framer-motion'

const count = useMotionValue(0)
const rounded = useTransform(count, Math.round)

useEffect(() => {
  if (isInView) {
    animate(count, 15, { duration: 1.5, ease: "easeOut" })
  }
}, [isInView])

<motion.span>{rounded} €</motion.span>
```

## 4.2 · Checklist animada (items entran uno a uno)

```
DELAY entre cada item: 80ms
ANIMACIÓN: slideFromLeft + fadeIn
ICONO ✓: scaleIn con spring  
         → transition: { type: "spring", stiffness: 300, damping: 20 }
```

## 4.3 · Bloque de meteorología (tono honesto, diseño cálido)

```
┌─────────────────────────────────────────────────────────────┐
│   🌦️  Nos tomamos el mar en serio                           │
│                                                             │
│   Si la previsión no acompaña, adaptamos la jornada        │
│   o acordamos una nueva fecha contigo.                     │
│   La seguridad siempre es lo primero.                      │
└─────────────────────────────────────────────────────────────┘

Fondo: --color-sand (#F5F0E8)
Border-left: 4px solid --color-ocean
Animación: fadeIn con delay 0.6s
```

---

# ━━━ FASE 5 · CTA PRINCIPAL + DESCARGA PDF ━━━━━━━━━━━━━━━━
> ⏱️ Duración estimada: **2–3 horas**
> 🎯 El cierre. Dos caminos claros: reservar o llevarse la info.

## Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  WAVE (top) ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  │
│                                                                │
│   Fondo: --color-deep (#03045E) · texto blanco                │
│                                                                │
│              ¿Lista para reservar?                            │
│                                                                │
│       Escríbenos con el número de alumnos                     │
│       y la fecha que os viene mejor.                          │
│       Nos encargamos del resto.                               │
│                                                                │
│      ┌──────────────────────┐  ┌──────────────────────┐      │
│      │  📧 Reservar fecha  │  │  📄 Descargar dossier │      │
│      │  [botón primario]   │  │  [botón secundario]   │      │
│      └──────────────────────┘  └──────────────────────┘      │
│                                                                │
│      → PDF: "Actividades náuticas para centros escolares"     │
│                                                                │
│   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  WAVE (bot) ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 5.1 · Animación del bloque CTA

```
Fondo oscuro (#03045E) actúa como contraste total.
Texto blanco puro, jerarquía clara.

SECUENCIA:
  1. Wave superior se anima (pathLength draw)
  2. Headline slideFromLeft
  3. Párrafo fadeUp con delay
  4. Botones aparecen en stagger (cada 120ms)
  5. Wave inferior se anima
```

## 5.2 · Botón "Reservar fecha"

```tsx
<motion.button
  whileHover={{ scale: 1.04, backgroundColor: "#90E0EF" }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.2 }}
  className="btn-primary"
>
  📧 Reservar fecha
</motion.button>
```

## 5.3 · Botón "Descargar dossier PDF"

```tsx
<motion.a
  href="/docs/actividades-nauticas-centros-escolares.pdf"
  download
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  // Animación de descarga al hacer click:
  // el icono 📄 hace una pequeña animación hacia abajo
>
  📄 Descargar dossier para el centro
</motion.a>
```

**El PDF debe incluir (preparar documento aparte):**
- Nombre del programa
- Las 3 actividades descritas
- Logística: rotaciones, capacidad, duración
- Precio: 15 €/alumno con desglose de qué incluye
- Contacto y formulario de solicitud de reserva
- Logo Getxo Bela Eskola

---

# ━━━ FASE 6 · Polish, Accesibilidad & Performance ━━━━━━━━━━
> ⏱️ Duración estimada: **3–4 horas**
> 🎯 La diferencia entre "bonito" y "profesional".

## 6.1 · Reducción de movimiento (obligatorio ♿)

```tsx
// Respetar prefers-reduced-motion
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

const animationVariant = shouldReduceMotion ? fadeIn : fadeUp
// → Si el usuario tiene reducción de movimiento activada,
//   solo hacemos fade (sin movimiento físico)
```

## 6.2 · Lazy loading de imágenes

```tsx
// Todas las imágenes con loading="lazy" y placeholder blur
<Image
  src="/images/velero-getxo.jpg"
  alt="Alumnos navegando en velero en Getxo"
  loading="lazy"
  placeholder="blur"
  blurDataURL="..."
/>
```

## 6.3 · Checklist final antes de publicar

```
□ Las animaciones tienen duración < 800ms (regla de oro UX)
□ El botón de reserva tiene aria-label descriptivo
□ El PDF tiene nombre de archivo correcto en euskera/castellano
□ La sección funciona bien en móvil (375px mínimo)
□ Los colores pasan contraste WCAG AA
□ El Wave SVG no bloquea el scroll en iOS
□ Las cards tienen foco visible con teclado
□ Se testa con throttling de red (3G) — sección carga < 3s
□ Se añade metadata og:image para compartir en redes
```

## 6.4 · Micro-interacciones finales (detalles que enamoran)

```
• Al hacer hover en una card de actividad:
  → El número "01" hace un flip sutil (rotateY 0 → 5deg)

• Al hacer scroll past la sección de precios:
  → Los datos numéricos (60 alumnos, 3h, 15€) "parpadean" 
    suavemente una vez para recordar que estuvieron en pantalla

• El Wave divider respira en loop lento (ya implementado en Fase 1)

• Al pulsar el botón PDF:
  → El icono 📄 hace animate: y: [0, -6, 0] (rebotito)
  → Aparece un toast suave: "Descargando dossier..."

• Al pasar el cursor por los tags de actividad (Autonomía, Cooperación...):
  → background: transparent → rgba(0,119,182,0.08)
  → border-color: #0077B6
  → Transición: 200ms
```

---

# 📦 Estructura de archivos sugerida

```
src/
├── components/
│   └── CentrosEscolares/
│       ├── index.tsx                 ← Componente raíz de la sección
│       ├── CentrosHero.tsx           ← Fase 1
│       ├── ComoFunciona.tsx          ← Fase 2
│       ├── ActividadesCards.tsx      ← Fase 3
│       ├── ActivityCard.tsx          ← Card individual
│       ├── PreciosBloque.tsx         ← Fase 4
│       ├── CtaSection.tsx            ← Fase 5
│       └── WaveDivider.tsx           ← Reutilizable entre secciones
├── lib/
│   └── motionPresets.ts              ← Fase 0.4
├── hooks/
│   └── useScrollReveal.ts            ← Fase 0.5
├── data/
│   └── activities.ts                 ← Datos de las 3 actividades
└── public/
    └── docs/
        └── actividades-nauticas-centros-escolares.pdf
```

---

# 🎯 Resumen visual de fases

```
FASE 0 · Setup & Tokens         [██████░░░░]  2–3h   → Fundación invisible
FASE 1 · Hero Section           [████████░░]  4–6h   → Primera impresión ✨
FASE 2 · ¿Cómo funciona?        [████████░░]  5–7h   → Diagrama de rotaciones
FASE 3 · Las 3 Actividades      [█████████░]  6–8h   → Corazón del producto
FASE 4 · Precios                [██████░░░░]  3–4h   → Transparencia total
FASE 5 · CTA + PDF              [█████░░░░░]  2–3h   → Conversión
FASE 6 · Polish                 [██████░░░░]  3–4h   → La diferencia real

TOTAL ESTIMADO: 25–35 horas de desarrollo
```

---

> **Texto copy principal** (extraído del documento oficial):
>
> *"Acercamos la mar a los centros educativos y asociaciones a través de experiencias vivenciales donde deporte, ciencia y trabajo en equipo se unen en un entorno real y estimulante."*
>
> Usar este texto como hero subtitle completo en la versión larga de la página.

---

*Plan elaborado para getxobelaeskola.cloud · Sección Centros Escolares y Asociaciones*  
*Stack: React · Framer Motion · Tailwind CSS · Next.js*  
*Estética: Apple Clean × Bonka Magic × Océano Cantábrico* 🌊
