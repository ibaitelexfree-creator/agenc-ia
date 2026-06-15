import { useReducedMotion } from "framer-motion";

// Devuelve `true` si hay que activar animaciones "extra" (loops, parallax, partículas)
export function useMagicMotion() {
  const prefersReduced = useReducedMotion();
  return { magicEnabled: !prefersReduced };
}
