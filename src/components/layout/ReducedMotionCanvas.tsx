'use client'

// Este componente reemplaza Canvas.tsx + ScrollEngine.tsx cuando
// el usuario prefiere sin movimiento.
// Las secciones se apilan verticalmente y se navega con scroll normal.

import React from 'react'

export function ReducedMotionCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
      }}
    >
      {children}
    </div>
  )
}
