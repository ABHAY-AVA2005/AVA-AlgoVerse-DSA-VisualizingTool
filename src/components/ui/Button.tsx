import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ai' | 'active';
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className, disabled, icon: Icon }) => {
  const variants = {
    primary: "bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-500 border border-cyan-500/50 shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)]",
    secondary: "bg-[var(--bg-secondary)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-color)]",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30",
    ai: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]",
    active: "bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)] border-none" 
  };

  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.03, y: -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick} disabled={disabled} 
      className={cn("px-4 py-2.5 rounded-lg font-mono font-medium text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none tracking-wide", variants[variant], className)}
    >
      {Icon && <Icon size={14} className={variant === 'primary' ? "animate-pulse" : ""} />} {children}
    </motion.button>
  );
};
