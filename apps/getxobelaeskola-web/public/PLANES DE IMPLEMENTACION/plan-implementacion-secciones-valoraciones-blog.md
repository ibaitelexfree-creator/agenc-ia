# Plan de implementación atómico
## Secciones "Valoraciones" (prueba social) + "Blog" — getxobelaeskola.cloud

> **Cómo usar este documento:** está pensado para que cada Fase la pueda ejecutar una IA/agente distinto sin necesidad de tomar decisiones de diseño. Cada tarea indica: archivo a tocar, qué hacer, código exacto y "Criterio de aceptación" (cómo saber que está bien hecho). No saltar tareas ni cambiar nombres de variables/tokens sin actualizar el resto del documento.

---

## 0. Resumen y avisos importantes antes de empezar

### 0.1 Resumen de lo que se va a construir
1. **Sección "Valoraciones"**: bloque de prueba social justo debajo del Hero, con el texto ya redactado ("¡LA VELA NO DEJA A NADIE INDIFERENTE!...") + un carrusel de tarjetas de reseñas reales de Google con estrellas, avatar y fecha.
2. **Sección "Blog"**: bloque "CONSULTA NUESTRO BLOG" con 3 tarjetas destacadas (imagen + badge "FIJADO" + categoría + título) y un CTA hacia el índice del blog, dividido en dos categorías: **Noticias y Eventos** y **Aprendizaje**.
3. Una **capa transversal de "magia"** (micro-animaciones Framer Motion, divisor de ola animado, brillo ambiental, partículas) que conecta ambas secciones con el resto de la web manteniendo un fondo blanco y limpio tipo Apple.

### 0.2 ⚠️ Contenido de ejemplo que NO se puede usar tal cual
El boceto que se ha compartido es una **plantilla de marketing de la herramienta EmbedSocial**, no contenido real de Getxo Bela Eskola. Antes de dar por cerrada cualquier fase, hay que sustituir:

- Las 4 reseñas de ejemplo (Karl, Zanna, Kodi, Brooks) **hablan del propio software EmbedSocial** ("I deal with a number of software companies...", "EmbedSocial allows us to showcase social media..."). **No son reseñas de la escuela** → hay que sustituirlas por reseñas reales de Google de Getxo Bela Eskola.
- El texto "**por Escola Port**" en las tarjetas del blog pertenece a otra escuela náutica (Barcelona/Vilanova). Hay que sustituirlo por "**por Getxo Bela Eskola**" y por artículos propios.
- Los temas de blog de ejemplo (aguas jurisdiccionales, jarcia, patrón de yate) son **válidos como inspiración temática** (encajan con la categoría "Aprendizaje"), pero el texto/imagen final debe ser propio y, si se publica en castellano, traducirse también al euskera.

➡️ Esto se traduce en una tarea de contenido obligatoria en la **Fase 5**.

### 0.3 Stack asumido
Se asume **React** (Next.js o Astro con islas React) + **Framer Motion** (`npm install framer-motion`). Si el proyecto es 100% estático sin React, ver el **Anexo C** (equivalente con la librería `motion` de motion.dev).

### 0.4 Principio de diseño: "Apple blanco y limpio" + "magia náutica"
- Fondo principal **blanco puro** (`#FFFFFF`), con un segundo fondo "niebla" muy suave para alternar secciones.
- Mucho **espacio en blanco**, tipografía grande y legible, esquinas redondeadas suaves, sombras muy difusas (nunca duras/negras).
- El color de marca ya definido en el sitio es **azul marino `#001B3A`** (theme-color actual) → se usa con moderación en titulares, iconos y acentos.
- La "magia" no viene de saturar de colores, sino de **movimiento**: revelados en scroll, hover con resorte (spring), un divisor en forma de ola que se "dibuja" solo, brillo ambiental sutil y micro-partículas doradas (como reflejos de sol en el agua) en puntos clave.

---

## FASE 0 — Fundamentos: Design Tokens + librería de animación

> Objetivo: dejar preparados los "ladrillos" (colores, tipografía, espaciados, variantes de Framer Motion) para que las Fases 1 y 2 solo tengan que **consumirlos**, sin inventar valores nuevos.

### Tarea 0.1 — Instalar dependencias
**Acción:** ejecutar en la raíz del proyecto:
```bash
npm install framer-motion
```
**Criterio de aceptación:** `framer-motion` aparece en `package.json` → `dependencies`.

### Tarea 0.2 — Crear archivo de tokens de diseño
**Archivo nuevo:** `src/styles/tokens.css`

```css
:root {
  /* ===== Color ===== */
  --gbe-white:       #FFFFFF;
  --gbe-mist:        #F6F8FA;   /* fondo alterno "niebla" */
  --gbe-navy-900:    #001B3A;   /* azul marca (theme-color actual) */
  --gbe-navy-700:    #0B3D63;
  --gbe-navy-500:    #2C6E9B;
  --gbe-gold:        #F2A93B;   /* "magia": brillo de sol / estrellas */
  --gbe-gold-soft:   rgba(242, 169, 59, 0.18);
  --gbe-text:        #11171F;
  --gbe-text-muted:  #5B6675;
  --gbe-border:      #E7EBEF;

  /* ===== Radios ===== */
  --gbe-radius-sm:   12px;
  --gbe-radius-md:   20px;
  --gbe-radius-lg:   28px;
  --gbe-radius-pill: 999px;

  /* ===== Sombras (difusas, "Apple") ===== */
  --gbe-shadow-soft:  0 8px 30px rgba(0, 27, 58, 0.06);
  --gbe-shadow-hover: 0 24px 60px rgba(0, 27, 58, 0.14);
  --gbe-shadow-glow:  0 0 40px rgba(242, 169, 59, 0.25);

  /* ===== Espaciado de sección ===== */
  --gbe-section-padding-desktop: 120px;
  --gbe-section-padding-mobile:  64px;
  --gbe-container-max: 1240px;

  /* ===== Tipografía ===== */
  /* Si el sitio ya tiene fuentes corporativas, sustituir aquí y NO tocar nada más */
  --gbe-font-display: "Fraunces", "Georgia", serif;     /* titulares con carácter */
  --gbe-font-body:    "Inter", "Helvetica Neue", sans-serif; /* texto, UI */
}
```

**Criterio de aceptación:** el archivo se importa una sola vez en el layout global (`_app.jsx`, `layout.astro`, etc.) y todas las clases de las Fases 1-3 usan `var(--gbe-...)`, nunca valores hardcoded.

