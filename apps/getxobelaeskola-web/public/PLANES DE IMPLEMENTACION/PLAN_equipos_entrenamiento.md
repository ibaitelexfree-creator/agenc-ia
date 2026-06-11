# ⛵ PLAN DE IMPLEMENTACIÓN — Sección "Equipos de Entrenamiento y Regatas"
### getxobelaeskola.cloud · Nivel de magia: ████████████ MÁXIMO
---

> **Firma visual de esta sección:**
> Un **sistema de partículas de viento** en Canvas que vive en el fondo de toda la sección —
> cada partícula es una "racha" que sigue levemente al ratón — y tres **tarjetas de equipo**
> que se abren como escotillas de barco con un giro 3D en perspectiva.
> Nada de esto aparece en ninguna web de escuelas náuticas. Ese es el punto.

---

## 🎨 SISTEMA DE TOKENS — Paleta nocturna de regata

> **Por qué no usamos azul claro esta vez:** Esta sección habla de competición, de
> madrugadas en el Abra, de concentración y esfuerzo. La paleta oscura con amarillo boya
> lo comunica sin palabras.

```css
/* ─── PALETA NOCTURNA ───────────────────────────────────── */
--color-deep:      #060E18;   /* agua profunda de noche   — fondo base   */
--color-hull:      #0D1F2D;   /* azul casco               — tarjetas     */
--color-keel:      #162840;   /* azul oscuro medio        — hover states */
--color-buoy:      #E8C547;   /* amarillo boya             — acento hero  */
--color-bio:       #2BE0C0;   /* teal bioluminiscente      — CTA / líneas */
--color-sail:      #F0F4F8;   /* blanco vela               — textos       */
--color-fog:       rgba(240, 244, 248, 0.45);  /* texto secundario */
--color-horizon:   rgba(232, 197, 71, 0.12);   /* glow amarillo sutil */

/* ─── TIPOGRAFÍA — más dramática que la sección anterior ── */
/* Display:  "Cormorant Garamond" (serif dramático, 600/700/800) */
/* Body:     "Inter"               (sans, 400/500)               */
/* Race:     "DM Mono"             (datos, tiempos, números)      */

--font-display: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
--font-body:    'Inter', system-ui, sans-serif;
--font-race:    'DM Mono', 'Courier New', monospace;

/* ─── ESCALA TIPOGRÁFICA ──────────────────────────────────── */
--text-titan:   clamp(4rem, 12vw, 10rem);    /* "REGATAS" — solo hero */
--text-hero:    clamp(3rem, 7vw, 6.5rem);
--text-display: clamp(1.6rem, 3.5vw, 3rem);
--text-body:    clamp(0.95rem, 1.4vw, 1.1rem);
--text-label:   0.72rem;
--text-race:    1.8rem;                      /* números grandes de datos */

/* ─── MOVIMIENTO ──────────────────────────────────────────── */
--ease-water:   cubic-bezier(0.22, 1, 0.36, 1);
--ease-snap:    cubic-bezier(0.34, 1.56, 0.64, 1);   /* con rebote */
--dur-flash:    0.2s;
--dur-fast:     0.4s;
--dur-med:      0.7s;
--dur-slow:     1.1s;
--dur-ambient:  3.0s;

/* ─── SOMBRAS ─────────────────────────────────────────────── */
--glow-buoy:  0 0 32px rgba(232, 197, 71, 0.35), 0 0 8px rgba(232, 197, 71, 0.2);
--glow-bio:   0 0 24px rgba(43, 224, 192, 0.3),  0 0 6px rgba(43, 224, 192, 0.15);
--shadow-card: 0 8px 48px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
```

---

## 🗺️ ARQUITECTURA VISUAL COMPLETA

