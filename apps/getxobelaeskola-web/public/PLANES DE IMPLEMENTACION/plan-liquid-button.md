# Plan de implementación — `LiquidButton`
### Botón de agua fotorrealista, en movimiento constante, atraído por el cursor

Stack objetivo: **React (componentes funcionales) + TypeScript + Framer Motion + Tailwind CSS**, sin dependencias nuevas.

Este documento está escrito para que cualquier implementador (humano o instancia de IA) pueda ejecutarlo de principio a fin sin tomar decisiones de diseño ni resolver ambigüedades técnicas. Cada fase indica el archivo exacto, el código completo y el motivo de cada decisión no obvia.

---

## 0. Resumen ejecutivo

**Qué construimos:** un botón cuyo interior es un cuerpo de agua real: una superficie ondulante que nunca se detiene, con profundidad (gradiente + turbulencia óptica), que sube y se inclina hacia el cursor cuando este se acerca (no solo al pasar por encima, sino dentro de un radio magnético), y que "salpica" al pulsarlo.

**Criterios de aceptación** (esto es lo que "perfecto" significa en este documento, de forma verificable):

- [ ] La superficie del agua nunca está quieta, ni con el ratón lejos ni con la página sin interacción.
- [ ] Hacer scroll en la página **no** altera ni reinicia la animación (el movimiento es 100% independiente del scroll).
- [ ] Cuando el cursor entra en un radio de ~170px alrededor del botón, el agua **sube de nivel** y se **inclina** hacia el lado del cursor, con un retraso viscoso (no instantáneo).
- [ ] Al pulsar, aparece una salpicadura (ripple) desde el punto exacto de clic, y el nivel del agua se hunde levemente y se recupera.
- [ ] Con `prefers-reduced-motion: reduce`, el botón muestra agua estática pero visualmente completa (nunca vacío ni roto).
- [ ] Funciona correctamente con 2+ instancias de `LiquidButton` en la misma página (sin IDs de filtro/gradiente duplicados, sin animaciones sincronizadas entre botones).
- [ ] En móvil/touch (sin ratón real), el botón sigue teniendo oleaje idle; el campo magnético simplemente no se activa.
- [ ] El componente no vuelve a renderizar en cada `mousemove` (el rendimiento se sostiene con 10+ botones en pantalla).

---

## 1. Decisiones de arquitectura (y por qué)

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| SVG animado con paths generados por funciones seno, en vez de Canvas o WebGL | `<canvas>` / Three.js / shaders | Se integra de forma nativa con Framer Motion y Tailwind, es inspeccionable/depurable en devtools, accesible, y con 2-3 capas de onda + un filtro de turbulencia el resultado es indistinguible de "agua de verdad" en el tamaño de un botón. WebGL da más fotorrealismo pero añade una dependencia pesada (`three`/`r3f`) para un componente pequeño — se documenta como extensión opcional en la Fase 12. |
| `useMotionValue` + escritura directa (`.set()`) en vez de `useState` para todo lo que cambia cada frame o en cada `mousemove` | `useState` | `useState` re-renderiza el componente React en cada actualización. Un botón de agua actualiza su forma ~60 veces por segundo; con `useState` esto sería, en la práctica, injugable con más de un botón en pantalla. `useMotionValue` actualiza el DOM directamente sin pasar por React. |
| `useAnimationFrame` de Framer Motion (con `delta` normalizado) en vez de `useScroll`/`scrollYProgress` o animaciones CSS `@keyframes` puras | Animación ligada al scroll o a keyframes fijos | El requisito explícito es que el scroll **no debe afectar** el movimiento. `useAnimationFrame` da un reloj independiente del scroll. Se normaliza por `delta` para que la velocidad no varíe entre monitores de 60Hz y 120Hz. |
| Radio magnético global (`window.addEventListener('pointermove')`) en vez de solo `onMouseMove` sobre el botón | Solo eventos dentro del botón | El requisito pide que el agua "sea atraída" por el cursor, no solo que reaccione al hover directo. Se necesita saber la posición del ratón aunque esté fuera del botón, dentro de un radio configurable. |
| Recalcular `getBoundingClientRect()` en cada evento de puntero, nunca cachear el rect | Guardar el rect una vez en un ref | Si el rect se cachea y el usuario hace scroll, el campo magnético queda desalineado con la posición real del botón en pantalla. Recalcular es barato comparado con el coste de un bug de alineación. |
| Física con "springs pesados" (rigidez baja, amortiguación alta) en vez de los springs por defecto de Framer Motion | Springs por defecto (rígidos, pensados para UI) | Un spring de UI típico (stiffness ~300) se siente como un botón que salta. Para que el agua se sienta viscosa se necesita stiffness baja (40-70) y damping medio-alto (8-15). Los valores exactos están en la Fase 5. |

