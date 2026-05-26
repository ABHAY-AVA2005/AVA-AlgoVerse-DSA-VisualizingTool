import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Plus, Trash2, Search as SearchIcon, StopCircle, Dices } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait } from '../../lib/utils';

const ACCENT = 'var(--accent-ll)';
const ACCENT_HEX = '#A78BFA';

const LL_COMPLEXITY = {
  sll: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)', note: 'Singly Linked.' },
  dll: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)', note: 'Doubly Linked.' },
  cll: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)', note: 'Circular.' }
};

interface LinkedListSectionProps {
  id: string;
}

export const LinkedListSection: React.FC<LinkedListSectionProps> = ({ id }) => {
  const [type, setType] = useState('sll');
  const [list, setList] = useState<(string | number)[]>([10, "Node", 30, "Tail"]);
  const [val, setVal] = useState('');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [msg, setMsg] = useState('Idle');
  const [searchVal, setSearchVal] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const stopRef = useRef(false);

  const proceed = async (delay = 400) => {
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) {
      await new Promise<void>((resolve, reject) => {
        nextStepRef.current = resolve;
        const checkStop = () => {
          if (stopRef.current) { reject(new Error("STOPPED")); } else { setTimeout(checkStop, 10); }
        };
        checkStop();
      });
    } else {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, delay / ((window as any).__SPEED_FACTOR__ || 1));
        const checkStop = () => {
          if (stopRef.current) { clearTimeout(timeout); reject(new Error("STOPPED")); } else { setTimeout(checkStop, 10); }
        };
        checkStop();
      });
    }
  };

  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };
  const insertTail = () => { if (list.length >= 10) { alert("Max input size is 10"); return; } if(val !== ""){setList([...list, parseValue(val)]); setVal('');} };
  const deleteHead = () => { if(list.length) setList(list.slice(1)); };

  const search = async () => {
    const t = parseValue(searchVal);
    if (t === "") return;
    setMsg(`Searching for ${t}...`);
    setIsSearching(true);
    stopRef.current = false;
    try {
      for(let i=0; i<list.length; i++) {
        setActiveIdx(i);
        await proceed();
        if(list[i] === t) {
          setMsg(`Found ${t} at Index ${i}`);
          setIsSearching(false);
          return;
        }
      }
      setMsg('Value not found');
    } catch (e) {
      setMsg('Search Aborted');
    }
    setActiveIdx(null);
    setIsSearching(false);
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
        <SectionHeader title="Linked Lists" subtitle="Dynamic Node Structures." icon={GitBranch} index="02" accent={ACCENT} />

        {/* Type selector */}
        <div className="bg-[var(--bg-primary)] p-1 rounded-lg flex border border-[var(--border-color)]">
          {['sll', 'dll', 'cll'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="flex-1 py-2 text-[10px] font-bold uppercase rounded transition-all"
              style={{
                background: type === t ? ACCENT_HEX : 'transparent',
                color: type === t ? 'black' : 'var(--text-secondary)',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <ComplexityHUD data={LL_COMPLEXITY[type as keyof typeof LL_COMPLEXITY]} accent={ACCENT} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />

        <div className="space-y-4 mt-auto">
          <Input value={val} onChange={setVal} placeholder="Value (Str/Num)" accent={ACCENT} />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={insertTail} icon={Plus} disabled={isSearching} accent={ACCENT}>Add Node</Button>
            <Button onClick={deleteHead} variant="danger" icon={Trash2} disabled={isSearching}>Del Head</Button>
          </div>
          <div className="flex gap-2">
            <Input value={searchVal} onChange={setSearchVal} placeholder="Search Val" accent={ACCENT} />
            {!isSearching ? (
              <Button onClick={search} icon={SearchIcon} accent={ACCENT}>Find</Button>
            ) : (
              <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle}>Stop</Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={() => setList(Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 10))} variant="secondary" icon={Dices} disabled={isSearching}>Randomize</Button>
            <Button onClick={() => setList([])} variant="danger" icon={Trash2} disabled={isSearching}>Clear All</Button>
          </div>
          <div
            className="p-3 rounded-lg text-xs font-mono"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <span style={{ color: ACCENT_HEX }} className="font-bold mr-2">{'>'}</span>{msg}
          </div>
        </div>
      </div>

      {/* RIGHT: Canvas */}
      <div
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex items-center justify-center p-6 md:p-12 overflow-x-auto"
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
        {/* Linked list nodes */}
        <div className="flex items-center flex-wrap gap-0 justify-center max-w-4xl relative z-10">
          <AnimatePresence>
            {list.map((node, i) => (
              <div key={`${i}-${node}`} className="flex items-center">
                {/* Node card — value | pointer */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: activeIdx === i ? 1.06 : 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex overflow-hidden"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${activeIdx === i ? `${ACCENT_HEX}60` : 'var(--border-color)'}`,
                    background: activeIdx === i ? 'rgba(167,139,250,0.08)' : 'var(--bg-elevated)',
                    boxShadow: activeIdx === i ? '0 0 20px rgba(167,139,250,0.15)' : 'none',
                  }}
                >
                  {/* Value cell */}
                  <div
                    className="w-16 h-12 flex items-center justify-center font-mono font-bold text-base"
                    style={{ color: activeIdx === i ? ACCENT_HEX : 'var(--text-primary)' }}
                  >
                    {node}
                  </div>
                  {/* Pointer cell */}
                  <div
                    className="w-10 h-12 flex items-center justify-center"
                    style={{
                      borderLeft: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: i < list.length - 1 ? ACCENT_HEX : 'var(--text-muted)' }}
                    />
                  </div>
                </motion.div>

                {/* Arrow connector */}
                {i < list.length - 1 && (
                  <div className="flex items-center mx-1">
                    <div className="h-px w-6" style={{ background: 'var(--border-active)' }} />
                    <div
                      className="w-0 h-0"
                      style={{
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderLeft: '5px solid var(--border-active)',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
