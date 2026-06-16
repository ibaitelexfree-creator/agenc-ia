# ⛵ Plan de Implementación — Velero 3D Scroll-Driven
### "Qué es la Vela" · Experiencia Apple-Level con Modelo 3D Optimist
> **Fecha:** 16 junio 2026
> **Estado:** PLAN — NO implementar hasta aprobación
> **Modelo 3D:** `scene_draco.glb` (5.46 MB, compresión Draco, ~880K vértices simplificados)
> **Modelo original:** 372.78 MB → optimizado a 5.46 MB (reducción del 98.5%)

---

## 🎯 Visión

Transformar la página "Qué es la Vela" en una experiencia inmersiva al nivel de las páginas de producto de Apple (MacBook Pro, AirPods Pro, iPhone). El velero Optimist 3D es el **hilo conductor visual** que permanece fijo en el viewport mientras el usuario hace scroll. A medida que se avanza, la cámara orbita el barco mostrándolo desde diferentes ángulos cinematográficos, y el contenido textual aparece como overlays elegantes sincronizados al progreso de scroll.

**Referentes de diseño:**
- apple.com/macbook-pro → Portátil que rota al scroll
- apple.com/airpods-pro → Producto 3D con texto que aparece/desaparece
- porsche.com/taycan → Coche 3D con secciones narrativas
- Nothing Phone → Producto revelándose desde múltiples ángulos

---

## 📐 Arquitectura General

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SCROLL RUNWAY (height: ~700vh)                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  STICKY STAGE (position: sticky, top: 0, height: 100vh)           │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  R3F <Canvas>                                                │  │  │
│  │  │  ┌────────────────────┐                                      │  │  │
│  │  │  │  OptimistBoat.glb  │  ← Draco-compressed, loaded once     │  │  │
│  │  │  │  Camera Rig        │  ← Driven by scrollYProgress         │  │  │
│  │  │  │  Lighting           │  ← HDRI env + directional sun       │  │  │
│  │  │  │  Contact Shadows    │  ← Subtle floor shadow              │  │  │
│  │  │  └────────────────────┘                                      │  │  │
│  │  │                                                              │  │  │
│  │  │  CONTENT OVERLAYS (z-index above canvas)                     │  │  │
│  │  │  ┌────────────────────┐                                      │  │  │
│  │  │  │ Section overlays    │  ← Fade in/out per scroll range     │  │  │
│  │  │  │ Text, cards, CTAs   │  ← Glass panels, one-side layouts   │  │  │
│  │  │  └────────────────────┘                                      │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  (The scroll runway is empty — all visuals are in the sticky stage)      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  POST-3D SECTIONS (normal page flow, NOT sticky)                         │
│  ┌──────────────────────────────┐                                        │
│  │  VelaSelectorExperiencia     │  ← Interactivo, no necesita 3D        │
│  ├──────────────────────────────┤                                        │
│  │  VelaCTA                     │  ← CTA final                          │
│  └──────────────────────────────┘                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Mapa de Scroll — Posiciones de Cámara

El scroll total del "runway" (700vh) se divide en 7 actos cinematográficos.
Cada acto tiene un rango de scroll (porcentaje del progreso 0→1), una posición de cámara objetivo, y un overlay de contenido asociado.

```
SCROLL PROGRESS    ACTO              CÁMARA [x, y, z]            MIRA A        OVERLAY
─────────────────────────────────────────────────────────────────────────────────────────────
0.00 → 0.04       MATERIALIZACIÓN   [0, 12, 25] → [0, 8, 20]    [0, 0, 0]    Ninguno (solo boat fade-in)
0.04 → 0.18       HERO              [0, 8, 20] → [0, 3, 12]     [0, 0, 0]    Título "Qué es la vela." (LEFT)
0.18 → 0.32       FRASE             [0, 3, 12] → [12, 2, 4]     [0, 1, 0]    Frase animada (CENTER, glass)
0.32 → 0.52       FILOSOFÍA         [12, 2, 4] → [-8, 4, -6]    [0, 0.5, 0]  4 cards (LEFT column)
0.52 → 0.72       NARRATIVA         [-8, 4, -6] → [-3, 1.5, 5]  [0, 0, 0]    Párrafos (RIGHT side)
0.72 → 0.88       BEAUTY SHOT       [-3, 1.5, 5] → [6, 3, 8]    [0, 0.5, 0]  Badge "↓ Descubre más"
0.88 → 1.00       ALEJAMIENTO       [6, 3, 8] → [0, 6, 22]      [0, 0, 0]    Título cierre (CENTER)
```

### Detalle Cinemático de Cada Acto

#### ACTO 0 — Materialización (0.00 → 0.04)
- **Duración scroll:** ~28vh (rápido, impactante)
- **Efecto:** El barco aparece como si emergiera del agua. Opacity de 0 a 1 con un sutil glow azul
- **Cámara:** Vista cenital lejana, como un dron bajando
- **Iluminación:** Empieza tenue → se intensifica
- **Overlay:** Ninguno. Solo el barco apareciendo

#### ACTO 1 — Hero (0.04 → 0.18)
- **Duración scroll:** ~98vh
- **Efecto:** Cámara baja desde cenital a nivel del ojo. Zoom in gradual
- **Cámara:** `[0, 8, 20]` → `[0, 3, 12]` — De pájaro a frontal
- **Overlay izquierdo (40% ancho):**
  ```
  ┌──────────────────┐
  │ GetxoBelaEskola  │ ← eyebrow, tracking-[0.25em], #86868B
  │                  │
  │ Qué es           │ ← DM Serif Display, letter-by-letter
  │ ────────         │ ← línea animada scaleX
  │ la vela.         │ ← "vela" en #0071E3, "a" pulsa
  │                  │
  │ Un deporte...    │ ← subtitle fade-in
  │                  │
  │ [ Descubrir → ]  │ ← ghost button
  └──────────────────┘
  ```
- **Timing textos:**
  - progress 0.05: eyebrow fade-in (300ms)
  - progress 0.06: título línea 1 letter-by-letter (40ms/letra)
  - progress 0.08: línea divisora scaleX (700ms)
  - progress 0.09: título línea 2 spring-in
  - progress 0.11: subtitle fade-in (700ms)
  - progress 0.13: botón fade-in (500ms)
  - progress 0.16: todo empieza a fade-out (preparar transición)

#### ACTO 2 — Frase Esencia (0.18 → 0.32)
- **Duración scroll:** ~98vh
- **Efecto:** Cámara orbita al perfil lateral del barco (estribor)
- **Cámara:** `[0, 3, 12]` → `[12, 2, 4]` — Vista lateral clásica
- **Overlay centrado (glassmorphism):**
  ```
  ┌────────────────────────────────────────────────┐
  │  ╔══════════════════════════════════════════╗   │
  │  ║  la esencia                              ║   │
  │  ║                                          ║   │
  │  ║  La vela combina técnica,               ║   │
  │  ║  calma, aventura, escucha               ║   │
  │  ║  y una conexión profunda                ║   │
  │  ║  con la mar.                            ║   │
  │  ║                                          ║   │
  │  ╚══════════════════════════════════════════╝   │
  │   (panel glassmorphism: blur 20px,              │
  │    bg rgba(255,255,255,0.7), border #E8E8ED)    │
  └────────────────────────────────────────────────┘
  ```
- **Timing textos:**
  - progress 0.20: panel glass fade-in (400ms)
  - progress 0.21: eyebrow "la esencia" (300ms)
  - progress 0.22→0.28: palabras stagger 70ms cada una, keywords en #0071E3
  - progress 0.30: panel empieza fade-out

