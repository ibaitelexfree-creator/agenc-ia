# ⛵ Plan de Implementación — Sección Team Building & Regata Corporativa
### getxobelaeskola.cloud · Estilo Apple Clean × Bonka Magic · Público: RRHH & Directivos

---

> **Referencia visual:** [cafebonka.com](https://cafebonka.com) — scroll narrativo, ritmo cinematográfico, blancos puros, tipografía que respira.
> **Stack:** React · Framer Motion · Tailwind CSS · Next.js
> **Público objetivo:** Directivos, Responsables de RRHH, Coordinadores de eventos corporativos
> **Filosofía de diseño:** *"El mar no tiene sala de reuniones. Y eso es exactamente el punto."*
> **Elemento firma:** Un split animado tierra ↔ mar que sucede al hacer scroll — el mundo de la oficina se disuelve en el océano.

---

## 🗺️ Mapa general de la sección

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  FASE 0     FASE 1      FASE 2       FASE 3      FASE 4                 │
│  Tokens  →  Hero    →  Split       →  El J80  →  Jornada               │
│  & Setup    "Ruptura"   Tierra/Mar    Roles       Timeline              │
│                         ★FIRMA★                                          │
│                                                                          │
│  FASE 5     FASE 6      FASE 7                                          │
│  Aprendi- →  Detalles →  Polish                                         │
│  zaje        + CTA       & A11y                                         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Tiempo estimado total:** 30–40 horas · 1 dev con Framer Motion intermedio–avanzado

---

# ━━━ FASE 0 · Setup & Design Tokens ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⏱️ **2–3 horas** · Responsable: Dev principal
> 📌 Misma base que la sección de Centros pero con un matiz corporativo-premium

## 0.1 · Instalar dependencias

```bash
npm install framer-motion
npm install lucide-react
npm install @fontsource/dm-serif-display
npm install @fontsource/inter
```

## 0.2 · Paleta de color — Corporativo × Atlántico

| Token | Hex | Uso | Nota |
|---|---|---|---|
| `--white` | `#FFFFFF` | Fondo dominante | 80% de la página |
| `--offwhite` | `#F7F8FA` | Bloques alternos | Muy sutil |
| `--navy` | `#0A1628` | Headlines premium | Más oscuro que --deep |
| `--ocean` | `#005F8A` | Acentos principales | Más sobrio que centros |
| `--horizon` | `#B8D4E8` | Decorativo, fondos | El cielo sobre el mar |
| `--graphite` | `#374151` | Cuerpo de texto | Profesional |
| `--muted` | `#9CA3AF` | Labels, eyebrows | |
| `--cta-gold` | `#C9A84C` | Solo en botón CTA premium | Oro marinero |

> **¿Por qué `--cta-gold`?** Las páginas B2B corporativas (Recursos Humanos, directivos)
> responden mejor a un CTA que dice "premium" en lugar de uno genérico azul.
> El dorado ancla visualmente bien con el navy y el océano. Es el riesgo de diseño deliberado.

## 0.3 · Tipografía — Dos mundos, una voz

```
╔════════════════════════════════════════════════════════════╗
║  DISPLAY (titulares de impacto)                           ║
║  → DM Serif Display · weight 400 · tracking -0.03em      ║
║  → "El mar rompe jerarquías."                             ║
║  → Máximo 3 palabras por línea en desktop                 ║
╠════════════════════════════════════════════════════════════╣
║  HEADING (subtítulos de sección)                          ║
║  → Inter · weight 600 · tracking -0.01em                 ║
╠════════════════════════════════════════════════════════════╣
║  BODY                                                     ║
║  → Inter · weight 400 · line-height 1.75                 ║
╠════════════════════════════════════════════════════════════╣
║  EYEBROW / LABEL                                          ║
║  → Inter · weight 500 · uppercase · letter-spacing 0.18em║
║  → Color: --ocean · tamaño: 11px                         ║
╚════════════════════════════════════════════════════════════╝
```

## 0.4 · Motion Presets (crear `/lib/corporateMotion.ts`)

```typescript
export const revealUp = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0,
             transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

export const revealLeft = {
  hidden:  { opacity: 0, x: -70 },
  visible: { opacity: 1, x: 0,
             transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
}

export const revealRight = {
  hidden:  { opacity: 0, x: 70 },
  visible: { opacity: 1, x: 0,
             transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
}

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } }
}

export const popIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1,
             transition: { type: "spring", stiffness: 180, damping: 18 } }
}

// Para el split tierra→mar (elemento firma)
export const splitReveal = {
  land: { clipPath: "inset(0 50% 0 0)" },  // Cubre la mitad derecha
  sea:  { clipPath: "inset(0 0% 0 0)",      // Descubre todo
          transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
}
```

## 0.5 · Hook `useStickyScroll` (para el timeline horizontal)

```typescript
// hooks/useStickyScroll.ts
// Permite crear secciones que "pegan" verticalmente
// mientras se hace scroll horizontal internamente

import { useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'

export const useStickyScroll = (itemCount: number) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref,
    offset: ["start start", "end end"] })
  const x = useTransform(scrollYProgress, [0, 1],
    ["0%", `-${(itemCount - 1) * 100}%`])
  return { ref, x }
}
```

---

# ━━━ FASE 1 · HERO — "El mar rompe jerarquías" ━━━━━━━━━━━━━━━━━
> ⏱️ **5–7 horas** · El pliegue más importante de la página
> 🎯 Un directivo o responsable de RRHH debe sentir en 4 segundos:
>    *"Esto es diferente. Esto vale la pena."*

## Wireframe Hero

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ─── EYEBROW ──────────────────────────────────────────────────    │
│  TEAM BUILDING · REGATA CORPORATIVA · GETXO                        │
│                                                                     │
│  ┌───────────────────────────────────┐  ┌───────────────────────┐  │
│  │                                   │  │                       │  │
│  │  Aquí las                         │  │   [imagen J80 en      │  │
│  │  jerarquías                       │  │    movimiento,        │  │
│  │  se disuelven                     │  │    vela llena,        │  │
│  │  en el viento.                    │  │    Abra de Bilbao]    │  │
│  │                                   │  │                       │  │
│  │  Experiencias en la mar para      │  │                       │  │
│  │  empresas que buscan fortalecer   │  │                       │  │
│  │  su equipo de verdad.             │  │                       │  │
│  │                                   │  │                       │  │
│  │  [★ Solicitar presupuesto]        │  │                       │  │
│  │  [→  Cómo funciona  ]             │  │                       │  │
│  │                                   │  │                       │  │
│  └───────────────────────────────────┘  └───────────────────────┘  │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 3–3,5h   │  │ J80      │  │ Sin exp. │  │ A medida │          │
│  │ jornada  │  │ veleros  │  │ previa   │  │ tu grupo │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
│                                                                     │
│  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿   │
└─────────────────────────────────────────────────────────────────────┘
```

## 1.1 · Secuencia de entrada orquestada

```
TIMELINE DE ANIMACIÓN DE ENTRADA:
────────────────────────────────────────────────────────
  0ms    → Página carga. Fondo blanco puro visible.
  80ms   → EYEBROW aparece: fadeUp + opacity 0→1
 200ms   → "Aquí las" · slideUp desde y:60 → y:0
 380ms   → "jerarquías" · slideUp con ligero spring
 560ms   → "se disuelven" · slideUp
 740ms   → "en el viento." · slideUp · peso visual máximo
 900ms   → Subtítulo: fadeIn suave (sin movimiento)
1100ms   → Botón CTA dorado: scaleIn desde 0.9 + fadeIn
1250ms   → Botón secundario: fadeIn
1400ms   → Imagen del J80: scale 0.95→1.0 + fadeIn
1600ms   → Stat pills aparecen en stagger (4 × 100ms)
2000ms   → Wave SVG inferior inicia su respiración en loop
────────────────────────────────────────────────────────
```

## 1.2 · Código del headline word-by-word

```tsx
// Cada línea entra independientemente
const heroLines = ["Aquí las", "jerarquías", "se disuelven", "en el viento."]

<motion.div variants={stagger} initial="hidden" animate="visible">
  {heroLines.map((line, i) => (
    <motion.span
      key={i}
      variants={revealUp}
      style={{
        display: "block",
        fontFamily: "DM Serif Display",
        fontSize: "clamp(3rem, 7vw, 6.5rem)",
        color: "var(--navy)",
        lineHeight: 1.05,
        letterSpacing: "-0.03em"
      }}
    >
      {line}
    </motion.span>
  ))}
</motion.div>
```

## 1.3 · Botón CTA dorado (elemento diferenciador)

```tsx
<motion.button
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  whileHover={{
    scale: 1.04,
    boxShadow: "0 12px 40px rgba(201,168,76,0.35)"
  }}
  whileTap={{ scale: 0.97 }}
  style={{
    background: "var(--cta-gold)",
    color: "var(--navy)",
    fontWeight: 600,
    letterSpacing: "0.01em",
    borderRadius: "999px",
    padding: "16px 36px"
  }}
>
  ★ Solicitar presupuesto a medida
</motion.button>
```

## 1.4 · Stat pills (4 datos clave)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   ⏱ 3–3,5h  │  │  ⛵ J80      │  │  ✓ Sin exp.  │  │  ✎ A medida  │
│   de jornada │  │  veleros     │  │  necesaria   │  │  tu grupo    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

Animación: stagger 100ms entre cada pill
Estado: border 1px solid #E5E7EB · fondo blanco
Hover:  border-color --horizon · lift y:-4px · shadow suave
Cada pill: whileHover={{ y: -4, borderColor: "var(--horizon)" }}
```

---

# ━━━ FASE 2 · SPLIT TIERRA ↔ MAR (★ ELEMENTO FIRMA) ━━━━━━━━━━━━━
> ⏱️ **8–10 horas** · El momento más memorable de toda la página
> 🎯 Mientras el usuario hace scroll, el mundo de la oficina
>    se transforma visualmente en el océano. Es el "wow" moment.

## Concepto visual

```
                 SCROLL HACIA ABAJO
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Estado inicial (sin scroll):                               │
│                                                             │
│  ┌──────────────────┬──────────────────┐                   │
│  │ 🏢               │ 🌊               │                   │
│  │  Sala de         │  El Abra de      │                   │
│  │  reuniones       │  Bilbao          │                   │
│  │  [gris, estático]│  [azul, vivo]    │                   │
│  │                  │                  │                   │
│  │  "La comunicación│ "En el velero,   │                   │
│  │  se planifica"   │  sucede sola"    │                   │
│  └──────────────────┴──────────────────┘                   │
│                        │                                    │
│                 SCROLL MÁS                                  │
│                        │                                    │
│  Estado final (scroll completado):                          │
│                                                             │
│  ┌─────────────────────────────────────┐                   │
│  │         🌊🌊🌊🌊🌊🌊🌊🌊           │                   │
│  │                                     │                   │
│  │  La mar se ha comido la oficina.    │                   │
│  │  El panel izquierdo desapareció.    │                   │
│  │  Solo queda el océano.              │                   │
│  └─────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## 2.1 · Datos para los 3 pares de contraste

```typescript
const contrasts = [
  {
    office: {
      icon: "📋",
      label: "Sala de reuniones",
      phrase: "La comunicación se planifica."
    },
    sea: {
      icon: "🌊",
      label: "A bordo del J80",
      phrase: "A bordo, sucede sola."
    }
  },
  {
    office: {
      icon: "🪑",
      label: "Jerarquías fijas",
      phrase: "Hay quien manda y quien obedece."
    },
    sea: {
      icon: "⛵",
      label: "Tripulación real",
      phrase: "Todas tenéis una función que importa."
    }
  },
  {
    office: {
      icon: "📊",
      label: "Presión conocida",
      phrase: "Los imprevistos se gestionan en diferido."
    },
    sea: {
      icon: "💨",
      label: "El viento decide",
      phrase: "Aquí los imprevistos son en tiempo real."
    }
  }
]
```

## 2.2 · Implementación del split animado

```tsx
// components/TeamBuilding/SplitSection.tsx
// El panel izquierdo (oficina) se encoge mientras el panel
// derecho (mar) crece, usando useTransform sobre scrollYProgress

const containerRef = useRef(null)
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"]
})

