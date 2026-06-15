import { Variants, Easing } from "framer-motion";

// ---- Curvas de easing tipo Apple (ease-out suave) ----
export const easeApple: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- Springs reutilizables ----
export const springPop    = { type: "spring" as const, stiffness: 420, damping: 18 };
export const springSoft   = { type: "spring" as const, stiffness: 220, damping: 22 };
export const springButton = { type: "spring" as const, stiffness: 300, damping: 20 };

// ---- Revelado simple al entrar en viewport (texto, bloques) ----
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeApple } },
};

// ---- Contenedor con "stagger" (hijos aparecen en cascada) ----
export const staggerContainer = (stagger = 0.12, delay = 0.05) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

// ---- Item hijo de un staggerContainer (tarjetas, líneas de texto) ----
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: easeApple } },
};

// ---- Estrellas: pop con rotación, una a una ----
export const starPop: Variants = {
  hidden:  { opacity: 0, scale: 0, rotate: -40 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: springPop },
};

// ---- Flotación ambiental infinita (avatares, iconos "mágicos") ----
export const floatLoop = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

// ---- Hover de tarjeta "elevar + sombra" ----
export const cardHover = {
  whileHover: { y: -10, boxShadow: "var(--gbe-shadow-hover)" },
  whileTap:   { scale: 0.98 },
  transition: springSoft,
};

// ---- Texto: revelar palabra a palabra ----
export const wordContainer = staggerContainer(0.06, 0);
export const wordItem: Variants = {
  hidden:  { opacity: 0, y: "0.4em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeApple } },
};
