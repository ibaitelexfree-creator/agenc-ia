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