// Panel izquierdo: 50% → 0%
const leftWidth = useTransform(scrollYProgress, [0, 0.8], ["50%", "0%"])
// Panel derecho: 50% → 100%
const rightWidth = useTransform(scrollYProgress, [0, 0.8], ["50%", "100%"])
// Opacidad de la oficina: 1 → 0
const leftOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
// Escala del mar: 1 → 1.05 (zoom sutil)
const rightScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

// El texto del panel derecho cambia con scroll
// (3 pares de contraste que se alternan)
const activeIndex = useTransform(scrollYProgress,
  [0, 0.33, 0.66, 1], [0, 0, 1, 2])
```

## 2.3 · Estructura HTML del split

```tsx
<section
  ref={containerRef}
  style={{ height: "300vh" }}    // 3x pantalla para scroll lento
  className="relative"
>
  {/* Sticky wrapper que se queda pegado durante el scroll */}
  <div className="sticky top-0 h-screen flex overflow-hidden">

    {/* PANEL IZQUIERDO — Oficina */}
    <motion.div
      style={{ width: leftWidth, opacity: leftOpacity }}
      className="relative bg-[#F7F8FA] flex items-center justify-center"
    >
      <OfficeContent activeIndex={activeIndex} />
    </motion.div>

    {/* PANEL DERECHO — Mar */}
    <motion.div
      style={{ width: rightWidth }}
      className="relative bg-[#005F8A] overflow-hidden"
    >
      <motion.div style={{ scale: rightScale }} className="w-full h-full">
        <SeaContent activeIndex={activeIndex} />
      </motion.div>
    </motion.div>

  </div>
