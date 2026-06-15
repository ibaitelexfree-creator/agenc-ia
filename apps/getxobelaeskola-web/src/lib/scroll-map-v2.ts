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
    scrollEnd: 0.28,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 90,
  },
  {
    id: 's2-to-s3',
    sectionIndex: 2,
    canvasX: '0vw',
    canvasY: '-200vh',
    scrollStart: 0.28,
    scrollEnd: 0.44,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 180,
  },
  {
    id: 's3-to-s4',
    sectionIndex: 3,
    canvasX: '0vw',
    canvasY: '-300vh',
    scrollStart: 0.44,
    scrollEnd: 0.60,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 270,
  },
  {
    id: 's4-to-reviews',
    sectionIndex: 4,
    canvasX: '0vw',
    canvasY: '-400vh',
    scrollStart: 0.60,
    scrollEnd: 0.76,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 360,
  },
  {
    id: 'reviews-to-blog',
    sectionIndex: 5,
    canvasX: '0vw',
    canvasY: '-500vh',
    scrollStart: 0.76,
    scrollEnd: 0.92,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 450,
  },
  {
    id: 'blog-to-cta',
    sectionIndex: 6,
    canvasX: '0vw',
    canvasY: '-600vh',
    scrollStart: 0.92,
    scrollEnd: 1.0,
    prowRotation: 0,
    prowLabel: 'down',
    compassAngle: 540,
  },
]

export const TOTAL_SCROLL_HEIGHT_VH = 950
export const MOBILE_BREAKPOINT_PX = 768