### Tarea 0.3 — Crear la librería de "variantes" de Framer Motion
**Archivo nuevo:** `src/lib/motion-variants.js`

> Esta es la pieza más importante: todas las animaciones de las Fases 1, 2 y 3 **importan de aquí**. Así cualquier IA que implemente una tarjeta nueva reutiliza siempre los mismos timings y queda "coherente".

```jsx
// src/lib/motion-variants.js

// ---- Curvas de easing tipo Apple (ease-out suave) ----
export const easeApple = [0.22, 1, 0.36, 1];

// ---- Springs reutilizables ----
export const springPop    = { type: "spring", stiffness: 420, damping: 18 };
export const springSoft   = { type: "spring", stiffness: 220, damping: 22 };
export const springButton = { type: "spring", stiffness: 300, damping: 20 };

// ---- Revelado simple al entrar en viewport (texto, bloques) ----
export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeApple } },
};

// ---- Contenedor con "stagger" (hijos aparecen en cascada) ----
export const staggerContainer = (stagger = 0.12, delay = 0.05) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

// ---- Item hijo de un staggerContainer (tarjetas, líneas de texto) ----
export const staggerItem = {
  hidden:  { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: easeApple } },
};

// ---- Estrellas: pop con rotación, una a una ----
export const starPop = {
  hidden:  { opacity: 0, scale: 0, rotate: -40 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: springPop },
};

// ---- Flotación ambiental infinita (avatares, iconos "mágicos") ----
export const floatLoop = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

// ---- Hover de tarjeta "elevar + sombra" ----
export const cardHover = {
  whileHover: { y: -10, boxShadow: "var(--gbe-shadow-hover)" },
  whileTap:   { scale: 0.98 },
  transition: springSoft,
};

// ---- Texto: revelar palabra a palabra ----
export const wordContainer = staggerContainer(0.06, 0);
export const wordItem = {
  hidden:  { opacity: 0, y: "0.4em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeApple } },
};
```

**Criterio de aceptación:** el archivo exporta todo lo anterior sin errores; un `import { fadeUp } from "@/lib/motion-variants"` funciona desde cualquier componente.

### Tarea 0.4 — Hook de "reduced motion"
**Archivo nuevo:** `src/lib/useMagicMotion.js`

```jsx
import { useReducedMotion } from "framer-motion";

// Devuelve `true` si hay que desactivar animaciones "extra" (loops, parallax, partículas)
export function useMagicMotion() {
  const prefersReduced = useReducedMotion();
  return { magicEnabled: !prefersReduced };
}
```

**Criterio de aceptación:** cualquier animación `repeat: Infinity`, parallax o partículas (Fase 3) se envuelve en `if (magicEnabled) {...}`.

---

## FASE 1 — Sección de Valoraciones (Prueba Social)

> Resultado visual esperado: arriba un bloque de texto a dos columnas (titular grande a la izquierda, 4 frases cortas a la derecha) que aparece línea a línea al hacer scroll; debajo, un carrusel horizontal de tarjetas de reseñas reales de Google con estrellas que "saltan" una a una.

### Tarea 1.1 — Estructura de archivos
**Crear:**
```
src/components/sections/Reviews/
  ReviewsSection.jsx
  ReviewsHeader.jsx
  ReviewCard.jsx
  ReviewsCarousel.jsx
  StarRating.jsx
  reviews.data.js
  Reviews.module.css
```

**Criterio de aceptación:** la carpeta existe con esos 7 archivos (vacíos de momento).

### Tarea 1.2 — Contenido textual exacto (componente `ReviewsHeader.jsx`)
Usar **literalmente** este texto (ya redactado, no reescribir):

| Elemento | Texto ES |
|---|---|
| Titular grande (izquierda) | `¡LA VELA NO DEJA A NADIE INDIFERENTE!` |
| Línea 1 (derecha) | `Tiene una magia especial.` |
| Línea 2 (derecha) | `Y cuando algo así se hace con pasión...` |
| Línea 3 (derecha) | `Los resultados hablan por sí mismos.` |
| Línea 4 (derecha, destacar "100%") | `Tenemos un 100% de valoraciones positivas en Google.` |
| Subtítulo (centrado, encima del carrusel) | `Esto es lo que sienten quienes lo han vivido:` |

> Recordatorio: duplicar este componente en euskera (`ReviewsHeader.eu.jsx` o usar el sistema i18n existente del proyecto) — ver Fase 5.3.

### Tarea 1.3 — Wireframe (estructura)

**Desktop (≥1024px):**
```
┌──────────────────────────────────────────────────────────────────┐
│  [fondo blanco, padding 120px]                                     │
│                                                                     │
│  ¡LA VELA NO        |   Tiene una magia especial.                  │
│  DEJA A NADIE       |   Y cuando algo así se hace con pasión...    │
│  INDIFERENTE!       |   Los resultados hablan por sí mismos.       │
│  (serif, 56-64px)   |   Tenemos un 100% de valoraciones... Google. │
│                                                                     │
│            Esto es lo que sienten quienes lo han vivido:           │
│                                                                     │
│  ‹  [★★★★★ tarjeta 1] [★★★★★ tarjeta 2] [★★★★★ tarjeta 3...]  ›    │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile (<768px):** una sola columna; titular arriba, las 4 líneas debajo apiladas, subtítulo centrado, carrusel con scroll horizontal táctil (snap), 1 tarjeta visible + "peek" del 20% de la siguiente.

### Tarea 1.4 — Maquetación de `ReviewsSection.jsx`
**Código base (sin animación todavía, eso va en 1.6):**

```jsx
import ReviewsHeader from "./ReviewsHeader";
import ReviewsCarousel from "./ReviewsCarousel";
import styles from "./Reviews.module.css";

export default function ReviewsSection() {
  return (
    <section className={styles.section} aria-labelledby="reviews-heading">
      <ReviewsHeader />
      <p className={styles.subheading}>
        Esto es lo que sienten quienes lo han vivido:
      </p>
      <ReviewsCarousel />
    </section>
  );
}
```

**`Reviews.module.css` (base, sin animación):**
```css
.section {
  background: var(--gbe-white);
  padding: var(--gbe-section-padding-desktop) 24px;
  max-width: var(--gbe-container-max);
  margin: 0 auto;
}
@media (max-width: 768px) {
  .section { padding: var(--gbe-section-padding-mobile) 16px; }
}