</section>
```

## 2.4 · Textos que aparecen dentro del panel del mar

```
┌─────────────────────────────────────────────────────────────┐
│   [Panel azul-océano, texto blanco]                         │
│                                                             │
│   ── ESTADO 1 (scroll 0–33%) ──                            │
│   "A bordo del J80,                                        │
│    la comunicación                                          │
│    sucede sola."                                            │
│                                                             │
│   ── ESTADO 2 (scroll 33–66%) ──                           │
│   "Todas tenéis                                             │
│    una función                                              │
│    que importa."                                            │
│                                                             │
│   ── ESTADO 3 (scroll 66–100%) ──                          │
│   "Los imprevistos                                          │
│    se resuelven                                             │
│    ahora."                                                  │
│                                                             │
│   Transición entre estados: AnimatePresence + fadeIn        │
└─────────────────────────────────────────────────────────────┘
```

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeIndex}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.5 }}
  >
    {seaTexts[activeIndex]}
  </motion.div>
</AnimatePresence>
```

---

# ━━━ FASE 3 · EL J80 — Diagrama interactivo del barco ━━━━━━━━━━━
> ⏱️ **6–8 horas**
> 🎯 La gente no sabe qué es un J80. Aquí lo descubrirán y lo querrán.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  EYEBROW: EL VELERO                                            │
│                                                                 │
│  "Nuestros J80. Ágiles,                                        │
│   divertidos y perfectos                                        │
│   para aprender juntos."                                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                        │    │
│  │          [Silueta SVG del J80]                         │    │
│  │                                                        │    │
│  │    ①─────────────────────────────────────────────→    │    │
│  │    │ Proa                          Popa ←─────────②   │    │
│  │    │                                                   │    │
│  │    ③─ Vela mayor (gran...)[hover: aparece descripción] │    │
│  │    │                                                   │    │
│  │    ④─ Génova [hover: aparece descripción]              │    │
│  │                                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ① Proa    ② Timón    ③ Vela mayor    ④ Génova                 │
│  [pills clicables que iluminan la parte del barco]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3.1 · Datos de los puntos del barco

