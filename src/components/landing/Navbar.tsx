'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050507]/80 backdrop-blur-md border-b border-[#0d0d10]'
          : 'bg-transparent'
      }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-5xl font-bold text-white flex items-center gap-2">
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#007AFF',
              boxShadow: '0 0 0 3px rgba(0,122,255,0.15)',
            }}
          />
          nexhire
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
          {['Features', 'How it Works', 'Pricing', 'Testimonials'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Link
            href="/login"
            style={{
              fontSize: '14px',
              background: 'transparent',
              border: '1px solid #27272a',
              color: '#71717a',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'border-color 150ms cubic-bezier(0.23,1,0.32,1), color 150ms cubic-bezier(0.23,1,0.32,1), background 150ms cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#52525b';
              (e.currentTarget as HTMLElement).style.color = '#a1a1aa';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#27272a';
              (e.currentTarget as HTMLElement).style.color = '#71717a';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            style={{
              fontSize: '14px',
              background: '#007AFF',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1), box-shadow 150ms cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#0071e3';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,122,255,0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#007AFF';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
