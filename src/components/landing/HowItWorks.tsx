'use client';

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
    description: 'TalentLens evaluates each resume against your requirements using advanced AI.',
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
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400">
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
            <line
              x1="0"
              y1="25"
              x2="1000"
              y2="25"
              stroke="#1a1a1f"
              strokeWidth="2"
            />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
              className={`relative p-8 rounded-xl border ${
                step.highlight
                  ? 'bg-[#007AFF]/10 border-[#007AFF]/30'
                  : 'bg-[#0d0d10] border-[#1a1a1f]'
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-4xl font-bold text-gray-600">{step.number}</span>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
