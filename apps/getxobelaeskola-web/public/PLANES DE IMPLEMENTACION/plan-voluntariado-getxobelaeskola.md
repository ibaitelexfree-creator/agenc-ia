# 🌊 Plan de Implementación — Sección "Hazte Voluntaria"
### getxobelaeskola.cloud · Estilo Apple-limpio × Café Bonka × Framer Motion mágio

---

## 🎯 Visión General

> Una sección blanca, limpia y mágica — como abrir una ventana al mar.  
> Cada scroll es una ola. Cada elemento aparece como si el viento lo trajera.

**Referencia visual:** [cafebonka.com](https://cafebonka.com) — simplicidad que emociona  
**Referencia de limpieza:** Apple.com — espacio, tipografía, confianza  
**Motor de magia:** Framer Motion — animaciones que hacen decir "¿cómo han hecho eso?"

---

## 🎨 Tokens de Diseño

```
PALETA
  --white:       #FFFFFF   ← fondo principal
  --off-white:   #F8F9FA   ← fondos de tarjetas
  --ink:         #0A0A0A   ← texto principal
  --sea:         #0066CC   ← azul marino (acento principal)
  --foam:        #E8F4FD   ← azul muy claro (fondos suaves)
  --sand:        #F5F0E8   ← beige arena (calidez)
  --coral:       #E8634A   ← CTA / botón principal

TIPOGRAFÍA
  Display:  "Playfair Display" · italic · 600
  Body:     "Inter" · 400/500
  Label:    "Inter" · uppercase · 0.1em letter-spacing · 500

RADIOS
  Tarjetas: 20px · Pills: 999px · Botones: 14px

SOMBRAS
  Suave: 0 4px 24px rgba(0,102,204,0.08)
  Hover: 0 12px 48px rgba(0,102,204,0.16)
```

---

## 🏗️ Arquitectura de la Sección

```
┌─────────────────────────────────────────────────────┐
│  SECCIÓN VOLUNTARIADO                               │
│                                                     │
│  ① HERO STATEMENT         (Fade + Float)           │
│     └─ Frase gancho + ola animada SVG               │
│                                                     │
│  ② ¿QUÉ PUEDES HACER?     (Stagger Grid)           │
│     └─ 4 tarjetas de áreas con iconos ilustrados    │
│                                                     │
│  ③ POR QUÉ VALE LA PENA   (Scroll Parallax)        │
│     └─ 4 valores con contador animado               │
│                                                     │
│  ④ TEXTO COMPLETO         (Accordion Reveal)       │
│     └─ Cuerpo expandible con transición suave       │
│                                                     │
│  ⑤ CTA FINAL              (Magnetic Button)        │
│     └─ Botón "¡Quiero ser voluntaria!" + confetti   │
└─────────────────────────────────────────────────────┘
```

---

## 📋 FASES DE IMPLEMENTACIÓN

---

### 🔵 FASE 1 — Estructura Base
**Duración estimada:** 2h · **Complejidad:** ⭐

#### Paso 1.1 — Crear el componente contenedor

```jsx
// VoluntariadoSection.jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function VoluntariadoSection() {
  return (
    <section id="voluntariado" className="vol-section">
      {/* Los 5 bloques irán aquí */}
    </section>
  )
}
```

```css
/* voluntariado.css */
.vol-section {
  background: #FFFFFF;
  overflow: hidden;        /* ← clave para que las olas no se escapen */
  position: relative;
}
```

#### Paso 1.2 — Instalar dependencias

```bash
npm install framer-motion
npm install @tabler/icons-react   # iconos limpios tipo Apple
```

✅ **Checkpoint:** La sección monta sin errores, fondo blanco visible.

---

### 🔵 FASE 2 — Bloque ① HERO STATEMENT
**Duración estimada:** 3h · **Complejidad:** ⭐⭐

#### Aspecto visual

```
┌──────────────────────────────────────────────┐
│                                              │
│   VOLUNTARIADO                               │  ← label gris pequeño
│                                              │
│   ¿Tienes tiempo                             │  ← Playfair Display
│   y ganas de                                 │    72px · italic
│   aportar algo?                              │
│                                              │
│   ════════════════════════                   │  ← línea animada
│                                              │
│   Te estamos esperando.                      │  ← Inter 20px · gris
│                                              │
│  〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰  │  ← ola SVG animada
└──────────────────────────────────────────────┘
```

#### Paso 2.1 — Texto principal con animación de entrada

```jsx
// HeroStatement.jsx
import { motion } from 'framer-motion'

const words = ["¿Tienes", "tiempo", "y", "ganas", "de", "aportar", "algo?"]

export function HeroStatement() {
  return (
    <div className="hero-vol">
      
      {/* Label flotante */}
      <motion.span 
        className="vol-label"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        VOLUNTARIADO
      </motion.span>

      {/* Título palabra a palabra */}
      <h2 className="vol-hero-title">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="word-wrap"
            initial={{ opacity: 0, y: 40, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              delay: 0.3 + i * 0.08,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </h2>

      {/* Línea divisora animada */}
      <motion.div
        className="vol-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
      />

      {/* Subtítulo */}
      <motion.p
        className="vol-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Te estamos esperando.
      </motion.p>

    </div>
  )
}
```

#### Paso 2.2 — Ola SVG animada en la base

```jsx
// WaveBottom.jsx — La firma visual de la sección
import { motion } from 'framer-motion'

export function WaveBottom() {
  return (
    <div className="wave-container">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <motion.path
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,120 L0,120 Z"
          fill="#E8F4FD"
          animate={{
            d: [
              "M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,120 L0,120 Z",
              "M0,60 C360,0 720,120 1080,60 C1260,30 1380,75 1440,60 L1440,120 L0,120 Z",
              "M0,60 C360,120 720,0 1080,60 C1260,90 1380,45 1440,60 L1440,120 L0,120 Z"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  )
}
```

✅ **Checkpoint:** Frase aparece con efecto "caída de palabras", ola oscila infinitamente.

---

### 🔵 FASE 3 — Bloque ② ¿QUÉ PUEDES HACER?
**Duración estimada:** 4h · **Complejidad:** ⭐⭐⭐

#### Aspecto visual

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│        ¿En qué puedes involucrarte?                   │
│                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │     ⛵       │  │     🌊       │  │     🎉       │  │
│  │             │  │             │  │             │  │
│  │  Actividades│  │  En el agua │  │  Eventos    │  │
│  │             │  │             │  │             │  │
│  │ Organiza y  │  │ Asiste a    │  │ Colabora en │  │
│  │ coordina... │  │ monitores...│  │ regatas...  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                    ┌─────────────┐                    │
│                    │     🌿       │                    │
│                    │  Medio amb. │                    │
│                    │ Conservación│                    │
│                    └─────────────┘                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Paso 3.1 — Datos de las tarjetas

```jsx
// data/voluntariadoAreas.js
export const areas = [
  {
    id: "actividades",
    emoji: "⛵",
    titulo: "Organización",
    subtitulo: "de actividades",
    descripcion: "Ayuda a coordinar y planificar las actividades del día a día en la escuela.",
    color: "#E8F4FD"
  },
  {
    id: "agua",
    emoji: "🌊",
    titulo: "En el agua",
    subtitulo: "con los monitores",
    descripcion: "Asiste a nuestros monitores durante las sesiones de vela. ¡El mejor puesto!",
    color: "#E8F4FD"
  },
  {
    id: "eventos",
    emoji: "🎉",
    titulo: "Eventos",
    subtitulo: "y regatas adaptadas",
    descripcion: "Colabora en eventos deportivos y regatas adaptadas para toda la comunidad.",
    color: "#F5F0E8"
  },
  {
    id: "medioambiente",
    emoji: "🌿",
    titulo: "Medio ambiente",
    subtitulo: "conservación de la ría",
    descripcion: "Forma parte de nuestras campañas de conservación medioambiental en la ría.",
    color: "#F5F0E8"
  }
]
```

#### Paso 3.2 — Tarjeta con hover mágico

```jsx
// AreaCard.jsx
import { motion } from 'framer-motion'

export function AreaCard({ area, index }) {
  return (
    <motion.div
      className="area-card"
      style={{ backgroundColor: area.color }}
      
      // Entrada en stagger
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.12,
        type: "spring",
        stiffness: 150,
        damping: 20
      }}
      
      // Hover flotante
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 60px rgba(0,102,204,0.18)",
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      {/* Icono con bounce propio */}
      <motion.div
        className="area-emoji"
        whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        {area.emoji}
      </motion.div>

      <div className="area-text">
        <h3 className="area-titulo">{area.titulo}</h3>
        <span className="area-subtitulo">{area.subtitulo}</span>
        <p className="area-desc">{area.descripcion}</p>
      </div>
    </motion.div>
  )
}
```

#### Paso 3.3 — Grid con stagger orquestado

```jsx
// AreasGrid.jsx
import { motion } from 'framer-motion'
import { AreaCard } from './AreaCard'
import { areas } from '../data/voluntariadoAreas'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export function AreasGrid() {
  return (
    <div className="areas-section">
      <motion.h3
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        ¿En qué puedes involucrarte?
      </motion.h3>

      <motion.div
        className="areas-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {areas.map((area, i) => (
          <AreaCard key={area.id} area={area} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
```

✅ **Checkpoint:** Las 4 tarjetas aparecen una a una al hacer scroll. Hover hace flotar.

---

### 🔵 FASE 4 — Bloque ③ POR QUÉ VALE LA PENA
**Duración estimada:** 3h · **Complejidad:** ⭐⭐⭐

#### Aspecto visual

```
┌──────────────────────────────────────────────────────┐
│   fondo: #F8F9FA (ligeramente fuera del blanco)     │
│                                                      │
│   Ser voluntaria es también...                       │
│                                                      │
│   ╔═════════╗ ╔═════════╗ ╔═════════╗ ╔═════════╗  │
│   ║         ║ ║         ║ ║         ║ ║         ║  │
│   ║  🧭      ║ ║  ⚓      ║ ║  💛      ║ ║  🌱      ║  │
│   ║         ║ ║         ║ ║         ║ ║         ║  │
│   ║ Crecer  ║ ║ Aprender ║ ║  Ver    ║ ║ Vivir   ║  │
│   ║personal ║ ║ navega.  ║ ║ disfr.  ║ ║ aventura║  │
│   ╚═════════╝ ╚═════════╝ ╚═════════╝ ╚═════════╝  │
└──────────────────────────────────────────────────────┘
```

#### Paso 4.1 — Datos de los valores

```jsx
// data/voluntariadoValores.js
export const valores = [
  {
    icon: "🧭",
    titulo: "Crece personalmente",
    texto: "Mejora tu coordinación y descubre nuevas habilidades que van más allá del mar."
  },
  {
    icon: "⚓",
    titulo: "Aprende navegación",
    texto: "Descubre cómo funciona una escuela de vela desde adentro."
  },
  {
    icon: "💛",
    titulo: "Ve la magia",
    texto: "Vivirás la satisfacción de ver cómo los demás disfrutan gracias a tu ayuda."
  },
  {
    icon: "🌱",
    titulo: "Vive la aventura",
    texto: "Compañerismo, buena energía y el mar como escenario permanente."
  }
]
```

#### Paso 4.2 — Tarjeta con reveal de icono giratorio

```jsx
// ValorCard.jsx
import { motion } from 'framer-motion'

export function ValorCard({ valor, index }) {
  return (
    <motion.div
      className="valor-card"
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 18
      }}
      whileHover={{ scale: 1.04 }}
    >
      <motion.div
        className="valor-icon"
        initial={{ rotate: -180, scale: 0 }}
        whileInView={{ rotate: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
      >
        {valor.icon}
      </motion.div>
      <h4 className="valor-titulo">{valor.titulo}</h4>
      <p className="valor-texto">{valor.texto}</p>
    </motion.div>
  )
}
```

✅ **Checkpoint:** Los 4 valores giran al aparecer, fondo sutil diferenciado.

---

### 🔵 FASE 5 — Bloque ④ TEXTO COMPLETO (Acordeón)
**Duración estimada:** 2h · **Complejidad:** ⭐⭐

#### Aspecto visual

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   "¿Tienes tiempo y ganas de aportar algo?"        │
│   Únete a nuestro equipo de voluntariado...        │
│                                                     │
│   [  Leer más sobre el voluntariado  ▼  ]          │
│                                                     │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░ ← se despliega         │
│   (texto completo Opción 1)                         │
│                                                     │
│   [  Cerrar  ▲  ]                                  │
└─────────────────────────────────────────────────────┘
```

#### Paso 5.1 — Acordeón con AnimatePresence

```jsx
// TextoAcordeon.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TEXTO_CORTO = `¿Tienes tiempo y ganas de aportar algo? Únete a nuestro equipo de voluntariado 
en eventos deportivos, regatas adaptadas y campañas de conservación medioambiental en la ría, 
y vive la experiencia de ayudar en la escuela de vela.`

const TEXTO_COMPLETO = `Participar como voluntaria no solo significa colaborar, sino también 
formar parte de nuestra comunidad, aprender nuevas habilidades, disfrutar del mar y conocer 
a personas que comparten tus mismos intereses.

En Getxo Bela Eskola encontrarás un ambiente cercano, divertido y muy positivo, donde cada 
aportación es valorada y cada momento cuenta.

Ser voluntaria en nuestra asociación es también una oportunidad para crecer personalmente: 
mejorar tu coordinación, aprender sobre navegación, descubrir cómo funciona una escuela de vela 
y experimentar de primera mano la magia de la mar.

Si tienes curiosidad, ganas de aprender y un poquito de tiempo para compartir, hazte voluntaria 
y súmate a esta aventura única en la mar. ¡Tu entusiasmo marcará la diferencia!`

export function TextoAcordeon() {
  const [abierto, setAbierto] = useState(false)

  return (
    <motion.div className="acordeon-container">
      
      {/* Texto intro siempre visible */}
      <motion.p
        className="texto-intro"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {TEXTO_CORTO}
      </motion.p>

      {/* Contenido expandible */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="texto-completo"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="texto-completo"
          >
            {TEXTO_COMPLETO.split('\n\n').map((parrafo, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {parrafo}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón toggle */}
      <motion.button
        className="acordeon-toggle"
        onClick={() => setAbierto(!abierto)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          animate={{ rotate: abierto ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
        {abierto ? "Cerrar" : "Leer más sobre el voluntariado"}
      </motion.button>

    </motion.div>
  )
}
```

✅ **Checkpoint:** Texto se expande/colapsa con suavidad. Flecha gira.

---

### 🔵 FASE 6 — Bloque ⑤ CTA FINAL (El momento de magia máxima)
**Duración estimada:** 4h · **Complejidad:** ⭐⭐⭐⭐

#### Aspecto visual

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          Somos una asociación sin ánimo             │
│          de lucro. Cada gesto cuenta.               │
│                                                     │
│                                                     │
│        ╔═══════════════════════════════╗            │
│        ║  ¡Quiero ser voluntaria! 🌊   ║            │
│        ╚═══════════════════════════════╝            │
│          ← botón coral · magnético al cursor        │
│                                                     │
│          ✦ ✦ ✦  (confetti al click) ✦ ✦ ✦          │
│                                                     │
│   ✉ info@getxobelaeskola.com  |  WhatsApp directo  │
└─────────────────────────────────────────────────────┘
```

#### Paso 6.1 — Botón magnético (el truco que sorprende)

```jsx
// MagneticButton.jsx
import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export function MagneticButton({ children, onClick }) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // El botón "sigue" al cursor como un imán
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className="cta-button"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundColor: isHovered ? "#d4502f" : "#E8634A"
      }}
    >
      <motion.span
        animate={{
          x: isHovered ? 4 : 0
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}
```

#### Paso 6.2 — Confetti al hacer click

```bash
npm install canvas-confetti
```

```jsx
// confettiHelper.js
import confetti from 'canvas-confetti'

export const lanzarConfetti = () => {
  // Primera ola — azul marino
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.8 },
    colors: ['#0066CC', '#E8634A', '#E8F4FD', '#0A0A0A']
  })
  
  // Segunda ola — desde los lados (efecto ría)
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 }
    })
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 }
    })
  }, 250)
}
```

#### Paso 6.3 — Bloque CTA completo

```jsx
// CTAFinal.jsx
import { motion } from 'framer-motion'
import { MagneticButton } from './MagneticButton'
import { lanzarConfetti } from '../helpers/confettiHelper'

