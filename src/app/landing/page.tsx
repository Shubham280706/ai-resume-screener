'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';

// Design tokens
const colors = {
  bg: '#050810',
  'bg-2': '#070b18',
  surface: '#0d1425',
  'surface-2': '#111a31',
  line: 'rgba(255,255,255,.07)',
  'line-strong': 'rgba(255,255,255,.12)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  'indigo-2': '#818cf8',
  'indigo-deep': '#4f46e5',
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
};

// Custom hooks
function useReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [shouldStart, setShouldStart] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldStart(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldStart) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(target * progress));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [shouldStart, target, duration]);

  return { ref, count };
}

// Navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 h-[72px] flex items-center px-8 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(5,8,16,0.72)] backdrop-blur-[18px] border-b'
          : 'bg-transparent'
      }`}
      style={scrolled ? { borderBottomColor: colors.line } : {}}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-[10px] h-[10px] rounded-full"
            style={{
              backgroundColor: colors.indigo,
              boxShadow: `0 0 20px ${colors.indigo}`,
            }}
          />
          <span className="font-semibold text-lg" style={{ color: colors.text }}>
            TalentLens
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8">
          {['Features', 'How it Works', 'Pricing', 'Reviews'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="transition-colors"
              style={{ color: colors.muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg btn-ghost"
            style={{
              color: colors.muted,
              border: `1px solid ${colors.line}`,
            }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 rounded-lg font-medium btn-primary"
            style={{
              backgroundColor: colors.indigo,
              color: 'white',
            }}
          >
            Start free trial
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Background orbs and grid
function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          backgroundPosition: '0 0',
          maskImage: 'radial-gradient(ellipse 120% 100% at 50% 0%, black, transparent 85%)',
          animation: 'gridDrift 30s linear infinite',
        }}
      />

      {/* Orbs */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: '520px',
          height: '520px',
          backgroundColor: colors['indigo-deep'],
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.25,
          animation: 'floatA 16s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: '380px',
          height: '380px',
          backgroundColor: '#7c3aed',
          top: '15%',
          left: '10%',
          opacity: 0.2,
          animation: 'floatB 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: '320px',
          height: '320px',
          backgroundColor: '#22d3ee',
          top: '50%',
          right: '5%',
          opacity: 0.18,
          animation: 'floatC 22s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes gridDrift {
          0% { background-position: 0 0; }
          100% { background-position: 56px 56px; }
        }
        @keyframes floatA {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(40px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(60px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(50px); }
        }
        @keyframes bobbing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px);
          border-color: #818cf8 !important;
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
        }

        .btn-primary {
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.3);
          filter: brightness(1.1);
        }
        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-ghost {
          transition: all 0.3s ease;
        }
        .btn-ghost:hover {
          background-color: rgba(99, 102, 241, 0.1);
          border-color: #818cf8 !important;
          color: #818cf8 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

// Reveal wrapper
function RevealSection({
  children,
  className = '',
  delay = 0,
  style = {},
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        animationName: isVisible ? 'fadeUp' : 'none',
        animationDuration: '0.6s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: `${delay}s`,
        opacity: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Hero section
function Hero() {
  return (
    <section className="relative pt-[80px] pb-[80px] px-8 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto text-center z-10 w-full">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.green }}
          />
          <span style={{ color: colors.text }} className="text-sm">
            AI-Powered Recruiting — Trusted by 500+ Companies
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-semibold mb-8 tracking-tight"
          style={{
            fontSize: '92px',
            lineHeight: '1.1',
            color: colors.text,
            maxWidth: '100%',
            margin: '0 auto 32px',
            display: 'block',
            width: '100%',
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>Stop reading resumes.</div>
          <div
            style={{
              background: `linear-gradient(to right, ${colors.text}, #b9bedb)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
            }}
          >
            Start hiring the best.
          </div>
        </h1>

        {/* Subtext */}
        <p className="text-xl mb-12 leading-relaxed max-w-2xl mx-auto" style={{ color: colors.muted }}>
          TalentLens scores, ranks, and explains every candidate in seconds —
          so your team interviews the right people, every time.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg font-medium flex items-center gap-2 btn-primary"
            style={{ backgroundColor: colors.indigo, color: 'white' }}
          >
            Start free trial →
          </Link>
          <button
            className="px-8 py-3 rounded-lg font-medium border flex items-center gap-2 btn-ghost"
            style={{ borderColor: colors.line, color: colors.text }}
          >
            ▶ Watch demo
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t"
          style={{ borderTopColor: colors.line }}
        >
          <StatCard label="10× Faster Screening" />
          <StatCard label="94% Match Accuracy" />
          <StatCard label="500+ Companies" />
          <StatCard label="2M+ Resumes Processed" />
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-20 relative">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label }: { label: string }) {
  return (
    <div className="text-center">
      <p style={{ color: colors.muted }} className="text-sm">
        {label}
      </p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div
      className="relative mx-auto max-w-5xl"
      style={{
        animation: 'bobbing 6s ease-in-out infinite',
      }}
    >
      {/* Glow */}
      <div
        className="absolute -inset-20 blur-3xl -z-10"
        style={{
          background: `radial-gradient(circle, ${colors.indigo}, transparent)`,
          opacity: 0.2,
        }}
      />

      {/* Browser window */}
      <div
        className="rounded-2xl border overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors['surface-2'],
          borderColor: colors['line-strong'],
        }}
      >
        {/* Chrome bar */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: colors.surface }}
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div
            className="flex-1 text-xs px-3 py-1 rounded"
            style={{ backgroundColor: colors.surface, color: colors.dim }}
          >
            app.talentlens.ai / dashboard
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-4 gap-4 p-6">
          {/* Sidebar */}
          <div
            className="col-span-1 border-r pr-4"
            style={{ borderRightColor: colors.line }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.indigo }}
              />
              <span className="text-xs font-semibold" style={{ color: colors.text }}>
                TL
              </span>
            </div>
            <nav className="space-y-2 text-xs">
              <div
                className="px-3 py-2 rounded"
                style={{
                  backgroundColor: colors.indigo,
                  color: 'white',
                }}
              >
                Dashboard
              </div>
              <div style={{ color: colors.muted }}>Jobs (12)</div>
              <div style={{ color: colors.muted }}>Candidates (248)</div>
              <div style={{ color: colors.muted }}>Analytics</div>
              <div style={{ color: colors.muted }}>Settings</div>
            </nav>
          </div>

          {/* Main area */}
          <div className="col-span-3">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
                Senior Frontend Engineer
              </h2>
              <p className="text-xs" style={{ color: colors.muted }}>
                248 applicants • Updated 2h ago
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <MetricCard title="Total Applied" value="248" change="+18" />
              <MetricCard title="Strong Match" value="34" change="+6" />
              <MetricCard title="Avg Score" value="76%" change="+3%" />
              <MetricCard title="Shortlisted" value="12" change="-2" />
            </div>

            {/* Table */}
            <div className="text-xs" style={{ color: colors.muted }}>
              <div className="grid grid-cols-5 gap-2 pb-3 border-b" style={{ borderBottomColor: colors.line }}>
                <div>Name</div>
                <div>City/Exp</div>
                <div>Score</div>
                <div>Seniority</div>
                <div>Status</div>
              </div>
              {[
                { name: 'Priya Raghavan', city: 'Bangalore • 6y', score: 94, seniority: 'Senior', status: 'Shortlisted', statusColor: colors.green },
                { name: 'Arjun Khanna', city: 'Mumbai • 5y', score: 88, seniority: 'Senior', status: 'Interview', statusColor: colors.amber },
                { name: 'Maya Shah', city: 'Delhi • 4y', score: 76, seniority: 'Mid', status: 'Reviewing', statusColor: colors.amber },
              ].map((row) => (
                <div key={row.name} className="grid grid-cols-5 gap-2 py-2">
                  <div style={{ color: colors.text }}>{row.name}</div>
                  <div>{row.city}</div>
                  <div>
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{
                        backgroundColor: colors.surface,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${row.score}%`,
                          height: '100%',
                          backgroundColor: colors.green,
                          animation: 'slideIn 1s ease-out',
                        }}
                      />
                    </div>
                  </div>
                  <div>{row.seniority}</div>
                  <div style={{ color: row.statusColor }}>{row.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
}

function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div
      className="p-3 rounded-lg border text-left"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.line,
      }}
    >
      <p className="text-xs" style={{ color: colors.muted }}>
        {title}
      </p>
      <p className="font-semibold" style={{ color: colors.text }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: colors.green }}>
        {change}
      </p>
    </div>
  );
}

// Social proof
function SocialProof() {
  const { ref, isVisible } = useReveal();
  return (
    <section ref={ref} className="py-16 px-8 relative z-10">
      <div className="max-w-6xl mx-auto flex items-center gap-8">
        <p style={{ color: colors.muted }} className="text-sm whitespace-nowrap">
          Trusted by hiring teams at
        </p>
        <div className="flex gap-8 flex-1 opacity-40">
          {['Northstack', 'Lumenly', 'Acrelane', 'Vector Labs', 'Stradia', 'Polygon HR'].map((company) => (
            <span key={company} style={{ color: colors.muted }} className="text-sm whitespace-nowrap">
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features
function Features() {
  return (
    <section id="features" className="py-20 px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <RevealSection delay={0}>
          <p style={{ color: colors.indigo }} className="text-xs uppercase font-mono tracking-widest mb-4">
            Features
          </p>
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-5xl font-semibold mb-16" style={{ color: colors.text }}>
            Everything you need to hire with confidence
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'AI Match Scoring', icon: '🧠' },
            { title: 'Bulk Upload', icon: '⚡' },
            { title: 'Smart Analytics', icon: '📊' },
            { title: 'Custom Criteria', icon: '🎯' },
            { title: 'One-click Outreach', icon: '✉️' },
            { title: 'ATS Integrations', icon: '🔌' },
          ].map((feature, i) => (
            <RevealSection
              key={feature.title}
              delay={0.1 + i * 0.1}
              className="p-6 rounded-2xl border group cursor-pointer card-hover"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
              }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 style={{ color: colors.text }}>{feature.title}</h3>
              <p className="text-sm mt-2" style={{ color: colors.muted }}>
                Streamline your hiring workflow with our powerful features.
              </p>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// How it works
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <RevealSection delay={0}>
          <p style={{ color: colors.indigo }} className="text-xs uppercase font-mono tracking-widest mb-4">
            Workflow
          </p>
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-5xl font-semibold mb-16" style={{ color: colors.text }}>
            Up and running in 3 steps
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div
            className="hidden md:block absolute top-16 left-0 right-0 h-px"
            style={{ backgroundColor: colors.line }}
          />

          {[
            {
              num: '01',
              label: 'Define',
              title: 'Post your job',
              desc: 'Paste a JD — TalentLens structures it into measurable requirements.',
            },
            {
              num: '02',
              label: 'Score',
              title: 'Upload resumes',
              desc: 'Bulk-drop PDFs and TalentLens parses every one, scoring it.',
              active: true,
            },
            {
              num: '03',
              label: 'Hire',
              title: 'Review top matches',
              desc: 'A ranked shortlist with AI explanations for every score.',
            },
          ].map((step, i) => (
            <RevealSection key={step.num} delay={0.1 + i * 0.15}>
              <div
                className="relative p-6 rounded-2xl border card-hover"
                style={{
                  backgroundColor: step.active ? 'rgba(99, 102, 241, 0.1)' : colors.surface,
                  borderColor: step.active ? colors.indigo : colors.line,
                }}
              >
                <div className="absolute -top-8 left-6 z-10">
                  <p
                    className="text-2xl font-mono font-bold"
                    style={{ color: colors.indigo }}
                  >
                    {step.num}
                  </p>
                </div>
                <p style={{ color: colors.muted }} className="text-sm mb-4 pt-4">
                  {step.label}
                </p>
                <h3 style={{ color: colors.text }} className="font-semibold mb-2">
                  {step.title}
                </h3>
                <p style={{ color: colors.muted }} className="text-sm">
                  {step.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Deep dive
function DeepDive() {
  return (
    <section className="py-20 px-8 relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <RevealSection delay={0}>
            <p style={{ color: colors.indigo }} className="text-xs uppercase font-mono tracking-widest mb-4">
              Explainable AI
            </p>
          </RevealSection>
          <RevealSection delay={0.1}>
            <h2 className="text-4xl font-semibold mb-6" style={{ color: colors.text }}>
              See exactly why every candidate was ranked
            </h2>
          </RevealSection>
          <RevealSection delay={0.2}>
            <p style={{ color: colors.muted }} className="mb-8">
              Our AI doesn't just score — it explains. See skill gaps, experience matching, and AI-generated summaries your hiring manager will actually read.
            </p>
          </RevealSection>

          <div className="space-y-4">
            {[
              'Skills gap analysis — see what\'s there, what\'s missing, what\'s adjacent.',
              'Experience level matching — auto-detects seniority from career trajectory.',
              'AI-written candidate summary — a one-paragraph brief your hiring manager will actually read.',
            ].map((item, i) => (
              <RevealSection key={i} delay={0.3 + i * 0.1}>
                <div className="flex gap-3">
                  <span style={{ color: colors.green }}>✓</span>
                  <p style={{ color: colors.muted }}>{item}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>

        {/* Right - Candidate card */}
        <RevealSection delay={0.1}>
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.line,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  background: `linear-gradient(135deg, ${colors.indigo}, #a855f7)`,
                }}
              >
                PR
              </div>
              <div className="flex-1">
                <p style={{ color: colors.text }} className="font-semibold">
                  Priya Raghavan
                </p>
                <p style={{ color: colors.muted }} className="text-sm">
                  Senior Frontend Engineer
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold"
                style={{
                  borderColor: colors.green,
                  color: colors.green,
                }}
              >
                92%
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <p style={{ color: colors.muted }} className="text-xs mb-2">
                Skills Matched
              </p>
              <div className="flex gap-2 flex-wrap">
                {['React', 'TypeScript', 'Node.js', 'Redux', 'GraphQL'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: `rgba(52, 211, 153, 0.1)`,
                      color: colors.green,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing skills */}
            <div className="mb-6">
              <p style={{ color: colors.muted }} className="text-xs mb-2">
                Skills Missing
              </p>
              <div className="flex gap-2">
                {['AWS', 'Docker'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs border"
                    style={{
                      borderColor: colors.red,
                      color: colors.red,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.indigo }}
                />
                <p style={{ color: colors.muted }} className="text-xs">
                  AI Summary
                </p>
              </div>
              <p style={{ color: colors.text }} className="text-sm">
                Priya is a highly skilled frontend engineer with 6 years of experience building scalable React applications. Strong in TypeScript and modern tooling.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium btn-primary"
                style={{
                  backgroundColor: colors.green,
                  color: 'white',
                }}
              >
                ✓ Shortlist
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium border btn-ghost"
                style={{
                  borderColor: colors.red,
                  color: colors.red,
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// Pricing
function Pricing() {
  return (
    <section id="pricing" className="py-20 px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <RevealSection delay={0}>
          <p style={{ color: colors.indigo }} className="text-xs uppercase font-mono tracking-widest mb-4 text-center">
            Pricing
          </p>
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-5xl font-semibold mb-16 text-center" style={{ color: colors.text }}>
            Simple, transparent pricing
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Basic',
              price: '₹8,000',
              features: [
                'Up to 5 active jobs',
                '200 resumes/month',
                'AI match scoring',
                'Email support',
              ],
            },
            {
              name: 'Pro',
              price: '₹18,000',
              popular: true,
              features: [
                'Up to 20 active jobs',
                '2,000 resumes/month',
                'Smart analytics & reporting',
                '2 ATS integrations',
                'Priority support',
              ],
            },
            {
              name: 'Enterprise',
              price: '₹35,000',
              features: [
                'Unlimited jobs & resumes',
                'Custom AI criteria & weights',
                'Unlimited ATS integrations',
                'SSO, audit log, SOC 2',
                'Dedicated account manager',
              ],
            },
          ].map((plan) => (
            <RevealSection
              key={plan.name}
              delay={0.1}
              className="relative p-8 rounded-2xl border group card-hover"
              style={{
                backgroundColor: plan.popular ? `rgba(99, 102, 241, 0.1)` : colors.surface,
                borderColor: plan.popular ? colors.indigo : colors.line,
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: colors.indigo,
                    color: 'white',
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3 style={{ color: colors.text }} className="text-xl font-semibold mb-2">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold mb-6" style={{ color: colors.indigo }}>
                {plan.price}
                <span style={{ color: colors.muted }} className="text-sm font-normal">
                  /mo
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm" style={{ color: colors.muted }}>
                    <span style={{ color: colors.green }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium ${plan.popular ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  backgroundColor: plan.popular ? colors.indigo : 'transparent',
                  color: plan.popular ? 'white' : colors.text,
                  border: plan.popular ? 'none' : `1px solid ${colors.line}`,
                }}
              >
                Start free trial
              </button>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials
function Testimonials() {
  return (
    <section id="reviews" className="py-20 px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <RevealSection delay={0}>
          <p style={{ color: colors.indigo }} className="text-xs uppercase font-mono tracking-widest mb-4 text-center">
            Reviews
          </p>
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-5xl font-semibold mb-16 text-center" style={{ color: colors.text }}>
            Loved by hiring teams across India
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: 'We went from 8 hours of screening to 30 minutes. TalentLens is a game-changer.',
              author: 'Sneha Rajan',
              role: 'HR Director',
              company: 'TechMahindra',
            },
            {
              quote: 'The match scoring is incredibly accurate. Our offer acceptance rate improved 40%.',
              author: 'Vikram Kumar',
              role: 'Talent Lead',
              company: 'Razorpay',
            },
            {
              quote: 'Our team was skeptical of "another AI tool." TalentLens won everyone over in the first week.',
              author: 'Neha Dubey',
              role: 'People Ops',
              company: 'Zepto',
            },
          ].map((testimonial, i) => (
            <RevealSection
              key={i}
              delay={0.1 + i * 0.1}
              className="p-8 rounded-2xl border card-hover"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.line,
              }}
            >
              <p className="text-2xl mb-6" style={{ color: colors.amber }}>
                ❝
              </p>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: colors.amber }}>
                    ★
                  </span>
                ))}
              </div>
              <p style={{ color: colors.text }} className="mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <p style={{ color: colors.text }} className="font-semibold">
                {testimonial.author}
              </p>
              <p style={{ color: colors.muted }} className="text-sm">
                {testimonial.role} · {testimonial.company}
              </p>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA
function FinalCTA() {
  return (
    <section className="py-20 px-8 relative z-10">
      <div
        className="max-w-2xl mx-auto p-12 rounded-2xl border relative overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.indigo,
          boxShadow: `0 0 50px rgba(99, 102, 241, 0.2)`,
        }}
      >
        <RevealSection delay={0} className="text-center">
          <h2 className="text-4xl font-semibold mb-4" style={{ color: colors.text }}>
            Start screening smarter today
          </h2>
          <p className="mb-8" style={{ color: colors.muted }}>
            Free 14-day trial. No credit card required. Cancel anytime.
          </p>

          <div className="flex gap-3 mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border"
              style={{
                backgroundColor: colors['surface-2'],
                borderColor: colors.line,
                color: colors.text,
              }}
            />
            <button
              className="px-8 py-3 rounded-lg font-medium btn-primary"
              style={{
                backgroundColor: colors.indigo,
                color: 'white',
              }}
            >
              Get started →
            </button>
          </div>

          <div className="flex justify-center gap-4 text-sm" style={{ color: colors.muted }}>
            <span>✓ Free 14-day trial</span>
            <span>✓ No credit card</span>
            <span>✓ Cancel anytime</span>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-8 border-t relative z-10" style={{ borderTopColor: colors.line }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.indigo }}
              />
              <span className="font-semibold" style={{ color: colors.text }}>
                TalentLens
              </span>
            </div>
            <p style={{ color: colors.muted }} className="text-sm">
              AI-powered resume screening for teams that hire on signal, not vibes.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'How it works', 'Changelog'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact'],
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Security', 'DPA'],
            },
          ].map((column) => (
            <div key={column.title}>
              <p style={{ color: colors.text }} className="font-semibold mb-3">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" style={{ color: colors.muted }} className="text-sm hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center"
          style={{ borderTopColor: colors.line }}
        >
          <p style={{ color: colors.muted }} className="text-sm">
            © 2026 TalentLens · Built with ♥ in India
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                style={{ color: colors.muted }}
                className="hover:text-white transition"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main page
export default function LandingPage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <Background />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <DeepDive />
        <Pricing />
        <Testimonials />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