```
╔═══════════════════════════════════════════════════════════════════╗
║  SECCIÓN "EQUIPOS"  —  mapa de bloques de arriba a abajo          ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  [BLOQUE A]  HERO CINEMATOGRÁFICO                                 ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │ ░░░░ CANVAS: partículas de viento (toda la sección) ░░░░░░ │  ║
║  │                                                             │  ║
║  │   REGATAS         ← --titan, --buoy, enorme                │  ║
║  │   ──────────      ← línea --bio que se dibuja              │  ║
║  │   Entrenamientos  ← --display, --sail                      │  ║
║  │   y equipos       ← idem                                   │  ║
║  │                                                             │  ║
║  │   [Texto intro — 2 líneas máximo]                          │  ║
║  │                                                             │  ║
║  │        ↓  scroll indicator animado  ↓                      │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║  [BLOQUE B]  FILOSOFÍA — MARQUEE INFINITO                         ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │  ❯ crecer navegando  •  ❯ compartir  •  ❯ disfrutar  •     │  ║
║  │    ← texto que fluye de derecha a izquierda sin parar →    │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║  [BLOQUE C]  TRES EQUIPOS — TARJETAS ESCOTILLA 3D                 ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │                                                             │  ║
║  │  CERRADAS (estado inicial):                                 │  ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │  ║
║  │  │ INFANTIL │  │ JÓVENES  │  │ ADULTAS  │                 │  ║
║  │  │ +5 años  │  │ +14 años │  │ Tecnif.  │                 │  ║
║  │  │    ↓     │  │    ↓     │  │    ↓     │                 │  ║
║  │  │  [abrir] │  │  [abrir] │  │  [abrir] │                 │  ║
║  │  └──────────┘  └──────────┘  └──────────┘                 │  ║
║  │                                                             │  ║
║  │  ABIERTA (una a la vez, flip 3D):                          │  ║
║  │  ┌───────────────────────────────────────────────────────┐ │  ║
║  │  │  [CARA TRASERA — contenido expandido]                 │ │  ║
║  │  │                                                       │ │  ║
║  │  │   Calendario visual ·  Descripción · Enfoque          │ │  ║
║  │  │                                                       │ │  ║
║  │  └───────────────────────────────────────────────────────┘ │  ║
║  │                                                             │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║  [BLOQUE D]  CALENDARIO — VISUALIZADOR DE DOMINGOS               ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │                                                             │  ║
║  │   Mes  [ ← ] Junio 2025 [ → ]   (navegación de mes)        │  ║
║  │                                                             │  ║
║  │   L  M  X  J  V  S  D                                      │  ║
║  │                  1  ●  ← domingo activo = punto amarillo    │  ║
║  │   3  4  5  6  7  8  ●                                      │  ║
║  │  10 11 12 13 14 15  ●                                      │  ║
║  │  17 18 19 20 21 22  ○  ← 4º domingo = descanso             │  ║
║  │  24 25 26 27 28 29  ○                                      │  ║
║  │                                                             │  ║
║  │  ● Entrenamiento  ○ Libre                                  │  ║
║  │                                                             │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║  [BLOQUE E]  REQUISITOS — TABLA DE ABORDO ESTILO LOGBOOK         ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │                                                             │  ║
║  │  ┌─────────────────────────────────────────────────────┐   │  ║
║  │  │  CUADERNO DE BITÁCORA                               │   │  ║
║  │  │  ══════════════════════════════════════════════     │   │  ║
║  │  │                                                     │   │  ║
║  │  │  [01]  Ganas de aprender y compartir  ✓             │   │  ║
║  │  │  [02]  Nivel previo según categoría   ✓             │   │  ║
║  │  │  [03]  Licencia Federativa  (~64€/año) ✓            │   │  ║
║  │  │  [04]  Ser Socia del Club              ✓            │   │  ║
║  │  │                                                     │   │  ║
║  │  └─────────────────────────────────────────────────────┘   │  ║
║  │                                                             │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║  [BLOQUE F]  CTA FINAL — SPLIT SCREEN CON ONDAS SVG              ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │              │                                              │  ║
║  │  Texto       │  Formulario / botón contacto                 │  ║
║  │  dramático   │                                              │  ║
║  │              │                                              │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS — Cópiala exacta

```
src/
├── sections/
│   └── EquiposEntrenamiento/
│       ├── index.jsx                      ← exporta la sección entera
│       ├── EquiposEntrenamiento.module.css
│       │
│       ├── components/
│       │   ├── WindCanvas.jsx             ← [BLOQUE A] sistema partículas
│       │   ├── HeroEquipos.jsx            ← [BLOQUE A] hero texto
│       │   ├── FilosofiaMarquee.jsx       ← [BLOQUE B] marquee infinito
│       │   ├── TeamCards.jsx              ← [BLOQUE C] tarjetas escotilla
│       │   ├── TeamCard.jsx              ─┘
│       │   ├── CalendarView.jsx           ← [BLOQUE D] calendario
│       │   ├── LogbookRequirements.jsx    ← [BLOQUE E] logbook
│       │   └── CTAFinal.jsx              ← [BLOQUE F] CTA split
│       │
│       └── data/
│           ├── teams.js                   ← datos de los 3 equipos
│           ├── calendar.js                ← lógica de domingos
│           └── requirements.js            ← 4 requisitos
```

---

---

# ══════════════════════════════════════════════════════
# BLOQUE A · HERO CINEMATOGRÁFICO + PARTÍCULAS DE VIENTO
# ══════════════════════════════════════════════════════

## 📋 Tareas atómicas

---

### ☐ TAREA A.1 — WindCanvas: sistema de partículas de viento

> **Qué hace:** Un `<canvas>` que cubre toda la sección.
> 80 partículas que viajan en diagonal (imitando viento).
> Reaccionan suavemente al movimiento del ratón.
> Se ejecuta en `requestAnimationFrame`. Nada de librerías externas.

**Archivo:** `src/sections/EquiposEntrenamiento/components/WindCanvas.jsx`

```jsx
// WindCanvas.jsx — Sistema de partículas de viento
import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 80;
const BASE_SPEED     = 1.2;   // px por frame
const MOUSE_STRENGTH = 0.04;  // cuánto el ratón afecta la dirección

function createParticle(W, H) {
  return {
    x:       Math.random() * W,
    y:       Math.random() * H,
    vx:      BASE_SPEED + Math.random() * 0.8,
    vy:     -0.15 + Math.random() * 0.3,
    length:  20 + Math.random() * 60,   // longitud de la línea
    opacity: 0.03 + Math.random() * 0.1,
    speed:   0.8 + Math.random() * 0.8,
  };
}

export default function WindCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext("2d");
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    // Crear partículas
    const particles = Array.from({ length: PARTICLE_COUNT },
      () => createParticle(W, H)
    );

    // Resize handler
    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    // Mouse handler
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", onMouse);

    // Loop principal
    function draw() {
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        // Influencia del ratón sobre la velocidad Y
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vy += (dy / dist) * MOUSE_STRENGTH;
          p.vy  = Math.max(-0.6, Math.min(0.6, p.vy)); // clamp
        }

        // Dibuja la línea
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length, p.y - p.length * 0.15);
        ctx.strokeStyle = `rgba(232, 197, 71, ${p.opacity})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // Mueve la partícula
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // Wrap — si sale por la derecha, vuelve por la izquierda
        if (p.x > W + p.length) { p.x = -p.length; p.y = Math.random() * H; }
        if (p.y < -10)   { p.y = H + 10; }
        if (p.y > H + 10){ p.y = -10; }
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="wind-canvas"
      aria-hidden="true"
    />
  );
}
```

**CSS para el canvas:**
```css
.wind-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;   /* no bloquea clicks */
  z-index: 1;
}
```

---

### ☐ TAREA A.2 — HeroEquipos: texto del hero

**Archivo:** `src/sections/EquiposEntrenamiento/components/HeroEquipos.jsx`

> **El efecto diferenciador:**
> La palabra `REGATAS` se parte en letras individuales.
> Cada letra cae desde arriba con un stagger mínimo (0.04s) y un pequeño rebote spring.
> Resultado: parece que la palabra aterriza como un barco que toca el agua.

```jsx
// HeroEquipos.jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ── Variante letra por letra ──────────────────────────────────
const letterVariants = {
  hidden:  { opacity: 0, y: -80, rotateX: -45 },
  visible: (i) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: {
      delay: i * 0.04,
      type: "spring",
      stiffness: 180,
      damping: 16,
    }
  })
};

// ── Variante para el subtítulo ────────────────────────────────
const subVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

// ── Variante para el scroll indicator ────────────────────────
const scrollDot = {
  animate: {
    y: [0, 10, 0],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
  }
};

const TITLE_WORD = "REGATAS";

export default function HeroEquipos() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="hero-equipos">

      {/* Eyebrow */}
      <motion.span
        className="hero-eq__eyebrow"
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={isInView
          ? { opacity: 1, letterSpacing: "0.25em" }
          : {}
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        GETXO BELA ESKOLA
      </motion.span>

      {/* Título — letras individuales con perspectiva 3D */}
      <div className="hero-eq__title-wrapper" style={{ perspective: "600px" }}>
        <h2 className="hero-eq__title">
          {TITLE_WORD.split("").map((char, i) => (
            <motion.span
              key={i}
              className="hero-eq__letter"
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
          {/* Para screen readers */}
          <span className="sr-only">{TITLE_WORD}</span>
        </h2>
      </div>

      {/* Línea bio que se dibuja — SVG */}
      <motion.svg
        className="hero-eq__line"
        viewBox="0 0 320 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          d="M0 4 Q80 0 160 4 Q240 8 320 4"
          stroke="#2BE0C0"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView
            ? { pathLength: 1, opacity: 1 }
            : {}
          }
          transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>

      {/* Subtítulo */}
      <motion.div
        className="hero-eq__subtitle-block"
        variants={subVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <p className="hero-eq__subtitle-line">
          Entrenamientos y equipos
        </p>
        <p className="hero-eq__subtitle-body">
          No buscamos campeonas a cualquier precio.<br/>
          Buscamos crecer navegando, compartir y disfrutar del camino juntas.
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-eq__scroll"
        aria-hidden="true"
        variants={scrollDot}
        animate="animate"
      >
        <span className="hero-eq__scroll-line" />
        <span className="hero-eq__scroll-dot" />
      </motion.div>

    </div>
  );
}
```

