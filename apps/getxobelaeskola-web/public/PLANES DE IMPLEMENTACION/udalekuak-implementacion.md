# 🌊 Plan de Implementación — Sección Udalekuak
### getxobelaeskola.cloud · Estilo: sencillo pero mágico (ref. Café Bonka)
> **Instrucciones para la IA ejecutora:** Lee cada fase completa antes de tocar código. Cada tarea es atómica — una acción, un resultado. No improvises fuera de lo especificado. Si algo no está claro, detente y pregunta.

---

## 🎯 Visión de la Sección

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   HERO fullscreen                                               │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  🌊  Video/imagen de fondo (mar, niños navegando)        │  │
│   │      Texto flotante con entrada animated                │  │
│   │      "UDALEKUAK"  →  subtitle  →  CTA button           │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   INTRO STATEMENT (texto gordo, 1 frase poderosa)              │
│                                                                 │
│   CARDS HORIZONTALES  (scroll snap o sticky)                   │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │⛵ Navegar │  │🏄 Agua   │  │👥 Equipo │  │🎉 Viernes│     │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                 │
│   TIMELINE VISUAL (semanas disponibles)                        │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Semana Santa  ──  Junio  ──  Julio  ──  Agosto  ──Sep │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   DETALLES PRÁCTICOS (edad, nº participantes, horarios)       │
│                                                                 │
│   CTA FINAL  →  "Reservar plaza"                               │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Sistema de Diseño (Tokens fijos — NO cambiar)

```
COLORES
  --color-ocean:     #0A3D6B   (azul profundo — texto principal)
  --color-sky:       #5BB8D4   (azul cielo — acentos)
  --color-foam:      #F0F8FF   (blanco espuma — fondos)
  --color-sand:      #F5E6C8   (arena — fondos alternos)
  --color-sun:       #F4A830   (amarillo sol — CTA, highlights)
  --color-seaweed:   #2D7A4F   (verde — detalles secundarios)

TIPOGRAFÍA
  Display:  "Playfair Display" (Google Fonts) — títulos grandes
  Body:     "Inter" (Google Fonts) — texto corrido
  Accent:   "Caveat" (Google Fonts) — anotaciones handwritten (magic touch)

ESPACIADO
  Sección:   padding: 6rem 2rem (desktop) / 4rem 1.25rem (mobile)
  Gap cards: 1.5rem
  Border-r:  1.5rem para cards, 0.5rem para botones

SOMBRAS
  Card hover: 0 20px 60px rgba(10,61,107,0.15)
  Hero text shadow: 0 2px 20px rgba(0,0,0,0.4)
```

---

## 📦 Dependencias (instalar antes de empezar)

```bash
# En el proyecto Next.js raíz de getxobelaeskola
npm install framer-motion
npm install @studio-freight/lenis        # scroll suave
npm install clsx                          # utility clases
```

> ✅ Verificar que ya existan: `next`, `tailwindcss`, `react`

---

## 🗂 Estructura de Archivos a Crear

```
app/
└── udalekuak/
    └── page.tsx                    ← ruta principal
components/
└── udalekuak/
    ├── UdalekuakHero.tsx
    ├── UdalekuakIntro.tsx
    ├── UdalekuakFeatureCards.tsx
    ├── UdalekuakTimeline.tsx
    ├── UdalekuakDetails.tsx
    └── UdalekuakCTA.tsx
public/
└── udalekuak/
    ├── hero-video.mp4              ← vídeo de fondo (o hero-bg.jpg)
    ├── icon-nav.svg
    ├── icon-water.svg
    ├── icon-team.svg
    └── icon-friday.svg
```

---

# FASE 1 — Scaffolding y tokens base
> ⏱ Estimado: 20 min · Dificultad: ⭐☆☆☆☆

---

## TAREA 1.1 — Crear la página de ruta

**Archivo:** `app/udalekuak/page.tsx`

