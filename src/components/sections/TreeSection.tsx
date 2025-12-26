import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Plus, Play, StopCircle, Trash2 } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const TREE_COMPLEXITY = { time: { best: 'Ω(log n)', avg: 'Θ(log n)', worst: 'O(n)' }, space: 'O(n)', note: 'Tree Structures.' };

interface TreeSectionProps {
  id: string;
}

export const TreeSection: React.FC<TreeSectionProps> = ({ id }) => {
  const [tree, setTree] = useState<(string | number | null)[]>(["Root", "A", "Z"]);
  const [val, setVal] = useState('');
  const [deleteVal, setDeleteVal] = useState('');
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [algo, setAlgo] = useState('bfs');
  const [isRunning, setIsRunning] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const nextStepRef = useRef<(() => void) | null>(null);
  const stopRef = useRef(false);

  const proceed = async () => { 
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); 
    else await wait(500); 
  };
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const insert = () => { 
    const v = parseValue(val); 
    if (v === "") return; 
    const t = [...tree]; 
    let i = 0; 
    while(i < 63) { 
      if (t[i] === undefined || t[i] === null) { t[i] = v; break; } 
      if (compareValues(v, t[i]!) < 0) i = 2*i + 1; 
      else i = 2*i + 2; 
    } 
    setTree(t); setVal(''); 
  };

    const deleteNode = () => {
    const v = parseValue(deleteVal);
    if (v === "") return;

    const findNode = (val: string | number) => tree.indexOf(val);

    const getMinValueIndex = (startIndex: number) => {
        let currentIndex = startIndex;
        while (tree[2 * currentIndex + 1] != null) {
            currentIndex = 2 * currentIndex + 1;
        }
        return currentIndex;
    };

    const deleteRec = (rootIndex: number | null, valToDelete: string | number): number | null => {
        if (rootIndex === null || tree[rootIndex] === null) return rootIndex;

        const comparison = compareValues(valToDelete, tree[rootIndex]!);
        const leftChildIndex = 2 * rootIndex + 1;
        const rightChildIndex = 2 * rootIndex + 2;

        if (comparison < 0) {
            // The node to delete is in the left subtree
            // This part is tricky with array representation, as we can't just assign to leftChild.
            // A full implementation would require rebuilding parts of the array.
        } else if (comparison > 0) {
            // The node to delete is in the right subtree
        } else {
            // This is the node to be deleted
            if (tree[leftChildIndex] == null) {
                // Node with only right child or no child
                // Again, would require shifting the right subtree up.
                return rightChildIndex;
            } else if (tree[rightChildIndex] == null) {
                // Node with only left child
                return leftChildIndex;
            }

            // Node with two children: Get the inorder successor (smallest in the right subtree)
            const successorIndex = getMinValueIndex(rightChildIndex);
            const newTree = [...tree];
            newTree[rootIndex] = newTree[successorIndex];
            // This is where it gets really complex with an array, as we now need to delete the successor from its original position.
            // A simple null assignment is what we'll do for now.
            newTree[successorIndex] = null;
            setTree(newTree);
        }
        return rootIndex;
    };

    const nodeIndex = findNode(v);
    if (nodeIndex !== -1) {
        // The recursive solution is complex to fit into the current state management.
        // Sticking to a simplified direct manipulation for now.
        const newTree = [...tree];
        const leftChild = 2 * nodeIndex + 1;
        const rightChild = 2 * nodeIndex + 2;

        if (newTree[leftChild] === undefined && newTree[rightChild] === undefined) {
            newTree[nodeIndex] = null;
        } else if (newTree[leftChild] !== undefined && newTree[rightChild] === undefined) {
            // Simplified: just replaces with child. Does not handle grandchildren.
            newTree[nodeIndex] = newTree[leftChild];
            newTree[leftChild] = null;
        } else if (newTree[leftChild] === undefined && newTree[rightChild] !== undefined) {
            newTree[nodeIndex] = newTree[rightChild];
            newTree[rightChild] = null;
        } else {
            let successorIndex = rightChild;
            while (newTree[2 * successorIndex + 1] !== undefined && newTree[2 * successorIndex + 1] !== null) {
                successorIndex = 2 * successorIndex + 1;
            }
            newTree[nodeIndex] = newTree[successorIndex];
            newTree[successorIndex] = null; // Simplified deletion of successor
        }
        setTree(newTree);
    }

    setDeleteVal('');
  };

  const runTraversal = async () => {
    setIsRunning(true);
    stopRef.current = false;
    
    const dfs = async (idx: number, type: string) => {
      if (tree[idx] === undefined || tree[idx] === null || stopRef.current) return;
      if (type === 'pre') { setActiveNode(idx); await proceed(); }
      await dfs(2 * idx + 1, type);
      if (type === 'in') { setActiveNode(idx); await proceed(); }
      await dfs(2 * idx + 2, type);
      if (type === 'post') { setActiveNode(idx); await proceed(); }
    };

    try {
      if (algo === 'bfs') {
        const q = [0];
        while (q.length > 0) {
          const curr = q.shift()!;
          if (tree[curr] !== undefined && tree[curr] !== null) {
            setActiveNode(curr);
            await proceed();
            q.push(2 * curr + 1);
            q.push(2 * curr + 2);
          }
        }
      } else {
        await dfs(0, algo);
      }
    } catch (e) {
      console.log("Traversal Aborted");
    }
    
    setActiveNode(null);
    setIsRunning(false);
  };

  const nodes = useMemo(() => {
    const list: { val: string | number; x: number; y: number; px: number | undefined; py: number | undefined; id: number; }[] = [];
    const tr = (idx: number, x: number, y: number, level: number, px?: number, py?: number) => {
      if (tree[idx] === undefined || tree[idx] === null) return;
      const gap = 160 / Math.pow(1.5, level - 1);
      list.push({ val: tree[idx]!, x, y, px, py, id: idx });
      tr(2 * idx + 1, x - gap, y + 100, level + 1, x, y);
      tr(2 * idx + 2, x + gap, y + 100, level + 1, x, y);
    };
    tr(0, 0, 0, 1);
    return list;
  }, [tree]);

  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-[var(--border-color)]">
      {/* LEFT: 30% Panel */}
      <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-6 flex flex-col gap-6`}>
        <SectionHeader title="Tree" subtitle="Hierarchical Data" icon={GitBranch} index="06" />
        <ComplexityHUD data={TREE_COMPLEXITY} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} />
        <div className="space-y-3 mt-auto">
                    <div className="grid grid-cols-2 gap-2">
            <Input value={val} onChange={setVal} placeholder="Value to Add" />
            <Button onClick={insert} icon={Plus} disabled={isRunning}>Add</Button>
            <Input value={deleteVal} onChange={setDeleteVal} placeholder="Value to Delete" />
            <Button onClick={deleteNode} icon={Trash2} variant="danger" disabled={isRunning}>Delete</Button>
          </div>
          <div className="h-px bg-[var(--border-color)] my-2" />
          <Select 
            value={algo} 
            onChange={setAlgo} 
            options={[
              { value: 'bfs', label: 'BFS (Level Order)' },
              { value: 'pre', label: 'DFS Pre-Order' },
              { value: 'in', label: 'DFS In-Order' },
              { value: 'post', label: 'DFS Post-Order' }
            ]} 
          />
          {!isRunning ? (
            <Button onClick={runTraversal} className="w-full" icon={Play}>Run Traversal</Button>
          ) : (
            <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle} className="w-full">Stop Traversal</Button>
          )}
        </div>
      </div>
      {/* RIGHT: 70% Visualization */}
      <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-start justify-center pt-24 overflow-auto`}>
        <GridBackground />
        <div className="relative w-full h-full max-w-4xl min-h-[600px] flex justify-center">
          <AnimatePresence>
            <svg className="absolute w-full h-full pointer-events-none overflow-visible">
              {nodes.map(n => typeof n.px === 'number' && (
                <motion.line 
                  key={`line-${n.id}`} 
                  initial={{ pathLength: 0 }} 
                  animate={{ pathLength: 1 }} 
                  x1={n.px + 450} 
                  y1={n.py! + 25} 
                  x2={n.x + 450} 
                  y2={n.y + 25} 
                  stroke="var(--text-muted)" 
                  strokeWidth="2" 
                  strokeDasharray="4 2" 
                />
              ))}
            </svg>
            {nodes.map(n => (
              <motion.div 
                key={`node-${n.id}`} 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className={cn(
                  "absolute w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300", 
                  activeNode === n.id ? "bg-amber-500 text-white border-white scale-125 z-10" : "bg-[var(--bg-card)] border-[var(--primary)] text-[var(--text-primary)]"
                )} 
                style={{ left: n.x + 450, top: n.y }}
              >
                <span className="text-[10px] font-bold">{n.val}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
