# 🌬️ Plan de Implementación — Sección "Qué es la Vela"
### getxobelaeskola.cloud · Estilo: blanco Apple + magia Café Bonka
> **Instrucciones para la IA ejecutora:** Lee cada fase completa antes de tocar código. Cada tarea tiene una sola acción y un resultado verificable. No improvises. No añadas librerías extra. Si algo no está especificado, usa exactamente los valores del sistema de diseño.

---

## 🎯 Visión General de la Página

```
┌─────────────────────────────────────────────────────────────────────┐
│  HERO                                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Fondo blanco puro · Texto negro · Sin imagen de fondo     │   │
│  │                                                             │   │
│  │           La vela                                          │   │
│  │     (palabra "vela" se anima letra a letra)                │   │
│  │                                                             │   │
│  │  Tagline · botón fantasma                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  FRASE GRANDE (scroll-pinned, texto que aparece palabra a palabra)  │
│  "La vela combina técnica · calma · aventura · conexión"            │
│                                                                     │
│  FILOSOFÍA "LA VELA SE ADAPTA A TI"                                │
│  4 elecciones en grid 2×2 con ilustraciones SVG inline              │
│                                                                     │
│  TEXTO NARRATIVO (reveal por párrafos al scroll)                    │
│  Historia de Euskal Herria y la mar                                 │
│                                                                     │
│  SELECTOR INTERACTIVO (elige tu experiencia)                        │
│  Calma ←────────────→ Acción  (slider o toggle animado)            │
│                                                                     │
│  CTA FINAL (blanco con borde fino, minimalista)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Sistema de Diseño — Tokens (NO modificar)

```
COLORES
  --white:        #FFFFFF   (fondo principal — blanco puro Apple)
  --black:        #1D1D1F   (texto principal — negro Apple, no negro puro)
  --grey-100:     #F5F5F7   (fondo alternativo secciones)
  --grey-200:     #E8E8ED   (bordes, líneas divisoras)
  --grey-500:     #86868B   (texto secundario, labels)
  --blue-sea:     #0071E3   (único acento de color — azul Apple/mar)
  --blue-light:   #E8F2FF   (fondo suave de cards azul)

TIPOGRAFÍA
  Display:  "DM Serif Display" (Google Fonts) — solo para títulos h1
  Body:     "Inter" (Google Fonts) — todo lo demás
  Utility:  "Inter" weight 400, size 0.875rem — labels y metadatos
  
  ESCALA DE TAMAÑOS (no inventar otros)
    --text-xs:   0.75rem    (12px) — labels, eyebrows
    --text-sm:   0.875rem   (14px) — cuerpo secundario
    --text-base: 1rem        (16px) — cuerpo principal
    --text-lg:   1.25rem    (20px) — intro párrafos
    --text-xl:   1.75rem    (28px) — subtítulos
    --text-2xl:  2.5rem     (40px) — h2
    --text-3xl:  4rem        (64px) — h1 secciones
    --text-hero: 7rem        (112px) — solo hero h1

ESPACIADO
  Sección:  py-32 (128px) en desktop / py-20 (80px) en mobile
  Container: max-w-6xl mx-auto px-6
  Gap grid:  gap-6 (1.5rem)

BORDES
  Card:        rounded-3xl (1.5rem)
  Badge:       rounded-full
  Botón:       rounded-full
  Imagen:      rounded-2xl (1rem)

SOMBRAS (usar CON MODERACIÓN — estilo Apple)
  Hover card:  0 8px 32px rgba(0,0,0,0.08)
  CTA button:  0 4px 16px rgba(0,113,227,0.3)

SIGNATURE ELEMENT: La "O" de la palabra "vela" pulsa como una burbuja de agua
```

---

## 📦 Dependencias (verificar antes de empezar)

```bash
# Verificar que existen (ya deben estar del plan anterior):
npm list framer-motion        # debe ser >= 10.x
npm list @studio-freight/lenis

# Verificar fuentes en layout.tsx:
# DM Serif Display + Inter deben estar como next/font/google
```

Si **DM Serif Display** no está, añadir:
```tsx
import { DM_Serif_Display, Inter } from "next/font/google";
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});
// añadir --font-dm-serif al className del <html>
```

---

## 🗂 Estructura de Archivos a Crear

```
app/
└── que-es-la-vela/
    └── page.tsx