#### ACTO 3 — Filosofía (0.32 → 0.52)
- **Duración scroll:** ~140vh (más largo para 4 cards)
- **Efecto:** Cámara orbita a vista trasera elevada. Muestra la popa y el timón
- **Cámara:** `[12, 2, 4]` → `[-8, 4, -6]` — Desde estribor hacia babor-popa
- **Overlay izquierdo (40% ancho, 4 cards en columna):**
  ```
  ┌────────────────────────┐  ┌────────────────────┐
  │  filosofía             │  │                    │
  │  La vela se adapta     │  │   🚤 BARCO 3D      │
  │  a ti.                 │  │   (vista popa)      │
  │                        │  │                    │
  │  ┌──────────────────┐  │  │                    │
  │  │ 〰  Nav. carta   │  │  │                    │
  │  │     Los partes...│  │  │                    │
  │  └──────────────────┘  │  │                    │
  │  ┌──────────────────┐  │  │                    │
  │  │ ☀  Tu experiencia│  │  │                    │
  │  │     Calma o...   │  │  │                    │
  │  └──────────────────┘  │  │                    │
  │  ┌──────────────────┐  │  │                    │
  │  │ 📍 Tu escenario  │  │  │                    │
  │  └──────────────────┘  │  │                    │
  │  ┌──────────────────┐  │  │                    │
  │  │ ⛵ Tu compañía   │  │  │                    │
  │  └──────────────────┘  │  │                    │
  └────────────────────────┘  └────────────────────┘
  ```
- **Timing cards:**
  - progress 0.34: header (eyebrow + title + subtitle) fade-in (600ms)
  - progress 0.37: Card 1 slide-in desde izquierda (500ms, ease [0.22, 1, 0.36, 1])
  - progress 0.40: Card 2 slide-in
  - progress 0.43: Card 3 slide-in
  - progress 0.46: Card 4 slide-in
  - progress 0.50: todo fade-out

#### ACTO 4 — Texto Narrativo (0.52 → 0.72)
- **Duración scroll:** ~140vh
- **Efecto:** Cámara se acerca a vista cercana desde babor-proa. Perspectiva íntima
- **Cámara:** `[-8, 4, -6]` → `[-3, 1.5, 5]` — Close-up desde la proa
- **Overlay derecho (50% ancho):**
  ```
  ┌────────────────────┐  ┌────────────────────────┐
  │                    │  │  nuestra historia       │
  │   🚤 BARCO 3D      │  │  ─── (grad. line)       │
  │   (close-up proa)  │  │                        │
  │                    │  │  La vela no es un       │
  │                    │  │  deporte exclusivamente │
  │                    │  │  adrenalínico...        │
  │                    │  │                        │
  │                    │  │  Hay quien sale en un   │
  │                    │  │  velero pequeño...      │
  │                    │  │                        │
  │                    │  │  En Euskal Herria       │
  │                    │  │  hemos tenido...        │
  │                    │  │                        │
  │                    │  │  La vela forma parte    │
  │                    │  │  de nuestra memoria...  │
  └────────────────────┘  └────────────────────────┘
  ```
- **Timing párrafos:**
  - progress 0.54: eyebrow + gradient line (600ms)
  - progress 0.56: párrafo 1 fade-in desde abajo (700ms), highlights en #0071E3
  - progress 0.60: párrafo 2 (700ms)
  - progress 0.64: párrafo 3 (700ms)
  - progress 0.67: párrafo 4 (700ms)
  - progress 0.70: fade-out gradual

#### ACTO 5 — Beauty Shot (0.72 → 0.88)
- **Duración scroll:** ~112vh
- **Efecto:** Cámara se mueve a la posición clásica de "foto de producto" — 3/4 frontal
- **Cámara:** `[-3, 1.5, 5]` → `[6, 3, 8]` — El ángulo más bonito del barco
- **Overlay:** Mínimo. Solo un badge sutil en la esquina inferior:
  ```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │              🚤 BARCO 3D                      │
  │           (beauty shot 3/4)                  │
  │          EL BARCO LLENA TODO                 │
  │                                              │
  │                                              │
  │                     ┌─────────────────────┐  │
  │                     │ ↓ Sigue explorando  │  │
  │                     └─────────────────────┘  │
  └──────────────────────────────────────────────┘
  ```
- **Timing:**
  - progress 0.74: badge aparece (300ms delay, 500ms duration)
  - progress 0.80: badge pulsa suave (infinite)
  - progress 0.86: badge fade-out

#### ACTO 6 — Alejamiento Final (0.88 → 1.00)
- **Duración scroll:** ~84vh
- **Efecto:** Cámara se aleja dramáticamente. El barco se hace pequeño. Sensación de despedida
- **Cámara:** `[6, 3, 8]` → `[0, 6, 22]` — Cenital lejana, como al principio
- **Overlay centrado:**
  ```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │    Para cada persona, algo diferente.        │
  │                                              │
  │              🚤 (barco pequeño, lejano)       │
  │                                              │
  │         ─────────────────────                │
  │                                              │
  └──────────────────────────────────────────────┘
  ```
- **Timing:**
  - progress 0.90: frase central fade-in (800ms, DM Serif)
  - progress 0.93: línea divisora scaleX (600ms)
  - progress 0.97: todo fade-out para transición limpia a VelaSelectorExperiencia

---

## 🗂 Estructura de Archivos

```
src/
├── components/
│   └── vela/
│       ├── VelaHero.tsx                    ← [ELIMINAR] Reemplazado por overlay en Vela3DStage
│       ├── VelaFraseAnimada.tsx            ← [ELIMINAR] Reemplazado por overlay
│       ├── VelaFilosofia.tsx               ← [ELIMINAR] Reemplazado por overlay
│       ├── VelaTextoNarrativo.tsx          ← [ELIMINAR] Reemplazado por overlay
│       ├── VelaSelectorExperiencia.tsx     ← [MANTENER] Se usa después del 3D stage
│       ├── VelaCTA.tsx                     ← [MANTENER] Se usa después del 3D stage
│       │
│       ├── Vela3DStage.tsx                 ← [NUEVO] Scroll runway + sticky stage
│       ├── Vela3DScene.tsx                 ← [NUEVO] R3F Canvas, iluminación, entorno
│       ├── Vela3DBoat.tsx                  ← [NUEVO] Carga modelo GLTF+Draco, animaciones
│       ├── Vela3DCameraRig.tsx             ← [NUEVO] Controlador de cámara por scroll
│       ├── Vela3DOverlays.tsx              ← [NUEVO] Contenido textual sincronizado al scroll
│       ├── Vela3DLoadingScreen.tsx         ← [NUEVO] Pantalla de carga mientras descarga .glb
│       ├── Vela3DFallback.tsx              ← [NUEVO] Fallback estático para no-WebGL
│       └── useBoatScroll.ts                ← [NUEVO] Hook: scroll progress → camera keyframes
│
├── stores/
│   └── velaScrollStore.ts                  ← [NUEVO] Zustand store para comunicar scroll↔R3F
│
└── app/
    └── [locale]/
        └── club/
            └── que-es-la-vela/
                └── page.tsx                ← [MODIFICAR] Nuevo layout con Vela3DStage

public/
└── models/
    └── optimist-boat.glb                   ← [NUEVO] Copiar scene_draco.glb aquí
```

**Total archivos nuevos:** 9
**Archivos eliminados:** 4 (los overlays reemplazan su contenido)
**Archivos modificados:** 1 (page.tsx)

---

## 📦 Dependencias

### Ya instaladas (verificar versiones)
```
✅ @react-three/fiber    ^8.16.8     — React renderer para Three.js
✅ @react-three/drei     ^9.120.0    — Helpers (useGLTF, Environment, ContactShadows, etc.)
✅ three                 ^0.165.0    — Motor 3D
✅ @types/three          ^0.165.0    — Tipos TypeScript
✅ framer-motion         ^12.34.0    — useScroll, useTransform, motion
✅ zustand               ^5.0.11     — Estado global para scroll↔R3F bridge
```

### Nuevas dependencias necesarias
```
NINGUNA — Todo lo necesario ya está instalado.

El decodificador Draco se carga desde el CDN de Google en runtime:
https://www.gstatic.com/draco/versioned/decoders/1.5.6/
(~300KB WebAssembly, cacheado por el navegador)
```

---