---

## 2. Dependencias

No se necesita instalar nada nuevo si el proyecto ya usa `framer-motion` (confirmado en tu stack). Verifica la versión:

```bash
npm ls framer-motion
```

Si es menor que `11.x`, actualiza (esta implementación usa `useAnimationFrame`, `useMotionTemplate` y binding de `style.d` en `motion.path`, disponibles desde Framer Motion 6+, pero se recomienda 11+ por estabilidad):

```bash
npm install framer-motion@latest
```

---

## 3. Estructura de archivos

Crea esta carpeta dentro de tu proyecto (ajusta la raíz `components/` si tu convención es otra, p. ej. `src/components/`):

```
components/
└── liquid-button/
    ├── LiquidButton.tsx            → Componente principal (ensamblaje)
    ├── LiquidButton.types.ts       → Interfaces TypeScript
    ├── LiquidButton.constants.ts   → Todas las constantes físicas y de diseño
    ├── waterPath.utils.ts          → Generador puro de paths SVG de la ola
    ├── useMagneticField.ts         → Hook: seguimiento del cursor + campo magnético
    ├── useWaterPhysics.ts          → Hook: motor de física del agua (idle + nivel + inclinación)
    ├── WaterFilters.tsx            → <defs> del filtro de turbulencia/distorsión SVG
    └── index.ts                    → Barrel export
```

Cada archivo se crea en su propia fase, en este orden exacto (hay dependencias entre ellos: no saltes el orden).

---

## 4. Modelo físico del agua (la matemática, explicada)

La superficie del agua en cada instante `t` se calcula muestreando una curva a lo largo del ancho del botón, en `N` puntos (segmentos), y uniendo esos puntos con curvas suaves (`Q`, cuadráticas) en vez de líneas rectas — esto evita el aspecto "poligonal" y da el aspecto orgánico de una ola real.

Para cada punto `x` (con `progress = x / width`, de 0 a 1), la altura `y` es la suma de 2-3 ondas seno superpuestas, cada una con su propia amplitud, frecuencia y velocidad:

```
y(x, t) = baseline
        + Σ [ amplitud_i · sin(progress · 2π · frecuencia_i + t · velocidad_i · dirección_i + semilla · (i+1) · 1.618) ]
        + inclinación · (progress − 0.5) · direcciónCursor
```

**Por qué varias ondas superpuestas y no una sola:** una sola onda seno se ve robótica y predecible. Sumar 2-3 ondas con frecuencias no relacionadas entre sí (p. ej. 1, 2.3, 4) crea un patrón que nunca se repite exactamente — igual que el agua real no tiene un periodo fijo visible a corto plazo.

**Por qué la `semilla` (phaseSeed) es aleatoria por instancia:** si tienes 3 `LiquidButton` en la misma página, sin esta semilla las tres olas estarían perfectamente sincronizadas, lo cual se ve artificial. La semilla se genera una vez por instancia con `Math.random()` en el montaje y se guarda en un `useRef`.

**El "nivel de agua" (`baseline`)** no es fijo: es un `MotionValue` que se mueve entre `FILL_LEVEL_IDLE` (24% de la altura del botón, en reposo) y `FILL_LEVEL_MAX` (62%, cuando el cursor está encima) mediante un spring propio, más lento y con un ligero rebote (subamortiguado) para simular que el agua "tarda" en subir y se asienta con un pequeño vaivén — así es como el ratón "atrae" el agua de forma literal y visible, no solo con un efecto decorativo.

**La inclinación (`tilt`)** hace que el lado de la ola más cercano al cursor esté más alto que el lado opuesto, reforzando la sensación de atracción direccional, no solo vertical.

---

## 5. Fases de implementación

### FASE 1 — Tipos

**Archivo:** `components/liquid-button/LiquidButton.types.ts`

```ts
import type { ReactNode } from 'react';
import type { WaterIntensity } from './LiquidButton.constants';

export interface LiquidButtonProps {
  /** Contenido del botón (texto, icono, etc.) */
  children: ReactNode;
  onClick?: () => void;
  /** Color del agua en superficie. Acepta hex o cualquier valor CSS válido. */
  waterColor?: string;
  /** Color del agua en profundidad (más oscuro, base del degradado). */
  waterColorDeep?: string;
  /** Preset de energía del oleaje. */
  intensity?: WaterIntensity;
  /** Radio en px alrededor del botón donde el cursor empieza a "atraer" el agua. */
  magneticRadius?: number;
  disabled?: boolean;
  className?: string;
}
```

