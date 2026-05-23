'use client'

import Sidebar from '@/components/Sidebar'

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
        background: '#050810',
      }}
    >
      {/* Ambient glow - fixed behind everything */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(79,70,229,0.1), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Sidebar - fixed width, never shrinks */}
      <div
        style={{
          width: '260px',
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
        {children}
      </div>
    </div>
  )
}
