'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';

const benefits = [
  'Reduce hiring time from weeks to days',
  'Eliminate unconscious bias in screening',
  'Find the best match candidates faster',
  'Build comprehensive skill profiles',
  'Make data-driven hiring decisions',
  'Improve your hiring team efficiency',
];

export default function DeepDive() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

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

  return (
    <section ref={sectionRef} className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: '700', letterSpacing: '-0.035em', color: '#fafafa', marginBottom: '32px' }}>
            Why Companies Choose nexhire
          </h2>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="flex gap-3 items-start"
              >
                <CheckCircle className="w-6 h-6 text-[#10b981] shrink-0 mt-1" weight="fill" />
                <span style={{ color: '#52525b', fontSize: '15px' }}>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            padding: '28px',
            borderRadius: '12px',
            background: 'linear-gradient(to bottom right, #0d0d10, #050507)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b', marginBottom: '12px' }}>
                Customer Story
              </p>
              <p style={{ fontSize: '16px', color: '#fafafa', fontWeight: '500' }}>
                "nexhire cut our hiring time by 70% and helped us find our best engineers"
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,122,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#007AFF' }}>JD</span>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#fafafa', margin: 0 }}>John Davis</p>
                <p style={{ fontSize: '12px', color: '#52525b', margin: '4px 0 0 0' }}>Head of Engineering, TechCorp</p>
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525b', marginBottom: '12px' }}>
                Impact
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: '0 0 4px 0' }}>70%</p>
                  <p style={{ fontSize: '12px', color: '#52525b', margin: 0 }}>Faster hiring</p>
                </div>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#007AFF', margin: '0 0 4px 0' }}>95%</p>
                  <p style={{ fontSize: '12px', color: '#52525b', margin: 0 }}>Match accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
