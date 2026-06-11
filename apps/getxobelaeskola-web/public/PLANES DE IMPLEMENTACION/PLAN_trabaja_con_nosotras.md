# 🌊 PLAN DE IMPLEMENTACIÓN — Sección "Trabaja con Nosotras"
### getxobelaeskola.cloud · Tema: blanco Apple, magia máxima
---

> **Firma visual de esta sección (el momento WOW único):**
> Cuando alguien arrastra su CV sobre la zona de subida, el área se "abre
> como el mar abre camino a un barco" — el borde se transforma en una ola
> animada — y al soltar el archivo, un **barquito SVG** navega de izquierda
> a derecha por toda la zona de drop, deja una estela y se convierte en un
> sobre cerrado. Nadie que vea eso se olvida de dónde mandó su CV.

---

## 🎨 SISTEMA DE TOKENS — Blanco Apple con alma náutica

> **Por qué NO es el Apple genérico:** El blanco de Apple en producto es
> frío y tecnológico. Aquí calentamos con un único azul de océano profundo
> y tipografía `Plus Jakarta Sans` — geométrica pero con carácter humano,
> a diferencia del clon de SF Pro que usaría cualquier IA.

```css
/* ─── PALETA BLANCA CON ACENTO ÚNICO ──────────────────────── */
--color-white:      #FFFFFF;        /* fondo principal           */
--color-snow:       #F5F5F7;        /* fondo secciones alternas  */
--color-mist:       #FAFAFA;        /* tarjetas en hover-off     */
--color-label:      #1D1D1F;        /* texto principal — Apple   */
--color-secondary:  #6E6E73;        /* texto secundario          */
--color-tertiary:   #AEAEB2;        /* placeholders, labels      */
--color-sep:        rgba(0,0,0,0.08); /* separadores              */
--color-ocean:      #0A3D5C;        /* azul profundo — EL acento */
--color-wave:       #1A6FA8;        /* azul medio — links, hover */
--color-foam:       #E8F4FC;        /* azul muy claro — chips    */
--color-success:    #34C759;        /* verde Apple — éxito       */
--color-error:      #FF3B30;        /* rojo Apple — error        */

/* ─── TIPOGRAFÍA — Plus Jakarta Sans, no SF Pro ──────────── */
/* Display:   'Plus Jakarta Sans'  600/700/800 (titulares)      */
/* Body:      'Plus Jakarta Sans'  400/500     (párrafos)       */
/* Mono:      'JetBrains Mono'     400         (labels, labels) */

--font-sans:  'Plus Jakarta Sans', -apple-system, 'Inter', sans-serif;
--font-mono:  'JetBrains Mono', 'DM Mono', monospace;

/* ─── ESCALA ─────────────────────────────────────────────── */
--text-hero:    clamp(3.5rem, 9vw, 7.5rem);
--text-display: clamp(1.8rem, 4vw, 3.2rem);
--text-title:   clamp(1.3rem, 2.5vw, 1.8rem);
--text-body:    clamp(1rem, 1.4vw, 1.1rem);
--text-small:   0.875rem;
--text-label:   0.75rem;

/* ─── ESPACIADO ─────────────────────────────────────────── */
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 2rem;
--space-lg: 4rem;
--space-xl: 7rem;

/* ─── RADIOS ─────────────────────────────────────────────── */
--radius-sm:  8px;
--radius-md:  16px;
--radius-lg:  24px;
--radius-xl:  32px;
--radius-pill: 100px;

/* ─── SOMBRAS (Apple-style — muy sutiles en blanco) ──────── */
--shadow-card:   0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
--shadow-hover:  0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
--shadow-float:  0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
--shadow-ocean:  0 4px 24px rgba(10,61,92,0.12);

/* ─── MOVIMIENTO (Apple — ease suave largo) ──────────────── */
--ease-apple: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-spring-out: cubic-bezier(0.34, 1.56, 0.64, 1);   /* con over */
--ease-sharp: cubic-bezier(0.4, 0, 0.2, 1);             /* Material  */
--dur-fast:   0.25s;
--dur-med:    0.45s;
--dur-slow:   0.75s;
```

---

## 🗺️ MAPA VISUAL COMPLETO DE LA SECCIÓN

