import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options }) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-mono font-medium rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-cyan-500/50 cursor-pointer transition-all hover:bg-[var(--bg-secondary)]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[var(--bg-primary)]">
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
  </div>
);
