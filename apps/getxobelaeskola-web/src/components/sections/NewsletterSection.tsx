'use client'

import React from 'react'
import Newsletter from '@/components/shared/Newsletter'

export default function NewsletterSection({ locale = 'es' }: { locale?: string }) {
  return (
    <div
      style={{
        gridArea: 'newsletter',
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
        <Newsletter locale={locale} />
      </div>
    </div>
  )
}