```
┌───────────────────────────────────────────────────────────────┐
│  SECCIÓN "TRABAJA CON NOSOTRAS" — mapa bloque a bloque        │
│  Background base: #FFFFFF                                      │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  [A] HERO — blanco puro, tipografía brutal                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │   EYEBROW: ÚNETE AL EQUIPO  (--mono, --tertiary)        │  │
│  │                                                         │  │
│  │   Trabaja con              ← --hero, --label, 800       │  │
│  │   nosotras.     ← "nosotras" en --ocean                 │  │
│  │                ← ola SVG animada bajo la palabra        │  │
│  │                                                         │  │
│  │   [ instructora titulada ]  ← roles que se intercambian │  │
│  │     con AnimatePresence + fade                          │  │
│  │                                                         │  │
│  │   Párrafo introductorio — max 2 líneas                  │  │
│  │                                                         │  │
│  │   [ Ver ofertas ↓ ]  ← botón pill --ocean               │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [B] MANTRA — franja --snow                                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  "Aquí no solo trabajarás, sino que vivirás la          │  │
│  │   experiencia de enseñar, aprender y disfrutar          │  │
│  │   del entorno marino cada día."                         │  │
│  │           — texto grande centrado, revelado en scroll   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [C] BENEFICIOS — 3 columnas Apple-feature-grid               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  ╔══════════╗  ╔══════════╗  ╔══════════╗              │  │
│  │  ║  🌊      ║  ║  ⛵      ║  ║  🤝      ║              │  │
│  │  ║ La mar   ║  ║ Material ║  ║ Equipo   ║              │  │
│  │  ║ como     ║  ║ gratis   ║  ║ cercano  ║              │  │
│  │  ║ oficina  ║  ║          ║  ║          ║              │  │
│  │  ╚══════════╝  ╚══════════╝  ╚══════════╝              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [D] PERFILES — accordion expansion                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CERRADO:                                               │  │
│  │  ──────────────────────────────────── [+]              │  │
│  │  ⚓ Instructora Titulada                                 │  │
│  │  ──────────────────────────────────── [+]              │  │
│  │  🔧 Técnica de Mantenimiento                            │  │
│  │  ──────────────────────────────────── [+]              │  │
│  │  📋 Coordinadora de Tierra                              │  │
│  │                                                         │  │
│  │  ABIERTO (AnimatePresence height):                      │  │
│  │  ┌────────────────────────────────────────┐            │  │
│  │  │  Descripción del perfil                │            │  │
│  │  │  [ chip1 ] [ chip2 ] [ chip3 ]         │            │  │
│  │  └────────────────────────────────────────┘            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [E] FORMULARIO CV — LA ESTRELLA (zona drag & drop)           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  Nombre  ________________   Email  _________________   │  │
│  │                                                         │  │
│  │  Mensaje / experiencia en vela:                         │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │  textarea                                      │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │                                                   │  │  │
│  │  │   ← zona drag & drop →                           │  │  │
│  │  │                                                   │  │  │
│  │  │   🌊 (ola cuando hover)   ⛵ (barco en drop)       │  │  │
│  │  │                                                   │  │  │
│  │  │   Arrastra tu CV aquí  o  [ Buscar archivo ]      │  │  │
│  │  │                                                   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │                   [ Enviar candidatura ]                │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [F] CTA CIERRE — franja --ocean                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  "Si quieres trabajar en un lugar donde cada día         │  │
│  │   es diferente... únete a nosotras."                    │  │
│  │                    [ Contactar ]                        │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS — Cópiala exacta

```
src/
├── sections/
│   └── TrabajaConNosotras/
│       ├── index.jsx
│       ├── TrabajaConNosotras.module.css
│       │
│       ├── components/
│       │   ├── HeroTrabaja.jsx         ← [A] Hero
│       │   ├── MantraStripe.jsx        ← [B] Quote animado
│       │   ├── Beneficios.jsx          ← [C] 3 columnas
│       │   ├── Perfiles.jsx            ← [D] Accordion
│       │   ├── FormularioCV.jsx        ← [E] Form + drop zone
│       │   │    ├── DropZone.jsx      ─┐ sub-componentes
│       │   │    ├── BoatAnimation.jsx ─┘
│       │   │    └── FormFields.jsx
│       │   └── CTACierre.jsx           ← [F] CTA final
│       │
│       └── data/
│           ├── beneficios.js
│           └── perfiles.js
```

---

---

# ═══════════════════════════════════════════════
# BLOQUE A · HERO
# ═══════════════════════════════════════════════

## ☐ TAREA A.1 — Datos de roles que ciclan

**Archivo:** *(inline en el componente, no necesita fichero separado)*

```js
// Dentro de HeroTrabaja.jsx — array de roles
const CYCLING_ROLES = [
  "instructora titulada",
  "técnica de mantenimiento",
  "coordinadora de tierra",
  "persona con ganas de mar",
];
```

---

## ☐ TAREA A.2 — Ola SVG bajo la palabra "nosotras"

> **Qué es:** Un `<path>` de onda sinusoidal que se anima en `strokeDashoffset`
> creando el efecto de "escribirse sola" al entrar en viewport.
> La onda oscila levemente de forma continua (offset animation en loop).

```jsx
// SineWaveUnderline.jsx — componente auxiliar
import { motion } from "framer-motion";

export function SineWaveUnderline({ isVisible, color = "#0A3D5C" }) {
  return (
    <svg
      className="sine-underline"
      viewBox="0 0 300 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Línea base — fija, muy tenue */}
      <path
        d="M0 8 L300 8"
        stroke={color}
        strokeWidth="1"
        opacity="0.12"
      />
      {/* Onda sinusoidal — se dibuja al aparecer */}
      <motion.path
        d="M0 8 Q37.5 2 75 8 Q112.5 14 150 8 Q187.5 2 225 8 Q262.5 14 300 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isVisible
          ? { pathLength: 1, opacity: 1 }
          : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {/* Segunda pasada — shimmer continuo */}
      <motion.path
        d="M0 8 Q37.5 2 75 8 Q112.5 14 150 8 Q187.5 2 225 8 Q262.5 14 300 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.3}
        animate={isVisible
          ? { strokeDashoffset: [0, -300], opacity: [0.3, 0.5, 0.3] }
          : {}
        }
        strokeDasharray="300"
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
      />
    </svg>
  );
}
```

---

## ☐ TAREA A.3 — Componente HeroTrabaja completo

**Archivo:** `src/sections/TrabajaConNosotras/components/HeroTrabaja.jsx`

```jsx
// HeroTrabaja.jsx
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SineWaveUnderline } from "./SineWaveUnderline";

const CYCLING_ROLES = [
  "instructora titulada",
  "técnica de mantenimiento",
  "coordinadora de tierra",
  "persona con ganas de mar",
];

// ── Variantes ──────────────────────────────────────────────
const eyebrowV = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const wordV = (delay) => ({
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }
  }
});

const roleV = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0,  filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit:    { opacity: 0, y: -10, filter: "blur(4px)",
    transition: { duration: 0.25 }
  }
};

export default function HeroTrabaja() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Ciclo de roles
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % CYCLING_ROLES.length),
      2800
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="hero-trabaja" aria-label="Trabaja con nosotras">

      {/* Eyebrow */}
      <motion.span
        className="tw-eyebrow"
        variants={eyebrowV}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        ÚNETE AL EQUIPO
      </motion.span>

      {/* Título — 2 palabras separadas para animarlas */}
      <div className="tw-title-block">

        {/* "Trabaja con" */}
        <motion.span
          className="tw-title tw-title--main"
          variants={wordV(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Trabaja con
        </motion.span>

        {/* "nosotras." — con ola debajo */}
        <div className="tw-title-accent-wrapper">
          <motion.span
            className="tw-title tw-title--accent"
            variants={wordV(0.22)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            nosotras.
          </motion.span>
          {/* Ola animada debajo */}
          <SineWaveUnderline isVisible={isInView} />
        </div>

      </div>

      {/* Ciclo de roles */}
      <div className="tw-roles-wrapper" aria-live="polite" aria-atomic="true">
        <span className="tw-roles-prefix">Buscamos: </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={roleIdx}
            className="tw-role"
            variants={roleV}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {CYCLING_ROLES[roleIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Párrafo intro */}
      <motion.p
        className="tw-intro"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        Únete a una asociación sin ánimo de lucro donde cada día
        es diferente, divertido y enriquecedor.
        Tu energía y tus ideas importan aquí.
      </motion.p>

      {/* CTA hero */}
      <motion.a
        href="#formulario-cv"
        className="tw-cta-btn"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
      >
        Ver ofertas ↓
      </motion.a>

    </section>
  );
}
```

---

## ☐ TAREA A.4 — CSS del hero

```css
/* ── HERO TRABAJA ────────────────────────────────────────── */
.hero-trabaja {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
}

.tw-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.2em;
  color: var(--color-tertiary);
  text-transform: uppercase;
}

.tw-title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 0.95;
}

