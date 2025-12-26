import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, RotateCcw, Play, StopCircle, Trash2 } from 'lucide-react';
import { THEME } from '../core/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { cn, wait } from '../../lib/utils';

const GRAPH_COMPLEXITY = { dijkstra: { time: { best: 'Ω(E log V)', avg: 'Θ(E log V)', worst: 'O(E log V)' }, space: 'O(V + E)', note: 'Shortest Path.' }, bfs: { time: { best: 'Ω(V+E)', avg: 'Θ(V+E)', worst: 'O(V+E)' }, space: 'O(V)', note: 'Unweighted.' }, dfs: { time: { best: 'Ω(V+E)', avg: 'Θ(V+E)', worst: 'O(V+E)' }, space: 'O(V)', note: 'Topology.' } };

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  w: number;
}

interface GraphSectionProps {
  id: string;
}

export const GraphSection: React.FC<GraphSectionProps> = ({ id }) => {
  const [algo, setAlgo] = useState('bfs');
  const initialNodes: Node[] = [{id:'A',x:0,y:-120}, {id:'B',x:-120,y:0}, {id:'C',x:120,y:0}, {id:'D',x:0,y:120}];
  const initialEdges: Edge[] = [{from:'A',to:'B',w:4}, {from:'A',to:'C',w:2}, {from:'B',to:'C',w:1}, {from:'B',to:'D',w:5}, {from:'C',to:'D',w:8}];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  const [visited, setVisited] = useState<string[]>([]);
  const [distances, setDistances] = useState<{[key: string]: number}>({});
  const [target, setTarget] = useState('');
  const [status, setStatus] = useState('Idle');
  const [isRunning, setIsRunning] = useState(false);
  const [stepMode, setStepMode] = useState(false);

  const [newNodeId, setNewNodeId] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [nodeToDelete, setNodeToDelete] = useState('');
  const [edgeToDeleteFrom, setEdgeToDeleteFrom] = useState('');
  const [edgeToDeleteTo, setEdgeToDeleteTo] = useState('');
  
  const nextStepRef = useRef<(() => void) | null>(null);
  const stopRef = useRef(false);

  const proceed = async (customDelay = 600) => { 
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); 
    else await wait(customDelay); 
  };

  const getAdjacency = useCallback(() => {
    const adj: {[key: string]: {node: string, w: number}[]} = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      if (adj[e.from]) adj[e.from].push({ node: e.to, w: e.w });
      if (adj[e.to]) adj[e.to].push({ node: e.from, w: e.w }); 
    });
    return adj;
  }, [nodes, edges]);

  const runDijkstra = async () => {
    setVisited([]);
    const dist: {[key: string]: number} = {};
    nodes.forEach(n => dist[n.id] = Infinity);
    const startNode = nodes[0]?.id || 'A';
    dist[startNode] = 0;
    setDistances({ ...dist });
    setIsRunning(true);
    stopRef.current = false;

    try {
      const pq = [startNode];
      while (pq.length > 0) {
        pq.sort((a, b) => dist[a] - dist[b]);
        const curr = pq.shift()!;
        
        if (visited.includes(curr)) continue;
        setVisited(prev => [...prev, curr]);
        setStatus(`Expanding node ${curr}`);
        await proceed();

        const adj = getAdjacency();
        for (const neighbor of adj[curr]) {
          const newDist = dist[curr] + neighbor.w;
          if (newDist < dist[neighbor.node]) {
            dist[neighbor.node] = newDist;
            setDistances({ ...dist });
            pq.push(neighbor.node);
            setStatus(`Relaxed ${neighbor.node} to dist ${newDist}`);
            await proceed(300);
          }
        }
      }
      setStatus('Shortest Paths Computed');
    } catch (e) {
      resetAlgoState('Algorithm Aborted');
    }
    setIsRunning(false);
  };

  const runSearch = async () => {
    const t = target.toUpperCase();
    if (!t) return;
    setVisited([]);
    setDistances({});
    setIsRunning(true);
    stopRef.current = false;
    const adj = getAdjacency();
    const startNode = nodes[0]?.id;
    if (!startNode) return;

    try {
      if (algo === 'bfs') {
        const queue = [startNode];
        const localVisited = new Set<string>();
        while (queue.length > 0) {
          const curr = queue.shift()!;
          if (localVisited.has(curr)) continue;
          
          localVisited.add(curr);
          setVisited(Array.from(localVisited));
          setStatus(`Scanning ${curr}`);
          await proceed();

          if (curr === t) {
            setStatus(`Target ${t} Found!`);
            setIsRunning(false);
            return;
          }

          for (const n of adj[curr]) {
            if (!localVisited.has(n.node)) queue.push(n.node);
          }
        }
      } else {
        const localVisited = new Set<string>();
        const dfs = async (curr: string): Promise<boolean> => {
          if (localVisited.has(curr) || stopRef.current) return false;
          localVisited.add(curr);
          setVisited(Array.from(localVisited));
          setStatus(`Visiting ${curr}`);
          await proceed();

          if (curr === t) return true;

          for (const n of adj[curr]) {
            if (await dfs(n.node)) return true;
          }
          return false;
        };
        const found = await dfs(startNode);
        if (found) setStatus(`Target ${t} Found!`);
        else setStatus(`Target ${t} not reachable.`);
      }
    } catch (e) {
      resetAlgoState('Search Aborted');
    }
    setIsRunning(false);
  };

  const resetAlgoState = (msg = 'Idle') => {
    setVisited([]);
    setDistances({});
    setStatus(msg);
    setIsRunning(false);
  };

  const addNode = () => {
    const id = newNodeId.toUpperCase().trim();
    if (!id || nodes.find(n => n.id === id)) return;
    const angle = (nodes.length * (Math.PI * 2)) / (nodes.length + 1);
    const radius = 150;
    setNodes([...nodes, { id, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }]);
    setNewNodeId('');
  };

  const addEdge = () => {
    const from = edgeFrom.toUpperCase().trim();
    const to = edgeTo.toUpperCase().trim();
    const w = parseInt(edgeWeight);
    if (!from || !to || isNaN(w) || from === to) return;
    if (!nodes.find(n => n.id === from) || !nodes.find(n => n.id === to)) return;
    setEdges([...edges, { from, to, w }]);
    setEdgeFrom(''); setEdgeTo(''); setEdgeWeight('1');
  };

      const deleteNode = () => {
    const indexToDelete = parseInt(nodeToDelete, 10);
    if (isNaN(indexToDelete) || indexToDelete < 0 || indexToDelete >= nodes.length) {
      setNodeToDelete('');
      return; // Invalid index
    }

    const idToDelete = nodes[indexToDelete].id;

    const newNodes = nodes.filter((_, i) => i !== indexToDelete);
    const newEdges = edges.filter(e => e.from !== idToDelete && e.to !== idToDelete);

    setNodes(newNodes);
    setNodes(newNodes);
    setEdges(newEdges);
    setNodeToDelete('');
    resetAlgoState();
  };

  const deleteEdge = () => {
    const from = edgeToDeleteFrom.toUpperCase().trim();
    const to = edgeToDeleteTo.toUpperCase().trim();
    if (!from || !to) return;

    const newEdges = edges.filter(e => 
        !(e.from === from && e.to === to) && 
        !(e.from === to && e.to === from)
    );

    setEdges(newEdges);
    setEdgeToDeleteFrom('');
    setEdgeToDeleteTo('');
    resetAlgoState();
  };

  const resetGraph = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    resetAlgoState();
  }

  const generateRandomGraph = () => {
    resetAlgoState('Generating Random Graph...');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nodeCount = 5 + Math.floor(Math.random() * 3);
    const newNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * Math.PI * 2) / nodeCount;
      newNodes.push({ 
        id: alphabet[i], 
        x: Math.cos(angle) * 150, 
        y: Math.sin(angle) * 150 
      });
    }
    const newEdges: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const neighborCount = 1 + Math.floor(Math.random() * 2);
      for (let j = 0; j < neighborCount; j++) {
        const targetIdx = (i + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
        const from = newNodes[i].id;
        const to = newNodes[targetIdx].id;
        if (!newEdges.find(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
          newEdges.push({ from, to, w: 1 + Math.floor(Math.random() * 9) });
        }
      }
    }
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <section id={id} className="min-h-screen w-full flex flex-col lg:flex-row relative border-t border-white/5">
      {/* LEFT: 30% Panel */}
      <div className={`w-full lg:w-[30%] ${THEME.sidebar} p-8 flex flex-col z-20 gap-6 overflow-y-auto no-scroll`}>
          <SectionHeader title="Graph" subtitle="Network Engine." icon={Network} index="07" />
          
          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            {['dijkstra', 'bfs', 'dfs'].map(a => (
              <Button key={a} onClick={() => { setAlgo(a); resetAlgoState(); }} variant={algo === a ? 'ai' : 'secondary'} className="flex-1 text-[10px] px-0">
                {a.toUpperCase()}
              </Button>
            ))}
          </div>

          <ComplexityHUD data={GRAPH_COMPLEXITY[algo as keyof typeof GRAPH_COMPLEXITY]} />
          
          <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2"><Plus size={12}/> Construct Graph</span>
            <div className="flex gap-2">
              <Input value={newNodeId} onChange={setNewNodeId} placeholder="Label (e.g. NodeX)" />
              <Button onClick={addNode} variant="secondary" className="px-3"><Plus size={14}/></Button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <Input value={edgeFrom} onChange={setEdgeFrom} placeholder="From" />
              <Input value={edgeTo} onChange={setEdgeTo} placeholder="To" />
              <Input value={edgeWeight} onChange={setEdgeWeight} placeholder="W" type="number" />
            </div>
            <Button onClick={addEdge} variant="secondary" className="w-full">Link Nodes</Button>
            <div className="h-px bg-white/5 my-2" />
                        <div className="flex gap-2">
              <Input value={nodeToDelete} onChange={setNodeToDelete} placeholder="Node # to Delete" type="number" />
              <Button onClick={deleteNode} variant="danger" className="px-3"><Trash2 size={14}/></Button>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="grid grid-cols-2 gap-1">
              <Input value={edgeToDeleteFrom} onChange={setEdgeToDeleteFrom} placeholder="From" />
              <Input value={edgeToDeleteTo} onChange={setEdgeToDeleteTo} placeholder="To" />
            </div>
            <Button onClick={deleteEdge} variant="danger" className="w-full">Unlink Nodes</Button>
          </div>
          
          <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={() => nextStepRef.current?.()} />
          
          <div className="space-y-3 mt-auto">
            <div className="grid grid-cols-2 gap-2">
            <Button onClick={generateRandomGraph} variant="secondary" className="w-full" icon={RotateCcw}>Randomize</Button>
            <Button onClick={resetGraph} variant="secondary" className="w-full">Reset</Button>
            </div>
            {algo !== 'dijkstra' && (
              <Input value={target} onChange={setTarget} placeholder="Target Node ID" />
            )}
            {!isRunning ? (
              <Button 
                onClick={algo === 'dijkstra' ? runDijkstra : runSearch} 
                icon={Play} 
                className="w-full"
              >
                Run Algorithm
              </Button>
            ) : (
              <Button 
                onClick={() => { stopRef.current = true; if(stepMode) nextStepRef.current?.(); }} 
                variant="danger" 
                icon={StopCircle} 
                className="w-full"
              >
                Abort Process
              </Button>
            )}
          </div>

          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl font-mono text-xs text-[var(--text-secondary)] shadow-inner">
            <span className="text-cyan-500 font-bold mr-2">{'>'}</span>{status}
          </div>
      </div>
      
      {/* RIGHT: 70% Visualization */}
      <div className={`w-full lg:w-[70%] ${THEME.canvas} flex items-center justify-center relative`}>
          <GridBackground />
          <div className="relative w-[600px] h-[600px] bg-black/20 rounded-full border border-white/5">
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
              {edges.map((e, i) => {
                const s = nodes.find(n => n.id === e.from);
                const en = nodes.find(n => n.id === e.to);
                if (!s || !en) return null;
                const midX = (300 + s.x + 300 + en.x) / 2;
                const midY = (300 + s.y + 300 + en.y) / 2;
                return (
                  <g key={i}>
                    <line x1={300 + s.x} y1={300 + s.y} x2={300 + en.x} y2={300 + en.y} stroke="#333" strokeWidth="1.5" />
                    <text x={midX} y={midY - 10} fill="var(--text-secondary)" fontSize="10" className="font-mono" textAnchor="middle">w:{e.w}</text>
                  </g>
                );
              })}
            </svg>
            <AnimatePresence>
              {nodes.map((n, i) => {
                const d = distances[n.id];
                return (
                  <motion.div 
                    key={n.id} 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className={cn(
                      "absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-2 flex flex-col items-center justify-center bg-[#0A0A0A] font-mono transition-colors", 
                      visited.includes(n.id) ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "border-neutral-800"
                    )} 
                    style={{ left: 300 + n.x, top: 300 + n.y }} 
                  >
                    <span className="text-[10px] font-bold">{i}: {n.id}</span>
                    {d !== undefined && (
                      <span className="text-[8px] text-cyan-500 mt-1">{d === Infinity ? '∞' : `d:${d}`}</span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
      </div>
    </section>
  )
}
