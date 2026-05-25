'use client';

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
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Why Companies Choose TalentLens
          </h2>

          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-4"
          >
            {benefits.map((benefit, i) => (
              <motion.li key={i} variants={itemVariants} className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0 mt-1" weight="fill" />
                <span className="text-gray-300">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
          className="p-8 rounded-xl bg-gradient-to-br from-[#0d0d10] to-[#050507] border border-[#1a1a1f]"
        >
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Customer Story</p>
              <p className="text-lg text-white font-medium">
                "TalentLens cut our hiring time by 70% and helped us find our best engineers"
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#007AFF]/20 flex items-center justify-center">
                <span className="text-lg font-bold text-[#007AFF]">JD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">John Davis</p>
                <p className="text-xs text-gray-400">Head of Engineering, TechCorp</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1a1f]">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Impact</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-[#10b981]">70%</p>
                  <p className="text-xs text-gray-400">Faster hiring</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#007AFF]">95%</p>
                  <p className="text-xs text-gray-400">Match accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
