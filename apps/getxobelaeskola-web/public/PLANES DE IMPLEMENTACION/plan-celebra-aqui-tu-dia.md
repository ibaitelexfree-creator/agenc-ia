# 🎉 Plan de Implementación: Sección "Celebra aquí tu día"
### GetxoBela Eskola · Inspiración visual: Cafe Bonka · Estilo: Mágico, ilustrado, animado

---

## 🗂️ ÍNDICE DE FASES

| Fase | Nombre | Tipo de trabajo |
|------|--------|-----------------|
| 0 | Setup & Tokens de diseño | Config |
| 1 | Hero de sección — "El mar te espera" | Animación entrada |
| 2 | Escena vectorial animada — Niños en el mar | Ilustración SVG |
| 3 | Cards flotantes — Qué puedes hacer | Scroll interactivo |
| 4 | Línea de tiempo horizontal — Cómo es el día | Motion path |
| 5 | Big SUP — Escena ilustrada interactiva | Hover / tap |
| 6 | Velero animado cruzando la pantalla | SVG animation |
| 7 | Zona Chill Out — Parallax suave | Scroll parallax |
| 8 | Catering & Merendola — Cards pop | Spring animation |
| 9 | CTA Final — Globos que suben | Particle/SVG |
| 10 | Accesibilidad y `prefers-reduced-motion` | A11y |

---

## 🎨 FASE 0 — Tokens de Diseño y Setup Global

> Antes de escribir una sola línea de componente, define el sistema visual. Todo lo demás cuelga de aquí.

### Stack tecnológico

```
Next.js 14+ (App Router)
Framer Motion 11+
Tailwind CSS
SVG inline (ilustraciones propias)
```

### Paleta de colores

```css
--color-mar       : #1B8FCF   /* azul agua bahía */
--color-arena     : #F5E6C8   /* arena cálida */
--color-sol       : #FFD166   /* amarillo sol */
--color-velero    : #EF6351   /* rojo coral velero */
--color-hierba    : #6BBF59   /* verde césped chill out */
--color-noche     : #0D2B45   /* azul marino profundo */
--color-blanco    : #FAFAFA
```

### Tipografía

```
Display  → "Baloo 2" (Google Fonts) — redondeada, festiva, sin serif afilado
Body     → "Inter" — legible, neutral
Accent   → "Pacifico" — solo para el claim principal del hero
```

### Tokens de movimiento (Framer Motion)

```js
// framer-tokens.js
export const spring = { type: "spring", stiffness: 120, damping: 14 }
export const floatY = {
  y: [0, -12, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
}
export const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}
export const stagger = { staggerChildren: 0.12 }
```

---

## 🌊 FASE 1 — Hero de Sección: "El mar te espera"

> Primera impresión. Tiene que parar el scroll.

### Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   🌊🌊🌊  ola animada SVG en loop  🌊🌊🌊          │
│                                                     │
│        [ CELEBRA AQUÍ TU DÍA ]  ← Pacifico font   │
│    Cumpleaños · Despedidas · Encuentros especiales  │
│                                                     │
│   [niña con bandera vectorial saltando en ola]      │
│                                                     │
│         < Ver cómo puede ser >   ← CTA bounce       │
└─────────────────────────────────────────────────────┘
```

### Animaciones Framer Motion — paso a paso atómico

#### 1.1 — Título principal entra por letras (stagger)

```jsx
// Cada letra del título es un <motion.span> individual
// Se animan en cascada con staggerChildren: 0.04
// Efecto: las letras caen desde arriba y rebotan (spring)

<motion.h2 variants={containerVariants} initial="hidden" animate="visible">
  {"CELEBRA AQUÍ TU DÍA".split("").map((char, i) => (
    <motion.span key={i} variants={letterVariants}>
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ))}
</motion.h2>
```

#### 1.2 — Ola SVG en loop perpetuo

```jsx
// SVG con <path> de ola suave
// Framer Motion anima el atributo `d` entre dos formas
// loop: Infinity, ease: "easeInOut", duration: 4s