components/
└── vela/
    ├── VelaHero.tsx
    ├── VelaFraseAnimada.tsx
    ├── VelaFilosofia.tsx
    ├── VelaTextoNarrativo.tsx
    ├── VelaSelectorExperiencia.tsx
    └── VelaCTA.tsx
```

> ⚠️ No crear ningún archivo .css separado. Todo el estilo va inline como Tailwind classes o style props.

---

# FASE 1 — Scaffolding
> ⏱ 15 min · ⭐☆☆☆☆

---

## TAREA 1.1 — Crear la página raíz

**Archivo:** `app/que-es-la-vela/page.tsx`

```tsx
// app/que-es-la-vela/page.tsx
import VelaHero from "@/components/vela/VelaHero";
import VelaFraseAnimada from "@/components/vela/VelaFraseAnimada";
import VelaFilosofia from "@/components/vela/VelaFilosofia";
import VelaTextoNarrativo from "@/components/vela/VelaTextoNarrativo";
import VelaSelectorExperiencia from "@/components/vela/VelaSelectorExperiencia";
import VelaCTA from "@/components/vela/VelaCTA";

export const metadata = {
  title: "Qué es la Vela | GetxoBelaEskola",
  description:
    "La vela combina técnica, calma y una conexión profunda con la mar. Descubre cómo cada persona puede encontrar su propio lugar en el agua.",
  openGraph: {
    title: "Qué es la Vela | GetxoBelaEskola",
    description:
      "Calma, aventura o todo a la vez. La vela se adapta a ti. Navega en Getxo.",
    images: [{ url: "/vela/og-vela.jpg", width: 1200, height: 630 }],
  },
};

export default function QueEsLaVelaPage() {
  return (
    <main className="bg-white overflow-hidden">
      <VelaHero />
      <VelaFraseAnimada />
      <VelaFilosofia />
      <VelaTextoNarrativo />
      <VelaSelectorExperiencia />
      <VelaCTA />
    </main>
  );
}
```

**✅ Resultado:** Ruta `/que-es-la-vela` existe y carga sin errores.

---

# FASE 2 — Hero (El primer golpe)
> ⏱ 50 min · ⭐⭐⭐☆☆

---

## Vista previa

```
┌──────────────────────────────────────────────────────────────┐
│  FONDO: #FFFFFF   (blanco absoluto, sin imagen)              │
│                                                              │
│                                                              │
│     Qué es            ←  animación letra a letra            │
│                                                              │
│     ─────────────────                                        │
│                                                              │
│     la vela.          ←  "vela" aparece con spring          │
│                                                              │
│                                                              │
│  Un deporte único que combina técnica, calma y    ←  fade   │
│  una conexión profunda con la mar.                           │
│                                                              │
│      [ Descubrir →  ]   ← botón con border azul             │
│                                                              │
│                           ↓  indicador de scroll            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## TAREA 2.1 — Crear VelaHero.tsx

**Archivo:** `components/vela/VelaHero.tsx`

**Mecánica de animación:**
- Título "Qué es" → cada letra en `<motion.span>` con stagger 0.04s, `y: 80 → 0`
- Línea horizontal → `scaleX: 0 → 1`, `transformOrigin: "left"`
- "la vela." → entrada con spring `type: "spring", stiffness: 60, damping: 15`
- La "o" de "la" pulsa sutilmente (scale 1 → 1.04 → 1 en loop) — el **signature element**
- Subtítulo → `opacity: 0 → 1`, delay 1.2s
- Botón → `opacity: 0, y: 10 → 0`, delay 1.5s

