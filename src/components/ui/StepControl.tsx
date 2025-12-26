import React from 'react';
import { StepForward } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface StepControlProps {
  stepMode: boolean;
  setStepMode: (value: boolean) => void;
  onNext: () => void;
  disabled?: boolean;
}

export const StepControl: React.FC<StepControlProps> = ({ stepMode, setStepMode, onNext, disabled }) => (
    <div className="flex items-center gap-2 w-full">
        <div className="flex items-center justify-between bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)] flex-1">
             <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-wider ml-2">Step Mode</span>
             <button onClick={() => setStepMode(!stepMode)} className={cn("w-10 h-5 rounded-full relative transition-colors border border-[var(--border-color)]", stepMode ? "bg-cyan-900/50 border-cyan-500/50" : "bg-neutral-800")}>
                 <div className={cn("absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform shadow-md", stepMode ? "translate-x-5 bg-cyan-400" : "bg-neutral-500")} />
             </button>
        </div>
        {stepMode && (
            <Button onClick={onNext} icon={StepForward} disabled={disabled} className="bg-cyan-600 hover:bg-cyan-500 text-white border-none h-full py-0">Next</Button>
        )}
    </div>
);