```typescript
const boatPoints = [
  {
    id: "proa",
    label: "Proa",
    position: { x: "15%", y: "50%" },
    description: "El frente del barco. Quien trabaja aquí maneja las velas de proa y necesita anticipación y comunicación constante.",
    skill: "Anticipación · Comunicación"
  },
  {
    id: "timon",
    label: "Timón",
    position: { x: "82%", y: "58%" },
    description: "Quien lleva el timón dirige el barco pero depende del equipo para hacerlo bien. Liderazgo real, no nominal.",
    skill: "Liderazgo · Escucha"
  },
  {
    id: "vela-mayor",
    label: "Vela mayor",
    position: { x: "50%", y: "20%" },
    description: "La vela principal. Su manejo colectivo requiere coordinación precisa y reacción rápida a los cambios de viento.",
    skill: "Coordinación · Reacción"
  },
  {
    id: "winch",
    label: "Winches",
    position: { x: "65%", y: "65%" },
    description: "Los carretes de tensión. Trabajo físico y mecánico que requiere fuerza, ritmo y comunicación con el timonel.",
    skill: "Ejecución · Ritmo"
  }
]
```

## 3.2 · Animación de los puntos interactivos

```
ESTADO INICIAL:
  → Los 4 puntos ① ② ③ ④ aparecen en stagger (spring)
  → Cada punto: círculo blanco con borde --ocean, pulsa suavemente

ANIMACIÓN DE PULSO (idle, en loop):
  animate={{ scale: [1, 1.15, 1] }}
  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}

AL HACER HOVER en un punto:
  → El punto escala a 1.3 con spring
  → Un tooltip aparece (AnimatePresence, fadeUp)
  → La silueta del barco muestra un highlight en esa zona (opacity 0 → 0.3)

AL HACER CLICK en un punto (mobile):
  → Se abre un panel descriptivo abajo del barco
  → AnimatePresence + slide desde abajo
```