**Checklist:**
- [ ] El archivo no importa nada de React más que el tipo `ReactNode`.
- [ ] `WaterIntensity` se importa desde constants (se crea en la Fase 2) y no se redefine aquí.

---

### FASE 2 — Constantes

**Archivo:** `components/liquid-button/LiquidButton.constants.ts`

Todos los números "mágicos" del componente viven aquí. Si en el futuro el agua se ve "demasiado nerviosa" o "demasiado lenta", este es el único archivo que hay que tocar.

```ts
export type WaterIntensity = 'calm' | 'normal' | 'stormy';

export const INTENSITY_PRESETS: Record<
  WaterIntensity,
  {
    frontAmplitudes: number[];
    frontFrequencies: number[];
    frontSpeeds: number[];
    backAmplitudes: number[];
    backFrequencies: number[];
    backSpeeds: number[];
  }
> = {
  calm: {
    frontAmplitudes: [2.5, 1.2],
    frontFrequencies: [1, 2.3],
    frontSpeeds: [0.5, 0.8],
    backAmplitudes: [3.5, 1.8],
    backFrequencies: [0.8, 1.9],
    backSpeeds: [0.4, 0.6],
  },
  normal: {
    frontAmplitudes: [4, 2],
    frontFrequencies: [1.2, 2.6],
    frontSpeeds: [0.7, 1.1],
    backAmplitudes: [5.5, 2.5],
    backFrequencies: [1, 2.1],
    backSpeeds: [0.55, 0.85],
  },
  stormy: {
    frontAmplitudes: [6, 3, 1.5],
    frontFrequencies: [1.4, 2.8, 4],
    frontSpeeds: [1, 1.4, 1.8],
    backAmplitudes: [8, 4],
    backFrequencies: [1.1, 2.4],
    backSpeeds: [0.8, 1.2],
  },
};

// Nivel de agua como fracción de la altura del botón (0 = vacío, 1 = lleno)
export const FILL_LEVEL_IDLE = 0.24;
export const FILL_LEVEL_MAX = 0.62;
export const FILL_PRESS_DIP = 0.06;

export const MAGNETIC_RADIUS_DEFAULT = 170; // px
export const MAX_LATERAL_PULL = 9;          // px de desplazamiento lateral máximo del agua
export const MAX_TILT_AMPLITUDE = 5;        // px de inclinación entre los extremos de la ola

// Springs deliberadamente "pesados" (rigidez baja, amortiguación alta):
// así el agua se siente viscosa y no como una animación de interfaz normal.
export const LATERAL_PULL_SPRING = { stiffness: 45, damping: 9, mass: 1.1 };
export const INFLUENCE_SPRING = { stiffness: 55, damping: 10, mass: 1 };
// Subamortiguado a propósito: pequeño rebote al subir el nivel, como agua real asentándose.
export const FILL_LEVEL_SPRING = { stiffness: 70, damping: 8, mass: 1.4 };
export const SURFACE_TENSION_SPRING = { stiffness: 140, damping: 15, mass: 1 };
export const PRESS_DIP_SPRING = { stiffness: 300, damping: 20, mass: 1 };

export const RIPPLE_DURATION_MS = 700;
export const RIPPLE_MAX_RADIUS_PX = 90;

export const DISPLACEMENT_SCALE_IDLE = 1.2;
export const DISPLACEMENT_SCALE_MAX = 6.5;
```

**Checklist:**
- [ ] Ningún otro archivo del componente define un número físico "a mano": todos importan de aquí.

---

### FASE 3 — Generador de paths SVG

**Archivo:** `components/liquid-button/waterPath.utils.ts`

Función pura (sin dependencias de React), fácil de testear de forma aislada.

```ts
interface WavePoint {
  x: number;
  y: number;
}

export function generateWavePath(
  width: number,
  segments: number,
  baseline: number,
  amplitudes: number[],
  frequencies: number[],
  speeds: number[],
  t: number,
  phaseSeed: number,
  tiltAmplitude: number,
  tiltDirection: number
): string {
  const points: WavePoint[] = [];
  const step = width / segments;

  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const progress = x / width;
    let y = baseline;

    for (let layer = 0; layer < amplitudes.length; layer++) {
      const dir = layer % 2 === 0 ? 1 : -1;
      y +=
        amplitudes[layer] *
        Math.sin(
          progress * Math.PI * 2 * frequencies[layer] +
            t * speeds[layer] * dir +
            phaseSeed * (layer + 1) * 1.618
        );
    }

    // Inclinación hacia el cursor: el lado más próximo al ratón sube un poco.
    y += tiltAmplitude * (progress - 0.5) * tiltDirection;

    points.push({ x, y });
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }

  const last = points[points.length - 1];
  // Cierra el path muy por debajo del viewBox: el botón (overflow-hidden) recorta el resto.
  d += ` L ${width.toFixed(2)} ${(last.y + 300).toFixed(2)}`;
  d += ` L 0 ${(points[0].y + 300).toFixed(2)} Z`;

  return d;
}
```

