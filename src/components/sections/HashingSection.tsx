import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash, Plus } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { parseValue, wait, simpleHash } from '../../lib/utils';

const HASH_COMPLEXITY = { chaining: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(n)' }, space: 'O(n)', note: 'L.L. Chaining.' }, probing: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(n)' }, space: 'O(1)', note: 'Linear Probing.' } };

interface HashingSectionProps {
  id: string;
}

export const HashingSection: React.FC<HashingSectionProps> = ({ id }) => {
  const [method, setMethod] = useState('chaining');
  const [table, setTable] = useState<(string | number | (string | number)[] | null)[]>(Array(11).fill(null).map(() => method === 'chaining' ? [] : null));
  const [val, setVal] = useState('');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async () => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(400); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };
  useEffect(() => { setTable(Array(11).fill(null).map(() => method === 'chaining' ? [] : null)); }, [method]);
  const insert = async () => { 
    const v = parseValue(val); if (v === "") return; 
    const idx = simpleHash(v, 11); 
    setActiveIdx(idx); await proceed(); 
    const newTable = [...table]; 
    if (method === 'chaining') { (newTable[idx] as (string|number)[]).push(v); } 
    else { 
      let curr = idx; 
      let count = 0;
      while (newTable[curr] !== null && count < 11) {
        curr = (curr + 1) % 11;
        count++;
      }
      if (count < 11) newTable[curr] = v; 
    } 
    setTable(newTable); setVal(''); setActiveIdx(null); 
  };
  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
      {/* LEFT: 30% Panel */}
      <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-6 flex flex-col gap-6`}>
        <SectionHeader title="Hashing" subtitle="Key-Value Map" icon={Hash} index="04" />
        <Select value={method} onChange={setMethod} options={[{value:'chaining',label:'Chaining'},{value:'probing',label:'Linear Probing'}]} />
        <ComplexityHUD data={HASH_COMPLEXITY[method as keyof typeof HASH_COMPLEXITY]} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
        <div className="space-y-3 mt-auto"><div className="flex gap-2"><Input value={val} onChange={setVal} placeholder="Key (Str/Num)"/><Button onClick={insert} icon={Plus}>Map</Button></div></div>
      </div>
      {/* RIGHT: 70% Visualization */}
      <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-center justify-center p-8 overflow-y-auto`}>
        <GridBackground />
        <div className="w-full max-w-4xl grid grid-cols-1 gap-3">
            {table.map((slot, i) => (
                <div key={i} className="flex items-center gap-4">
                    <motion.div animate={{ scale: activeIdx === i ? 1.1 : 1, backgroundColor: activeIdx === i ? 'rgba(34, 211, 238, 0.2)' : 'var(--bg-card)', borderColor: activeIdx === i ? 'var(--primary)' : 'var(--border-color)' }} className="w-14 h-14 flex items-center justify-center border rounded-xl font-mono text-sm shrink-0">IDX {i}</motion.div>
                    {method === 'chaining' ? <div className="flex items-center gap-3 flex-wrap p-2 rounded-lg border border-[var(--border-color)] flex-1 min-h-[56px]">{(slot as (string|number)[]).map((v, j)=>(<div key={j} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[var(--primary)] font-mono text-xs">{v}</div>))}</div> : <div className="px-4 py-3 rounded-lg border border-[var(--border-color)] flex-1 min-h-[56px] flex items-center font-bold text-cyan-400">{slot}</div>}
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
