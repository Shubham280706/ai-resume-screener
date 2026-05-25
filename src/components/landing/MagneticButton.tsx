'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

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
      x.set(mouseX * 0.2);
      y.set(mouseY * 0.2);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
      className="relative cursor-pointer"
    >
      <motion.button
        style={{
          x,
          y,
          background: '#007AFF',
          boxShadow: isHovering ? '0 8px 25px rgba(0,122,255,0.35)' : '0 0 0 rgba(0,122,255,0)',
        }}
        className="px-8 py-3 text-white font-medium rounded-lg"
        whileHover={{ y: -2, background: '#0071e3' }}
        whileTap={{ scale: 0.97, y: 0 }}
        transition={{ background: { duration: 0.15 }, default: { duration: 0.15 } }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