**Nota atómica:** el `+300` es intencional y arbitrario — solo necesita ser "suficientemente grande" para que el cierre del path quede siempre fuera del área visible sin importar la altura del botón. No lo conviertas en variable dependiente de `height`; no aporta nada y complica el código.

**Checklist:**
- [ ] Esta función no importa `framer-motion` ni `react`. Si algún linter se queja de una importación aquí, algo se copió mal.

---

### FASE 4 — Campo magnético (seguimiento del cursor)

**Archivo:** `components/liquid-button/useMagneticField.ts`

```ts
'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import {
  LATERAL_PULL_SPRING,
  INFLUENCE_SPRING,
  MAX_LATERAL_PULL,
} from './LiquidButton.constants';

export function useMagneticField(
  targetRef: React.RefObject<HTMLElement>,
  radius: number,
  disabled: boolean
) {
  const rawPullX = useMotionValue(0);
  const rawPullY = useMotionValue(0);
  const rawInfluence = useMotionValue(0);

  const pullX = useSpring(rawPullX, LATERAL_PULL_SPRING);
  const pullY = useSpring(rawPullY, LATERAL_PULL_SPRING);
  const influence = useSpring(rawInfluence, INFLUENCE_SPRING);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;

    function handlePointerMove(e: PointerEvent) {
      const el = targetRef.current;
      if (!el) return;

      // Recalcular SIEMPRE el rect: nunca cachearlo. El scroll puede haber
      // movido el botón desde el último evento sin disparar un resize.
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.hypot(dx, dy);

      if (distance < radius) {
        const strength = 1 - distance / radius;
        rawInfluence.set(strength);
        rawPullX.set((dx / radius) * MAX_LATERAL_PULL * strength);
        rawPullY.set((dy / radius) * MAX_LATERAL_PULL * strength * 0.4);
      } else {
        rawInfluence.set(0);
        rawPullX.set(0);
        rawPullY.set(0);
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [targetRef, radius, disabled, rawInfluence, rawPullX, rawPullY]);

  return { pullX, pullY, influence };
}
```

**Nota atómica — por qué el listener está en `window` y no en el botón:** si el listener estuviera en el propio botón (`onMouseMove` de React), el campo magnético solo reaccionaría cuando el cursor ya está encima del botón, es decir, sería un simple hover. El requisito es que el agua "sea atraída" desde antes de tocar el botón, así que hace falta saber dónde está el ratón en toda la ventana.

**Checklist:**
- [ ] El listener se registra con `{ passive: true }` (mejora el rendimiento de scroll del navegador).
- [ ] `disabled` cubre tanto `props.disabled` como touch/reduced-motion (se combina en la Fase 7).

---

### FASE 5 — Motor de física del agua

**Archivo:** `components/liquid-button/useWaterPhysics.ts`