## 3.3 · Tooltip de cada punto

```
Tooltip design:
┌───────────────────────────────┐
│ ① Proa                       │
│                               │
│ "Quien trabaja aquí maneja    │
│  las velas de proa y necesita │
│  anticipación constante."     │
│                               │
│ 🏷️ Anticipación · Comunicación│
└───────────────────────────────┘

Fondo: #FFFFFF
Border: 1px solid #E5E7EB
Shadow: 0 20px 60px rgba(0,0,0,0.10)
Tag skill: background #EBF5FB · color --ocean · border-radius 999px
```

---

# ━━━ FASE 4 · JORNADA — Timeline horizontal sticky ━━━━━━━━━━━━━━━
> ⏱️ **5–6 horas**
> 🎯 El usuario scrollea verticalmente pero la jornada avanza horizontalmente.
>    Sensación de "viaje" que refuerza la narrativa.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Scroll hacia abajo → la línea de tiempo avanza →]            │
│                                                                 │
│  ────────────────────────────────────────────────────────────   │
│  │                                                        │    │
│  TIERRA      →      AGUA       →     AGUA      →  TIERRA │    │
│  │                                                        │    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │    │
│  │          │  │          │  │          │  │          │ │    │
│  │ 🏖️       │  │ ⛵        │  │ 🏆       │  │ 🍻       │ │    │
│  │ Briefing │  │ Navegación│  │ Regata   │  │ Puesta   │ │    │
│  │ en tierra│  │ & roles   │  │(opcional)│  │ en común │ │    │
│  │          │  │           │  │          │  │          │ │    │
│  │ 20–30min │  │  90 min   │  │  60 min  │  │  20 min  │ │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │    │
│                                                                 │
│  ════════════════════════════ 3h – 3h 30min total ═══════════   │
└─────────────────────────────────────────────────────────────────┘
```

## 4.1 · Datos del timeline

```typescript
const jornada = [
  {
    fase: "Tierra",
    icon: "🏖️",
    titulo: "Briefing de bienvenida",
    descripcion: "Explicación sencilla de los roles a bordo, las bases de la navegación y la importancia de la coordinación. Sin tecnicismos.",
    duracion: "20–30 min",
    color: "#F7F8FA"
  },
  {
    fase: "Agua",
    icon: "⛵",
    titulo: "Navegación y roles",
    descripcion: "Todo el equipo a bordo de los J80. Cada persona ocupa un rol real. Las maniobras son la práctica: viradas, trasluchadas, comunicación bajo presión.",
    duracion: "90 min",
    color: "#EBF5FB"
  },
  {
    fase: "Agua",
    icon: "🏆",
    titulo: "Regata entre barcos",
    descripcion: "Opcional. Si hay varios barcos, una regata amistosa donde el foco no es ganar sino aplicar lo aprendido. El viento iguala a todos.",
    duracion: "60 min",
    color: "#EBF5FB",
    optional: true
  },
  {
    fase: "Tierra",
    icon: "💬",
    titulo: "Puesta en común",
    descripcion: "Vuelta a tierra. Integración de lo vivido: ¿qué pasó en el barco? ¿qué se puede trasladar al trabajo? Una conversación que cierra el círculo.",
    duracion: "20 min",
    color: "#F7F8FA"
  }
]
```

## 4.2 · Implementación del scroll horizontal sticky

```tsx
// 4 pasos × 100vw = 400vh de scroll total para recorrer el timeline
<section ref={sectionRef} style={{ height: "400vh" }}>
  <div className="sticky top-0 h-screen overflow-hidden">

    {/* Barra de progreso del timeline */}
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="absolute top-0 left-0 w-full h-1 bg-ocean origin-left"
    />

    {/* Cards que se deslizan horizontalmente */}
    <motion.div
      style={{ x }}   // x viene de useStickyScroll
      className="flex h-full"
    >
      {jornada.map((paso, i) => (
        <TimelineCard key={i} paso={paso} index={i} />
      ))}
    </motion.div>

  </div>