```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

// Helper: anima texto letra a letra
function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const letters = text.split("");
  return (
    <span className={className} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export default function VelaHero() {
  return (
    <section className="min-h-screen bg-white flex flex-col justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      
      {/* Círculo decorativo de fondo — sutil, casi invisible */}
      <motion.div
        className="absolute right-[-20%] top-[10%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, #E8F2FF 0%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          GetxoBelaEskola · Getxo, Euskal Herria
        </motion.p>

        {/* H1 línea 1: "Qué es" */}
        <h1
          className="font-bold leading-none mb-0 text-[#1D1D1F] overflow-hidden"
          style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
        >
          <AnimatedText text="Qué es" delay={0.2} />
        </h1>

        {/* Línea divisora animada */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#1D1D1F] my-4 origin-left"
          style={{ width: "clamp(200px, 35vw, 480px)" }}
        />

        {/* H1 línea 2: "la vela." */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 55, damping: 14, delay: 0.8 }}
            className="font-bold leading-none text-[#1D1D1F]"
            style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
          >
            {/* Signature: la "a" de "la" tiene pulso de agua */}
            l
            <motion.span
              animate={{ scaleY: [1, 1.05, 1], scaleX: [1, 0.97, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ display: "inline-block", transformOrigin: "bottom center" }}
            >
              a
            </motion.span>{" "}
            <span className="text-[#0071E3]">vela</span>.
          </motion.h1>
        </div>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
          className="mt-10 text-[#86868B] max-w-xl leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", fontSize: "1.2rem" }}
        >
          Un deporte maravilloso que combina técnica, calma y una
          conexión profunda con la mar. Para cada persona, algo diferente.
        </motion.p>

        {/* Botón CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="mt-10"
        >
          <Link
            href="#filosofia"
            className="inline-flex items-center gap-2 border border-[#0071E3] text-[#0071E3] 
                       px-8 py-3 rounded-full text-sm font-medium
                       hover:bg-[#0071E3] hover:text-white transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Descubrir
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-px h-12 bg-[#86868B]/40 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>

    </section>
  );
}
```

**✅ Resultado:** Hero en blanco puro, título con entrada choreografiada letra a letra, línea animada, "vela" en azul, botón fantasma Apple-style.

---

# FASE 3 — Frase Animada (el momento wow)
> ⏱ 40 min · ⭐⭐⭐⭐☆

---

## Vista previa

```
┌──────────────────────────────────────────────────────────────┐
│  Fondo: #F5F5F7 (gris Apple muy suave)                       │
│                                                              │
│  Según el usuario hace scroll, las palabras van              │
│  apareciendo una a una en grande:                            │
│                                                              │
│  "La vela                                                    │
│   combina          ← va apareciendo al scroll               │
│   técnica,                                                   │
│   calma,           ← palabras clave en azul                  │
│   aventura,                                                  │
│   escucha                                                    │
│   y conexión."                                               │
│                                                              │
│  (Efecto: palabras grises → se iluminan en negro/azul       │
│   conforme entran en viewport, estilo Apple keynote)        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## TAREA 3.1 — Crear VelaFraseAnimada.tsx

**Archivo:** `components/vela/VelaFraseAnimada.tsx`

**Mecánica:** Cada palabra es un `<motion.span>`. Todas empiezan en `color: #D1D1D6` (gris claro). Al entrar en viewport con `whileInView`, cambian a `color: #1D1D1F` (negro) o a `color: #0071E3` (azul) si es palabra clave. `staggerChildren: 0.08`.

```tsx
"use client";
import { motion } from "framer-motion";

// Palabras de la frase con su tipo
const WORDS: { text: string; highlight: boolean }[] = [
  { text: "La", highlight: false },
  { text: "vela", highlight: true },
  { text: "combina", highlight: false },
  { text: "técnica,", highlight: true },
  { text: "calma,", highlight: true },
  { text: "aventura,", highlight: true },
  { text: "escucha", highlight: true },
  { text: "y", highlight: false },
  { text: "una", highlight: false },
  { text: "conexión", highlight: true },
  { text: "profunda", highlight: false },
  { text: "con", highlight: false },
  { text: "la", highlight: false },
  { text: "mar.", highlight: true },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const wordVariants = {
  hidden: { color: "#D1D1D6" },
  visible: (highlight: boolean) => ({
    color: highlight ? "#0071E3" : "#1D1D1F",
    transition: { duration: 0.4, ease: "easeOut" },
  }),
};

export default function VelaFraseAnimada() {
  return (
    <section className="bg-[#F5F5F7] py-32 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-12"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          la esencia
        </motion.p>

        {/* Frase palabra a palabra */}
        <motion.p
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          className="leading-tight"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
          }}
        >
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              custom={word.highlight}
              variants={wordVariants}
              style={{ display: "inline-block", marginRight: "0.35em" }}
            >
              {word.text}
            </motion.span>
          ))}
        </motion.p>

        {/* Línea de cierre */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#E8E8ED] mt-16 origin-left"
        />

      </div>
    </section>
  );
}
```

**✅ Resultado:** Sección con frase grande donde cada palabra se ilumina en negro/azul al entrar en viewport, estilo Apple keynote.

---

# FASE 4 — Filosofía "La Vela Se Adapta a Ti"
> ⏱ 70 min · ⭐⭐⭐⭐☆

