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
