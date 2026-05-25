'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
      >
        <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: '700', letterSpacing: '-0.035em', color: '#fafafa', marginBottom: '16px' }}>
          Ready to transform your hiring?
        </h2>
        <p style={{ fontSize: '15px', color: '#52525b', lineHeight: '1.65', marginBottom: '32px' }}>
          Join hundreds of companies using NexHire to hire smarter, faster.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#0d0d10',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#fafafa',
                fontSize: '14px',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
              required
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#007AFF',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1), box-shadow 150ms cubic-bezier(0.23,1,0.32,1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#0071e3';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,122,255,0.35)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#007AFF';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.97) translateY(0)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
            >
              Get Started Free
            </button>
          </div>
        </form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: '14px', color: '#10b981', marginBottom: '8px' }}
          >
            ✓ Check your email to get started
          </motion.p>
        )}

        <p style={{ fontSize: '12px', color: '#52525b', margin: 0 }}>
          No credit card required. 14-day free trial for all plans.
        </p>
      </motion.div>
    </section>
  );
}
