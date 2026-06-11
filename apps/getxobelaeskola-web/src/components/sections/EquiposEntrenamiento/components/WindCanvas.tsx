// WindCanvas.tsx — Sistema de partículas de viento
import { useEffect, useRef } from "react";
import styles from "../EquiposEntrenamiento.module.css";

const PARTICLE_COUNT = 80;
const BASE_SPEED     = 1.2;   // px por frame
const MOUSE_STRENGTH = 0.04;  // cuánto el ratón afecta la dirección

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  speed: number;
}

function createParticle(W: number, H: number): Particle {
  return {
    x:       Math.random() * W,
    y:       Math.random() * H,
    vx:      BASE_SPEED + Math.random() * 0.8,
    vy:     -0.15 + Math.random() * 0.3,
    length:  20 + Math.random() * 60,   // longitud de la línea
    opacity: 0.03 + Math.random() * 0.1,
    speed:   0.8 + Math.random() * 0.8,
  };
}

export default function WindCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext("2d");
    if (!ctx) return;
    
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    // Crear partículas
    const particles = Array.from({ length: PARTICLE_COUNT },
      () => createParticle(W, H)
    );

    // Resize handler
    const onResize = () => {
      if (!canvas) return;
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    // Mouse handler
    const onMouse = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", onMouse);

    // Loop principal
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        // Influencia del ratón sobre la velocidad Y
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vy += (dy / dist) * MOUSE_STRENGTH;
          p.vy  = Math.max(-0.6, Math.min(0.6, p.vy)); // clamp
        }

        // Dibuja la línea
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length, p.y - p.length * 0.15);
        ctx.strokeStyle = `rgba(15, 64, 128, ${p.opacity})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // Mueve la partícula
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // Wrap — si sale por la derecha, vuelve por la izquierda
        if (p.x > W + p.length) { p.x = -p.length; p.y = Math.random() * H; }
        if (p.y < -10)   { p.y = H + 10; }
        if (p.y > H + 10){ p.y = -10; }
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (canvas) canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles['wind-canvas']}
      aria-hidden="true"
    />
  );
}