---

## Vista previa (grid 2×2)

```
┌────────────────────────────────────────────────────────────────┐
│  Fondo: #FFFFFF                                               │
│                                                               │
│  "La vela se adapta a ti"  ← título grande                   │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │                      │  │                      │          │
│  │  ≋  Navegación       │  │  ☀  Tu experiencia   │          │
│  │     a la carta       │  │     (calma/acción)   │          │
│  │                      │  │                      │          │
│  │  Texto explicativo   │  │  Texto explicativo   │          │
│  │                      │  │                      │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │                      │  │                      │          │
│  │  ⚓  Tu escenario    │  │  ⛵  Tu compañía      │          │
│  │   (interior/abra)    │  │  (solo/grupo)        │          │
│  │                      │  │                      │          │
│  │  Texto explicativo   │  │  Texto explicativo   │          │
│  │                      │  │                      │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                               │
│  Cards: fondo blanco, borde #E8E8ED, hover → fondo #E8F2FF   │
│  Hover levanta la card 8px con sombra suave                  │
└────────────────────────────────────────────────────────────────┘
```

## TAREA 4.1 — Definir datos de las cards

**Añadir ANTES del componente en `VelaFilosofia.tsx`:**

```tsx
// Ilustraciones SVG inline — una por card
const SVG_CARTA = (
  // Olas apiladas — "a la carta"
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 36 Q14 30 20 36 Q26 42 32 36 Q38 30 44 36 Q50 42 56 36" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M8 28 Q14 22 20 28 Q26 34 32 28 Q38 22 44 28 Q50 34 56 28" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M8 20 Q14 14 20 20 Q26 26 32 20 Q38 14 44 20 Q50 26 56 20" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.2"/>
  </svg>
);

const SVG_EXPERIENCIA = (
  // Sol con un lado tranquilo y otro dinámico
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="28" r="10" stroke="#0071E3" strokeWidth="2.5"/>
    {/* Rayos izquierda (suaves, cortos) */}
    <line x1="12" y1="28" x2="15" y2="28" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="17" x2="17" y2="20" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="39" x2="17" y2="36" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    {/* Rayos derecha (largos, dinámicos) */}
    <line x1="44" y1="28" x2="38" y2="28" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="41" y1="17" x2="37" y2="20" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="41" y1="39" x2="37" y2="36" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="48" y1="20" x2="44" y2="24" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SVG_ESCENARIO = (
  // Ancla minimalista
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="5" stroke="#0071E3" strokeWidth="2.5"/>
    <line x1="28" y1="23" x2="28" y2="42" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 34 Q18 42 28 42 Q38 42 42 34" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <line x1="19" y1="29" x2="14" y2="34" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    <line x1="37" y1="29" x2="42" y2="34" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SVG_COMPANIA = (
  // Velero minimalista
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="28" y1="8" x2="28" y2="42" stroke="#0071E3" strokeWidth="2" strokeLinecap="round"/>
    {/* Vela grande */}
    <path d="M28 10 L44 36 L28 36 Z" stroke="#0071E3" strokeWidth="2" fill="#E8F2FF" strokeLinejoin="round"/>
    {/* Vela pequeña */}
    <path d="M28 16 L16 36 L28 36 Z" stroke="#0071E3" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.5"/>
    {/* Casco */}
    <path d="M18 42 Q28 48 38 42" stroke="#0071E3" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const CARDS = [
  {
    id: "carta",
    svg: SVG_CARTA,
    title: "Navegación a la carta",
    text: "Los partes meteorológicos actuales son precisos y accesibles para cualquiera. Puedes elegir navegar días tranquilos, días potentes o cualquier punto intermedio. Todas las opciones son válidas.",
  },
  {
    id: "experiencia",
    svg: SVG_EXPERIENCIA,
    title: "Elige tu experiencia",
    text: "Calma y meditación, o intensidad y adrenalina. Hay quien desconecta del trabajo con horas de silencio en el agua; hay quien busca el viento fuerte. La mar tiene todo eso.",
  },
  {
    id: "escenario",
    svg: SVG_ESCENARIO,
    title: "Elige tu escenario",
    text: "Abra interior: aguas protegidas para aprender y relajarse. Abra exterior: mar abierto y emocionante. Puedes empezar en uno y explorar el otro cuando quieras.",
  },
  {
    id: "compania",
    svg: SVG_COMPANIA,
    title: "Elige tu compañía",
    text: "Veleros pequeños para 2–6 personas, muy activos y maniobrable. O cruceros para hasta 8 personas, ideales para dinámicas de equipo y grupos que quieran navegarlo juntos.",
  },
];
```

