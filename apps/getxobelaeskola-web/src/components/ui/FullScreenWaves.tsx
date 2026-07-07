'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

// Generador de olas con interpolación Bézier cuadrática, tentáculos morfables y remolino
function generateWavePath(
  width: number,
  height: number,
  segments: number,
  baseline: number,
  amplitudes: number[],
  frequencies: number[],
  speeds: number[],
  t: number,
  phaseSeed: number,
  mx: number,
  my: number,
  rawMx: number,
  rawMy: number,
  smoothedSpeedX: number,
  absorptionFactor: number, // 0.0 (no absorbido) a 1.0 (absorbido/remolino total)
  attackFactor: number // 0.0 (normal) a 1.0 (ataque sorpresa máximo/fino)
): string {
  const points: { x: number; y: number }[] = [];
  const step = width / segments;
  const freqScale = width / 200; // Ajusta frecuencia según ancho de pantalla

  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const progress = x / width;
    let y = baseline;

    // 1. Calcular olas base
    for (let layer = 0; layer < amplitudes.length; layer++) {
      const dir = layer % 2 === 0 ? 1 : -1;
      const baseFreq = frequencies[layer] * freqScale;

      const ampMod = 0.45 + 0.55 * Math.sin(progress * Math.PI * 0.77 * baseFreq + t * 0.25 * dir);
      const phaseMod = Math.cos(progress * Math.PI * 1.414 * baseFreq + t * 0.45 * dir);

      const spatial = Math.sin(progress * Math.PI * 2 * baseFreq + phaseMod + phaseSeed * (layer + 1) * 1.618);
      const localTimeOffset = progress * Math.PI * 2.37 * (layer + 1.13); // Desfase temporal local
      const temporal = Math.cos(t * speeds[layer] * 1.8 + localTimeOffset + phaseSeed * (layer + 3) * 0.77);

      y += amplitudes[layer] * ampMod * spatial * temporal;
    }

    // 2. Interacciones del ratón (Morfosis: Ondulación suave -> Tentáculos -> Remolino suave)
    let xShift = 0;
    if (mx >= 0 && my >= 0 && mx <= width) {
      const dx = x - mx;

      // A) Efecto de remolino / hundimiento (proporcional al factor de absorción)
      const swallowRadius = 160;
      if (Math.abs(dx) < swallowRadius) {
        const factor = Math.pow(Math.cos((dx / swallowRadius) * Math.PI * 0.5), 2);
        y += 40 * factor * absorptionFactor;
      }

      // B) Efecto de tentáculos / ondulación
      const tentacleProximityFactor = 1 - absorptionFactor;
      if (tentacleProximityFactor > 0.01) {
        // Distancia Euclidiana real del seguidor al cursor físico
        const dist = Math.sqrt(Math.pow(rawMx - mx, 2) + Math.pow(rawMy - my, 2));
        const proximity = Math.max(0, Math.min(1, 1 - dist / 280));

        // Morfosis base
        const spacing = 24 * proximity;
        
        // Estrechamiento continuo del radio del tentáculo según el attackFactor (se reduce hasta un 42% más fino)
        let tentacleRadius = (90 - 78 * proximity) * (1 - 0.42 * attackFactor);
        tentacleRadius = Math.max(5.5, tentacleRadius); // Radio mínimo de 5.5px

        // Estiramiento vertical continuo escalado por el factor de ataque sorpresa (+35%)
        let pullScale = (0.12 + 0.83 * proximity) * (1 + 0.35 * attackFactor) * tentacleProximityFactor;
        pullScale = Math.min(1.0, pullScale);

        const tentaclePositions = [
          mx,
          mx - spacing * Math.sin(t * 3.5 + 0.5),
          mx + spacing * Math.cos(t * 4.2 + 1.2)
        ];

        for (let j = 0; j < tentaclePositions.length; j++) {
          const tx = tentaclePositions[j];
          const tdx = x - tx;

          if (Math.abs(tdx) < tentacleRadius) {
            const factor = Math.cos((tdx / tentacleRadius) * Math.PI * 0.5);
            const bell = Math.pow(factor, 2.5); // Campana gaussiana

            // Estiramiento vertical: solo tira hacia arriba
            let targetPull = (my - y) * pullScale;
            if (targetPull > 0) {
              targetPull = 0;
            }

            // Ondulación orgánica y suave: reducimos frecuencia y amplitud para evitar vibraciones bruscas (jitter)
            const wiggleHz = 6.5 + 2.0 * attackFactor;
            const wiggleAmp = (0.05 + 0.03 * attackFactor) * (1 - absorptionFactor) * proximity;
            const wiggle = 1.0 + wiggleAmp * Math.sin(t * wiggleHz + j * 2.5);
            const pullAmount = targetPull * bell * wiggle;
            y += pullAmount;

            // Inclinación diagonal suave
            const shift = smoothedSpeedX * bell * (Math.abs(pullAmount) / 28) * 1.5;
            if (smoothedSpeedX > 0) {
              xShift += Math.max(0, Math.min(rawMx - mx, shift));
            } else {
              xShift += Math.min(0, Math.max(rawMx - mx, shift));
            }
          }
        }
      }
    }

    points.push({ x: x + xShift, y });
  }

  let d = `M 0 ${height} L 0 ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }

  const last = points[points.length - 1];
  d += ` L ${width.toFixed(2)} ${last.y.toFixed(2)}`;
  d += ` L ${width.toFixed(2)} ${height.toFixed(2)} Z`;

  return d;
}

export function FullScreenWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(1200);
  const height = 140;

  const path1 = useMotionValue('');
  const path2 = useMotionValue('');
  const path3 = useMotionValue('');
  const path4 = useMotionValue('');

  // Partículas de explosión en Canvas
  const particlesRef = useRef<any[]>([]);

  // Posición del ratón y variables de suavizado
  const mouseX = useRef(-9999);
  const mouseY = useRef(-9999);
  const lerpedX = useRef(-9999);
  const lerpedY = useRef(-9999);

  // Filtro inercial de velocidad horizontal
  const prevMx = useRef(-9999);
  const smoothedSpeedX = useRef(0);

  // Estados de absorción y factor de hundimiento
  const isAbsorbed = useRef(false);
  const absorptionCooldown = useRef(false);
  const absorptionFactor = useRef(0);

  // Ataque sorpresa aleatorio (ocurre una sola vez cada 7-25 segundos)
  const isAttacking = useRef(false);
  const attackFactor = useRef(0); // Transición analógica de 0.0 a 1.0 (súper lento, estirándose y haciéndose más fino)
  const nextAttackTime = useRef(7.0 + Math.random() * 15.0); // Primer ataque sorpresa

  const elapsed = useRef(0);
  const phaseSeeds = useRef([Math.random() * 10, Math.random() * 20, Math.random() * 30, Math.random() * 40]).current;

  // Escuchar posición del cursor a nivel de ventana para una atracción fluida
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      mouseX.current = e.clientX - rect.left;
      mouseY.current = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseX.current = -9999;
      mouseY.current = -9999;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Escuchar redimensionamiento para actualizar el lienzo SVG sin desfases
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        setWidth(container.getBoundingClientRect().width);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useAnimationFrame((_, delta) => {
    elapsed.current += Math.min(delta, 48) / 1000;
    const t = elapsed.current;

    const segments = Math.max(35, Math.round(width / 28));

    // Suavizado por Lerp EXTREMADAMENTE lento (0.0055) para que el oleaje persiga de forma pesada y noble
    if (mouseX.current === -9999) {
      lerpedX.current = -9999;
      lerpedY.current = -9999;
      prevMx.current = -9999;
      smoothedSpeedX.current = 0;
      isAttacking.current = false;
      attackFactor.current = 0;
    } else {
      if (lerpedX.current === -9999) {
        lerpedX.current = mouseX.current;
        lerpedY.current = height * 0.65; // Comienza desde el nivel del agua
        prevMx.current = mouseX.current;
        // Reseteamos el temporizador de ataque sorpresa al entrar por primera vez para evitar ataques instantáneos
        nextAttackTime.current = t + 7.0 + Math.random() * 15.0;
      } else {
        // Persecución lateral ultra lenta
        lerpedX.current += (mouseX.current - lerpedX.current) * 0.0055;

        // Transición suave del factor de ataque sorpresa (sube a Y=-20px y se hace fino súper despacio)
        if (isAttacking.current) {
          // Crece y se afina de forma extremadamente lenta (factor 0.0028) para verse cómo lucha majestuosamente por subir
          attackFactor.current += (1.0 - attackFactor.current) * 0.0028;
        } else {
          // Retorna al estado normal de marea suave de forma lenta y noble (factor 0.006)
          attackFactor.current += (0.0 - attackFactor.current) * 0.006;
        }

        // Persecución vertical majestuosa:
        // Clampeamos Y: En modo normal máximo hasta Y=50px. 
        // A medida que el ataque sorpresa entra (attackFactor -> 1.0), el agua puede estirarse hasta Y=-20px.
        const minYLimit = 50 - 70 * attackFactor.current;
        const targetY = Math.max(minYLimit, Math.min(height, mouseY.current));
        const diffY = targetY - lerpedY.current;

        // Velocidad vertical: en ataque "sufre" cayendo de inmediato a un paso ultra-lento de 0.13 por frame
        const maxVerticalSpeed = isAttacking.current ? 0.13 : 0.55;
        const stepY = Math.max(-maxVerticalSpeed, Math.min(maxVerticalSpeed, diffY * 0.025));
        lerpedY.current += stepY;

        // Velocidad horizontal suavizada (Filtro paso bajo)
        const rawSpeed = lerpedX.current - prevMx.current;
        smoothedSpeedX.current += (rawSpeed - smoothedSpeedX.current) * 0.08;
        prevMx.current = lerpedX.current;
      }
    }

    const mx = lerpedX.current;
    const my = lerpedY.current;

    // A) Transición fluida del factor de absorción (remolino) para evitar saltos
    if (isAbsorbed.current) {
      absorptionFactor.current += (1.0 - absorptionFactor.current) * 0.22;
      isAttacking.current = false;
    } else {
      absorptionFactor.current += (0.0 - absorptionFactor.current) * 0.008;
    }

    // B) Máquina de estados del ataque sorpresa - SOLO si el ratón está por encima de la línea de reposo (mouseY.current < height * 0.65)
    if (mouseX.current !== -9999 && !isAbsorbed.current && mouseY.current < height * 0.65) {
      if (t > nextAttackTime.current) {
        if (!isAttacking.current) {
          isAttacking.current = true;
          nextAttackTime.current = t + 7.0; // El ataque dura 7.0 segundos (estiramiento y retracción lentos)
        } else {
          isAttacking.current = false;
          // Re-programamos el siguiente ataque entre 7 y 25 segundos
          nextAttackTime.current = t + 7.0 + Math.random() * 18.0;
        }
      }
    }

    // 1. Dibujar y actualizar partículas en el Canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        if (particlesRef.current.length > 0) {
          particlesRef.current = particlesRef.current
            .map((p) => {
              const nextX = p.x + p.vx;
              const nextY = p.y + p.vy;
              const nextVy = p.vy + 0.22;
              const nextAlpha = p.alpha - 0.024;

              ctx.save();
              ctx.beginPath();
              ctx.arc(nextX, nextY, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = Math.max(0, nextAlpha);
              ctx.shadowBlur = 6;
              ctx.shadowColor = p.color;
              ctx.fill();
              ctx.restore();

              return { ...p, x: nextX, y: nextY, vy: nextVy, alpha: nextAlpha };
            })
            .filter((p) => p.alpha > 0);
        }
      }
    }

    // 2. Detectar colisión - SOLO si está en ataque y por encima del nivel de reposo (mouseY.current < height * 0.65)
    if (mouseX.current >= 0 && mouseY.current >= 0 && mouseX.current <= width && !isAbsorbed.current && !absorptionCooldown.current && isAttacking.current && mouseY.current < height * 0.65) {
      const progress = mx / width;
      const baseFreq = 1.6 * (width / 200);
      const ampMod = 0.45 + 0.55 * Math.sin(progress * Math.PI * 0.77 * baseFreq + t * 0.25 * -1);
      const phaseMod = Math.cos(progress * Math.PI * 1.414 * baseFreq + t * 0.45 * -1);
      const spatial = Math.sin(progress * Math.PI * 2 * baseFreq + phaseMod + phaseSeeds[3] * 5 * 1.618);
      const temporal = Math.cos(t * 1.0 * 1.8 + progress * Math.PI * 2.37 * 5.13 + phaseSeeds[3] * 7 * 0.77);

      const wave4Surface = (height * 0.65) + (20 * ampMod * spatial * temporal);

      // 3. Calcular la altura visual real de la punta del tentáculo dibujada en pantalla (con attackFactor)
      const dist = Math.sqrt(Math.pow(mouseX.current - mx, 2) + Math.pow(mouseY.current - my, 2));
      const proximity = Math.max(0, Math.min(1, 1 - dist / 280));
      let pullScale = (0.12 + 0.83 * proximity) * (1 - absorptionFactor.current);
      
      // Aplicamos el attackFactor analógico
      pullScale = Math.min(1.0, pullScale * (1 + 0.35 * attackFactor.current));

      let targetPull = (my - wave4Surface) * pullScale;
      if (targetPull > 0) targetPull = 0;
      const wavePeakY = wave4Surface + targetPull;

      // SUMA DE CRESTAS:
      const isCrestSwell = wave4Surface < height * 0.62;
      let reachDistance = isCrestSwell ? 12 : 5;

      // MODO ATAQUE: Agrega 25px adicionales de rango según el attackFactor analógico
      reachDistance += 25 * attackFactor.current;

      // Colisión real: tiene que estar "encima encima" de la punta física
      if (wavePeakY - mouseY.current <= reachDistance) {
        isAbsorbed.current = true;
        absorptionCooldown.current = true;
        isAttacking.current = false; // Cancela ataque
        // Reprograma el próximo ataque en el futuro para evitar repeticiones consecutivas
        nextAttackTime.current = t + 7.0 + Math.random() * 18.0;

        // Disparar explosión líquida en Canvas
        const burst: any[] = [];
        const colors = ['#38bdf8', '#0A7EC8', '#0f4080', '#60a5fa', '#a5f3fc'];
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3.0 + Math.random() * 7.0;
          burst.push({
            x: mx,
            y: my,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3.5,
            radius: 1.5 + Math.random() * 4.0,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1.0
          });
        }
        particlesRef.current = burst;

        // Ocultar el cursor
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'none';
        }

        // Devolver cursor tras 1 segundo
        setTimeout(() => {
          isAbsorbed.current = false;
          if (typeof document !== 'undefined') {
            document.body.style.cursor = '';
          }

          // Cooldown de 1.8 segundos
          setTimeout(() => {
            absorptionCooldown.current = false;
          }, 1800);
        }, 1000);
      }
    }

    // Renderizar olas con los parámetros físicos e interpolaciones calculadas
    path1.set(
      generateWavePath(width, height, segments, height * 0.40, [10, 4], [1, 2], [0.4, 0.7], t, phaseSeeds[0], mx, my, mouseX.current, mouseY.current, smoothedSpeedX.current, absorptionFactor.current, attackFactor.current)
    );
    path2.set(
      generateWavePath(width, height, segments, height * 0.48, [13, 5], [1.2, 2.4], [0.6, 0.9], t, phaseSeeds[1], mx, my, mouseX.current, mouseY.current, smoothedSpeedX.current, absorptionFactor.current, attackFactor.current)
    );
    path3.set(
      generateWavePath(width, height, segments, height * 0.56, [16, 6], [1.4, 2.8], [0.8, 1.2], t, phaseSeeds[2], mx, my, mouseX.current, mouseY.current, smoothedSpeedX.current, absorptionFactor.current, attackFactor.current)
    );
    path4.set(
      generateWavePath(width, height, segments, height * 0.65, [20, 7], [1.6, 3.2], [1.0, 1.5], t, phaseSeeds[3], mx, my, mouseX.current, mouseY.current, smoothedSpeedX.current, absorptionFactor.current, attackFactor.current)
    );
  });

  return (
    <div
      ref={containerRef}
      className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 h-[140px] overflow-visible pointer-events-auto mt-20"
      style={{
        background: 'transparent',
      }}
    >
      {/* Lienzo SVG para el oleaje continuo de alto rendimiento */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {/* Ola 1 - Azul Cobalto Claro */}
        <motion.path d={path1} fill="#0A7EC8" fillOpacity="0.3" />

        {/* Ola 2 - Azul Náutico Intermedio */}
        <motion.path d={path2} fill="#0f4080" fillOpacity="0.55" />

        {/* Ola 3 - Azul Real Intenso */}
        <motion.path d={path3} fill="#1e40af" fillOpacity="0.75" />

        {/* Ola 4 - Azul Oscuro Profundo (Base Footer) */}
        <motion.path d={path4} fill="#0D2137" fillOpacity="0.99" />
      </svg>

      {/* Lienzo Canvas Overlay para las partículas de explosión */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none z-20 overflow-visible"
      />
    </div>
  );
}
