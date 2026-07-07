# PLAN DE IMPLEMENTACIÓN ATÓMICO
## Sección 5 — "Nuestra Promesa" (Home) — getxobelaeskola.cloud

> Para el agente ejecutor: sigue este documento en orden. Cada bloque de código es final, no requiere interpretación. Si un valor no está aquí, no lo inventes — pregunta antes de continuar.

---

## 0. CONTEXTO Y OBJETIVO

Reemplazar la sección actual "Nuestra promesa / ¿Por qué navegar con nosotros?" por 3 tarjetas flip-card en 3D, con:
- Cara frontal: icono + título corto + frase gancho.
- Cara trasera: etiqueta de categoría + descripción completa.
- Fondo blanco, estética "Apple-clean", acento azul marino de marca (`#001B3A`, color de marca confirmado en el `theme-color` del sitio) + un dorado náutico como acento secundario.
- Efecto flip adaptado del ejemplo entregado, pero rediseñado (sin gradientes verde/naranja del ejemplo original, que no pertenecen a la marca).
- **Debe funcionar en móvil** (el ejemplo original solo soporta `:hover`, que no existe en touch — este plan añade toggle por click/tap obligatorio).

---

## 1. DESIGN TOKENS (fuente única de verdad)

```css
:root {
  /* Color */
  --color-navy-900: #001B3A;   /* marca — fondo cara trasera, texto principal */
  --color-navy-700: #0A2E52;   /* variante para gradiente sutil en cara trasera */
  --color-white:    #FFFFFF;
  --color-off-white:#F7F8FA;   /* fondo de sección, no blanco puro */
  --color-gold:     #C6A15B;   /* acento náutico secundario (latón/madera de cubierta) */
  --color-gold-soft:#E9DCC3;   /* halo/hover del icono */
  --color-ink:      #1C2530;   /* texto de párrafo sobre blanco */
  --color-ink-soft: #5B6472;   /* texto secundario/subtítulo */
  --color-border:   #E5E8EC;

  /* Tipografía */
  --font-display: "Fraunces", "Iowan Old Style", Georgia, serif; /* títulos — carácter editorial/náutico */
  --font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif; /* cuerpo — limpio, Apple-like */

  --fs-eyebrow: 0.8125rem;   /* 13px */
  --fs-card-title-front: 1.5rem;   /* 24px */
  --fs-card-title-back: 1.125rem;  /* 18px */
  --fs-body: 1rem;           /* 16px */
  --fs-hook: 0.9375rem;      /* 15px */

  /* Layout */
  --card-w: 320px;
  --card-h: 400px;
  --card-radius: 20px;
  --section-max-w: 1180px;
  --gap: 32px;

  /* Motion */
  --flip-duration: 0.7s;
  --flip-easing: cubic-bezier(0.65, 0, 0.35, 1);

  /* Elevación */
  --shadow-rest: 0 8px 24px rgba(0, 27, 58, 0.08);
  --shadow-hover: 0 20px 40px rgba(0, 27, 58, 0.16);
}
```

**Nota sobre tipografía:** si el sitio ya tiene una fuente cargada globalmente (revisar `layout.tsx` o `_document` del proyecto Next.js), usar esa fuente de cuerpo en vez de `--font-body`, y usar `--font-display` únicamente para los títulos de las tarjetas. No mezclar una tercera familia.

---

## 2. CONTENIDO EXACTO (no reescribir, no resumir)

Mapeo confirmado de 3 tarjetas a partir del texto fuente:

| # | Icono | Categoría (back) | Título (front) | Hook (front) | Descripción (back) |
|---|-------|-------------------|------------------|---------------|----------------------|
| 1 | Moneda / euro | ECONÓMICO | Accesible para todos | Desde 52,5€/mes. Escuela municipal que democratiza la vela. | Creemos que la diversión no debe de ser costosa. Ofrecemos precios ajustados al grupo para que todos puedan disfrutar de una experiencia emocionante en el agua. Descubre cómo podemos ayudarte a planificar una aventura inolvidable a un precio asequible. |
| 2 | Manos estrechándose | COMUNIDAD | Una comunidad real | Conocerás gente con las mismas ganas de mar. Vínculos que duran más allá del velero. | No somos solo una escuela, somos una comunidad muy cercana y con valores. Un lugar donde conocer gente con las mismas ganas de mar, compartir experiencias y crecer navegando juntos. Aquí vienes a aprender, pero también a formar parte de algo. |
| 3 | Brújula | A TU MEDIDA | A tu medida | Adaptamos cada salida a tu ritmo, tus objetivos y tus ganas del día. Sin moldes. | Nos adaptamos a tus necesidades para brindarte una experiencia personalizada y única. Descubre cómo nuestro equipo de expertos en actividades acuáticas puede ayudarte a planificar la excursión perfecta. |

