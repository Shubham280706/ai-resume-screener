'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$99',
    billing: '/month',
    description: 'Perfect for small teams just getting started',
    features: [
      'Analyze up to 50 resumes/month',
      'Basic skill matching',
      'Email support',
      '1 job board',
      'Standard reports',
    ],
  },
  {
    name: 'Pro',
    price: '$299',
    billing: '/month',
    description: 'Most popular for growing teams',
    features: [
      'Unlimited resume analysis',
      'Advanced AI insights',
      'Priority support',
      '5 job boards',
      'Custom workflows',
      'Team collaboration',
      'API access',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    billing: 'pricing',
    description: 'For large-scale hiring operations',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SSO & SAML',
      'SLA guarantees',
      'On-premise option',
      'White-label solution',
    ],
  },
];

export default function Pricing() {
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
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-400">
            Choose the plan that works for your team
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className={`p-8 rounded-xl border ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#007AFF]/20 to-[#0d0d10] border-[#007AFF]/30 ring-2 ring-[#007AFF]/20'
                  : 'bg-[#0d0d10] border-[#1a1a1f]'
              }`}
            >
              <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.billing}</span>
              </div>

              <Link
                href="/signup"
                className={`block w-full mb-8 py-2 px-4 rounded-lg font-medium transition-colors text-center ${
                  plan.highlight
                    ? 'bg-[#007AFF] text-white hover:bg-[#0066dd]'
                    : 'bg-[#1a1a1f] text-gray-300 hover:bg-[#252530]'
                }`}
              >
                Get Started
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" weight="fill" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
