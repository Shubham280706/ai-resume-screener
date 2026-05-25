'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const candidates = [
  { id: 1, name: 'Arjun Sharma', role: 'Senior React Dev', score: 92 },
  { id: 2, name: 'Priya Patel', role: 'Full Stack Engineer', score: 88 },
  { id: 3, name: 'Rajesh Kumar', role: 'DevOps Specialist', score: 85 },
  { id: 4, name: 'Ananya Singh', role: 'ML Engineer', score: 91 },
  { id: 5, name: 'Vikram Desai', role: 'Frontend Lead', score: 89 },
];

export default function CandidateFeed() {
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => {
        const newOrder = [...prev];
        const first = newOrder.shift();
        if (first !== undefined) newOrder.push(first);
        return newOrder;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10b981]';
    if (score >= 60) return 'text-[#f59e0b]';
    return 'text-[#f87171]';
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {order.map((idx) => {
          const candidate = candidates[idx];
          return (
            <motion.div
              key={candidate.id}
              layoutId={`candidate-${candidate.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-lg bg-[#0d0d10] border border-[#1a1a1f]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{candidate.name}</p>
                  <p className="text-xs text-gray-400">{candidate.role}</p>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                  {candidate.score}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