.subheading {
  text-align: center;
  font-family: var(--gbe-font-display);
  font-size: clamp(20px, 2.4vw, 28px);
  color: var(--gbe-navy-900);
  margin: 64px 0 32px;
}
```

**Criterio de aceptación:** la sección se renderiza en blanco, ancho máximo 1240px, sin animaciones, con el subtítulo centrado en serif.

### Tarea 1.5 — `ReviewsHeader.jsx` (grid 2 columnas)
```jsx
import styles from "./Reviews.module.css";

export default function ReviewsHeader() {
  return (
    <div className={styles.headerGrid}>
      <h2 className={styles.headline}>
        ¡LA VELA NO DEJA A NADIE INDIFERENTE!
      </h2>
      <div className={styles.headerLines}>
        <p>Tiene una magia especial.</p>
        <p>Y cuando algo así se hace con pasión...</p>
        <p>Los resultados hablan por sí mismos.</p>
        <p>
          Tenemos un <strong className={styles.highlight}>100%</strong> de
          valoraciones positivas en Google.
        </p>
      </div>
    </div>
  );
}
```

**CSS adicional:**
```css
.headerGrid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
  align-items: center;
}
@media (max-width: 900px) {
  .headerGrid { grid-template-columns: 1fr; gap: 32px; }
}

.headline {
  font-family: var(--gbe-font-display);
  font-weight: 600;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.08;
  color: var(--gbe-navy-900);
}

.headerLines p {
  font-family: var(--gbe-font-body);
  font-size: clamp(17px, 1.6vw, 20px);
  color: var(--gbe-text);
  margin-bottom: 14px;
}

.highlight {
  color: var(--gbe-gold);
  font-weight: 700;
}
```

### Tarea 1.6 — Datos de reseñas: `reviews.data.js`
**⚠️ Sustituir los `text` de ejemplo por reseñas reales de Google (ver aviso 0.2).** Estructura mínima:

```js
// src/components/sections/Reviews/reviews.data.js
export const reviews = [
  {
    id: "r1",
    name: "Nombre del alumno",
    timeAgo: "hace 5 meses",
    rating: 5,
    text: "Texto real de la reseña de Google de Getxo Bela Eskola...",
    avatarUrl: "/images/reviews/avatar-1.webp", // o iniciales si no hay foto
    source: "google", // "google" | "trustpilot" | etc.
  },
  // ...al menos 6-8 reseñas reales para que el carrusel tenga sentido
];
```

**Criterio de aceptación:** mínimo 6 objetos con `rating: 5`, textos reales (no genéricos de software), y un campo `source: "google"`.

### Tarea 1.7 — `StarRating.jsx` (con animación "pop" estrella a estrella)
```jsx
import { motion } from "framer-motion";
import { staggerContainer, starPop } from "@/lib/motion-variants";

export default function StarRating({ rating = 5 }) {
  return (
    <motion.div
      className="star-rating"
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      style={{ display: "flex", gap: 4 }}
    >
      {Array.from({ length: rating }).map((_, i) => (
        <motion.svg
          key={i}
          variants={starPop}
          width="18" height="18" viewBox="0 0 24 24"
          fill="var(--gbe-gold)"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.4 8.166L12 19.771l-7.334 3.388 1.4-8.166L.132 9.211l8.2-1.193z" />
        </motion.svg>
      ))}
    </motion.div>
  );
}
```

**Animación — detalle:**
- Cada estrella entra con `scale: 0 → 1` + `rotate: -40° → 0°` mediante `springPop` (stiffness 420 / damping 18).
- `staggerChildren: 0.08s` → en una tarjeta de 5 estrellas, la última estrella aparece ~0.4s después de la primera → efecto de "destello" rápido.
- `viewport={{ once: true }}` → solo se anima la primera vez que entra en pantalla, no se repite al hacer scroll arriba/abajo.

### Tarea 1.8 — `ReviewCard.jsx`
```jsx
import { motion } from "framer-motion";
import { staggerItem, cardHover, floatLoop } from "@/lib/motion-variants";
import { useMagicMotion } from "@/lib/useMagicMotion";
import StarRating from "./StarRating";
import styles from "./Reviews.module.css";

