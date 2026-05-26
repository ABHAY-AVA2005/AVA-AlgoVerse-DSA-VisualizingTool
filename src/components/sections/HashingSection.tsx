import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash, Plus, Dices, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { CodePanel } from '../ui/CodePanel';
import { soundEngine } from '../../lib/SoundEngine';
import { parseValue, wait, simpleHash } from '../../lib/utils';

const ACCENT = 'var(--accent-hashing)';
const ACCENT_HEX = '#F472B6';

const HASH_COMPLEXITY = {
  chaining: { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(n)' }, space: 'O(n)', note: 'L.L. Chaining.' },
  probing:  { time: { best: 'Ω(1)', avg: 'Θ(1)', worst: 'O(n)' }, space: 'O(1)', note: 'Linear Probing.' }
};

const CODE_SNIPPETS: Record<string, string[]> = {
  chaining: [
    "void insert(int key, int val) {",
    "    int idx = key % SIZE;",
    "    if (table[idx] == null) {",
    "        table[idx] = new LinkedList<>();",
    "    }",
    "    table[idx].add(val);",
    "}"
  ],
  probing: [
    "void insert(int key, int val) {",
    "    int idx = key % SIZE;",
    "    int count = 0;",
    "    while (table[idx] != null && count < SIZE) {",
    "        idx = (idx + 1) % SIZE;",
    "        count++;",
    "    }",
    "    if (count < SIZE) table[idx] = val;",
    "}"
  ]
};

interface HashingSectionProps {
  id: string;
}

export const HashingSection: React.FC<HashingSectionProps> = ({ id }) => {
  const [method, setMethod] = useState('chaining');
  const [table, setTable] = useState<(string | number | (string | number)[] | null)[]>(
    Array(11).fill(null).map(() => method === 'chaining' ? [] : null)
  );
  const [val, setVal] = useState('');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async (delay = 400) => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(delay / ((window as any).__SPEED_FACTOR__ || 1)); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  useEffect(() => {
    setTable(Array(11).fill(null).map(() => method === 'chaining' ? [] : null));
  }, [method]);

  const insert = async () => {
    const v = parseValue(val); if (v === "") return;
    setActiveLine(0); await proceed(100);
    const idx = simpleHash(v, 11);
    setActiveLine(1); await proceed(100);
    setActiveIdx(idx);
    if (typeof v === 'number') soundEngine.playValue(v);
    
    const newTable = [...table];
    if (method === 'chaining') {
      setActiveLine(2); await proceed(100);
      if (!(newTable[idx] as (string|number)[]).length) {
         setActiveLine(3); await proceed(100);
      }
      setActiveLine(5); await proceed(100);
      (newTable[idx] as (string|number)[]).push(v);
    } else {
      setActiveLine(2); await proceed(100);
      let curr = idx;
      let count = 0;
      setActiveLine(3); await proceed(100);
      while (newTable[curr] !== null && count < 11) { 
        setActiveLine(4); await proceed(100);
        curr = (curr + 1) % 11; 
        setActiveLine(5); await proceed(100);
        count++; 
        setActiveIdx(curr);
        soundEngine.playValue(curr * 10);
        setActiveLine(3); await proceed();
      }
      setActiveLine(7); await proceed(100);
      if (count < 11) newTable[curr] = v;
    }
    soundEngine.playSuccess();
    setTable(newTable); setVal(''); setActiveIdx(null); setActiveLine(null);
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
        <SectionHeader title="Hashing" subtitle="Key-Value Map." icon={Hash} index="05" accent={ACCENT} />
        <Select value={method} onChange={setMethod} options={[{value:'chaining',label:'Chaining'},{value:'probing',label:'Linear Probing'}]} />
        <ComplexityHUD data={HASH_COMPLEXITY[method as keyof typeof HASH_COMPLEXITY]} accent={ACCENT} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
        
        {/* Code Panel */}
        {CODE_SNIPPETS[method] && (
          <div className="z-30 mt-2">
            <CodePanel code={CODE_SNIPPETS[method]} activeLine={activeLine} accent={ACCENT} />
          </div>
        )}

        <div className="space-y-3 mt-auto">
          <div className="flex gap-2">
            <Input value={val} onChange={setVal} placeholder="Key (Str/Num)" accent={ACCENT} />
            <Button onClick={insert} icon={Plus} accent={ACCENT}>Map</Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={() => setTable(Array.from({length: 11}, () => Math.random() > 0.4 ? Math.floor(Math.random() * 90) + 10 : null))} variant="secondary" icon={Dices}>Randomize</Button>
            <Button onClick={() => setTable(Array(11).fill(null))} variant="danger" icon={Trash2}>Clear All</Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Canvas */}
      <div
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex items-center justify-center p-8 overflow-y-auto overflow-hidden"
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

        <div className="w-full max-w-4xl grid grid-cols-1 gap-3 relative z-10 pt-10 pb-32">
          {table.map((slot, i) => (
            <div key={i} className="flex items-center gap-4">
              <motion.div
                animate={{
                  scale: activeIdx === i ? 1.1 : 1,
                  backgroundColor: activeIdx === i ? `${ACCENT_HEX}20` : 'var(--bg-elevated)',
                  borderColor: activeIdx === i ? `${ACCENT_HEX}80` : 'var(--border-color)',
                }}
                className="w-14 h-14 flex items-center justify-center border rounded-xl font-mono text-[10px] shrink-0"
                style={{ color: activeIdx === i ? ACCENT_HEX : 'var(--text-muted)' }}
              >
                IDX {i}
              </motion.div>
              {method === 'chaining' ? (
                <div
                  className="flex items-center gap-3 flex-wrap p-2 rounded-lg border flex-1 min-h-[56px]"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  {(slot as (string|number)[]).map((v, j) => (
                    <div
                      key={j}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono"
                      style={{ background: `${ACCENT_HEX}12`, border: `1px solid ${ACCENT_HEX}35`, color: ACCENT_HEX }}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="px-4 py-3 rounded-lg border flex-1 min-h-[56px] flex items-center font-bold font-mono"
                  style={{ border: '1px solid var(--border-color)', color: ACCENT_HEX }}
                >
                  {slot}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