const WHATSAPP_URL = "https://wa.me/34XXXXXXXXX?text=¡Hola! Me gustaría ser voluntaria en Getxo Bela Eskola"
const EMAIL = "info@getxobelaeskola.com"

export function CTAFinal() {
  const handleClick = () => {
    lanzarConfetti()
    // Pequeño delay antes de abrir para que el confetti se vea
    setTimeout(() => {
      window.open(WHATSAPP_URL, '_blank')
    }, 600)
  }

  return (
    <motion.div
      className="cta-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Frase de cierre */}
      <motion.p
        className="cta-frase"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Somos una <strong>asociación sin ánimo de lucro</strong>.
        <br />
        Tu colaboración nos permite seguir ofreciendo estas experiencias únicas.
      </motion.p>

      {/* Botón principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <MagneticButton onClick={handleClick}>
          ¡Quiero ser voluntaria! 🌊
        </MagneticButton>
      </motion.div>

      {/* Contactos secundarios */}
      <motion.div
        className="cta-contactos"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <a href={`mailto:${EMAIL}`} className="cta-link">
          ✉ {EMAIL}
        </a>
        <span className="cta-separator">·</span>
        <a href={WHATSAPP_URL} className="cta-link cta-link-whatsapp">
          WhatsApp directo →
        </a>
      </motion.div>

    </motion.div>
  )
}
```

✅ **Checkpoint:** Botón sigue al cursor como imán. Click dispara confetti en colores de la escuela.

---

### 🔵 FASE 7 — CSS Global de la Sección
**Duración estimada:** 2h · **Complejidad:** ⭐⭐

```css
/* voluntariado-styles.css */

