'use client'

import React from 'react'
import HomeStats from '@/components/shared/HomeStats'

export default function HomeStatsSection() {
  return (
    <div
      style={{
        gridArea: 'stats',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#001B3A',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="w-full max-w-4xl px-6">
        <HomeStats />
      </div>
    </div>
  )
}
