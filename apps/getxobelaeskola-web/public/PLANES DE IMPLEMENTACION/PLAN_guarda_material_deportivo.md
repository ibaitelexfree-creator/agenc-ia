# 🌊 PLAN DE IMPLEMENTACIÓN — Sección "Guarda tu Material"
### getxobelaeskola.cloud · Estilo: simple pero mágico (à la café bonka.com)
---

> **Filosofía de diseño:** Menos ruido, más mar. Cada animación tiene un propósito.
> Inspiración: bonka.com → tipografía expresiva, espacios amplios, movimiento suave y orgánico.

---

## 🎨 SISTEMA DE TOKENS (cópialo tal cual en tu `tokens.css` o `tailwind.config`)

```css
/* ─── PALETA ─────────────────────────────────────── */
--color-ocean:      #0A3D5C;   /* azul profundo   — titulares */
--color-wave:       #1A7EA8;   /* azul medio      — acentos   */
--color-foam:       #E8F4F8;   /* casi blanco     — fondo     */
--color-sand:       #F5EDD6;   /* arena cálida    — tarjetas  */
--color-salt:       #FFFFFF;   /* blanco puro     — contraste */
--color-kelp:       #2C4A3E;   /* verde oscuro    — CTA hover */
--color-rust:       #C85A2A;   /* acento naranja  — precio    */

/* ─── TIPOGRAFÍA ────────────────────────────────── */
/* Display:  "Playfair Display" (serif, peso 700/900) */
/* Body:     "Inter"            (sans, peso 400/500)  */
/* Datos:    "DM Mono"          (mono, peso 400)      */

--font-display:  'Playfair Display', Georgia, serif;
--font-body:     'Inter', system-ui, sans-serif;
--font-data:     'DM Mono', 'Courier New', monospace;

/* ─── ESCALA TIPOGRÁFICA ────────────────────────── */
--text-hero:    clamp(3rem, 8vw, 7rem);      /* "Guarda" */
--text-display: clamp(1.8rem, 4vw, 3.5rem);  /* subtítulos */
--text-body:    clamp(1rem, 1.5vw, 1.125rem);
--text-label:   0.75rem;

/* ─── ESPACIADO ─────────────────────────────────── */
--space-xs:  0.5rem;
--space-sm:  1rem;
--space-md:  2rem;
--space-lg:  4rem;
--space-xl:  8rem;
--space-2xl: 12rem;

/* ─── MOVIMIENTO (Framer Motion tokens) ─────────── */
--ease-ocean:   cubic-bezier(0.16, 1, 0.3, 1);  /* suave como una ola */
--dur-fast:     0.3s;
--dur-med:      0.6s;
--dur-slow:     1.2s;
--dur-veryslow: 2s;
```

---