/* ═══ SECCIÓN BASE ═══ */
.vol-section {
  background: #FFFFFF;
  padding: 120px 0;
  overflow: hidden;
}

/* ═══ HERO ═══ */
.hero-vol {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;
  text-align: center;
}

.vol-label {
  font-family: "Inter", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #0066CC;
  text-transform: uppercase;
  display: block;
  margin-bottom: 32px;
}

.vol-hero-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(48px, 8vw, 80px);
  font-style: italic;
  font-weight: 600;
  color: #0A0A0A;
  line-height: 1.1;
  margin: 0 0 40px;
}

.word-wrap {
  display: inline-block;
  perspective: 1000px;
}

.vol-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #0066CC, transparent);
  transform-origin: left center;
  margin: 0 auto 32px;
  max-width: 200px;
}

.vol-subtitle {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  color: #666;
  font-weight: 400;
}

/* ═══ WAVE ═══ */
.wave-container {
  margin-top: 60px;
  line-height: 0;
}

.wave-container svg {
  width: 100%;
  height: 80px;
}

/* ═══ ÁREAS GRID ═══ */
.areas-section {
  background: #F8F9FA;
  padding: 100px 40px;
}

.section-title {
  font-family: "Inter", sans-serif;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  color: #0A0A0A;
  margin-bottom: 60px;
}