**CSS del hero:**
```css
/* ── HERO EQUIPOS ───────────────────────────────────────────── */
.hero-equipos {
  position: relative;
  z-index: 2;             /* sobre el canvas */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 85vh;
  padding: var(--space-xl) var(--space-lg);
  max-width: 880px;
}

.hero-eq__eyebrow {
  display: inline-block;
  font-family: var(--font-race);
  font-size: var(--text-label);
  color: var(--color-bio);
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.hero-eq__title-wrapper {
  overflow: visible;
  margin-bottom: var(--space-sm);
}

.hero-eq__title {
  font-family: var(--font-display);
  font-size: var(--text-titan);
  font-weight: 800;
  line-height: 0.88;
  color: var(--color-buoy);
  text-shadow: var(--glow-buoy);
  margin: 0;
  letter-spacing: -0.02em;
}

.hero-eq__letter {
  display: inline-block;   /* necesario para transformar letra a letra */
}

.hero-eq__line {
  width: clamp(200px, 30vw, 320px);
  height: 8px;
  margin-bottom: var(--space-md);
}

.hero-eq__subtitle-line {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 600;
  color: var(--color-sail);
  line-height: 1.1;
  margin: 0 0 var(--space-sm) 0;
}

.hero-eq__subtitle-body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-fog);
  line-height: 1.7;
  max-width: 480px;
  margin: 0;
}

.hero-eq__scroll {
  margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.hero-eq__scroll-line {
  display: block;
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, var(--color-bio));
}

.hero-eq__scroll-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-bio);
  box-shadow: var(--glow-bio);
}
```

---

---

# ══════════════════════════════════════════════════════
# BLOQUE B · MARQUEE FILOSÓFICO
# ══════════════════════════════════════════════════════

### ☐ TAREA B.1 — Marquee infinito con Framer Motion

> **El efecto:** Una franja oscura ligeramente más clara que el fondo.
> Texto que fluye sin parar de derecha a izquierda.
> Al hacer hover, el texto se frena suavemente.
> CSS `will-change: transform` para 60fps garantizados.

**Archivo:** `src/sections/EquiposEntrenamiento/components/FilosofiaMarquee.jsx`

```jsx
// FilosofiaMarquee.jsx
import { useRef } from "react";
import { motion } from "framer-motion";

// Palabras que se repiten (separadas por bullet)
const WORDS = [
  "crecer navegando",
  "compartir",
  "disfrutar del camino",
  "sin campeonas a cualquier precio",
  "trabajo en equipo",
  "la mar como maestra",
  "aprender juntas",
];

// Duplicamos para el efecto seamless
const TEXT = [...WORDS, ...WORDS]
  .map((w) => `${w}  ·  `)
  .join("");

export default function FilosofiaMarquee() {
  const isHovered = useRef(false);

  return (
    <div
      className="marquee-band"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
      aria-hidden="true"                         /* decorativo */
    >
      <motion.div
        className="marquee-track"
        animate={{ x: [0, "-50%"] }}             /* mueve exactamente la mitad */
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={{ animationPlayState: "paused" }}   /* pausa al hover */
      >
        <span className="marquee-text">{TEXT}</span>
        <span className="marquee-text" aria-hidden="true">{TEXT}</span>
      </motion.div>
    </div>
  );
}
```

**CSS del marquee:**
```css
/* ── MARQUEE ─────────────────────────────────────────────────── */
.marquee-band {
  overflow: hidden;
  background: var(--color-hull);
  border-top:    1px solid rgba(43, 224, 192, 0.08);
  border-bottom: 1px solid rgba(43, 224, 192, 0.08);
  padding: var(--space-sm) 0;
  cursor: default;
  user-select: none;
}

.marquee-track {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}

.marquee-text {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  font-style: italic;
  color: var(--color-fog);
  padding-right: 1em;
  letter-spacing: 0.02em;
}
```

---

---

# ══════════════════════════════════════════════════════
# BLOQUE C · TARJETAS ESCOTILLA 3D — LOS 3 EQUIPOS
# ══════════════════════════════════════════════════════

## ☐ TAREA C.1 — Datos de los equipos

**Archivo:** `src/sections/EquiposEntrenamiento/data/teams.js`

```js
// teams.js — la fuente de verdad de los 3 equipos
export const TEAMS = [
  {
    id: "infantil",
    label: "INFANTIL",
    age: "A partir de 5 años",
    emoji: "⚓",
    accentColor: "#2BE0C0",   // bio teal
    description:
      "La base del trabajo se realiza en Optimist, con salidas puntuales " +
      "en Raquero o J80. Se mejora la lectura del viento, las maniobras " +
      "y la seguridad en el agua desde un ambiente cercano y motivador.",
    schedule: "Primeros 3 domingos de cada mes",
    focus: "Confianza · Lectura del viento · Toma de decisiones",
    embarcaciones: ["Optimist", "Raquero", "J80"],
    domingosAlMes: 3,
  },
  {
    id: "jovenes",
    label: "JÓVENES",
    age: "A partir de 14 años",
    emoji: "🌊",
    accentColor: "#E8C547",   // buoy yellow
    description:
      "Grupos estables para quienes quieren aprender desde la base " +
      "o seguir creciendo. Se navega en distintas embarcaciones para " +
      "formar navegantes completas y responsables.",
    schedule: "Primeros 3 domingos de cada mes",
    focus: "Cohesión · Comunicación a bordo · Responsabilidad compartida",
    embarcaciones: ["Varios tipos", "J80"],
    domingosAlMes: 3,
  },
  {
    id: "adultas",
    label: "ADULTAS",
    age: "Tecnificación",
    emoji: "🏆",
    accentColor: "#F0F4F8",   // sail white
    description:
      "Tecnificación en Laser/ILCA, 420 y cruceros J80. " +
      "Impartido por monitores especialistas en regata. " +
      "Sesiones de 4 horas, 3 veces al mes, de septiembre a junio.",
    schedule: "3 días al mes · Sesiones de 4 horas",
    focus: "Control del barco · Trimado de velas · Estrategia de regata",
    embarcaciones: ["Laser / ILCA", "420", "J80"],
    domingosAlMes: 3,
    note: "Incluido en Pack Completo Socias · 1.200€/año",
  },
];
```

