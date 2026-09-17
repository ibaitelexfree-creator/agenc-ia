'use client'

import React from 'react'

export type WaveBandVariant = 'animated-sync' | 'animated-organic' | 'static-gentle' | 'floating-overlay'

interface Section1To2WaveBandProps {
  variant?: WaveBandVariant
}

export function Section1To2WaveBand({ variant = 'animated-sync' }: Section1To2WaveBandProps) {
  if (variant === 'static-gentle') {
    return (
      <div 
        className="w-full relative z-20 pointer-events-none overflow-hidden select-none -mt-[1px] -mb-[1px] bg-[#0D2137]"
        style={{ height: 'clamp(44px, 7vh, 80px)' }}
      >
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="w-full h-full block"
        >
          <path 
            d="M0,35 Q360,65 720,35 T1440,35 L1440,95 Q1080,65 720,95 T0,95 Z" 
            fill="#F6F2EC" 
          />
        </svg>
      </div>
    )
  }

  if (variant === 'animated-organic') {
    return (
      <div 
        className="w-full relative z-20 pointer-events-none overflow-hidden select-none -mt-[1px] -mb-[1px] bg-[#0D2137]"
        style={{ height: 'clamp(46px, 7.5vh, 84px)' }}
      >
        <div className="wave-track flex w-[200%] h-full">
          <svg 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            className="w-1/2 h-full flex-shrink-0 block"
          >
            <path 
              d="M0,30 C240,60 480,10 720,35 C960,60 1200,10 1440,30 L1440,90 C1200,70 960,115 720,95 C480,70 240,115 0,90 Z" 
              fill="#F6F2EC" 
            />
          </svg>
          <svg 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            className="w-1/2 h-full flex-shrink-0 block"
          >
            <path 
              d="M0,30 C240,60 480,10 720,35 C960,60 1200,10 1440,30 L1440,90 C1200,70 960,115 720,95 C480,70 240,115 0,90 Z" 
              fill="#F6F2EC" 
            />
          </svg>
        </div>

        <style jsx>{`
          .wave-track {
            animation: waveSlide 16s linear infinite;
          }
          @keyframes waveSlide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .wave-track {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    )
  }

  if (variant === 'floating-overlay') {
    return (
      <div 
        className="w-full absolute left-0 right-0 top-0 z-30 pointer-events-none overflow-hidden select-none"
        style={{ height: 'clamp(48px, 7vh, 82px)', filter: 'drop-shadow(0 4px 12px rgba(0, 27, 58, 0.4))' }}
      >
        <div className="wave-track-floating flex w-[200%] h-full">
          <svg 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            className="w-1/2 h-full flex-shrink-0 block"
          >
            <path 
              d="M0,28 Q360,62 720,28 T1440,28 L1440,88 Q1080,54 720,88 T0,88 Z" 
              fill="#F6F2EC" 
            />
          </svg>
          <svg 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            className="w-1/2 h-full flex-shrink-0 block"
          >
            <path 
              d="M0,28 Q360,62 720,28 T1440,28 L1440,88 Q1080,54 720,88 T0,88 Z" 
              fill="#F6F2EC" 
            />
          </svg>
        </div>

        <style jsx>{`
          .wave-track-floating {
            animation: waveSlideFloat 20s linear infinite;
          }
          @keyframes waveSlideFloat {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .wave-track-floating {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div 
      className="w-full relative z-20 pointer-events-none overflow-hidden select-none -mt-[1px] -mb-[1px] bg-[#0D2137]"
      style={{ height: 'clamp(44px, 7vh, 80px)' }}
    >
      <div className="wave-track-sync flex w-[200%] h-full">
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="w-1/2 h-full flex-shrink-0 block"
        >
          <path 
            d="M0,32 Q360,68 720,32 T1440,32 L1440,92 Q1080,56 720,92 T0,92 Z" 
            fill="#F6F2EC" 
          />
        </svg>
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="w-1/2 h-full flex-shrink-0 block"
        >
          <path 
            d="M0,32 Q360,68 720,32 T1440,32 L1440,92 Q1080,56 720,92 T0,92 Z" 
            fill="#F6F2EC" 
          />
        </svg>
      </div>

      <style jsx>{`
        .wave-track-sync {
          animation: waveSlideSync 18s linear infinite;
        }
        @keyframes waveSlideSync {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wave-track-sync {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
