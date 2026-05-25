'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const candidates = [
  { id: 1, name: 'Priya Raghavan', meta: 'Bangalore · 6y', score: 94, status: 'Shortlisted', gradient: 'linear-gradient(135deg,#059669,#34d399)' },
  { id: 2, name: 'Arjun Khanna', meta: 'Mumbai · 5y', score: 88, status: 'Interview', gradient: 'linear-gradient(135deg,#b45309,#fbbf24)' },
  { id: 3, name: 'Maya Shah', meta: 'Delhi · 4y', score: 76, status: 'Reviewing', gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { id: 4, name: 'Dev Verma', meta: 'Pune · 7y', score: 64, status: 'New', gradient: 'linear-gradient(135deg,#0284c7,#38bdf8)' },
  { id: 5, name: 'Sana Nair', meta: 'Hyderabad · 2y', score: 42, status: 'Below bar', gradient: 'linear-gradient(135deg,#be185d,#fb7185)' },
];

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const getScoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#f87171';
};

const getStatusStyle = (status: string) => {
  const styles: Record<string, { bg: string; border: string; text: string }> = {
    Shortlisted: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
    Interview: { bg: 'rgba(0,122,255,0.1)', border: 'rgba(0,122,255,0.2)', text: '#007AFF' },
    Reviewing: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b' },
    New: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', text: '#52525b' },
    'Below bar': { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', text: '#f87171' },
  };
  return styles[status] || styles.New;
};

export default function CandidateFeed() {
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4]);
  const [animatedScores, setAnimatedScores] = useState<Record<number, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => {
        const newOrder = [...prev];
        const first = newOrder.shift();
        if (first !== undefined) newOrder.push(first);
        return newOrder;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    candidates.forEach((candidate) => {
      const timer = setTimeout(() => {
        setAnimatedScores(prev => ({ ...prev, [candidate.id]: candidate.score }));
      }, 100);
      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {order.map((idx) => {
          const candidate = candidates[idx];
          const statusStyle = getStatusStyle(candidate.status);
          const scoreColor = getScoreColor(candidate.score);
          const displayScore = animatedScores[candidate.id] || 0;

          return (
            <motion.div
              key={candidate.id}
              layoutId={`candidate-${candidate.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(13,13,16,0.8)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '12px 16px',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,122,255,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,122,255,0.05)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(13,13,16,0.8)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 140px 70px', alignItems: 'center', gap: '12px' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: candidate.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'white',
                  }}
                >
                  {getInitials(candidate.name)}
                </div>

                {/* Name + meta */}
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#e4e4e7', margin: 0 }}>{candidate.name}</p>
                  <p style={{ fontSize: '11px', color: '#3f3f46', margin: '2px 0 0 0' }}>{candidate.meta}</p>
                </div>

                {/* Score bar + number */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: scoreColor,
                        width: `${displayScore}%`,
                        borderRadius: '2px',
                        transition: 'width 800ms cubic-bezier(0.23,1,0.32,1)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: scoreColor, fontFamily: 'monospace', minWidth: '28px' }}>
                    {Math.round(displayScore)}
                  </span>
                </div>

                {/* Status badge */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    whiteSpace: 'nowrap',
                    background: statusStyle.bg,
                    border: `1px solid ${statusStyle.border}`,
                    color: statusStyle.text,
                  }}
                >
                  {candidate.status}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