## 🔧 Implementación Atómica — Fase por Fase

---

# FASE 0 — Preparación de Assets
> ⏱ 5 min · ⭐☆☆☆☆

---

## TAREA 0.1 — Copiar modelo 3D al directorio public

**Acción:** Copiar el archivo optimizado Draco al proyecto.

```powershell
# Crear directorio
mkdir "C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\public\models"

# Copiar modelo
Copy-Item "C:\Users\User\Downloads\race_optimist_boat\scene_draco.glb" `
          "C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web\public\models\optimist-boat.glb"
```

**✅ Verificación:** `ls public/models/optimist-boat.glb` → 5.46 MB

---

## TAREA 0.2 — Pre-verificar dependencias

```powershell
cd C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web
npm list @react-three/fiber @react-three/drei three zustand framer-motion
```

**✅ Verificación:** Las 5 dependencias están instaladas sin errores.

---

# FASE 1 — Zustand Store (puente scroll ↔ R3F)
> ⏱ 10 min · ⭐☆☆☆☆

---

## TAREA 1.1 — Crear velaScrollStore.ts

**Archivo:** `src/stores/velaScrollStore.ts`

**¿Por qué Zustand?** React Three Fiber ejecuta su render loop fuera del ciclo de React.
No podemos pasar props ni usar useState para comunicar el scroll progress al `useFrame` de R3F.
Zustand es la solución estándar: escribimos desde React, leemos desde R3F sin re-renders.

```typescript
// src/stores/velaScrollStore.ts
import { create } from 'zustand';

interface VelaScrollState {
  /** Scroll progress normalizado 0→1 dentro del scroll runway */
  progress: number;
  /** Si el usuario está dentro del scroll runway (visible en viewport) */
  isInRunway: boolean;
  /** Modo del selector de experiencia: afecta la inclinación del barco */
  experienceMode: 'calma' | 'accion';
  /** Si el modelo 3D ha terminado de cargar */
  isModelLoaded: boolean;

  // Actions
  setProgress: (p: number) => void;
  setIsInRunway: (v: boolean) => void;
  setExperienceMode: (m: 'calma' | 'accion') => void;
  setIsModelLoaded: (v: boolean) => void;
}

export const useVelaScrollStore = create<VelaScrollState>((set) => ({
  progress: 0,
  isInRunway: false,
  experienceMode: 'calma',
  isModelLoaded: false,

  setProgress: (p) => set({ progress: p }),
  setIsInRunway: (v) => set({ isInRunway: v }),
  setExperienceMode: (m) => set({ experienceMode: m }),
  setIsModelLoaded: (v) => set({ isModelLoaded: v }),
}));
```

**✅ Verificación:** Importable sin errores. `npm run build` compila.

---

# FASE 2 — Hook de Scroll a Cámara
> ⏱ 20 min · ⭐⭐☆☆☆

---

## TAREA 2.1 — Crear useBoatScroll.ts

**Archivo:** `src/components/vela/useBoatScroll.ts`

Este hook define los keyframes de cámara y las funciones de interpolación.

```typescript
// src/components/vela/useBoatScroll.ts
import * as THREE from 'three';

/** Definición de un keyframe de cámara */
interface CameraKeyframe {
  /** Scroll progress donde este keyframe está activo (0-1) */
  at: number;
  /** Posición de la cámara [x, y, z] */
  position: [number, number, number];
  /** Punto al que mira la cámara [x, y, z] */
  lookAt: [number, number, number];
  /** FOV de la cámara (opcional, default 45) */
  fov?: number;
}

/** Los 8 keyframes de la cinematografía del barco */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Materialización — cenital lejana
  { at: 0.00, position: [0, 12, 25],  lookAt: [0, 0, 0],   fov: 45 },
  { at: 0.04, position: [0, 8, 20],   lookAt: [0, 0, 0],   fov: 45 },

  // Hero — frontal, bajando al nivel del ojo
  { at: 0.18, position: [0, 3, 12],   lookAt: [0, 0, 0],   fov: 40 },

  // Frase — perfil lateral (estribor)
  { at: 0.32, position: [12, 2, 4],   lookAt: [0, 1, 0],   fov: 38 },

  // Filosofía — popa (babor-trasera, elevada)
  { at: 0.52, position: [-8, 4, -6],  lookAt: [0, 0.5, 0], fov: 40 },

  // Narrativa — close-up proa (babor)
  { at: 0.72, position: [-3, 1.5, 5], lookAt: [0, 0, 0],   fov: 35 },

  // Beauty shot — 3/4 frontal clásica
  { at: 0.88, position: [6, 3, 8],    lookAt: [0, 0.5, 0], fov: 38 },

  // Alejamiento — cenital lejana de cierre
  { at: 1.00, position: [0, 6, 22],   lookAt: [0, 0, 0],   fov: 45 },
];

/**
 * Dado un scroll progress (0-1), calcula la posición y lookAt interpolados
 * entre los keyframes más cercanos usando smoothstep.
 */
export function interpolateCamera(progress: number): {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
} {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));

  // Encontrar los dos keyframes entre los que estamos
  let kfA = CAMERA_KEYFRAMES[0];
  let kfB = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];

  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (p >= CAMERA_KEYFRAMES[i].at && p <= CAMERA_KEYFRAMES[i + 1].at) {
      kfA = CAMERA_KEYFRAMES[i];
      kfB = CAMERA_KEYFRAMES[i + 1];
      break;
    }
  }

  // Calcular t local entre los dos keyframes (0-1)
  const range = kfB.at - kfA.at;
  const localT = range > 0 ? (p - kfA.at) / range : 0;

  // Smoothstep para transiciones suaves (ease in-out cúbico)
  const smooth = localT * localT * (3 - 2 * localT);

  // Interpolar posición
  const position = new THREE.Vector3(
    THREE.MathUtils.lerp(kfA.position[0], kfB.position[0], smooth),
    THREE.MathUtils.lerp(kfA.position[1], kfB.position[1], smooth),
    THREE.MathUtils.lerp(kfA.position[2], kfB.position[2], smooth),
  );

  // Interpolar lookAt
  const lookAt = new THREE.Vector3(
    THREE.MathUtils.lerp(kfA.lookAt[0], kfB.lookAt[0], smooth),
    THREE.MathUtils.lerp(kfA.lookAt[1], kfB.lookAt[1], smooth),
    THREE.MathUtils.lerp(kfA.lookAt[2], kfB.lookAt[2], smooth),
  );

  // Interpolar FOV
  const fov = THREE.MathUtils.lerp(kfA.fov ?? 45, kfB.fov ?? 45, smooth);

  return { position, lookAt, fov };
}

/**
 * Definición de rangos de visibilidad para cada overlay de contenido.
 * fadeIn: progress donde empieza a aparecer
 * fullIn: progress donde está 100% visible
 * fullOut: progress donde empieza a desaparecer
 * fadeOut: progress donde está 100% invisible
 */
export interface OverlayRange {
  fadeIn: number;
  fullIn: number;
  fullOut: number;
  fadeOut: number;
}

export const OVERLAY_RANGES: Record<string, OverlayRange> = {
  hero:      { fadeIn: 0.04, fullIn: 0.06, fullOut: 0.14, fadeOut: 0.18 },
  frase:     { fadeIn: 0.19, fullIn: 0.22, fullOut: 0.28, fadeOut: 0.32 },
  filosofia: { fadeIn: 0.33, fullIn: 0.36, fullOut: 0.48, fadeOut: 0.52 },
  narrativa: { fadeIn: 0.53, fullIn: 0.56, fullOut: 0.68, fadeOut: 0.72 },
  beauty:    { fadeIn: 0.73, fullIn: 0.76, fullOut: 0.84, fadeOut: 0.88 },
  cierre:    { fadeIn: 0.89, fullIn: 0.92, fullOut: 0.96, fadeOut: 1.00 },
};

/**
 * Calcula la opacidad de un overlay dado su rango y el scroll progress actual.
 */