## 📐 WIREFRAME COMPLETO DE LA SECCIÓN

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   [FASE 1 · HERO DE SECCIÓN]                                     │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                                                          │   │
│   │   ░░ FONDO: foto oscurecida del amarre / rampa ░░░░░░   │   │
│   │                                                          │   │
│   │        ┌────────────────────┐                            │   │
│   │        │  eyebrow → SERVICIO│  (text-label, --wave)      │   │
│   │        └────────────────────┘                            │   │
│   │                                                          │   │
│   │   Guarda tu                                              │   │
│   │   material                ← --font-display, --hero       │   │
│   │   deportivo               ← color: --foam                │   │
│   │                                                          │   │
│   │   [línea decorativa animada ~~~~~~~~~~~~~~~~~]           │   │
│   │                                                          │   │
│   │   Sin transportes.                                       │   │
│   │   Sin esperas. Solo navegar.  ← --font-body, --foam      │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   [FASE 2 · PROPUESTA DE VALOR EN 3 COLUMNAS]                    │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                                                          │   │
│   │  ╔══════════╗   ╔══════════╗   ╔══════════╗             │   │
│   │  ║          ║   ║          ║   ║          ║             │   │
│   │  ║  🚤  ICONO║   ║  🔑 ICONO║   ║  🏄 ICONO║             │   │
│   │  ║          ║   ║          ║   ║          ║             │   │
│   │  ║ Guarda   ║   ║ Acceso   ║   ║ Incluye  ║             │   │
│   │  ║tu barco  ║   ║  libre   ║   ║   todo   ║             │   │
│   │  ║          ║   ║  24/7    ║   ║          ║             │   │
│   │  ╚══════════╝   ╚══════════╝   ╚══════════╝             │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   [FASE 3 · MATERIAL ACEPTADO (scroll horizontal)]               │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                                                          │   │
│   │  ← DESLIZA  [🌊 VELA LIGERA] [💨 WINDSURF] [🛶 PIRAGUA] →  │   │
│   │                                                          │   │
│   │  Tarjeta ampliada al hover:                              │   │
│   │  ┌──────────────────┐                                   │   │
│   │  │  ILUSTRACIÓN SVG │                                   │   │
│   │  │  nombre          │                                   │   │
│   │  │  descripción     │  ← aparece con fade al hover      │   │
│   │  └──────────────────┘                                   │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   [FASE 4 · PRECIO CON EFECTO WOW]                               │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                                                          │   │
│   │          ┌────────────────────────────────┐              │   │
│   │          │                                │              │   │
│   │          │      50€                       │              │   │
│   │          │      al mes                    │              │   │
│   │          │  ─────────────────────────     │              │   │
│   │          │  ✓ Espacio para tu material    │              │   │
│   │          │  ✓ Acceso libre 24/7           │              │   │
│   │          │  ✓ Uso de la rampa             │              │   │
│   │          │  ✓ Vestuarios y aulas          │              │   │
│   │          │                                │              │   │
│   │          │  [ Consultar disponibilidad ]  │              │   │
│   │          │                                │              │   │
│   │          └────────────────────────────────┘              │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   [FASE 5 · CLOSING — FRASE + CTA FINAL]                        │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                                                          │   │
│   │   "Llega. Prepara. Navega."                              │   │
│   │                      — letras que se escriben solas →    │   │
│   │                                                          │   │
│   │                 [ Escríbenos ]                           │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
src/
├── sections/
│   └── GuardaMaterial/
│       ├── index.jsx                ← exporta la sección completa
│       ├── GuardaMaterial.module.css
│       ├── components/
│       │   ├── HeroSection.jsx      ← FASE 1
│       │   ├── ValueProps.jsx       ← FASE 2
│       │   ├── MaterialCarousel.jsx ← FASE 3
│       │   ├── PricingCard.jsx      ← FASE 4
│       │   └── ClosingCTA.jsx       ← FASE 5
│       └── data/
│           ├── valueProps.js
│           └── materialItems.js
```

---

---

# ═══════════════════════════════════════════════════
# FASE 1 · HERO DE SECCIÓN
# ═══════════════════════════════════════════════════

## 📋 Checklist de tareas atómicas

### 🔲 TAREA 1.1 — Estructura HTML base de la sección

**Archivo:** `src/sections/GuardaMaterial/components/HeroSection.jsx`

**Instrucción para la IA:**
> Crea un componente React con la siguiente estructura exacta. NO añadas estilos todavía.

```jsx
// HeroSection.jsx — ESTRUCTURA (sin animaciones aún)
import { useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-label="Guarda tu material deportivo"
    >
      {/* Capa de imagen de fondo */}
      <div className="hero-bg" aria-hidden="true" />

      {/* Capa de overlay oscuro */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Contenido principal */}
      <div className="hero-content">

        {/* Eyebrow label */}
        <span className="hero-eyebrow">SERVICIO</span>

        {/* Título principal — 3 líneas intencionadas */}
        <h2 className="hero-title">
          <span className="hero-title__line">Guarda tu</span>
          <span className="hero-title__line">material</span>
          <span className="hero-title__line">deportivo</span>
        </h2>

        {/* Línea decorativa animada */}
        <div className="hero-divider" aria-hidden="true">
          <span className="hero-divider__line" />
        </div>

        {/* Subtítulo */}
        <p className="hero-subtitle">
          Sin transportes. Sin esperas.<br/>
          Solo llegar y navegar.
        </p>

      </div>
    </section>
  );
}
```

---

### 🔲 TAREA 1.2 — CSS base (sin animaciones)

**Archivo:** `src/sections/GuardaMaterial/GuardaMaterial.module.css`

```css
/* ── HERO SECTION ─────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: flex-end;           /* contenido anclado al fondo */
  padding: var(--space-xl) var(--space-lg);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/images/rampa-getxo.jpg');
  background-size: cover;
  background-position: center 30%;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 61, 92, 0.92) 0%,
    rgba(10, 61, 92, 0.4) 50%,
    transparent 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 680px;
}

