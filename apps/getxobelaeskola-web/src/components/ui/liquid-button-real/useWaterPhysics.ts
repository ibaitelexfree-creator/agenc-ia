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

  const initialBaseline = (height || 64) * (1 - FILL_LEVEL_IDLE);
  const initialWidth = (width || 220) + 40;
  const initialFrontSegments = Math.max(22, Math.round(initialWidth / 10));
  const initialBackSegments = Math.max(16, Math.round(initialWidth / 14));

  const initialFrontPath = generateWavePath(initialWidth, initialFrontSegments, initialBaseline, preset.frontAmplitudes, preset.frontFrequencies, preset.frontSpeeds, 0, phaseSeed, 0, 0);
  const initialBackPath = generateWavePath(initialWidth, initialBackSegments, initialBaseline - 5, preset.backAmplitudes, preset.backFrequencies, preset.backSpeeds, 0, phaseSeed + 41, 0, 0);

  const frontPathD = useMotionValue(initialFrontPath);
  const backPathD = useMotionValue(initialBackPath);
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

    const frontSegments = Math.max(22, Math.round(width / 10));
    const backSegments = Math.max(16, Math.round(width / 14));

    frontPathD.set(
      generateWavePath(
        width, frontSegments, baseline,
        preset.frontAmplitudes, preset.frontFrequencies, preset.frontSpeeds,
        t, phaseSeed, MAX_TILT_AMPLITUDE, tiltDirection
      )
    );
    backPathD.set(
      generateWavePath(
        width, backSegments, baseline - 5,
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
    const frontSegments = Math.max(22, Math.round(width / 10));
    const backSegments = Math.max(16, Math.round(width / 14));
    frontPathD.set(
      generateWavePath(width, frontSegments, baseline, preset.frontAmplitudes, preset.frontFrequencies, preset.frontSpeeds, 0, phaseSeed, 0, 0)
    );
    backPathD.set(
      generateWavePath(width, backSegments, baseline - 5, preset.backAmplitudes, preset.backFrequencies, preset.backSpeeds, 0, phaseSeed + 41, 0, 0)
    );
  }, [reducedMotion, width, height, preset, phaseSeed, frontPathD, backPathD]);

  return { frontPathD, backPathD };
}
