'use client';

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
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to streamline your hiring process
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <SpotlightCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