.hero-eyebrow {
  display: inline-block;
  font-family: var(--font-data);
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  color: var(--color-wave);
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 900;
  line-height: 0.92;
  color: var(--color-foam);
  margin: 0 0 var(--space-md) 0;
}

.hero-title__line {
  display: block;
}

/* La segunda línea tiene un poco de indent */
.hero-title__line:nth-child(2) {
  padding-left: 0.08em;
}

.hero-divider {
  width: 100%;
  max-width: 320px;
  height: 2px;
  background: rgba(232, 244, 248, 0.15);
  margin-bottom: var(--space-md);
  overflow: hidden;
}

.hero-divider__line {
  display: block;
  height: 100%;
  width: 0%;                       /* Framer lo animará a 100% */
  background: var(--color-wave);
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 400;
  color: rgba(232, 244, 248, 0.82);
  line-height: 1.65;
  max-width: 400px;
}
```

---

### 🔲 TAREA 1.3 — Animaciones Framer Motion del hero

**Instala:** `npm install framer-motion`

**Archivo:** `HeroSection.jsx` — añadir al componente existente

```jsx
// HeroSection.jsx — VERSIÓN FINAL CON FRAMER MOTION
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence
} from "framer-motion";

// ── VARIANTES DE ANIMACIÓN ──────────────────────────────────
const VARIANTS = {

  // Eyebrow: aparece desde abajo con fade
  eyebrow: {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  },

  // Cada línea del título: entra desde abajo con stagger
  titleContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  },
  titleLine: {
    hidden:  { opacity: 0, y: "100%", skewY: 4 },
    visible: {
      opacity: 1, y: "0%", skewY: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  },

  // Línea divisoria: se expande de 0 a 100%
  divider: {
    hidden:  { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  },

  // Subtítulo: simple fade-up
  subtitle: {
    hidden:  { opacity: 0, y: 16 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }
    }
  }
};

export default function HeroSection() {
  const sectionRef  = useRef(null);
  const isInView    = useInView(sectionRef, { once: true, margin: "-80px" });

  // ── PARALLAX EN EL BG ─────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-label="Guarda tu material deportivo"
    >

      {/* BG con parallax suave */}
      <motion.div
        className="hero-bg"
        style={{ y: bgY }}
        aria-hidden="true"
      />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">

        {/* Eyebrow */}
        <motion.span
          className="hero-eyebrow"
          variants={VARIANTS.eyebrow}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          SERVICIO
        </motion.span>

        {/* Título con stagger por línea */}
        <motion.h2
          className="hero-title"
          variants={VARIANTS.titleContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {["Guarda tu", "material", "deportivo"].map((line, i) => (
            {/* Wrapper con overflow:hidden para el clip reveal */}
            <span key={i} style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                className="hero-title__line"
                variants={VARIANTS.titleLine}
                style={{ display: "block" }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Línea decorativa */}
        <motion.div
          className="hero-divider"
          aria-hidden="true"
          variants={VARIANTS.divider}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />

        {/* Subtítulo */}
        <motion.p
          className="hero-subtitle"
          variants={VARIANTS.subtitle}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Sin transportes. Sin esperas.<br/>
          Solo llegar y navegar.
        </motion.p>

      </div>
    </section>
  );
}
```

> 💡 **Efecto visual resultante:**
> ```
> [0.0s] Sección entra en viewport
> [0.0s] Eyebrow sube desde abajo + fade
> [0.2s] "Guarda tu" sube desde detrás del borde — clip reveal
> [0.3s] "material" — mismo efecto, escalonado
> [0.4s] "deportivo" — mismo efecto
> [0.7s] Línea azul se extiende de izquierda a derecha
> [0.9s] Subtítulo hace fade in desde abajo
>        Parallax suave continúa mientras el usuario scrollea
> ```

---

---

# ═══════════════════════════════════════════════════
# FASE 2 · TRES PROPUESTAS DE VALOR
# ═══════════════════════════════════════════════════

## 📋 Checklist de tareas atómicas

### 🔲 TAREA 2.1 — Datos (no toques más que este archivo para cambiar el texto)

**Archivo:** `src/sections/GuardaMaterial/data/valueProps.js`

```js
// valueProps.js
export const VALUE_PROPS = [
  {
    id: "storage",
    emoji: "⚓",                        // en móvil basta con el emoji
    svgIcon: "icon-anchor",             // nombre del SVG en /public/icons/
    headline: "Guarda tu embarcación",
    body: "Vela ligera, windsurf o piragua. Siempre en su sitio, siempre lista.",
    delay: 0.0,
  },
  {
    id: "access",
    emoji: "🔑",
    svgIcon: "icon-key",
    headline: "Acceso libre · 24/7",
    body: "Cualquier día, a cualquier hora. Sin pedir permiso cada vez.",
    delay: 0.15,
  },
  {
    id: "facilities",
    emoji: "🏄‍♀️",
    svgIcon: "icon-wave",
    headline: "Todo incluido",
    body: "Rampa, vestuarios y aulas. El precio no esconde sorpresas.",
    delay: 0.30,
  },
];
```

---

### 🔲 TAREA 2.2 — Componente ValueProps

**Archivo:** `src/sections/GuardaMaterial/components/ValueProps.jsx`

```jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { VALUE_PROPS } from "../data/valueProps";

// ── VARIANTES ──────────────────────────────────────────────
const cardVariants = (delay) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
  }
});

