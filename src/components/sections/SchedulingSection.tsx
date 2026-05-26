import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Trash2, Play, RotateCcw, Dices } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { CodePanel } from '../ui/CodePanel';
import { soundEngine } from '../../lib/SoundEngine';
import { cn, wait } from '../../lib/utils';

const ACCENT = 'var(--accent-sched)';
const ACCENT_HEX = '#E879F9';

const SCHED_COMPLEXITY = { fcfs: { time: { best: 'Ω(n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)' }, sjf: { time: { best: 'Ω(n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)' }, rr: { time: { best: 'Ω(n)', avg: 'Θ(n)', worst: 'O(n)' }, space: 'O(n)' }, prio: { time: { best: 'Ω(n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)' } };

const CODE_SNIPPETS: Record<string, string[]> = {
  fcfs: [
    "void scheduleFCFS(List<Job> readyQueue) {",
    "    Job curr = readyQueue.get(0);",
    "    execute(curr);",
    "    if (curr.isDone()) {",
    "        readyQueue.remove(curr);",
    "    }",
    "}"
  ],
  sjf: [
    "void scheduleSJF(List<Job> readyQueue) {",
    "    readyQueue.sort((a, b) -> a.burst - b.burst);",
    "    Job curr = readyQueue.get(0);",
    "    execute(curr);",
    "    if (curr.isDone()) {",
    "        readyQueue.remove(curr);",
    "    }",
    "}"
  ],
  rr: [
    "void scheduleRR(List<Job> readyQueue, int quantum) {",
    "    Job curr = readyQueue.remove(0);",
    "    int runTime = Math.min(curr.rem, quantum);",
    "    execute(curr, runTime);",
    "    if (!curr.isDone()) {",
    "        readyQueue.add(curr);",
    "    }",
    "}"
  ],
  prio: [
    "void schedulePriority(List<Job> readyQueue) {",
    "    readyQueue.sort((a, b) -> a.priority - b.priority);",
    "    Job curr = readyQueue.get(0);",
    "    execute(curr);",
    "    if (curr.isDone()) {",
    "        readyQueue.remove(curr);",
    "    }",
    "}"
  ]
};

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
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const nextStepRef = useRef<(() => void) | null>(null);
  const proceed = async (delay = 200) => { if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); else await wait(delay / ((window as any).__SPEED_FACTOR__ || 1)); };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const addJob = () => { if(!newId || !newArr || !newBurst) return; setJobs([...jobs, { id: newId, a: parseInt(newArr), b: parseInt(newBurst), p: parseInt(newPrio) || 0 }]); setNewId(''); setNewArr(''); setNewBurst(''); setNewPrio(''); };
  const deleteJob = (idx: number) => { setJobs(jobs.filter((_, i) => i !== idx)); };
  
  const run = async () => { 
    if(running) return; setRunning(true); setTimeline([]); setCompletedJobs([]);
    let pool = jobs.map(j => ({...j, rem: j.b, done: false, end: -1, start: -1}));
    let time = 0; let complete = 0;
    let readyQ: any[] = [];
    let safeGuard = 0;
    
    while(complete < pool.length && safeGuard < 1000) {
        safeGuard++;
        setActiveLine(0); await proceed(50);
        pool.forEach(j => { if(j.a <= time && !j.done && !readyQ.includes(j)) readyQ.push(j); });
        
        if(readyQ.length === 0) { 
           setTimeline(p => [...p, {id:'IDLE', color:'bg-neutral-500'}]); 
           time++; 
           await proceed(100);
           continue; 
        }
        
        if (algo === 'sjf') { setActiveLine(1); await proceed(100); readyQ.sort((a,b) => a.rem - b.rem); }
        if (algo === 'prio') { setActiveLine(1); await proceed(100); readyQ.sort((a,b) => a.p - b.p); }
        
        setActiveLine(algo === 'fcfs' ? 1 : 2); await proceed(100);
        let current = readyQ[0];
        
        let runTime = 1;
        if(algo === 'rr') {
            setActiveLine(1); await proceed(100);
            readyQ.shift(); 
            setActiveLine(2); await proceed(100);
            runTime = Math.min(current.rem, parseInt(quantum)); 
        } else {
            readyQ.shift();
        }
        
        setActiveLine(algo === 'fcfs' ? 2 : 3); await proceed(100);
        
        for(let k=0; k<runTime; k++) { 
           setTimeline(p => [...p, {id:current.id, color:'bg-cyan-500'}]); 
           const noteId = parseInt(current.id.replace('P', '')) || 1;
           soundEngine.playValue(noteId * 20);
           await proceed(200);
        }
        
        time += runTime; current.rem -= runTime;
        
        setActiveLine(algo === 'rr' ? 4 : (algo === 'fcfs' ? 3 : 4)); await proceed(100);
        
        if(current.rem === 0) { 
           if (algo !== 'rr') { setActiveLine(algo === 'fcfs' ? 4 : 5); await proceed(100); }
           current.done = true; current.end = time; complete++; 
        } else { 
           if (algo === 'rr') { setActiveLine(5); await proceed(100); readyQ.push(current); }
           else { readyQ.push(current); }
        }
    }
    
    setCompletedJobs(pool.map(p=>({id:p.id, ct:p.end, tat:p.end-p.a, wt:(p.end-p.a)-p.b})));
    setActiveLine(null);
    setRunning(false);
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
          <SectionHeader title="CPU Scheduling" subtitle="OS Management." icon={Clock} index="09" accent={ACCENT} />
          <Select value={algo} onChange={setAlgo} options={[ {value:'fcfs',label:'FCFS'}, {value:'sjf',label:'Shortest Job First'}, {value:'rr',label:'Round Robin'}, {value:'prio',label:'Priority'} ]} />
          {algo === 'rr' && <div className="space-y-1"><label className="text-[10px] text-[var(--text-muted)] font-bold">Time Quantum</label><Input value={quantum} onChange={setQuantum} placeholder="2" /></div>}
          <ComplexityHUD data={SCHED_COMPLEXITY[algo as keyof typeof SCHED_COMPLEXITY]} accent={ACCENT} />
          <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
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
              <Button onClick={run} icon={Play} disabled={running} accent={ACCENT}>Run</Button>
              <Button onClick={()=>{setTimeline([]); setCompletedJobs([]);}} variant="secondary" icon={RotateCcw}>Reset</Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={() => setJobs(Array.from({length: 4}, (_,i) => ({id: `P${i+1}`, a: Math.floor(Math.random()*5), b: Math.floor(Math.random()*6)+2, p: Math.floor(Math.random()*4)+1})))} variant="secondary" icon={Dices}>Randomize</Button>
            <Button onClick={() => {setJobs([]); setTimeline([]); setCompletedJobs([]);}} variant="danger" icon={Trash2} disabled={running}>Clear All</Button>
          </div>
      </div>
      {/* RIGHT: Canvas */}
      <div
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex flex-col items-center justify-center p-10 overflow-hidden"
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
          
          {/* Code Panel */}
          {CODE_SNIPPETS[algo] && (
            <div className="absolute bottom-8 left-8 z-30">
              <CodePanel code={CODE_SNIPPETS[algo]} activeLine={activeLine} accent={ACCENT} />
            </div>
          )}

          <div className="w-full max-w-3xl relative z-10">
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
