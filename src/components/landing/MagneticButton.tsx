'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;

    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const strength = (1 - distance / maxDistance) * 20;
      x.set(mouseX * 0.2);
      y.set(mouseY * 0.2);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer"
    >
      <motion.button
        style={{ x, y }}
        className="px-8 py-3 bg-[#007AFF] text-white font-medium rounded-lg hover:bg-[#0066dd] transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
