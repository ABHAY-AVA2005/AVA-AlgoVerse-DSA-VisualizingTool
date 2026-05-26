import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ai' | 'active' | 'ghost';
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  accent?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children, onClick, variant = 'primary', className, disabled, icon: Icon, accent
}) => {
  const base = "px-4 py-2.5 rounded-[var(--radius-md)] font-mono font-medium text-[11px] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none tracking-[0.05em] uppercase";

  const variants: Record<string, string> = {
    primary:   "text-[var(--primary)] border border-[var(--border-color)] bg-[var(--primary-dim)] hover:bg-[var(--primary-glow)] hover:border-[var(--border-active)]",
    secondary: "text-[var(--text-secondary)] border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
    danger:    "text-rose-400 border border-rose-500/25 bg-rose-500/[0.08] hover:bg-rose-500/[0.15] hover:border-rose-500/40",
    ai:        "text-violet-400 border border-violet-500/30 bg-violet-500/[0.08] hover:bg-violet-500/[0.15]",
    active:    "text-[var(--bg-primary)] bg-[var(--primary)] border-none font-bold shadow-none",
    ghost:     "text-[var(--text-secondary)] border-none bg-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
  };

  const accentStyle = accent && variant === 'primary' ? {
    color: accent,
    borderColor: `${accent}40`,
    backgroundColor: `${accent}0D`,
  } : {};

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={accentStyle}
      className={cn(base, variants[variant], className)}
    >
      {Icon && <Icon size={13} />}
      {children}
    </motion.button>
  );
};