Eyebrow de sección: `¿Por qué navegar con nosotros?`
Título de sección (H2): `Nuestra promesa`

**Regla:** los emojis (💶 🤝 🧭) del texto fuente se usaron solo para que el agente identifique el tema — en la implementación se reemplazan por SVG inline (sección 4), nunca por emoji renderizado.

---

## 3. WIREFRAME ASCII

### Desktop (≥1024px)
```
┌──────────────────────────────────────────────────────────────────┐
│                     ¿Por qué navegar con nosotros?   (eyebrow)    │
│                          Nuestra promesa   (h2)                   │
│                                                                    │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐      │
│   │   [icono]     │   │   [icono]     │   │   [icono]     │      │
│   │               │   │               │   │               │      │
│   │  Accesible    │   │  Una comunidad│   │  A tu medida  │      │
│   │  para todos   │   │  real         │   │               │      │
│   │               │   │               │   │               │      │
│   │  hook text... │   │  hook text... │   │  hook text... │      │
│   │               │   │               │   │               │      │
│   │  ⟲ tap/hover  │   │  ⟲ tap/hover  │   │  ⟲ tap/hover  │      │
│   └───────────────┘   └───────────────┘   └───────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

### Móvil (≤640px) — columna única, tarjetas apiladas
```
┌───────────────────────┐
│ ¿Por qué navegar...?  │
│ Nuestra promesa       │
│                       │
│ ┌───────────────────┐ │
│ │     [icono]        │ │
│ │  Accesible p/todos │ │
│ │  hook...            │ │
│ │  (tap para girar)   │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │  Card 2 ...        │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │  Card 3 ...        │ │
│ └───────────────────┘ │
└───────────────────────┘
```

---

## 4. HTML (estructura exacta)

```html
<section class="promise" aria-labelledby="promise-heading">
  <div class="promise__inner">
    <p class="promise__eyebrow">¿Por qué navegar con nosotros?</p>
    <h2 id="promise-heading" class="promise__title">Nuestra promesa</h2>

    <div class="promise__grid">

      <!-- CARD 1 -->
      <button type="button" class="flip-card" data-flip aria-pressed="false">
        <span class="sr-only">Accesible para todos. Pulsa para ver más detalles.</span>
        <div class="flip-card__inner">
          <div class="flip-card__face flip-card__face--front">
            <span class="flip-card__icon" aria-hidden="true">
              <!-- icono moneda -->
              <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
                <path d="M24 14v20M29 18.5c0-2.5-2.5-4.5-5.5-4.5S18 15.7 18 18.2c0 5 11 3.4 11 8.4 0 2.6-2.7 4.4-6 4.4s-6-1.9-6-4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            <h3 class="flip-card__title">Accesible para todos</h3>
            <p class="flip-card__hook">Desde 52,5€/mes. Escuela municipal que democratiza la vela.</p>
            <span class="flip-card__cta">Descubre más ↻</span>
          </div>
          <div class="flip-card__face flip-card__face--back">
            <span class="flip-card__label">ECONÓMICO</span>
            <p class="flip-card__desc">Creemos que la diversión no debe de ser costosa. Ofrecemos precios ajustados al grupo para que todos puedan disfrutar de una experiencia emocionante en el agua. Descubre cómo podemos ayudarte a planificar una aventura inolvidable a un precio asequible.</p>
          </div>
        </div>
      </button>

      <!-- CARD 2 -->
      <button type="button" class="flip-card" data-flip aria-pressed="false">
        <span class="sr-only">Una comunidad real. Pulsa para ver más detalles.</span>
        <div class="flip-card__inner">
          <div class="flip-card__face flip-card__face--front">
            <span class="flip-card__icon" aria-hidden="true">
              <!-- icono manos -->
              <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                <path d="M6 24l8-8 8 4 6-4 8 6-6 6-8-4-6 4-10-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M14 28l6 6 6-4M28 26l4 4-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <h3 class="flip-card__title">Una comunidad real</h3>
            <p class="flip-card__hook">Conocerás gente con las mismas ganas de mar. Vínculos que duran más allá del velero.</p>
            <span class="flip-card__cta">Descubre más ↻</span>
          </div>
          <div class="flip-card__face flip-card__face--back">
            <span class="flip-card__label">COMUNIDAD</span>
            <p class="flip-card__desc">No somos solo una escuela, somos una comunidad muy cercana y con valores. Un lugar donde conocer gente con las mismas ganas de mar, compartir experiencias y crecer navegando juntos. Aquí vienes a aprender, pero también a formar parte de algo.</p>
          </div>
        </div>
      </button>

      <!-- CARD 3 -->
      <button type="button" class="flip-card" data-flip aria-pressed="false">
        <span class="sr-only">A tu medida. Pulsa para ver más detalles.</span>
        <div class="flip-card__inner">
          <div class="flip-card__face flip-card__face--front">
            <span class="flip-card__icon" aria-hidden="true">
              <!-- icono brujula -->
              <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
                <path d="M30 18l-8 6-4 8 8-6 4-8z" fill="currentColor"/>
              </svg>
            </span>
            <h3 class="flip-card__title">A tu medida</h3>
            <p class="flip-card__hook">Adaptamos cada salida a tu ritmo, tus objetivos y tus ganas del día. Sin moldes.</p>
            <span class="flip-card__cta">Descubre más ↻</span>
          </div>
          <div class="flip-card__face flip-card__face--back">
            <span class="flip-card__label">A TU MEDIDA</span>
            <p class="flip-card__desc">Nos adaptamos a tus necesidades para brindarte una experiencia personalizada y única. Descubre cómo nuestro equipo de expertos en actividades acuáticas puede ayudarte a planificar la excursión perfecta.</p>
          </div>
        </div>
      </button>

    </div>
  </div>
