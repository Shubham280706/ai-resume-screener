'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Brain, Lightning, LockSimple, ChartBar, UsersThree } from '@phosphor-icons/react';
import SpotlightCard from './SpotlightCard';

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning evaluates resumes against job requirements with precision.',
    icon: <Brain className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
  {
    title: 'Lightning Fast',
    description: 'Analyze hundreds of resumes in minutes, not days. Save weeks of recruiting time.',
    icon: <Lightning className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
  {
    title: 'Fair & Unbiased',
    description: 'Blind screening features remove demographic bias from the evaluation process.',
    icon: <CheckCircle className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
  {
    title: 'Enterprise Security',
    description: 'SOC 2 certified with end-to-end encryption and GDPR compliant data handling.',
    icon: <LockSimple className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
  {
    title: 'Detailed Insights',
    description: 'Get comprehensive match scores, skill gaps, and interview focus areas instantly.',
    icon: <ChartBar className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
  {
    title: 'Team Collaboration',
    description: 'Share candidate profiles, notes, and hiring decisions seamlessly with your team.',
    icon: <UsersThree className="w-8 h-8 text-[#007AFF]" weight="fill" />,
  },
];

export default function Features() {
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
    <section ref={sectionRef} id="features" className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#007AFF', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '10px' }}>
            Capabilities
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: '700', letterSpacing: '-0.035em', color: '#fafafa', marginBottom: '12px' }}>
            Powerful Features
          </h2>
          <p style={{ fontSize: '15px', color: '#52525b', lineHeight: '1.65', maxWidth: '520px', margin: 0 }}>
            Everything you need to streamline your hiring process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <SpotlightCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