```ts
'use client';

import { useRef, useEffect } from 'react';
import {
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  type MotionValue,
} from 'framer-motion';
import { generateWavePath } from './waterPath.utils';
import {
  INTENSITY_PRESETS,
  type WaterIntensity,
  FILL_LEVEL_IDLE,
  FILL_LEVEL_MAX,
  FILL_LEVEL_SPRING,
  MAX_TILT_AMPLITUDE,
} from './LiquidButton.constants';

interface UseWaterPhysicsArgs {
  width: number;
  height: number;
  intensity: WaterIntensity;
  reducedMotion: boolean;
  isVisibleRef: React.RefObject<boolean>;
  influence: MotionValue<number>;
  pullX: MotionValue<number>;
  pressDip: MotionValue<number>;
}

export function useWaterPhysics({
  width,
  height,
  intensity,
  reducedMotion,
  isVisibleRef,
  influence,
  pullX,
  pressDip,
}: UseWaterPhysicsArgs) {
  const preset = INTENSITY_PRESETS[intensity];
  const phaseSeed = useRef(Math.random() * 1000).current;

  const frontPathD = useMotionValue('');
  const backPathD = useMotionValue('');
  const elapsed = useRef(0);

  const targetFill = useTransform(influence, [0, 1], [FILL_LEVEL_IDLE, FILL_LEVEL_MAX]);
  const fillLevel = useSpring(targetFill, FILL_LEVEL_SPRING);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    if (!isVisibleRef.current) return;
    if (width === 0 || height === 0) return;

    // delta viene en ms; se limita a 48ms (~20fps) para evitar saltos grandes
    // si la pestaña estuvo en segundo plano, y se pasa a segundos.
    elapsed.current += Math.min(delta, 48) / 1000;
    const t = elapsed.current;

    const dip = pressDip.get() * height;
    const baseline = height * (1 - fillLevel.get()) + dip;
    const tiltDirection = pullX.get() / 10;

    frontPathD.set(
      generateWavePath(
        width, 22, baseline,
        preset.frontAmplitudes, preset.frontFrequencies, preset.frontSpeeds,
        t, phaseSeed, MAX_TILT_AMPLITUDE, tiltDirection
      )
    );
    backPathD.set(
      generateWavePath(
        width, 16, baseline - 5,
        preset.backAmplitudes, preset.backFrequencies, preset.backSpeeds,
        t * 0.82, phaseSeed + 41, MAX_TILT_AMPLITUDE * 0.7, tiltDirection
      )
    );
  });

  // CRÍTICO para accesibilidad: si el usuario prefiere movimiento reducido,
  // el bucle de arriba nunca se ejecuta, así que sin esto el path quedaría
  // vacío ('') para siempre y el botón se vería roto (sin agua). Se fija
  // una forma estática una sola vez.
  useEffect(() => {
    if (!reducedMotion) return;
    if (width === 0 || height === 0) return;
    const baseline = height * (1 - FILL_LEVEL_IDLE);
    frontPathD.set(
      generateWavePath(width, 22, baseline, preset.frontAmplitudes, preset.frontFrequencies, preset.frontSpeeds, 0, phaseSeed, 0, 0)
    );
    backPathD.set(
      generateWavePath(width, 16, baseline - 5, preset.backAmplitudes, preset.backFrequencies, preset.backSpeeds, 0, phaseSeed + 41, 0, 0)
    );
  }, [reducedMotion, width, height, preset, phaseSeed, frontPathD, backPathD]);

  return { frontPathD, backPathD };
}
```

**Notas atómicas (errores típicos que este código ya evita):**
1. **`Math.min(delta, 48)`**: sin este límite, si el usuario cambia de pestaña y vuelve, `delta` puede llegar a ser de varios segundos, haciendo que la ola "salte" violentamente en el primer frame tras volver. Con el límite, en el peor caso se pierde un poco de fluidez momentánea, pero nunca hay un salto visual.
2. **El bloque `useEffect` de reduced-motion no es opcional.** Es el fix del bug más probable si alguien copia solo el `useAnimationFrame` y omite esto: el botón se vería con agua invisible para cualquier usuario con el sistema configurado en modo de movimiento reducido.
3. Todas las lecturas de `MotionValue` dentro del callback usan `.get()`, nunca se desestructura su valor fuera de este callback — desestructurar un `MotionValue` en el cuerpo del componente (fuera de un callback o de `useTransform`) rompe la reactividad.

**Checklist:**
- [ ] `useAnimationFrame` está importado de `framer-motion`, no se implementa un `requestAnimationFrame` manual.
- [ ] El efecto de accesibilidad se probó desactivando `prefers-reduced-motion` y activándolo desde las dev tools del navegador (Rendering tab → Emulate CSS media feature).

---

### FASE 6 — Filtro de distorsión acuosa (SVG)

**Archivo:** `components/liquid-button/WaterFilters.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { DISPLACEMENT_SCALE_IDLE, DISPLACEMENT_SCALE_MAX } from './LiquidButton.constants';

interface WaterFiltersProps {
  influence: MotionValue<number>;
  filterId: string;
}

export function WaterFilters({ influence, filterId }: WaterFiltersProps) {
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    // Se actualiza el atributo `scale` de forma imperativa (ref + setAttribute)
    // en vez de intentar animarlo vía props de framer-motion: `scale` en
    // feDisplacementMap es un atributo de primitiva de filtro SVG, no está
    // garantizado en la lista de propiedades animables de Framer Motion.
    // Este enfoque es 100% fiable en cualquier versión.
    const unsubscribe = influence.on('change', (v) => {
      const scale = DISPLACEMENT_SCALE_IDLE + v * (DISPLACEMENT_SCALE_MAX - DISPLACEMENT_SCALE_IDLE);
      displacementRef.current?.setAttribute('scale', String(scale));
    });
    return unsubscribe;
  }, [influence]);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.045"
            numOctaves={2}
            seed={11}
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale={DISPLACEMENT_SCALE_IDLE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
```

