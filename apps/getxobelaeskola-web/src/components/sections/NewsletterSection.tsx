'use client'

import React from 'react'
import Newsletter from '@/components/shared/Newsletter'

export default function NewsletterSection({ locale = 'es' }: { locale?: string }) {
  return (
    <div
      style={{
        gridArea: 'newsletter',
        minHeight: 'clamp(380px, 50vh, 700px)',
        padding: 'clamp(2rem, 5vh, 6rem) 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#001B3A',
        position: 'relative',
        zIndex: 10,
        width: '100%',
      }}
    >
      <div className="w-full max-w-[95%] sm:max-w-[92%] xl:max-w-[85%] px-3 sm:px-6">
        <Newsletter locale={locale} />
      </div>
    </div>
  )
}