export default function ReviewCard({ review }) {
  const { magicEnabled } = useMagicMotion();

  return (
    <motion.article
      className={styles.card}
      variants={staggerItem}
      {...cardHover}
    >
      <StarRating rating={review.rating} />

      {review.source === "google" && (
        <img src="/images/icons/google-g.svg" alt="Google" width="20" height="20" />
      )}

      <p className={styles.cardText}>{review.text}</p>

      <div className={styles.cardFooter}>
        <motion.img
          src={review.avatarUrl}
          alt={review.name}
          width="40" height="40"
          className={styles.avatar}
          {...(magicEnabled ? floatLoop : {})}
        />
        <div>
          <p className={styles.cardName}>{review.name}</p>
          <p className={styles.cardTime}>{review.timeAgo}</p>
        </div>
      </div>
    </motion.article>
  );
}
```

**Animación — detalle:**
- **Entrada**: `staggerItem` → `opacity 0→1`, `y: 36px→0`, `scale: 0.97→1`, duración 0.6s, ease Apple. Se dispara desde el `staggerContainer` del carrusel (Tarea 1.9).
- **Hover** (`cardHover`): la tarjeta sube 10px y la sombra pasa de `--gbe-shadow-soft` a `--gbe-shadow-hover` con un spring suave (stiffness 220 / damping 22). Al hacer click/tap, `scale: 0.98` (feedback táctil).
- **Avatar**: animación infinita `floatLoop` (sube y baja 6px cada 4s) **solo si** `magicEnabled` (respeta reduced-motion). Da la sensación de "vida" sutil sin ser molesta.

**CSS:**
```css
.card {
  background: var(--gbe-white);
  border: 1px solid var(--gbe-border);
  border-radius: var(--gbe-radius-md);
  box-shadow: var(--gbe-shadow-soft);
  padding: 28px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: default;
}
.cardText {
  font-size: 15px;
  line-height: 1.6;
  color: var(--gbe-text);
}
.cardFooter { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.avatar { border-radius: 50%; object-fit: cover; }
.cardName { font-weight: 600; font-size: 14px; color: var(--gbe-navy-900); }
.cardTime { font-size: 12px; color: var(--gbe-text-muted); }
```

### Tarea 1.9 — `ReviewsCarousel.jsx` (carrusel con drag + stagger + flechas)
```jsx
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { staggerContainer } from "@/lib/motion-variants";
import ReviewCard from "./ReviewCard";
import { reviews } from "./reviews.data";
import styles from "./Reviews.module.css";

export default function ReviewsCarousel() {
  const trackRef = useRef(null);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    const card = track.querySelector("article");
    const distance = card.offsetWidth + 24; // ancho + gap
    track.scrollBy({ left: dir * distance, behavior: "smooth" });
  };

  return (
    <div className={styles.carouselWrapper}>
      <motion.button
        aria-label="Reseña anterior"
        className={styles.arrow}
        onClick={() => scrollByCard(-1)}
        whileHover={{ scale: 1.1, backgroundColor: "var(--gbe-navy-900)" }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        ‹
      </motion.button>

      <motion.div
        ref={trackRef}
        className={styles.track}
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </motion.div>

      <motion.button
        aria-label="Reseña siguiente"
        className={styles.arrow}
        onClick={() => scrollByCard(1)}
        whileHover={{ scale: 1.1, backgroundColor: "var(--gbe-navy-900)" }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        ›
      </motion.button>
    </div>
  );
}
```

**Animación — detalle:**
- `staggerContainer(0.12)` en `.track` → las tarjetas aparecen una tras otra (120ms de diferencia) cuando el 20% del carrusel entra en viewport.
- Las flechas (`.arrow`): círculo blanco con borde, en hover se agrandan `scale: 1.1` y el fondo se vuelve azul marino (`--gbe-navy-900`) con spring; en tap, `scale: 0.92` (sensación de "botón pulsado").
- El scroll horizontal usa `scroll-behavior: smooth` nativo + `scrollBy` calculado dinámicamente (no hardcodear anchos).

**CSS:**
```css
.carouselWrapper { display: flex; align-items: center; gap: 16px; }
.track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding-bottom: 8px;
}
.track::-webkit-scrollbar { display: none; }
.track > * { scroll-snap-align: start; }

.arrow {
  flex-shrink: 0;
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 1px solid var(--gbe-border);
  background: var(--gbe-white);
  color: var(--gbe-navy-900);
  font-size: 22px;
  display: flex; align-items: center; justify-content: center;
}
.arrow:hover { color: var(--gbe-white); }

@media (max-width: 768px) {
  .arrow { display: none; } /* en móvil, solo swipe táctil */
  .track > * { min-width: 85vw; }
}
```

### Tarea 1.10 — Conteo animado del "100%"
**Refinamiento opcional pero recomendado** dentro de `ReviewsHeader.jsx`: sustituir `<strong>100%</strong>` por un componente que cuenta de 0 a 100 cuando entra en viewport.

**Archivo nuevo:** `src/components/sections/Reviews/CountUp.jsx`
```jsx
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

export default function CountUp({ to = 100, suffix = "%" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.8 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v) + suffix);

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 1.4, ease: "easeOut" });
    }
  }, [isInView]);

  return (
    <motion.span ref={ref} className="highlight">
      {rounded}
    </motion.span>
  );
}
```
Uso: `Tenemos un <CountUp to={100} /> de valoraciones positivas en Google.`

**Animación — detalle:** el número sube de 0 a 100 en 1.4s con `ease: "easeOut"` la primera vez que el bloque entra en pantalla. Combinado con el color dorado (`--gbe-gold`), da el efecto "mágico" de un resultado que se revela.

### Tarea 1.11 — Schema.org / SEO de la sección (importante, según el estudio SEO)
**Archivo:** donde se gestionen los `<head>`/metadatos de la home (`SeoHead.jsx`, `Layout.astro`, etc.)

Añadir JSON-LD con los datos reales del negocio (sustituir `ratingValue` y `reviewCount` por los reales del perfil de Google Business):

```jsx
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Getxo Bela Eskola",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "REEMPLAZAR_CON_NUMERO_REAL"
  }
})}
</script>
```

**Criterio de aceptación:** el JSON-LD valida en https://search.google.com/test/rich-results y `reviewCount` coincide con el número real de reseñas en Google Maps.

### ✅ Definition of Done — Fase 1
- [ ] Texto exacto del enunciado (1.2) presente y revisado en ES (y EU si aplica).
- [ ] Mínimo 6 reseñas **reales** de Google cargadas en `reviews.data.js`.
- [ ] Estrellas con animación "pop" en cascada al hacer scroll.
- [ ] Carrusel funciona con flechas, drag/swipe y `scroll-snap`.
- [ ] Hover de tarjeta = elevación + sombra suave (sin saltos brutos).
- [ ] `prefers-reduced-motion` respetado (avatares no flotan si está activado).
- [ ] JSON-LD `AggregateRating` añadido y validado.

---

## FASE 2 — Sección Blog ("CONSULTA NUESTRO BLOG")

> Resultado visual esperado: título centrado, debajo 3 tarjetas grandes con imagen a sangre, badge "FIJADO" con brillo sutil, categoría, título en negrita y autor — con efecto "zoom Apple" en la imagen al pasar el ratón y un tilt 3D ligero en toda la tarjeta.

### Tarea 2.1 — Estructura de archivos
**Crear:**
```
src/components/sections/Blog/
  BlogSection.jsx
  BlogCard.jsx
  BlogBadge.jsx
  CategoryFilter.jsx
  blog.data.js
  Blog.module.css