const wave1 = "M0,50 C150,20 350,80 500,50 L500,100 L0,100 Z"
const wave2 = "M0,50 C150,80 350,20 500,50 L500,100 L0,100 Z"

<motion.path
  d={wave1}
  animate={{ d: [wave1, wave2, wave1] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
/>
```

#### 1.3 — Niña vectorial saltando sobre la ola

```
Ilustración vectorial inline (SVG):

        O
       /|\     ← niña con brazos abiertos
       / \
      /   \
  ~~~~ ola ~~~~

Animación: translateY oscilando ±15px en loop (floatY token)
Al hacer hover: gira 5deg y suelta confetti (ver Fase 9)
```

#### 1.4 — CTA "Ver cómo puede ser"

```jsx
// Botón redondeado color --color-velero
// Animación: scale pulse lento en loop (0.97 → 1.03)
// Al hover: scale(1.08) + shadow expand
// Al click: scroll suave a Fase 3 (las cards)
```

---

## 🧒 FASE 2 — Escena Vectorial: Niños Jugando en el Mar

> La sección más importante visualmente. Esto es lo que hace que la gente diga "aaaah".

### Concepto visual

Una escena panorámica SVG de 1600×500px (viewport width completo) con capas de parallax:

```
CAPA 1 (fondo)   → cielo degradado azul claro → blanco
CAPA 2           → montañas/colinas de Getxo al fondo (silueta)
CAPA 3           → mar con pequeñas olas en loop
CAPA 4           → velero pequeño cruzando lento
CAPA 5 (frente)  → 5 personajes vectoriales distintos:
                    • Niña en Big SUP (riendo, brazos abiertos)
                    • Niño con remo cayendo al agua (efecto splash)
                    • Grupo de 3 en velero (saludando)
                    • Adulta con sombrero en zona chill out
                    • Perro con flotador (detalle adorable)
```

### Cada personaje: especificación atómica

**Personaje 1 — Niña en Big SUP**
```
SVG: figura estilizada, colores planos, sin fotorrealismo
Posición: centro-izquierda
Animación:
  - body: floatY (sube y baja 10px, 3s loop)
  - brazos: rotate ±8deg alternando (como equilibrando)
  - splash bajo el SUP: scale(0.8→1.2) opacity(1→0) loop
Interacción:
  - onClick / onTap → personaje "cae" al agua (animation)
    → reaparece con animación drip-up desde el agua
```

**Personaje 2 — Niño cayendo del Big SUP**
```
SVG: mismo estilo, postura de caída cómica (piernas arriba)
Animación:
  - rotate: 0 → 180deg en 0.8s
  - translateY: 0 → 60px
  - opacity: 1 → 0 al llegar al agua
  - Luego reaparece en posición normal (loop cada 6s)
```

**Personaje 3 — Grupo en velero (3 figuras)**
```
SVG: velero J80 simplificado con 3 siluetas dentro
Animación: translateX de -200px a 1800px en 18s, loop
La vela se infla: path animation sutil
```

**Personaje 4 — Adulta en Chill Out**
```
SVG: figura sentada en sofá bajo toldo
Animación: brazo levanta vaso (rotate 0 → -20deg loop lento)
Toldo: pequeño sway lateral (±3deg)
```

**Personaje 5 — Perro con flotador**
```
SVG: perrito redondo con flotador donut naranja
Animación: floatY + cabeza rotate ±5deg (movimiento cabeza)
Easter egg: onClick → ladra (Web Audio API, tono corto)
```

### Implementación técnica de la escena

```jsx
// ScenaPanoramica.jsx
// useScroll() de Framer Motion para parallax por capas:

const { scrollYProgress } = useScroll()

// Capa cielo: translateX lento (0.02x scroll)
// Capa colinas: translateX (0.05x scroll)  
// Capa mar: translateX (0.08x scroll)
// Personajes: translateX (0.12x scroll)

// Resultado: sensación de profundidad al scrollear
```

---

## 🃏 FASE 3 — Cards Flotantes: "¿Cómo puede ser tu celebración?"

> Las 5 opciones presentadas como cartas que aparecen en cascada al entrar en viewport.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   ¿Cómo puede ser tu celebración?                       │
│   ─────────────────────────────                         │
│                                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ 🛋️   │  │⛵    │  │ 🏄   │  │ 🔄   │  │ 🍱   │     │
│  │Chill │  │Velero│  │BigSUP│  │Combo │  │Comida│     │
│  │ Out  │  │      │  │      │  │      │  │      │     │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Animación de entrada (stagger desde abajo)

```jsx
// Cada card: motion.div con variants
// Cuando el contenedor entra en viewport (useInView):
//   → cards aparecen de abajo con delay escalonado
//   → spring rebote final

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotate: -4 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: i * 0.1, ...spring }
  })
}
```

### Cada card: especificación atómica

**Card 1 — Zona Chill Out** (color: --color-hierba)
```
Icono: ilustración SVG de sofá bajo toldo con sol
Texto: "Zona para estar. Música, sofás, sombra."
Hover: card sube 8px + shadow aumenta + icono hace wiggle
Tap mobile: flip 3D revelando detalle ("césped artificial, mesas, toldo")
```

**Card 2 — Navegación en Velero** (color: --color-mar)
```
Icono: velero J80 simplificado SVG (vela roja)
Texto: "Una hora navegando la bahía"
Hover: velero se inclina 8deg (como virando)
Tap: aparece badge "~1 hora · J80 o Raquero"
```

**Card 3 — Big SUP** (color: --color-sol)
```
Icono: 4 figuras en tabla SUP gigante
Texto: "Coordinación, risas, y probablemente agua"
Hover: figuras se tambalean (stagger rotate)
Tap: aparece modal con GIF/lottie de actividad
```

**Card 4 — Actividad Combinada** (color: degradado mar+sol)
```
Icono: flecha circular con velero y SUP
Texto: "¿Grupo grande? Dividís y rotáis"
Hover: flecha gira 360deg (spin)
Badge especial: "PARA GRUPOS GRANDES"
```

**Card 5 — Catering** (color: --color-arena)
```
Icono: cesta de picnic + copa
Texto: "Tú traes la gente, nosotros ponemos la comida"
Hover: cesta se abre (SVG path animation)
Tap: dropdown con opciones (comida completa / merendola / traéis vosotras)
```

---

## ⏱️ FASE 4 — Línea de Tiempo Horizontal: "Así es vuestro día"

> Scroll horizontal activado por scroll vertical. La línea se dibuja a medida que bajas.

### Concepto visual

```
────●────────────────●──────────────────●────────────────●────
  11:00             12:00              13:30            15:00
  Llegada          Mar / Velero        Chill Out        Comida
  Zona chill out   Big SUP             y risas          ¡brindis!
     🏖️               ⛵🏄               🛋️               🍾