---

## ☐ TAREA C.2 — TeamCard: la tarjeta escotilla individual

> **La magia:** Cada tarjeta tiene cara frontal y cara trasera.
> Al hacer click, hace un giro 3D de 180° en el eje Y,
> revelando el contenido completo en la cara de atrás.
> La animación usa `rotateY` de Framer Motion con `AnimatePresence`.
> La perspectiva está en el contenedor padre para mayor realismo.

**Archivo:** `src/sections/EquiposEntrenamiento/components/TeamCard.jsx`

```jsx
// TeamCard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Variantes del flip ────────────────────────────────────────
const flipVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const backContentVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.3 } }
};

// ── Componente ────────────────────────────────────────────────
export default function TeamCard({ team, isActive, onToggle, entryDelay = 0 }) {
  const { label, age, emoji, accentColor,
          description, schedule, focus, embarcaciones, note } = team;

  return (
    // Contenedor con perspectiva — da el efecto 3D al flip
    <motion.div
      className="team-card-wrapper"
      style={{ perspective: "900px" }}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: entryDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Capa que rota */}
      <motion.div
        className="team-card-flipper"
        animate={isActive ? "back" : "front"}
        variants={flipVariants}
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* ── CARA FRONTAL ────────────────────────────────── */}
        <div
          className="team-card team-card--front"
          style={{ "--accent": accentColor }}
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
          aria-expanded={isActive}
          aria-label={`Ver equipo ${label}`}
        >
          {/* Borde superior coloreado */}
          <div className="team-card__accent-bar" />

          {/* Emoji grande */}
          <motion.div
            className="team-card__emoji"
            animate={isActive ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {emoji}
          </motion.div>

          <div className="team-card__front-text">
            <span className="team-card__label">{label}</span>
            <span className="team-card__age">{age}</span>
          </div>

          {/* Indicador de apertura */}
          <motion.div
            className="team-card__toggle-hint"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>VER EQUIPO</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* ── CARA TRASERA ────────────────────────────────── */}
        <div
          className="team-card team-card--back"
          style={{ "--accent": accentColor, transform: "rotateY(180deg)" }}
          onClick={onToggle}
          role="button"
          tabIndex={isActive ? 0 : -1}
          aria-label={`Cerrar equipo ${label}`}
        >
          {/* Borde de acento */}
          <div className="team-card__accent-bar" />

          {/* Contenido con su propia animación de entrada */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="team-card__back-content"
                variants={backContentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="team-card__back-header">
                  <span className="team-card__label">{label}</span>
                  <span className="team-card__age" style={{ color: accentColor }}>
                    {age}
                  </span>
                </div>

                <p className="team-card__description">{description}</p>

                <div className="team-card__meta">
                  <div className="team-card__meta-row">
                    <span className="team-card__meta-icon">📅</span>
                    <span>{schedule}</span>
                  </div>
                  <div className="team-card__meta-row">
                    <span className="team-card__meta-icon">🎯</span>
                    <span>{focus}</span>
                  </div>
                </div>

                {/* Chips de embarcaciones */}
                <div className="team-card__chips">
                  {embarcaciones.map((e) => (
                    <span key={e} className="team-card__chip"
                          style={{ borderColor: accentColor }}>
                      {e}
                    </span>
                  ))}
                </div>

                {/* Nota especial si existe */}
                {note && (
                  <p className="team-card__note">{note}</p>
                )}

                {/* Cerrar */}
                <button className="team-card__close">
                  ↑ cerrar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
}
```

---

## ☐ TAREA C.3 — TeamCards: contenedor con lógica de "solo una abierta"

**Archivo:** `src/sections/EquiposEntrenamiento/components/TeamCards.jsx`

```jsx
// TeamCards.jsx
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import TeamCard from "./TeamCard";
import { TEAMS } from "../data/teams";

export default function TeamCards() {
  const [activeTeam, setActiveTeam] = useState(null);

  const toggle = (id) =>
    setActiveTeam((prev) => (prev === id ? null : id));

  return (
    <section className="team-cards-section">

      <motion.p
        className="section-eyebrow--light"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        NUESTROS EQUIPOS
      </motion.p>

      <motion.h2
        className="section-title--light"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Elige tu flota.
      </motion.h2>

      <div className="team-cards-grid">
        {TEAMS.map((team, i) => (
          <TeamCard
            key={team.id}
            team={team}
            isActive={activeTeam === team.id}
            onToggle={() => toggle(team.id)}
            entryDelay={i * 0.12}
          />
        ))}
      </div>

    </section>
  );
}
```

---

## ☐ TAREA C.4 — CSS de las tarjetas

