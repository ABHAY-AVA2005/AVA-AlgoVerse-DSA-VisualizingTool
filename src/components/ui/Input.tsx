import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export const Input: React.FC<InputProps> = ({ value, onChange, placeholder, className, type="text" }) => (
  <div className="relative group w-full">
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      className={cn("w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_-5px_rgba(34,211,238,0.1)] font-mono transition-all", className)} 
    />
  </div>
);
