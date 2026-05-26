import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, Dices } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const ACCENT = 'var(--accent-stack)';
const ACCENT_HEX = '#60A5FA';

const complexities = {
  stack: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(n)', note: 'LIFO.' },
  queue: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(n)', note: 'FIFO.' },
  pq:    { time: { best: 'Ω(1)', avg: 'Θ(log n)', worst: 'O(n)' }, space: 'O(n)', note: 'Priority.' }
};

interface StackQueueSectionProps {
  id: string;
}

export const StackQueueSection: React.FC<StackQueueSectionProps> = ({id}) => {
  const [mode, setMode] = useState('stack');
  const [d, setD] = useState<(string|number)[]>([10, "A", 20]);
  const [v, setV] = useState('');
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async () => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(300 / ((window as any).__SPEED_FACTOR__ || 1)); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const push = async () => {
    if(v === "") return;
    if (d.length >= 10) { alert("Max input size is 10"); return; }
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

  const pop = async () => {
    if(!d.length) return;
    await proceed();
    setD(mode === 'stack' ? d.slice(0,-1) : d.slice(1));
  };

  return (
    <section
      id={id}
      className="min-h-screen w-full flex flex-col lg:flex-row relative"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
      {/* LEFT: Sidebar Panel */}
      <div
        className="w-full lg:w-[300px] shrink-0 flex flex-col z-20 gap-6 p-6 lg:p-8"
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          borderLeft: `2px solid ${ACCENT}`,
        }}
      >
        <SectionHeader title="Stacks & Queues" subtitle="Abstract Types." icon={Layers} index="06" accent={ACCENT} />
        <Select value={mode} onChange={setMode} options={[{value:'stack',label:'Stack (LIFO)'},{value:'queue',label:'Queue (FIFO)'},{value:'pq',label:'Priority Queue'}]} />
        <ComplexityHUD data={complexities[mode as keyof typeof complexities]} accent={ACCENT} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
        <div className="space-y-3 mt-auto">
          <Input value={v} onChange={setV} placeholder="Value (Str/Num)" accent={ACCENT} />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={push} icon={Plus} accent={ACCENT}>Push</Button>
            <Button onClick={pop} variant="danger" icon={Trash2}>Pop</Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={() => setD(Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 10))} variant="secondary" icon={Dices}>Randomize</Button>
            <Button onClick={() => setD([])} variant="danger" icon={Trash2}>Clear All</Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Canvas */}
      <div
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex items-center justify-center p-8 overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}
      >
        {/* Accent radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT_HEX}08 0%, transparent 70%)`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <GridBackground />
        <div
          className={cn(
            "flex gap-3 p-8 border rounded-3xl items-center justify-center transition-all relative overflow-hidden z-10",
            mode === 'stack' ? "flex-col-reverse w-48 h-[500px] border-b-4" : "flex-row min-h-[150px] min-w-[350px]"
          )}
          style={{ border: `1px solid ${ACCENT_HEX}30`, background: `${ACCENT_HEX}04` }}
        >
          <AnimatePresence mode='popLayout'>
            {d.map((x, i) => (
              <motion.div
                layout
                key={`${i}-${x}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className={cn(
                  "rounded-xl border flex items-center justify-center font-mono font-bold text-lg",
                  mode === 'stack' ? "w-full h-14" : "w-16 h-16"
                )}
                style={{
                  border: `1px solid ${ACCENT_HEX}40`,
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                }}
              >
                {x}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
