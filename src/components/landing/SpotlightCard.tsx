'use client';

import { useRef, useState } from 'react';

interface SpotlightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
}

export default function SpotlightCard({ title, description, icon, index = 0 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !spotlightRef.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    spotlightRef.current?.style.setProperty('--cursor-x', `${mouseX}px`);
    spotlightRef.current?.style.setProperty('--cursor-y', `${mouseY}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        background: '#0d0d10',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 200ms cubic-bezier(0.23,1,0.32,1), background 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms cubic-bezier(0.23,1,0.32,1)',
        borderColor: isHovering ? 'rgba(0,122,255,0.25)' : 'rgba(255,255,255,0.07)',
        backgroundColor: isHovering ? 'rgba(0,122,255,0.03)' : '#0d0d10',
        transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovering ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,122,255,0.1)' : '0 0 0 rgba(0,0,0,0)',
      }}
    >
      {/* Spotlight effect */}
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(180px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(0,122,255,0.07), transparent 70%)`,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 200ms ease-out',
        } as React.CSSProperties}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: '16px', fontSize: '24px' }}>{icon}</div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fafafa', marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#52525b', margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}
