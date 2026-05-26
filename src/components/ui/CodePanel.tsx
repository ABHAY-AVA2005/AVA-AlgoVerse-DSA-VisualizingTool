import React, { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

interface CodePanelProps {
  code: string[];
  activeLine: number | null;
  accent?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({ code, activeLine, accent = 'var(--primary)' }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();
  
  return (
    <AnimatePresence>
      {code.length > 0 && (
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={{ top: -800, bottom: 200, left: -800, right: 800 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="z-40 rounded-xl shadow-2xl overflow-hidden font-mono text-sm"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            resize: isMinimized ? 'none' : 'both',
            minWidth: '250px',
            maxWidth: '600px',
            minHeight: isMinimized ? 'auto' : '150px',
            maxHeight: '800px',
            width: '300px',
          }}
        >
          <div 
            className="px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors hover:bg-black/10 shrink-0 select-none" 
            onPointerDown={(e) => dragControls.start(e)}
            title="Drag to move panel"
            style={{ background: 'var(--bg-elevated)', borderBottom: isMinimized ? 'none' : '1px solid var(--border-color)' }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400" title="Cannot close, only minimize" onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-400" title="Minimize" onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-400" title="Expand" onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}></div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider ml-2 select-none" style={{ color: 'var(--text-secondary)' }}>
              Algorithm Execution
            </span>
          </div>
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex-1 flex flex-col"
              >
                <div className="p-3 overflow-auto text-[13px] leading-[1.6] flex-1" style={{ background: 'var(--bg-primary)' }}>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