```css
/* ── TEAM CARDS ───────────────────────────────────────────── */
.team-cards-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-deep);
  text-align: center;
}

.section-eyebrow--light {
  font-family: var(--font-race);
  font-size: var(--text-label);
  letter-spacing: 0.25em;
  color: var(--color-bio);
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.section-title--light {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 700;
  color: var(--color-sail);
  margin-bottom: var(--space-xl);
  line-height: 1.05;
}

.team-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
  max-width: 1000px;
  margin: 0 auto;
}

/* ── Wrapper que tiene la perspectiva ─────────────────────── */
.team-card-wrapper {
  height: 360px;   /* altura fija para el flip */
  cursor: pointer;
}

/* ── La capa que rota (necesita transform-style) ─────────── */
.team-card-flipper {
  width: 100%;
  height: 100%;
  position: relative;
}

/* ── Cara base ─────────────────────────────────────────────── */
.team-card {
  position: absolute;
  inset: 0;
  background: var(--color-hull);
  border-radius: 20px;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  backface-visibility: hidden;         /* oculta la cara trasera */
  -webkit-backface-visibility: hidden;
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.3s ease;
}

.team-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

/* Barra de acento superior */
.team-card__accent-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 20px 20px 0 0;
  background: var(--accent);
  box-shadow: 0 0 16px var(--accent);
}

/* ── Cara frontal ─────────────────────────────────────────── */
.team-card--front {
  text-align: center;
}

.team-card__emoji {
  font-size: 4rem;
  line-height: 1;
  margin: auto 0;
}

.team-card__front-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.team-card__label {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-sail);
  letter-spacing: 0.05em;
}

.team-card__age {
  font-family: var(--font-race);
  font-size: 0.78rem;
  color: var(--color-fog);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.team-card__toggle-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: var(--font-race);
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  text-transform: uppercase;
  opacity: 0.8;
}

/* ── Cara trasera ─────────────────────────────────────────── */
.team-card--back {
  overflow-y: auto;
  text-align: left;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--space-sm);
}

.team-card__back-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-top: var(--space-sm);
}

.team-card__back-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.team-card__description {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--color-fog);
  line-height: 1.6;
  margin: 0;
}

.team-card__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.team-card__meta-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--color-fog);
}

.team-card__meta-icon { flex-shrink: 0; }

.team-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.team-card__chip {
  font-family: var(--font-race);
  font-size: 0.7rem;
  color: var(--accent);
  border: 1px solid;
  border-radius: 100px;
  padding: 2px 10px;
  letter-spacing: 0.05em;
}

.team-card__note {
  font-family: var(--font-race);
  font-size: 0.72rem;
  color: var(--color-buoy);
  margin: 0;
  line-height: 1.5;
}

.team-card__close {
  background: none;
  border: none;
  font-family: var(--font-race);
  font-size: 0.72rem;
  color: var(--color-fog);
  cursor: pointer;
  letter-spacing: 0.1em;
  padding: 0;
  margin-top: auto;
}
```

---

---

# ══════════════════════════════════════════════════════
# BLOQUE D · CALENDARIO VISUAL DE DOMINGOS
# ══════════════════════════════════════════════════════

## ☐ TAREA D.1 — Lógica del calendario

**Archivo:** `src/sections/EquiposEntrenamiento/data/calendar.js`

```js
// calendar.js — calcula los domingos de cualquier mes/año
export function getSundaysOfMonth(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() === 0) days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Los primeros 3 domingos son de entrenamiento
export function isTrainingDay(sundayIndex) {
  return sundayIndex < 3;   // índice 0,1,2 = entrenamiento
}

export const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export const DAY_NAMES = ["L","M","X","J","V","S","D"];
```

---

## ☐ TAREA D.2 — Componente CalendarView

**Archivo:** `src/sections/EquiposEntrenamiento/components/CalendarView.jsx`

```jsx
// CalendarView.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  getSundaysOfMonth, isTrainingDay,
  MONTH_NAMES, DAY_NAMES
} from "../data/calendar";

// Genera los días del mes para pintar la cuadrícula
function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();   // 0=dom
  const offset   = firstDay === 0 ? 6 : firstDay - 1;  // lunes=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarView() {
  const now     = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const ref     = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const sundays = getSundaysOfMonth(year, month);
  const sundayDates = sundays.map((d) => d.getDate());
  const grid    = getMonthGrid(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Averigua si un día es un domingo de entrenamiento
  const isTraining = (day) => {
    if (!day) return false;
    const idx = sundayDates.indexOf(day);
    return idx !== -1 && isTrainingDay(idx);
  };
  const isSundayRest = (day) => {
    if (!day) return false;
    const idx = sundayDates.indexOf(day);
    return idx >= 3;   // 4º+ domingo = libre
  };

  return (
    <section ref={ref} className="calendar-section">

      <motion.p
        className="section-eyebrow--light"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        CALENDARIO DE ENTRENAMIENTOS
      </motion.p>

      <motion.h2
        className="section-title--light"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Primeros 3 domingos<br/>de cada mes.
      </motion.h2>

      {/* Tarjeta calendario */}
      <motion.div
        className="cal-card"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* Header: navegación de mes */}
        <div className="cal-header">
          <motion.button
            className="cal-nav-btn"
            onClick={prevMonth}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Mes anterior"
          >
            ←
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.span
              key={`${year}-${month}`}
              className="cal-month-label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {MONTH_NAMES[month]} {year}
            </motion.span>
          </AnimatePresence>

          <motion.button
            className="cal-nav-btn"
            onClick={nextMonth}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Mes siguiente"
          >
            →
          </motion.button>
        </div>

        {/* Cabecera de días */}
        <div className="cal-grid cal-grid--header">
          {DAY_NAMES.map((d) => (
            <span key={d} className="cal-day-name">{d}</span>
          ))}
        </div>

        {/* Cuadrícula de días */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${year}-${month}`}
            className="cal-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {grid.map((day, i) => {
              const training = isTraining(day);
              const rest     = isSundayRest(day);

              return (
                <motion.div
                  key={i}
                  className={[
                    "cal-day",
                    !day          ? "cal-day--empty"    : "",
                    training      ? "cal-day--training" : "",
                    rest          ? "cal-day--rest"     : "",
                  ].join(" ")}
                  whileHover={day ? { scale: 1.15 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {day && (
                    <>
                      <span className="cal-day__num">{day}</span>
                      {training && (
                        <motion.span
                          className="cal-day__dot"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: i * 0.01 }}
                        />
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Leyenda */}
        <div className="cal-legend">
          <span className="cal-legend__item cal-legend__item--training">
            <span className="cal-legend__dot" />
            Entrenamiento
          </span>
          <span className="cal-legend__item">
            <span className="cal-legend__dot cal-legend__dot--rest" />
            Domingo libre
          </span>
        </div>

      </motion.div>
    </section>
  );
}
```

**CSS del calendario:**
```css
/* ── CALENDAR ─────────────────────────────────────────────── */
.calendar-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-hull);
  text-align: center;
}

.cal-card {
  max-width: 420px;
  margin: 0 auto;
  background: var(--color-deep);
  border-radius: 24px;
  padding: var(--space-md);
  border: 1px solid rgba(43, 224, 192, 0.12);
  box-shadow: 0 0 60px rgba(43, 224, 192, 0.06);
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.cal-nav-btn {
  background: none;
  border: none;
  color: var(--color-bio);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.cal-nav-btn:hover { background: rgba(43, 224, 192, 0.08); }

.cal-month-label {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-sail);
}

/* Grid 7 columnas */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.cal-grid--header .cal-day-name {
  font-family: var(--font-race);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--color-fog);
  text-align: center;
  padding: 6px 0;
}

.cal-day {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: default;
}

.cal-day__num {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--color-fog);
}

/* Entrenamiento — resaltado en amarillo boya */
.cal-day--training { background: rgba(232, 197, 71, 0.1); }
.cal-day--training .cal-day__num { color: var(--color-buoy); font-weight: 600; }

