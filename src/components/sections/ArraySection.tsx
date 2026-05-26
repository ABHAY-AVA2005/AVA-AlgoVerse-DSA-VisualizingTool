import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Plus, Trash2, Dices } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { CodePanel } from '../ui/CodePanel';
import { soundEngine } from '../../lib/SoundEngine';
import { parseValue, wait } from '../../lib/utils';

const ACCENT = 'var(--accent-arrays)';

const ARR_COMPLEXITY = {
  static:  { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(1)' }, space: 'O(1)', note: 'Fast access.' },
  dynamic: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(n)' }, space: 'O(n)', note: 'Resize O(n).' }
};

const CODE_SNIPPETS: Record<string, string[]> = {
  static: [
    "void insert(int[] arr, int val, int idx) {",
    "    if (idx < 0 || idx >= MAX_SIZE) return;",
    "    for (int i = MAX_SIZE - 1; i > idx; i--) {",
    "        arr[i] = arr[i - 1];",
    "    }",
    "    arr[idx] = val;",
    "}",
    "",
    "void remove(int[] arr, int idx) {",
    "    for (int i = idx; i < MAX_SIZE - 1; i++) {",
    "        arr[i] = arr[i + 1];",
    "    }",
    "}"
  ],
  dynamic: [
    "void insert(ArrayList<Integer> arr, int val, int idx) {",
    "    if (arr.size() == capacity) {",
    "        resize(); // O(N)",
    "    }",
    "    arr.add(idx, val);",
    "}",
    "",
    "void remove(ArrayList<Integer> arr, int idx) {",
    "    arr.remove(idx);",
    "}"
  ]
};

interface ArraySectionProps {
  id: string;
}

export const ArraySection: React.FC<ArraySectionProps> = ({ id }) => {
  const [mode, setMode] = useState('dynamic');
  const [arr, setArr] = useState<(string | number)[]>([10, "A", 5, "B", 8]);
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('');
  const [active, setActive] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async (delay = 500) => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(delay / ((window as any).__SPEED_FACTOR__ || 1)); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };
  const insert = async () => { 
      if (val === "") return; 
      if (arr.length >= 10) { alert("Max input size is 10"); return; } 
      const i = idx === '' ? arr.length : parseInt(idx); 
      if(i < 0 || i > arr.length) return; 
      
      const newArr = [...arr]; 
      const parsedVal = parseValue(val);
      setActiveLine(0); await proceed(300);
      setActiveLine(1); await proceed(300);
      
      if (mode === 'static') {
        setActiveLine(2); await proceed(300);
        if (i < newArr.length) { 
            for(let k = newArr.length; k > i; k--) { 
                setActiveLine(3);
                setActive(k-1); 
                soundEngine.playValue(100 + (k * 10));
                await proceed(); 
            } 
        } 
        setActiveLine(5); await proceed(300);
      } else {
        setActiveLine(2); await proceed(300);
        setActiveLine(4); await proceed(300);
      }
      
      newArr.splice(i, 0, parsedVal); 
      setArr(newArr); 
      setActive(i); 
      if (typeof parsedVal === 'number') soundEngine.playValue(parsedVal);
      else soundEngine.playValue(100);
      await proceed(); 
      setActiveLine(null);
      setActive(null); 
      setVal(''); 
      soundEngine.playSuccess();
  };
  const remove = async () => { 
      const i = idx === '' ? arr.length - 1 : parseInt(idx); 
      if(i < 0 || i >= arr.length) return; 
      
      setActiveLine(mode === 'static' ? 8 : 7); await proceed(300);
      setActive(i); 
      soundEngine.playValue(50);
      await proceed(); 
      
      if (mode === 'static') {
         setActiveLine(9); await proceed(300);
         for(let k = i; k < arr.length - 1; k++) {
             setActiveLine(10);
             setActive(k);
             soundEngine.playValue(100 + (k * 10));
             await proceed();
         }
      } else {
         setActiveLine(8); await proceed(300);
      }
      
      setArr(arr.filter((_,x) => x !== i)); 
      setActiveLine(null);
      setActive(null); 
      soundEngine.playSuccess();
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
        <SectionHeader title="Arrays" subtitle="Linear Memory Blocks." icon={List} index="01" accent={ACCENT} />
        <Select value={mode} onChange={setMode} options={[{value:'static',label:'Static Array'},{value:'dynamic',label:'Dynamic Array'}]} />
        <ComplexityHUD data={ARR_COMPLEXITY[mode as keyof typeof ARR_COMPLEXITY]} accent={ACCENT} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
        <div className="space-y-4 mt-auto">
          <div className="grid grid-cols-[1fr_60px] gap-2">
            <Input value={val} onChange={setVal} placeholder="Value (Str/Num)" accent={ACCENT} />
            <Input value={idx} onChange={setIdx} placeholder="Idx" accent={ACCENT} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={insert} icon={Plus} accent={ACCENT}>Insert</Button>
            <Button onClick={remove} variant="danger" icon={Trash2}>Remove</Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={() => setArr(Array.from({length: 8}, () => Math.floor(Math.random() * 90) + 10))} variant="secondary" icon={Dices}>Randomize</Button>
            <Button onClick={() => setArr([])} variant="danger" icon={Trash2}>Clear All</Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Canvas */}
      <div
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex items-center justify-center p-6 md:p-12 overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}
      >
        {/* Accent radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <GridBackground />
        
        {/* Code Panel */}
        {CODE_SNIPPETS[mode] && (
          <div className="absolute bottom-8 left-8 z-30">
            <CodePanel code={CODE_SNIPPETS[mode]} activeLine={activeLine} accent={ACCENT} />
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center max-w-4xl relative z-10 pt-10 pb-32">
          <AnimatePresence mode='popLayout'>
            {arr.map((v, i) => (
              <motion.div
                layout
                key={`${i}-${v}`}
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: active === i ? 1.08 : 1,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.5, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="relative flex flex-col items-center justify-center"
                style={{
                  width: 76,
                  height: 92,
                  borderRadius: 'var(--radius-md)',
                  background: active === i ? 'rgba(34,211,238,0.08)' : 'var(--bg-elevated)',
                  border: `1px solid ${active === i ? 'rgba(34,211,238,0.5)' : 'var(--border-color)'}`,
                  boxShadow: active === i ? '0 0 24px rgba(34,211,238,0.15)' : 'none',
                  transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Top address bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-[var(--radius-md)]"
                  style={{ background: active === i ? '#22D3EE' : 'var(--border-color)' }}
                />
                {/* Value */}
                <span
                  className="text-xl font-bold font-mono"
                  style={{ color: active === i ? '#22D3EE' : 'var(--text-primary)' }}
                >
                  {v}
                </span>
                {/* Index badge */}
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-1.5 rounded-b-[var(--radius-md)]"
                  style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}
                >
                  <span
                    className="text-[8px] font-mono tracking-wider uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    [{i}]
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