```

### Tarea 2.2 — Datos de posts: `blog.data.js`
**⚠️ Sustituir `author` y contenido real (ver aviso 0.2).** Estructura:

```js
// src/components/sections/Blog/blog.data.js
export const blogPosts = [
  {
    id: "aguas-jurisdiccionales",
    category: "aprendizaje", // "aprendizaje" | "noticias-eventos"
    pinned: true,
    image: "/images/blog/aguas-jurisdiccionales.webp",
    author: "Getxo Bela Eskola",
    titleEs: "Aguas jurisdiccionales españolas: el mar territorial español",
    titleEu: "Espainiako ur jurisdikzionalak: itsas lurralde espainiarra",
    slugEs: "aguas-jurisdiccionales-espanolas-mar-territorial",
    slugEu: "espainiako-ur-jurisdikzionalak-itsas-lurraldea",
    dateEs: "Hace 2 semanas",
  },
  {
    id: "jarcia-velero",
    category: "aprendizaje",
    pinned: true,
    image: "/images/blog/jarcia-velero.webp",
    author: "Getxo Bela Eskola",
    titleEs: "Jarcia de un velero: qué es y cuáles son sus componentes",
    titleEu: "Belaontziko maromeria: zer da eta zeintzuk dira osagaiak",
    slugEs: "jarcia-de-un-velero-componentes",
    slugEu: "belaontziko-maromeria-osagaiak",
    dateEs: "Hace 1 mes",
  },
  {
    id: "patron-yate-pro",
    category: "noticias-eventos",
    pinned: true,
    image: "/images/blog/patron-yate-pro.webp",
    author: "Getxo Bela Eskola",
    titleEs: "Patrón de Yate Pro: nuevas atribuciones para realizar chárter",
    titleEu: "Yate Pro patroia: charter egiteko eskumen berriak",
    slugEs: "patron-de-yate-pro-atribuciones-charter",
    slugEu: "yate-pro-patroia-eskumen-berriak",
    dateEs: "Hace 1 mes",
  },
];
```

**Imágenes/dibujos necesarios** (encargar/seleccionar antes de programar la tarjeta):
1. **Aguas jurisdiccionales** → foto de horizonte de mar al atardecer desde un velero (similar al boceto).
2. **Jarcia de un velero** → foto de cabos/poleas/mástil en primer plano, alto contraste.
3. **Patrón de Yate Pro** → foto de grupo de alumnos en cubierta, ambiente social/chárter.

Formato recomendado: `.webp`, 4:3, mínimo 1200x900px, comprimidas <200KB.

### Tarea 2.3 — Wireframe

**Desktop (≥1024px):**
```
┌──────────────────────────────────────────────────────────────────┐
│                     CONSULTA NUESTRO BLOG                         │
│        [Noticias y Eventos]   [Aprendizaje]   ← filtro pill        │
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│  │  [imagen]    │   │  [imagen]    │   │  [imagen]    │           │
│  │  FIJADO      │   │  FIJADO      │   │  FIJADO      │           │
│  │              │   │              │   │              │           │
│  │ por Getxo... │   │ por Getxo... │   │ por Getxo... │           │
│  │ Título del   │   │ Título del   │   │ Título del   │           │
│  │ artículo     │   │ artículo     │   │ artículo     │           │
│  └──────────────┘   └──────────────┘   └──────────────┘           │
│                                                                     │
│                  [ Ver todas las entradas → ]                     │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile:** 1 columna, tarjetas a ancho completo, filtro de categorías en scroll horizontal.

### Tarea 2.4 — `BlogSection.jsx`
```jsx
import { motion } from "framer-motion";
import { staggerContainer, wordContainer, wordItem } from "@/lib/motion-variants";
import BlogCard from "./BlogCard";
import { blogPosts } from "./blog.data";
import styles from "./Blog.module.css";

const TITLE_WORDS = "CONSULTA NUESTRO BLOG".split(" ");

export default function BlogSection() {
  return (
    <section className={styles.section} aria-labelledby="blog-heading">
      <motion.h2
        id="blog-heading"
        className={styles.title}
        variants={wordContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
      >
        {TITLE_WORDS.map((word, i) => (
          <motion.span key={i} variants={wordItem} style={{ display: "inline-block", marginRight: "0.3em" }}>
            {word}
          </motion.span>
        ))}
      </motion.h2>

      <motion.div
        className={styles.grid}
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </motion.div>

      <div className={styles.ctaWrapper}>
        <MagneticCTA href="/es/blog">Ver todas las entradas</MagneticCTA>
      </div>
    </section>
  );
}
```

**Animación — detalle del título:**
- `wordContainer` (stagger 0.06s) + `wordItem` (`opacity 0→1`, `y: 0.4em → 0`) → cada palabra de "CONSULTA NUESTRO BLOG" sube ligeramente y aparece con 60ms de diferencia. Efecto editorial tipo Apple keynote.

### Tarea 2.5 — `BlogBadge.jsx` ("FIJADO" con shimmer)
```jsx
import { motion } from "framer-motion";
import { useMagicMotion } from "@/lib/useMagicMotion";

export default function BlogBadge() {
  const { magicEnabled } = useMagicMotion();
  return (
    <motion.span
      className="blog-badge"
      animate={magicEnabled ? { backgroundPositionX: ["0%", "200%"] } : {}}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    >
      FIJADO
    </motion.span>
  );
}
```

**CSS:**
```css
.blog-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--gbe-navy-900);
  border-radius: var(--gbe-radius-pill);
  background: linear-gradient(
    90deg,
    var(--gbe-white) 0%,
    var(--gbe-gold-soft) 50%,
    var(--gbe-white) 100%
  );
  background-size: 200% 100%;
}
```

**Animación — detalle:** el gradiente dorado se desliza de izquierda a derecha en bucle (2.5s, lineal) → efecto "brillo" sutil sobre la etiqueta "FIJADO", como un reflejo de luz. Se desactiva si `prefers-reduced-motion`.

### Tarea 2.6 — `BlogCard.jsx` (tilt 3D + zoom de imagen)
```jsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { staggerItem, easeApple } from "@/lib/motion-variants";
import { useMagicMotion } from "@/lib/useMagicMotion";
import BlogBadge from "./BlogBadge";
import styles from "./Blog.module.css";

export default function BlogCard({ post }) {
  const { magicEnabled } = useMagicMotion();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);

  function handleMouseMove(e) {
    if (!magicEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }
  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.a
      href={`/es/blog/${post.slugEs}`}
      className={styles.card}
      variants={staggerItem}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: magicEnabled ? rotateX : 0,
        rotateY: magicEnabled ? rotateY : 0,
        transformPerspective: 1000,
      }}
      whileHover={{ boxShadow: "var(--gbe-shadow-hover)" }}
    >
      <div className={styles.imageWrapper}>
        <motion.img
          src={post.image}
          alt={post.titleEs}
          className={styles.image}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: easeApple }}
        />
        {post.pinned && <div className={styles.badgeWrapper}><BlogBadge /></div>}
      </div>

      <div className={styles.cardBody}>
        <span className={styles.category}>
          {post.category === "aprendizaje" ? "Aprendizaje" : "Noticias y Eventos"}
        </span>
        <p className={styles.author}>por {post.author}</p>
        <h3 className={styles.cardTitle}>{post.titleEs}</h3>
      </div>
    </motion.a>
  );
}
```

