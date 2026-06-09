export type ScrollStep = {
  id: string
  sectionIndex: number          // qué sección se ve (0=S1, 1=S2, 2=S3, 3=S4, 4=CTA)
  canvasX: string               // translateX del canvas (en unidades CSS, e.g. '0vw', '-100vw')
  canvasY: string               // translateY del canvas
  scrollStart: number           // 0.0 → 1.0 en scrollYProgress
  scrollEnd: number             // 0.0 → 1.0 en scrollYProgress
  prowRotation: number          // grados de rotación de la proa (0 = abajo, -20 = derecha, 20 = izquierda)
  prowLabel: 'down' | 'right' | 'down2' | 'left' | 'down3'
  compassAngle: number          // grados del indicador brújula
}

export const SCROLL_MAP: ScrollStep[] = [
  {
    id: 's1-hero',
    sectionIndex: 0,
    canvasX: '0vw',
    canvasY: '0vh',
    scrollStart: 0,
    scrollEnd: 0.2,
    prowRotation: 0,
    prowLabel: 'right',
    compassAngle: 0,
  },
  {
    id: 's1-to-s2',          // transición: scroll derecha hacia S2
    sectionIndex: 1,
    canvasX: '-100vw',
    canvasY: '0vh',
    scrollStart: 0.2,
    scrollEnd: 0.54,
    prowRotation: -20,
    prowLabel: 'down',
    compassAngle: 90,
  },
  {
    id: 's2-to-s3',          // transición: scroll hacia abajo hacia S3
    sectionIndex: 2,
    canvasX: '-100vw',
    canvasY: '-100vh',
    scrollStart: 0.54,
    scrollEnd: 0.66,
    prowRotation: 0,
    prowLabel: 'left',
    compassAngle: 180,
  },
  {
    id: 's3-to-s4',          // transición: scroll izquierda hacia S4
    sectionIndex: 3,
    canvasX: '0vw',
    canvasY: '-100vh',
    scrollStart: 0.66,
    scrollEnd: 0.8,
    prowRotation: 20,
    prowLabel: 'down3',
    compassAngle: 270,
  },
  {
    id: 's4-to-cta',         // transición: scroll hacia abajo hacia CTA
    sectionIndex: 4,
    canvasX: '0vw',
    canvasY: '-200vh',
    scrollStart: 0.8,
    scrollEnd: 1.0,
    prowRotation: 0,
    prowLabel: 'down3',
    compassAngle: 360,
  },
]

// Altura total del scroll ficticio en vh
export const TOTAL_SCROLL_HEIGHT_VH = 500

// Breakpoint para lógica condicional
export const MOBILE_BREAKPOINT_PX = 768
