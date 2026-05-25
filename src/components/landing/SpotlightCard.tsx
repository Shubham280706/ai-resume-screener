'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface SpotlightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SpotlightCard({ title, description, icon }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(-50);
    y.set(-50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-6 rounded-xl bg-[#0d0d10] border border-[#1a1a1f] overflow-hidden group cursor-pointer"
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute w-40 h-40 rounded-full bg-[#007AFF]/20 blur-3xl"
        style={{
          x: x,
          y: y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 text-3xl">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
}
