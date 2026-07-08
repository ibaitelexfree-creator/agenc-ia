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
