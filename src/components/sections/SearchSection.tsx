import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Play, StopCircle } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const SEARCH_COMPLEXITY = { linear: { time: { best: 'Ω(1)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(1)', note: 'Unsorted.' }, binary: { time: { best: 'Ω(1)', avg: 'Θ(log n)', worst: 'O(log n)' }, space: 'O(1)', note: 'Sorted.' } };

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
    const nextStepRef = useRef<(() => void) | null>(null);
    const stopRef = useRef(false);

    const proceed = async () => { 
      if (stopRef.current) throw new Error("STOPPED");
      if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); 
      else await wait(500); 
    };

    const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

    useEffect(() => { 
      const a = ["A", "Z", 10, 45, "M", 90, "Beta", "Alpha", 5]; 
      if(algo==='binary') {
        a.sort(compareValues);
      }
      setArr(a); setBounds(null); setActive(null); 
    }, [algo]);
    
    const runLinear = async () => { 
      const t = parseValue(target); if(t === "") return;
      setIsSearching(true); stopRef.current = false;
      try {
        for(let i=0;i<arr.length;i++){
          setActive(i); setStatus(`Scanning Index ${i}`); 
          await proceed(); 
          if(arr[i] === t){setStatus(`Found at Index ${i}`); setIsSearching(false); return;}
        } 
        setStatus('Not Found');
      } catch (e) { setStatus('Scan Terminated'); }
      setActive(null); setIsSearching(false);
    };

    const runBinary = async () => { 
      const t = parseValue(target); if(t === "") return;
      setIsSearching(true); stopRef.current = false;
      try {
        let l=0,h=arr.length-1; 
        while(l<=h){
          let m=Math.floor((l+h)/2); 
          setBounds({l,m,h}); 
          await proceed(); 
          const comparison = compareValues(arr[m], t);
          if(comparison === 0){setStatus(`Found at Index ${m}`); setIsSearching(false); return;} 
          else if(comparison < 0) l=m+1; else h=m-1;
        } 
        setStatus('Not Found');
      } catch (e) { setStatus('Scan Terminated'); }
      setBounds(null); setIsSearching(false);
    };

    return (
        <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
             {/* LEFT: 30% Panel */}
             <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-8 flex flex-col z-20 gap-8`}>
                 <SectionHeader title="Searching" subtitle="Data Retrieval." icon={SearchIcon} index="03" />
                 <Select value={algo} onChange={setAlgo} options={[{value:'linear',label:'Linear Search'}, {value:'binary',label:'Binary Search'}]} />
                 <ComplexityHUD data={SEARCH_COMPLEXITY[algo as keyof typeof SEARCH_COMPLEXITY]} />
                 <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
                 <div className="space-y-4 mt-auto">
                   <Input value={target} onChange={setTarget} placeholder="Search (e.g. Alpha or 45)"/>
                   {!isSearching ? (
                     <Button onClick={algo==='linear'?runLinear:runBinary} icon={Play} className="w-full">Initiate Scan</Button>
                   ) : (
                     <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle} className="w-full">Abort Scan</Button>
                   )}
                 </div>
                 <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl font-mono text-xs text-[var(--text-secondary)] shadow-inner"><span className="text-cyan-500 font-bold mr-2">{'>'}</span>{status}</div>
             </div>
             {/* RIGHT: 70% Visualization */}
             <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-center justify-center p-4 md:p-10`}>
                <GridBackground />
                <div className="flex gap-3 flex-wrap justify-center max-w-5xl">
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
                            high ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)] z-10" : "bg-[var(--card-bg)] border-[var(--border-color)]"
                          )}
                        >
                          <span className={cn(high ? "text-cyan-400" : "text-[var(--text-primary)]")}>{v}</span>
                          <span className="absolute bottom-1 text-[8px] text-[var(--text-secondary)] opacity-50 font-mono">#{i}</span>
                        </motion.div>
                      )
                   })}
                </div>
             </div>
        </section>
    )
}