## TAREA 4.2 — Crear VelaFilosofia.tsx completo

**Archivo:** `components/vela/VelaFilosofia.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

// [PEGAR AQUÍ los SVGs y CARDS del paso 4.1]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function VelaFilosofia() {
  return (
    <section id="filosofia" className="bg-white py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <p
            className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            filosofía
          </p>
          <h2
            className="text-[#1D1D1F] leading-tight max-w-2xl"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            }}
          >
            La vela se adapta a ti.
          </h2>
          <p
            className="mt-4 text-[#86868B] max-w-lg text-base leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            No tienes que adaptarte tú a la navegación. Puedes elegir
            en cada salida qué quieres vivir y cómo.
          </p>
        </motion.div>

        {/* Grid 2x2 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                backgroundColor: "#E8F2FF",
              }}
              className="bg-white border border-[#E8E8ED] rounded-3xl p-10 cursor-default transition-colors duration-300"
            >
              {/* Icono SVG */}
              <motion.div
                whileHover={{ rotate: [-3, 3, 0] }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                {card.svg}
              </motion.div>

              {/* Título */}
              <h3
                className="text-[#1D1D1F] text-xl font-semibold mb-3 leading-snug"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {card.title}
              </h3>

              {/* Texto */}
              <p
                className="text-[#86868B] text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
```

**✅ Resultado:** Grid 2×2 con cards blancas, iconos SVG de mar/vela, hover que levanta la card y cambia a fondo azul muy suave.

---

# FASE 5 — Texto Narrativo (Historia de Euskal Herria)
> ⏱ 40 min · ⭐⭐☆☆☆

---

## Vista previa

```
┌────────────────────────────────────────────────────────────────┐
│  Fondo: #F5F5F7                                               │
│                                                               │
│  Layout: dos columnas — izquierda (sticky label),             │
│          derecha (párrafos que entran uno a uno al scroll)    │
│                                                               │
│  ┌──────────────┬──────────────────────────────────────────┐  │
│  │              │                                          │  │
│  │  Nuestra     │  "La vela no es solo adrenalina.        │  │
│  │  historia    │   También puede ser suave,              │  │
│  │              │   meditativa y profundamente            │  │
│  │  [sticky     │   relajante..."                         │  │
│  │   en         │                                         │  │
│  │   desktop]   │  "En Euskal Herria hemos tenido         │  │
│  │              │   históricamente una relación           │  │
│  │              │   profunda con la mar..."               │  │
│  │              │                                         │  │
│  │              │  "Hoy podemos recuperar esa relación    │  │
│  │              │   desde lugares muy diferentes..."      │  │
│  │              │                                         │  │
│  └──────────────┴──────────────────────────────────────────┘  │
│                                                               │
│  Cada párrafo entra con opacity 0→1 + y 30→0 al scroll      │
└────────────────────────────────────────────────────────────────┘
```

## TAREA 5.1 — Crear VelaTextoNarrativo.tsx

**Archivo:** `components/vela/VelaTextoNarrativo.tsx`