.tw-title {
  font-family: var(--font-sans);
  font-size: var(--text-hero);
  font-weight: 800;
  display: block;
  letter-spacing: -0.03em;
}

.tw-title--main   { color: var(--color-label); }
.tw-title--accent { color: var(--color-ocean); }

.tw-title-accent-wrapper {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

/* La ola ocupa el ancho del texto */
.sine-underline {
  width: 100%;
  height: 16px;
  margin-top: -4px;
  max-width: 480px;   /* ajusta al tamaño del texto */
}

.tw-roles-wrapper {
  font-family: var(--font-sans);
  font-size: var(--text-title);
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  gap: 0.4em;
  height: 2.2rem;         /* altura fija para no hacer saltos */
  overflow: hidden;
}

.tw-roles-prefix {
  color: var(--color-tertiary);
  font-weight: 400;
}

.tw-role {
  font-weight: 600;
  color: var(--color-ocean);
  display: inline-block;
}

.tw-intro {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--color-secondary);
  max-width: 480px;
  line-height: 1.7;
  margin: 0;
}

.tw-cta-btn {
  display: inline-block;
  background: var(--color-ocean);
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--text-small);
  font-weight: 600;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  letter-spacing: 0.01em;
}
```

---

---

# ═══════════════════════════════════════════════
# BLOQUE B · MANTRA STRIPE
# ═══════════════════════════════════════════════

## ☐ TAREA B.1 — MantraStripe: reveal de texto por palabras

> **El efecto:** El texto largo se fragmenta en spans palabra a palabra.
> Al entrar en viewport, cada palabra aparece con stagger muy corto (0.03s).
> El efecto es que el texto "se materializa" en la pantalla.

**Archivo:** `src/sections/TrabajaConNosotras/components/MantraStripe.jsx`

```jsx
// MantraStripe.jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MANTRA =
  "Aquí no solo trabajarás, sino que vivirás la experiencia " +
  "de enseñar, aprender y disfrutar del entorno marino cada día.";

export default function MantraStripe() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const words = MANTRA.split(" ");

  return (
    <section ref={ref} className="mantra-stripe">
      <blockquote className="mantra-quote" aria-label={MANTRA}>

        {words.map((word, i) => (
          <motion.span
            key={i}
            className="mantra-word"
            initial={{ opacity: 0.1 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0.1 }}
            transition={{
              duration: 0.4,
              delay: i * 0.04,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {word}{" "}
          </motion.span>
        ))}

      </blockquote>
    </section>
  );
}
```

**CSS:**
```css
/* ── MANTRA STRIPE ───────────────────────────────────────── */
.mantra-stripe {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-snow);
  text-align: center;
}

.mantra-quote {
  max-width: 780px;
  margin: 0 auto;
  font-family: var(--font-sans);
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  font-weight: 500;
  line-height: 1.45;
  color: var(--color-label);
  letter-spacing: -0.01em;
  border: none;
  padding: 0;
}

.mantra-word {
  display: inline;
}
```

---

---

# ═══════════════════════════════════════════════
# BLOQUE C · BENEFICIOS — GRID APPLE
# ═══════════════════════════════════════════════

## ☐ TAREA C.1 — Datos

**Archivo:** `src/sections/TrabajaConNosotras/data/beneficios.js`

```js
// beneficios.js
export const BENEFICIOS = [
  {
    id: "mar",
    emoji: "🌊",
    headline: "La mar como oficina.",
    body:
      "Cada jornada empieza mirando el Abra de Getxo. " +
      "El entorno marino no es el telón de fondo — es el trabajo.",
    delay: 0.0,
  },
  {
    id: "material",
    emoji: "⛵",
    headline: "Material gratis para ti.",
    body:
      "Las personas del equipo tienen acceso libre a embarcaciones, " +
      "equipos y actividades de la escuela. Navega cuando quieras.",
    delay: 0.1,
  },
  {
    id: "equipo",
    emoji: "🤝",
    headline: "Equipo cercano y real.",
    body:
      "Ambiente de trabajo sin jerarquías rígidas. " +
      "La colaboración y la buena energía hacen que cada día sea distinto.",
    delay: 0.2,
  },
];
```

---

## ☐ TAREA C.2 — Componente Beneficios

**Archivo:** `src/sections/TrabajaConNosotras/components/Beneficios.jsx`

```jsx
// Beneficios.jsx
import { motion } from "framer-motion";
import { BENEFICIOS } from "../data/beneficios";

export default function Beneficios() {
  return (
    <section className="beneficios-section">

      <motion.p
        className="tw-section-eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        POR QUÉ UNIRTE
      </motion.p>

      <div className="beneficios-grid">
        {BENEFICIOS.map((item) => (
          <motion.article
            key={item.id}
            className="bene-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: item.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover="hover"
          >
            {/* Icono con micro-rebote al hover */}
            <motion.div
              className="bene-card__icon"
              variants={{
                hover: {
                  scale: 1.2,
                  rotate: [0, -8, 6, 0],
                  transition: { duration: 0.4, type: "spring", stiffness: 300 }
                }
              }}
            >
              {item.emoji}
            </motion.div>

            <h3 className="bene-card__headline">{item.headline}</h3>
            <p  className="bene-card__body">{item.body}</p>

            {/* Indicador de acento — aparece al hover */}
            <motion.div
              className="bene-card__indicator"
              initial={{ scaleX: 0, originX: 0 }}
              variants={{
                hover: { scaleX: 1,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }
              }}
            />
          </motion.article>
        ))}
      </div>

    </section>
  );
}
```

**CSS:**
```css
/* ── BENEFICIOS ──────────────────────────────────────────── */
.beneficios-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-white);
  text-align: center;
}

.tw-section-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.2em;
  color: var(--color-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-lg);
}

.beneficios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5px;             /* gap casi cero — Apple style */
  max-width: 960px;
  margin: 0 auto;
  background: var(--color-sep);  /* el gap en color sep parece línea */
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.bene-card {
  position: relative;
  background: var(--color-white);
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
  overflow: hidden;
  transition: background 0.2s ease;
}

.bene-card:hover { background: var(--color-mist); }

.bene-card__icon {
  font-size: 2.8rem;
  line-height: 1;
  display: inline-block;
}

.bene-card__headline {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-label);
  letter-spacing: -0.02em;
  margin: 0;
}

.bene-card__body {
  font-family: var(--font-sans);
  font-size: var(--text-small);
  color: var(--color-secondary);
  line-height: 1.65;
  margin: 0;
  max-width: 260px;
}

