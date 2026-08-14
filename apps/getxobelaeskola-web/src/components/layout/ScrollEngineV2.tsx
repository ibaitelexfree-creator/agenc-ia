'use client'

import React from 'react'
import { useScrollEngineV2 } from '@/hooks/useScrollEngineV2'
import { TOTAL_SCROLL_HEIGHT_VH } from '@/lib/scroll-map-v2'
import { ScrollContext } from './ScrollEngine'

export function ScrollEngineV2({ children }: { children: React.ReactNode }) {
  const engine = useScrollEngineV2()

  return (
    <ScrollContext.Provider value={engine}>
      <div
        ref={engine.containerRef}
        style={{ height: `${TOTAL_SCROLL_HEIGHT_VH}vh` }}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  )
}