**Qué hace:** Define el layout de página y llama a todos los componentes en orden.

```tsx
// app/udalekuak/page.tsx
import UdalekuakHero from "@/components/udalekuak/UdalekuakHero";
import UdalekuakIntro from "@/components/udalekuak/UdalekuakIntro";
import UdalekuakFeatureCards from "@/components/udalekuak/UdalekuakFeatureCards";
import UdalekuakTimeline from "@/components/udalekuak/UdalekuakTimeline";
import UdalekuakDetails from "@/components/udalekuak/UdalekuakDetails";
import UdalekuakCTA from "@/components/udalekuak/UdalekuakCTA";

export const metadata = {
  title: "Udalekuak — Campamentos de Vela | GetxoBelaEskola",
  description:
    "Semanas de verano y Semana Santa donde la navegación se une a aventura, equipo y experiencias inolvidables.",
};

export default function UdalekuakPage() {
  return (
    <main className="bg-[#F0F8FF] overflow-hidden">
      <UdalekuakHero />
      <UdalekuakIntro />
      <UdalekuakFeatureCards />
      <UdalekuakTimeline />
      <UdalekuakDetails />
      <UdalekuakCTA />
    </main>
  );
}
```

**✅ Resultado esperado:** La ruta `/udalekuak` existe y no da error 404.

---

## TAREA 1.2 — Añadir fuentes de Google al layout global

**Archivo:** `app/layout.tsx` (o equivalente en el proyecto)

**Qué añadir** en el `<head>` (o en el import de next/font):

```tsx
// Si usas next/font/google (recomendado en Next.js 13+)
import { Playfair_Display, Inter, Caveat } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

// Añadir al <html>:
// className={`${playfair.variable} ${inter.variable} ${caveat.variable}`}
```

**✅ Resultado esperado:** Las variables CSS `--font-playfair`, `--font-inter`, `--font-caveat` disponibles globalmente.

---

# FASE 2 — Hero Section (El primer impacto)
> ⏱ Estimado: 45 min · Dificultad: ⭐⭐⭐☆☆

---

## Vista previa del resultado final

```
┌─────────────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░   [VIDEO/FOTO: niños navegando, agua azul, Getxo]            ░│
│░                                                               ░│
│░              UDALEKUAK                                        ░│
│░         ── Campamentos de vela ──                             ░│
│░                                                               ░│
│░   "Semanas que dejan huella en la mar"                        ░│
│░                                                               ░│
│░          [ Reservar plaza 2025 ]                              ░│
│░                                                               ░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                 ↓  (scroll indicator animado)                  │
└─────────────────────────────────────────────────────────────────┘
```

## TAREA 2.1 — Crear UdalekuakHero.tsx

**Archivo:** `components/udalekuak/UdalekuakHero.tsx`

**Animaciones Framer Motion a usar:**
- `initial={{ opacity: 0, y: 60 }}` → `animate={{ opacity: 1, y: 0 }}` en título
- `transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}`
- `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}` en subtítulo (delay: 0.6)
- `initial={{ opacity: 0, scale: 0.9 }}` → `animate={{ opacity: 1, scale: 1 }}` en botón (delay: 1.0)
- Scroll indicator: animación `y: [0, 12, 0]` en loop, `repeat: Infinity, duration: 1.8`