const iconVariants = {
  rest:  { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: -6,
    transition: { type: "spring", stiffness: 300, damping: 18 }
  }
};

export default function ValueProps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="value-props">

      {/* Label de sección */}
      <motion.p
        className="section-eyebrow"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        ¿QUÉ INCLUYE?
      </motion.p>

      {/* Grid de 3 tarjetas */}
      <div className="value-props__grid">
        {VALUE_PROPS.map((prop) => (
          <motion.article
            key={prop.id}
            className="value-card"
            variants={cardVariants(prop.delay)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"           // activa el hover en toda la tarjeta
          >

            {/* Icono con efecto wobble al hover */}
            <motion.div
              className="value-card__icon"
              variants={iconVariants}
            >
              <span role="img" aria-hidden="true">{prop.emoji}</span>
            </motion.div>

            <h3 className="value-card__headline">{prop.headline}</h3>
            <p  className="value-card__body">{prop.body}</p>

            {/* Línea de acento que crece al hover */}
            <motion.div
              className="value-card__accent"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

          </motion.article>
        ))}
      </div>

    </section>
  );
}
```

---

### 🔲 TAREA 2.3 — CSS de las tarjetas

```css
/* ── VALUE PROPS ──────────────────────────────────────────── */
.value-props {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-foam);
  text-align: center;
}

.section-eyebrow {
  font-family: var(--font-data);
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  color: var(--color-wave);
  text-transform: uppercase;
  margin-bottom: var(--space-lg);
}

.value-props__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
  max-width: 960px;
  margin: 0 auto;
}

.value-card {
  position: relative;
  background: var(--color-salt);
  border-radius: 16px;
  padding: var(--space-lg) var(--space-md);
  cursor: default;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(10, 61, 92, 0.06);
  transition: box-shadow 0.3s ease;
}

.value-card:hover {
  box-shadow: 0 8px 40px rgba(10, 61, 92, 0.12);
}

.value-card__icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
  display: inline-block;
}

.value-card__headline {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-ocean);
  margin-bottom: var(--space-xs);
}

.value-card__body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: rgba(10, 61, 92, 0.6);
  line-height: 1.6;
  margin: 0;
}