export function getOverlayOpacity(range: OverlayRange, progress: number): number {
  if (progress < range.fadeIn || progress > range.fadeOut) return 0;
  if (progress >= range.fullIn && progress <= range.fullOut) return 1;

  // Fade in
  if (progress < range.fullIn) {
    return (progress - range.fadeIn) / (range.fullIn - range.fadeIn);
  }

  // Fade out
  return 1 - (progress - range.fullOut) / (range.fadeOut - range.fullOut);
}
```

**✅ Verificación:** Importar y llamar `interpolateCamera(0.5)` devuelve posición interpolada válida.

---

# FASE 3 — Componente del Barco 3D
> ⏱ 25 min · ⭐⭐⭐☆☆

---

## TAREA 3.1 — Crear Vela3DBoat.tsx

**Archivo:** `src/components/vela/Vela3DBoat.tsx`

```typescript
// src/components/vela/Vela3DBoat.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useVelaScrollStore } from '@/stores/velaScrollStore';

// Configurar decodificador Draco desde CDN de Google
// useGLTF de Drei detecta automáticamente modelos Draco y usa el decodificador
// si configuramos el path del decoder globalmente
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
const MODEL_PATH = '/models/optimist-boat.glb';

export default function Vela3DBoat() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_CDN);
  const setIsModelLoaded = useVelaScrollStore((s) => s.setIsModelLoaded);

  useEffect(() => {
    if (scene) {
      // Centrar el modelo en el origen
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Normalizar escala: queremos que el barco tenga ~4 unidades de largo
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 4;
      const scale = targetSize / maxDim;

      scene.scale.setScalar(scale);
      scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      // Mejorar materiales para renderizado web
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.envMapIntensity = 0.8;
            mesh.material.needsUpdate = true;
          }
        }
      });

      setIsModelLoaded(true);
    }
  }, [scene, setIsModelLoaded]);

  // Sutil animación de "flotar" — el barco se mece como en el agua
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Mecido suave: rotación en X (cabeceo) y Z (balanceo)
    groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.015;
    groupRef.current.rotation.z = Math.sin(time * 0.3 + 0.5) * 0.02;

    // Movimiento vertical suave (sube y baja como en el agua)
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Precargar el modelo para que empiece a descargarse cuanto antes
useGLTF.preload(MODEL_PATH, DRACO_CDN);
```

**✅ Verificación:** Modelo se carga sin errores, se centra en el origen, y se mece suavemente.

---

# FASE 4 — Camera Rig
> ⏱ 15 min · ⭐⭐☆☆☆

---

## TAREA 4.1 — Crear Vela3DCameraRig.tsx

**Archivo:** `src/components/vela/Vela3DCameraRig.tsx`

```typescript
// src/components/vela/Vela3DCameraRig.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import { interpolateCamera } from './useBoatScroll';

export default function Vela3DCameraRig() {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 12, 25));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const progress = useVelaScrollStore.getState().progress;
    const target = interpolateCamera(progress);

    // Lerp suave para que el movimiento de cámara sea fluido,
    // NO instantáneo. Factor 0.05 = muy suave, cinematográfico.
    const lerpFactor = 0.05;

    currentPos.current.lerp(target.position, lerpFactor);
    currentLookAt.current.lerp(target.lookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // Interpolar FOV (solo PerspectiveCamera)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, target.fov, lerpFactor);
      camera.updateProjectionMatrix();
    }
  });

  return null; // Este componente no renderiza nada, solo mueve la cámara
}
```

**Nota sobre `lerpFactor`:**
- `0.05` = Movimiento ultra suave, cinematográfico, "floaty" — Ideal para scroll lento
- `0.10` = Más responsivo pero aún suave
- `0.03` = Tipo sueño, muy lento de llegar a destino
- **Recomendación:** Empezar con 0.05 y ajustar según sensación

**✅ Verificación:** La cámara se mueve suavemente al cambiar `progress` en el store.

---

# FASE 5 — Escena 3D Completa
> ⏱ 25 min · ⭐⭐⭐☆☆

---

## TAREA 5.1 — Crear Vela3DScene.tsx

**Archivo:** `src/components/vela/Vela3DScene.tsx`

```typescript
// src/components/vela/Vela3DScene.tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, AdaptiveDpr, Preload } from '@react-three/drei';
import Vela3DBoat from './Vela3DBoat';
import Vela3DCameraRig from './Vela3DCameraRig';

