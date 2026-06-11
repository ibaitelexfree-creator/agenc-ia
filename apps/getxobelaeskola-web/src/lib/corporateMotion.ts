import { Variants } from 'framer-motion';

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -70 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

export const revealRight: Variants = {
  hidden: { opacity: 0, x: 70 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

export const stagger: Variants = {
  hidden: {},
  visible: { 
    transition: { staggerChildren: 0.14, delayChildren: 0.05 } 
  }
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 18 } 
  }
};

export const splitReveal: Variants = {
  land: { clipPath: "inset(0 50% 0 0)" },
  sea: { 
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const } 
  }
};
