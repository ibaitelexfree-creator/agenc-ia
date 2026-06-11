# 🌊 PLAN DE IMPLEMENTACIÓN — BLOG DE APRENDIZAJE
## getxobelaeskola.cloud · Sección `/blog`
**Estilo:** Apple Clean × Bonka Magic · **Animaciones:** Framer Motion · **Tema:** Blanco puro

---

> **INSTRUCCIONES PARA LA IA QUE IMPLEMENTA:**
> Lee este documento completo antes de tocar una sola línea de código.
> Cada fase es independiente y autónoma. Sigue el orden exacto.
> Cuando veas `[COPY OFICIAL]` → usa ese texto tal cual, sin modificar.
> Cuando veas `[ATOMIC]` → es una tarea de exactamente 1 sola cosa.

---

## 📐 SISTEMA DE DISEÑO BASE (Lee esto primero)

```
PALETA DE COLOR — CÓPIALA EXACTA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  --color-white:     #FFFFFF   ← fondo principal
  --color-snow:      #F8F9FB   ← fondo de secciones alternas
  --color-fog:       #F0F2F5   ← fondo de cards
  --color-mist:      #E4E8EE   ← bordes, líneas
  --color-steel:     #8A96A3   ← texto secundario
  --color-ink:       #1A1F2E   ← texto principal (NUNCA negro puro)
  --color-ocean:     #1B4F8A   ← azul marina (acento principal)
  --color-wave:      #2E7DD1   ← azul claro (hover, gradientes)
  --color-spray:     #E8F3FF   ← azul muy claro (badges, chips)
  --color-gold:      #D4A843   ← dorado náutico (acento especial, usar con moderación)

TIPOGRAFÍA:
━━━━━━━━━━━━
  Display:  "Playfair Display" → Títulos hero, H1
  Body:     "Inter"            → Todo lo demás
  Mono:     "JetBrains Mono"  → Datos técnicos, nudos, coordenadas

  Escala de tamaños:
  --text-xs:    0.75rem   (12px)
  --text-sm:    0.875rem  (14px)
  --text-base:  1rem      (16px)
  --text-lg:    1.125rem  (18px)
  --text-xl:    1.25rem   (20px)
  --text-2xl:   1.5rem    (24px)
  --text-3xl:   1.875rem  (30px)
  --text-4xl:   2.25rem   (36px)
  --text-5xl:   3rem      (48px)
  --text-hero:  4.5rem    (72px)

ESPACIADO (sistema de 8px):
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  --space-1:   8px
  --space-2:   16px
  --space-3:   24px
  --space-4:   32px
  --space-5:   40px
  --space-6:   48px
  --space-8:   64px
  --space-10:  80px
  --space-12:  96px
  --space-16:  128px

BORDES:
━━━━━━━
  --radius-sm:  8px
  --radius-md:  16px
  --radius-lg:  24px
  --radius-xl:  32px
  --radius-full: 9999px

SOMBRAS (tipo Apple):
━━━━━━━━━━━━━━━━━━━━
  --shadow-xs:  0 1px 2px rgba(26,31,46,0.05)
  --shadow-sm:  0 2px 8px rgba(26,31,46,0.08)
  --shadow-md:  0 8px 24px rgba(26,31,46,0.10)
  --shadow-lg:  0 20px 60px rgba(26,31,46,0.12)
  --shadow-xl:  0 40px 80px rgba(26,31,46,0.15)
```

---

## 🗂️ ESTRUCTURA GENERAL DE LA PÁGINA

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    FASE 1: HERO SECTION                     │
│              (fullscreen, animación de entrada)             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              FASE 2: CATEGORÍAS (filtros)                   │
│           [ ⚓ Todo ] [ 🌤 Meteo ] [ ⚙️ Técnica ]           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         FASE 3: ARTÍCULO DESTACADO (hero card)              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              FASE 4: GRID DE ARTÍCULOS                      │
│         [ card ] [ card ] [ card ]                          │
│         [ card ] [ card ] [ card ]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│          FASE 5: SECCIÓN VISUAL — EL MAR EN DATOS           │
│              (estadísticas animadas, estilo Bonka)          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           FASE 6: NEWSLETTER + CTA FINAL                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 1 · HERO SECTION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 Layout del Hero

```
┌──────────────────────────────────────────────────────────────┐
│  background: #FFFFFF                                         │
│                                                              │
│     ┌─────────────────────────────────────────────────┐     │
│     │  [etiqueta pequeña]  APRENDIZAJE                │     │
│     │                                                  │     │
│     │  Aprende a                                       │     │
│     │  navegar.                  ┌──────────────────┐ │     │
│     │  De verdad.                │                  │ │     │
│     │                            │   ILUSTRACIÓN    │ │     │
│     │  [párrafo corto]           │   SVG VELERO     │ │     │
│     │                            │   animado        │ │     │
│     │  [→ Explorar el blog]      │                  │ │     │
│     │                            └──────────────────┘ │     │
│     └─────────────────────────────────────────────────┘     │
│                                                              │
│  · · · · · · · · · · · · · · · · (scroll indicator)         │
└──────────────────────────────────────────────────────────────┘
```