```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UdalekuakHero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* FONDO: Video o imagen */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/udalekuak/hero-bg.jpg"
        >
          <source src="/udalekuak/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D6B]/60 via-[#0A3D6B]/30 to-[#0A3D6B]/70" />
      </div>

      {/* CONTENIDO CENTRADO */}
      <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
        
        {/* Eyebrow animado */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="text-[#F4A830] text-sm font-medium uppercase tracking-[0.4em] mb-4"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          GetxoBelaEskola · Verano
        </motion.p>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="text-7xl md:text-9xl font-bold leading-none mb-6"
          style={{
            fontFamily: "var(--font-playfair)",
            textShadow: "0 2px 40px rgba(0,0,0,0.5)",
          }}
        >
          Udalekuak
        </motion.h1>

        {/* Subtítulo handwritten */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-3xl mb-8 text-white/90"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Semanas que dejan huella en la mar
        </motion.p>

        {/* Botón CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Link
            href="#inscripcion"
            className="inline-block bg-[#F4A830] text-[#0A3D6B] font-bold text-lg px-10 py-4 rounded-full 
                       hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Reservar plaza 2025 →
          </Link>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <span className="text-white/60 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-inter)" }}>
          descubrir
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

    </section>
  );
}
```

**✅ Resultado esperado:** Hero a pantalla completa con vídeo/foto de fondo, título animado, subtítulo en handwriting y botón dorado.

---

# FASE 3 — Intro Statement
> ⏱ Estimado: 15 min · Dificultad: ⭐☆☆☆☆

---