</section>
```

## 4.3 · Indicador de fase (Tierra / Agua)

```
Al cambiar de "Tierra" a "Agua":
→ La barra superior cambia de color:
  Tierra: #F7F8FA (claro)
  Agua:   #005F8A (océano)
  
Transición de color: motion.div con animate={{ backgroundColor }}
duration: 0.8s ease
```

---

# ━━━ FASE 5 · EL APRENDIZAJE TRANSFERIBLE ━━━━━━━━━━━━━━━━━━━━━━━
> ⏱️ **4–5 horas**
> 🎯 La razón por la que los de RRHH aprueban el presupuesto.
>    Cada valor del mar tiene su espejo en el trabajo.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  EYEBROW: LO QUE OS LLEVÁIS                                    │
│                                                                 │
│  "No es una actividad puntual.                                  │
│   Es una vivencia que cambia                                    │
│   cómo os comunicáis."                                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  MAR  ────────────────────→  TRABAJO                 │     │
│  │                                                       │     │
│  │  "Maniobra de virada"    → "Adaptarse al cambio"     │     │
│  │        ↕ línea conectora animada                     │     │
│  │  "Comunicación urgente"  → "Gestión de la presión"   │     │
│  │        ↕                                             │     │
│  │  "Rol en el barco"       → "Responsabilidad real"    │     │
│  │        ↕                                             │     │
│  │  "Viento impredecible"   → "Tolerancia a la          │     │
│  │                             incertidumbre"           │     │
│  │        ↕                                             │     │
│  │  "Regata colectiva"      → "Foco en el equipo,       │     │
│  │                             no en el ego"            │     │
│  │                                                       │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 5.1 · Datos del mapa de transferencia

```typescript
const transferencias = [
  {
    mar:     "Maniobra de virada",
    trabajo: "Adaptarse al cambio",
    icono:   "🔄"
  },
  {
    mar:     "Comunicación bajo presión",
    trabajo: "Gestión de crisis",
    icono:   "📡"
  },
  {
    mar:     "Rol real a bordo",
    trabajo: "Responsabilidad individual",
    icono:   "🧭"
  },
  {
    mar:     "Viento impredecible",
    trabajo: "Tolerancia a la incertidumbre",
    icono:   "💨"
  },
  {
    mar:     "Regata colectiva",
    trabajo: "El equipo por encima del ego",
    icono:   "🏆"
  }
]
```

## 5.2 · Animación de las líneas conectoras

```
SECUENCIA cuando la sección entra en viewport:

  1. El lado MAR aparece (slideFromLeft, stagger 100ms)
  2. Las líneas conectoras se dibujan (pathLength 0 → 1, stagger 150ms)
  3. El lado TRABAJO aparece (slideFromRight, stagger 100ms)

Las líneas son SVG con:
<motion.line
  x1="..." y1="..." x2="..." y2="..."
  stroke="var(--horizon)"
  strokeWidth="1.5"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.6, delay: i * 0.15 }}
/>
```

## 5.3 · Quote final de la sección

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ❝ Al finalizar, realizamos una puesta en común           │
│     para integrar lo vivido y trasladarlo                   │
│     al ámbito laboral. ❞                                    │
│                                                             │
│                              — Getxo Bela Eskola            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Fondo: --navy (#0A1628)
Texto: blanco
Comillas: DM Serif Display · 8rem · color #B8D4E8 · opacity 0.3
Animación: fadeIn · duration 1.2s
```

---

