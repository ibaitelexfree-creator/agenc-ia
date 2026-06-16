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
    scrollEnd: 0.10,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 0,
  },
  {
    id: 's1-to-s2',
    sectionIndex: 1,
    canvasX: '0vw',
    canvasY: '-100vh',
    scrollStart: 0.10,
    scrollEnd: 0.23,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 90,
  },
  {
    id: 's2-to-s3',
    sectionIndex: 2,
    canvasX: '0vw',
    canvasY: '-200vh',
    scrollStart: 0.23,
    scrollEnd: 0.36,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 180,
  },
  {
    id: 's3-to-s4',
    sectionIndex: 3,
    canvasX: '0vw',
    canvasY: '-300vh',
    scrollStart: 0.36,
    scrollEnd: 0.49,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 270,
  },
  {
    id: 's4-to-s5',
    sectionIndex: 4,
    canvasX: '0vw',
    canvasY: '-400vh',
    scrollStart: 0.49,
    scrollEnd: 0.62,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 360,
  },
  {
    id: 's5-to-reviews',
    sectionIndex: 5,
    canvasX: '0vw',
    canvasY: '-500vh',
    scrollStart: 0.62,
    scrollEnd: 0.75,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 450,
  },
  {
    id: 'reviews-to-blog',
    sectionIndex: 6,
    canvasX: '0vw',
    canvasY: '-600vh',
    scrollStart: 0.75,
    scrollEnd: 0.88,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 540,
  },
  {
    id: 'blog-to-cta',
    sectionIndex: 7,
    canvasX: '0vw',
    canvasY: '-700vh',
    scrollStart: 0.88,
    scrollEnd: 1.0,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 630,
  },
]

export const TOTAL_SCROLL_HEIGHT_VH = 1100
export const MOBILE_BREAKPOINT_PX = 768
