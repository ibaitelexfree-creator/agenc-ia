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
        className="scroll-engine-root"
        ref={engine.containerRef}
      >
        <div className="scroll-engine-inner">
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  )
}
