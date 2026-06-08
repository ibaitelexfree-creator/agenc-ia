import { Variants } from 'framer-motion';

// 1. Transición de Páginas (Slide suave + Fade)
export const pageTransitions: Variants = {
  initial: {
    opacity: 0,
    x: 15,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom Cubic Bezier para fluidez premium
    },
  },
  exit: {
    opacity: 0,
    x: -15,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// 2. Contenedor para animaciones escalonadas (Stagger)
export const staggerContainer = (delayChildren = 0.05, staggerChildren = 0.08): Variants => ({
  initial: {},
  animate: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

// 3. Elemento individual escalonado (Stagger Item)
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// 4. Efecto Hover de Elevación y Escala Suave (Hover Lift)
export const hoverLift = {
  whileHover: {
    scale: 1.02,
    y: -8,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    },
  },
  whileTap: {
    scale: 0.98,
    y: -2,
  },
} as const;


// 5. Ventanas emergentes y menús flotantes (Spring Popup)
export const springPopup: Variants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 22,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: {
      duration: 0.15,
    },
  },
};