```

### Implementación técnica

```jsx
// useScroll + useTransform para:
// 1. La línea horizontal se "dibuja" (strokeDashoffset: 100% → 0%)
//    proporcionalmente al scroll del usuario
//
// 2. Cada nodo (●) aparece con scale(0→1) + spring
//    cuando la línea llega a ese punto
//
// 3. El icono SVG de cada evento flota suavemente (floatY)
//    una vez visible

const lineProgress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1])
```

### Cada nodo de la timeline: especificación atómica

**Nodo 1 — Llegada (11:00)**
```
Icono SVG: puerta con sol
Texto: "Llegáis, os instaláis, suena la música"
Animación entrada: bounce desde arriba
Color: --color-hierba
```

**Nodo 2 — Al agua (12:00)**
```
Icono SVG: ola con figuras dentro
Texto: "Velero o Big SUP — o los dos"
Animación: splash pequeño al aparecer
Color: --color-mar
```

**Nodo 3 — Chill Out (13:30)**
```
Icono SVG: sol con nube y sofá
Texto: "Descanso, charla, sol"
Animación: sofá se balancea suavemente
Color: --color-sol
```

**Nodo 4 — Comida y brindis (15:00)**
```
Icono SVG: copa de cava con burbujas animadas
Texto: "La mejor parte: juntas, comiendo, recordando"
Animación: burbujas SVG suben en loop
Color: --color-velero
```

---

## 🏄 FASE 5 — Sección Big SUP: Escena Interactiva

> El momento más lúdico. La gente puede "montar" al Big SUP con su cursor.

### Concepto

Una tabla SUP gigante SVG que ocupa el ancho de pantalla. Encima hay 8 asientos vacíos marcados con `+`. Al hacer hover/tap en cada asiento, aparece una figurita vectorial sentada.

```
     +    +    +    +    +    +    +    +
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ~~~~ olas ~~~~  ~~~~ olas ~~~~
```

### Especificación atómica

```jsx
// BigSUPInteractivo.jsx

