'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpStatProps {
  target: number;
  label: string;
  suffix?: string;
}

export default function CountUpStat({ target, label, suffix = '' }: CountUpStatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      current += stepValue;
      step++;
      if (step >= steps) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, (duration * 1000) / steps);

    return () => clearInterval(interval);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-white mb-2">
        {count}
        {suffix}
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
