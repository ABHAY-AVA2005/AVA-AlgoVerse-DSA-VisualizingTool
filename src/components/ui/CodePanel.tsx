import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodePanelProps {
  code: string[];
  activeLine: number | null;
  accent?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({ code, activeLine, accent = 'var(--primary)' }) => {
  return (
    <AnimatePresence>
      {code.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="z-40 rounded-xl shadow-2xl overflow-hidden font-mono text-sm max-w-[280px] w-full"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider ml-2" style={{ color: 'var(--text-secondary)' }}>
              Algorithm Execution
            </span>
          </div>
          <div className="p-3 overflow-x-auto text-[13px] leading-[1.6]" style={{ background: 'var(--bg-primary)' }}>
            {code.map((line, idx) => (
              <div 
                key={idx} 
                className="flex rounded px-2 py-0.5 whitespace-pre transition-colors duration-200"
                style={{
                  background: activeLine === idx ? accent : 'transparent',
                  color: activeLine === idx ? '#000000' : 'var(--text-secondary)',
                  fontWeight: activeLine === idx ? '700' : '400',
                }}
              >
                <span 
                  className="inline-block w-6 text-right mr-3 select-none"
                  style={{
                    color: activeLine === idx ? 'rgba(0,0,0,0.5)' : 'var(--text-muted)',
                  }}
                >
                  {idx + 1}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