// Estado: array de 8 boolean (asiento ocupado o no)
const [seats, setSeats] = useState(Array(8).fill(false))

// Al clickar un asiento vacío:
//   → aparece figura vectorial con spring animation
//   → sonido "splash" corto (Web Audio API)
//   → si todos ocupados: la tabla "se hunde" un poco
//     + aparece texto "¡Así es el Big SUP!" + CTA

// Figuras: 4 variantes de color/forma distintas
// asignadas random al ocupar el asiento

// Mobile: tap funciona igual que click
// Cursor custom: remo de paddle cuando está sobre la tabla
```

---

## ⛵ FASE 6 — Velero Cruzando la Pantalla

> Un velero SVG atraviesa la sección de fondo a fondo. Aparece cada vez que el usuario entra en esta zona.

### Especificación

```jsx
// VeleroCruzando.jsx
// position: absolute, z-index bajo (fondo de sección)
// El velero entra por la izquierda, sale por la derecha

// Animación:
// - translateX: -200px → (viewport width + 200px) en 12s
// - leve bob vertical: y oscila ±8px durante el recorrido
// - La vela: path animation sutil (se infla con el viento)
// - Estela en el agua: SVG de ondas que aparecen tras el velero

// Trigger: useInView — cada vez que la sección entra en viewport
// Loop: NO. Solo cruza una vez por visita de sección.
//       Para verlo otra vez → scroll up y vuelve a bajar.
```

### SVG del velero (estructura)

```
         /\
        /  \
       /    \  ← vela principal (path animado)
      /      \
─────┤  J80   ├─────
     └────────┘
       ~ ~ ~   ← estela SVG
```

---

## 🛋️ FASE 7 — Zona Chill Out: Parallax Suave

> Sección inmersiva donde el fondo se mueve más lento que el contenido. Sensación de profundidad.

### Layout

```
┌──────────────────────────────────────────────────────┐
│  [fondo: césped SVG con textura, se mueve LENTO]     │
│                                                      │
│   ┌─────────────────────────────────────────────┐   │
│   │  [toldo canvas SVG, ligero sway]            │   │
│   │                                             │   │
│   │   🛋️ sofá    🪴 planta    🎵 nota musical   │   │
│   │                                             │   │
│   │  "Un espacio para estar.                    │   │
│   │   Para charlar antes de salir al agua.      │   │
│   │   Para descansar después."                  │   │
│   └─────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Especificación atómica

```jsx
// ZonaChill.jsx

// Parallax:
const { scrollYProgress } = useScroll({ target: sectionRef })
const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
// El fondo (césped SVG) se mueve a 0.8x velocidad del contenido

// Toldo:
// SVG de toldo de rayas (azul marino + blanco)
// Animación: rotate ±2deg en loop de 4s (sway suave)

// Sofá SVG:
// Al hacer hover: aparece un gato durmiendo encima (easter egg)

// Notas musicales:
// 3 notas SVG (♩ ♪ ♫) flotan hacia arriba desde el sofá
// loop perpetuo, offsets distintos para que no sean síncronas

// Texto:
// fadeUp escalonado al entrar en viewport
```