</section>
```

**Reglas atómicas de HTML:**
1. El elemento raíz de cada tarjeta es `<button>`, no `<div>` — necesario para foco de teclado y accesibilidad. Reset de estilos de botón nativo en CSS (sección 5, `.flip-card`).
2. `aria-pressed` se alterna vía JS entre `"false"` y `"true"` cuando la tarjeta está girada.
3. El `<span class="sr-only">` da contexto a lectores de pantalla ya que el giro visual no es perceptible para ellos.
4. Los 3 SVG son inline (no `<img>`) para poder colorearlos con `currentColor` y heredar el color del token de marca.

---

## 5. CSS (completo, adaptado del ejemplo — sin colores del ejemplo original)

```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

.promise {
  background: var(--color-off-white);
  padding: 96px 24px;
}

.promise__inner {
  max-width: var(--section-max-w);
  margin: 0 auto;
  text-align: center;
}

.promise__eyebrow {
  font-family: var(--font-body);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin: 0 0 12px;
}

.promise__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: var(--color-navy-900);
  margin: 0 0 56px;
  font-weight: 600;
}

.promise__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap);
  justify-items: center;
}

@media (max-width: 900px) {
  .promise__grid { grid-template-columns: 1fr; }
}

/* ---------- FLIP CARD ---------- */

.flip-card {
  /* reset de <button> */
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  width: 100%;
  max-width: var(--card-w);
  height: var(--card-h);
  perspective: 1600px;
}

.flip-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform var(--flip-duration) var(--flip-easing);
  transform-style: preserve-3d;
}

/* Desktop: hover gira la tarjeta */
@media (hover: hover) and (pointer: fine) {
  .flip-card:hover .flip-card__inner,
  .flip-card:focus-visible .flip-card__inner {
    transform: rotateY(180deg);
  }
}

/* Touch / click: clase JS gira la tarjeta (ver sección 6) */
.flip-card.is-flipped .flip-card__inner {
  transform: rotateY(180deg);
}

.flip-card__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--card-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  box-shadow: var(--shadow-rest);
  transition: box-shadow var(--flip-duration) var(--flip-easing);
}

.flip-card:hover .flip-card__face,
.flip-card.is-flipped .flip-card__face {
  box-shadow: var(--shadow-hover);
}

.flip-card__face--front {
  background: var(--color-white);
  border: 1px solid var(--color-border);
}