.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.area-card {
  padding: 40px 32px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.04);
}

.area-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 20px;
}

.area-titulo {
  font-family: "Inter", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0A0A0A;
  margin: 0 0 4px;
}

.area-subtitulo {
  font-family: "Inter", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #0066CC;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 16px;
}

.area-desc {
  font-family: "Inter", sans-serif;
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* ═══ VALORES ═══ */
.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 40px;
}

.valor-card {
  text-align: center;
  padding: 40px 24px;
  border-radius: 20px;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
}

.valor-icon {
  font-size: 44px;
  display: block;
  margin-bottom: 20px;
}

.valor-titulo {
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #0A0A0A;
}

.valor-texto {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* ═══ ACORDEÓN ═══ */
.acordeon-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 40px;
}

.texto-intro {
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
}

.texto-completo {
  overflow: hidden;
}

.texto-completo p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

.acordeon-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 1px solid #0066CC;
  color: #0066CC;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: 0.02em;
}

/* ═══ CTA ═══ */
.cta-section {
  padding: 100px 40px;
  text-align: center;
  background: #FFFFFF;
}

.cta-frase {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  color: #444;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 56px;
}

.cta-button {
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  background: #E8634A;
  border: none;
  padding: 20px 52px;
  border-radius: 14px;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow: 0 8px 32px rgba(232, 99, 74, 0.3);
}