/* Barra de acento — se expande de izq. a derecha al hover */
.value-card__accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-wave);
  transform-origin: left center;
}
```

---

---

# ═══════════════════════════════════════════════════
# FASE 3 · CARRUSEL DE MATERIAL
# ═══════════════════════════════════════════════════

## 📋 Checklist de tareas atómicas

### 🔲 TAREA 3.1 — Datos de material

**Archivo:** `src/sections/GuardaMaterial/data/materialItems.js`

```js
// materialItems.js
export const MATERIAL_ITEMS = [
  {
    id: "vela-ligera",
    title: "Vela Ligera",
    description: "Optimist, Laser, Pico... Tu barco guarda aquí su sueño hasta la próxima salida.",
    emoji: "⛵",
    bgColor: "#E8F4F8",   // foam claro
    accentColor: "#1A7EA8",
  },
  {
    id: "windsurf",
    title: "Windsurf",
    description: "Tablas y mástiles almacenados con cuidado. Llega y monta en minutos.",
    emoji: "💨",
    bgColor: "#F5EDD6",   // arena
    accentColor: "#C85A2A",
  },
  {
    id: "piragua",
    title: "Piragua / Kayak",
    description: "Desde el kayak de travesía al surf-ski. El Abra te espera, sin excusas.",
    emoji: "🛶",
    bgColor: "#E8F4F8",
    accentColor: "#2C4A3E",
  },
];
```

---

### 🔲 TAREA 3.2 — Componente MaterialCarousel

**Archivo:** `src/sections/GuardaMaterial/components/MaterialCarousel.jsx`

```jsx
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MATERIAL_ITEMS } from "../data/materialItems";

export default function MaterialCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="material-carousel">

      {/* Eyebrow */}
      <motion.p
        className="section-eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        MATERIAL ACEPTADO
      </motion.p>

      {/* Título */}
      <motion.h2
        className="carousel__title"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Tu embarcación,<br />en buenas manos.
      </motion.h2>

      {/* Tabs de navegación */}
      <motion.div
        className="carousel__tabs"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {MATERIAL_ITEMS.map((item, i) => (
          <button
            key={item.id}
            className={`carousel__tab ${i === activeIdx ? "is-active" : ""}`}
            onClick={() => setActiveIdx(i)}
          >
            <span aria-hidden="true">{item.emoji}</span>
            {item.title}

            {/* Indicador activo con layoutId para animación fluida */}
            {i === activeIdx && (
              <motion.span
                className="carousel__tab-indicator"
                layoutId="tab-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Panel de contenido con AnimatePresence */}
      <div className="carousel__panel-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="carousel__panel"
            style={{ backgroundColor: MATERIAL_ITEMS[activeIdx].bgColor }}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{   opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Emoji grande animado */}
            <motion.div
              className="carousel__emoji"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            >
              {MATERIAL_ITEMS[activeIdx].emoji}
            </motion.div>

            {/* Texto */}
            <motion.h3
              className="carousel__panel-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              style={{ color: MATERIAL_ITEMS[activeIdx].accentColor }}
            >
              {MATERIAL_ITEMS[activeIdx].title}
            </motion.h3>

            <motion.p
              className="carousel__panel-body"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
            >
              {MATERIAL_ITEMS[activeIdx].description}
            </motion.p>

          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
```

---

### 🔲 TAREA 3.3 — CSS del carrusel

```css
/* ── CAROUSEL ─────────────────────────────────────────────── */
.material-carousel {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-salt);
  text-align: center;
}

.carousel__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 700;
  color: var(--color-ocean);
  line-height: 1.1;
  margin-bottom: var(--space-lg);
}

.carousel__tabs {
  display: flex;
  justify-content: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}

.carousel__tab {
  position: relative;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(10, 61, 92, 0.55);
  background: transparent;
  border: 1.5px solid rgba(10, 61, 92, 0.15);
  border-radius: 100px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  overflow: hidden;
}

.carousel__tab.is-active {
  color: var(--color-ocean);
  border-color: var(--color-wave);
}

.carousel__tab-indicator {
  position: absolute;
  inset: 0;
  background: rgba(26, 126, 168, 0.1);
  border-radius: 100px;
  z-index: -1;
}

.carousel__panel-wrapper {
  max-width: 540px;
  margin: 0 auto;
}

.carousel__panel {
  border-radius: 24px;
  padding: var(--space-lg);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.carousel__emoji {
  font-size: 5rem;
  line-height: 1;
}

.carousel__panel-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.carousel__panel-body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: rgba(10, 61, 92, 0.7);
  line-height: 1.65;
  max-width: 380px;
  margin: 0;
}
```

---

---

# ═══════════════════════════════════════════════════
# FASE 4 · TARJETA DE PRECIO
# ═══════════════════════════════════════════════════

## 📋 Checklist de tareas atómicas

### 🔲 TAREA 4.1 — Componente PricingCard

**El "efecto WOW":** El número 50 hace un counter animado de 0→50 al entrar en viewport.
Cada ítem de la lista aparece con stagger escalonado.

**Archivo:** `src/sections/GuardaMaterial/components/PricingCard.jsx`

```jsx
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

// ── Items del precio ─────────────────────────────────────────
const PRICE_ITEMS = [
  { icon: "📦", text: "Espacio para tu material" },
  { icon: "🔑", text: "Acceso libre 24/7" },
  { icon: "🚣", text: "Uso de la rampa" },
  { icon: "🚿", text: "Vestuarios y aulas" },
];

// ── Hook: counter animado ─────────────────────────────────────
function useCounter(to, duration = 1.5, shouldStart = false) {
  const count    = useMotionValue(0);
  const rounded  = useTransform(count, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsubscribe(); };
  }, [shouldStart]);

  return display;
}

// ── Componente principal ──────────────────────────────────────
export default function PricingCard() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const price    = useCounter(50, 1.4, isInView);

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } }
  };
  const itemVariants = {
    hidden:  { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="pricing-section">

      <motion.p
        className="section-eyebrow"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        TARIFA
      </motion.p>

      <motion.div
        ref={ref}
        className="pricing-card"
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.97 }
        }
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Precio — counter animado */}
        <div className="pricing-card__price">
          <span className="pricing-card__amount">{price}</span>
          <div className="pricing-card__unit">
            <span className="pricing-card__currency">€</span>
            <span className="pricing-card__period">/ mes</span>
          </div>
        </div>

        {/* Divisor */}
        <motion.hr
          className="pricing-card__divider"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Lista de ítems */}
        <motion.ul
          className="pricing-card__list"
          variants={listVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PRICE_ITEMS.map((item, i) => (
            <motion.li key={i} className="pricing-card__item" variants={itemVariants}>
              <span className="pricing-card__item-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.text}
            </motion.li>
          ))}
        </motion.ul>

        {/* CTA */}
        <motion.a
          href="#contacto"
          className="pricing-card__cta"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{  scale: 0.97 }}
        >
          Consultar disponibilidad
        </motion.a>

        {/* Nota discreta */}
        <motion.p
          className="pricing-card__note"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          Sin permanencia mínima · Consúltanos sin compromiso
        </motion.p>

      </motion.div>
    </section>
  );
}
```

---

### 🔲 TAREA 4.2 — CSS de la tarjeta de precio

```css
/* ── PRICING CARD ─────────────────────────────────────────── */
.pricing-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-sand);
  text-align: center;
}

