'use client';

import { motion } from 'framer-motion';
import Typewriter from './Typewriter';
import MagneticButton from './MagneticButton';
import CountUpStat from './CountUpStat';
import CandidateFeed from './CandidateFeed';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
        {/* Left Column - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Screen 100 resumes in <Typewriter />
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            TalentLens uses AI to automatically analyze candidates, score them fairly, and
            give you the insights you need to make confident hiring decisions.
          </p>

          <div className="mb-12">
            <MagneticButton />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8">
            <CountUpStat target={1000} label="Resumes Scanned" suffix="+" />
            <CountUpStat target={95} label="Match Accuracy" suffix="%" />
          </div>
        </motion.div>

        {/* Right Column - Candidate Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CandidateFeed />
        </motion.div>
      </div>
    </section>
  );
}