## Vista previa

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ── Fondo arena (#F5E6C8) ──                                  │
│                                                                 │
│   "No son solo campamentos de navegación:                      │
│    son experiencias completas donde el aprendizaje,            │
│    la convivencia y el juego van de la mano."                  │
│                                                                 │
│   [Texto grande, centrado, con animación de entrada al scroll] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## TAREA 3.1 — Crear UdalekuakIntro.tsx

**Archivo:** `components/udalekuak/UdalekuakIntro.tsx`

**Animación:** `whileInView` (no `animate`), para que se active al hacer scroll.

```tsx
"use client";
import { motion } from "framer-motion";

export default function UdalekuakIntro() {
  return (
    <section className="bg-[#F5E6C8] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Decorador top */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-0.5 bg-[#0A3D6B]/20 w-24 mx-auto mb-10"
        />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold text-[#0A3D6B] leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          No son solo campamentos de navegación.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-xl md:text-2xl text-[#0A3D6B]/80 leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Son experiencias completas donde el{" "}
          <span className="text-[#2D7A4F] font-semibold">aprendizaje</span>,
          la{" "}
          <span className="text-[#5BB8D4] font-semibold">convivencia</span>{" "}
          y el{" "}
          <span className="text-[#F4A830] font-semibold">juego</span>{" "}
          van de la mano.
        </motion.p>

        {/* Nota handwritten */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 text-2xl text-[#0A3D6B]/50"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Válido para quienes se inician y para quienes ya navegan ✦
        </motion.p>

        {/* Decorador bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="h-0.5 bg-[#0A3D6B]/20 w-24 mx-auto mt-10"
        />

      </div>
    </section>
  );
}
```

**✅ Resultado esperado:** Bloque de texto grande sobre fondo arena, con palabras clave en color y entrada suave al scroll.

---

# FASE 4 — Feature Cards (Los 4 pilares)
> ⏱ Estimado: 60 min · Dificultad: ⭐⭐⭐⭐☆

---

## Vista previa (4 cards)

```
┌─────────────────────────────────────────────────────────────────┐
│  Fondo blanco espuma (#F0F8FF)                                 │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────┐ │
│  │              │  │              │  │              │  │    │ │
│  │  ⛵  Grande  │  │  🏄  Grande  │  │  👥  Grande  │  │ 🎉 │ │
│  │              │  │              │  │              │  │    │ │
│  │  Navegación  │  │  Actividades │  │  Convivencia │  │Vie.│ │
│  │  diaria      │  │  acuáticas   │  │  y equipo    │  │merl│ │
│  │              │  │              │  │              │  │ola │ │
│  │  [texto]     │  │  [texto]     │  │  [texto]     │  │    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────┘ │
│                                                                 │
│  Cards con hover: sube, sombra, color de fondo cambia          │
│  Entrada: stagger (cada card con 0.1s de delay adicional)      │
└─────────────────────────────────────────────────────────────────┘
```

## TAREA 4.1 — Definir los datos de las cards

**Añadir al inicio de `UdalekuakFeatureCards.tsx` ANTES del componente:**

```tsx
const FEATURES = [
  {
    id: "nav",
    emoji: "⛵",
    color: "#5BB8D4",
    bgHover: "#EBF7FC",
    title: "Navegación diaria",
    text: "La base del campamento. Se aprende a manejar distintas embarcaciones, entender el viento y moverse con confianza en la mar, adaptado a cada edad y nivel.",
  },
  {
    id: "water",
    emoji: "🏄",
    color: "#2D7A4F",
    bgHover: "#EAF4EE",
    title: "Actividades acuáticas",
    text: "Paddle surf, Big SUP y piragua se combinan con la navegación para una experiencia completa en el agua.",
  },
  {
    id: "team",
    emoji: "👥",
    color: "#0A3D6B",
    bgHover: "#E8EFF6",
    title: "Convivencia y equipo",
    text: "Dinámicas de grupo que fortalecen el trabajo en equipo y las amistades. Cuando el tiempo no permite navegar, juegos cooperativos, talleres y teoría práctica.",
  },
  {
    id: "friday",
    emoji: "🎉",
    color: "#F4A830",
    bgHover: "#FEF6E4",
    title: "La merendola del viernes",
    text: "Cada viernes cerramos la semana con un momento especial para celebrar lo vivido, reír juntas y despedir el campamento como se merece.",
  },
];
```

## TAREA 4.2 — Crear UdalekuakFeatureCards.tsx completo

**Archivo:** `components/udalekuak/UdalekuakFeatureCards.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

// [pegar aquí el array FEATURES del paso anterior]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function UdalekuakFeatureCards() {
  return (
    <section className="bg-[#F0F8FF] py-24 px-6">
      
      {/* Título sección */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p
          className="text-[#5BB8D4] text-sm uppercase tracking-[0.3em] mb-3"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          qué ofrece el campamento
        </p>
        <h2
          className="text-4xl md:text-6xl font-bold text-[#0A3D6B]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Una semana en la mar
        </h2>
      </motion.div>

      {/* Grid de cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.id}
            variants={cardVariants}
            whileHover={{
              y: -12,
              boxShadow: "0 24px 60px rgba(10,61,107,0.15)",
              backgroundColor: feature.bgHover,
            }}
            className="bg-white rounded-3xl p-8 cursor-default transition-colors duration-300 border border-[#0A3D6B]/5"
          >
            {/* Emoji grande */}
            <motion.div
              whileHover={{ scale: 1.2, rotate: [-3, 3, -3, 0] }}
              transition={{ duration: 0.4 }}
              className="text-5xl mb-6"
            >
              {feature.emoji}
            </motion.div>

            {/* Línea de color */}
            <div
              className="h-1 w-12 rounded-full mb-4"
              style={{ backgroundColor: feature.color }}
            />

            {/* Título */}
            <h3
              className="text-xl font-bold text-[#0A3D6B] mb-3 leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {feature.title}
            </h3>

            {/* Texto */}
            <p
              className="text-[#0A3D6B]/70 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {feature.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

**✅ Resultado esperado:** 4 cards en grid, con stagger de entrada, hover con elevación y color suave.

---

# FASE 5 — Timeline de Fechas
> ⏱ Estimado: 45 min · Dificultad: ⭐⭐⭐☆☆

---

## Vista previa

```
┌─────────────────────────────────────────────────────────────────┐
│  Fondo azul oscuro (#0A3D6B)  — SECCIÓN OSCURA                 │
│                                                                 │
│          "¿Cuándo puedes venir?"                               │
│                                                                 │
│  ●────────────────────────────────────────────────────● línea  │
│  │                                                    │        │
│ SEMANA   JUNIO     JULIO    AGOSTO   SEPTIEMBRE       │        │
│ SANTA    (3ª sem)  completo completo (1ª sem)         │        │
│                                                                 │
│  [Cada punto se ilumina en secuencia al entrar en viewport]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## TAREA 5.1 — Datos de la timeline

```tsx
const TIMELINE = [
  {
    id: "semana-santa",
    label: "Semana\nSanta",
    sublabel: "Fechas variables",
    color: "#F4A830",
  },
  {
    id: "junio",
    label: "Junio",
    sublabel: "A partir de la\n3ª semana",
    color: "#5BB8D4",
  },
  {
    id: "julio",
    label: "Julio",
    sublabel: "Mes completo",
    color: "#5BB8D4",
  },
  {
    id: "agosto",
    label: "Agosto",
    sublabel: "Mes completo",
    color: "#5BB8D4",
  },
  {
    id: "septiembre",
    label: "Septiembre",
    sublabel: "1ª semana",
    color: "#F4A830",
  },
];
```

## TAREA 5.2 — Crear UdalekuakTimeline.tsx

**Archivo:** `components/udalekuak/UdalekuakTimeline.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

// [pegar aquí TIMELINE del paso anterior]

export default function UdalekuakTimeline() {
  return (
    <section className="bg-[#0A3D6B] py-24 px-6 overflow-hidden">
      
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-20"
      >
        <p
          className="text-[#F4A830] text-sm uppercase tracking-[0.3em] mb-3"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          disponibilidad
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          ¿Cuándo puedes venir?
        </h2>
      </motion.div>

      {/* Timeline horizontal */}
      <div className="relative max-w-5xl mx-auto">
        
        {/* Línea base */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-8 left-0 right-0 h-0.5 bg-white/20 origin-left"
          style={{ top: "2rem" }}
        />

        {/* Puntos y labels */}
        <div className="flex justify-between items-start relative">
          {TIMELINE.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center flex-1"
            >
              {/* Punto */}
              <motion.div
                whileHover={{ scale: 1.4 }}
                className="w-4 h-4 rounded-full border-2 border-white mb-6 relative z-10"
                style={{ backgroundColor: item.color }}
              />

              {/* Label principal */}
              <span
                className="text-white font-bold text-lg leading-tight whitespace-pre-line"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {item.label}
              </span>

              {/* Sublabel */}
              <span
                className="text-white/50 text-xs mt-2 leading-snug whitespace-pre-line"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.sublabel}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nota inferior */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center text-white/40 text-sm mt-16"
        style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem" }}
      >
        Lunes a viernes · Grupos reducidos · A partir de 3 años ✦
      </motion.p>

    </section>
  );
}
```

**✅ Resultado esperado:** Sección oscura con timeline horizontal, puntos dorados/azules que aparecen en secuencia.

---

# FASE 6 — Detalles Prácticos
> ⏱ Estimado: 30 min · Dificultad: ⭐⭐☆☆☆

---

## Vista previa

```
┌─────────────────────────────────────────────────────────────────┐
│  Fondo arena (#F5E6C8)                                         │
│                                                                 │
│  "Los detalles"                                                 │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │             │  │             │  │             │            │
│  │  🎂  3+     │  │  👶  5 min  │  │ 📅 Lu–Vi    │            │
│  │  años       │  │  part.      │  │  semanas    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  Texto completo (Opción 1) en párrafo desplegable opcional    │
└─────────────────────────────────────────────────────────────────┘
```

## TAREA 6.1 — Crear UdalekuakDetails.tsx

**Archivo:** `components/udalekuak/UdalekuakDetails.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

const DETAILS = [
  { icon: "🎂", value: "3 años", label: "Edad mínima" },
  { icon: "👥", value: "5 niños", label: "Mínimo por grupo" },
  { icon: "📅", value: "Lu – Vi", label: "Horario semanal" },
  { icon: "📍", value: "Getxo", label: "Puerto de Algorta" },
];

export default function UdalekuakDetails() {
  return (
    <section className="bg-[#F5E6C8] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-[#0A3D6B]/50 text-sm uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            información práctica
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0A3D6B]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Lo que necesitas saber
          </h2>
        </motion.div>

        {/* Grid de detalles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {DETAILS.map((detail, i) => (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#0A3D6B]/10"
            >
              <div className="text-4xl mb-3">{detail.icon}</div>
              <div
                className="text-2xl font-bold text-[#0A3D6B] mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {detail.value}
              </div>
              <div
                className="text-[#0A3D6B]/60 text-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {detail.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Texto completo (Opción 1) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#0A3D6B]/10"
        >
          <p
            className="text-[#0A3D6B]/80 text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Nuestros Udalekus son semanas de verano pensadas para que niñas y niños vivan la mar
            de forma intensa, divertida y segura. La base del campamento es la navegación diaria,
            adaptada a cada edad y nivel, combinada con actividades acuáticas como paddle surf,
            Big SUP o piragua, y dinámicas de grupo que fortalecen el trabajo en equipo y las amistades.
          </p>
          <p
            className="text-[#0A3D6B]/60 mt-4 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Cuando la meteorología no permite salir a navegar, se organizan alternativas como juegos
            cooperativos, talleres o teoría práctica. Cada viernes cerramos la semana con una
            merendola compartida — un momento especial para celebrar lo vivido.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
```

**✅ Resultado esperado:** Cuatro datos clave en cards blancas, seguidos del texto completo oficial en bloque glassmorphism.

---

# FASE 7 — CTA Final (Conversión)
> ⏱ Estimado: 20 min · Dificultad: ⭐⭐☆☆☆

---

## Vista previa

```
┌─────────────────────────────────────────────────────────────────┐
│  Fondo: gradiente azul → azul oscuro                           │
│                                                                 │
│  ┌──────── olas decorativas SVG (top) ────────────────────┐    │
│  │                                                         │    │
│  │     "¿Lista para zarpar?"                               │    │
│  │     Subtítulo corto                                     │    │
│  │                                                         │    │
│  │    [ Inscribirse ahora ]   [ Más información ]          │    │
│  │                                                         │    │
│  └──────── olas decorativas SVG (bottom) ───────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## TAREA 7.1 — Crear UdalekuakCTA.tsx

**Archivo:** `components/udalekuak/UdalekuakCTA.tsx`

**Importante:** El `id="inscripcion"` es el anchor del botón del Hero.

```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UdalekuakCTA() {
  return (
    <section
      id="inscripcion"
      className="relative bg-gradient-to-b from-[#0A3D6B] to-[#071F3A] py-32 px-6 overflow-hidden"
    >
      {/* Olas decorativas SVG top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-16 fill-[#F5E6C8]">
          <path d="M0,0 C300,80 900,0 1200,60 L1200,0 Z" />
        </svg>
      </div>

      {/* Estrellas/partículas decorativas */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + i * 0.5,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#F4A830] text-sm uppercase tracking-[0.4em] mb-4"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          verano 2025
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          ¿Lista para zarpar?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/70 text-xl mb-12"
          style={{ fontFamily: "var(--font-caveat)", fontSize: "1.4rem" }}
        >
          Las plazas son limitadas. No dejes escapar el verano.
        </motion.p>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/contacto?motivo=udalekuak"
            className="inline-block bg-[#F4A830] text-[#0A3D6B] font-bold text-lg px-10 py-4 rounded-full
                       hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Inscribirse ahora →
          </Link>
          <Link
            href="/contacto"
            className="inline-block bg-transparent text-white border-2 border-white/40 font-semibold text-lg px-10 py-4 rounded-full
                       hover:border-white hover:bg-white/10 transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Más información
          </Link>
        </motion.div>

      </div>

      {/* Olas decorativas SVG bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-12 fill-[#071F3A]">
          <path d="M0,60 C400,0 800,40 1200,10 L1200,60 Z" />
        </svg>
      </div>
    </section>
  );
}
```

**✅ Resultado esperado:** CTA oscura con gradiente, olas SVG decorativas, partículas parpadeantes y dos botones.

---

# FASE 8 — Polish y Toques Mágicos Extra
> ⏱ Estimado: 30 min · Dificultad: ⭐⭐☆☆☆

---

## TAREA 8.1 — Añadir scroll suave global (Lenis)

**Archivo:** `components/providers/SmoothScrollProvider.tsx` *(crear si no existe)*

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

**Integrar en `app/layout.tsx`:**
```tsx
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
// envolver el {children} dentro de <SmoothScrollProvider>
```

## TAREA 8.2 — Cursor de ola personalizado (opcional, solo desktop)

Si la web tiene un cursor personalizado global, extender. Si no, ignorar esta tarea.

## TAREA 8.3 — Meta OG para compartir

**Añadir a `app/udalekuak/page.tsx` en el objeto `metadata`:**

```tsx
openGraph: {
  title: "Udalekuak — Campamentos de Vela | GetxoBelaEskola",
  description: "Campamentos de verano y Semana Santa en Getxo. Navegación, paddle surf y convivencia para niños desde 3 años.",
  images: [{ url: "/udalekuak/og-udalekuak.jpg", width: 1200, height: 630 }],
},
```

**Crear imagen OG:** `/public/udalekuak/og-udalekuak.jpg` (1200×630px, foto de niños navegando con el logo de la escuela).

---

# ✅ Checklist Final de Verificación

Antes de publicar, verificar punto a punto:

```
FUNCIONAL
[ ] Ruta /udalekuak accesible sin error
[ ] Todas las animaciones se activan al hacer scroll (no al cargar)
[ ] El botón "Reservar plaza 2025" del Hero hace scroll a #inscripcion
[ ] El link "Inscribirse ahora" va a /contacto?motivo=udalekuak
[ ] El vídeo/foto de fondo del Hero carga correctamente

VISUAL
[ ] Fuentes: Playfair, Inter, Caveat cargadas
[ ] Colores siguen el sistema de tokens (no colores ad-hoc)
[ ] Sección oscura (Timeline + CTA) contrasta bien con las claras
[ ] Cards del Hero no se cortan en mobile (grid responsive)

PERFORMANCE
[ ] Vídeo tiene atributo `muted` y `playsInline` (iOS requiere ambos)
[ ] Vídeo tiene `poster` como fallback
[ ] Imágenes con next/image si las hay
[ ] `whileInView` con `once: true` (no reanima al hacer scroll back)

ACCESIBILIDAD
[ ] Todos los emojis tienen aria-hidden="true" si son decorativos
[ ] Contraste de texto sobre fondos: mínimo 4.5:1
[ ] Botones con tamaño mínimo de toque 44×44px en mobile
```

---

# 📐 Resumen de Fases

| Fase | Componente | ⏱ | Prioridad |
|------|------------|---|-----------|
| 1 | Scaffolding + Fuentes | 20 min | 🔴 CRÍTICA |
| 2 | Hero Section | 45 min | 🔴 CRÍTICA |
| 3 | Intro Statement | 15 min | 🟠 ALTA |
| 4 | Feature Cards | 60 min | 🟠 ALTA |
| 5 | Timeline Fechas | 45 min | 🟠 ALTA |
| 6 | Detalles Prácticos | 30 min | 🟡 MEDIA |
| 7 | CTA Final | 20 min | 🔴 CRÍTICA |
| 8 | Polish + Scroll suave | 30 min | 🟡 MEDIA |
| **TOTAL** | | **~4h** | |

---

*Plan generado para getxobelaeskola.cloud · Sección Udalekuak · Junio 2025*
*Estilo de referencia: Café Bonka — sencillo pero mágico*