**Qué hace esto visualmente:** el `feTurbulence` genera ruido orgánico fijo; el `feDisplacementMap` usa ese ruido para desplazar ligeramente los píxeles de todo lo que esté dentro del filtro (las olas), dando un micro-temblor de "refracción" en toda la superficie del agua — el detalle que hace que, aunque el ratón esté lejos, el agua nunca se vea como un SVG estático con una curva animada, sino como agua de verdad. `scale` sube cuando el cursor se acerca (más distorsión = más "reacción" visible del agua).

**Checklist:**
- [ ] `filterId` es único por instancia (se genera en la Fase 8 con `useId()`). Si dos botones comparten el mismo id de filtro, algunos navegadores solo aplican el filtro al primero.

---

### FASE 7 — Ensamblaje: `LiquidButton.tsx`

**Archivo:** `components/liquid-button/LiquidButton.tsx`

```tsx
'use client';

import { useRef, useState, useEffect, useId, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useMagneticField } from './useMagneticField';
import { useWaterPhysics } from './useWaterPhysics';
import { WaterFilters } from './WaterFilters';
import {
  MAGNETIC_RADIUS_DEFAULT,
  SURFACE_TENSION_SPRING,
  PRESS_DIP_SPRING,
  RIPPLE_DURATION_MS,
  RIPPLE_MAX_RADIUS_PX,
  FILL_PRESS_DIP,
} from './LiquidButton.constants';
import type { LiquidButtonProps } from './LiquidButton.types';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function LiquidButton({
  children,
  onClick,
  waterColor = '#22d3ee',
  waterColorDeep = '#0e7490',
  intensity = 'normal',
  magneticRadius = MAGNETIC_RADIUS_DEFAULT,
  disabled = false,
  className = '',
}: LiquidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isVisibleRef = useRef(true);
  const rawUid = useId().replace(/:/g, '');
  const filterId = `water-distortion-${rawUid}`;

  const [dimensions, setDimensions] = useState({ width: 220, height: 64 });
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  const rawPressDip = useMotionValue(0);
  const pressDip = useSpring(rawPressDip, PRESS_DIP_SPRING);

  // Detección de entorno — solo en cliente
  useEffect(() => {
    setIsTouch(!window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Tamaño real del botón (el texto/padding determinan el ancho, no es fijo)
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pausa el cálculo (no la posición) cuando el botón sale del viewport
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const magneticDisabled = isTouch || reducedMotion || disabled;
  const { pullX, pullY, influence } = useMagneticField(buttonRef, magneticRadius, magneticDisabled);

  const { frontPathD, backPathD } = useWaterPhysics({
    width: dimensions.width,
    height: dimensions.height,
    intensity,
    reducedMotion,
    isVisibleRef,
    influence,
    pullX,
    pressDip,
  });

  const groupTransform = useMotionTemplate`translateX(${pullX}px)`;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      rawPressDip.set(FILL_PRESS_DIP);

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, RIPPLE_DURATION_MS);
    },
    [disabled, rawPressDip]
  );

  const handlePointerUp = useCallback(() => {
    rawPressDip.set(0);
  }, [rawPressDip]);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={`relative isolate overflow-hidden rounded-full px-8 py-4 font-medium text-white border border-cyan-200/30 shadow-[0_8px_30px_rgba(34,211,238,0.25)] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      style={{ backgroundColor: waterColorDeep }}
      animate={{ scale: isHovering && !disabled ? 1.025 : 1 }}
      transition={{
        type: 'spring',
        stiffness: SURFACE_TENSION_SPRING.stiffness,
        damping: SURFACE_TENSION_SPRING.damping,
        mass: SURFACE_TENSION_SPRING.mass,
      }}
    >
      <WaterFilters influence={influence} filterId={filterId} />

      <motion.svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ transform: groupTransform, filter: `url(#${filterId})` }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={`grad-back-${rawUid}`}
            gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="0" y2={dimensions.height}
          >
            <stop offset="0%" stopColor={waterColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={waterColorDeep} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient
            id={`grad-front-${rawUid}`}
            gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="0" y2={dimensions.height}
          >
            <stop offset="0%" stopColor={waterColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={waterColorDeep} stopOpacity="0.75" />
          </linearGradient>
        </defs>

        <motion.path style={{ d: backPathD }} fill={`url(#grad-back-${rawUid})`} />
        <motion.path style={{ d: frontPathD }} fill={`url(#grad-front-${rawUid})`} />
      </motion.svg>

      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full border border-white/50"
          style={{ left: r.x, top: r.y, x: '-50%', y: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{
            width: RIPPLE_MAX_RADIUS_PX * 2,
            height: RIPPLE_MAX_RADIUS_PX * 2,
            opacity: 0,
          }}
          transition={{ duration: RIPPLE_DURATION_MS / 1000, ease: [0.19, 1, 0.22, 1] }}
        />
      ))}

      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
        {children}
      </span>
    </motion.button>
  );
}
```

**Notas atómicas — errores sutiles ya resueltos en este código:**

1. **`style={{ d: backPathD }}` y no `d={backPathD}`.** Pasar un `MotionValue` directamente como prop `d` a un `<motion.path>` NO funciona (React intentaría convertir el objeto a string). El binding correcto de Framer Motion para animar el atributo `d` de un path es siempre vía `style`.
2. **`gradientUnits="userSpaceOnUse"` con `y2={dimensions.height}` explícito.** Sin esto, el degradado usa por defecto `objectBoundingBox`, que se calcula sobre la caja del *path completo* — incluyendo el cierre que se extiende 300px por debajo del botón (Fase 3). El resultado sería un degradado casi invisible, porque el 100% del degradado caería muy por debajo del área visible. Con `userSpaceOnUse` y coordenadas explícitas, el degradado va exactamente de arriba a abajo del botón, visible.
3. **`useId()` con `.replace(/:/g, '')`.** React `useId()` puede devolver IDs con `:` (p. ej. `:r0:`), válidos en HTML pero propensos a errores al referenciarlos en `url(#...)` o selectores CSS sin escapar. Se sanean una sola vez.
4. **`onPointerLeave` también dispara `handlePointerUp`.** Si no se hiciera, soltar el clic fuera del botón (arrastrando el cursor) dejaría el nivel de agua hundido permanentemente.

**Checklist:**
- [ ] El componente no usa `useState` para nada que cambie en cada frame o en cada `mousemove` — solo para `dimensions`, `isTouch`, `reducedMotion`, `isHovering` y `ripples` (todos cambian con poca frecuencia).
- [ ] `'use client'` está en la primera línea del archivo (obligatorio en Next.js App Router: el componente usa hooks y `window`).

---

### FASE 8 — Barrel export

**Archivo:** `components/liquid-button/index.ts`

```ts
export { LiquidButton } from './LiquidButton';
export type { LiquidButtonProps } from './LiquidButton.types';
export type { WaterIntensity } from './LiquidButton.constants';
```

---

### FASE 9 — Uso

```tsx
import { LiquidButton } from '@/components/liquid-button';

export function HeroCTA() {
  return (
    <LiquidButton intensity="normal" onClick={() => console.log('reservado')}>
      Reserva tu plaza
    </LiquidButton>
  );
}
```

Para un botón secundario más tranquilo (por ejemplo, en el footer): `intensity="calm"`. Para un momento de alto impacto (hero principal): `intensity="stormy"`.

---

## 6. Integración con tu design system

Tu proyecto ya define un easing personalizado "ocean" y los tokens de color `cyan-400` / la paleta oceánica. Dos puntos de integración concretos:

1. **Easing del ripple:** el valor `[0.19, 1, 0.22, 1]` en la transición del `<motion.span>` de la Fase 7 es un placeholder razonable (equivalente a un "ease-out-expo"). Sustitúyelo por la curva cúbica-bézier "ocean" que ya tienes definida (probablemente en `tailwind.config.ts` o `lib/motion-tokens.ts`), para que el ripple se sienta coherente con el resto de las animaciones del sitio.
2. **Colores:** los props `waterColor` / `waterColorDeep` por defecto usan `#22d3ee` (cyan-400) y `#0e7490` (cyan-700). Si tus tokens de color viven como variables (`var(--color-cyan-400)`), puedes pasarlos directamente como string a estos props sin tocar el componente.

---

## 7. Accesibilidad y rendimiento

- [ ] **`prefers-reduced-motion`** ya está cubierto (Fase 5 y 7): se detiene toda animación continua y el campo magnético, pero el botón conserva una forma de agua estática y completa.
- [ ] **Foco de teclado:** `motion.button` renderiza un `<button>` real, así que el `:focus-visible` por defecto del navegador (o el de tu reset CSS) se sigue aplicando. No se ha suprimido el outline en ningún punto de este código — no lo quites al integrarlo.
- [ ] **Touch:** en dispositivos sin puntero fino (`isTouch === true`), el campo magnético se desactiva por completo (no tiene sentido sin cursor), pero el oleaje idle permanece.
- [ ] **Múltiples instancias:** cada `LiquidButton` genera su propio `phaseSeed` (Fase 5), su propio `filterId` y sus propios IDs de gradiente (Fase 7) vía `useId()`. Nunca hay colisión de IDs SVG entre instancias, ni sincronía visual entre botones.
- [ ] **Pausa fuera de viewport:** el `IntersectionObserver` de la Fase 7 detiene el trabajo de cálculo (no solo el renderizado) cuando el botón no es visible, ahorrando CPU/batería en páginas largas con varios `LiquidButton`. Al volver a ser visible, la animación continúa desde el tiempo transcurrido real (`elapsed.current` es continuo, no se reinicia), por lo que no hay salto visual.
- [ ] **No usar `useScroll` ni `scrollYProgress` en ningún punto de este componente.** Es la forma más común de romper accidentalmente el requisito "el scroll no debe afectar el movimiento" si alguien añade una mejora más adelante.

---

## 8. Casos límite ya cubiertos

| Caso | Cómo se resuelve |
|---|---|
| Dos o más `LiquidButton` en la misma página | IDs únicos vía `useId()`, semilla de fase aleatoria por instancia |
| Usuario hace scroll mientras el cursor está cerca del botón | El rect se recalcula en cada `pointermove` (Fase 4), nunca se cachea |
| Pestaña en segundo plano y vuelta al frente | `delta` se limita a 48ms en el bucle de animación (Fase 5) |
| `prefers-reduced-motion: reduce` | Forma de agua estática, sin bucle de animación ni campo magnético (Fase 5 y 7) |
| Dispositivo táctil (sin cursor real) | Campo magnético desactivado; oleaje idle intacto (Fase 7) |
| El botón cambia de tamaño (texto dinámico, i18n, responsive) | `ResizeObserver` actualiza `dimensions` y todo el sistema de coordenadas se recalcula (Fase 7) |
| El botón está fuera del viewport (página larga) | `IntersectionObserver` detiene el cálculo sin romper la continuidad temporal (Fase 7) |
| El usuario suelta el clic fuera del botón mientras arrastra | `onPointerLeave` también libera el `pressDip` (Fase 7) |

---

## 9. QA — checklist final antes de dar por cerrado el componente

- [ ] Con el ratón completamente quieto y fuera de la pantalla del botón, el agua sigue moviéndose de forma perceptible pero sutil.
- [ ] Acercar el cursor sin entrar en el botón hace que el agua suba e incline visiblemente antes del hover directo.
- [ ] Alejar el cursor hace que el agua baje con un pequeño rebote, no de forma instantánea ni lineal.
- [ ] Hacer scroll rápido arriba/abajo con el cursor quieto no altera la velocidad ni la forma de la ola.
- [ ] Clicar el botón produce una salpicadura desde el punto exacto de clic (no desde el centro).
- [ ] Con 3 copias del botón en la misma pantalla, ninguna comparte animación idéntica ni presenta artefactos visuales de filtros/gradientes cruzados.
- [ ] Cambiar `prefers-reduced-motion` a "reduce" en las devtools dejar el botón con agua visible y estática (nunca vacío).
- [ ] En un móvil real (o emulación touch), tocar el botón produce el ripple y el hundimiento, sin errores de consola relacionados con `pointermove` en `window`.
- [ ] Perfil de rendimiento (React DevTools Profiler): mover el ratón cerca del botón durante varios segundos no produce re-renders del componente `LiquidButton` (todo pasa por `MotionValue`, no por `setState`).

---

## 10. Extensión opcional — nivel "fotorrealismo extremo" (WebGL)

Si en el futuro este botón se convierte en un elemento hero muy prominente y se justifica el coste, el siguiente nivel de realismo es sustituir el SVG por un shader de fragmentos (`react-three-fiber` + GLSL) con:

- Olas de Gerstner (en vez de senos simples) para un desplazamiento más físicamente correcto.
- Reflexión de Fresnel dependiente del ángulo de cámara simulado.
- Refracción real del contenido detrás del botón (`backdrop` como textura).

Esto no se incluye en el plan principal porque: (a) añade `three` + `@react-three/fiber` como dependencias nuevas y pesadas para un solo componente, (b) el resultado del enfoque SVG de este documento ya cumple los criterios de aceptación de la Sección 0, y (c) un shader mal calibrado se ve peor que este enfoque, mientras que este enfoque tiene un techo de calidad alto y predecible. Trátalo como una fase 12 separada, solo si hay presupuesto de desarrollo dedicado a ella.
