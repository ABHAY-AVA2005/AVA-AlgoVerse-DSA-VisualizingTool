import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const complexities = { stack: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(n)', note: 'LIFO.' }, queue: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(n)', note: 'FIFO.' }, pq: { time: { best: 'Ω(1)', avg: 'Θ(log n)', worst: 'O(n)' }, space: 'O(n)', note: 'Priority.' } };

interface StackQueueSectionProps {
  id: string;
}

export const StackQueueSection: React.FC<StackQueueSectionProps> = ({id}) => {
  const [mode,setM]=useState('stack'); 
  const [d,setD]=useState<(string|number)[]>([10, "A", 20]); 
  const [v,setV]=useState('');
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async () => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(300); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };
  
  const push = async() => {
    if(v === "") return; 
    await proceed(); 
    const newVal = parseValue(v);
    if (mode === 'pq') {
      const sorted = [...d, newVal].sort(compareValues);
      setD(sorted);
    } else {
      setD([...d, newVal]);
    }
    setV('');
  };

  const pop = async() => { if(!d.length) return; await proceed(); setD(mode==='stack' ? d.slice(0,-1) : d.slice(1)); };
  
  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
      {/* LEFT: 30% Panel */}
      <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-6 flex flex-col gap-6`}>
        <SectionHeader title="Stacks & Queues" subtitle="Abstract Types" icon={Layers} index="05" />
        <Select value={mode} onChange={setM} options={[{value:'stack',label:'Stack (LIFO)'},{value:'queue',label:'Queue (FIFO)'},{value:'pq',label:'Priority Queue'}]}/>
        <ComplexityHUD data={complexities[mode as keyof typeof complexities]} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
        <div className="space-y-3 mt-auto"><Input value={v} onChange={setV} placeholder="Value (Str/Num)"/><div className="grid grid-cols-2 gap-2"><Button onClick={push} icon={Plus}>Push</Button><Button onClick={pop} variant="danger" icon={Trash2}>Pop</Button></div></div>
      </div>
      {/* RIGHT: 70% Visualization */}
      <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-center justify-center p-8`}>
        <GridBackground />
        <div className={cn("flex gap-3 p-8 border border-[var(--border-color)] rounded-3xl bg-[var(--bg-card)] items-center justify-center transition-all backdrop-blur-md relative overflow-hidden", mode==='stack'?"flex-col-reverse w-48 h-[500px] border-b-4":"flex-row min-h-[150px] min-w-[350px]")}>
            <AnimatePresence mode='popLayout'>{d.map((x,i)=>(<motion.div layout key={`${i}-${x}`} initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0}} className={cn("rounded-xl border border-[var(--border-color)] flex items-center justify-center font-mono font-bold text-lg bg-[var(--bg-main)]", mode==='stack'?"w-full h-14":"w-16 h-16")}>{x}</motion.div>))}</AnimatePresence>
        </div>
      </div>
    </section>
  )
}
