import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Plus, Trash2, Play, RotateCcw } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, wait } from '../../lib/utils';

const SCHED_COMPLEXITY = { fcfs: { time: { best: 'Ω(n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)' }, sjf: { time: { best: 'Ω(n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)' }, rr: { time: { best: 'Ω(n)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)' }, prio: { time: { best: 'Ω(n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)' } };

interface Job {
  id: string;
  a: number;
  b: number;
  p: number;
}

interface SchedulingSectionProps {
  id: string;
}

export const SchedulingSection: React.FC<SchedulingSectionProps> = ({ id }) => {
  const [algo, setAlgo] = useState('fcfs');
  const [jobs, setJobs] = useState<Job[]>([{id:'P1',a:0,b:5,p:2},{id:'P2',a:2,b:3,p:1},{id:'P3',a:4,b:2,p:3},{id:'P4',a:5,b:4,p:2}]);
  const [newId, setNewId] = useState(''); const [newArr, setNewArr] = useState(''); const [newBurst, setNewBurst] = useState(''); const [newPrio, setNewPrio] = useState('');
  const [timeline, setTimeline] = useState<{id: string, color: string}[]>([]); const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [running, setRunning] = useState(false); const [quantum, setQuantum] = useState('2');
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async () => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(200); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const addJob = () => { if(!newId || !newArr || !newBurst) return; setJobs([...jobs, { id: newId, a: parseInt(newArr), b: parseInt(newBurst), p: parseInt(newPrio) || 0 }]); setNewId(''); setNewArr(''); setNewBurst(''); setNewPrio(''); };
  const deleteJob = (idx: number) => { setJobs(jobs.filter((_, i) => i !== idx)); };
  
  const runFullSolver = (inputJobs: Job[], alg: string, q: number) => {
      let pool = inputJobs.map(j => ({...j, rem: j.b, done: false, end: -1, start: -1}));
      let time = 0; let tl = []; let complete = 0;
      let readyQ: any[] = [];
      let safeGuard = 0;
      while(complete < pool.length && safeGuard < 1000) {
          safeGuard++;
          pool.forEach(j => { if(j.a <= time && !j.done && !readyQ.includes(j)) readyQ.push(j); });
          if(readyQ.length === 0) { tl.push({id:'IDLE', color:'bg-neutral-500'}); time++; continue; }
          if(alg === 'sjf') readyQ.sort((a,b) => a.rem - b.rem);
          if(alg === 'prio') readyQ.sort((a,b) => a.p - b.p);
          let current = readyQ[0];
          if(alg === 'rr') readyQ.shift(); 
          let runTime = alg === 'rr' ? Math.min(current.rem, q) : 1; 
          if(alg !== 'rr') { runTime = 1; readyQ.shift(); }
          for(let k=0; k<runTime; k++) { tl.push({id:current.id, color:'bg-cyan-500'}); }
          time += runTime; current.rem -= runTime;
          if(current.rem === 0) { current.done = true; current.end = time; complete++; } 
          else { readyQ.push(current); }
      }
      return { timeline: tl, results: pool.map(p=>({id:p.id, ct:p.end, tat:p.end-p.a, wt:(p.end-p.a)-p.b})), metrics: {avgWT:0, avgTAT:0, throughput:0} };
  };

  const run = async () => { if(running) return; setRunning(true); setTimeline([]); const res = runFullSolver(jobs, algo, parseInt(quantum)||2); 
    for(const block of res.timeline) { setTimeline(p => [...p, block]); await proceed(); }
    setCompletedJobs(res.results); setRunning(false);
  };

  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
      {/* LEFT: 30% Panel */}
      <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-6 flex flex-col gap-6`}>
          <SectionHeader title="CPU Scheduling" subtitle="OS Management" icon={Cpu} index="08" />
          <Select value={algo} onChange={setAlgo} options={[ {value:'fcfs',label:'FCFS'}, {value:'sjf',label:'Shortest Job First'}, {value:'rr',label:'Round Robin'}, {value:'prio',label:'Priority'} ]} />
          {algo === 'rr' && <div className="space-y-1"><label className="text-[10px] text-[var(--text-muted)] font-bold">Time Quantum</label><Input value={quantum} onChange={setQuantum} placeholder="2" /></div>}
          <ComplexityHUD data={SCHED_COMPLEXITY[algo as keyof typeof SCHED_COMPLEXITY]} />
          <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
          <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] space-y-2">
              <div className="flex gap-1"><Input value={newId} onChange={setNewId} placeholder="ID" className="w-12" /><Input value={newArr} onChange={setNewArr} placeholder="AT" /><Input value={newBurst} onChange={setNewBurst} placeholder="BT" /><Button onClick={addJob} icon={Plus} >Add</Button></div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[200px] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
              <table className="w-full text-[10px] text-left text-[var(--text-muted)]">
                  <thead className="bg-[var(--bg-panel)] text-[var(--text-main)] sticky top-0"><tr><th className="p-2">ID</th><th>AT</th><th>BT</th><th>Action</th></tr></thead>
                  <tbody>{jobs.map((j, i) => (<tr key={i} className="border-b border-[var(--border-color)]"><td className="p-2">{j.id}</td><td>{j.a}</td><td>{j.b}</td><td><button onClick={()=>deleteJob(i)}><Trash2 size={12}/></button></td></tr>))}</tbody>
              </table>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <Button onClick={run} icon={Play} disabled={running}>Run</Button>
              <Button onClick={()=>{setTimeline([]); setCompletedJobs([]);}} variant="secondary" icon={RotateCcw}>Reset</Button>
          </div>
      </div>
      {/* RIGHT: 70% Visualization */}
      <div className={`w-full lg:w-[70%] ${THEME.canvas} flex flex-col items-center justify-start p-10`}>
          <GridBackground />
          <div className="w-full max-w-3xl">
              <div className="flex h-16 w-full bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-color)] relative">
                  <AnimatePresence>
                      {timeline.map((block, i) => (
                          <motion.div key={i} initial={{opacity:0,width:0}} animate={{opacity:1,width:40}} className={cn("h-full border-r border-[var(--bg-secondary)] flex items-center justify-center text-xs text-white font-mono", block.color)}>{block.id}</motion.div>
                      ))}
                  </AnimatePresence>
              </div>
          </div>
      </div>
    </section>
  );
};
