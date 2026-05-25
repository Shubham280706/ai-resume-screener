'use client';

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
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Recruiters
          </h2>
          <p className="text-lg text-gray-400">
            See what our customers have to say
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-8 rounded-xl bg-[#0d0d10] border border-[#1a1a1f]"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-[#f59e0b]"
                    weight="fill"
                  />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.text}</p>

              <div>
                <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
