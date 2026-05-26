import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps { id: string; }

const STATS = [
  { label: 'Algorithms', value: '20+' },
  { label: 'Structures',  value: '10'  },
  { label: 'Latency',     value: '12ms' },
  { label: 'Modules',     value: '9'   },
];

export const Hero = React.memo<HeroProps>(({ id }) => (
  <section
    id={id}
    className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    style={{ background: 'var(--bg-primary)' }}
  >
    {/* Subtle grid */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    {/* Radial glow */}
    <div
      className="absolute pointer-events-none"
      style={{
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase" style={{ color: 'var(--text-secondary)' }}>
          System v3.0 — Online
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <h1
          className="leading-[0.88] font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 12vw, 120px)',
            color: 'var(--text-primary)',
            letterSpacing: '-3px',
          }}
        >
          Algo<span style={{ color: '#22D3EE' }}>Verse</span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-sm max-w-sm leading-relaxed"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
      >
        Algorithm visualization architecture.{' '}
        <span style={{ color: 'var(--text-muted)' }}>
          Precision engineering for data structures.
        </span>
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => document.getElementById('arrays')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-3 px-7 py-3 font-mono font-bold text-xs tracking-[0.12em] uppercase rounded-full transition-all"
        style={{
          background: 'rgba(34,211,238,0.1)',
          border: '1px solid rgba(34,211,238,0.35)',
          color: '#22D3EE',
        }}
      >
        Initialize
        <ArrowRight size={14} />
      </motion.button>
    </div>

    {/* Stats footer bar */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="absolute bottom-0 w-full flex items-center justify-center gap-0"
      style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="flex-1 flex flex-col items-center py-4 gap-0.5"
          style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--border-color)' : 'none' }}
        >
          <span
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {s.value}
          </span>
          <span
            className="text-[8px] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  </section>
));