---

## 🍱 FASE 8 — Catering: Cards que Aparecen con Spring

> Las 3 opciones de comida se presentan como tarjetas que "aterrizan" en la pantalla.

### Las 3 opciones

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  🍽️ COMIDA       │  │  🧺 MERENDOLA    │  │  🎒 TRAÉIS       │
│  COMPLETA        │  │                  │  │  VOSOTRAS        │
│                  │  │  Snacks, frutas, │  │                  │
│  Menú preparado  │  │  bebidas, algo   │  │  Aquí tenéis     │
│  por catering    │  │  dulce           │  │  nevera y mesas  │
│  de la escuela   │  │                  │  │                  │
│  [ Consultar ]   │  │  [ Consultar ]   │  │  [ Sin coste ]   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Animación de entrada

```jsx
// Cada card "cae" desde arriba con spring y rebote
// delay escalonado: 0s, 0.15s, 0.30s

// Al hover: card escala 1.04 + pequeño tilt 3D (rotateY 6deg)
// usando perspective en el padre y rotateY en el hijo

// La card "MERENDOLA" tiene además:
// - Confeti pequeño en loop (3 partículas SVG ♦ ★ ●)
//   flotando sobre la card
// - Badge animado: "✨ MÁS POPULAR" con shimmer effect
```

---

## 🎈 FASE 9 — CTA Final: "¿Cuándo es vuestro día?"

> El cierre emocional de la sección. Globos que suben, confeti, y un formulario de contacto simple.

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   🎈     🎈     🎈     🎈     🎈                   │
│    \      \      \      \      \                   │
│     \      \      \      \      \                  │
│                                                    │
│       "Celebrar, compartir                         │
│        y vivir algo diferente."                    │
│                                                    │
│    ┌──────────────────────────────────┐            │
│    │  ¿Cuándo queréis venir?          │            │
│    │  [  fecha  ] [  grupo  ] [→]     │            │
│    └──────────────────────────────────┘            │
│                                                    │
│   ★ confeti cayendo en loop suave ★               │
└────────────────────────────────────────────────────┘
```

### Especificación atómica de los globos

```jsx
// BalloonField.jsx
// 8 globos SVG, cada uno con:
// - color distinto (del token set)
// - tamaño ligeramente distinto (0.8x a 1.2x)
// - velocidad distinta de subida (5s a 10s)
// - posición X aleatoria pero distribuida
// - hilo SVG ondulado animado

// Movimiento de cada globo:
// translateY: 0 → -120vh en N segundos
// Cuando sale por arriba: reaparece por abajo (loop)
// Leve sway horizontal: translateX ±20px en loop sinusoidal

// Al hover sobre un globo: revienta (escala 0→2 + opacity 0)
//   → aparece un mini texto gracioso al explotar:
//     "¡Ups!" / "¡Weee!" / "¡Otra ronda!" / "¡Ahí va!"
//   → El globo reaparece desde abajo a los 2s
```

### Formulario de contacto

```jsx
// Solo 2 campos + botón:
// 1. Input fecha (date picker custom, mínimo hoy)
// 2. Input número de personas (slider custom SVG: figuritas se suman)
// 3. Botón "Cuéntanos más" → abre WhatsApp con mensaje pre-rellenado

// Animación del botón:
// - En idle: pequeño pulse lento
// - Al hover: escala 1.06 + color shift suave
// - Al click: confeti localizado desde el botón
```

---

## ♿ FASE 10 — Accesibilidad y Reducción de Movimiento

> Todo lo anterior funciona también para quien necesita menos estímulo.

### Reglas atómicas obligatorias

```jsx
// 1. En TODOS los componentes animados:
const prefersReducedMotion = useReducedMotion() // Framer Motion hook

// Si prefersReducedMotion === true:
// - Desactivar loops infinitos (floatY, olas, globos)
// - Mantener solo fade-in suave (0.3s, sin bounce)
// - La escena vectorial: estática, sin parallax
// - El velero: no cruza, aparece anclado al centro