**Animación — detalle:**
1. **Entrada**: `staggerItem` (igual que en reseñas) con `staggerContainer(0.15)` en `BlogSection.jsx` → las 3 tarjetas aparecen de izquierda a derecha, 150ms de diferencia.
2. **Tilt 3D** (escritorio, `magicEnabled` true): la tarjeta entera rota hasta ±4° en X/Y según la posición del ratón dentro de ella (`useMotionValue` + `useTransform`), con `transformPerspective: 1000`. Vuelve a 0 al salir el ratón. **Muy sutil** — si se nota "mareante", bajar el rango a ±2°.
3. **Zoom de imagen**: `<motion.img whileHover={{ scale: 1.08 }}>` dentro de un contenedor `overflow: hidden` → efecto típico de tarjetas de producto Apple. Duración 0.6s, ease Apple.
4. **Sombra**: al hover, la tarjeta entera gana `--gbe-shadow-hover`.

**CSS:**
```css
.card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: var(--gbe-radius-lg);
  overflow: hidden;
  background: var(--gbe-white);
  border: 1px solid var(--gbe-border);
  box-shadow: var(--gbe-shadow-soft);
}
.imageWrapper { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
.image { width: 100%; height: 100%; object-fit: cover; display: block; }
.badgeWrapper { position: absolute; top: 16px; left: 16px; }

.cardBody { padding: 24px; }
.category {
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--gbe-navy-500);
}
.author { font-size: 13px; color: var(--gbe-text-muted); margin: 8px 0 4px; }
.cardTitle {
  font-family: var(--gbe-font-display);
  font-size: 20px; line-height: 1.35; font-weight: 600;
  color: var(--gbe-navy-900);
}
```

### Tarea 2.7 — `MagneticCTA` (botón "magnético")
**Archivo nuevo:** `src/components/ui/MagneticCTA.jsx`
```jsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMagicMotion } from "@/lib/useMagicMotion";

export default function MagneticCTA({ href, children }) {
  const { magicEnabled } = useMagicMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(e) {
    if (!magicEnabled) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  return (
    <motion.a
      ref={ref}
      href={href}
      className="magnetic-cta"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
      <motion.span className="arrow" whileHover={{ x: 4 }}>→</motion.span>
    </motion.a>
  );
}
```

**CSS:**
```css
.magnetic-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 16px 32px;
  border-radius: var(--gbe-radius-pill);
  background: var(--gbe-navy-900);
  color: var(--gbe-white);
  font-weight: 600;
  text-decoration: none;
}
.arrow { display: inline-block; }
```

**Animación — detalle:** el botón "persigue" ligeramente el cursor cuando este está cerca (desplazamiento = 30% de la distancia al centro, suavizado con `useSpring`), y la flecha `→` se desliza 4px a la derecha en hover. Al soltar el cursor, vuelve a su sitio con resorte. Efecto muy característico de webs "premium".

### Tarea 2.8 — `CategoryFilter.jsx` (pills con "magia" de layout compartido)
```jsx
import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "noticias-eventos", label: "Noticias y Eventos" },
  { id: "aprendizaje", label: "Aprendizaje" },
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className="category-filter__item"
          onClick={() => onChange(cat.id)}
        >
          {active === cat.id && (
            <motion.span
              layoutId="active-pill"
              className="category-filter__pill"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="category-filter__label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
```

**CSS:**
```css
.category-filter { display: inline-flex; gap: 4px; padding: 4px; background: var(--gbe-mist); border-radius: var(--gbe-radius-pill); }
.category-filter__item { position: relative; padding: 10px 20px; border-radius: var(--gbe-radius-pill); background: transparent; font-size: 14px; font-weight: 600; color: var(--gbe-text-muted); cursor: pointer; }
.category-filter__pill { position: absolute; inset: 0; background: var(--gbe-white); border-radius: var(--gbe-radius-pill); box-shadow: var(--gbe-shadow-soft); z-index: 0; }
.category-filter__label { position: relative; z-index: 1; }
```

**Animación — detalle:** este es el famoso **"layout animation"** de Framer Motion: el fondo blanco (`category-filter__pill`) **se desliza** de una pestaña a otra (no aparece/desaparece) gracias a `layoutId="active-pill"` compartido, con spring (stiffness 350 / damping 30). Es uno de los efectos que más "magia" transmite con menos código.

> Nota: este filtro se usa en la **página índice del blog** (`/es/blog`), no necesariamente en la home. En la home (`BlogSection.jsx`) puede omitirse si solo se muestran 3 destacados.

### ✅ Definition of Done — Fase 2
- [ ] Título "CONSULTA NUESTRO BLOG" con revelado palabra a palabra.
- [ ] 3 tarjetas con imágenes propias (no placeholders), autor "Getxo Bela Eskola".
- [ ] Badge "FIJADO" con shimmer dorado (desactivable con reduced-motion).
- [ ] Zoom de imagen + tilt 3D suave en hover de tarjeta.
- [ ] CTA "Ver todas las entradas" con efecto magnético + flecha animada.
- [ ] Cada tarjeta enlaza a un slug real `/es/blog/...` (y su equivalente `/eu/blog/...`).

---

## FASE 3 — Capa transversal de "magia" (efectos compartidos)

> Estos elementos no pertenecen a una sección concreta: viven en el layout o se insertan **entre** las secciones 1 y 2 (y opcionalmente entre el Hero y la sección de Valoraciones).

### Tarea 3.1 — Divisor "ola" animado (elemento de firma)
**Archivo nuevo:** `src/components/ui/WaveDivider.jsx`

```jsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WaveDivider() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <div ref={ref} style={{ width: "100%", height: 80 }}>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" width="100%" height="80">
        <motion.path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40"
          fill="none"
          stroke="var(--gbe-navy-900)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
```

**Uso:** colocar `<WaveDivider />` entre `<ReviewsSection />` y `<BlogSection />`.

**Animación — detalle:** la línea de la ola se **"dibuja" progresivamente** a medida que el usuario hace scroll por esa zona (`scrollYProgress` mapeado de `[0, 0.6]` a `pathLength [0, 1]`). Es el **elemento de firma** del diseño: conecta visualmente "confianza" (reseñas) con "contenido" (blog) y refuerza la identidad náutica sin usar iconos genéricos.

### Tarea 3.2 — Brillo ambiental que sigue el cursor (solo escritorio)
**Archivo nuevo:** `src/components/ui/AmbientGlow.jsx`

