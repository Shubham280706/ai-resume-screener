'use client'

import Sidebar from '@/components/Sidebar'
import HiringAssistant from '@/components/HiringAssistant'
import { Suspense } from 'react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#050507',
      }}
    >
      {/* Background layers - behind everything */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Layer 1 - Dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.2,
            maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
        
        {/* Layer 2 - Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 5%, rgba(0,122,255,0.4) 50%, transparent 95%)',
            zIndex: 2,
          }}
        />
      </div>

      {/* Sidebar - fixed width, never shrinks */}
      <div
        style={{
          width: '240px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Sidebar />
      </div>

      {/* Main content - takes all remaining space */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          zIndex: 1,
          minWidth: 0,
        }}
      >
        <Suspense>
          {children}
        </Suspense>
      </div>

      {/* Floating Hiring Assistant */}
      <HiringAssistant />
    </div>
  )
}
