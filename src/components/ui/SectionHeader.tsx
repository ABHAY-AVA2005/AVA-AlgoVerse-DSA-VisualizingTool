import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  index?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon: Icon, index }) => (
  <div className="mb-8 pb-6 border-b border-[var(--border-color)] relative overflow-hidden">
    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-transparent opacity-50"></div>
    {index && (
        <span className="absolute right-0 -top-2 text-[6rem] font-bold font-mono text-[var(--text-primary)] opacity-[0.03] select-none pointer-events-none leading-none tracking-tighter">
            {index}
        </span>
    )}
    <div className="flex items-center gap-4 mb-2 relative z-10">
      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-widest">
        {title}
      </h2>
    </div>
    <p className="text-xs text-[var(--text-secondary)] font-mono tracking-wide pl-1 relative z-10">{subtitle}</p>
  </div>
);