## ✍️ COPY OFICIAL DEL HERO

```
ETIQUETA (eyebrow):     "Aprendizaje"
TÍTULO H1 LÍNEA 1:      "Aprende a navegar."
TÍTULO H1 LÍNEA 2:      "De verdad."
SUBTÍTULO:              "Descubre en nuestro blog consejos y experiencias
                         para aprender de vela y náutica. Historias, trucos
                         y recursos técnicos para mejorar tus habilidades,
                         desde principiantes hasta avanzados."
CTA BOTÓN:              "Explorar el blog  →"
```

## ⚙️ ESPECIFICACIONES CSS DEL HERO

```css
/* [ATOMIC] Paso 1.1 — Crea este componente: HeroSection.tsx */

.hero {
  min-height: 100svh;            /* ocupa toda la pantalla */
  background: #FFFFFF;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 var(--space-8);
  max-width: 1440px;
  margin: 0 auto;
  gap: var(--space-8);
}

.hero__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ocean);
  margin-bottom: var(--space-2);
}

.hero__title {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-hero);   /* 72px */
  font-weight: 700;
  line-height: 1.05;
  color: var(--color-ink);
  margin-bottom: var(--space-3);
}

/* La palabra "De verdad." en cursiva: */
.hero__title em {
  font-style: italic;
  color: var(--color-ocean);
}

.hero__subtitle {
  font-family: 'Inter', sans-serif;
  font-size: var(--text-xl);
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-steel);
  max-width: 480px;
  margin-bottom: var(--space-5);
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-ink);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: var(--text-base);
  font-weight: 500;
  padding: 16px 32px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero__cta:hover {
  background: var(--color-ocean);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## 🎬 ANIMACIONES FRAMER MOTION DEL HERO

```tsx
/* [ATOMIC] Paso 1.2 — Copia este bloque EXACTO en HeroSection.tsx */

import { motion } from 'framer-motion'

// Variantes para el texto del hero
const heroTextVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1], // ease-out-expo
    }
  }
}

// Stagger container — hace que cada hijo aparezca con retraso
const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,  // 120ms entre cada elemento
      delayChildren: 0.3,     // empieza 300ms después del mount
    }
  }
}

// Uso en JSX:
<motion.div
  variants={heroContainerVariants}
  initial="hidden"
  animate="visible"
  className="hero__text"
>
  <motion.span variants={heroTextVariants} className="hero__eyebrow">
    Aprendizaje
  </motion.span>

  <motion.h1 variants={heroTextVariants} className="hero__title">
    Aprende a navegar.<br />
    <em>De verdad.</em>
  </motion.h1>

  <motion.p variants={heroTextVariants} className="hero__subtitle">
    Descubre en nuestro blog consejos y experiencias para aprender de
    vela y náutica. Historias, trucos y recursos técnicos para mejorar
    tus habilidades, desde principiantes hasta avanzados.
  </motion.p>

  <motion.button
    variants={heroTextVariants}
    className="hero__cta"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    Explorar el blog →
  </motion.button>
</motion.div>
```

## 🖼️ ILUSTRACIÓN SVG DEL HERO — VELERO MINIMALISTA

```tsx
/* [ATOMIC] Paso 1.3 — Crea el archivo: SailingIllustration.tsx */
/* Este SVG es inline para que Framer Motion pueda animar sus partes */

// El velero tiene 3 elementos que se mueven independientemente:
// 1. El casco → oscila suavemente (rotación ±3°)
// 2. La vela mayor → flota verticalmente (±8px)
// 3. El mar de fondo → ondas animadas con CSS

const sailVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const waveVariants = {
  animate: {
    d: [
      "M0,60 Q150,40 300,60 Q450,80 600,60",
      "M0,60 Q150,80 300,60 Q450,40 600,60",
      "M0,60 Q150,40 300,60 Q450,80 600,60",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ESTRUCTURA SVG (dimensiones: 600×500):
// - Fondo: gradiente azul muy claro a blanco
// - Mar: path animado con 3 keyframes
// - Casco: rectángulo redondeado #1B4F8A
// - Mástil: línea vertical blanca
// - Vela mayor: triángulo blanco con sombra
// - Vela proa: triángulo más pequeño

/* COLORES DEL SVG:
   Cielo:          gradiente de #E8F3FF → #FFFFFF
   Mar:            #1B4F8A con 0.15 opacity
   Casco:          #1A1F2E
   Velas:          #FFFFFF con stroke #E4E8EE
   Línea horizonte: #E4E8EE, 1px
*/
```

## 🌊 SCROLL INDICATOR (parte inferior del hero)

```tsx
/* [ATOMIC] Paso 1.4 — Componente ScrollIndicator */

const ScrollIndicator = () => (
  <motion.div
    style={{
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    }}
    animate={{ opacity: [1, 0.3, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#8A96A3' }}>
      SCROLL
    </span>
    {/* Línea vertical animada */}
    <motion.div
      style={{ width: '1px', height: '40px', background: '#1B4F8A' }}
      animate={{ scaleY: [0, 1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 2 · FILTROS DE CATEGORÍA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 Layout de Categorías

```
┌──────────────────────────────────────────────────────────────┐
│  background: #FFFFFF  (sticky al scroll, con blur)           │
│                                                              │
│    [ ⚓ Todo ] [ 🌤 Meteorología ] [ ⚙️ Técnica ]            │
│    [ 🪢 Nudos ] [ 🔰 Principiantes ] [ 🏆 Avanzados ]        │
│                                                              │
│    ────────────────────────────────────── (línea hr)         │
└──────────────────────────────────────────────────────────────┘

El botón activo tiene:
- background: var(--color-ink)
- color: #FFFFFF
- border-radius: var(--radius-full)

El botón inactivo tiene:
- background: var(--color-fog)
- color: var(--color-steel)
- Al hover: background: var(--color-mist)
```

## ⚙️ CÓDIGO DE CATEGORÍAS

```tsx
/* [ATOMIC] Paso 2.1 — Crea: CategoryFilter.tsx */

const CATEGORIES = [
  { id: 'all',           emoji: '⚓', label: 'Todo'           },
  { id: 'meteorologia',  emoji: '🌤', label: 'Meteorología'   },
  { id: 'tecnica',       emoji: '⚙️', label: 'Técnica'        },
  { id: 'nudos',         emoji: '🪢', label: 'Nudos'          },
  { id: 'principiantes', emoji: '🔰', label: 'Principiantes'  },
  { id: 'avanzados',     emoji: '🏆', label: 'Avanzados'      },
]

/* El componente debe:
   1. Mantener estado local: activeCategory (string)
   2. Al cambiar categoría → animar la salida/entrada del grid con:
      layoutId="blog-grid" y AnimatePresence
   3. Sticky al scroll con backdrop-blur: blur(20px)
   4. El botón activo tiene una animación layoutId="active-pill"
      → esto hace que la pastilla deslice entre botones (magia Framer)
*/

// Animación "pastilla deslizante" (ESTO ES LO MÁS MÁGICO):
// En el botón activo, pon DENTRO un:
<motion.div
  layoutId="active-pill"               // ← CLAVE. Mismo ID en todos.
  style={{
    position: 'absolute',
    inset: 0,
    background: '#1A1F2E',
    borderRadius: '9999px',
    zIndex: 0
  }}
  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
/>
// El texto del botón va por encima con position: relative, zIndex: 1
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 3 · ARTÍCULO DESTACADO (HERO CARD)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 Layout del Artículo Destacado

```
┌──────────────────────────────────────────────────────────────┐
│  background: var(--color-ink)  [OSCURO — contraste máximo]   │
│  border-radius: var(--radius-xl)                             │
│  padding: 64px                                               │
│                                                              │
│  ┌──────────────────────────────┐  ┌────────────────────┐   │
│  │                              │  │                    │   │
│  │  [badge] DESTACADO           │  │   IMAGEN/ILUSTR.   │   │
│  │                              │  │   del artículo     │   │
│  │  ═══════════════════════     │  │   con overlay      │   │
│  │  Cómo leer Windguru          │  │                    │   │
│  │  sin morir en el intento     │  └────────────────────┘   │
│  │  ═══════════════════════     │                            │
│  │                              │                            │
│  │  [texto preview...]          │                            │
│  │                              │                            │
│  │  [→ Leer artículo]           │                            │
│  │                              │                            │
│  │  ⏱ 5 min  · 🌤 Meteorología │                            │
│  └──────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────┘
```

## ⚙️ ESPECIFICACIONES DE LA HERO CARD

```css
/* [ATOMIC] Paso 3.1 — Estilos de la FeaturedCard */

.featured-card {
  background: var(--color-ink);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-6);
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Efecto de luz en la card al hover (MUY BONITO) */
.featured-card::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(46,125,209,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  /* La posición se actualiza con JS en mousemove */
  transform: translate(var(--mouse-x, 50%), var(--mouse-y, 50%));
  transition: transform 0.1s;
}

.featured-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(212,168,67,0.2);  /* gold semi-transparente */
  color: var(--color-gold);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(212,168,67,0.3);
  margin-bottom: var(--space-3);
}

.featured-card__title {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-4xl);        /* 36px */
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.15;
  margin-bottom: var(--space-3);
}

.featured-card__excerpt {
  font-size: var(--text-base);
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
  margin-bottom: var(--space-5);
}
```

## 🎬 ANIMACIÓN FRAMER MOTION DE LA FEATURED CARD

```tsx
/* [ATOMIC] Paso 3.2 — Animaciones de la FeaturedCard */

// 1. ENTRADA CON SCROLL (useInView):
<motion.div
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  className="featured-card"
>

// 2. HOVER (la card se levanta):
<motion.div
  whileHover={{
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }}
  className="featured-card"
>

// 3. IMAGEN INTERNA (zoom suave al hover):
// Envuelve la imagen en:
<motion.div
  style={{ overflow: 'hidden', borderRadius: '16px' }}
  whileHover="hover"
>
  <motion.img
    variants={{ hover: { scale: 1.05 } }}
    transition={{ duration: 0.5 }}
  />
</motion.div>
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 4 · GRID DE ARTÍCULOS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 Layout del Grid

```
┌──────────────────────────────────────────────────────────────┐
│  background: var(--color-snow)                               │
│  padding: 96px 64px                                          │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │                │  │                │  │                │ │
│  │ [🌤 METEO]     │  │ [⚙️ TÉCNICA]   │  │ [🪢 NUDOS]    │ │
│  │                │  │                │  │                │ │
│  │ Cómo interpretar│  │ El trimado de  │  │ 5 nudos que   │ │
│  │ Windguru        │  │ velas: guía    │  │ todo marinero │ │
│  │ correctamente  │  │ práctica       │  │ debe saber    │ │
│  │                │  │                │  │                │ │
│  │ [preview texto]│  │ [preview texto]│  │ [preview]     │ │
│  │                │  │                │  │                │ │
│  │ ⏱ 4 min · 2024│  │ ⏱ 6 min · 2024│  │ ⏱ 8 min      │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                              │
│  (siguiente fila...)                                         │
│                                                              │
│         [ Cargar más artículos ] ← botón centrado           │
└──────────────────────────────────────────────────────────────┘
```

## 📝 ARTÍCULOS INICIALES (contenido oficial para las primeras cards)

```
ARTÍCULO 1:
  Categoría:  Meteorología
  Título:     "Cómo interpretar Windguru y Tolomet para navegar seguro"
  Preview:    "El viento térmico cambia las reglas del juego. Te enseñamos
               a leer las previsiones antes de salir a la mar."
  Tiempo:     6 min lectura
  Nivel:      Principiantes

ARTÍCULO 2:
  Categoría:  Técnica
  Título:     "El trimado de velas: qué es y por qué marca la diferencia"
  Preview:    "Una vela bien trimada puede hacer que tu barco vuele.
               Aprende el Principio de Bernoulli aplicado a la vela."
  Tiempo:     8 min lectura
  Nivel:      Intermedio

ARTÍCULO 3:
  Categoría:  Nudos
  Título:     "5 nudos marineros básicos: as de guía, llano y ballestrinque"
  Preview:    "Con estos tres nudos dominarás el 90% de las situaciones
               que encontrarás a bordo. Tutorial paso a paso."
  Tiempo:     5 min lectura
  Nivel:      Principiantes

ARTÍCULO 4:
  Categoría:  Técnica
  Título:     "Las partes del barco: guía visual para reconocerlo todo"
  Preview:    "Proa, popa, babor, estribor... y mucho más. Una guía
               visual para orientarte desde el primer día."
  Tiempo:     4 min lectura
  Nivel:      Principiantes

ARTÍCULO 5:
  Categoría:  Meteorología
  Título:     "Virazón y terral: cómo funciona el viento térmico en Getxo"
  Preview:    "Las brisas de mar y tierra son tus mejores aliadas en
               la Ría de Bilbao. Aprende a anticiparlas."
  Tiempo:     7 min lectura
  Nivel:      Intermedio

ARTÍCULO 6:
  Categoría:  Técnica
  Título:     "Efecto orzante y arribante: cómo afecta la quilla a tu barco"
  Preview:    "No todos los barcos se comportan igual. Entiende qué
               quilla tiene el tuyo y cómo navega."
  Tiempo:     5 min lectura
  Nivel:      Avanzados
```

## ⚙️ ESPECIFICACIONES DE LAS CARDS DEL GRID

```css
/* [ATOMIC] Paso 4.1 — BlogCard.tsx */

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);    /* 24px entre cards */
}

/* Responsive: */
@media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .blog-grid { grid-template-columns: 1fr; } }

.blog-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);     /* 24px */
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  border: 1px solid var(--color-mist);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  position: relative;
}

/* THUMBNAIL de la card (área superior, 240px) */
.blog-card__thumb {
  width: 100%;
  height: 240px;
  background: var(--color-spray);      /* fondo por defecto antes de imagen */
  position: relative;
  overflow: hidden;
}

/* BADGE de categoría sobre el thumbnail */
.blog-card__category {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #FFFFFF;
  color: var(--color-ocean);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

/* CUERPO de la card */
.blog-card__body {
  padding: var(--space-3);             /* 24px */
}

.blog-card__level {
  font-size: var(--text-xs);
  color: var(--color-steel);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-1);
}

.blog-card__title {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-xl);           /* 20px */
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.3;
  margin-bottom: var(--space-2);
}

.blog-card__excerpt {
  font-size: var(--text-sm);
  color: var(--color-steel);
  line-height: 1.6;
  /* Truncar en 2 líneas: */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--color-mist);
  font-size: var(--text-xs);
  color: var(--color-steel);
}
```

## 🎬 ANIMACIONES FRAMER MOTION DEL GRID

```tsx
/* [ATOMIC] Paso 4.2 — Animaciones del grid */

// REGLA: cada card tiene un delay que aumenta según su índice
// Esto crea el efecto de "lluvia de cards" al entrar en vista

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.08,         // 80ms entre cada card
    }
  })
}

// En el grid, usa AnimatePresence para las transiciones de filtro:
<AnimatePresence mode="wait">
  <motion.div
    key={activeCategory}         // cambia con el filtro
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="blog-grid"
  >
    {filteredArticles.map((article, i) => (
      <motion.div
        key={article.id}
        custom={i}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          y: -6,
          boxShadow: "0 20px 60px rgba(26,31,46,0.12)",
          transition: { duration: 0.2 }
        }}
      >
        <BlogCard article={article} />
      </motion.div>
    ))}
  </motion.div>
</AnimatePresence>

// EFECTO CURSOR en cada card (imagen se mueve con el ratón):
// En el thumb de cada card, añade un mousemove listener que
// mueve la imagen +5px en la dirección del cursor (parallax suave)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 5 · SECCIÓN "EL MAR EN DATOS"
# (Estilo Bonka — Números animados con magia)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 Layout de Estadísticas

```
┌──────────────────────────────────────────────────────────────┐
│  background: #FFFFFF                                         │
│  padding: 96px 64px                                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │   Todo lo que necesitas                             │    │
│  │   para navegar. Aquí.                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐  │
│  │          │    │          │    │          │    │       │  │
│  │   +20    │    │   100%   │    │    3     │    │  1×   │  │
│  │ artículos│    │  náutica │    │  idiomas │    │  mes  │  │
│  │          │    │          │    │          │    │       │  │
│  │ Recursos │    │ Contenido│    │  ES·EU·EN│    │Nuevo  │  │
│  │ técnicos │    │ gratuito │    │          │    │artículo│  │
│  └──────────┘    └──────────┘    └──────────┘    └───────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## ⚙️ ESPECIFICACIONES DE LA SECCIÓN DE DATOS

```tsx
/* [ATOMIC] Paso 5.1 — StatsSection.tsx */

// Los números se "cuentan" cuando el usuario hace scroll hasta ellos
// Usa useInView + animación de conteo

import { useInView } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// Hook de conteo animado:
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0)
  const start = useRef<number | null>(null)

  useEffect(() => {
    const step = (timestamp: number) => {
      if (!start.current) start.current = timestamp
      const progress = Math.min((timestamp - start.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)  // ease-out-cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return count
}

// DATOS DE LAS STATS:
const STATS = [
  { value: 20,   prefix: '+',  suffix: '',  label: 'Artículos técnicos',  sub: 'y creciendo cada mes' },
  { value: 100,  prefix: '',   suffix: '%', label: 'Contenido gratuito',  sub: 'sin registro' },
  { value: 3,    prefix: '',   suffix: '',  label: 'Idiomas',              sub: 'Castellano · Euskera · Inglés' },
  { value: 1,    prefix: '',   suffix: '×', label: 'Al mes',              sub: 'nuevo artículo garantizado' },
]

// ESTILOS DE CADA STAT:
/* Tarjeta de stat:
   - border: 1px solid var(--color-mist)
   - border-radius: var(--radius-lg)
   - padding: 40px 32px
   - text-align: center

   Número grande:
   - font-family: 'Playfair Display'
   - font-size: 64px
   - font-weight: 700
   - color: var(--color-ocean)
   - line-height: 1

   Label:
   - font-size: 16px
   - font-weight: 600
   - color: var(--color-ink)
   - margin-top: 12px

   Sub-label:
   - font-size: 13px
   - color: var(--color-steel)
   - margin-top: 6px
*/
```

## 🎬 ANIMACIÓN DE ENTRADA DE LAS STATS

```tsx
/* [ATOMIC] Paso 5.2 — Animaciones StatsSection */

// Cada stat entra con una rotación + fade desde abajo:
const statVariants = {
  hidden: { opacity: 0, y: 60, rotateX: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.1,
    }
  })
}

// El container tiene: style={{ perspective: '800px' }}
// Esto hace que el rotateX funcione en 3D → muy bonito

// El número solo cuenta CUANDO entra en el viewport:
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-50px' })
// Si isInView === false → renderiza "0"
// Si isInView === true  → inicia el useCountUp
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 6 · NEWSLETTER + CTA FINAL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎨 Layout del CTA Final

```
┌──────────────────────────────────────────────────────────────┐
│  background: var(--color-ink)  [oscuro, como el highlighted] │
│  border-radius: var(--radius-xl)                             │
│  margin: 0 64px 96px                                         │
│                                                              │
│              ┌─────────────────────────────┐                 │
│              │  🌊  (icono wave animado)    │                 │
│              │                             │                 │
│              │  ¿Listo para aprender       │                 │
│              │  a navegar de verdad?       │                 │
│              │                             │                 │
│              │  Cada nuevo artículo        │                 │
│              │  te lo enviamos directo     │                 │
│              │  a tu correo. Sin spam.     │                 │
│              │                             │                 │
│              │  [email input] [Suscribirse]│                 │
│              │                             │                 │
│              │  ✓ 1 email al mes máximo    │                 │
│              │  ✓ Baja cuando quieras      │                 │
│              └─────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

## ⚙️ ESPECIFICACIONES DEL CTA FINAL

```css
/* [ATOMIC] Paso 6.1 — NewsletterCTA.tsx */

.newsletter-cta {
  background: var(--color-ink);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-12);
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Decoración: círculos difuminados de fondo */
.newsletter-cta::before,
.newsletter-cta::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.newsletter-cta::before {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(46,125,209,0.2) 0%, transparent 70%);
  top: -100px; left: -100px;
}
.newsletter-cta::after {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%);
  bottom: -80px; right: -80px;
}

/* Input de email + botón inline: */
.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 480px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-full);
  padding: 14px 20px;
  color: #FFFFFF;
  font-size: var(--text-base);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.newsletter-input::placeholder { color: rgba(255,255,255,0.4); }
.newsletter-input:focus {
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
}

.newsletter-submit {
  background: #FFFFFF;
  color: var(--color-ink);
  border: none;
  border-radius: var(--radius-full);
  padding: 14px 28px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 7 · ILUSTRACIONES SVG (DIBUJOS INLINE)
# (Lo que hace que sea "mágico como Bonka")
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🖼️ ILUSTRACIÓN 1 — VELERO (Hero)

```
Instrucciones para dibujar el velero en SVG.
Ancho: 520px · Alto: 480px · ViewBox: "0 0 520 480"

HORIZONTE: línea horizontal a y=300

MAR (fill #E8F3FF, strokeless):
  - Rect desde y=300 hasta y=480, ancho=520

OLAS (path animado, stroke #A8C8E8, strokeWidth=2):
  - Curva sinusoidal entre y=296 y y=304
  - 3 keyframes con d diferente → animación infinita 3s

CASCO (rect redondeado):
  - x=160, y=290, width=200, height=40
  - rx=8, fill=#1A1F2E
  - centro del barco en x=260

MÁSTIL (línea):
  - x1=260, y1=290, x2=260, y2=130
  - stroke=#1A1F2E, strokeWidth=3

VELA MAYOR (polilínea):
  - points: 260,135  260,280  420,270
  - fill=#FFFFFF, stroke=#E4E8EE, strokeWidth=1.5

VELA GÉNOVA/PROA (polilínea):
  - points: 260,155  260,280  150,265
  - fill=#F0F7FF, stroke=#E4E8EE, strokeWidth=1.5

BAÑERA/CABINA (rect):
  - x=220, y=268, width=60, height=24
  - rx=4, fill=#2E3A52

REFLEJO EN EL AGUA (el casco, opacidad 0.15, scaleY=-0.3):
  - Replica el casco debajo de y=300 con transform

TODO EL BARCO oscila:
  - rotateZ de -1° a +1°, origen en x=260, y=290
  - duración: 4s, repeat: Infinity, ease: "easeInOut"
```

## 🖼️ ILUSTRACIÓN 2 — ÍCONO DE NUDO MARINERO (para cards de Nudos)

```
SVG 80×80px. ViewBox "0 0 80 80"

Dibuja un "as de guía" simplificado:
- Círculo central grande: cx=40, cy=40, r=20, no fill, stroke=#1B4F8A, sw=2.5
- Cuerda saliendo por abajo: path curvo hacia abajo-izquierda
- Cuerda saliendo por arriba: path curvo hacia arriba
- Estilo: líneas redondeadas (strokeLinecap=round), color #1B4F8A
```

## 🖼️ ILUSTRACIÓN 3 — ÍCONO DE VIENTO (para cards de Meteorología)

```
SVG 80×80px.

Dibuja líneas de viento estilizadas:
- 3 líneas horizontales curvas de izquierda a derecha
- Extremo derecho con una pequeña flecha
- La línea del medio es más larga
- Colores: de arriba a abajo → #A8C8E8, #2E7DD1, #1B4F8A
- Animación: las líneas se mueven de derecha a izquierda infinitamente
  usando translateX de 0px a -8px y vuelta
```

## 🖼️ ILUSTRACIÓN 4 — BOYA DE NAVEGACIÓN (para artículos de señales)

```
SVG 80×80px.

Cuerpo de la boya:
- Elipse cx=40, cy=45, rx=16, ry=22, fill=#E8280B (rojo, boya de estribor)
- Líneas horizontales blancas sobre la boya (rayas)

Cadena de fondeo:
- 3 eslabones encadenados debajo de la boya, color #8A96A3

Luz/baliza en punta:
- Triángulo pequeño amarillo en la cima
- Efecto de "destello": circle blanco, opacity animada 0→1→0, 2s repeat
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASE 8 · CONFIGURACIÓN TÉCNICA & SEO
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📦 DEPENDENCIAS A INSTALAR

```bash
# [ATOMIC] Paso 8.1 — Ejecuta EXACTAMENTE estos comandos:

npm install framer-motion           # Animaciones (v11+)
npm install @fontsource/inter        # Tipografía Inter
npm install @fontsource/playfair-display  # Tipografía Playfair
npm install next-seo                # SEO meta tags
# Si usas Next.js, estas ya están disponibles via Google Fonts
```

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── app/
│   └── blog/
│       ├── page.tsx                 ← Página principal del blog
│       ├── [slug]/
│       │   └── page.tsx             ← Artículo individual
│       └── layout.tsx               ← Layout del blog
│
├── components/
│   └── blog/
│       ├── HeroSection.tsx          ← FASE 1
│       ├── CategoryFilter.tsx       ← FASE 2
│       ├── FeaturedCard.tsx         ← FASE 3
│       ├── BlogGrid.tsx             ← FASE 4
│       ├── BlogCard.tsx             ← FASE 4
│       ├── StatsSection.tsx         ← FASE 5
│       ├── NewsletterCTA.tsx        ← FASE 6
│       └── illustrations/
│           ├── SailingBoat.tsx      ← FASE 7, Ilustr. 1
│           ├── KnotIcon.tsx         ← FASE 7, Ilustr. 2
│           ├── WindIcon.tsx         ← FASE 7, Ilustr. 3
│           └── BuoyIcon.tsx         ← FASE 7, Ilustr. 4
│
├── lib/
│   └── blog/
│       ├── types.ts                 ← Tipos TypeScript
│       └── data.ts                  ← Datos de artículos
│
└── styles/
    └── blog.css                     ← Variables CSS del sistema de diseño
```

## 📊 TIPOS TYPESCRIPT

```typescript
/* [ATOMIC] Paso 8.2 — Crea: src/lib/blog/types.ts */

export type BlogCategory =
  | 'meteorologia'
  | 'tecnica'
  | 'nudos'
  | 'principiantes'
  | 'avanzados'

export type BlogLevel = 'Principiante' | 'Intermedio' | 'Avanzado'

export type BlogLanguage = 'es' | 'eu' | 'en'

export interface BlogPost {
  id: string
  slug: string              // URL: /blog/como-leer-windguru
  title: string
  excerpt: string           // máx. 160 caracteres
  content: string           // MDX o HTML
  category: BlogCategory
  level: BlogLevel
  language: BlogLanguage
  readingTime: number       // en minutos
  publishedAt: string       // ISO 8601
  updatedAt?: string
  featured: boolean         // si va en la FeaturedCard
  thumbnail?: string        // URL de imagen
  tags: string[]
  seo: {
    title: string           // para <title> → máx 60 chars
    description: string     // para <meta description> → máx 160 chars
  }
}
```

## 🌐 SEO — PALABRAS CLAVE A INCLUIR

```
PALABRAS CLAVE PRINCIPALES (incluir en titles y H1):
  ✅ "aprender a navegar en la mar"
  ✅ "iniciación vela"
  ✅ "curso de navegación básica"
  ✅ "escuela de vela Getxo"
  ✅ "aprender a navegar Bilbao"

PALABRAS CLAVE DE COLA LARGA (incluir en el contenido):
  ✅ "cómo leer Windguru"
  ✅ "as de guía marinero paso a paso"
  ✅ "trimado de velas principiantes"
  ✅ "partes del barco de vela"
  ✅ "viento térmico Ría de Bilbao"
  ✅ "virazón y terral Euskadi"

META TAGS para la página /blog:
  title:       "Blog de Aprendizaje de Vela | Getxo Bela Eskola"
  description: "Aprende a navegar con nuestra guía de recursos náuticos.
                Meteorología, técnica, nudos marineros y mucho más.
                Gratis."
  og:image:    "/images/blog-og.jpg"  (1200×630px)
```

## 🗣️ INTERNACIONALIZACIÓN (ES / EU)

```
COPY EN CASTELLANO (ya incluido arriba)

COPY EN EUSKERA (para la versión /eu/bloga):
  ETIQUETA:   "Ikaskuntza"
  TÍTULO H1:  "Egin nabigazioa ikasi."
               "Benetan."
  SUBTÍTULO:  "Aurkitu gure blogean aholkuak eta esperientziak
               belaren eta nautikoaren ikasteko. Istorioak, trikimailuak
               eta baliabide teknikoak zure trebetasunak hobetzeko,
               hasiberrietatik aurreratuetaraino."
  CTA:        "Bloga aztertu →"

REGLA TÉCNICA para i18n:
  - Las URLs castellano: /blog/[slug]
  - Las URLs euskera:    /eu/bloga/[slug]
  - Google las trata como 2 webs distintas → más tráfico SEO
  - Añade hreflang en el <head>:
    <link rel="alternate" hreflang="es" href="https://getxobelaeskola.cloud/blog/[slug]" />
    <link rel="alternate" hreflang="eu" href="https://getxobelaeskola.cloud/eu/bloga/[slug]" />
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CHECKLIST DE IMPLEMENTACIÓN
# (Marca cada casilla al completar)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ FASE 1 — Hero
- [ ] `HeroSection.tsx` creado
- [ ] Copy oficial implementado (eyebrow + título + subtítulo + CTA)
- [ ] `SailingIllustration.tsx` con SVG animado
- [ ] Animación stagger de entrada (framer-motion)
- [ ] ScrollIndicator implementado
- [ ] Responsive: móvil (columna única) y desktop (2 columnas)
- [ ] `prefers-reduced-motion` respetado

## ✅ FASE 2 — Filtros
- [ ] `CategoryFilter.tsx` con las 6 categorías
- [ ] Animación "pastilla deslizante" con `layoutId`
- [ ] Sticky al scroll con `backdrop-blur`
- [ ] Estado activo manejado correctamente

## ✅ FASE 3 — Featured Card
- [ ] `FeaturedCard.tsx` con fondo oscuro
- [ ] Badge dorado implementado
- [ ] Efecto de luz que sigue al cursor (mousemove)
- [ ] Hover: card se levanta + imagen hace zoom
- [ ] Animación de entrada con `whileInView`

## ✅ FASE 4 — Grid de Artículos
- [ ] `BlogGrid.tsx` con grid de 3 columnas
- [ ] `BlogCard.tsx` con thumbnail, categoría, título, excerpt, footer
- [ ] Los 6 artículos iniciales creados con el copy oficial
- [ ] `AnimatePresence` para transición entre categorías
- [ ] Animación "lluvia de cards" (stagger con delay por índice)
- [ ] Hover: card sube + sombra
- [ ] Responsive 3→2→1 columnas

## ✅ FASE 5 — Stats
- [ ] `StatsSection.tsx` con 4 estadísticas
- [ ] Hook `useCountUp` implementado
- [ ] Números solo cuentan cuando entran en viewport (`useInView`)
- [ ] Animación 3D de entrada (`rotateX` con `perspective`)

## ✅ FASE 6 — Newsletter
- [ ] `NewsletterCTA.tsx` con fondo oscuro
- [ ] Input de email + botón funcional
- [ ] Decoración de círculos difuminados de fondo
- [ ] Mensaje de confirmación al enviar

## ✅ FASE 7 — Ilustraciones
- [ ] `SailingBoat.tsx` — velero con olas animadas
- [ ] `KnotIcon.tsx` — as de guía para cards
- [ ] `WindIcon.tsx` — líneas de viento para meteo
- [ ] `BuoyIcon.tsx` — boya para señales
- [ ] Todas las animaciones con `prefers-reduced-motion`

## ✅ FASE 8 — Técnico
- [ ] Variables CSS definidas en `blog.css`
- [ ] Fuentes cargadas (Inter + Playfair Display)
- [ ] Tipos TypeScript en `types.ts`
- [ ] SEO meta tags en cada página
- [ ] Rutas i18n ES/EU configuradas
- [ ] `hreflang` en el `<head>`

---

# 📌 NOTAS FINALES IMPORTANTES

```
1. PERFORMANCE: todas las imágenes → next/image con loading="lazy"
2. ACCESIBILIDAD: cada card tiene aria-label con el título del artículo
3. ANIMACIONES: SIEMPRE incluye:
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      Si es true → desactiva todas las animaciones de Framer Motion
4. TIPOGRAFÍA: carga SOLO los weights necesarios:
      Inter: 400, 500, 600
      Playfair Display: 700
5. IMÁGENES del blog: si no tienes imágenes reales, usa unsplash:
      https://source.unsplash.com/800x600/?sailing,boat (placeholder)
6. CONTENIDO MÍNIMO: sube 1 artículo completo ANTES de lanzar
      (no lanzar el blog vacío — mal para SEO y mala imagen)
7. FRECUENCIA: calendario editorial → 1 artículo/mes mínimo
      Siguiente artículo sugerido: "Cómo interpretar Windguru y Tolomet"
```

---

*Plan elaborado para getxobelaeskola.cloud — Blog de Aprendizaje*
*Estilo: Apple Clean × Café Bonka Magic · Framework: Next.js + Framer Motion*
*Versión 1.0 — Junio 2025*
