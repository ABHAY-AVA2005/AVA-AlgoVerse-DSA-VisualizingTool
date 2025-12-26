import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Plus, Trash2 } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait } from '../../lib/utils';

const ARR_COMPLEXITY = { static: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(1)', note: 'Fast access.' }, dynamic: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(n)' }, space: 'O(n)', note: 'Resize O(n).' } };

interface ArraySectionProps {
  id: string;
}

export const ArraySection: React.FC<ArraySectionProps> = ({ id }) => {
  const [mode, setMode] = useState('dynamic');
  const [arr, setArr] = useState<(string | number)[]>([10, "A", 5, "B", 8]);
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('');
  const [active, setActive] = useState<number | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async () => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(500); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };
  const insert = async () => { if (val === "") return; const i = idx===''?arr.length:parseInt(idx); if(i<0||i>arr.length)return; const newArr = [...arr]; if (i < newArr.length) { for(let k=newArr.length; k>i; k--) { setActive(k-1); await proceed(); } } newArr.splice(i,0,parseValue(val)); setArr(newArr); setActive(i); await proceed(); setActive(null); setVal(''); };
  const remove = async () => { const i = idx===''?arr.length-1:parseInt(idx); if(i<0||i>=arr.length)return; setActive(i); await proceed(); setArr(arr.filter((_,x)=>x!==i)); setActive(null); };
  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
      {/* LEFT: 30% Panel */}
      <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-8 flex flex-col z-20 gap-8`}>
        <SectionHeader title="Arrays" subtitle="Linear Memory Blocks." icon={List} index="01" />
        <Select value={mode} onChange={setMode} options={[{value:'static',label:'Static Array'},{value:'dynamic',label:'Dynamic Array'}]} />
        <ComplexityHUD data={ARR_COMPLEXITY[mode as keyof typeof ARR_COMPLEXITY]} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
        <div className="space-y-4 mt-auto">
             <div className="grid grid-cols-[1fr_60px] gap-2"><Input value={val} onChange={setVal} placeholder="Value (Str/Num)"/><Input value={idx} onChange={setIdx} placeholder="Idx" /></div>
             <div className="grid grid-cols-2 gap-2"><Button onClick={insert} icon={Plus}>Insert</Button><Button onClick={remove} variant="danger" icon={Trash2}>Remove</Button></div>
        </div>
      </div>
      {/* RIGHT: 70% Visualization */}
      <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-center justify-center p-4 md:p-10`}>
        <GridBackground />
        <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
          <AnimatePresence mode='popLayout'>
            {arr.map((v,i)=>( 
              <motion.div layout key={`${i}-${v}`} initial={{opacity:0,scale:0.5, y: 20}} animate={{opacity:1,scale:active===i?1.15:1, y: 0, borderColor:active===i?'#22d3ee':'rgba(128,128,128,0.1)',backgroundColor:active===i?'rgba(34,211,238,0.1)':'rgba(10,10,10,0.6)', boxShadow: active===i ? '0 0 30px rgba(34,211,238,0.3)' : 'none'}} exit={{opacity:0,scale:0}} className="w-20 h-24 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] flex flex-col items-center justify-center relative backdrop-blur-md shadow-lg group hover:border-cyan-500/30 transition-colors">
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)] group-hover:text-cyan-500">{v}</span>
                <span className="absolute bottom-2 text-[10px] text-[var(--text-secondary)] font-mono group-hover:text-cyan-500/50">IDX: {i}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