```jsx
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMagicMotion } from "@/lib/useMagicMotion";

export default function AmbientGlow() {
  const { magicEnabled } = useMagicMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!magicEnabled) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [magicEnabled]);

  if (!magicEnabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        left: springX, top: springY,
        width: 400, height: 400,
        marginLeft: -200, marginTop: -200,
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--gbe-gold-soft) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(40px)",
      }}
    />
  );
}
```

**Uso:** insertar una sola vez en el layout general de la página (no por sección), detrás del contenido (`zIndex: 0`).

**Animación — detalle:** un círculo de luz dorada muy difusa (`blur 40px`, opacidad baja vía `--gbe-gold-soft`) sigue al cursor con un retraso elástico (`useSpring`, stiffness 60). Da sensación de "calidez"/"sol sobre el agua" sin distraer. **Desactivado automáticamente** si `prefers-reduced-motion` o en táctil (no hay `mousemove`).

### Tarea 3.3 — Partículas "destello" al hacer click en un CTA
**Archivo nuevo:** `src/components/ui/SparkleBurst.jsx`

```jsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SparkleBurst({ trigger }) {
  const [bursts, setBursts] = useState([]);

  function addBurst(e) {
    const id = Date.now();
    const { clientX: x, clientY: y } = e;
    setBursts((b) => [...b, { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 700);
  }

  return (
    <span onClickCapture={addBurst} style={{ display: "contents" }}>
      {trigger}
      <AnimatePresence>
        {bursts.map((b) => (
          <span key={b.id} style={{ position: "fixed", left: b.x, top: b.y, pointerEvents: "none", zIndex: 50 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: Math.cos(angle) * 30, y: Math.sin(angle) * 30, scale: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    position: "absolute", width: 6, height: 6, borderRadius: "50%",
                    background: "var(--gbe-gold)",
                  }}
                />
              );
            })}
          </span>
        ))}
      </AnimatePresence>
    </span>
  );
}
```

**Uso:** envolver el `MagneticCTA` del blog (y, si se quiere, el botón principal de reserva del Hero):
```jsx
<SparkleBurst trigger={<MagneticCTA href="/es/blog">Ver todas las entradas</MagneticCTA>} />
```

**Animación — detalle:** al hacer click, 6 puntos dorados salen disparados en círculo desde el punto del click y se desvanecen en 0.6s (`AnimatePresence` gestiona la entrada/salida del DOM). Efecto "chispa mágica" puntual — usar con moderación, **máximo 1-2 CTAs por página**.

### ✅ Definition of Done — Fase 3
- [ ] `WaveDivider` colocado entre Valoraciones y Blog, se dibuja al hacer scroll.
- [ ] `AmbientGlow` activo solo en escritorio y sin `prefers-reduced-motion`.
- [ ] `SparkleBurst` aplicado como máximo a 1-2 CTAs (no saturar).
- [ ] Ningún efecto de Fase 3 bloquea clics (`pointerEvents: none` donde corresponda).

---

## FASE 4 — QA, Accesibilidad y Rendimiento

### Tarea 4.1 — Checklist responsive
Probar en: 320px, 375px, 768px, 1024px, 1440px.
- [ ] El carrusel de reseñas no desborda horizontalmente la página (solo su propio contenedor).
- [ ] Las 3 tarjetas de blog pasan de fila de 3 → 1 columna en `<1024px`.
- [ ] El filtro de categorías (si se usa en home) hace scroll horizontal en móvil sin cortar texto.

### Tarea 4.2 — `prefers-reduced-motion`
- [ ] Confirmar que `useMagicMotion()` se usa en: `floatLoop` (avatares), `BlogBadge` shimmer, `AmbientGlow`, `SparkleBurst`, tilt 3D de `BlogCard`.
- [ ] Las animaciones de **entrada** (`fadeUp`, `staggerItem`, `starPop`) pueden mantenerse incluso con reduced-motion, pero **reducir duración a 0.2s** y eliminar `scale`/`rotate` grandes. Ejemplo de ajuste:
```jsx
const { magicEnabled } = useMagicMotion();
const transition = magicEnabled
  ? { duration: 0.6, ease: easeApple }
  : { duration: 0.2 };
```

### Tarea 4.3 — Imágenes y rendimiento
- [ ] Todas las imágenes de `blog.data.js` y `reviews.data.js` en `.webp`, con `loading="lazy"` (excepto la primera tarjeta visible, que puede ir `loading="eager"`).
- [ ] Si el framework lo soporta, usar `next/image` (o equivalente) para `srcset` automático.
- [ ] `AmbientGlow` y `SparkleBurst` deben importarse con carga diferida (`dynamic(() => import(...), { ssr: false })` en Next.js) para no penalizar el bundle inicial.

### Tarea 4.4 — Objetivo Lighthouse
- [ ] Performance ≥ 90 (móvil)
- [ ] Accessibility ≥ 95
- [ ] Comprobar especialmente Safari/iOS: `backdrop-filter` y `filter: blur()` del `AmbientGlow` tienen coste en iOS — si el FPS cae, reducir el `blur` a 24px o desactivar en `<768px`.

---

## FASE 5 — Contenido y operativa SEO continua (sin código)

> Esta fase es **recurrente** (mensual), no "se termina" — es el motor que justifica las dos secciones a nivel SEO según el estudio realizado.

### Tarea 5.1 — Sustituir contenido de ejemplo (bloqueante antes de publicar)
- [ ] Exportar mínimo 6-8 reseñas reales de 5★ desde Google Business Profile → `reviews.data.js`.
- [ ] Cambiar "por Escola Port" → "por Getxo Bela Eskola" en todos los posts.
- [ ] Redactar/encargar el contenido real de los 3 artículos destacados (pueden mantener los temas del boceto: aguas jurisdiccionales, jarcia, Patrón de Yate Pro — son buenos para SEO de "Aprendizaje").

### Tarea 5.2 — Estrategia activa de captación de reseñas (según estudio SEO)
- [ ] Crear un mensaje/plantilla corto para enviar a alumnos al finalizar el curso, pidiendo reseña en Google.
- [ ] La plantilla debe **sugerir de forma natural** mencionar palabras como: `monitor`, `velero`, `seguridad`, `aprender` (mejora el SEO local frente a competidores como Polaris Nautika Eskola, que destaca en reseñas 5.0).
- [ ] Ejemplo de plantilla (ajustar tono):
  > "¡Gracias por navegar con nosotros! Si te ha gustado la experiencia, nos ayudaría mucho que dejaras una reseña en Google contándonos qué tal fue tu aprendizaje, cómo viste la seguridad a bordo y qué te pareció tu monitor 🙂"

