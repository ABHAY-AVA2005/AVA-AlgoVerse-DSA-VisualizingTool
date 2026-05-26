import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  index: string;
  accent?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, subtitle, icon: Icon, index, accent = 'var(--primary)'
}) => (
  <div className="relative pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
    {/* Ghost index number */}
    <span
      className="absolute -top-2 right-0 select-none pointer-events-none font-bold leading-none"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '72px',
        color: accent,
        opacity: 0.06,
        letterSpacing: '-4px',
      }}
    >
      {index}
    </span>

    {/* Icon + Tag */}
    <div className="flex items-center gap-2 mb-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
      >
        <Icon size={13} style={{ color: accent }} />
      </div>
      <span
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ color: accent, fontFamily: 'var(--font-mono)' }}
      >
        Module {index}
      </span>
    </div>

    {/* Title */}
    <h2
      className="text-2xl font-bold leading-tight mb-1"
      style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
    >
      {title}
    </h2>

    {/* Subtitle */}
    <p
      className="text-xs"
      style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
    >
      {subtitle}
    </p>
  </div>
);
