export type ScrollStep = {
  id: string
  sectionIndex: number
  canvasX: string
  canvasY: string
  scrollStart: number
  scrollEnd: number
  prowRotation: number
  prowLabel: 'down' | 'right' | 'down2' | 'left' | 'down3'
  compassAngle: number
}

export const SCROLL_MAP: ScrollStep[] = [
  {
    id: 's1-hero',
    sectionIndex: 0,
    canvasX: '0vw',
    canvasY: '0vh',
    scrollStart: 0,
    scrollEnd: 0.12,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 0,
  },
  {
    id: 's1-to-s2',
    sectionIndex: 1,
    canvasX: '0vw',
    canvasY: '-100vh',
    scrollStart: 0.12,
    scrollEnd: 0.40,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 90,
  },
  {
    id: 's2-to-s3',
    sectionIndex: 2,
    canvasX: '0vw',
    canvasY: '-200vh',
    scrollStart: 0.40,
    scrollEnd: 0.78,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 180,
  },
  {
    id: 's3-to-s4',
    sectionIndex: 3,
    canvasX: '0vw',
    canvasY: '-300vh',
    scrollStart: 0.78,
    scrollEnd: 0.92,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 270,
  },
  {
    id: 's4-to-cta',
    sectionIndex: 4,
    canvasX: '0vw',
    canvasY: '-400vh',
    scrollStart: 0.92,
    scrollEnd: 1.0,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 360,
  },
]

export const TOTAL_SCROLL_HEIGHT_VH = 650
export const MOBILE_BREAKPOINT_PX = 768
