import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface ComplexityData {
  time: { best: string; avg: string; worst: string; };
  space: string;
  note?: string;
}

interface ComplexityHUDProps {
  data: ComplexityData;
  accent?: string;
}

const TIERS = [
  { key: 'best'  as const, label: 'Best (Ω)',  color: '#10B981' },
  { key: 'avg'   as const, label: 'Avg (Θ)',   color: 'var(--primary)' },
  { key: 'worst' as const, label: 'Worst (O)', color: '#F43F5E' },
];

export const ComplexityHUD: React.FC<ComplexityHUDProps> = ({ data, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-[var(--radius-lg)] overflow-hidden"
    style={{
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border-color)',
    }}
  >
    {/* Header */}
    <div
      className="flex items-center gap-2 px-4 py-2.5"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Activity
        size={11}
        style={{ color: accent || 'var(--primary)' }}
      />
      <span
        className="text-[9px] uppercase tracking-[0.18em]"
        style={{ color: accent || 'var(--primary)', fontFamily: 'var(--font-mono)' }}
      >
        Performance Analytics
      </span>
    </div>

    {/* Complexity grid */}
    <div className="grid grid-cols-3" style={{ borderColor: 'var(--border-color)' }}>
      {TIERS.map(({ key, label, color }, idx) => (
        <div
          key={key}
          className="px-3 py-3 flex flex-col gap-1.5"
          style={{ borderRight: idx < 2 ? '1px solid var(--border-color)' : 'none' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
            <span
              className="text-[8px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {label}
            </span>
          </div>
          <span
            className="text-sm font-bold font-mono"
            style={{ color }}
          >
            {data.time[key]}
          </span>
        </div>
      ))}
    </div>

    {/* Space row */}
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
      <span
        className="text-[9px] uppercase tracking-wider"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        Space
      </span>
      <span
        className="text-xs font-mono font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {data.space}
      </span>
    </div>

    {/* Note */}
    {data.note && (
      <div
        className="px-4 py-2.5 flex gap-2 items-start text-[10px] font-mono leading-relaxed"
        style={{
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ background: accent || 'var(--primary)' }} />
        {data.note}
      </div>
    )}
  </motion.div>
);
