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
  // Landing Hero — frontal, nivel del ojo, bien encuadrado a la derecha
  { at: 0.00, position: [-4.5, 4.5, 14.0],  lookAt: [-4.5, 0.5, 0],   fov: 42 },
  { at: 0.04, position: [-4.3, 4.2, 13.5],  lookAt: [-4.3, 0.4, 0],   fov: 41 },

  // Hero — frontal, bajando al nivel del ojo
  { at: 0.18, position: [0, 3, 12],   lookAt: [0, 0, 0],   fov: 40 },

  // Frase — perfil lateral (estribor)
  { at: 0.32, position: [12, 2, 4],   lookAt: [0, 1, 0],   fov: 38 },

  // Filosofía — popa, a la derecha y más grande (sección 3 activa)
  { at: 0.46, position: [14.5, 4.5, -10.0], lookAt: [4.5, 0.5, 0], fov: 40 },

  // Transición orbital 1: detrás del barco, manteniéndolo centrado y alto en pantalla
  { at: 0.50, position: [7.0, 1.8, -14.0],  lookAt: [0, -1.0, 0],  fov: 40 },

  // Transición orbital 2: girando hacia el perfil izquierdo, manteniéndolo centrado y alto en pantalla
  { at: 0.53, position: [-7.0, 1.8, -14.0], lookAt: [0, -1.0, 0],  fov: 40 },

  // Midpoint (entre 3 y 4) — de perfil en el lado izquierdo y alto en pantalla
  { at: 0.56, position: [-11.0, 1.2, 4.0],  lookAt: [10.0, -1.0, 0], fov: 38 },

  // Narrativa — perfil izquierdo primer plano y alto en pantalla (sección 4 activa)
  { at: 0.72, position: [-11.0, 1.0, 14.0], lookAt: [10.0, -1.2, 0], fov: 35 },

  // Beauty shot — frontal centrado, girando y entrando en curva navegando hacia adelante (sección 5)
  { at: 0.88, position: [0.0, 3.0, 18.0],    lookAt: [0.0, 1.5, 0.0], fov: 38 },

  // Llegada arriba — el velero sube rápidamente y se posiciona en la parte superior
  { at: 0.93, position: [0.0, 8.0, 22.0],    lookAt: [0.0, -6.0, 0.0], fov: 45 },

  // Enclave — el velero se queda fijo arriba mientras sale el texto final
  { at: 1.00, position: [0.0, 8.0, 22.0],    lookAt: [0.0, -6.0, 0.0], fov: 45 },
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
  hero:      { fadeIn: 0.00, fullIn: 0.00, fullOut: 0.14, fadeOut: 0.18 },
  frase:     { fadeIn: 0.19, fullIn: 0.22, fullOut: 0.28, fadeOut: 0.32 },
  filosofia: { fadeIn: 0.33, fullIn: 0.36, fullOut: 0.48, fadeOut: 0.52 },
  narrativa: { fadeIn: 0.53, fullIn: 0.56, fullOut: 0.68, fadeOut: 0.72 },
  beauty:    { fadeIn: 0.73, fullIn: 0.76, fullOut: 0.84, fadeOut: 0.88 },
  cierre:    { fadeIn: 0.89, fullIn: 0.92, fullOut: 1.00, fadeOut: 1.00 },
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
