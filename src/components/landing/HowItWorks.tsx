'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Lightning, CheckCircle } from '@phosphor-icons/react';

const steps = [
  {
    number: '01',
    title: 'Upload Resumes',
    description: 'Bulk upload resumes and define your job requirements in plain language.',
    icon: <Upload className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
  {
    number: '02',
    title: 'AI Analyzes',
    description: 'nexhire evaluates each resume against your requirements using advanced AI.',
    icon: <Lightning className="w-8 h-8 text-[#007AFF]" weight="fill" />,
    highlight: true,
  },
  {
    number: '03',
    title: 'Review & Hire',
    description: 'Get ranked candidates with detailed insights and interview focus areas.',
    icon: <CheckCircle className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
];

export default function HowItWorks() {
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
    <section ref={sectionRef} id="how-it-works" className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#007AFF', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '10px' }}>
            Process
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: '700', letterSpacing: '-0.035em', color: '#fafafa', marginBottom: '12px' }}>
            How It Works
          </h2>
          <p style={{ fontSize: '15px', color: '#52525b', lineHeight: '1.65', maxWidth: '520px', margin: 0 }}>
            Three simple steps to smarter hiring
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <svg
            className="hidden md:block absolute top-20 left-0 w-full h-12"
            viewBox="0 0 1000 50"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="25" x2="1000" y2="25" stroke="#1a1a1f" strokeWidth="2" />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                background: step.highlight ? 'rgba(0,122,255,0.1)' : '#0d0d10',
                border: step.highlight ? '1px solid rgba(0,122,255,0.3)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '28px',
                position: 'relative',
              }}
            >
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#3f3f46' }}>{step.number}</span>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fafafa', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#52525b', margin: 0 }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
