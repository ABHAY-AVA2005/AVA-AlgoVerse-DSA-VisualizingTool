import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Terminal, Plus, Trash2, RotateCcw, Play, StopCircle, Dices } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { soundEngine } from '../../lib/SoundEngine';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { CodePanel } from '../ui/CodePanel';
import { cn, parseValue, compareValues } from '../../lib/utils';

const ACCENT = 'var(--accent-sorting)';
const ACCENT_HEX = '#F59E0B';

const SORT_COMPLEXITY = { 
  bubble: { time: { best: 'Ω(1)', avg: 'Θ(n²)', worst: 'O(n²)' }, space: 'O(1)', note: 'Comparison swapping.' }, 
  selection: { time: { best: 'Ω(n²)', avg: 'Θ(n²)', worst: 'O(n²)' }, space: 'O(1)', note: 'Min element selection.' }, 
  insertion: { time: { best: 'Ω(n)', avg: 'Θ(n²)', worst: 'O(n²)' }, space: 'O(1)', note: 'Online building.' }, 
  merge: { time: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(n)', note: 'Divide & Conquer (Stable).' }, 
  quick: { time: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n²)' }, space: 'O(log n)', note: 'Partitioning (Unstable).' }, 
  heap: { time: { best: 'Ω(n log n)', avg: 'Θ(n log n)', worst: 'O(n log n)' }, space: 'O(1)', note: 'Heap structure based.' } 
};

const CODE_SNIPPETS: Record<string, string[]> = {
  bubble: [
    "for (int i = 0; i < n - 1; i++) {",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "        if (arr[j] > arr[j + 1]) {",
    "            swap(arr, j, j + 1);",
    "        }",
    "    }",
    "}"
  ],
  selection: [
    "for (int i = 0; i < n - 1; i++) {",
    "    int minIdx = i;",
    "    for (int j = i + 1; j < n; j++) {",
    "        if (arr[j] < arr[minIdx]) {",
    "            minIdx = j;",
    "        }",
    "    }",
    "    swap(arr, i, minIdx);",
    "}"
  ],
  insertion: [
    "for (int i = 1; i < n; i++) {",
    "    int key = arr[i], j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "        arr[j + 1] = arr[j];",
    "        j--;",
    "    }",
    "    arr[j + 1] = key;",
    "}"
  ],
  merge: [
    "void mergeSort(int[] arr, int l, int r) {",
    "    if (l >= r) return;",
    "    int m = l + (r - l) / 2;",
    "    mergeSort(arr, l, m);",
    "    mergeSort(arr, m + 1, r);",
    "    merge(arr, l, m, r);",
    "}"
  ],
  quick: [
    "void quickSort(int[] arr, int low, int high) {",
    "    if (low < high) {",
    "        int pi = partition(arr, low, high);",
    "        quickSort(arr, low, pi - 1);",
    "        quickSort(arr, pi + 1, high);",
    "    }",
    "}"
  ],
  heap: [
    "void heapSort(int[] arr) {",
    "    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);",
    "    for (int i = n - 1; i > 0; i--) {",
    "        swap(arr, 0, i);",
    "        heapify(arr, i, 0);",
    "    }",
    "}"
  ]
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
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('');
  const nextStepRef = useRef<(() => void) | null>(null);
  const stopRef = useRef(false);

  const proceed = async (delay = 100) => {
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) {
      await new Promise<void>((resolve, reject) => {
        nextStepRef.current = resolve;
        const checkStop = () => {
          if (stopRef.current) {
            reject(new Error("STOPPED"));
          } else {
            setTimeout(checkStop, 10);
          }
        };
        checkStop();
      });
    } else {
      await new Promise<void>((resolve, reject) => {
        const speed = (window as any).__SPEED_FACTOR__ || 1;
        const timeout = setTimeout(resolve, delay / speed);
        const checkStop = () => {
          if (stopRef.current) {
            clearTimeout(timeout);
            reject(new Error("STOPPED"));
          } else {
            setTimeout(checkStop, 10);
          }
        };
        checkStop();
      });
    }
  };

  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const clearHighlights = () => {
    setActive([]);
    setPivots([]);
    setSubLeft([]);
    setSubRight([]);
  };

  useEffect(() => { 
    setArr(Array.from({length: 10}, () => Math.floor(Math.random() * 89) + 10)); 
  }, []);

  const swap = (a: (string|number)[], i: number, j: number) => {
    const temp = a[i]; a[i] = a[j]; a[j] = temp;
  };

  const runBubbleSort = async (a: (string|number)[]) => {
    for (let i = 0; i < a.length; i++) {
      setActiveLine(0); await proceed(10);
      for (let j = 0; j < a.length - i - 1; j++) {
        setActiveLine(1); await proceed(10);
        setActiveLine(2);
        setActive([j, j + 1]);
        if (typeof a[j] === 'number') soundEngine.playValue(a[j] as number);
        await proceed(50);
        if (compareValues(a[j], a[j+1]) > 0) { 
          setActiveLine(3);
          swap(a, j, j + 1); setArr([...a]);
          if (typeof a[j+1] === 'number') soundEngine.playValue(a[j+1] as number);
          await proceed(30);
        }
      }
    }
  };

  const runSelectionSort = async (a: (string|number)[]) => {
    for (let i = 0; i < a.length; i++) {
      setActiveLine(0); await proceed(10);
      let minIdx = i;
      setActiveLine(1); await proceed(10);
      for (let j = i + 1; j < a.length; j++) {
        setActiveLine(2); await proceed(10);
        setActiveLine(3);
        setActive([i, j, minIdx]);
        if (typeof a[j] === 'number') soundEngine.playValue(a[j] as number);
        await proceed(50);
        if (compareValues(a[j], a[minIdx]) < 0) {
          minIdx = j;
          setActiveLine(4); await proceed(30);
        }
      }
      setActiveLine(7);
      swap(a, i, minIdx); setArr([...a]);
      if (typeof a[minIdx] === 'number') soundEngine.playValue(a[minIdx] as number);
      await proceed(30);
    }
  };

  const runInsertionSort = async (a: (string|number)[]) => {
    for (let i = 1; i < a.length; i++) {
      setActiveLine(0); await proceed(10);
      let key = a[i], j = i - 1;
      setActiveLine(1);
      setActive([i]);
      if (typeof key === 'number') soundEngine.playValue(key as number);
      await proceed(50);
      while (j >= 0 && compareValues(a[j], key) > 0) {
        setActiveLine(2); await proceed(10);
        setActiveLine(3);
        setActive([j, j + 1]); a[j + 1] = a[j]; setArr([...a]);
        if (typeof a[j] === 'number') soundEngine.playValue(a[j] as number);
        await proceed(50);
        setActiveLine(4);
        j--;
        await proceed(10);
      }
      setActiveLine(6);
      a[j + 1] = key; setArr([...a]);
      await proceed(30);
    }
  };

  const runMergeSort = async (a: (string|number)[], l: number, r: number) => {
    setActiveLine(0); await proceed(10);
    if (l >= r) { setActiveLine(1); await proceed(10); return; }
    setActive(Array.from({ length: r - l + 1 }, (_, k) => l + k));
    await proceed(200);
    clearHighlights();
    const m = Math.floor((l + r) / 2);
    setActiveLine(2); await proceed(10);
    setActiveLine(3); await runMergeSort(a, l, m);
    setActiveLine(4); await runMergeSort(a, m + 1, r);
    setActiveLine(5);
    setSubLeft(Array.from({length: m - l + 1}, (_, k) => l + k));
    setSubRight(Array.from({length: r - m}, (_, k) => m + 1 + k));
    await proceed(150);
    let leftArr = a.slice(l, m + 1), rightArr = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < leftArr.length && j < rightArr.length) {
      setActive([k]);
      if (typeof a[k] === 'number') soundEngine.playValue(a[k] as number);
      await proceed(50);
      if (compareValues(leftArr[i], rightArr[j]) <= 0) a[k] = leftArr[i++];
      else a[k] = rightArr[j++];
      setArr([...a]); k++;
    }
    while (i < leftArr.length) {
      a[k++] = leftArr[i++]; setArr([...a]);
      if (typeof a[k-1] === 'number') soundEngine.playValue(a[k-1] as number);
      await proceed(30);
    }
    while (j < rightArr.length) {
      a[k++] = rightArr[j++]; setArr([...a]);
      if (typeof a[k-1] === 'number') soundEngine.playValue(a[k-1] as number);
      await proceed(30);
    }
    setSubLeft([]); setSubRight([]);
  };

  const partition = async (a: (string|number)[], low: number, high: number) => {
    let pivot = a[high];
    setPivots([high]);
    setSubLeft(Array.from({length: high - low + 1}, (_, k) => low + k));
    await proceed(100);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      setActive([j]);
      if (typeof a[j] === 'number') soundEngine.playValue(a[j] as number);
      await proceed(50);
      if (compareValues(a[j], pivot) < 0) {
        i++; swap(a, i, j); setArr([...a]);
      }
    }
    swap(a, i + 1, high); setArr([...a]);
    if (typeof a[i+1] === 'number') soundEngine.playValue(a[i+1] as number);
    setSubLeft([]);
    return i + 1;
  };

  const runQuickSort = async (a: (string|number)[], low: number, high: number) => {
    setActiveLine(0); await proceed(10);
    if (low < high) {
      setActiveLine(1); await proceed(10);
      setActiveLine(2);
      let pi = await partition(a, low, high);
      setActiveLine(3); await runQuickSort(a, low, pi - 1);
      setActiveLine(4); await runQuickSort(a, pi + 1, high);
    }
  };

  const heapify = async (a: (string|number)[], n: number, i: number) => {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    setActive([i, l, r]);
    if (typeof a[i] === 'number') soundEngine.playValue(a[i] as number);
    await proceed(50);
    if (l < n && compareValues(a[l], a[largest]) > 0) largest = l;
    if (r < n && compareValues(a[r], a[largest]) > 0) largest = r;
    if (largest !== i) {
      swap(a, i, largest); setArr([...a]);
      if (typeof a[i] === 'number') soundEngine.playValue(a[i] as number);
      await heapify(a, n, largest);
    }
  };

  const runHeapSort = async (a: (string|number)[]) => {
    let n = a.length;
    setActiveLine(0); await proceed(10);
    setActiveLine(1);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(a, n, i);
    setActiveLine(2); await proceed(10);
    for (let i = n - 1; i > 0; i--) {
      setActiveLine(3);
      swap(a, 0, i); setArr([...a]);
      await proceed(30);
      setActiveLine(4);
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
      soundEngine.playSuccess();
      setActiveLine(null);
      setSorting(false);
      clearHighlights();
    }
  };

  const addElement = () => {
    const v = parseValue(val);
    if (v === "") return;
    if (arr.length >= 10) { alert("Max input size is 10"); return; }
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
    <section
      id={id}
      className="min-h-screen w-full flex flex-col lg:flex-row relative"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
       {/* LEFT: 30% Panel */}
       <div
           className="w-full lg:w-[300px] shrink-0 flex flex-col z-20 gap-6 p-6 lg:p-8"
           style={{
             background: 'var(--bg-secondary)',
             borderRight: '1px solid var(--border-color)',
             borderLeft: `2px solid ${ACCENT}`,
           }}
       >
           <SectionHeader title="Sorting Engine" subtitle="Visual Algorithms." icon={BarChart3} index="04" accent={ACCENT} />
           <Select value={algo} onChange={setAlgo} options={[{ value: 'bubble', label: 'Bubble Sort' },{ value: 'selection', label: 'Selection Sort' },{ value: 'insertion', label: 'Insertion Sort' },{ value: 'merge', label: 'Merge Sort' },{ value: 'quick', label: 'Quick Sort' },{ value: 'heap', label: 'Heap Sort' }]} />
           <ComplexityHUD data={SORT_COMPLEXITY[algo as keyof typeof SORT_COMPLEXITY]} accent={ACCENT} />

           <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
           
           <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
             <div className="grid grid-cols-[1fr_60px] gap-2">
               <Input value={val} onChange={setVal} placeholder="Value"/>
               <Input value={idx} onChange={setIdx} placeholder="Idx" />
             </div>
             <div className="grid grid-cols-2 gap-2">
               <Button onClick={addElement} icon={Plus} disabled={sorting} accent={ACCENT}>Add</Button>
               <Button onClick={removeElement} variant="danger" icon={Trash2} disabled={sorting}>Remove</Button>
             </div>
           </div>

           <div className="space-y-3 mt-auto">
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button onClick={() => setArr(Array.from({length: 10}, () => Math.floor(Math.random() * 89) + 10))} variant="secondary" icon={Dices} disabled={sorting}>Randomize</Button>
              <Button onClick={() => setArr([])} variant="danger" icon={Trash2} disabled={sorting}>Clear All</Button>
            </div>
            {!sorting ? (
              <Button onClick={handleRunSort} icon={Play} className="w-full" accent={ACCENT}>Start Sort</Button>
            ) : (
              <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle} className="w-full">Stop Process</Button>
            )}
           </div>
       </div>

       {/* RIGHT: 70% Visualization */}
       <div
           className="flex-1 min-h-[60vh] lg:min-h-0 relative flex flex-col items-center justify-end overflow-hidden"
           style={{ background: 'var(--bg-primary)' }}
       >
           <GridBackground />

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

           <div className="flex flex-col items-center justify-end w-full h-[70%] lg:h-[80%] max-w-4xl px-4 lg:px-8 pb-10 z-10 gap-6">
             {/* Code Panel */}
             {CODE_SNIPPETS[algo] && (
               <div className="z-30 w-full flex justify-center mb-4">
                 <CodePanel code={CODE_SNIPPETS[algo]} activeLine={activeLine} accent={ACCENT} />
               </div>
             )}

             {/* Bar Array */}
             <div className="flex items-end justify-center gap-1 h-64 px-4 relative z-10" style={{ minWidth: 0, width: '100%', maxWidth: '900px' }}>
               {arr.map((v, i) => {
                 const isActive = active.includes(i);
                 const isPivot  = pivots.includes(i);
                 const isLeft   = subLeft.includes(i);
                 const isRight  = subRight.includes(i);

                 let barColor = 'var(--text-muted)';
                 let glowColor = 'transparent';
                 if (isActive) {
                   barColor = ACCENT;
                   glowColor = ACCENT_HEX;
                 } else if (isPivot) {
                   barColor = 'var(--accent-trees)';
                   glowColor = '#EC4899';
                 } else if (isLeft) {
                   barColor = 'var(--accent-graphs)';
                   glowColor = '#8B5CF6';
                 } else if (isRight) {
                   barColor = 'var(--accent-scheduling)';
                   glowColor = '#22C55E';
                 }

                 const heightPx = typeof v === 'number' ? Math.max(v * 2, 20) : 40;

                 return (
                   <div key={i} className="flex flex-col items-center justify-end gap-2 group flex-1 max-w-[60px]">
                     <motion.div
                       layout
                       className="w-full rounded-t-sm relative transition-all duration-300"
                       style={{
                         height: heightPx,
                         background: barColor,
                         boxShadow: isActive ? `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20` : 'none',
                         opacity: sorting && !isActive && !isPivot && !isLeft && !isRight ? 0.3 : 1
                       }}
                     />
                     <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                       {v}
                     </span>
                   </div>
                 );
               })}
             </div>
             
             <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] text-center w-full font-mono mt-4">
               ARRAY ITEMS • {arr.length}
             </div>
           </div>
       </div>
    </section>
  );
};
