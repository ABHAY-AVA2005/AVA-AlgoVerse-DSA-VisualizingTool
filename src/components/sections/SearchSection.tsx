import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Play, StopCircle, Dices, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { CodePanel } from '../ui/CodePanel';
import { soundEngine } from '../../lib/SoundEngine';
import { cn, parseValue, compareValues } from '../../lib/utils';

const ACCENT = 'var(--accent-search)';
const ACCENT_HEX = '#34D399';

const SEARCH_COMPLEXITY = {
  linear: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(1)', note: 'Unsorted.' },
  binary: { time: { best: 'Ω(1)', avg: 'Θ(log n)', worst: 'O(log n)' }, space: 'O(1)', note: 'Sorted.' }
};

const CODE_SNIPPETS: Record<string, string[]> = {
  linear: [
    "int linearSearch(int[] arr, int target) {",
    "    for (int i = 0; i < arr.length; i++) {",
    "        if (arr[i] == target) {",
    "            return i;",
    "        }",
    "    }",
    "    return -1;",
    "}"
  ],
  binary: [
    "int binarySearch(int[] arr, int target) {",
    "    int l = 0, h = arr.length - 1;",
    "    while (l <= h) {",
    "        int m = l + (h - l) / 2;",
    "        if (arr[m] == target) return m;",
    "        if (arr[m] < target) l = m + 1;",
    "        else h = m - 1;",
    "    }",
    "    return -1;",
    "}"
  ]
};

interface SearchSectionProps {
  id: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ id }) => {
    const [algo, setAlgo] = useState('linear');
    const [arr, setArr] = useState<(string | number)[]>([]);
    const [target, setTarget] = useState('');
    const [active, setActive] = useState<number | null>(null);
    const [bounds, setBounds] = useState<{l: number, m: number, h: number} | null>(null);
    const [status, setStatus] = useState('System Idle');
    const [isSearching, setIsSearching] = useState(false);
    const [stepMode, setStepMode] = useState(false);
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const nextStepRef = useRef<(() => void) | null>(null);
    const stopRef = useRef(false);

    const proceed = async (delay = 500) => {
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

    useEffect(() => {
      const a = ["A", "Z", 10, 45, "M", 90, "Beta", "Alpha", 5];
      if(algo==='binary') { a.sort(compareValues); }
      setArr(a); setBounds(null); setActive(null);
    }, [algo]);

    const runLinear = async () => {
      const t = parseValue(target); if(t === "") return;
      setIsSearching(true); stopRef.current = false;
      setActiveLine(0); await proceed(10);
      try {
        setActiveLine(1); await proceed(10);
        for(let i=0;i<arr.length;i++){
          setActiveLine(2);
          setActive(i); setStatus(`Scanning Index ${i}`);
          if (typeof arr[i] === 'number') soundEngine.playValue(arr[i] as number);
          await proceed();
          if(arr[i] === t){
            setActiveLine(3); await proceed(10);
            setStatus(`Found at Index ${i}`); setIsSearching(false); 
            soundEngine.playSuccess();
            return;
          }
        }
        setActiveLine(6); await proceed(10);
        setStatus('Not Found');
      } catch (e) { setStatus('Scan Terminated'); }
      setActive(null); setIsSearching(false);
      setActiveLine(null);
    };

    const runBinary = async () => {
      const t = parseValue(target); if(t === "") return;
      setIsSearching(true); stopRef.current = false;
      setActiveLine(0); await proceed(10);
      try {
        setActiveLine(1); await proceed(10);
        let l=0,h=arr.length-1;
        while(l<=h){
          setActiveLine(2); await proceed(10);
          let m=Math.floor((l+h)/2);
          setActiveLine(3); await proceed(10);
          setBounds({l,m,h});
          if (typeof arr[m] === 'number') soundEngine.playValue(arr[m] as number);
          await proceed();
          const comparison = compareValues(arr[m], t);
          setActiveLine(4); await proceed(10);
          if(comparison === 0){
             setStatus(`Found at Index ${m}`); setIsSearching(false); 
             soundEngine.playSuccess();
             return;
          }
          else if(comparison < 0) { setActiveLine(5); l=m+1; await proceed(10); } 
          else { setActiveLine(6); h=m-1; await proceed(10); }
        }
        setActiveLine(8); await proceed(10);
        setStatus('Not Found');
      } catch (e) { setStatus('Scan Terminated'); }
      setBounds(null); setIsSearching(false);
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
                 <SectionHeader title="Searching" subtitle="Data Retrieval." icon={SearchIcon} index="03" accent={ACCENT} />
                 <Select value={algo} onChange={setAlgo} options={[{value:'linear',label:'Linear Search'}, {value:'binary',label:'Binary Search'}]} />
                 <ComplexityHUD data={SEARCH_COMPLEXITY[algo as keyof typeof SEARCH_COMPLEXITY]} accent={ACCENT} />
                 <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
                 <div className="space-y-4 mt-auto">
                   <Input value={target} onChange={setTarget} placeholder="Search (e.g. Alpha or 45)" accent={ACCENT} />
                   {!isSearching ? (
                     <Button onClick={algo==='linear'?runLinear:runBinary} icon={Play} className="w-full" accent={ACCENT}>Initiate Scan</Button>
                   ) : (
                     <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle} className="w-full">Abort Scan</Button>
                   )}
                 </div>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                   <Button onClick={() => setArr(Array.from({length: 10}, () => Math.floor(Math.random() * 90) + 10).sort((a,b)=>a-b))} variant="secondary" icon={Dices} disabled={isSearching}>Randomize</Button>
                   <Button onClick={() => setArr([])} variant="danger" icon={Trash2} disabled={isSearching}>Clear All</Button>
                 </div>
                 <div
                   className="p-4 rounded-xl font-mono text-xs shadow-inner"
                   style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                 >
                   <span style={{ color: ACCENT_HEX }} className="font-bold mr-2">{'>'}</span>{status}
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
                   {CODE_SNIPPETS[algo] && (
                     <div className="z-30 w-full flex justify-center mb-10">
                       <CodePanel code={CODE_SNIPPETS[algo]} activeLine={activeLine} accent={ACCENT} />
                     </div>
                   )}

                   <div className="flex gap-3 flex-wrap justify-center max-w-5xl relative z-10 mt-auto">
                      {arr.map((v,i)=>{
                         let dim=false,high=false;
                         if(algo==='binary'&&bounds){if(i<bounds.l||i>bounds.h)dim=true; if(i===bounds.m)high=true;}
                         else if(algo==='linear'&&i===active)high=true;
                         return (
                           <motion.div
                             key={i}
                             animate={{opacity:dim?0.2:1,scale:high?1.2:1}}
                             className={cn(
                               "w-14 h-14 border flex flex-col items-center justify-center rounded-xl font-mono font-bold relative transition-all duration-300",
                             )}
                             style={{
                               background: high ? `${ACCENT_HEX}20` : 'var(--bg-elevated)',
                               border: `1px solid ${high ? `${ACCENT_HEX}80` : 'var(--border-color)'}`,
                               boxShadow: high ? `0 0 20px ${ACCENT_HEX}40` : 'none',
                             }}
                           >
                             <span style={{ color: high ? ACCENT_HEX : 'var(--text-primary)' }}>{v}</span>
                             <span className="absolute bottom-1 text-[8px] opacity-50 font-mono" style={{ color: 'var(--text-secondary)' }}>#{i}</span>
                           </motion.div>
                         )
                      })}
                   </div>
                </div>
             </div>
        </section>
    );
};