# ━━━ FASE 6 · DETALLES + CTA CORPORATIVO ━━━━━━━━━━━━━━━━━━━━━━━━
> ⏱️ **3–4 horas**
> 🎯 Cerrar con elegancia. RRHH quiere datos, directivos quieren facilidad.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  COLUMNA IZQUIERDA          COLUMNA DERECHA                    │
│                                                                 │
│  ⏱ Duración                 📅 Disponibilidad                 │
│  3h – 3h 30min              A convenir · todo el año           │
│                                                                 │
│  👥 Grupos                  🎯 Nivel requerido                 │
│  Adaptados al tamaño        Sin experiencia previa             │
│  del equipo                 necesaria                          │
│                                                                 │
│  ─────────────────────────────────────────────                 │
│                                                                 │
│          "¿Listo para sacar a tu equipo                        │
│           de la sala de reuniones?"                            │
│                                                                 │
│          [★ Solicitar presupuesto a medida]                    │
│          [→ Escribirnos directamente      ]                    │
│                                                                 │
│  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿                       │
└─────────────────────────────────────────────────────────────────┘
```

## 6.1 · Cards de detalles con micro-animación

```tsx
// 4 cards en grid 2×2
// Cada una: icono + dato + descripción corta
// Hover: border-color cambia de #E5E7EB → --ocean (0.3s)
//        La card sube y:-6px (spring)
//        El icono hace scale: 1 → 1.15

