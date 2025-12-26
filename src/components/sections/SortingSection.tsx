import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Terminal, Plus, Trash2, RotateCcw, Play, StopCircle } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const SORT_COMPLEXITY = { 
  bubble: { time: { best: 'Ω(1)', avg: 'Θ(n²)', worst: 'O(n²)' }, space: 'O(1)', note: 'Comparison swapping.' }, 
  selection: { time: { best: 'Ω(n²)', avg: 'Θ(n²)', worst: 'O(n²)' }, space: 'O(1)', note: 'Min element selection.' }, 
  insertion: { time: { best: 'Ω(n)', avg: 'Θ(n²)', worst: 'O(n²)' }, space: 'O(1)', note: 'Online building.' }, 
  merge: { time: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)', note: 'Divide & Conquer (Stable).' }, 
  quick: { time: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n²)' }, space: 'O(log n)', note: 'Partitioning (Unstable).' }, 
  heap: { time: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(1)', note: 'Heap structure based.' } 
};

const CODE_LOGICS = {
  bubble: "for(i=0..n)\n  for(j=0..n-i-1)\n    if(a[j]>a[j+1]) \n      swap(a[j], a[j+1])",
  selection: "for(i=0..n)\n  min = i\n  for(j=i+1..n)\n    if(a[j]<a[min]) min=j\n  swap(a[i], a[min])",
  insertion: "for(i=1..n)\n  key = a[i], j = i-1\n  while(j>=0 && a[j]>key)\n    a[j+1]=a[j], j--\n  a[j+1]=key",
  merge: "mergeSort(a, l, r):\n  m = (l+r)/2\n  mergeSort(left, m)\n  mergeSort(right, r)\n  merge(left, right)",
  quick: "quickSort(a, low, high):\n  p = partition(a, low, high)\n  quickSort(low, p-1)\n  quickSort(p+1, high)",
  heap: "heapSort(a):\n  buildMaxHeap(a)\n  for(i=n-1..1)\n    swap(a[0], a[i])\n    heapify(a, i, 0)"
};

interface SortingSectionProps {
  id: string;
}

export const SortingSection: React.FC<SortingSectionProps> = ({ id }) => {
  const [algo, setAlgo] = useState('bubble');
  const [arr, setArr] = useState<(string|number)[]>([]);
  const [active, setActive] = useState<number[]>([]);
  const [pivots, setPivots] = useState<number[]>([]);
  const [subLeft, setSubLeft] = useState<number[]>([]);
  const [subRight, setSubRight] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('');
  const nextStepRef = useRef<(() => void) | null>(null);
  const stopRef = useRef(false);

  const proceed = async (delay = 100) => { 
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); 
    else await wait(delay); 
  };

  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const clearHighlights = () => {
    setActive([]);
    setPivots([]);
    setSubLeft([]);
    setSubRight([]);
  };

  useEffect(() => { 
    setArr(Array.from({length: 15}, () => Math.floor(Math.random() * 89) + 10)); 
  }, []);

  const swap = (a: (string|number)[], i: number, j: number) => {
    const temp = a[i]; a[i] = a[j]; a[j] = temp;
  };

  const runBubbleSort = async (a: (string|number)[]) => {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        setActive([j, j + 1]); await proceed(50);
        if (compareValues(a[j], a[j+1]) > 0) { swap(a, j, j + 1); setArr([...a]); }
      }
    }
  };

  const runSelectionSort = async (a: (string|number)[]) => {
    for (let i = 0; i < a.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        setActive([i, j, minIdx]); await proceed(50);
        if (compareValues(a[j], a[minIdx]) < 0) minIdx = j;
      }
      swap(a, i, minIdx); setArr([...a]);
    }
  };

  const runInsertionSort = async (a: (string|number)[]) => {
    for (let i = 1; i < a.length; i++) {
      let key = a[i], j = i - 1;
      setActive([i]); await proceed(50);
      while (j >= 0 && compareValues(a[j], key) > 0) {
        setActive([j, j + 1]); a[j + 1] = a[j]; setArr([...a]); await proceed(50);
        j--;
      }
      a[j + 1] = key; setArr([...a]);
    }
  };

  const runMergeSort = async (a: (string|number)[], l: number, r: number) => {
    if (l >= r) return;
    setActive(Array.from({ length: r - l + 1 }, (_, k) => l + k));
    await proceed(200);
    clearHighlights();
    const m = Math.floor((l + r) / 2);
    await runMergeSort(a, l, m);
    await runMergeSort(a, m + 1, r);
    setSubLeft(Array.from({length: m - l + 1}, (_, k) => l + k));
    setSubRight(Array.from({length: r - m}, (_, k) => m + 1 + k));
    await proceed(150);
    let leftArr = a.slice(l, m + 1), rightArr = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < leftArr.length && j < rightArr.length) {
      setActive([k]); await proceed(50);
      if (compareValues(leftArr[i], rightArr[j]) <= 0) a[k] = leftArr[i++];
      else a[k] = rightArr[j++];
      setArr([...a]); k++;
    }
    while (i < leftArr.length) { a[k++] = leftArr[i++]; setArr([...a]); await proceed(30); }
    while (j < rightArr.length) { a[k++] = rightArr[j++]; setArr([...a]); await proceed(30); }
    setSubLeft([]); setSubRight([]);
  };

  const partition = async (a: (string|number)[], low: number, high: number) => {
    let pivot = a[high];
    setPivots([high]);
    setSubLeft(Array.from({length: high - low + 1}, (_, k) => low + k));
    await proceed(100);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      setActive([j]); await proceed(50);
      if (compareValues(a[j], pivot) < 0) {
        i++; swap(a, i, j); setArr([...a]);
      }
    }
    swap(a, i + 1, high); setArr([...a]);
    setSubLeft([]);
    return i + 1;
  };

  const runQuickSort = async (a: (string|number)[], low: number, high: number) => {
    if (low < high) {
      let pi = await partition(a, low, high);
      await runQuickSort(a, low, pi - 1);
      await runQuickSort(a, pi + 1, high);
    }
  };

  const heapify = async (a: (string|number)[], n: number, i: number) => {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    setActive([i, l, r]); await proceed(50);
    if (l < n && compareValues(a[l], a[largest]) > 0) largest = l;
    if (r < n && compareValues(a[r], a[largest]) > 0) largest = r;
    if (largest !== i) {
      swap(a, i, largest); setArr([...a]);
      await heapify(a, n, largest);
    }
  };

  const runHeapSort = async (a: (string|number)[]) => {
    let n = a.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(a, n, i);
    for (let i = n - 1; i > 0; i--) {
      swap(a, 0, i); setArr([...a]);
      await heapify(a, i, 0);
    }
  };

  const handleRunSort = async () => {
    setSorting(true);
    stopRef.current = false;
    clearHighlights();
    const a = [...arr];
    try {
      switch (algo) {
        case 'bubble': await runBubbleSort(a); break;
        case 'selection': await runSelectionSort(a); break;
        case 'insertion': await runInsertionSort(a); break;
        case 'merge': await runMergeSort(a, 0, a.length - 1); break;
        case 'quick': await runQuickSort(a, 0, a.length - 1); break;
        case 'heap': await runHeapSort(a); break;
        default: break;
      }
    } catch (e) {
      console.log("Sort Aborted");
    } finally {
      setSorting(false);
      clearHighlights();
    }
  };

  const addElement = () => {
    const v = parseValue(val);
    if (v === "" || arr.length >= 20) return;
    setArr([...arr, v]);
    setVal('');
  };

  const removeElement = () => {
    const i = parseInt(idx);
    if (isNaN(i) || i < 0 || i >= arr.length) return;
    setArr(arr.filter((_, x) => x !== i));
    setIdx('');
  };

  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-white/5">
       {/* LEFT: 30% Panel */}
       <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-8 flex flex-col z-20 gap-6`}>
           <SectionHeader title="Sorting Engine" subtitle="Visual Algorithms." icon={BarChart3} index="05" />
           <Select value={algo} onChange={setAlgo} options={[{ value: 'bubble', label: 'Bubble Sort' },{ value: 'selection', label: 'Selection Sort' },{ value: 'insertion', label: 'Insertion Sort' },{ value: 'merge', label: 'Merge Sort' },{ value: 'quick', label: 'Quick Sort' },{ value: 'heap', label: 'Heap Sort' }]} />
           <ComplexityHUD data={SORT_COMPLEXITY[algo as keyof typeof SORT_COMPLEXITY]} />

           <div className="bg-black/30 border border-white/5 rounded-xl p-4 font-mono">
              <div className="flex items-center gap-2 mb-3 text-[10px] text-cyan-400 font-bold uppercase tracking-widest"><Terminal size={12}/> Logic Matrix</div>
              <pre className="text-[10px] text-neutral-400 leading-relaxed overflow-x-auto">
                {CODE_LOGICS[algo as keyof typeof CODE_LOGICS]}
              </pre>
           </div>

           <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
           
           <div className="space-y-4 pt-4 border-t border-white/5">
             <div className="grid grid-cols-[1fr_60px] gap-2">
               <Input value={val} onChange={setVal} placeholder="Value"/>
               <Input value={idx} onChange={setIdx} placeholder="Idx" />
             </div>
             <div className="grid grid-cols-2 gap-2">
               <Button onClick={addElement} icon={Plus} disabled={sorting}>Add</Button>
               <Button onClick={removeElement} variant="danger" icon={Trash2} disabled={sorting}>Remove</Button>
             </div>
           </div>

           <div className="space-y-3 mt-auto">
            <Button onClick={() => setArr(Array.from({length: 15}, () => Math.floor(Math.random() * 89) + 10))} variant="secondary" icon={RotateCcw} disabled={sorting} className="w-full">Shuffle Array</Button>
            {!sorting ? (
              <Button onClick={handleRunSort} icon={Play} className="w-full">Start Sort</Button>
            ) : (
              <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle} className="w-full">Stop Process</Button>
            )}
           </div>
       </div>
       {/* RIGHT: 70% Visualization */}
       <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-end justify-center px-10 pb-20`}>
           <GridBackground />
           <div className="flex items-end gap-2 h-[400px] w-full max-w-5xl">
              {arr.map((v, i) => {
                const isActive = active.includes(i);
                const isPivot = pivots.includes(i);
                const isL = subLeft.includes(i);
                const isR = subRight.includes(i);
                let colorClass = "bg-white/80";
                if (isPivot) colorClass = "bg-purple-500";
                else if (isActive) colorClass = "bg-rose-500";
                else if (isL) colorClass = "bg-cyan-500/60";
                else if (isR) colorClass = "bg-amber-500/60";
                return (
                  <motion.div 
                    key={i} layout 
                    className={cn("flex-1 rounded-t-md transition-all duration-300 flex items-center justify-center overflow-hidden border-x border-white/5", colorClass)} 
                    style={{ height: typeof v === 'number' ? `${v}%` : '50%' }} 
                  >
                    {typeof v === 'string' && <span className="text-[10px] text-black font-bold -rotate-90">{v}</span>}
                  </motion.div>
                )
              })}
           </div>
       </div>
    </section>
  )
};