```tsx
"use client";
import { motion } from "framer-motion";

const PARAGRAPHS = [
  {
    id: "p1",
    text: "La vela no es un deporte exclusivamente adrenalínico ni algo reservado para quienes buscan emociones fuertes. También puede ser una práctica suave, meditativa y profundamente relajante.",
    highlight: "suave, meditativa y profundamente relajante.",
  },
  {
    id: "p2",
    text: "Hay quien sale en un velero pequeño después del trabajo y, durante algunas horas, se abstrae por completo de las preocupaciones de tierra. En la mar, la cabeza se ordena sola: estás al viento, al rumbo, al sonido del agua, al movimiento del barco. Y nada más.",
    highlight: null,
  },
  {
    id: "p3",
    text: "En Euskal Herria hemos tenido históricamente una relación profunda con la mar. Nuestros pueblos crecieron gracias a ella. Nuestros ancestros pescaban en pequeños veleros de madera, competían por llegar antes a puerto y vender su pescado al mejor precio.",
    highlight: "relación profunda con la mar.",
  },
  {
    id: "p4",
    text: "La vela forma parte de nuestra memoria colectiva, aunque a veces la hayamos olvidado. Hoy podemos recuperar esa relación desde lugares muy diferentes, cada una a su manera y según lo que busca en cada momento.",
    highlight: null,
  },
];

export default function VelaTextoNarrativo() {
  return (
    <section className="bg-[#F5F5F7] py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Layout dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          
          {/* Columna izquierda — sticky label */}
          <div className="md:sticky md:top-32 md:self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p
                className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                nuestra historia
              </p>
              {/* Línea vertical decorativa */}
              <div className="w-px h-24 bg-gradient-to-b from-[#0071E3] to-transparent" />
            </motion.div>
          </div>

          {/* Columna derecha — párrafos */}
          <div className="flex flex-col gap-12">
            {PARAGRAPHS.map((para, i) => (
              <motion.div
                key={para.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p
                  className="text-[#1D1D1F] leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "1.15rem" }}
                >
                  {para.highlight
                    ? para.text.replace(
                        para.highlight,
                        `__HIGHLIGHT__${para.highlight}__END__`
                      ).split("__HIGHLIGHT__").map((chunk, j) => {
                        if (j === 0) return chunk;
                        const [highlighted, rest] = chunk.split("__END__");
                        return (
                          <>
                            <span key={j} className="text-[#0071E3] font-medium">
                              {highlighted}
                            </span>
                            {rest}
                          </>
                        );
                      })
                    : para.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
```

> ⚠️ **Nota para la IA ejecutora:** El render de texto con highlight usa `.split()` + render condicional. Si da error de TypeScript en el retorno del `.map()`, envolver en `<React.Fragment key={j}>` los fragmentos con highlight+rest.

**✅ Resultado:** Layout dos columnas. Label sticky en desktop. Párrafos entrando uno a uno al scroll con palabras clave en azul.

---

# FASE 6 — Selector de Experiencia (elemento interactivo)
> ⏱ 60 min · ⭐⭐⭐⭐☆

---

## Vista previa

```
┌────────────────────────────────────────────────────────────────┐
│  Fondo: #FFFFFF                                               │
│                                                               │
│  "¿Cómo quieres navegar hoy?"                                │
│                                                               │
│         [  CALMA  ] ─────────── [ ACCIÓN ]                   │
│              ↑                                               │
│           (toggle entre dos estados)                         │
│                                                               │
│  Estado CALMA:                   Estado ACCIÓN:              │
│  ┌──────────────────────┐        ┌──────────────────────┐    │
│  │                      │        │                      │    │
│  │  Fondo: #F5F5F7      │        │  Fondo: #0071E3      │    │
│  │  Texto oscuro        │  ←→    │  Texto blanco        │    │
│  │                      │        │                      │    │
│  │  "Abra interior,     │        │  "Abra exterior,     │    │
│  │   aguas protegidas,  │        │   viento fuerte,     │    │
│  │   velero pequeño,    │        │   emoción,           │    │
│  │   silencio."         │        │   intensidad."       │    │
│  │                      │        │                      │    │
│  │  [Empezar →]         │        │  [Empezar →]         │    │
│  └──────────────────────┘        └──────────────────────┘    │
│                                                               │
│  El bloque cambia con AnimatePresence + layout animation     │
└────────────────────────────────────────────────────────────────┘
```

## TAREA 6.1 — Crear VelaSelectorExperiencia.tsx

**Archivo:** `components/vela/VelaSelectorExperiencia.tsx`

```tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Modo = "calma" | "accion";

const MODOS = {
  calma: {
    label: "Calma",
    emoji: "🌊",
    bg: "#F5F5F7",
    textColor: "#1D1D1F",
    accentColor: "#0071E3",
    subtextColor: "#86868B",
    titulo: "Navegar para desconectar.",
    descripcion:
      "Abra interior, aguas protegidas. Velero pequeño, sin prisa. La cabeza se ordena sola y durante unas horas no existe nada más que el viento, el rumbo y el sonido del agua.",
    tags: ["Aguas protegidas", "Sin presión", "Meditativo", "Después del trabajo"],
    cta: "Ver cursos tranquilos →",
  },
  accion: {
    label: "Acción",
    emoji: "💨",
    bg: "#0071E3",
    textColor: "#FFFFFF",
    accentColor: "#FFFFFF",
    subtextColor: "rgba(255,255,255,0.7)",
    titulo: "Navegar para sentir.",
    descripcion:
      "Abra exterior, viento real. Velocidad, emoción, esfuerzo y recompensa. Para quienes buscan la intensidad de la mar sin filtros.",
    tags: ["Mar abierto", "Viento fuerte", "Adrenalina", "Desafío"],
    cta: "Ver cursos intensivos →",
  },
};

export default function VelaSelectorExperiencia() {
  const [modo, setModo] = useState<Modo>("calma");
  const data = MODOS[modo];

  return (
    <section className="bg-white py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            elige tu manera
          </p>
          <h2
            className="text-[#1D1D1F] leading-tight"
            style={{
              fontFamily: "var(--font-dm-serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            ¿Cómo quieres navegar hoy?
          </h2>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-[#F5F5F7] rounded-full p-1">
            {(["calma", "accion"] as Modo[]).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className="relative px-8 py-3 rounded-full text-sm font-medium transition-colors duration-200 outline-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: modo === m ? "#FFFFFF" : "#86868B",
                  zIndex: 1,
                }}
              >
                {modo === m && (
                  <motion.div
                    layoutId="toggle-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: m === "accion" ? "#0071E3" : "#1D1D1F" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {MODOS[m].emoji} {MODOS[m].label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Panel animado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={modo}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-12 md:p-16"
            style={{ backgroundColor: data.bg }}
          >
            {/* Emoji grande */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="text-6xl mb-8"
            >
              {data.emoji}
            </motion.div>

            {/* Título */}
            <h3
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-dm-serif)", color: data.textColor }}
            >
              {data.titulo}
            </h3>

            {/* Descripción */}
            <p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: "var(--font-inter)", color: data.subtextColor }}
            >
              {data.descripcion}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: data.textColor,
                    borderColor:
                      modo === "accion" ? "rgba(255,255,255,0.3)" : "#E8E8ED",
                    backgroundColor:
                      modo === "accion" ? "rgba(255,255,255,0.1)" : "#FFFFFF",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 font-medium text-sm"
              style={{
                fontFamily: "var(--font-inter)",
                color: data.accentColor,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              {data.cta}
            </Link>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
```

**✅ Resultado:** Toggle pill animado con `layoutId`. Panel que cambia entre fondo gris suave (calma) y azul (acción) con `AnimatePresence`. Tags y CTA adaptados al estado.

---

# FASE 7 — CTA Final (minimalista Apple)
> ⏱ 20 min · ⭐⭐☆☆☆

---

## Vista previa

```
┌────────────────────────────────────────────────────────────────┐
│  Fondo: #F5F5F7                                               │
│                                                               │
│  "Por eso la vela sigue siendo tan especial."                │
│                                                               │
│  Texto secondary: "Porque nos permite encontrar              │
│  nuestro propio lugar en la mar."                            │
│                                                               │
│  [ Empezar a navegar ]  ← botón azul sólido                 │
│  [ Ver todos los cursos ]  ← botón fantasma                  │
│                                                               │
│  Línea + copyright mínimo                                    │
└────────────────────────────────────────────────────────────────┘
```

## TAREA 7.1 — Crear VelaCTA.tsx

**Archivo:** `components/vela/VelaCTA.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VelaCTA() {
  return (
    <section className="bg-[#F5F5F7] py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Línea decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-[#E8E8ED] mb-20 origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-6"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          getxobelaeskola · getxo
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#1D1D1F] leading-tight mb-6"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
          }}
        >
          Por eso la vela sigue siendo tan especial.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[#86868B] text-lg mb-12 max-w-lg mx-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Porque permite encontrar tu propio lugar en la mar
          y disfrutarla de mil formas distintas.
        </motion.p>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/cursos"
            className="inline-block bg-[#0071E3] text-white font-medium text-sm 
                       px-8 py-3 rounded-full hover:bg-[#0077ED] 
                       transition-all duration-200 shadow-[0_4px_16px_rgba(0,113,227,0.3)]
                       hover:shadow-[0_6px_24px_rgba(0,113,227,0.4)] hover:scale-[1.02]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Empezar a navegar
          </Link>
          <Link
            href="/cursos"
            className="inline-block bg-transparent text-[#0071E3] font-medium text-sm 
                       px-8 py-3 rounded-full border border-[#0071E3]/30
                       hover:border-[#0071E3] hover:bg-[#E8F2FF]
                       transition-all duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ver todos los cursos
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
```

**✅ Resultado:** CTA limpia con línea divisora, frase final del texto oficial, dos botones Apple-style.

