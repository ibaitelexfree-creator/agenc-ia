interface WavePoint {
  x: number;
  y: number;
}

export function generateWavePath(
  width: number,
  segments: number,
  baseline: number,
  amplitudes: number[],
  frequencies: number[],
  speeds: number[],
  t: number,
  phaseSeed: number,
  tiltAmplitude: number,
  tiltDirection: number
): string {
  const points: WavePoint[] = [];
  const step = width / segments;
  const freqScale = width / 220; // Keep wave length constant

  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const progress = x / width;
    let y = baseline;

    for (let layer = 0; layer < amplitudes.length; layer++) {
      const dir = layer % 2 === 0 ? 1 : -1;
      y +=
        amplitudes[layer] *
        Math.sin(
          progress * Math.PI * 2 * (frequencies[layer] * freqScale) +
            t * speeds[layer] * dir +
            phaseSeed * (layer + 1) * 1.618
        );
    }

    // Inclinación hacia el cursor: el lado más próximo al ratón sube un poco.
    y += tiltAmplitude * (progress - 0.5) * tiltDirection;

    points.push({ x, y });
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }

  const last = points[points.length - 1];
  // Cierra el path muy por debajo del viewBox: el botón (overflow-hidden) recorta el resto.
  d += ` L ${width.toFixed(2)} ${(last.y + 300).toFixed(2)}`;
  d += ` L 0 ${(points[0].y + 300).toFixed(2)} Z`;

  return d;
}