.pricing-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-salt);
  border-radius: 28px;
  padding: var(--space-lg) var(--space-xl);
  box-shadow:
    0 4px 24px rgba(10, 61, 92, 0.08),
    0 1px 4px  rgba(10, 61, 92, 0.04);
  width: 100%;
  max-width: 420px;
}

.pricing-card__price {
  display: flex;
  align-items: flex-end;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.pricing-card__amount {
  font-family: var(--font-display);
  font-size: clamp(5rem, 14vw, 8rem);
  font-weight: 900;
  line-height: 1;
  color: var(--color-rust);
}

.pricing-card__unit {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.4rem;
  line-height: 1.2;
}

.pricing-card__currency {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-rust);
}

.pricing-card__period {
  font-family: var(--font-data);
  font-size: 0.85rem;
  color: rgba(10, 61, 92, 0.5);
  letter-spacing: 0.05em;
}

.pricing-card__divider {
  width: 100%;
  border: none;
  border-top: 1.5px solid rgba(10, 61, 92, 0.1);
  margin: 0 0 var(--space-md);
  transform-origin: left center;
}

.pricing-card__list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-lg);
  text-align: left;
  width: 100%;
}

.pricing-card__item {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: rgba(10, 61, 92, 0.78);
  padding: 0.45rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pricing-card__item-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.pricing-card__cta {
  display: inline-block;
  background: var(--color-ocean);
  color: var(--color-foam);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  margin-bottom: var(--space-sm);
  transition: background 0.2s ease;
}

.pricing-card__cta:hover {
  background: var(--color-kelp);
}

.pricing-card__note {
  font-family: var(--font-data);
  font-size: 0.75rem;
  color: rgba(10, 61, 92, 0.42);
  letter-spacing: 0.04em;
  margin: 0;
}
```

---

---

# ═══════════════════════════════════════════════════
# FASE 5 · CIERRE CINEMATOGRÁFICO
# ═══════════════════════════════════════════════════

## 📋 Checklist de tareas atómicas

### 🔲 TAREA 5.1 — Componente ClosingCTA

**El efecto:** Las tres palabras "Llega. Prepara. Navega." se escriben sola, una por una,
con un cursor parpadeante. Al terminar, el botón de contacto aparece flotando hacia arriba.

**Archivo:** `src/sections/GuardaMaterial/components/ClosingCTA.jsx`

```jsx
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Efecto typewriter ──────────────────────────────────────────
const FULL_TEXT  = "Llega. Prepara. Navega.";
const CHAR_DELAY = 55;   // ms entre caracteres

function useTypewriter(text, active) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, CHAR_DELAY);
    return () => clearInterval(id);
  }, [active]);

  return { displayed, done };
}