.cta-contactos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.cta-link {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.cta-link:hover { color: #0066CC; }
.cta-link-whatsapp:hover { color: #25D366; }
.cta-separator { color: #CCC; }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .vol-hero-title { font-size: 42px; }
  .areas-grid { grid-template-columns: 1fr; }
  .valores-grid { grid-template-columns: 1fr 1fr; }
  .cta-button { padding: 18px 36px; font-size: 16px; }
}

@media (max-width: 480px) {
  .valores-grid { grid-template-columns: 1fr; }
  .acordeon-container { padding: 60px 24px; }
}
```

---

### 🔵 FASE 8 — Ensamblaje Final
**Duración estimada:** 1h · **Complejidad:** ⭐

```jsx
// VoluntariadoSection.jsx — Componente final ensamblado
import './voluntariado-styles.css'
import { HeroStatement } from './HeroStatement'
import { WaveBottom } from './WaveBottom'
import { AreasGrid } from './AreasGrid'
import { ValoresGrid } from './ValoresGrid'
import { TextoAcordeon } from './TextoAcordeon'
import { CTAFinal } from './CTAFinal'

export default function VoluntariadoSection() {
  return (
    <section id="voluntariado">
      
      {/* ① Hero con ola */}
      <div className="vol-section">
        <HeroStatement />
        <WaveBottom />
      </div>
      
      {/* ② Qué puedes hacer */}
      <AreasGrid />
      
      {/* ③ Por qué vale la pena */}
      <ValoresGrid />
      
      {/* ④ Texto completo (acordeón) */}
      <TextoAcordeon />
      
      {/* ⑤ CTA con confetti */}
      <CTAFinal />
      
    </section>
  )
}
```

✅ **Checkpoint final:** La sección completa funciona de inicio a fin.

---

## 📦 Estructura de Archivos

```
src/
├── components/
│   └── voluntariado/
│       ├── VoluntariadoSection.jsx    ← componente raíz
│       ├── HeroStatement.jsx          ← bloque ①
│       ├── WaveBottom.jsx             ← ola SVG
│       ├── AreasGrid.jsx              ← bloque ②
│       ├── AreaCard.jsx               ← tarjeta de área
│       ├── ValoresGrid.jsx            ← bloque ③
│       ├── ValorCard.jsx              ← tarjeta de valor
│       ├── TextoAcordeon.jsx          ← bloque ④
│       ├── MagneticButton.jsx         ← botón imán
│       └── CTAFinal.jsx               ← bloque ⑤
│
├── data/
│   ├── voluntariadoAreas.js           ← textos de 4 áreas
│   └── voluntariadoValores.js         ← textos de 4 valores
│
├── helpers/
│   └── confettiHelper.js              ← lanzador de confetti
│
└── styles/
    └── voluntariado-styles.css        ← todos los estilos
```

---

## 🧪 Resumen de Checkpoints

| Fase | Qué comprobar | Estado |
|------|--------------|--------|
| 1 | Sección monta, fondo blanco | ⬜ |
| 2 | Palabras caen una a una, ola oscila | ⬜ |
| 3 | Tarjetas aparecen en stagger, hover flota | ⬜ |
| 4 | Iconos giran al entrar en viewport | ⬜ |
| 5 | Acordeón abre/cierra suave, flecha gira | ⬜ |
| 6 | Botón sigue cursor, confetti al click | ⬜ |
| 7 | CSS correcto, sin colisiones | ⬜ |
| 8 | Sección completa ensamblada | ⬜ |

---

## 🚨 Notas Importantes para la Implementación

> **Fuente Playfair Display** — añadir en `index.html`:
> ```html
> <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
> ```

> **Número de WhatsApp** — reemplazar `XXXXXXXXX` en `CTAFinal.jsx` con el número real de la escuela.

> **Reduced Motion** — respetar preferencias del usuario:
> ```css
> @media (prefers-reduced-motion: reduce) {
>   .wave-container svg path { animation: none; }
> }
> ```

> **canvas-confetti** puede necesitar tipado si usáis TypeScript:
> ```bash
> npm install --save-dev @types/canvas-confetti
> ```

---

*Plan generado para getxobelaeskola.cloud · Sección Voluntariado*  
*Estilo: Apple-clean × Café Bonka × Framer Motion*
