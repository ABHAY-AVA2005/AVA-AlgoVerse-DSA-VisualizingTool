import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface StepControlProps {
  stepMode: boolean;
  setStepMode: (v: boolean) => void;
  onNext: () => void;
  accent?: string;
}

export const StepControl: React.FC<StepControlProps> = ({
  stepMode, setStepMode, onNext, accent = 'var(--primary)'
}) => (
  <div className="flex flex-col gap-3">
    {/* Toggle row */}
    <div className="flex items-center justify-between">
      <span
        className="text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
      >
        Step Mode
      </span>
      <button
        onClick={() => setStepMode(!stepMode)}
        className="relative w-10 h-5 rounded-full transition-all duration-200"
        style={{
          background: stepMode ? accent : 'var(--bg-elevated)',
          border: '1px solid var(--border-active)',
        }}
        aria-label="Toggle step mode"
      >
        <motion.div
          animate={{ x: stepMode ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 rounded-full"
          style={{ background: stepMode ? 'black' : 'var(--text-secondary)' }}
        />
      </button>
    </div>

    {/* Next Step button — only visible when step mode is on */}
    {stepMode && (
      <motion.button
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        onClick={onNext}
        className="flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-md)] text-[11px] font-mono font-bold uppercase tracking-wider transition-all"
        style={{
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          color: accent,
        }}
      >
        <ChevronRight size={13} />
        Next Step
      </motion.button>
    )}
  </div>
);