// ── Componente ──────────────────────────────────────────────────
export default function ClosingCTA() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { displayed, done } = useTypewriter(FULL_TEXT, isInView);

  return (
    <section ref={ref} className="closing-cta">

      {/* Ola decorativa SVG en el fondo */}
      <svg className="closing-wave" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
              fill="currentColor" />
      </svg>

      {/* Frase con efecto typewriter */}
      <div className="closing-cta__text-wrapper">
        <p className="closing-cta__phrase" aria-live="polite">
          {displayed}
          {/* Cursor parpadeante */}
          {!done && (
            <motion.span
              className="closing-cta__cursor"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              aria-hidden="true"
            >
              |
            </motion.span>
          )}
        </p>
      </div>

      {/* Botón — entra cuando acaba el typewriter */}
      {done && (
        <motion.a
          href="#contacto"
          className="closing-cta__btn"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.97 }}
        >
          Escríbenos →
        </motion.a>
      )}

    </section>
  );
}
```

---

### 🔲 TAREA 5.2 — CSS del cierre

```css
/* ── CLOSING CTA ──────────────────────────────────────────── */
.closing-cta {
  position: relative;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-ocean);
  text-align: center;
  overflow: hidden;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
}

.closing-wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  color: var(--color-salt);   /* hereda el color del bg anterior */
  opacity: 0.08;
}

.closing-cta__phrase {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 700;
  color: var(--color-foam);
  line-height: 1.1;
  min-height: 1.2em;             /* evita salto al aparecer */
  margin: 0;
}

.closing-cta__cursor {
  display: inline-block;
  color: var(--color-wave);
  font-weight: 300;
  margin-left: 2px;
}