// 2. Todos los SVG ilustrativos tienen aria-hidden="true"
//    (son decorativos, no informativos)

// 3. Cards: focus-visible con outline --color-velero, 2px

// 4. Los textos de CTA nunca dependen del color solo
//    (siempre tienen contraste mínimo 4.5:1)

// 5. El formulario de contacto:
//    - label visible en cada campo
//    - errores anunciados a screen readers via aria-live
```

---

## 📦 ORDEN DE ENTREGA RECOMENDADO

> Para un equipo de implementación pequeño, este es el orden óptimo:

```
Semana 1:
  ✅ Fase 0  — Tokens y setup (0.5 días)
  ✅ Fase 2  — Escena vectorial (3 días, es el alma del proyecto)
  ✅ Fase 1  — Hero (1 día, depende de tener los SVG de Fase 2)

Semana 2:
  ✅ Fase 3  — Cards flotantes (1.5 días)
  ✅ Fase 6  — Velero cruzando (0.5 días, SVG ya hecho)
  ✅ Fase 7  — Chill Out parallax (1 día)

Semana 3:
  ✅ Fase 4  — Timeline horizontal (1.5 días)
  ✅ Fase 5  — Big SUP interactivo (1.5 días)
  ✅ Fase 8  — Cards catering (0.5 días)

Semana 4:
  ✅ Fase 9  — CTA final + globos (1.5 días)
  ✅ Fase 10 — A11y y reduced motion (1 día)
  ✅ QA + pulido final (2 días)
```

---

## 🖼️ GUÍA DE ESTILO VECTORIAL PARA LAS ILUSTRACIONES

> Para quien haga los SVG. Estas reglas aseguran coherencia visual.

```
ESTILO: flat design + trazos limpios + sin degradados complejos
PROPORCIONES: cabezas grandes (estilo cartoon amigable)
PALETA: SOLO los 7 colores del token set (+ blanco para detalles)
LÍNEAS: grosor uniforme 2px, color --color-noche al 80%
EXPRESIONES: siempre positivas/neutrales, nunca negativas
DIVERSIDAD: mezcla de géneros, edades, formas corporales
ROPA: colores del token set, sin texto ni logos
AGUA: ondas simplificadas, 2-3 líneas curvas paralelas
VELERO: reconocible como J80 (casco largo, vela grande)
BIG SUP: tabla ancha y rectangular, claramente diferente al surf

PROHIBIDO:
  ✗ Fotorrealismo
  ✗ Sombras complejas
  ✗ Gradientes de más de 2 colores
  ✗ Más de 5 colores por figura
  ✗ Expresiones tristes o de miedo
```

---

## ✅ CHECKLIST FINAL DE IMPLEMENTACIÓN

```
[ ] Fase 0: tokens definidos y documentados
[ ] Fase 1: hero con ola, título stagger y niña flotante
[ ] Fase 2: escena panorámica con 5 personajes y parallax
[ ] Fase 3: 5 cards con stagger y hover states
[ ] Fase 4: timeline dibujándose con scroll
[ ] Fase 5: Big SUP interactivo con asientos clickables
[ ] Fase 6: velero cruzando en loop por entrada en viewport
[ ] Fase 7: chill out con parallax y easter egg gato
[ ] Fase 8: cards catering con spring y confeti en "popular"
[ ] Fase 9: globos volando + CTA con slider de personas
[ ] Fase 10: prefers-reduced-motion en todos los componentes
[ ] QA mobile: todo funciona con tap, sin hover-dependency
[ ] QA accesibilidad: todos los interactivos tienen focus-visible
[ ] Performance: SVG optimizados (SVGO), no hay GSAP innecesario
```

---

*Plan preparado para GetxoBela Eskola · Sección "Celebra aquí tu día"*
*Inspiración: cafe bonka.com · Stack: Next.js + Framer Motion + SVG inline*