.flip-card__face--back {
  background: linear-gradient(160deg, var(--color-navy-900) 0%, var(--color-navy-700) 100%);
  transform: rotateY(180deg);
  justify-content: flex-start;
  padding-top: 56px;
}

.flip-card__icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-gold-soft);
  color: var(--color-navy-900);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform var(--flip-duration) var(--flip-easing);
}

.flip-card:hover .flip-card__icon,
.flip-card.is-flipped .flip-card__icon {
  transform: scale(1.08);
}

.flip-card__title {
  font-family: var(--font-display);
  font-size: var(--fs-card-title-front);
  color: var(--color-navy-900);
  margin: 0 0 12px;
  font-weight: 600;
}

.flip-card__hook {
  font-family: var(--font-body);
  font-size: var(--fs-hook);
  color: var(--color-ink-soft);
  line-height: 1.5;
  margin: 0 0 20px;
}

.flip-card__cta {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.02em;
}

.flip-card__label {
  font-family: var(--font-body);
  font-size: var(--fs-eyebrow);
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  margin: 0 0 16px;
}

.flip-card__desc {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  color: var(--color-white);
  opacity: 0.92;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* Accesibilidad: respeta reduced motion */
@media (prefers-reduced-motion: reduce) {
  .flip-card__inner,
  .flip-card__icon,
  .flip-card__face {
    transition-duration: 0.01ms !important;
  }
}

/* Foco visible para teclado */
.flip-card:focus-visible {
  outline: 3px solid var(--color-gold);
  outline-offset: 4px;
  border-radius: var(--card-radius);
}
```

**Reglas atómicas de CSS:**
1. No copiar `.flip::before` / `.flip::after` del ejemplo original — esos pseudo-elementos generaban el gradiente verde/blanco/naranja, que no pertenece a la marca. Quedan eliminados en este rediseño; el color de la cara trasera es el `linear-gradient` navy definido arriba.
2. `perspective` vive en `.flip-card` (contenedor), no en `.flip-card__inner` — si se pone en el elemento que rota, el 3D no se aprecia correctamente.
3. El giro por `:hover` **y** por clase `.is-flipped` deben coexistir sin conflicto: en desktop basta el hover; en touch, JS añade `.is-flipped`.
4. `backface-visibility: hidden` es obligatorio en ambas caras o se verá el texto de la cara trasera "espejado" a través de la delantera durante el giro.

---

## 6. JAVASCRIPT (toggle táctil + accesibilidad de teclado)

```html
<script>
  document.querySelectorAll('[data-flip]').forEach((card) => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    });
  });
</script>
```

**Reglas atómicas de JS:**
1. Este script debe ir en un componente cliente si el proyecto es Next.js App Router — usar `"use client"` y `useEffect`, o convertir a un componente `FlipCard.tsx` con `useState` (ver sección 7, versión React).
2. El evento es `click`, que funciona tanto en touch como en desktop con mouse — en desktop, el `:hover` de CSS ya gira la tarjeta antes del click, así que el click adicional simplemente la "fija" girada (comportamiento aceptado, no requiere corrección).
3. No usar `touchstart` — dispara doble evento junto con `click` en la mayoría de navegadores móviles.

---

## 7. VERSIÓN REACT/NEXT.JS (si el proyecto usa componentes)

```tsx
"use client";
import { useState } from "react";

type FlipCardProps = {
  icon: React.ReactNode;
  title: string;
  hook: string;
  label: string;
  description: string;
};

