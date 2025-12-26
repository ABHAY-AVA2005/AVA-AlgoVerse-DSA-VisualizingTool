import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { THEME } from '../core/ThemeContext';

interface ComplexityData {
  time: {
    best: string;
    avg: string;
    worst: string;
  };
  space: string;
  note?: string;
}

interface ComplexityHUDProps {
  data: ComplexityData;
}

export const ComplexityHUD: React.FC<ComplexityHUDProps> = ({ data }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -2 }}
    className={cn(THEME.card, "rounded-2xl p-5 space-y-4 backdrop-blur-xl relative overflow-hidden group")}
  >
    <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500/80 uppercase tracking-[0.2em] border-b border-[var(--border-color)] pb-3">
      <Activity size={12} /> Performance Analytics
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Best (Ω)</span>
        <span className="text-xs font-mono text-emerald-500 font-bold">{data.time.best}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Avg (Θ)</span>
        <span className="text-xs font-mono text-cyan-500 font-bold">{data.time.avg}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Worst (O)</span>
        <span className="text-xs font-mono text-rose-500 font-bold">{data.time.worst}</span>
      </div>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
      <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Space</span>
      <span className="text-xs font-mono text-[var(--text-primary)]">{data.space}</span>
    </div>
    {data.note && (
      <div className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)] font-mono leading-relaxed flex gap-2 items-start">
         <div className="mt-0.5 w-1 h-1 rounded-full bg-cyan-500 shrink-0"></div>
         {data.note}
      </div>
    )}
  </motion.div>
);
