import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, GitBranch, Database, Network, Activity, Cpu } from 'lucide-react';

interface HeroProps { id: string; }

const STATS = [
  { label: 'Algorithms', value: '20+' },
  { label: 'Structures',  value: '10'  },
  { label: 'Latency',     value: '12ms' },
  { label: 'Modules',     value: '9'   },
];

const CAROUSEL_CARDS = [
  { name: 'Arrays', desc: 'Contiguous Memory Blocks', icon: Layers, color: '#22D3EE', shadow: 'rgba(34,211,238,0.25)' },
  { name: 'Linked Lists', desc: 'Dynamic Chained Nodes', icon: GitBranch, color: '#A78BFA', shadow: 'rgba(167,139,250,0.25)' },
  { name: 'Stacks & Queues', desc: 'LIFO & FIFO Orders', icon: Database, color: '#F472B6', shadow: 'rgba(244,114,182,0.25)' },
  { name: 'Trees', desc: 'Hierarchical Decision Nodes', icon: Network, color: '#34D399', shadow: 'rgba(52,211,153,0.25)' },
  { name: 'Graphs', desc: 'Complex Node Networks', icon: Activity, color: '#FBBF24', shadow: 'rgba(251,191,36,0.25)' },
  { name: 'And many more...', desc: 'Hashing, Sorting, CPU...', icon: Cpu, color: '#60A5FA', shadow: 'rgba(96,165,250,0.25)' },
];

export const Hero = React.memo<HeroProps>(({ id }) => (
  <section
    id={id}
    className="min-h-screen w-full flex flex-col items-center justify-between relative overflow-hidden pt-16 pb-20"
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
    <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6 mt-6">
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
            fontSize: 'clamp(54px, 10vw, 100px)',
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
        Explore algorithms interactively.{' '}
        <span style={{ color: 'var(--text-muted)' }}>
          Visualize and customize data structures exactly how you want.
        </span>
      </motion.p>

      {/* Explicit Core Philosophy Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 py-4 rounded-2xl max-w-md border text-center relative overflow-hidden"
        style={{
          background: 'rgba(34,211,238,0.03)',
          borderColor: 'rgba(34,211,238,0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), 0 0 15px 0 rgba(34,211,238,0.05)',
        }}
      >
        {/* Decorative corner accent */}
        <div 
          className="absolute top-0 left-0 w-2 h-2" 
          style={{ borderTop: '2px solid #22D3EE', borderLeft: '2px solid #22D3EE' }} 
        />
        <div 
          className="absolute bottom-0 right-0 w-2 h-2" 
          style={{ borderBottom: '2px solid #22D3EE', borderRight: '2px solid #22D3EE' }} 
        />
        
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-[#22D3EE]">
          Core Mission
        </span>
        <p className="text-[13px] font-medium mt-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          "This platform is engineered to empower learners to visualize, manipulate, and master data structures & algorithms completely on their own terms."
        </p>
      </motion.div>

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

    {/* 3D Rotating Carousel */}
    <div 
      className="relative z-10 w-full flex items-center justify-center my-10"
      style={{
        perspective: '1200px',
        height: '240px',
      }}
    >
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        style={{
          width: '180px',
          height: '140px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {CAROUSEL_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const angle = idx * 60;
          return (
            <div
              key={card.name}
              className="absolute inset-0 rounded-2xl flex flex-col justify-between p-4 border transition-all duration-300"
              style={{
                background: 'var(--bg-elevated)',
                border: `1px solid var(--border-color)`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 16px 0 ${card.shadow}`,
                transform: `rotateY(${angle}deg) translateZ(240px)`,
                backfaceVisibility: 'visible',
              }}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="p-2.5 rounded-xl border"
                  style={{ 
                    background: `${card.color}10`, 
                    borderColor: `${card.color}30` 
                  }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <span className="text-[9px] font-mono tracking-wider text-muted opacity-40 uppercase">
                  M0{idx+1}
                </span>
              </div>
              <div className="text-left mt-2">
                <h3 
                  className="font-bold text-[14px] leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {card.name}
                </h3>
                <p 
                  className="text-[9px] font-mono mt-1 opacity-70 leading-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {card.desc}
                </p>
              </div>
              {/* Bottom glowing strip */}
              <div 
                className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                style={{ background: card.color, opacity: 0.6 }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>

    {/* Stats footer bar */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="w-full flex items-center justify-center gap-0 shrink-0"
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