/* Dot indicador */
.cal-day__dot {
  position: absolute;
  bottom: 3px;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--color-buoy);
  box-shadow: 0 0 6px var(--color-buoy);
}

.cal-day--rest .cal-day__num { color: rgba(240, 244, 248, 0.25); }

/* Leyenda */
.cal-legend {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-sm);
}

.cal-legend__item {
  font-family: var(--font-race);
  font-size: 0.7rem;
  color: var(--color-fog);
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cal-legend__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--color-buoy);
  box-shadow: 0 0 6px var(--color-buoy);
}

.cal-legend__dot--rest {
  background: rgba(240, 244, 248, 0.2);
  box-shadow: none;
}
```

---

---

# ══════════════════════════════════════════════════════
# BLOQUE E · LOGBOOK DE REQUISITOS
# ══════════════════════════════════════════════════════

## ☐ TAREA E.1 — Datos de requisitos

**Archivo:** `src/sections/EquiposEntrenamiento/data/requirements.js`

```js
// requirements.js
export const REQUIREMENTS = [
  {
    id: "ganas",
    number: "01",
    title: "Ganas de aprender y compartir",
    body:
      "Buscamos personas comprometidas con el compañerismo. " +
      "Las tripulaciones se apoyan, celebran avances y normalizan " +
      "el error como parte del deporte.",
    icon: "🤝",
  },
  {
    id: "nivel",
    number: "02",
    title: "Nivel previo según categoría",
    body:
      "Infantiles y jóvenes pueden empezar desde la base. " +
      "Para adultas se recomienda haber superado el Crucero Iniciación.",
    icon: "⛵",
  },
  {
    id: "licencia",
    number: "03",
    title: "Licencia Federativa",
    body:
      "Obligatoria para entrenar y regate. " +
      "Federación Vasca de Vela · ~64€/año. " +
      "Incluye seguro complementario.",
    icon: "📋",
    highlight: "~64€/año",
  },
  {
    id: "socia",
    number: "04",
    title: "Ser Socia del Club",
    body:
      "Pack Completo: 1.200€/año · 3 días/mes de tecnificación " +
      "guiada (sept–junio) + salidas ilimitadas todo el año.",
    icon: "🏅",
    highlight: "1.200€/año",
  },
];
```

---

## ☐ TAREA E.2 — Componente LogbookRequirements

**Archivo:** `src/sections/EquiposEntrenamiento/components/LogbookRequirements.jsx`

> **La magia:** El componente parece un cuaderno de bitácora real.
> Tiene una línea horizontal de "renglón" en el fondo.
> Cada requisito aparece como una entrada del diario,
> con su número de entrada en formato `DM Mono`.
> Un check animado (SVG path draw) aparece al llegar al viewport.

```jsx
// LogbookRequirements.jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { REQUIREMENTS } from "../data/requirements";

// SVG check animado
function AnimatedCheck({ color = "#2BE0C0", delay = 0, isVisible }) {
  return (
    <svg className="logbook__check-svg" viewBox="0 0 24 24" fill="none"
         aria-hidden="true">
      <motion.path
        d="M4 12L9 17L20 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export default function LogbookRequirements() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="logbook-section">

      <motion.p
        className="section-eyebrow--light"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        REQUISITOS
      </motion.p>

      <motion.h2
        className="section-title--light"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Para unirte a la flota.
      </motion.h2>

      {/* El "cuaderno" */}
      <motion.div
        ref={ref}
        className="logbook"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Encabezado estilo bitácora */}
        <div className="logbook__header">
          <span className="logbook__title">CUADERNO DE BITÁCORA</span>
          <span className="logbook__subtitle">Getxo Bela Eskola · Condiciones de acceso</span>
        </div>

        <div className="logbook__divider" />

        {/* Entradas */}
        {REQUIREMENTS.map((req, i) => (
          <motion.div
            key={req.id}
            className="logbook__entry"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Número de entrada */}
            <span className="logbook__entry-num">[{req.number}]</span>

            {/* Contenido */}
            <div className="logbook__entry-body">
              <div className="logbook__entry-header">
                <span className="logbook__entry-icon" aria-hidden="true">
                  {req.icon}
                </span>
                <span className="logbook__entry-title">{req.title}</span>
              </div>
              <p className="logbook__entry-text">{req.body}</p>
              {req.highlight && (
                <span className="logbook__highlight">{req.highlight}</span>
              )}
            </div>

            {/* Check animado */}
            <div className="logbook__check">
              <AnimatedCheck
                delay={0.5 + i * 0.12}
                isVisible={isInView}
              />
            </div>
          </motion.div>
        ))}

        {/* Firma del logbook */}
        <div className="logbook__signature">
          <span>Angharad · Getxo Bela Eskola · getxobelaeskola.cloud</span>
        </div>

      </motion.div>
    </section>
  );
}
```

**CSS del logbook:**
```css
/* ── LOGBOOK ──────────────────────────────────────────────── */
.logbook-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-deep);
  text-align: center;
}

.logbook {
  max-width: 680px;
  margin: 0 auto;
  background: var(--color-hull);
  border-radius: 20px;
  padding: var(--space-lg);
  border: 1px solid rgba(43, 224, 192, 0.1);
  text-align: left;
  /* Renglones de fondo — evoca papel */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 40px,
    rgba(43, 224, 192, 0.03) 40px,
    rgba(43, 224, 192, 0.03) 41px
  );
}

.logbook__header {
  margin-bottom: var(--space-sm);
}

.logbook__title {
  display: block;
  font-family: var(--font-race);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: var(--color-bio);
  text-transform: uppercase;
}

.logbook__subtitle {
  display: block;
  font-family: var(--font-race);
  font-size: 0.7rem;
  color: var(--color-fog);
  letter-spacing: 0.08em;
  margin-top: 4px;
}

.logbook__divider {
  height: 1px;
  background: rgba(43, 224, 192, 0.15);
  margin: var(--space-sm) 0 var(--space-md);
}

.logbook__entry {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.logbook__entry:last-of-type { border-bottom: none; }

.logbook__entry-num {
  font-family: var(--font-race);
  font-size: 0.75rem;
  color: var(--color-fog);
  letter-spacing: 0.05em;
  min-width: 36px;
  padding-top: 3px;
}

.logbook__entry-body { flex: 1; }

.logbook__entry-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.logbook__entry-icon { font-size: 1.1rem; }

.logbook__entry-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-sail);
}

.logbook__entry-text {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--color-fog);
  line-height: 1.6;
  margin: 0;
}