---

# FASE 8 — Polish Final
> ⏱ 20 min · ⭐⭐☆☆☆

---

## TAREA 8.1 — Corregir el render del texto con highlights en Fase 5

Si el componente `VelaTextoNarrativo` da errores de TypeScript con el `.split()` + render condicional, sustituir ese párrafo con highlight por una función más limpia:

```tsx
// Helper a añadir ANTES del componente VelaTextoNarrativo
function HighlightText({ text, highlight }: { text: string; highlight: string | null }) {
  if (!highlight) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <span className="text-[#0071E3] font-medium">{highlight}</span>
      {after}
    </>
  );
}
```

Y usar en el render:
```tsx
<p className="..." style={{ ... }}>
  <HighlightText text={para.text} highlight={para.highlight} />
</p>
```

## TAREA 8.2 — `prefers-reduced-motion`

Añadir a `globals.css` o al archivo de estilos globales:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## TAREA 8.3 — Imagen OG

Crear `/public/vela/og-vela.jpg` (1200×630px). Contenido sugerido: fotografía de un velero en el Abra de Getxo, sin texto sobreimpreso.

---

# ✅ Checklist Final

```
FUNCIONAL
[ ] Ruta /que-es-la-vela carga sin errores
[ ] Toggle Calma/Acción cambia el panel correctamente
[ ] El botón del Hero hace scroll al section#filosofia
[ ] Los links de CTA van a /cursos

ANIMACIONES
[ ] Hero: letras entran en stagger, NO todas a la vez
[ ] Frase animada: palabras grises → negras/azules al scroll
[ ] Cards: stagger de 0.12s entre cada card
[ ] Toggle: pill se mueve con layout animation spring
[ ] AnimatePresence: panel hace fade+slide al cambiar modo

VISUAL
[ ] Fondo principal = #FFFFFF (no crema, no gris, blanco puro)
[ ] Negro de texto = #1D1D1F (no #000000)
[ ] Único acento = #0071E3 (no usar otros colores nuevos)
[ ] Fuente display = DM Serif Display (no Playfair aquí)
[ ] Fuente body = Inter

MOBILE
[ ] Hero funciona en 375px de ancho
[ ] Grid filosofía: 1 columna en mobile, 2 en desktop
[ ] Toggle no se sale de pantalla
[ ] Texto narrativo: columna única en mobile (sin sticky)

PERFORMANCE
[ ] whileInView con once: true en todos los bloques
[ ] No hay motion.div innecesarios — solo donde aportan
[ ] SVGs son inline (no externos), sin tamaños excesivos
```

---

# 📐 Resumen de Fases

| Fase | Componente | ⏱ | Dificultad |
|------|-----------|---|------------|
| 1 | Scaffolding | 15 min | ⭐☆☆☆☆ |
| 2 | VelaHero | 50 min | ⭐⭐⭐☆☆ |
| 3 | VelaFraseAnimada | 40 min | ⭐⭐⭐⭐☆ |
| 4 | VelaFilosofia (grid) | 70 min | ⭐⭐⭐⭐☆ |
| 5 | VelaTextoNarrativo | 40 min | ⭐⭐☆☆☆ |
| 6 | VelaSelectorExperiencia | 60 min | ⭐⭐⭐⭐☆ |
| 7 | VelaCTA | 20 min | ⭐⭐☆☆☆ |
| 8 | Polish final | 20 min | ⭐⭐☆☆☆ |
| **TOTAL** | | **~4.5h** | |

---

## 🌊 Qué hace que esta sección sea mágica (resumen)

| Elemento | Por qué funciona |
|----------|-----------------|
| Título letra a letra con spring | No es solo fade — cada letra tiene masa física |
| Frase con palabras que se iluminan | Crea expectativa: el lector espera ver cuál es la siguiente |
| Layout dos columnas con sticky | Sensación de profundidad editorial, no blog |
| Toggle con `layoutId` | La pill se desliza, no hace click/unclick — parece viva |
| `AnimatePresence` en el panel | Calma y Acción son mundos distintos — la transición lo dice |
| SVGs de mar dibujados a mano | Personalidad — no es Heroicons, no es emoji |
| Blanco Apple + un solo acento | Todo el poder visual concentrado en un color |

---

*Plan generado para getxobelaeskola.cloud · Sección "Qué es la Vela" · Junio 2025*
*Estilo: blanco Apple × magia Café Bonka*