export function FlipCard({ icon, title, hook, label, description }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`flip-card ${flipped ? "is-flipped" : ""}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="sr-only">{title}. Pulsa para ver más detalles.</span>
      <div className="flip-card__inner">
        <div className="flip-card__face flip-card__face--front">
          <span className="flip-card__icon" aria-hidden="true">{icon}</span>
          <h3 className="flip-card__title">{title}</h3>
          <p className="flip-card__hook">{hook}</p>
          <span className="flip-card__cta">Descubre más ↻</span>
        </div>
        <div className="flip-card__face flip-card__face--back">
          <span className="flip-card__label">{label}</span>
          <p className="flip-card__desc">{description}</p>
        </div>
      </div>
    </button>
  );
}
```

Uso en la sección:
```tsx
<FlipCard
  icon={<CoinIcon />}
  title="Accesible para todos"
  hook="Desde 52,5€/mes. Escuela municipal que democratiza la vela."
  label="ECONÓMICO"
  description="Creemos que la diversión no debe de ser costosa. Ofrecemos precios ajustados al grupo para que todos puedan disfrutar de una experiencia emocionante en el agua. Descubre cómo podemos ayudarte a planificar una aventura inolvidable a un precio asequible."
/>
```
(Repetir para las 3 tarjetas con los datos de la tabla de la sección 2. Extraer los 3 SVG de la sección 4 a componentes `CoinIcon`, `HandsIcon`, `CompassIcon`.)

---

## 8. FRAMER MOTION (opcional — animación de entrada de sección, coherente con el resto del sitio)

Si el resto del sitio usa Framer Motion para scroll-reveal (confirmado como preferencia de stack en el proyecto), envolver el grid así:

```tsx
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};

// en el grid:
<motion.div
  className="promise__grid"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.3 }}
>
  <motion.div variants={item}><FlipCard ... /></motion.div>
  <motion.div variants={item}><FlipCard ... /></motion.div>
  <motion.div variants={item}><FlipCard ... /></motion.div>
</motion.div>
```

No animar el flip en sí con Framer Motion — el flip ya está resuelto en CSS puro (más performante para una interacción tan frecuente); Framer Motion se usa solo para la entrada en scroll de la sección.

---

## 9. BREAKPOINTS

| Rango | Comportamiento |
|---|---|
| ≥ 1024px | 3 columnas, `--card-w: 320px` |
| 641px – 1023px | 3 columnas más estrechas: cambiar `.promise__grid` a `repeat(3, minmax(0,1fr))` con `--gap: 20px` (añadir regla en este breakpoint) |
| ≤ 640px | 1 columna, tarjetas a `max-width: 340px`, centradas, `margin: 0 auto` |

Añadir a la sección 5 del CSS:
```css
@media (min-width: 641px) and (max-width: 1023px) {
  .promise__grid { gap: 20px; }
}
```

---

## 10. CHECKLIST DE VERIFICACIÓN (el agente marca cada punto antes de dar por cerrada la tarea)

- [ ] Las 3 tarjetas muestran el texto exacto de la tabla de la sección 2, sin resumir ni parafrasear.
- [ ] En desktop, pasar el ratón sobre una tarjeta la gira suavemente en 0.7s sin parpadeos ni texto espejado visible.
- [ ] En un dispositivo/emulador táctil, tocar una tarjeta la gira y un segundo toque la regresa.
- [ ] Con `Tab`, el foco de teclado llega a cada tarjeta y muestra el `outline` dorado; `Enter`/`Space` gira la tarjeta (comportamiento nativo de `<button>`, no requiere JS extra).
- [ ] Con un lector de pantalla, cada tarjeta anuncia su título y el estado "pulsa para ver más detalles".
- [ ] Con `prefers-reduced-motion` activado en el SO, el giro ocurre sin animación (instantáneo).
- [ ] En viewport de 375px de ancho, las tarjetas se apilan en una columna y no hay overflow horizontal.
- [ ] El color de fondo de la cara trasera es el navy de marca (`#001B3A`→`#0A2E52`), no el gradiente verde/naranja del ejemplo original.
- [ ] Ningún emoji (💶🤝🧭) aparece renderizado en el DOM final — solo los 3 SVG inline.
- [ ] La sección usa `--color-off-white` (`#F7F8FA`) de fondo, no blanco puro, para diferenciarse visualmente de las tarjetas frontales blancas.

---

## 11. SUPUESTOS DECLARADOS (revisar si no aplican al proyecto real)

1. No se pudo leer el CSS/tipografía en vivo del sitio (renderizado client-side, bloqueado a fetch estático) — se asumió `Fraunces` + stack `-apple-system` como tipografía. **Si el proyecto ya tiene fuentes cargadas (revisar `app/layout.tsx` → `next/font`), sustituir los tokens `--font-display` / `--font-body` por las fuentes reales del proyecto y no instalar `Fraunces` de nuevo.**
2. Se confirmó el color de marca `#001B3A` desde el meta tag `theme-color` del sitio en producción.
3. El dorado `#C6A15B` es una propuesta de acento secundario (no confirmado en el sitio real) — si existe una guía de marca con un acento distinto, sustituir `--color-gold` y `--color-gold-soft` únicamente, el resto del sistema no depende de ese valor.