/* Barra de acento inferior */
.bene-card__indicator {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--color-ocean);
}
```

---

---

# ═══════════════════════════════════════════════
# BLOQUE D · PERFILES — ACCORDION
# ═══════════════════════════════════════════════

## ☐ TAREA D.1 — Datos de perfiles

**Archivo:** `src/sections/TrabajaConNosotras/data/perfiles.js`

```js
// perfiles.js
export const PERFILES = [
  {
    id: "instructora",
    emoji: "⚓",
    title: "Instructora Titulada",
    description:
      "Buscamos personas con titulación náutica reconocida y " +
      "experiencia real en vela. Capaces de transmitir pasión y " +
      "técnica con calma y pedagogía.",
    requisitos: [
      "Titulación náutica válida",
      "Experiencia en vela",
      "Capacidad pedagógica",
    ],
    chips: ["Optimist", "Laser", "J80", "Windsurf"],
  },
  {
    id: "tecnica",
    emoji: "🔧",
    title: "Técnica de Mantenimiento",
    description:
      "Mantenimiento de embarcaciones, instalaciones y equipos " +
      "de la escuela. Trabajo presencial en Getxo, " +
      "con horario flexible y ambiente inmejorable.",
    requisitos: [
      "Conocimientos técnicos náuticos",
      "Polivalencia y autonomía",
      "Trabajo en equipo",
    ],
    chips: ["Mantenimiento", "Reparación", "Logística"],
  },
  {
    id: "coordinadora",
    emoji: "📋",
    title: "Coordinadora de Tierra",
    description:
      "Organización de cursos, eventos y actividades de grupo. " +
      "Coordinación entre instructoras, alumnado y familias. " +
      "Comunicación y gestión administrativa.",
    requisitos: [
      "Habilidades organizativas",
      "Comunicación excelente",
      "Afinidad con el deporte",
    ],
    chips: ["Organización", "Comunicación", "Eventos", "Admin"],
  },
];
```

---

## ☐ TAREA D.2 — Componente Perfiles accordion

**Archivo:** `src/sections/TrabajaConNosotras/components/Perfiles.jsx`

> **El efecto:** Al hacer click en una fila, su contenido se expande
> con `useMeasure` o simplemente con `height: auto` controlado via
> `AnimatePresence` + variantes de altura.
> El icono `[+]` rota 45° convirtiéndose en `[×]`.

```jsx
// Perfiles.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERFILES } from "../data/perfiles";

// ── Una fila de perfil ────────────────────────────────────
function PerfilRow({ perfil, isOpen, onToggle }) {
  const { emoji, title, description, requisitos, chips } = perfil;

  return (
    <div className="perfil-row">

      {/* Cabecera clicable */}
      <button
        className="perfil-row__header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`perfil-${perfil.id}`}
      >
        <div className="perfil-row__left">
          <span className="perfil-row__emoji" aria-hidden="true">{emoji}</span>
          <span className="perfil-row__title">{title}</span>
        </div>

        {/* Icono +/× con rotación */}
        <motion.div
          className="perfil-row__toggle"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-hidden="true"
        >
          +
        </motion.div>
      </button>

      {/* Barra divisora */}
      <div className="perfil-row__sep" />

      {/* Contenido expandible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`perfil-${perfil.id}`}
            className="perfil-row__body"
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div className="perfil-row__body-inner">

              {/* Descripción */}
              <p className="perfil-row__desc">{description}</p>

              {/* Requisitos */}
              <ul className="perfil-row__reqs">
                {requisitos.map((r, i) => (
                  <motion.li
                    key={i}
                    className="perfil-row__req"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  >
                    <span className="perfil-row__req-check" aria-hidden="true">✓</span>
                    {r}
                  </motion.li>
                ))}
              </ul>

              {/* Chips de habilidades */}
              <div className="perfil-row__chips">
                {chips.map((chip, i) => (
                  <motion.span
                    key={chip}
                    className="perfil-chip"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, type: "spring", stiffness: 260 }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ── Contenedor con lógica "solo uno abierto" ──────────────
export default function Perfiles() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="perfiles-section">

      <motion.p
        className="tw-section-eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        PERFILES QUE BUSCAMOS
      </motion.p>

      <motion.h2
        className="perfiles__title"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        ¿Eres una de ellas?
      </motion.h2>

      <motion.div
        className="perfiles-list"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {PERFILES.map((perfil) => (
          <PerfilRow
            key={perfil.id}
            perfil={perfil}
            isOpen={openId === perfil.id}
            onToggle={() => toggle(perfil.id)}
          />
        ))}
      </motion.div>

    </section>
  );
}
```

**CSS del accordion:**
```css
/* ── PERFILES ─────────────────────────────────────────────── */
.perfiles-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-snow);
  text-align: center;
}

.perfiles__title {
  font-family: var(--font-sans);
  font-size: var(--text-display);
  font-weight: 700;
  color: var(--color-label);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-lg);
  line-height: 1.05;
}

.perfiles-list {
  max-width: 760px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.perfil-row { border-bottom: 1px solid var(--color-sep); }
.perfil-row:last-child { border-bottom: none; }

.perfil-row__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.perfil-row__header:hover { background: var(--color-mist); }

.perfil-row__left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.perfil-row__emoji {
  font-size: 1.6rem;
  line-height: 1;
}

.perfil-row__title {
  font-family: var(--font-sans);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-label);
  letter-spacing: -0.01em;
}

