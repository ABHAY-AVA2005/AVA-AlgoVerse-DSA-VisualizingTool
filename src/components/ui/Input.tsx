import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  accent?: string;
}

export const Input: React.FC<InputProps> = ({
  value, onChange, placeholder, className, type = 'text', accent
}) => (
  <div className="relative w-full group">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-[var(--radius-md)] px-3 py-2.5 text-[11px] font-mono transition-all duration-200 outline-none",
        "placeholder:text-[var(--text-muted)]",
        className
      )}
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = accent || 'rgba(34,211,238,0.4)';
        e.currentTarget.style.background = 'var(--bg-tertiary)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.background = 'var(--bg-primary)';
      }}
    />
  </div>
);