### Tarea 5.3 — Calendario editorial del blog (mínimo 1 entrada/mes)
- [ ] Crear hoja de cálculo/tablero con columnas: `Mes | Tema | Categoría (Noticias y Eventos / Aprendizaje) | Keyword objetivo | Borrador ES | Traducción EU | Publicado`.
- [ ] Ejemplo de arranque (3 meses):

| Mes | Tema | Categoría | Keyword objetivo |
|---|---|---|---|
| Mes 1 | Aguas jurisdiccionales españolas | Aprendizaje | "mar territorial español" |
| Mes 2 | Jarcia de un velero: componentes | Aprendizaje | "aprender a navegar en la mar" |
| Mes 3 | Patrón de Yate Pro: atribuciones chárter | Noticias y Eventos | "patrón de yate getxo" |

### Tarea 5.4 — Checklist bilingüe ES/EU (por cada post nuevo)
- [ ] Publicar versión en castellano (`/es/blog/<slug>`).
- [ ] Traducir y publicar versión en euskera (`/eu/blog/<slug-eu>`).
- [ ] Verificar etiquetas `hreflang` entre ambas versiones.
- [ ] Verificar que `blog.data.js` tenga `titleEs`/`titleEu` y `slugEs`/`slugEu` rellenos para ambas.

### ✅ Definition of Done — Fase 5
- [ ] 0 textos de ejemplo (EmbedSocial/Escola Port) restantes en producción.
- [ ] Plantilla de petición de reseñas en uso activo.
- [ ] Calendario editorial creado y primer mes publicado en ES + EU.

---

## Anexo A — Resumen de toda la "magia" Framer Motion (tabla rápida)

| Elemento | Efecto | Parámetros clave |
|---|---|---|
| Titular "¡LA VELA NO DEJA...!" + líneas | Fade + subida al hacer scroll | `staggerItem`, ease Apple, 0.6s |
| "100%" | Conteo animado 0→100 | `animate()`, 1.4s, easeOut |
| Estrellas (★★★★★) | Pop con rotación, en cascada | `springPop`, stagger 0.08s |
| Tarjetas de reseña | Entrada en cascada + hover elevación | `staggerItem` + `cardHover` |
| Avatares | Flotación infinita sutil | `floatLoop`, 4s loop |
| Flechas del carrusel | Hover escala + cambio de color | spring 300/20 |
| Título "CONSULTA NUESTRO BLOG" | Revelado palabra a palabra | `wordContainer`/`wordItem`, stagger 0.06s |
| Badge "FIJADO" | Shimmer dorado en bucle | `backgroundPositionX`, 2.5s linear |
| Imagen de tarjeta blog | Zoom 1.08x en hover | 0.6s, ease Apple |
| Tarjeta blog completa | Tilt 3D ±4° según cursor | `useTransform` mouseX/mouseY |
| Filtro de categorías | Pill que se desliza (layout animation) | `layoutId`, spring 350/30 |
| CTA "Ver todas las entradas" | Efecto magnético + flecha deslizante | `useSpring` 150/15 |
| Divisor entre secciones | Ola que se dibuja con el scroll | `useScroll` + `pathLength` |
| Fondo global | Brillo dorado que sigue al cursor | `useSpring` 60/20, blur 40px |
| Click en CTA (opcional, máx. 1-2) | Ráfaga de 6 chispas doradas | `AnimatePresence`, 0.6s easeOut |

---

## Anexo B — Checklist atómico final (para ir marcando)

```
FASE 0
[ ] 0.1 framer-motion instalado
[ ] 0.2 tokens.css creado e importado globalmente
[ ] 0.3 motion-variants.js creado
[ ] 0.4 useMagicMotion.js creado

FASE 1 — Valoraciones
[ ] 1.1 estructura de carpetas
[ ] 1.2 copy exacto colocado (ES, revisar EU)
[ ] 1.4 ReviewsSection maquetada
[ ] 1.5 ReviewsHeader (grid 2 col)
[ ] 1.6 reviews.data.js con reseñas REALES (no EmbedSocial demo)
[ ] 1.7 StarRating con pop en cascada
[ ] 1.8 ReviewCard con stagger + hover + avatar flotante
[ ] 1.9 ReviewsCarousel con flechas + drag/swipe
[ ] 1.10 CountUp del 100% (opcional)
[ ] 1.11 JSON-LD AggregateRating

FASE 2 — Blog
[ ] 2.1 estructura de carpetas
[ ] 2.2 blog.data.js con autor real + imágenes propias
[ ] 2.4 BlogSection con título palabra a palabra
[ ] 2.5 BlogBadge "FIJADO" con shimmer
[ ] 2.6 BlogCard con zoom + tilt 3D
[ ] 2.7 MagneticCTA
[ ] 2.8 CategoryFilter (si aplica en home o en /blog)

FASE 3 — Magia transversal
[ ] 3.1 WaveDivider entre secciones
[ ] 3.2 AmbientGlow global
[ ] 3.3 SparkleBurst (máx. 1-2 CTAs)

FASE 4 — QA
[ ] 4.1 responsive 320-1440px
[ ] 4.2 prefers-reduced-motion en todos los loops
[ ] 4.3 imágenes lazy + webp
[ ] 4.4 Lighthouse ≥ 90 / ≥ 95

FASE 5 — Contenido/SEO (recurrente)
[ ] 5.1 contenido de ejemplo sustituido
[ ] 5.2 plantilla de petición de reseñas en uso
[ ] 5.3 calendario editorial creado
[ ] 5.4 checklist bilingüe ES/EU por post
```

---

## Anexo C — Si el sitio NO usa React (estático/Hugo/Astro sin islas)

Sustituir `framer-motion` por **`motion`** (la versión vanilla-JS de la misma librería, de motion.dev — misma sintaxis de `animate()` y curvas de easing). Equivalencias:

- `whileInView` → `inView(selector, () => animate(...))`
- `staggerChildren` → bucle `animate(elements, {...}, { delay: stagger(0.1) })`
- `useScroll` + `pathLength` (WaveDivider) → `scroll(animate(path, { strokeDashoffset: [...] }))`
- El resto de tokens de color/espaciado (`tokens.css`) y la estructura de wireframes/copy de las Fases 1 y 2 **no cambian**.