.perfil-row__toggle {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  color: var(--color-ocean);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.perfil-row__sep { display: none; }   /* ya tenemos el border-bottom de .perfil-row */

.perfil-row__body-inner {
  padding: 0 var(--space-md) var(--space-md);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.perfil-row__desc {
  font-family: var(--font-sans);
  font-size: var(--text-small);
  color: var(--color-secondary);
  line-height: 1.65;
  margin: 0;
}

.perfil-row__reqs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.perfil-row__req {
  font-family: var(--font-sans);
  font-size: var(--text-small);
  color: var(--color-label);
  display: flex;
  align-items: center;
  gap: 8px;
}

.perfil-row__req-check {
  color: var(--color-ocean);
  font-weight: 700;
  font-size: 0.8rem;
}

.perfil-row__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.perfil-chip {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-ocean);
  background: var(--color-foam);
  border-radius: var(--radius-pill);
  padding: 3px 10px;
  letter-spacing: 0.03em;
}
```

---

---

# ═══════════════════════════════════════════════════════
# BLOQUE E · FORMULARIO CV + DROP ZONE — LA ESTRELLA
# ═══════════════════════════════════════════════════════

## ☐ TAREA E.1 — Animación del barco (sub-componente)

> **Qué hace en los 3 estados:**
> - **IDLE**: Icono de nube/clip centrado, borde gris punteado
> - **DRAG OVER**: Borde se convierte en ola sinusoidal animada (CSS clip-path),
>   fondo toma un tinte azul muy suave, el icono cambia a 🌊
> - **DROPPED**: Un SVG barquito aparece en el borde izquierdo de la zona,
>   navega hasta el centro con `x: ["-40%", "0%"]` y una onda estela detrás,
>   luego se transforma (scale+rotate out) y aparece un sobre ✉️ con success.

**Archivo:** `src/sections/TrabajaConNosotras/components/BoatAnimation.jsx`

```jsx
// BoatAnimation.jsx
import { motion, AnimatePresence } from "framer-motion";

// ── El barquito SVG minimalista ───────────────────────────
function BoatSVG() {
  return (
    <svg width="52" height="36" viewBox="0 0 52 36" fill="none"
         aria-hidden="true">
      {/* Casco */}
      <path d="M4 22 Q26 30 48 22 L44 26 Q26 36 8 26 Z"
            fill="#0A3D5C" />
      {/* Mástil */}
      <line x1="26" y1="22" x2="26" y2="4"
            stroke="#0A3D5C" strokeWidth="1.5" />
      {/* Vela */}
      <path d="M26 6 Q38 12 34 22 Z"
            fill="#1A6FA8" opacity="0.85" />
      {/* Estela */}
      <motion.path
        d="M4 28 Q0 26 -8 28"
        stroke="#1A6FA8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.5}
        animate={{ opacity: [0.5, 0.2, 0.5], x: [0, -4, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ── Componente de animación completo ──────────────────────
export function BoatAnimation({ state }) {
  //  state: "idle" | "dragover" | "sailing" | "success"

  return (
    <div className="boat-anim-container" aria-hidden="true">

      {/* IDLE y DRAGOVER — icono central */}
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            className="boat-anim__idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <span style={{ fontSize: "2rem" }}>📎</span>
            <p className="boat-anim__idle-text">
              Arrastra tu CV aquí
              <span className="boat-anim__idle-sub">o haz click para buscar</span>
            </p>
          </motion.div>
        )}

        {state === "dragover" && (
          <motion.div
            key="dragover"
            className="boat-anim__dragover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              style={{ fontSize: "2.5rem", display: "block" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🌊
            </motion.span>
            <p className="boat-anim__idle-text">¡Suéltalo aquí!</p>
          </motion.div>
        )}

        {state === "sailing" && (
          <motion.div
            key="sailing"
            className="boat-anim__sailing"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {/* El barco navega de izquierda a derecha */}
            <motion.div
              className="boat-anim__boat-wrapper"
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <BoatSVG />
            </motion.div>
            <p className="boat-anim__idle-text" style={{ marginTop: "0.5rem" }}>
              Navegando tu candidatura…
            </p>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            className="boat-anim__success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <motion.span
              style={{ fontSize: "2.5rem", display: "block" }}
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ✉️
            </motion.span>
            <p className="boat-anim__success-text">CV adjuntado</p>
            <p className="boat-anim__success-filename" id="boat-filename" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
```

---

## ☐ TAREA E.2 — DropZone: zona de arrastrar y soltar

**Archivo:** `src/sections/TrabajaConNosotras/components/DropZone.jsx`

```jsx
// DropZone.jsx
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { BoatAnimation } from "./BoatAnimation";

// Solo acepta PDF o doc/docx
const ACCEPTED_TYPES = ["application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function DropZone({ onFileAccepted }) {
  const [zoneState, setZoneState] = useState("idle");
  // idle | dragover | sailing | success | error
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef  = useRef(null);

  // ── Validar y aceptar el fichero ──────────────────────
  const processFile = useCallback((file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg("Solo se aceptan archivos PDF o Word (.doc/.docx)");
      setZoneState("error");
      setTimeout(() => setZoneState("idle"), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {  // 5MB máx
      setErrorMsg("El archivo supera 5MB.");
      setZoneState("error");
      setTimeout(() => setZoneState("idle"), 3000);
      return;
    }

    // Animar barco
    setZoneState("sailing");
    setFileName(file.name);

    setTimeout(() => {
      setZoneState("success");
      // Actualiza el span del nombre en el DOM
      const el = document.getElementById("boat-filename");
      if (el) el.textContent = file.name;
      // Notifica al formulario padre
      onFileAccepted(file);
    }, 1100);  // tiempo que tarda el barco en navegar
  }, [onFileAccepted]);

  // ── Drag handlers ──────────────────────────────────────
  const onDragEnter  = (e) => { e.preventDefault(); setZoneState("dragover"); };
  const onDragLeave  = (e) => { e.preventDefault(); setZoneState("idle"); };
  const onDragOver   = (e) => { e.preventDefault(); };
  const onDrop       = (e) => {
    e.preventDefault();
    setZoneState("idle");
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  // ── Click en la zona ───────────────────────────────────
  const onClick = () => {
    if (zoneState === "success") return;
    inputRef.current?.click();
  };

  const onInputChange = (e) => processFile(e.target.files[0]);

  return (
    <div className="dropzone-wrapper">

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="dropzone__input"
        onChange={onInputChange}
        aria-label="Subir CV"
        tabIndex={-1}
      />

      {/* La zona visual */}
      <motion.div
        className={[
          "dropzone",
          `dropzone--${zoneState}`
        ].join(" ")}
        onClick={onClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Zona para arrastrar tu CV"
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        animate={zoneState === "dragover"
          ? { scale: 1.01, borderColor: "#1A6FA8" }
          : { scale: 1, borderColor: zoneState === "success"
              ? "#34C759" : zoneState === "error"
              ? "#FF3B30" : "#AEAEB2"
            }
        }
        transition={{ duration: 0.2 }}
      >
        <BoatAnimation state={zoneState} />
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {zoneState === "error" && (
          <motion.p
            className="dropzone__error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Opción "Buscar" debajo de la zona */}
      {zoneState !== "success" && (
        <button
          type="button"
          className="dropzone__browse-btn"
          onClick={onClick}
        >
          o haz click para buscar archivo
        </button>
      )}

      {/* Nota de formatos */}
      <p className="dropzone__hint">PDF o Word · Máx. 5MB</p>

    </div>
  );
}
```

---

## ☐ TAREA E.3 — FormularioCV: el formulario completo

**Archivo:** `src/sections/TrabajaConNosotras/components/FormularioCV.jsx`

> **Microinteracciones en los campos:** Cada input tiene un label que flota
> arriba al hacer focus (label flotante estilo Material pero en blanco Apple).
> La barra inferior del campo va de gris a `--ocean` con una transición.

```jsx
// FormularioCV.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropZone from "./DropZone";

// ── Input con label flotante ──────────────────────────────
function FloatInput({ id, label, type = "text", value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isRaised = focused || hasValue;

  return (
    <div className="float-field">
      <motion.label
        htmlFor={id}
        className="float-field__label"
        animate={isRaised
          ? { y: -20, scale: 0.82, color: "#1A6FA8" }
          : { y: 0,   scale: 1,    color: "#AEAEB2" }
        }
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {label}
      </motion.label>
      <input
        id={id}
        type={type}
        className="float-field__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        aria-label={label}
      />
      {/* Barra de foco animada */}
      <motion.div
        className="float-field__bar"
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
}

// ── Textarea con label flotante ───────────────────────────
function FloatTextarea({ id, label, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const isRaised = focused || value.length > 0;

  return (
    <div className="float-field float-field--textarea">
      <motion.label
        htmlFor={id}
        className="float-field__label"
        animate={isRaised
          ? { y: -20, scale: 0.82, color: "#1A6FA8" }
          : { y: 0,   scale: 1,    color: "#AEAEB2" }
        }
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <textarea
        id={id}
        className="float-field__input float-field__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        aria-label={label}
      />
      <motion.div
        className="float-field__bar"
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
}

// ── Formulario principal ──────────────────────────────────
export default function FormularioCV() {
  const [nombre,  setNombre]  = useState("");
  const [email,   setEmail]   = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cvFile,  setCvFile]  = useState(null);
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) { alert("Por favor adjunta tu CV."); return; }
    setSending(true);

    // ── Aquí conectas tu backend / servicio de email ─────
    // Opción A: FormData a tu propio endpoint
    // const data = new FormData();
    // data.append("nombre", nombre);
    // data.append("email", email);
    // data.append("mensaje", mensaje);
    // data.append("cv", cvFile);
    // await fetch("/api/candidatura", { method: "POST", body: data });

    // Opción B: EmailJS (no necesita backend)
    // Ver: https://www.emailjs.com/docs/user-guide/attaching-files/
    // ────────────────────────────────────────────────────

    // Simulación de envío (eliminar en producción)
    await new Promise((r) => setTimeout(r, 1200));

    setSending(false);
    setSent(true);
  };

  return (
    <section id="formulario-cv" className="form-section">

      <motion.p
        className="tw-section-eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        ENVÍA TU CANDIDATURA
      </motion.p>

      <motion.h2
        className="form-section__title"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Cuéntanos quién eres.
      </motion.h2>

      <AnimatePresence mode="wait">

        {!sent ? (
          /* ── Formulario ─────────────────────────────── */
          <motion.form
            ref={formRef}
            key="form"
            className="cv-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            noValidate
          >

            {/* Fila nombre + email */}
            <div className="cv-form__row">
              <FloatInput
                id="nombre"
                label="Nombre completo"
                value={nombre}
                onChange={setNombre}
                required
              />
              <FloatInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
            </div>

            {/* Mensaje / experiencia */}
            <FloatTextarea
              id="mensaje"
              label="Tu experiencia en navegación y qué buscas"
              value={mensaje}
              onChange={setMensaje}
            />

            {/* ZONA DROP */}
            <div className="cv-form__drop-label">
              <span className="cv-form__drop-label-text">Adjunta tu CV</span>
              <span className="cv-form__drop-required">*obligatorio</span>
            </div>
            <DropZone onFileAccepted={(file) => setCvFile(file)} />

            {/* Botón de envío */}
            <motion.button
              type="submit"
              className="cv-form__submit"
              disabled={sending || !cvFile}
              whileHover={!sending && cvFile
                ? { scale: 1.02, transition: { duration: 0.15 } }
                : {}
              }
              whileTap={!sending && cvFile ? { scale: 0.97 } : {}}
            >
              {sending ? (
                /* Spinner minimalista */
                <motion.span
                  className="cv-form__spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Enviar candidatura →"
              )}
            </motion.button>

            <p className="cv-form__privacy">
              Tus datos se usan exclusivamente para valorar tu candidatura.
            </p>

          </motion.form>
        ) : (
          /* ── Estado enviado ─────────────────────────── */
          <motion.div
            key="success"
            className="cv-form__sent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <motion.span
              className="cv-form__sent-icon"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ⛵
            </motion.span>
            <h3 className="cv-form__sent-title">¡Candidatura enviada!</h3>
            <p className="cv-form__sent-body">
              Hemos recibido tu CV y nos pondremos en contacto contigo
              lo antes posible. ¡Mucho ánimo y buen viento!
            </p>
          </motion.div>
        )}

      </AnimatePresence>

    </section>
  );
}
```

---

## ☐ TAREA E.4 — CSS del formulario y dropzone

```css
/* ── FORM SECTION ─────────────────────────────────────────── */
.form-section {
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-white);
  text-align: center;
}

.form-section__title {
  font-family: var(--font-sans);
  font-size: var(--text-display);
  font-weight: 700;
  color: var(--color-label);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-lg);
}

/* ── CV FORM ──────────────────────────────────────────────── */
.cv-form {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  text-align: left;
}

.cv-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

@media (max-width: 600px) {
  .cv-form__row { grid-template-columns: 1fr; }
}

/* ── FLOAT FIELD ──────────────────────────────────────────── */
.float-field {
  position: relative;
  padding-top: 1.5rem;         /* espacio para el label flotante */
}

.float-field__label {
  position: absolute;
  top: 1.75rem;
  left: 0;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--color-tertiary);
  pointer-events: none;
  transform-origin: left center;
  display: block;
}

.float-field__input {
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--color-label);
  background: transparent;
  border: none;
  border-bottom: 1.5px solid var(--color-sep);
  padding: 0.4rem 0 0.5rem;
  outline: none;
  transition: border-color 0.2s ease;
  display: block;
  box-sizing: border-box;
}

.float-field__input:focus { border-color: var(--color-ocean); }

/* Barra de foco animada (sobre la línea base) */
.float-field__bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--color-ocean);
}

.float-field--textarea .float-field__input {
  resize: vertical;
  min-height: 100px;
  border: 1.5px solid var(--color-sep);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  border-bottom: 1.5px solid var(--color-sep);
}

.float-field--textarea .float-field__bar {
  height: 2px;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.float-field--textarea .float-field__label {
  top: 2.2rem;
  left: 0.75rem;
}

/* ── DROP ZONE ────────────────────────────────────────────── */
.cv-form__drop-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.cv-form__drop-label-text {
  font-family: var(--font-sans);
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--color-label);
}

.cv-form__drop-required {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-ocean);
}

.dropzone-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.dropzone {
  width: 100%;
  min-height: 160px;
  border: 1.5px dashed var(--color-tertiary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--color-mist);
  overflow: hidden;
  transition: background 0.2s ease;
}

.dropzone:hover, .dropzone--dragover {
  background: var(--color-foam);
}

.dropzone--success {
  border-style: solid;
  border-color: var(--color-success);
  background: rgba(52, 199, 89, 0.04);
}

.dropzone--error {
  border-color: var(--color-error);
  background: rgba(255, 59, 48, 0.04);
}

/* Input de archivo — OCULTO */
.dropzone__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
}

/* ── Contenido interno de la zona ─────────────────────── */
.boat-anim-container {
  width: 100%;
  padding: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.boat-anim__idle,
.boat-anim__dragover,
.boat-anim__sailing,
.boat-anim__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.boat-anim__idle-text {
  font-family: var(--font-sans);
  font-size: var(--text-small);
  color: var(--color-secondary);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.boat-anim__idle-sub {
  font-size: 0.75rem;
  color: var(--color-tertiary);
}

.boat-anim__boat-wrapper {
  display: inline-block;
}

.boat-anim__success-text {
  font-family: var(--font-sans);
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--color-success);
  margin: 0;
}

.boat-anim__success-filename {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-secondary);
  margin: 0;
}

/* ── Botón browse ─────────────────────────────────────── */
.dropzone__browse-btn {
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--color-wave);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 0;
}

.dropzone__hint {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-tertiary);
  margin: 0;
  letter-spacing: 0.05em;
}

.dropzone__error {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: var(--color-error);
  margin: 0;
}

/* ── Submit ────────────────────────────────────────────── */
.cv-form__submit {
  align-self: center;
  background: var(--color-ocean);
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 600;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  min-width: 220px;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.cv-form__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.cv-form__spinner {
  display: block;
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
}

.cv-form__privacy {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-tertiary);
  margin: 0;
  letter-spacing: 0.04em;
}

/* ── Estado enviado ────────────────────────────────────── */
.cv-form__sent {
  max-width: 480px;
  margin: 0 auto;
  padding: var(--space-lg) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-align: center;
}

.cv-form__sent-icon { font-size: 3.5rem; }

.cv-form__sent-title {
  font-family: var(--font-sans);
  font-size: var(--text-title);
  font-weight: 700;
  color: var(--color-label);
  margin: 0;
}

.cv-form__sent-body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--color-secondary);
  line-height: 1.65;
  margin: 0;
}
```

---

---

# ═══════════════════════════════════════════════
# BLOQUE F · CTA CIERRE — FRANJA OCEAN
# ═══════════════════════════════════════════════

## ☐ TAREA F.1 — CTACierre

**Archivo:** `src/sections/TrabajaConNosotras/components/CTACierre.jsx`

```jsx
// CTACierre.jsx
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const PHRASE_PARTS = [
  "Si quieres trabajar en un lugar donde",
  "cada día es diferente, divertido",
  "y enriquecedor…",
  "únete a nosotras.",
];

export default function CTACierre() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  // Línea decorativa que crece al scrollear
  const lineWidth = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

  return (
    <section ref={ref} className="cta-cierre">

      {/* Línea decorativa de scroll */}
      <motion.div
        className="cta-cierre__line"
        style={{ width: lineWidth }}
        aria-hidden="true"
      />

      {/* Frase línea a línea */}
      <div className="cta-cierre__phrase-block">
        {PHRASE_PARTS.map((line, i) => (
          <motion.p
            key={i}
            className={`cta-cierre__phrase ${i === PHRASE_PARTS.length - 1 ? "cta-cierre__phrase--bold" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.1 + i * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Botón de contacto */}
      <motion.a
        href="#formulario-cv"
        className="cta-cierre__btn"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.04, backgroundColor: "#fff",
          color: "#0A3D5C", transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
      >
        Contactar →
      </motion.a>

    </section>
  );
}
```

**CSS:**
```css
/* ── CTA CIERRE ───────────────────────────────────────────── */
.cta-cierre {
  position: relative;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-ocean);
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.cta-cierre__line {
  position: absolute;
  top: 0; left: 0;
  height: 3px;
  background: rgba(255,255,255,0.25);
}

.cta-cierre__phrase-block {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.cta-cierre__phrase {
  font-family: var(--font-sans);
  font-size: clamp(1.4rem, 4vw, 2.6rem);
  font-weight: 400;
  color: rgba(255,255,255,0.75);
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin: 0;
}

.cta-cierre__phrase--bold {
  font-weight: 800;
  color: #fff;
  font-size: clamp(1.8rem, 5vw, 3.2rem);
}

.cta-cierre__btn {
  display: inline-block;
  background: transparent;
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 600;
  padding: 1rem 2.5rem;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: var(--radius-pill);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
```

---

---

# ═══════════════════════════════════════════════
# ENSAMBLAJE FINAL
# ═══════════════════════════════════════════════

## ☐ TAREA Z.1 — index.jsx

**Archivo:** `src/sections/TrabajaConNosotras/index.jsx`

```jsx
// index.jsx — sección completa
import HeroTrabaja    from "./components/HeroTrabaja";
import MantraStripe   from "./components/MantraStripe";
import Beneficios     from "./components/Beneficios";
import Perfiles       from "./components/Perfiles";
import FormularioCV   from "./components/FormularioCV";
import CTACierre      from "./components/CTACierre";
import "./TrabajaConNosotras.module.css";

export default function TrabajaConNosotras() {
  return (
    <div id="trabaja-con-nosotras" className="tcn-root">
      <HeroTrabaja />
      <MantraStripe />
      <Beneficios />
      <Perfiles />
      <FormularioCV />
      <CTACierre />
    </div>
  );
}
```

```css
/* TrabajaConNosotras.module.css */
.tcn-root {
  background: var(--color-white);
  color: var(--color-label);
}
```

---

## ☐ TAREA Z.2 — Fuentes al `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
```

---

## ☐ TAREA Z.3 — Variables CSS globales a añadir a `:root`

```css
:root {
  --color-white:     #FFFFFF;
  --color-snow:      #F5F5F7;
  --color-mist:      #FAFAFA;
  --color-label:     #1D1D1F;
  --color-secondary: #6E6E73;
  --color-tertiary:  #AEAEB2;
  --color-sep:       rgba(0,0,0,0.08);
  --color-ocean:     #0A3D5C;
  --color-wave:      #1A6FA8;
  --color-foam:      #E8F4FC;
  --color-success:   #34C759;
  --color-error:     #FF3B30;
  --font-sans:       'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono:       'JetBrains Mono', 'DM Mono', monospace;
  --shadow-card:     0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-hover:    0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
  --radius-sm:       8px;
  --radius-md:       16px;
  --radius-lg:       24px;
  --radius-pill:     100px;
}
```

---

## ☐ TAREA Z.4 — Responsive global

```css
@media (max-width: 768px) {
  .hero-trabaja        { padding: var(--space-lg) var(--space-md); }
  .mantra-stripe       { padding: var(--space-lg) var(--space-md); }
  .beneficios-section  { padding: var(--space-lg) var(--space-md); }
  .perfiles-section    { padding: var(--space-lg) var(--space-md); }
  .form-section        { padding: var(--space-lg) var(--space-md); }
  .cta-cierre          { padding: var(--space-lg) var(--space-md); }
  .beneficios-grid     { grid-template-columns: 1fr; gap: 1px; }
  .cv-form__row        { grid-template-columns: 1fr; }
  .tw-title            { letter-spacing: -0.04em; }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

```
SETUP
[ ] 0a. npm install framer-motion
[ ] 0b. Variables CSS a :root
[ ] 0c. Fuentes al <head>
[ ] 0d. Crear carpeta src/sections/TrabajaConNosotras/

BLOQUE A — HERO
[ ] A.1  SineWaveUnderline.jsx  — ola SVG bajo "nosotras"
[ ] A.2  HeroTrabaja.jsx        — con ciclo de roles AnimatePresence

BLOQUE B — MANTRA
[ ] B.1  MantraStripe.jsx       — reveal de palabras en scroll

BLOQUE C — BENEFICIOS
[ ] C.1  beneficios.js          — datos de 3 beneficios
[ ] C.2  Beneficios.jsx         — grid Apple con hover-lift

BLOQUE D — PERFILES
[ ] D.1  perfiles.js            — datos de 3 perfiles
[ ] D.2  Perfiles.jsx           — accordion solo-uno-abierto

BLOQUE E — FORMULARIO (el más complejo — hazlo en sub-partes)
[ ] E.1  BoatAnimation.jsx      — 4 estados: idle/dragover/sailing/success
[ ] E.2  DropZone.jsx           — drag&drop con validación de tipo y tamaño
[ ] E.3  FormularioCV.jsx       — campos flotantes + DropZone + submit
[ ] E.4  CSS formulario         — float-field + dropzone + submit

BLOQUE F — CTA
[ ] F.1  CTACierre.jsx          — franja ocean con línea scroll

ENSAMBLAJE
[ ] Z.1  index.jsx
[ ] Z.2  Fuentes en <head>
[ ] Z.3  Variables CSS en :root
[ ] Z.4  Responsive + reduced-motion
[ ] Z.5  Cambiar href del botón "Contactar" al email real
[ ] Z.6  Conectar handleSubmit con backend o EmailJS real
[ ] Z.7  Verificar que accept=".pdf,.doc,.docx" funciona en mobile
```

---

## 🎬 MAPA COMPLETO DE ANIMACIONES

```
BLOQUE A ─ HERO (blanco puro)
  Eyebrow          →  fade + slide desde arriba (0.0s)
  "Trabaja con"    →  fade + slide desde abajo (0.1s delay)
  "nosotras."      →  fade + slide desde abajo (0.22s delay)
  Ola SVG          →  pathLength 0→1 + 2ª pasada shimmer continuo
  Roles            →  AnimatePresence: blur-fade-up/out (cada 2.8s)
  Párrafo intro    →  fade + slide (0.45s delay)
  CTA hero         →  fade + slide (0.6s delay)
  Botón hover      →  scale 1.03

BLOQUE B ─ MANTRA
  Cada palabra     →  opacity 0.1→1 en stagger 0.04s por palabra

BLOQUE C ─ BENEFICIOS
  Tarjetas 1,2,3   →  stagger fade+slide-up al viewport
  Icono hover      →  spring bounce + rotate pequeño
  Barra inferior   →  scaleX 0→1 al hover (origin: left)
  Fondo tarjeta    →  transition blanco→mist al hover

BLOQUE D ─ PERFILES
  Lista completa   →  fade+slide-up al viewport
  Icono +/×        →  rotate 0°→45° al abrir
  Contenido        →  AnimatePresence height 0→auto
  Requisitos       →  stagger slide-right al aparecer
  Chips            →  spring scale 0→1 con stagger

BLOQUE E ─ FORMULARIO (el corazón del WOW)
  Labels inputs    →  Framer animate: sube+escala+cambia color al focus
  Barra de foco    →  scaleX 0→1 al focus (origen: izquierda)
  Drop zone        →  motion.div: scale+borderColor al dragover
  Estado dragover  →  emoji 🌊 bounce infinito
  Estado sailing   →  BoatSVG: x de "-60%"→"0%" + opacity (0.9s)
  Estela del barco →  opacity + x oscillation loop
  Estado success   →  scale spring 0.7→1 + emoji rotate
  Botón submit     →  scale hover 1.02 + disabled:opacity 0.45
  Spinner envío    →  rotate 360 loop (0.8s)
  Estado enviado   →  scale spring 0.9→1 + emoji wiggle

BLOQUE F ─ CTA CIERRE
  Línea superior   →  width 0→100% ligado al scroll (useTransform)
  Frases 1-4       →  stagger fade+slide-up (0.12s entre líneas)
  "únete a nosotras" → peso 800, blanco puro (destaca sin animación extra)
  Botón hover      →  fondo blanco, texto ocean, border solid (0.15s)
```

---

## 📋 NOTAS TÉCNICAS PARA EL BACKEND DEL FORMULARIO

```
OPCIÓN A — Sin backend (recomendada para empezar):
  → EmailJS: https://www.emailjs.com
  → Permite enviar archivos adjuntos de hasta 50MB en plan gratuito
  → Instrucciones: https://www.emailjs.com/docs/user-guide/attaching-files/
  → Solo necesitas una cuenta de EmailJS y añadir 3 variables de entorno

OPCIÓN B — Con backend propio (Next.js/Remix):
  → Crear ruta POST /api/candidatura
  → Usar multipart/form-data con busboy o formidable
  → Enviar email con nodemailer + adjunto

OPCIÓN C — Servicio externo (formulario hospedado):
  → Tally.so admite uploads de archivos en plan gratuito
  → Puedes incrustar el tally con CSS personalizado
```

---

*Plan generado para getxobelaeskola.cloud · Sección Empleo · Junio 2026*
*Tema: blanco Apple · Magia: ⛵⛵⛵⛵⛵ · Barquito: garantizado*