.logbook__highlight {
  display: inline-block;
  margin-top: 6px;
  font-family: var(--font-race);
  font-size: 0.8rem;
  color: var(--color-buoy);
  background: rgba(232, 197, 71, 0.1);
  border-radius: 4px;
  padding: 2px 8px;
}

.logbook__check {
  flex-shrink: 0;
  width: 28px; height: 28px;
  background: rgba(43, 224, 192, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.logbook__check-svg {
  width: 14px; height: 14px;
}

.logbook__signature {
  margin-top: var(--space-md);
  font-family: var(--font-race);
  font-size: 0.68rem;
  color: rgba(240, 244, 248, 0.2);
  letter-spacing: 0.08em;
  text-align: right;
}
```

---

---

# ══════════════════════════════════════════════════════
# BLOQUE F · CTA FINAL SPLIT SCREEN
# ══════════════════════════════════════════════════════

## ☐ TAREA F.1 — CTAFinal: Split screen dramático

> **La magia:** La pantalla se divide en dos en el eje vertical.
> Izquierda: texto que crece al hacer scroll (scale from center).
> Derecha: formulario minimal que parece un mensaje de radio náutico.
> La separación entre los dos paneles es una línea ondulada SVG animada.

**Archivo:** `src/sections/EquiposEntrenamiento/components/CTAFinal.jsx`

```jsx
// CTAFinal.jsx
import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function CTAFinal() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);

  // Texto del lado izquierdo que escala sutilmente al scrollear
  const { scrollYProgress } = useScroll({
    target: ref, offset: ["start end", "end start"]
  });
  const textScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1.02]);

  return (
    <section ref={ref} className="cta-final">

      {/* Panel izquierdo — frase */}
      <motion.div
        className="cta-final__left"
        style={{ scale: textScale }}
      >
        <motion.p
          className="cta-final__overline"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          ÚNETE A LA FLOTA
        </motion.p>

        <motion.h2
          className="cta-final__headline"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Vivid la<br/>
          mar<br/>
          <em>juntas.</em>
        </motion.h2>

        <motion.p
          className="cta-final__tagline"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Informamos de plazas disponibles<br/>
          sin compromiso.
        </motion.p>
      </motion.div>

      {/* Divisor ondulado SVG animado */}
      <div className="cta-final__divider" aria-hidden="true">
        <motion.svg viewBox="0 0 20 400" preserveAspectRatio="none"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M10 0 Q18 50 10 100 Q2 150 10 200 Q18 250 10 300 Q2 350 10 400"
            stroke="rgba(43,224,192,0.25)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>
      </div>

      {/* Panel derecho — "Mensaje de radio" */}
      <motion.div
        className="cta-final__right"
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className="radio-msg">
          <div className="radio-msg__header">
            <span className="radio-msg__label">MENSAJE · CANAL 16</span>
            <span className="radio-msg__status">EN LÍNEA</span>
          </div>

          {!sent ? (
            <>
              <p className="radio-msg__intro">
                Escríbenos y os informamos de los equipos y plazas disponibles.
              </p>

              {/* Botón principal */}
              <motion.a
                href="mailto:info@getxobelaeskola.cloud"
                className="radio-msg__btn"
                whileHover={{ scale: 1.03, boxShadow: "var(--glow-bio)" }}
                whileTap={{ scale: 0.97 }}
              >
                📡 Enviar mensaje
              </motion.a>

              {/* O por WhatsApp */}
              <motion.a
                href="https://wa.me/34600000000"
                className="radio-msg__btn radio-msg__btn--secondary"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                💬 WhatsApp
              </motion.a>

              <p className="radio-msg__note">
                Respondemos en menos de 24h · Sin compromiso
              </p>
            </>
          ) : (
            /* Estado de "enviado" con animación */
            <motion.div
              className="radio-msg__sent"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className="radio-msg__sent-icon">📡</span>
              <p>¡Mensaje recibido! <br/>Nos ponemos en contacto pronto.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

    </section>
  );
}
```

**CSS del CTA final:**
```css
/* ── CTA FINAL ────────────────────────────────────────────── */
.cta-final {
  display: grid;
  grid-template-columns: 1fr 24px 1fr;
  align-items: center;
  min-height: 70vh;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-hull);
  gap: var(--space-md);
}

.cta-final__left {
  padding-right: var(--space-md);
}

.cta-final__overline {
  font-family: var(--font-race);
  font-size: var(--text-label);
  color: var(--color-bio);
  letter-spacing: 0.2em;
  margin-bottom: var(--space-sm);
}

.cta-final__headline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 800;
  color: var(--color-sail);
  line-height: 0.95;
  margin: 0 0 var(--space-md) 0;
}

.cta-final__headline em {
  font-style: italic;
  color: var(--color-buoy);
  text-shadow: var(--glow-buoy);
}

.cta-final__tagline {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-fog);
  line-height: 1.65;
  margin: 0;
}

.cta-final__divider {
  height: 100%;
  min-height: 300px;
}

.cta-final__divider svg {
  width: 100%;
  height: 100%;
}

