import React from 'react';

export const Footer = () => (
  <footer className="w-full py-12 border-t border-[var(--border-color)] bg-[var(--bg-primary)] text-center z-10 relative overflow-hidden">
    <div className="flex flex-col items-center gap-3">
        <span className="text-2xl font-mono font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-700 opacity-90">AVA</span>
        <p className="text-[10px] text-[var(--text-secondary)] font-mono tracking-widest uppercase">
        © 2025 AVA v3.0 | Engineered by Abhay Varshit Aripirala
        </p>
    </div>
  </footer>
);
