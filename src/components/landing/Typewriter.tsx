'use client';

import { useState, useEffect } from 'react';

const words = ['seconds', 'minutes', 'one pass'];

export default function Typewriter() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block">
      {words[wordIndex]}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .typewriter-cursor {
          animation: blink 1s infinite;
        }
      `}</style>
      <span className="typewriter-cursor">_</span>
    </span>
  );
}
