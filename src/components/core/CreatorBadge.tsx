import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, User, X } from 'lucide-react';

export const CreatorBadge = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="fixed bottom-10 left-10 z-[1000] flex flex-col items-start no-scroll"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20, y: 20 }}
            className="mb-6 w-80 overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 p-6 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/50 bg-cyan-500/10 overflow-hidden">
                <img src="Abhay.png" alt="A" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-bold font-mono text-sm leading-none">
                  Abhay Varshit Aripirala
                </h3>
                <p className="text-[var(--primary)] opacity-80 text-[10px] uppercase tracking-widest mt-1 font-mono">
                  Web Developer
                </p>
              </div>
            </div>
            
            <p className="text-[var(--text-secondary)] text-xs font-mono leading-relaxed mb-6">
              Empowering learners by bridging the gap between abstract algorithms and intuitive visual logic.
            </p>

            <div className="flex gap-2">
              <a 
                href="https://github.com/ABHAY-AVA2005/AVA-ALGOVERSE-DSA-Visualizer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[10px] text-[var(--text-primary)] font-bold uppercase hover:bg-[var(--border-active)] transition-colors"
              >
                <Github size={12} /> GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/abhay-varshit-ava-9242a1286/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--primary-dim)] border border-[var(--primary)]/20 text-[10px] text-[var(--primary)] font-bold uppercase hover:bg-[var(--primary-glow)] transition-colors"
              >
                <Linkedin size={12} /> LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-4 rounded-full border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1.5 shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] overflow-hidden">
          {isOpen ? (
            <X size={20} />
          ) : (
            <User size={20} className="text-[var(--primary)]" />
          )}
        </div>
        <span className="pr-6 text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)] uppercase">
          {isOpen ? 'Close' : 'Creator'}
        </span>
      </button>
    </motion.div>
  );
};