.closing-cta__btn {
  display: inline-block;
  background: transparent;
  color: var(--color-foam);
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2.2rem;
  border: 2px solid rgba(232, 244, 248, 0.5);
  border-radius: 100px;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.closing-cta__btn:hover {
  border-color: var(--color-foam);
  background: rgba(232, 244, 248, 0.08);
}
```

---

---

# ═══════════════════════════════════════════════════
# FASE 6 · ENSAMBLAJE FINAL
# ═══════════════════════════════════════════════════

### 🔲 TAREA 6.1 — Index del módulo

**Archivo:** `src/sections/GuardaMaterial/index.jsx`

```jsx
import HeroSection      from "./components/HeroSection";
import ValueProps       from "./components/ValueProps";
import MaterialCarousel from "./components/MaterialCarousel";
import PricingCard      from "./components/PricingCard";
import ClosingCTA       from "./components/ClosingCTA";
import "./GuardaMaterial.module.css";

export default function GuardaMaterial() {
  return (
    <div id="guarda-material" aria-label="Guarda tu material deportivo">
      <HeroSection />
      <ValueProps />
      <MaterialCarousel />
      <PricingCard />
      <ClosingCTA />
    </div>
  );
}
```

---

### 🔲 TAREA 6.2 — Uso en la página principal

```jsx
// En tu App.jsx o page.jsx, añade:
import GuardaMaterial from "@/sections/GuardaMaterial";

// Y dentro del JSX:
<GuardaMaterial />
```

---

### 🔲 TAREA 6.3 — Fuentes (añadir al `<head>` o `_document.jsx`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />
```

---

### 🔲 TAREA 6.4 — Responsive (media queries a añadir al CSS global)

```css
/* Tablets y móviles */
@media (max-width: 768px) {
  .hero-section       { padding: var(--space-lg) var(--space-md); }
  .value-props        { padding: var(--space-lg) var(--space-md); }
  .material-carousel  { padding: var(--space-lg) var(--space-md); }
  .pricing-section    { padding: var(--space-lg) var(--space-md); }
  .closing-cta        { padding: var(--space-lg) var(--space-md); }
  .pricing-card       { padding: var(--space-lg) var(--space-md); }
}

/* Respeta prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

---

# ═══════════════════════════════════════════════════
# RESUMEN VISUAL DE ANIMACIONES
# ═══════════════════════════════════════════════════

```
FASE 1 · HERO
  ├── BG image       →  parallax vertical suave (scroll)
  ├── Eyebrow        →  fade + slide-up (0.0s)
  ├── "Guarda tu"    →  clip reveal desde detrás del borde (0.2s)
  ├── "material"     →  clip reveal (0.3s)
  ├── "deportivo"    →  clip reveal (0.4s)
  ├── Línea azul     →  scaleX de 0→100% desde la izquierda (0.7s)
  └── Subtítulo      →  fade + slide-up (0.9s)

FASE 2 · VALUE PROPS
  ├── Cards 1,2,3    →  stagger fade+slide-up (0.0s / 0.15s / 0.30s)
  └── Icono hover    →  spring wobble en el icono + barra acento

FASE 3 · CARRUSEL
  ├── Tab activo     →  layoutId spring fluido (entre tabs)
  ├── Panel salida   →  opacity+x fade + slight scale
  └── Panel entrada  →  opacity+x fade + slight scale + emoji spring

FASE 4 · PRECIO
  ├── Card           →  fade+slide-up+scale (0.0s)
  ├── Número         →  counter 0→50 animado (1.4s ease)
  ├── Divisor        →  scaleX de 0→100% (0.5s delay)
  ├── Items lista    →  stagger slide-right (0.6s delay start)
  ├── CTA            →  fade+slide-up (1.1s delay)
  └── CTA hover      →  scale 1.03

FASE 5 · CLOSING
  ├── Frase          →  typewriter carácter a carácter (55ms/char)
  ├── Cursor         →  pulso opacity loop
  └── Botón          →  aparece cuando typewriter termina (fade+slide-up)
      Botón hover    →  flota -3px
```

---

## 📦 DEPENDENCIAS NECESARIAS

```bash
npm install framer-motion
# framer-motion ≥ 11.x ya incluye: motion, useInView, useScroll,
# useTransform, AnimatePresence, useMotionValue, animate
```

---

## ✅ ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
[ ] 1. Instalar framer-motion
[ ] 2. Crear estructura de carpetas
[ ] 3. Copiar tokens.css
[ ] 4. Añadir fuentes al <head>
[ ] 5. FASE 1: HeroSection.jsx + CSS
[ ] 6. FASE 2: valueProps.js + ValueProps.jsx + CSS
[ ] 7. FASE 3: materialItems.js + MaterialCarousel.jsx + CSS
[ ] 8. FASE 4: PricingCard.jsx + CSS
[ ] 9. FASE 5: ClosingCTA.jsx + CSS
[ ] 10. FASE 6: index.jsx + integrarlo en la página
[ ] 11. Añadir media queries responsive
[ ] 12. Probar prefers-reduced-motion
[ ] 13. Reemplazar emoji placeholder por SVGs propios (opcional)
[ ] 14. Añadir foto real de la rampa/amarre como hero-bg
```

---

*Plan generado para getxobelaeskola.cloud · Junio 2026*
