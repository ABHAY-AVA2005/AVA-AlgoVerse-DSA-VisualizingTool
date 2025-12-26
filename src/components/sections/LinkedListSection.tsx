import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Plus, Trash2, Search as SearchIcon, StopCircle } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait } from '../../lib/utils';

const LL_COMPLEXITY = { sll: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)', note: 'Singly Linked.' }, dll: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)', note: 'Doubly Linked.' }, cll: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)', note: 'Circular.' } };

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

  const proceed = async () => { 
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); 
    else await wait(400); 
  };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };
  const insertTail = () => { if(val !== ""){setList([...list, parseValue(val)]); setVal('');}};
  const deleteHead = () => { if(list.length)setList(list.slice(1));};
  
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
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
       {/* LEFT: 30% Panel */}
       <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-8 flex flex-col z-20 gap-6`}>
         <SectionHeader title="Linked Lists" subtitle="Dynamic Node Structures." icon={GitBranch} index="02" />
         <div className="bg-[var(--bg-primary)] p-1 rounded-lg flex border border-[var(--border-color)]">
            {['sll', 'dll', 'cll'].map(t => (<button key={t} onClick={()=>setType(t)} className={cn("flex-1 py-2 text-[10px] font-bold uppercase rounded", type===t ? "bg-cyan-600 text-white shadow" : "text-[var(--text-secondary)]")}>{t.toUpperCase()}</button>))} 
         </div>
         <ComplexityHUD data={LL_COMPLEXITY[type as keyof typeof LL_COMPLEXITY]} />
         <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
         <div className="space-y-4 mt-auto">
             <Input value={val} onChange={setVal} placeholder="Value (Str/Num)"/>
             <div className="grid grid-cols-2 gap-2"><Button onClick={insertTail} icon={Plus} disabled={isSearching}>Add Node</Button><Button onClick={deleteHead} variant="danger" icon={Trash2} disabled={isSearching}>Del Head</Button></div>
             <div className="flex gap-2">
                <Input value={searchVal} onChange={setSearchVal} placeholder="Search Val"/>
                {!isSearching ? (
                  <Button onClick={search} icon={SearchIcon}>Find</Button>
                ) : (
                  <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle}>Stop</Button>
                )}
             </div>
             <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 rounded-lg text-xs font-mono text-[var(--text-secondary)]"><span className="text-cyan-500 font-bold mr-2">{'>'}</span>{msg}</div>
         </div>
       </div>
       {/* RIGHT: 70% Visualization */}
       <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-center justify-center p-4 md:p-10 overflow-x-auto`}>
           <GridBackground />
           <div className="flex items-center relative pl-10">
                <AnimatePresence>
                  {list.map((v,i)=>( 
                    <motion.div key={`${i}-${v}`} layout initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} exit={{opacity:0,y:30}} className="flex items-center group relative">
                        {i > 0 && <div className="w-16 h-8 flex items-center justify-center -ml-2 mr-2"><div className="w-full h-[2px] bg-[var(--text-secondary)] opacity-50 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-[var(--text-secondary)] rotate-45"></div></div></div>}
                        <div className={cn("relative w-28 h-14 rounded-lg border flex items-center justify-between px-4 z-10 shadow-lg backdrop-blur-md", activeIdx === i ? "border-cyan-500 bg-cyan-500/10 scale-110 shadow-[0_0_20px_rgba(34,211,238,0.3)]" : "bg-[var(--card-bg)] border-[var(--border-color)]")}>
                            <span className={cn("font-mono font-bold text-lg", activeIdx === i ? "text-cyan-500" : "text-[var(--text-primary)]")}>{v}</span>
                            <div className="flex flex-col items-end"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></div></div>
                        </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
           </div>
       </div>
    </section>
  )
}