export default function Vela3DScene() {
  return (
    <Canvas
      // Configuración del canvas
      camera={{
        position: [0, 12, 25],  // Posición inicial (keyframe 0)
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      // Performance: solo re-renderizar cuando hay cambios
      frameloop="always"
      // Antialiasing para bordes suaves
      gl={{
        antialias: true,
        alpha: true,         // Fondo transparente
        powerPreference: 'high-performance',
        toneMapping: 3,      // ACESFilmicToneMapping (THREE.ACESFilmicToneMapping = 3)
        toneMappingExposure: 1.1,
      }}
      // Sombras
      shadows
      // Estilo: ocupar todo el contenedor
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',  // No bloquear clicks en overlays
      }}
    >
      {/* Ajuste dinámico de resolución para móviles lentos */}
      <AdaptiveDpr pixelated />

      {/* Iluminación ambiental */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Luz direccional principal — simula el sol */}
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.2}
        color="#FFF8E7"      // Luz cálida, ligeramente dorada
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Luz de relleno — desde la izquierda, azulada (reflejo del cielo) */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#B0D4FF"
      />

      {/* Rim light — detrás, para contornear la silueta */}
      <directionalLight
        position={[0, 3, -10]}
        intensity={0.5}
        color="#FFFFFF"
      />

      {/* Entorno HDRI para reflejos realistas en las superficies */}
      <Environment
        preset="city"          // Preset "city" da reflejos neutros y elegantes
        environmentIntensity={0.5}
      />

      {/* Sombra de contacto — "ancla" el barco al suelo virtual */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.25}
        scale={12}
        blur={2.5}
        far={8}
        color="#1D1D1F"
      />

      {/* Camera Rig — controla la cámara basándose en scroll progress */}
      <Vela3DCameraRig />

      {/* El modelo del barco, dentro de Suspense para loading */}
      <Suspense fallback={null}>
        <Vela3DBoat />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
```

**Notas sobre iluminación:**
- 3 luces direccionales crean un esquema de iluminación cinematográfico (key, fill, rim)
- Environment "city" da reflejos neutros tipo estudio fotográfico
- ContactShadows crea una sombra suave debajo del barco que lo "ancla" visualmente
- toneMappingExposure 1.1 = ligeramente sobreexpuesto para ese look "Apple clean"

**✅ Verificación:** El canvas renderiza con fondo transparente, el barco se ve con iluminación profesional.

---

# FASE 6 — Pantalla de Carga
> ⏱ 15 min · ⭐⭐☆☆☆

---

## TAREA 6.1 — Crear Vela3DLoadingScreen.tsx

**Archivo:** `src/components/vela/Vela3DLoadingScreen.tsx`

Pantalla de carga elegante estilo Apple mientras el modelo .glb se descarga (5.46 MB).

```typescript
// src/components/vela/Vela3DLoadingScreen.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVelaScrollStore } from '@/stores/velaScrollStore';

export default function Vela3DLoadingScreen() {
  const isModelLoaded = useVelaScrollStore((s) => s.isModelLoaded);

  return (
    <AnimatePresence>
      {!isModelLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center"
        >
          {/* Logo o marca */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#86868B] text-xs uppercase tracking-[0.3em] mb-8"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            GetxoBelaEskola
          </motion.p>

          {/* Barra de progreso minimalista */}
          <div className="w-48 h-px bg-[#E8E8ED] relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#0071E3] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          </div>

          {/* Texto sutil */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-[#86868B] text-[10px] uppercase tracking-[0.2em] mt-6"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Preparando experiencia
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**✅ Verificación:** Pantalla blanca con barra animada → desaparece suavemente cuando `isModelLoaded = true`.

---

## TAREA 6.2 — Crear Vela3DFallback.tsx

**Archivo:** `src/components/vela/Vela3DFallback.tsx`

Fallback para dispositivos sin WebGL (navegadores muy antiguos, lectores de pantalla, etc.)

```typescript
// src/components/vela/Vela3DFallback.tsx
'use client';

/**
 * Fallback estático cuando WebGL no está disponible.
 * Muestra los componentes originales (VelaHero, etc.) sin 3D.
 * Se activa automáticamente si el navegador no soporta WebGL.
 */
export default function Vela3DFallback() {
  // Importar dinámicamente los componentes originales como fallback
  // (Nota: esto requiere que los componentes originales NO se eliminen,
  //  sino que se muevan a un subdirectorio vela/legacy/)
  return (
    <div className="bg-white">
      <p className="text-center py-32 text-[#86868B] text-sm">
        Tu navegador no soporta gráficos 3D.
        Por favor actualiza tu navegador para ver la experiencia completa.
      </p>
    </div>
  );
}

/**
 * Utilidad: detecta si WebGL está soportado
 */
export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
```

**✅ Verificación:** `isWebGLSupported()` devuelve `true` en navegadores modernos.

---

# FASE 7 — Overlays de Contenido (la magia)
> ⏱ 45 min · ⭐⭐⭐⭐⭐ — Esta es la fase más crítica

---

## TAREA 7.1 — Crear Vela3DOverlays.tsx

**Archivo:** `src/components/vela/Vela3DOverlays.tsx`

Este componente contiene TODOS los overlays de texto que aparecen/desaparecen
sincronizados con el scroll. Cada overlay corresponde a un "acto" del mapa de scroll.

```typescript
// src/components/vela/Vela3DOverlays.tsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import { OVERLAY_RANGES, getOverlayOpacity } from './useBoatScroll';

// Componente base para un overlay: gestiona opacidad y visibilidad
function Overlay({
  id,
  className,
  children,
}: {
  id: keyof typeof OVERLAY_RANGES;
  className?: string;
  children: React.ReactNode;
}) {
  const progress = useVelaScrollStore((s) => s.progress);
  const range = OVERLAY_RANGES[id];
  const opacity = getOverlayOpacity(range, progress);

  // No renderizar si completamente invisible (optimización)
  if (opacity <= 0.01) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center pointer-events-none ${className || ''}`}
      style={{ opacity, transition: 'none' }} // Sin CSS transition, controlado por scroll
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: HERO (progress 0.04 → 0.18)
// Texto izquierdo, barco visible a la derecha
// ═══════════════════════════════════════════════════════════════
function HeroOverlay() {
  const t = useTranslations('que_es_la_vela');

  return (
    <Overlay id="hero" className="px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-[45%]"> {/* Solo ocupa el lado izquierdo */}

          {/* Eyebrow */}
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-8"
             style={{ fontFamily: 'var(--font-inter)' }}>
            {t('hero_eyebrow')}
          </p>

          {/* H1 Línea 1 */}
          <h1 className="font-bold leading-none mb-0 text-[#1D1D1F]"
              style={{
                fontFamily: 'var(--font-dm-serif)',
                fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              }}>
            {t('hero_line1')}
          </h1>

          {/* Línea divisora */}
          <div className="h-px bg-[#1D1D1F] my-4"
               style={{ width: 'clamp(200px, 35vw, 480px)' }} />

          {/* H1 Línea 2 — con "vela" en azul */}
          <h1 className="font-bold leading-none text-[#0071E3]"
              style={{
                fontFamily: 'var(--font-dm-serif)',
                fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              }}>
            {t('hero_line2')}
          </h1>

          {/* Subtitle */}
          <p className="mt-10 text-[#86868B] max-w-xl leading-relaxed"
             style={{ fontFamily: 'var(--font-inter)', fontSize: '1.2rem' }}>
            {t('hero_subtitle')}
          </p>

          {/* CTA */}
          <div className="mt-10 pointer-events-auto">
            <a href="#post-3d"
               className="inline-flex items-center gap-2 border border-[#0071E3] text-[#0071E3]
                          px-8 py-3 rounded-full text-sm font-medium
                          hover:bg-[#0071E3] hover:text-white transition-all duration-300"
               style={{ fontFamily: 'var(--font-inter)' }}>
              {t('hero_discover')} →
            </a>
          </div>

        </div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: FRASE ANIMADA (progress 0.19 → 0.32)
// Panel glassmorphism centrado, barco visible detrás
// ═══════════════════════════════════════════════════════════════
function FraseOverlay() {
  const t = useTranslations('que_es_la_vela');

  // Hardcoded sentence + highlights (same as VelaFraseAnimada.tsx logic)
  // (En implementación real, usar la lógica de SENTENCES/HIGHLIGHTS del componente original)
  return (
    <Overlay id="frase" className="justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">

        {/* Panel glassmorphism */}
        <div className="rounded-3xl p-12 md:p-16"
             style={{
               background: 'rgba(255, 255, 255, 0.75)',
               backdropFilter: 'blur(24px)',
               WebkitBackdropFilter: 'blur(24px)',
               border: '1px solid rgba(232, 232, 237, 0.6)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
             }}>

          {/* Eyebrow */}
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-8"
             style={{ fontFamily: 'var(--font-inter)' }}>
            {t('essencia_eyebrow')}
          </p>

          {/* La frase grande */}
          {/* Nota: En implementación, replicar la lógica de word-by-word animation
              del componente original VelaFraseAnimada.tsx, pero usando el scroll
              progress en lugar de whileInView para el stagger */}
          <p className="leading-tight font-bold text-[#1D1D1F]"
             style={{
               fontFamily: 'var(--font-dm-serif)',
               fontSize: 'clamp(1.8rem, 4vw, 3rem)',
             }}>
            {/* IMPLEMENTAR: Renderizar cada palabra con color condicional.
                Keywords en #0071E3, resto en #1D1D1F.
                Usar la misma lógica de SENTENCES/HIGHLIGHTS de VelaFraseAnimada.tsx */}
            [Frase animada word-by-word — ver componente original para lógica]
          </p>

        </div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: FILOSOFÍA (progress 0.33 → 0.52)
// Cards en columna a la izquierda, barco visible a la derecha
// ═══════════════════════════════════════════════════════════════
function FilosofiaOverlay() {
  const t = useTranslations('que_es_la_vela');
  const progress = useVelaScrollStore((s) => s.progress);

  const cards = [
    { id: 'carta',       title: t('cards.carta_title'),       text: t('cards.carta_text'),       triggerAt: 0.37 },
    { id: 'experiencia', title: t('cards.experiencia_title'), text: t('cards.experiencia_text'), triggerAt: 0.40 },
    { id: 'escenario',   title: t('cards.escenario_title'),   text: t('cards.escenario_text'),   triggerAt: 0.43 },
    { id: 'compania',    title: t('cards.compania_title'),     text: t('cards.compania_text'),     triggerAt: 0.46 },
  ];

  return (
    <Overlay id="filosofia" className="px-6 items-start py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-[42%]"> {/* Solo lado izquierdo */}

          {/* Section Header */}
          <div className="mb-8">
            <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4"
               style={{ fontFamily: 'var(--font-inter)' }}>
              {t('philosophy_eyebrow')}
            </p>
            <h2 className="text-[#1D1D1F] leading-tight font-bold"
                style={{
                  fontFamily: 'var(--font-dm-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}>
              {t('philosophy_title')}
            </h2>
            <p className="mt-3 text-[#86868B] text-sm leading-relaxed"
               style={{ fontFamily: 'var(--font-inter)' }}>
              {t('philosophy_subtitle')}
            </p>
          </div>

          {/* Cards en columna */}
          <div className="flex flex-col gap-3">
            {cards.map((card) => {
              // Cada card tiene su propio fade-in basado en scroll progress
              const cardOpacity = progress >= card.triggerAt
                ? Math.min(1, (progress - card.triggerAt) / 0.02)
                : 0;
              const cardTranslateY = progress >= card.triggerAt
                ? Math.max(0, 20 * (1 - (progress - card.triggerAt) / 0.02))
                : 20;

              return (
                <div
                  key={card.id}
                  className="rounded-2xl p-6 border border-[#E8E8ED]"
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${cardTranslateY}px)`,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <h3 className="text-[#1D1D1F] text-base font-semibold mb-1"
                      style={{ fontFamily: 'var(--font-inter)' }}>
                    {card.title}
                  </h3>
                  <p className="text-[#86868B] text-xs leading-relaxed"
                     style={{ fontFamily: 'var(--font-inter)' }}>
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: TEXTO NARRATIVO (progress 0.53 → 0.72)
// Párrafos a la derecha, barco close-up a la izquierda
// ═══════════════════════════════════════════════════════════════
function NarrativaOverlay() {
  const t = useTranslations('que_es_la_vela');
  const progress = useVelaScrollStore((s) => s.progress);

  const paragraphs = [
    { id: 'p1', text: t('history_p1'), highlight: t.has('history_p1_highlight') ? t('history_p1_highlight') : null, triggerAt: 0.56 },
    { id: 'p2', text: t('history_p2'), highlight: null, triggerAt: 0.60 },
    { id: 'p3', text: t('history_p3'), highlight: t.has('history_p3_highlight') ? t('history_p3_highlight') : null, triggerAt: 0.64 },
    { id: 'p4', text: t('history_p4'), highlight: null, triggerAt: 0.67 },
  ];

  return (
    <Overlay id="narrativa" className="px-6 items-start py-16">
      <div className="max-w-6xl mx-auto w-full flex justify-end">
        <div className="max-w-[48%]"> {/* Solo lado derecho */}

          {/* Eyebrow */}
          <p className="text-[#86868B] text-xs uppercase tracking-[0.25em] mb-4"
             style={{ fontFamily: 'var(--font-inter)' }}>
            {t('history_eyebrow')}
          </p>

          {/* Gradient line decorativa */}
          <div className="w-px h-16 bg-gradient-to-b from-[#0071E3] to-transparent mb-8" />

          {/* Párrafos con stagger basado en scroll */}
          <div className="flex flex-col gap-8">
            {paragraphs.map((para) => {
              const paraOpacity = progress >= para.triggerAt
                ? Math.min(1, (progress - para.triggerAt) / 0.025)
                : 0;
              const paraTranslateY = progress >= para.triggerAt
                ? Math.max(0, 25 * (1 - (progress - para.triggerAt) / 0.025))
                : 25;

              // Renderizar texto con highlight
              const renderText = () => {
                if (!para.highlight) return para.text;
                const parts = para.text.split(para.highlight);
                if (parts.length < 2) return para.text;
                return (
                  <>
                    {parts[0]}
                    <span className="text-[#0071E3] font-medium">{para.highlight}</span>
                    {parts.slice(1).join(para.highlight)}
                  </>
                );
              };

              return (
                <p
                  key={para.id}
                  className="text-[#1D1D1F] leading-relaxed text-[1.05rem]"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    opacity: paraOpacity,
                    transform: `translateY(${paraTranslateY}px)`,
                  }}
                >
                  {renderText()}
                </p>
              );
            })}
          </div>

        </div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: BEAUTY SHOT (progress 0.73 → 0.88)
// Mínimo — solo un badge sutil, el barco es el protagonista
// ═══════════════════════════════════════════════════════════════
function BeautyOverlay() {
  return (
    <Overlay id="beauty" className="items-end justify-center pb-24 px-6">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full
                     border border-[#E8E8ED] text-[#86868B] text-xs uppercase tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-inter)',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          ↓ Sigue explorando
        </motion.div>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERLAY: CIERRE (progress 0.89 → 1.00)
// Frase de cierre centrada, barco alejándose
// ═══════════════════════════════════════════════════════════════
function CierreOverlay() {
  const t = useTranslations('que_es_la_vela');

  return (
    <Overlay id="cierre" className="justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">

        <h2 className="text-[#1D1D1F] leading-tight font-bold mb-6"
            style={{
              fontFamily: 'var(--font-dm-serif)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            }}>
          {t('hero_subtitle')}
        </h2>

        {/* Línea divisora de cierre */}
        <div className="h-px bg-[#E8E8ED] mx-auto"
             style={{ width: 'clamp(100px, 20vw, 200px)' }} />

      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL: Todos los overlays juntos
// ═══════════════════════════════════════════════════════════════
export default function Vela3DOverlays() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <HeroOverlay />
      <FraseOverlay />
      <FilosofiaOverlay />
      <NarrativaOverlay />
      <BeautyOverlay />
      <CierreOverlay />
    </div>
  );
}
```

**Puntos clave del overlay system:**
1. Cada overlay calcula su opacidad basándose en `OVERLAY_RANGES` y `progress` del store
2. No se usa CSS `transition` — todo es frame-perfect por scroll
3. Los overlays con muchos sub-elementos (cards, párrafos) tienen stagger individual
4. Los paneles usan glassmorphism para que el barco se vea a través
5. `pointerEvents: 'none'` en el contenedor, `pointer-events-auto` solo en botones/links

**✅ Verificación:** Cada overlay aparece/desaparece en su rango de scroll correcto.

---

# FASE 8 — El Stage Principal (el pegamento)
> ⏱ 30 min · ⭐⭐⭐⭐☆

---

## TAREA 8.1 — Crear Vela3DStage.tsx

**Archivo:** `src/components/vela/Vela3DStage.tsx`

Este es el componente principal que orquesta todo: el scroll runway, el sticky stage,
el canvas 3D, los overlays, y la sincronización con framer-motion.

```typescript
// src/components/vela/Vela3DStage.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useVelaScrollStore } from '@/stores/velaScrollStore';
import Vela3DLoadingScreen from './Vela3DLoadingScreen';
import Vela3DOverlays from './Vela3DOverlays';
import { isWebGLSupported } from './Vela3DFallback';

// Importación dinámica del Canvas 3D (NO SSR — Three.js requiere window/document)
const Vela3DScene = dynamic(() => import('./Vela3DScene'), {
  ssr: false,
  loading: () => null, // El loading screen se maneja aparte
});

// Importación dinámica del fallback
const Vela3DFallback = dynamic(() => import('./Vela3DFallback'), {
  ssr: false,
});

/** Altura del scroll runway como múltiplo de viewport height */
const RUNWAY_HEIGHT_VH = 700;

export default function Vela3DStage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const setProgress = useVelaScrollStore((s) => s.setProgress);
  const setIsInRunway = useVelaScrollStore((s) => s.setIsInRunway);

  // Detectar soporte WebGL y preferencias de movimiento reducido
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  // Sincronizar scroll progress → Zustand store (→ R3F useFrame)
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setProgress(value);
    setIsInRunway(true);
  });

  // Si no soporta WebGL o prefiere movimiento reducido, mostrar fallback
  if (!webGLSupported || prefersReducedMotion) {
    return <Vela3DFallback />;
  }

  return (
    <>
      {/* Pantalla de carga elegante */}
      <Vela3DLoadingScreen />

      {/* SCROLL RUNWAY — Este div tiene una altura enorme.
          Su único propósito es generar scroll.
          Todo el contenido visual está en el sticky stage dentro. */}
      <div
        ref={scrollContainerRef}
        style={{ height: `${RUNWAY_HEIGHT_VH}vh`, position: 'relative' }}
      >
        {/* STICKY STAGE — Permanece fijo en el viewport mientras scrolleamos el runway */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Fondo blanco del stage */}
          <div className="absolute inset-0 bg-white" />

          {/* Canvas 3D — detrás de todo */}
          <Vela3DScene />

          {/* Overlays de contenido — encima del canvas */}
          <Vela3DOverlays />

          {/* Indicador de scroll progress (sutil, en el borde derecho) */}
          <ScrollProgressIndicator />
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Indicador visual de progreso de scroll (barra vertical sutil)
// ═══════════════════════════════════════════════════════════════
function ScrollProgressIndicator() {
  const progress = useVelaScrollStore((s) => s.progress);

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
      {/* Track */}
      <div className="w-[2px] h-24 bg-[#E8E8ED] rounded-full relative overflow-hidden">
        {/* Fill */}
        <div
          className="absolute top-0 left-0 w-full bg-[#0071E3] rounded-full transition-none"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
```

**Puntos arquitectónicos clave:**
1. `useScroll({ target, offset })` de Framer Motion mide el progreso del runway (0→1)
2. `useMotionValueEvent` escribe el progreso en Zustand (sin re-renders innecesarios de React)
3. El Zustand store es leído directamente por `useFrame` en R3F (fuera del render loop de React)
4. `dynamic(() => import(...), { ssr: false })` evita errores de hidratación con Three.js
5. El runway es un div vacío de 700vh — toda la "materia visual" está en el sticky stage

**✅ Verificación:** Al hacer scroll, la barra de progreso se llena de 0% a 100% y el barco orbita.

---

# FASE 9 — Modificar la Página
> ⏱ 10 min · ⭐⭐☆☆☆

---

## TAREA 9.1 — Actualizar page.tsx

**Archivo:** `src/app/[locale]/club/que-es-la-vela/page.tsx`

```typescript
// src/app/[locale]/club/que-es-la-vela/page.tsx
import { DM_Serif_Display, Inter } from "next/font/google";
import Vela3DStage from "@/components/vela/Vela3DStage";
import VelaSelectorExperiencia from "@/components/vela/VelaSelectorExperiencia";
import VelaCTA from "@/components/vela/VelaCTA";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const titles: Record<string, string> = {
    es: "Qué es la Vela | GetxoBelaEskola",
    eu: "Zer da Bela | GetxoBelaEskola",
    en: "What is Sailing | GetxoBelaEskola",
    fr: "Qu'est-ce que la Voile | GetxoBelaEskola",
  };
  const descriptions: Record<string, string> = {
    es: "La vela combina técnica, calma y conexión profunda con la mar. Descubre la experiencia 3D.",
    eu: "Belak teknika, lasaitasuna eta itsasoarekin konexio sakona uztartzen ditu.",
    en: "Sailing combines technique, calm and a deep connection with the sea.",
    fr: "La voile combine technique, calme et une connexion profonde avec la mer.",
  };
  return {
    title: titles[params.locale] || titles.es,
    description: descriptions[params.locale] || descriptions.es,
  };
}

export default function QueEsLaVelaPage() {
  return (
    <main
      className={`bg-white overflow-hidden ${dmSerif.variable} ${inter.variable}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* ═══ EXPERIENCIA 3D SCROLL-DRIVEN ═══ */}
      {/* El velero Optimist se muestra desde diferentes ángulos
          mientras el usuario hace scroll. Ocupa ~700vh de scroll. */}
      <Vela3DStage />

      {/* ═══ SECCIONES POST-3D (scroll normal) ═══ */}
      {/* Estas secciones aparecen DESPUÉS de la experiencia 3D,
          con scroll convencional. */}
      <div id="post-3d">
        <VelaSelectorExperiencia />
        <VelaCTA />
      </div>
    </main>
  );
}
```

**Cambios respecto al original:**
- **Eliminados:** VelaHero, VelaFraseAnimada, VelaFilosofia, VelaTextoNarrativo
  (su contenido ahora vive dentro de `Vela3DOverlays.tsx`)
- **Añadido:** `Vela3DStage` como primera sección
- **Mantenidos:** VelaSelectorExperiencia y VelaCTA como secciones normales post-3D

**✅ Verificación:** La página carga sin errores. El 3D stage ocupa la primera parte, seguido por el selector y CTA.

---

# FASE 10 — Responsive y Mobile
> ⏱ 20 min · ⭐⭐⭐☆☆

---

## TAREA 10.1 — Adaptar overlays para mobile

**Modificar:** `Vela3DOverlays.tsx`

En mobile (< 768px), los overlays NO pueden ocupar solo el 40-50% del ancho.
Necesitan adaptarse:

### Estrategia mobile:
1. **Hero:** Texto centrado en la parte superior (60% del viewport), barco visible abajo
2. **Frase:** Panel glass ocupa 90% del ancho, centrado
3. **Filosofía:** Cards en columna centrada (90% ancho), barco detrás con opacity reducida
4. **Narrativa:** Párrafos centrados (90% ancho), con fondo semi-transparente
5. **Beauty:** Igual que desktop
6. **Cierre:** Igual que desktop

### CSS classes responsive a añadir:
```css
/* En cada overlay que usa max-w-[45%] o max-w-[48%]: */
className="w-full md:max-w-[45%]"

/* El panel glass en mobile necesita más opacidad: */
/* mobile: rgba(255,255,255,0.92)  desktop: rgba(255,255,255,0.75) */
```

### Reducir altura del runway en mobile:
```typescript
// En Vela3DStage.tsx:
const RUNWAY_HEIGHT_VH = typeof window !== 'undefined' && window.innerWidth < 768
  ? 500  // Mobile: menos scroll (las secciones son más simples)
  : 700; // Desktop: scroll completo cinematográfico
```

**✅ Verificación:** En Chrome DevTools → modo responsive (iPhone 14), todos los textos son legibles y el barco se ve.

---

## TAREA 10.2 — Optimizar rendimiento en móviles

**Modificar:** `Vela3DScene.tsx`

```typescript
// Añadir dentro del <Canvas>:
<AdaptiveDpr pixelated />

// Y en la configuración gl:
gl={{
  ...existingConfig,
  // En mobile, reducir la resolución del canvas
  pixelRatio: typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio, 1.5)  // Limitar a 1.5x en móviles
    : 1,
}}
```

**Modificar:** `Vela3DBoat.tsx`
```typescript
// Reducir shadow map en mobile
// En el directionalLight principal:
shadow-mapSize-width={typeof window !== 'undefined' && window.innerWidth < 768 ? 512 : 1024}
shadow-mapSize-height={typeof window !== 'undefined' && window.innerWidth < 768 ? 512 : 1024}
```

**✅ Verificación:** 60 FPS estables en un móvil Android gama media (aDB profiler o Chrome DevTools Performance).

---

# FASE 11 — Accesibilidad
> ⏱ 10 min · ⭐⭐☆☆☆

---

## TAREA 11.1 — prefers-reduced-motion

Ya implementado en `Vela3DStage.tsx` (Tarea 8.1):
- Si `prefers-reduced-motion: reduce`, se muestra `Vela3DFallback`
- Los componentes originales (VelaHero, etc.) se pueden reutilizar como fallback

## TAREA 11.2 — aria-labels y roles

**Modificar:** `Vela3DStage.tsx`

```html
<!-- Añadir al sticky stage: -->
<div
  role="region"
  aria-label="Experiencia 3D interactiva: velero Optimist visto desde diferentes ángulos al hacer scroll"
  ...
>
```

**Modificar:** `Vela3DOverlays.tsx`

```html
<!-- Cada overlay debe tener role="article" o similar -->
<Overlay id="hero" className="..." role="article" aria-label="Introducción a la vela">
```

## TAREA 11.3 — Skip link

**Modificar:** `Vela3DStage.tsx`

Añadir un enlace de salto para usuarios de teclado/lector de pantalla:

```html
<a
  href="#post-3d"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
             focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#0071E3]
             focus:rounded-lg focus:shadow-lg"
>
  Saltar experiencia 3D
</a>
```

**✅ Verificación:** Tab → aparece "Saltar experiencia 3D" → Enter → scroll directo a VelaSelectorExperiencia.

---

# FASE 12 — Traducciones i18n
> ⏱ 10 min · ⭐☆☆☆☆

---

## TAREA 12.1 — Añadir nuevas claves de traducción

**Modificar:** `messages/es.json`, `eu.json`, `en.json`, `fr.json`

Añadir dentro de la sección `que_es_la_vela`:

```json
{
  "que_es_la_vela": {
    // ... claves existentes ...

    "loading_brand": "GetxoBelaEskola",
    "loading_text": "Preparando experiencia",
    "beauty_badge": "↓ Sigue explorando",
    "skip_3d": "Saltar experiencia 3D",
    "fallback_message": "Tu navegador no soporta gráficos 3D. Actualiza tu navegador para la experiencia completa.",
    "aria_3d_region": "Experiencia 3D interactiva: velero Optimist visto desde diferentes ángulos al hacer scroll"
  }
}
```

**Traducir en eu/en/fr** con las traducciones adecuadas.

**✅ Verificación:** Cambiar locale en la URL (es→eu→en→fr), los textos de loading/beauty/fallback cambian.

---

# FASE 13 — Pulido y Microinteracciones
> ⏱ 15 min · ⭐⭐⭐☆☆

---

## TAREA 13.1 — Transición suave del 3D stage al contenido post-3D

**Problema:** Al terminar el scroll runway (700vh), hay un corte abrupto al pasar
a VelaSelectorExperiencia.

**Solución:** Añadir un gradiente de transición al final del sticky stage.

```typescript
// En Vela3DStage.tsx, dentro del sticky stage, DESPUÉS de los overlays:
<div
  className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
  style={{
    background: 'linear-gradient(to bottom, transparent, white)',
  }}
/>
```

## TAREA 13.2 — Sutil efecto de "partículas de agua" alrededor del barco

**Modificar:** `Vela3DScene.tsx`

Usar `@react-three/drei` → `Sparkles` para añadir partículas brillantes:

```typescript
import { Sparkles } from '@react-three/drei';

// Dentro del Canvas, junto al barco:
<Sparkles
  count={40}
  scale={8}
  size={1.5}
  speed={0.3}
  opacity={0.15}
  color="#0071E3"  // Azul mar
/>
```

Esto crea puntos de luz sutiles que flotan alrededor del barco, simulando reflejos en el agua.

## TAREA 13.3 — Easter egg: hacer el barco clickeable

**Modificar:** `Vela3DBoat.tsx`

```typescript
// Cambiar pointerEvents del canvas a 'auto' solo para el barco:
<group
  ref={groupRef}
  onPointerOver={() => {
    document.body.style.cursor = 'grab';
  }}
  onPointerOut={() => {
    document.body.style.cursor = 'default';
  }}
>
  <primitive object={scene} />
</group>
```

**Nota:** Esto es sutil — solo cambia el cursor al pasar por encima del barco.
NO permite rotarlo manualmente (eso rompería la coreografía de scroll).

**✅ Verificación:** El cursor cambia a "grab" al hover sobre el barco.

---

# FASE 14 — Testing y Verificación Final
> ⏱ 15 min · ⭐⭐☆☆☆

---

## TAREA 14.1 — Build test

```powershell
cd C:\Users\User\Desktop\agenc-ia\apps\getxobelaeskola-web
npm run build
```

**✅ Verificación:** Build compila sin errores ni warnings.

## TAREA 14.2 — Performance audit

1. Abrir Chrome DevTools → Performance → grabar scroll completo
2. Verificar:
   - FPS estable ≥ 55 fps en desktop
   - FPS estable ≥ 30 fps en mobile (simulado)
   - No hay memory leaks (Memory tab, heap snapshots antes y después del scroll)
   - El modelo .glb se descarga una sola vez (Network tab → filter .glb)

## TAREA 14.3 — Cross-browser

Verificar en:
- Chrome (principal)
- Firefox (WebGL puede tener diferencias de rendimiento)
- Safari (iOS — puede necesitar ajustes de WebGL)
- Edge (debería ser idéntico a Chrome)

## TAREA 14.4 — Test de locales

```
http://localhost:3000/es/club/que-es-la-vela
http://localhost:3000/eu/club/que-es-la-vela
http://localhost:3000/en/club/que-es-la-vela
http://localhost:3000/fr/club/que-es-la-vela
```

**✅ Verificación:** Todos los idiomas muestran textos correctos en los overlays.

---

## 📊 Resumen de Archivos

| Acción | Archivo | Descripción |
|:---:|:---|:---|
| 🆕 | `public/models/optimist-boat.glb` | Modelo 3D Draco (5.46 MB) |
| 🆕 | `src/stores/velaScrollStore.ts` | Zustand store scroll↔R3F |
| 🆕 | `src/components/vela/useBoatScroll.ts` | Keyframes cámara + interpolación |
| 🆕 | `src/components/vela/Vela3DBoat.tsx` | Carga modelo GLTF+Draco |
| 🆕 | `src/components/vela/Vela3DCameraRig.tsx` | Controlador cámara por scroll |
| 🆕 | `src/components/vela/Vela3DScene.tsx` | R3F Canvas + iluminación |
| 🆕 | `src/components/vela/Vela3DLoadingScreen.tsx` | Pantalla de carga elegante |
| 🆕 | `src/components/vela/Vela3DFallback.tsx` | Fallback no-WebGL |
| 🆕 | `src/components/vela/Vela3DOverlays.tsx` | 6 overlays de contenido |
| 🆕 | `src/components/vela/Vela3DStage.tsx` | Orquestador principal |
| ✏️ | `src/app/[locale]/club/que-es-la-vela/page.tsx` | Nuevo layout con 3D |
| ✏️ | `messages/es.json` (+ eu, en, fr) | Nuevas claves de traducción |
| 🗃️ | `src/components/vela/VelaHero.tsx` | CONSERVAR como legacy fallback |
| 🗃️ | `src/components/vela/VelaFraseAnimada.tsx` | CONSERVAR como legacy fallback |
| 🗃️ | `src/components/vela/VelaFilosofia.tsx` | CONSERVAR como legacy fallback |
| 🗃️ | `src/components/vela/VelaTextoNarrativo.tsx` | CONSERVAR como legacy fallback |

**Total:** 10 archivos nuevos, 5 archivos modificados, 0 archivos eliminados

---

## ⏱ Tiempo Estimado Total

| Fase | Descripción | Tiempo |
|:---:|:---|:---:|
| 0 | Preparación de assets | 5 min |
| 1 | Zustand store | 10 min |
| 2 | Hook de scroll/cámara | 20 min |
| 3 | Componente barco 3D | 25 min |
| 4 | Camera rig | 15 min |
| 5 | Escena 3D completa | 25 min |
| 6 | Loading screen + fallback | 15 min |
| 7 | Overlays de contenido | 45 min |
| 8 | Stage principal | 30 min |
| 9 | Modificar page.tsx | 10 min |
| 10 | Responsive + mobile | 20 min |
| 11 | Accesibilidad | 10 min |
| 12 | Traducciones i18n | 10 min |
| 13 | Pulido + microinteracciones | 15 min |
| 14 | Testing y verificación | 15 min |
| | **TOTAL** | **~4.5 horas** |

---

## 🎯 Criterios de Éxito

1. ✅ El velero Optimist 3D rota suavemente al hacer scroll
2. ✅ 7 ángulos cinematográficos distintos a lo largo de la página
3. ✅ Contenido textual aparece/desaparece sincronizado al scroll
4. ✅ Carga completa < 4 segundos en 4G
5. ✅ 55+ FPS en desktop, 30+ FPS en mobile
6. ✅ Funciona en Chrome, Firefox, Safari, Edge
7. ✅ Fallback elegante si no hay WebGL
8. ✅ Accesible: skip link, aria labels, reduced motion
9. ✅ 4 idiomas (es, eu, en, fr)
10. ✅ La sensación al scrollear debe ser **"wow, esto parece Apple"**

---

> **IMPORTANTE:** Este plan NO debe implementarse hasta recibir aprobación explícita.
> Los valores de posición de cámara ([x, y, z]) son estimaciones iniciales y
> DEBERÁN ajustarse visualmente una vez el modelo esté cargado, ya que dependen
> de la escala y orientación real del modelo exportado de Sketchfab.
