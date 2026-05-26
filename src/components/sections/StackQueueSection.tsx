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
import { CodePanel } from '../ui/CodePanel';
import { soundEngine } from '../../lib/SoundEngine';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const ACCENT = 'var(--accent-stack)';
const ACCENT_HEX = '#60A5FA';

const complexities = {
  stack: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(n)', note: 'LIFO.' },
  queue: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(n)', note: 'FIFO.' },
  pq:    { time: { best: 'Ω(1)', avg: 'Θ(log n)', worst: 'O(n)' }, space: 'O(n)', note: 'Priority.' }
};

const CODE_SNIPPETS: Record<string, string[]> = {
  stack: [
    "void push(int x) {",
    "    if (top == MAX - 1) return; // Overflow",
    "    stack[++top] = x;",
    "}",
    "",
    "int pop() {",
    "    if (top == -1) return -1; // Underflow",
    "    return stack[top--];",
    "}"
  ],
  queue: [
    "void enqueue(int x) {",
    "    if (rear == MAX - 1) return; // Overflow",
    "    queue[++rear] = x;",
    "}",
    "",
    "int dequeue() {",
    "    if (front > rear) return -1; // Underflow",
    "    return queue[front++];",
    "}"
  ],
  pq: [
    "void insert(int x) {",
    "    pq[size++] = x;",
    "    sort(pq); // Priority adjustment",
    "}",
    "",
    "int extract() {",
    "    if (size == 0) return -1;",
    "    return pq[--size];",
    "}"
  ]
};

interface StackQueueSectionProps {
  id: string;
}

export const StackQueueSection: React.FC<StackQueueSectionProps> = ({id}) => {
  const [mode, setMode] = useState('stack');
  const [d, setD] = useState<(string|number)[]>([10, "A", 20]);
  const [v, setV] = useState('');
  const [stepMode, setStepMode] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async (delay = 300) => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(delay / ((window as any).__SPEED_FACTOR__ || 1)); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const push = async () => {
    if(v === "") return;
    if (d.length >= 10) { alert("Max input size is 10"); return; }
    setActiveLine(0); await proceed(100);
    setActiveLine(1); await proceed(100);
    const newVal = parseValue(v);
    if (mode === 'pq') {
      setActiveLine(1); await proceed(200);
      setActiveLine(2);
      const sorted = [...d, newVal].sort(compareValues);
      setD(sorted);
    } else {
      setActiveLine(2);
      setD([...d, newVal]);
    }
    if (typeof newVal === 'number') soundEngine.playValue(newVal as number);
    await proceed(300);
    setV('');
    setActiveLine(null);
  };

  const pop = async () => {
    if(!d.length) return;
    setActiveLine(5); await proceed(100);
    setActiveLine(6); await proceed(100);
    setActiveLine(7);
    const val = mode === 'stack' ? d[d.length - 1] : d[0];
    if (typeof val === 'number') soundEngine.playValue(val as number);
    await proceed(200);
    setD(mode === 'stack' ? d.slice(0,-1) : d.slice(1));
    await proceed(300);
    setActiveLine(null);
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
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex flex-col items-center justify-end overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}
      >
        {/* Accent radial glow */}
        <div
          className="absolute pointer-events-none z-0"
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
        <div className="flex flex-col items-center justify-end w-full h-[70%] lg:h-[80%] max-w-4xl px-4 lg:px-8 pb-10 z-10 gap-6">
          {/* Code Panel */}
          {CODE_SNIPPETS[mode] && (
            <div className="z-30 w-full flex justify-center mb-10">
              <CodePanel code={CODE_SNIPPETS[mode]} activeLine={activeLine} accent={ACCENT} />
            </div>
          )}
          
          <div className="flex gap-3 flex-wrap justify-center max-w-5xl relative z-10 mt-auto">
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
        </div>
      </div>
    </section>
  );
};
