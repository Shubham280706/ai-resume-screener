'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from '@phosphor-icons/react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Hiring Manager, StartupXYZ',
    text: 'TalentLens cut our screening time in half. The AI insights are incredibly accurate and help us make better decisions faster.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of People, TechFlow',
    text: 'The best investment we made for our recruitment process. The match scoring is spot-on and saves us hours every week.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Recruiting Lead, DataSys',
    text: 'Finally a tool that understands what we need. The unbiased screening feature alone has transformed how we evaluate candidates.',
    rating: 5,
  },
];

export default function Testimonials() {
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
    <section ref={sectionRef} id="testimonials" className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#007AFF', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '10px' }}>
            Social Proof
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: '700', letterSpacing: '-0.035em', color: '#fafafa', marginBottom: '12px' }}>
            Loved by Recruiters
          </h2>
          <p style={{ fontSize: '15px', color: '#52525b', lineHeight: '1.65', maxWidth: '520px', margin: 0 }}>
            See what our customers have to say
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: '28px',
                borderRadius: '12px',
                background: '#0d0d10',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#f59e0b]" weight="fill" />
                ))}
              </div>

              <p style={{ fontSize: '15px', color: '#52525b', lineHeight: '1.6', marginBottom: '24px' }}>{testimonial.text}</p>

              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#fafafa', margin: 0 }}>{testimonial.name}</p>
                <p style={{ fontSize: '12px', color: '#52525b', margin: '4px 0 0 0' }}>{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
