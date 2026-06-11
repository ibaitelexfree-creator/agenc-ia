import confetti from 'canvas-confetti';

export const lanzarConfetti = () => {
  // Primera ola — azul marino, coral, espuma de mar, tinta
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { y: 0.75 },
    colors: ['#0066CC', '#E8634A', '#E8F4FD', '#0A0A0A']
  });
  
  // Segunda ola — desde los lados (efecto olas de la ría)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.75 },
      colors: ['#0066CC', '#E8F4FD']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.75 },
      colors: ['#E8634A', '#0A0A0A']
    });
  }, 250);
};
