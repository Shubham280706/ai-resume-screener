'use client';

import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import CountUpStat from './CountUpStat';
import CandidateFeed from './CandidateFeed';

export default function Hero() {
  return (
    <section className="relative z-10 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
        {/* Left Column - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Flag pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,122,255,0.08)',
              border: '1px solid rgba(0,122,255,0.2)',
              borderRadius: '100px',
              padding: '5px 16px',
              fontSize: '12px',
              color: 'rgba(0,122,255,0.9)',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#007AFF',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            AI-powered screening · Trusted by 500+ teams
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.25; }
              }
            `}</style>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#fafafa] mb-6 leading-tight">
            Find the right hire in <span className="text-[#007AFF]">seconds</span>
          </h1>
          <p className="text-lg text-[#52525b] mb-8 leading-relaxed">
            TalentLens uses AI to automatically analyze candidates, score them fairly, and
            give you the insights you need to make confident hiring decisions.
          </p>

          <div className="mb-12">
            <MagneticButton />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '32px', paddingTop: '28px' }}>
            {[
              { number: '1000', suffix: '+', label: 'Resumes Scanned' },
              { number: '95', suffix: '%', label: 'Match Accuracy' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  paddingRight: i < 1 ? '32px' : '0',
                  marginRight: i < 1 ? '32px' : '0',
                  borderRight: i < 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.04em', fontFamily: 'monospace', marginBottom: '3px' }}>
                  {stat.number}{stat.suffix}
                </div>
                <p style={{ fontSize: '11px', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Candidate Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CandidateFeed />
        </motion.div>
      </div>
    </section>
  );
}