/* ── Panel de radio ───────────────────────────────────────── */
.radio-msg {
  background: var(--color-deep);
  border: 1px solid rgba(43, 224, 192, 0.15);
  border-radius: 20px;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.radio-msg__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radio-msg__label {
  font-family: var(--font-race);
  font-size: 0.7rem;
  color: var(--color-fog);
  letter-spacing: 0.15em;
}

.radio-msg__status {
  font-family: var(--font-race);
  font-size: 0.65rem;
  color: var(--color-bio);
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.radio-msg__status::before {
  content: "";
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-bio);
  box-shadow: var(--glow-bio);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.radio-msg__intro {
  font-family: var(--font-body);
  font-size: 0.92rem;
  color: var(--color-fog);
  line-height: 1.6;
  margin: 0;
}

.radio-msg__btn {
  display: block;
  text-align: center;
  background: var(--color-bio);
  color: var(--color-deep);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.9rem 1.8rem;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.radio-msg__btn--secondary {
  background: transparent;
  color: var(--color-sail);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.radio-msg__note {
  font-family: var(--font-race);
  font-size: 0.68rem;
  color: rgba(240, 244, 248, 0.3);
  text-align: center;
  letter-spacing: 0.05em;
  margin: 0;
}

.radio-msg__sent {
  text-align: center;
  padding: var(--space-md) 0;
}

.radio-msg__sent-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

.radio-msg__sent p {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-sail);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .cta-final {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
  .cta-final__divider { display: none; }
}
```

---

---

# ══════════════════════════════════════════════════════
# ENSAMBLAJE FINAL
# ══════════════════════════════════════════════════════

## ☐ TAREA Z.1 — Sección wrapper con Canvas de viento global

**Archivo:** `src/sections/EquiposEntrenamiento/index.jsx`

```jsx
// index.jsx — sección completa
import WindCanvas          from "./components/WindCanvas";
import HeroEquipos         from "./components/HeroEquipos";
import FilosofiaMarquee    from "./components/FilosofiaMarquee";
import TeamCards           from "./components/TeamCards";
import CalendarView        from "./components/CalendarView";
import LogbookRequirements from "./components/LogbookRequirements";
import CTAFinal            from "./components/CTAFinal";
import "./EquiposEntrenamiento.module.css";

export default function EquiposEntrenamiento() {
  return (
    <div id="equipos-entrenamiento" className="equipos-root">

      {/* Canvas de viento — cubre solo el hero */}
      <div className="equipos-hero-wrapper">
        <WindCanvas />
        <HeroEquipos />
      </div>

      <FilosofiaMarquee />
      <TeamCards />
      <CalendarView />
      <LogbookRequirements />
      <CTAFinal />

    </div>
  );
}
```

```css
/* ── ROOT ────────────────────────────────────────────────── */
.equipos-root {
  background: var(--color-deep);
  color: var(--color-sail);
}

.equipos-hero-wrapper {
  position: relative;
  overflow: hidden;
  background: var(--color-deep);
}
```

---

## ☐ TAREA Z.2 — Fuentes (adicionales a las del plan anterior)

```html
<!-- Añadir al <head> — Cormorant Garamond para el hero más dramático -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Inter:wght@400;500;600&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />
```

---

## ☐ TAREA Z.3 — Variables CSS globales a añadir

```css
/* En tu :root o tokens.css — complementan los del plan anterior */
:root {
  --color-deep:   #060E18;
  --color-hull:   #0D1F2D;
  --color-keel:   #162840;
  --color-buoy:   #E8C547;
  --color-bio:    #2BE0C0;
  --color-sail:   #F0F4F8;
  --color-fog:    rgba(240, 244, 248, 0.45);
  --color-horizon: rgba(232, 197, 71, 0.12);
  --glow-buoy:    0 0 32px rgba(232, 197, 71, 0.35), 0 0 8px rgba(232, 197, 71, 0.2);
  --glow-bio:     0 0 24px rgba(43, 224, 192, 0.3),  0 0 6px rgba(43, 224, 192, 0.15);
  --shadow-card:  0 8px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-race:    'DM Mono', 'Courier New', monospace;
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN EN ORDEN

```
SETUP
[ ] 0a. npm install framer-motion (si no está ya)
[ ] 0b. Añadir tokens CSS globales (bloque de variables)
[ ] 0c. Añadir fuentes Cormorant Garamond al <head>
[ ] 0d. Crear estructura de carpetas exacta

BLOQUE A — HERO
[ ] A.1  WindCanvas.jsx — Canvas de partículas de viento
[ ] A.2  HeroEquipos.jsx — Texto hero con letras individuales 3D

BLOQUE B — MARQUEE
[ ] B.1  FilosofiaMarquee.jsx — Marquee infinito con hover-pause

BLOQUE C — EQUIPOS
[ ] C.1  teams.js — datos de los 3 equipos
[ ] C.2  TeamCard.jsx — flip escotilla 3D individual
[ ] C.3  TeamCards.jsx — contenedor con lógica "una sola abierta"
[ ] C.4  CSS de tarjetas

BLOQUE D — CALENDARIO
[ ] D.1  calendar.js — lógica de domingos del mes
[ ] D.2  CalendarView.jsx — calendario visual interactivo

BLOQUE E — LOGBOOK
[ ] E.1  requirements.js — datos de los 4 requisitos
[ ] E.2  LogbookRequirements.jsx — cuaderno de bitácora animado

BLOQUE F — CTA
[ ] F.1  CTAFinal.jsx — split screen con "mensaje de radio"

ENSAMBLAJE
[ ] Z.1  index.jsx — wrapper final con canvas de viento
[ ] Z.2  Responsive: añadir media queries
[ ] Z.3  Probar prefers-reduced-motion
[ ] Z.4  Actualizar href del WhatsApp con número real
[ ] Z.5  Actualizar mailto con email real de la escuela
```

---

## 🎬 MAPA COMPLETO DE ANIMACIONES

```
BLOQUE A ─ HERO
  WindCanvas    →  80 racha-partículas amarillas flotando (siempre)
                   Responden a posición del ratón (suave)
  "REGATAS"     →  7 letras caen desde arriba con rebote spring (stagger 0.04s)
                   Efecto perspectiva 3D (rotateX -45° → 0°)
  Línea teal    →  pathLength SVG de 0 → 1 (curva ondulada, 1s)
  Subtítulo     →  fade + slide-up (0.55s delay)
  Scroll dot    →  bounce infinito (1.8s loop)

BLOQUE B ─ MARQUEE
  Texto         →  translateX continuo 0 → -50% (28s, linear, infinito)
  Hover         →  animación se pausa (CSS animation-play-state)

BLOQUE C ─ TARJETAS
  Entrada       →  stagger fade+slide-up al entrar en viewport
  Click         →  rotateY 0° → 180° (flip 3D, 0.6s spring)
  Back content  →  fade-in tras el flip (0.3s delay)
  Chips         →  badge con border del color del equipo
  Emoji front   →  escala + fade-out al abrir

BLOQUE D ─ CALENDARIO
  Card          →  fade+slide-up+scale al entrar en viewport
  Mes           →  AnimatePresence: slide-up al cambiar mes
  Días activos  →  spring scale 0 → 1 (stagger por índice)
  Hover día     →  spring scale 1 → 1.15

BLOQUE E ─ LOGBOOK
  Libro         →  fade+slide-up (0.7s)
  Entradas      →  stagger slide-right (delay 0.3s + 0.1s cada una)
  Checks SVG    →  pathLength 0 → 1 (stroke draw, 0.4s)

BLOQUE F ─ CTA
  Texto izq.    →  scale 0.9 → 1.02 en scroll (parallax sutil)
  Línea ondulada→  pathLength SVG de 0 → 1 (1.5s, serpentea)
  Panel radio   →  fade + slide desde la derecha
  Dot de estado →  pulso CSS opacity loop (2s)
  CTA hover     →  scale 1.03 + glow box-shadow
```

---

*Plan generado para getxobelaeskola.cloud · Equipos de Entrenamiento · Junio 2026*
*Nivel de magia: ⛵⛵⛵⛵⛵ / 5*
