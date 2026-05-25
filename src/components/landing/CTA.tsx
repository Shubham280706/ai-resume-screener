'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to transform your hiring?
        </h2>
        <p className="text-lg text-gray-400 mb-10">
          Join hundreds of companies using TalentLens to hire smarter, faster.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 rounded-lg bg-[#0d0d10] border border-[#1a1a1f] text-white placeholder-gray-500 focus:outline-none focus:border-[#007AFF]"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-[#007AFF] text-white font-medium rounded-lg hover:bg-[#0066dd] transition-colors"
          >
            Get Started Free
          </button>
        </form>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-[#10b981]"
          >
            ✓ Check your email to get started
          </motion.p>
        )}

        <p className="text-xs text-gray-500">
          No credit card required. 14-day free trial for all plans.
        </p>
      </motion.div>
    </section>
  );
}