<motion.div
  whileHover={{ y: -6, borderColor: "var(--ocean)" }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  <motion.span whileHover={{ scale: 1.15 }} className="text-4xl">
    {card.icon}
  </motion.span>
  ...
</motion.div>
```

## 6.2 · Bloque CTA final (fondo --navy)

```
COLOR:  fondo #0A1628 (navy profundo)
TEXTO:  blanco puro
WAVE:   SVG animada en la parte superior del bloque (color #1A2E4A)

SECUENCIA DE ENTRADA:
  1. Wave superior se dibuja (pathLength)
  2. Headline: revealUp
  3. Subtítulo: fadeIn delay 0.3s
  4. Botón dorado: scaleIn delay 0.5s con glow
  5. Botón secundario: fadeIn delay 0.65s
```

## 6.3 · Botón CTA final con efecto glow pulsante

```tsx
// El botón dorado tiene un glow que pulsa en loop
// para llamar la atención sin ser agresivo

<motion.button
  animate={{
    boxShadow: [
      "0 0 0px rgba(201,168,76,0)",
      "0 0 30px rgba(201,168,76,0.4)",
      "0 0 0px rgba(201,168,76,0)"
    ]
  }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
>
  ★ Solicitar presupuesto a medida
</motion.button>
```

---

# ━━━ FASE 7 · Polish, Accesibilidad & Performance ━━━━━━━━━━━━━━━━
> ⏱️ **3–4 horas**
> 🎯 Un directivo o responsable de RRHH notará si algo falla.

## 7.1 · Reducción de movimiento (obligatorio ♿)

```typescript
import { useReducedMotion } from 'framer-motion'

// En el split tierra→mar (Fase 2):
// Si reducedMotion=true, desactivar el scroll horizontal
// y mostrar las 3 imágenes directamente en vertical

const shouldReduce = useReducedMotion()

// En los botones: siempre mantener hover state visual
// pero eliminar scale transforms si reducedMotion=true
```

## 7.2 · Mobile — Adaptaciones específicas

```
SPLIT TIERRA↔MAR (Fase 2):
  Mobile: no scroll horizontal. Las 3 comparativas aparecen
  como cards apiladas verticalmente con fadeUp on scroll.

TIMELINE HORIZONTAL (Fase 4):
  Mobile: se convierte en timeline vertical normal.
  Cada paso aparece con fadeUp al hacer scroll.

BARCO J80 (Fase 3):
  Mobile: los puntos son más grandes (mínimo 44×44px tap target).
  Al hacer tap, panel descriptivo se abre debajo en full-width.
```

## 7.3 · Checklist final antes de publicar

```
□ El split tierra→mar funciona en Safari iOS (probar clipPath)
□ El scroll horizontal no rompe el scroll principal en móvil
□ Los botones tienen aria-label completos
□ Los tooltips del barco son accesibles por teclado (Tab + Enter)
□ El CTA dorado pasa contraste AA (#0A1628 sobre #C9A84C ✓)
□ Las animaciones de entrada respetan prefers-reduced-motion
□ Se añade og:image corporativa (foto J80 en el Abra)
□ El formulario de "Solicitar presupuesto" tiene campos:
    - Nombre empresa
    - Nº de personas
    - Fecha preferida
    - Nombre y email de contacto
    - Campo libre para necesidades específicas
□ Tiempo de carga < 3s en 3G (throttling test)
□ El glow del botón no molesta en modo oscuro del SO
```

## 7.4 · Micro-detalles finales (los que marcan la diferencia)

```
• El cursor cambia a pointer siempre que hay algo interactivo en el barco

• Las etiquetas de habilidades (Liderazgo, Coordinación...)
  entran con un efecto de "escritura" (typewriter, letra a letra)
  la primera vez que se hace hover en el punto del barco

• En el timeline, la barra de progreso tiene un pequeño
  indicador circular que se mueve con el scroll:
  → 0%: Tierra (icono 🏖)
  → 50%: Mar (icono ⛵)
  → 100%: Tierra (icono 💬)

• Al completar el scroll del split (Fase 2), una pequeña
  línea de texto aparece brevemente:
  "La oficina ya no existe. Solo el equipo."
  → fadeIn 0.5s → fadeOut 1s después

• El botón "Solicitar presupuesto a medida" tiene un
  tooltip al hover que dice: "Adaptamos la propuesta
  a tu equipo y presupuesto" → fadeIn suave desde abajo
```

---

# 📦 Estructura de archivos

```
src/
├── components/
│   └── TeamBuilding/
│       ├── index.tsx                    ← Componente raíz de la sección
│       ├── TeamHero.tsx                 ← Fase 1
│       ├── SplitSection.tsx             ← Fase 2 ★ ELEMENTO FIRMA
│       ├── BoatDiagram.tsx              ← Fase 3
│       ├── BoatPoint.tsx                ← Punto interactivo del barco
│       ├── JornadaTimeline.tsx          ← Fase 4
│       ├── TimelineCard.tsx             ← Card individual del timeline
│       ├── AprendizajeMap.tsx           ← Fase 5
│       ├── TransferenciaRow.tsx         ← Fila mar→trabajo
│       ├── DetallesCTA.tsx              ← Fase 6
│       └── WaveDivider.tsx              ← Reutilizable (misma que centros)
├── lib/
│   └── corporateMotion.ts               ← Fase 0.4
├── hooks/
│   ├── useScrollReveal.ts               ← Reutilizable de centros
│   └── useStickyScroll.ts               ← Fase 0.5 (para timeline)
└── data/
    ├── boatPoints.ts                    ← 4 puntos del J80
    ├── contrasts.ts                     ← 3 pares tierra↔mar
    ├── jornada.ts                       ← 4 fases del día
    └── transferencias.ts                ← 5 pares aprendizaje
```

---

# 🎯 Resumen visual de fases

```
FASE 0 · Setup & Tokens           [█████░░░░░]  2–3h   → Fundación
FASE 1 · Hero "Jerarquías"        [████████░░]  5–7h   → Primera impresión
FASE 2 · Split Tierra ↔ Mar       [██████████]  8–10h  → ★ WOW MOMENT ★
FASE 3 · El J80 interactivo       [████████░░]  6–8h   → Producto visible
FASE 4 · Timeline de jornada      [███████░░░]  5–6h   → Claridad total
FASE 5 · Aprendizaje transferible [███████░░░]  4–5h   → Argumento RRHH
FASE 6 · Detalles + CTA           [██████░░░░]  3–4h   → Conversión
FASE 7 · Polish & A11y            [██████░░░░]  3–4h   → Profesionalismo

TOTAL ESTIMADO: 36–47 horas de desarrollo
```

---

## 🔗 Coherencia con la sección de Centros Escolares

> Ambas secciones comparten: `WaveDivider`, `useScrollReveal`, y la paleta base.
> Se diferencian en tono: Centros = cálido, educativo · Team Building = premium, corporativo.
> El token `--cta-gold` es **exclusivo** de Team Building. No usar en Centros.

---

*Plan elaborado para getxobelaeskola.cloud · Sección Team Building & Regata Corporativa*
*Stack: React · Framer Motion · Tailwind CSS · Next.js*
*Estética: Apple Clean × Bonka Magic × Océano Atlántico × Premium Corporativo* ⛵
