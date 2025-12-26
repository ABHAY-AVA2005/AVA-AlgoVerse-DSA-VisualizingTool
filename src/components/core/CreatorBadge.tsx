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
            className="mb-6 w-80 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/90 p-6 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/50 bg-cyan-500/10 overflow-hidden">
                <img src="/src/assets/Abhay image AI.png" alt="A" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-white font-bold font-mono text-sm leading-none">
                  Abhay Varshit Aripirala
                </h3>
                <p className="text-cyan-400/70 text-[10px] uppercase tracking-widest mt-1 font-mono">
                  Web Developer
                </p>
              </div>
            </div>
            
            <p className="text-neutral-400 text-xs font-mono leading-relaxed mb-6">
              Empowering learners by bridging the gap between abstract algorithms and intuitive visual logic.
            </p>

            <div className="flex gap-2">
              <a 
                href="https://github.com/ABHAY-AVA2005/AVA-ALGOVERSE-DSA-Visualizer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white font-bold uppercase hover:bg-white/10 transition-colors"
              >
                <Github size={12} /> GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/abhay-varshit-ava-9242a1286/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-bold uppercase hover:bg-cyan-500/20 transition-colors"
              >
                <Linkedin size={12} /> LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-4 rounded-full border border-white/10 bg-white p-1.5 shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#050505] text-white overflow-hidden">
          {isOpen ? (
            <X size={20} />
          ) : (
            <User size={20} className="text-cyan-400" />
          )}
        </div>
        <span className="pr-6 text-[10px] font-black tracking-[0.2em] text-[#050505] uppercase">
          {isOpen ? 'Close' : 'Creator'}
        </span>
      </button>
    </motion.div>
  );
};
