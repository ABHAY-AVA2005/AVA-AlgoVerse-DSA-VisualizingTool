import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, Plus, Play, StopCircle, Trash2, Dices } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StepControl } from '../ui/StepControl';
import { ComplexityHUD } from '../ui/ComplexityHUD';
import { SectionHeader } from '../ui/SectionHeader';
import { GridBackground } from '../ui/GridBackground';
import { CodePanel } from '../ui/CodePanel';
import { soundEngine } from '../../lib/SoundEngine';
import { cn, parseValue, wait, compareValues } from '../../lib/utils';

const ACCENT = 'var(--accent-tree)';
const ACCENT_HEX = '#4ADE80';

const TREE_COMPLEXITY = { time: { best: 'Ω(log n)', avg: 'Θ(log n)', worst: 'O(n)' }, space: 'O(n)', note: 'Tree Structures.' };

const CODE_SNIPPETS: Record<string, string[]> = {
  bst_insert: [
    "Node insert(Node root, int val) {",
    "    if (root == null) return new Node(val);",
    "    if (val < root.val)",
    "        root.left = insert(root.left, val);",
    "    else if (val > root.val)",
    "        root.right = insert(root.right, val);",
    "    return root;",
    "}"
  ],
  avl_insert: [
    "Node insertAVL(Node root, int val) {",
    "    root = insert(root, val);",
    "    int balance = getBalance(root);",
    "    if (balance > 1 && val < root.left.val) return rightRotate(root);",
    "    if (balance < -1 && val > root.right.val) return leftRotate(root);",
    "    if (balance > 1 && val > root.left.val) return leftRightRotate(root);",
    "    if (balance < -1 && val < root.right.val) return rightLeftRotate(root);",
    "    return root;",
    "}"
  ],
  bfs: [
    "void bfs(Node root) {",
    "    Queue<Node> q = new LinkedList<>();",
    "    q.add(root);",
    "    while (!q.isEmpty()) {",
    "        Node curr = q.poll();",
    "        if (curr.left != null) q.add(curr.left);",
    "        if (curr.right != null) q.add(curr.right);",
    "    }",
    "}"
  ],
  pre: [
    "void preOrder(Node node) {",
    "    if (node == null) return;",
    "    visit(node);",
    "    preOrder(node.left);",
    "    preOrder(node.right);",
    "}"
  ],
  in: [
    "void inOrder(Node node) {",
    "    if (node == null) return;",
    "    inOrder(node.left);",
    "    visit(node);",
    "    inOrder(node.right);",
    "}"
  ],
  post: [
    "void postOrder(Node node) {",
    "    if (node == null) return;",
    "    postOrder(node.left);",
    "    postOrder(node.right);",
    "    visit(node);",
    "}"
  ]
};

export type TreeNode = {
  id: string;
  val: string | number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
};

interface TreeSectionProps {
  id: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const TreeSection: React.FC<TreeSectionProps> = ({ id }) => {
  const [root, setRoot] = useState<TreeNode | null>(() => {
    return {
      id: generateId(), val: 50, height: 2,
      left: { id: generateId(), val: 25, height: 1, left: null, right: null },
      right: { id: generateId(), val: 75, height: 1, left: null, right: null }
    };
  });
  
  const [treeMode, setTreeMode] = useState('bst'); // 'bst' or 'avl'
  const [val, setVal] = useState('');
  const [deleteVal, setDeleteVal] = useState('');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [algo, setAlgo] = useState('bfs');
  const [isRunning, setIsRunning] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [currentOp, setCurrentOp] = useState<string>('bst_insert');
  
  const nextStepRef = useRef<(() => void) | null>(null);
  const stopRef = useRef(false);

  const proceed = async (delay = 500) => { 
    if (stopRef.current) throw new Error("STOPPED");
    if (stepMode) await new Promise<void>(resolve => { nextStepRef.current = resolve; }); 
    else await wait(delay / ((window as any).__SPEED_FACTOR__ || 1)); 
  };
  
  const nextStep = () => { if (nextStepRef.current) { nextStepRef.current(); nextStepRef.current = null; } };

  const cloneTree = (n: TreeNode | null): TreeNode | null => {
    if (!n) return null;
    return { ...n, left: cloneTree(n.left), right: cloneTree(n.right) };
  };

  const getHeight = (n: TreeNode | null) => n ? n.height : 0;
  const updateHeight = (n: TreeNode) => { n.height = 1 + Math.max(getHeight(n.left), getHeight(n.right)); };
  const getBalance = (n: TreeNode | null) => n ? getHeight(n.left) - getHeight(n.right) : 0;

  const updateVisuals = async (mutRoot: TreeNode | null, activeId?: string | null, msg?: string, delay = 500) => {
    setRoot(cloneTree(mutRoot));
    if (activeId !== undefined) setActiveNode(activeId);
    if (msg !== undefined) setMessage(msg);
    await proceed(delay);
  };

  const rightRotate = async (y: TreeNode, mutRoot: TreeNode | null) => {
    setMessage(`Right Rotating on ${y.val}`);
    await proceed(400);
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    updateHeight(y);
    updateHeight(x);
    return x;
  };

  const leftRotate = async (x: TreeNode, mutRoot: TreeNode | null) => {
    setMessage(`Left Rotating on ${x.val}`);
    await proceed(400);
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    updateHeight(x);
    updateHeight(y);
    return y;
  };

  const insertNode = async (node: TreeNode | null, value: string | number, isAVL: boolean, mutRootRef: { current: TreeNode | null }): Promise<TreeNode> => {
    setActiveLine(0); await proceed(100);
    if (!node) {
      setActiveLine(1); await proceed(100);
      const newNode = { id: generateId(), val: value, left: null, right: null, height: 1 };
      await updateVisuals(mutRootRef.current, newNode.id, `Inserted ${value}`, 300);
      if (typeof value === 'number') soundEngine.playValue(value);
      return newNode;
    }

    await updateVisuals(mutRootRef.current, node.id, `Comparing ${value} with ${node.val}`, 400);
    if (typeof node.val === 'number') soundEngine.playValue(node.val);

    if (compareValues(value, node.val) < 0) {
      setActiveLine(2); await proceed(100);
      setActiveLine(3); await proceed(100);
      node.left = await insertNode(node.left, value, isAVL, mutRootRef);
    } else if (compareValues(value, node.val) > 0) {
      setActiveLine(4); await proceed(100);
      setActiveLine(5); await proceed(100);
      node.right = await insertNode(node.right, value, isAVL, mutRootRef);
    } else {
      setMessage(`Duplicate value ${value} ignored`);
      return node;
    }

    updateHeight(node);

    if (isAVL) {
      setActiveLine(2); await proceed(100);
      const balance = getBalance(node);
      if (balance > 1 && node.left && compareValues(value, node.left.val) < 0) {
        setActiveLine(3); await proceed(100);
        await updateVisuals(mutRootRef.current, node.id, `Left-Left Imbalance at ${node.val}`, 600);
        return await rightRotate(node, mutRootRef.current);
      }
      if (balance < -1 && node.right && compareValues(value, node.right.val) > 0) {
        setActiveLine(4); await proceed(100);
        await updateVisuals(mutRootRef.current, node.id, `Right-Right Imbalance at ${node.val}`, 600);
        return await leftRotate(node, mutRootRef.current);
      }
      if (balance > 1 && node.left && compareValues(value, node.left.val) > 0) {
        setActiveLine(5); await proceed(100);
        await updateVisuals(mutRootRef.current, node.id, `Left-Right Imbalance at ${node.val}`, 600);
        node.left = await leftRotate(node.left, mutRootRef.current);
        mutRootRef.current = cloneTree(mutRootRef.current); // Force visual sync
        setRoot(mutRootRef.current);
        return await rightRotate(node, mutRootRef.current);
      }
      if (balance < -1 && node.right && compareValues(value, node.right.val) < 0) {
        setActiveLine(6); await proceed(100);
        await updateVisuals(mutRootRef.current, node.id, `Right-Left Imbalance at ${node.val}`, 600);
        node.right = await rightRotate(node.right, mutRootRef.current);
        mutRootRef.current = cloneTree(mutRootRef.current);
        setRoot(mutRootRef.current);
        return await leftRotate(node, mutRootRef.current);
      }
    }
    setActiveLine(6); await proceed(100);
    return node;
  };

  const insert = async () => { 
    const v = parseValue(val); 
    if (v === "") return; 
    setIsRunning(true);
    stopRef.current = false;
    setCurrentOp(treeMode === 'avl' ? 'avl_insert' : 'bst_insert');
    setMessage(`Inserting ${v}...`);

    try {
      const mutRootRef = { current: cloneTree(root) };
      if (!mutRootRef.current) {
        mutRootRef.current = { id: generateId(), val: v, left: null, right: null, height: 1 };
        await updateVisuals(mutRootRef.current, mutRootRef.current.id, `Inserted ${v} as Root`, 500);
        if (typeof v === 'number') soundEngine.playValue(v);
      } else {
        mutRootRef.current = await insertNode(mutRootRef.current, v, treeMode === 'avl', mutRootRef);
      }
      setRoot(mutRootRef.current);
      setActiveNode(null);
      setMessage('Idle');
    } catch (e) {
      console.log("Insertion Aborted");
    }
    setVal(''); 
    setIsRunning(false);
    setActiveLine(null);
  };

  const getMinValueNode = (node: TreeNode): TreeNode => {
    let current = node;
    while (current.left) current = current.left;
    return current;
  };

  const deleteNodeRecursively = async (node: TreeNode | null, value: string | number, isAVL: boolean, mutRootRef: { current: TreeNode | null }): Promise<TreeNode | null> => {
    if (!node) return null;

    await updateVisuals(mutRootRef.current, node.id, `Finding ${value} to delete...`, 400);

    if (compareValues(value, node.val) < 0) {
      node.left = await deleteNodeRecursively(node.left, value, isAVL, mutRootRef);
    } else if (compareValues(value, node.val) > 0) {
      node.right = await deleteNodeRecursively(node.right, value, isAVL, mutRootRef);
    } else {
      await updateVisuals(mutRootRef.current, node.id, `Found ${value} to delete!`, 600);
      if (!node.left) return node.right;
      else if (!node.right) return node.left;

      const temp = getMinValueNode(node.right);
      await updateVisuals(mutRootRef.current, temp.id, `Replacing with successor ${temp.val}`, 600);
      node.val = temp.val;
      node.right = await deleteNodeRecursively(node.right, temp.val, isAVL, mutRootRef);
    }

    if (!node) return null;

    updateHeight(node);

    if (isAVL) {
      const balance = getBalance(node);
      if (balance > 1 && getBalance(node.left) >= 0) return await rightRotate(node, mutRootRef.current);
      if (balance > 1 && getBalance(node.left) < 0) {
        node.left = await leftRotate(node.left!, mutRootRef.current);
        mutRootRef.current = cloneTree(mutRootRef.current);
        setRoot(mutRootRef.current);
        return await rightRotate(node, mutRootRef.current);
      }
      if (balance < -1 && getBalance(node.right) <= 0) return await leftRotate(node, mutRootRef.current);
      if (balance < -1 && getBalance(node.right) > 0) {
        node.right = await rightRotate(node.right!, mutRootRef.current);
        mutRootRef.current = cloneTree(mutRootRef.current);
        setRoot(mutRootRef.current);
        return await leftRotate(node, mutRootRef.current);
      }
    }
    return node;
  };

  const deleteNode = async () => {
    const v = parseValue(deleteVal);
    if (v === "" || !root) return;
    setIsRunning(true);
    stopRef.current = false;
    setMessage(`Deleting ${v}...`);

    try {
      const mutRootRef = { current: cloneTree(root) };
      mutRootRef.current = await deleteNodeRecursively(mutRootRef.current, v, treeMode === 'avl', mutRootRef);
      setRoot(mutRootRef.current);
      setActiveNode(null);
      setMessage('Idle');
    } catch(e) {
      console.log("Deletion Aborted");
    }
    setDeleteVal('');
    setIsRunning(false);
  };

  const runTraversal = async () => {
    setIsRunning(true);
    stopRef.current = false;
    setCurrentOp(algo);
    setMessage(`Running ${algo.toUpperCase()} Traversal...`);
    
    const dfs = async (node: TreeNode | null, type: string) => {
      setActiveLine(0); await proceed(50);
      if (!node || stopRef.current) { setActiveLine(1); await proceed(50); return; }
      
      if (type === 'pre') { setActiveLine(2); setActiveNode(node.id); if(typeof node.val === 'number') soundEngine.playValue(node.val); await proceed(600); }
      setActiveLine(3); await dfs(node.left, type);
      if (type === 'in') { setActiveLine(3); setActiveNode(node.id); if(typeof node.val === 'number') soundEngine.playValue(node.val); await proceed(600); }
      setActiveLine(4); await dfs(node.right, type);
      if (type === 'post') { setActiveLine(4); setActiveNode(node.id); if(typeof node.val === 'number') soundEngine.playValue(node.val); await proceed(600); }
    };

    try {
      if (algo === 'bfs') {
        setActiveLine(0); await proceed(100);
        const q = root ? [root] : [];
        setActiveLine(1); await proceed(100);
        setActiveLine(2); await proceed(100);
        while (q.length > 0) {
          setActiveLine(3); await proceed(100);
          const curr = q.shift()!;
          if (stopRef.current) break;
          setActiveLine(4);
          setActiveNode(curr.id);
          if(typeof curr.val === 'number') soundEngine.playValue(curr.val);
          await proceed(600);
          setActiveLine(5); await proceed(100);
          if (curr.left) q.push(curr.left);
          setActiveLine(6); await proceed(100);
          if (curr.right) q.push(curr.right);
        }
      } else {
        await dfs(root, algo);
      }
      soundEngine.playSuccess();
    } catch (e) {
      console.log("Traversal Aborted");
    }
    
    setActiveNode(null);
    setActiveLine(null);
    setMessage('Idle');
    setIsRunning(false);
  };

  const nodesList = useMemo(() => {
    const list: { val: string | number; x: number; y: number; px?: number; py?: number; id: string; }[] = [];
    const tr = (node: TreeNode | null, x: number, y: number, level: number, px?: number, py?: number) => {
      if (!node) return;
      const gap = 160 / Math.pow(1.5, level - 1);
      list.push({ val: node.val, x, y, px, py, id: node.id });
      tr(node.left, x - gap, y + 100, level + 1, x, y);
      tr(node.right, x + gap, y + 100, level + 1, x, y);
    };
    tr(root, 0, 0, 1);
    return list;
  }, [root]);

  return (
    <section
      id={id}
      className="min-h-screen w-full flex flex-col lg:flex-row relative"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
      <div
        className="w-full lg:w-[300px] shrink-0 flex flex-col z-20 gap-6 p-6 lg:p-8"
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          borderLeft: `2px solid ${ACCENT}`,
        }}
      >
        <SectionHeader title="Trees" subtitle="Hierarchical Data." icon={TreePine} index="07" accent={ACCENT} />
        <ComplexityHUD data={TREE_COMPLEXITY} accent={ACCENT} />
        <StepControl stepMode={stepMode} setStepMode={setStepMode} onNext={nextStep} accent={ACCENT} />
        <div className="space-y-3 mt-auto">
          <Select 
            value={treeMode} 
            onChange={setTreeMode} 
            options={[
              { value: 'bst', label: 'Standard BST' },
              { value: 'avl', label: 'AVL Tree (Auto-Balance)' }
            ]} 
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input value={val} onChange={setVal} placeholder="Value to Add" accent={ACCENT} />
              <Button onClick={insert} icon={Plus} disabled={isRunning} accent={ACCENT}>Add</Button>
            </div>
            <div className="flex gap-2">
              <Input value={deleteVal} onChange={setDeleteVal} placeholder="Value to Delete" accent={ACCENT} />
              <Button onClick={deleteNode} icon={Trash2} variant="danger" disabled={isRunning}>Delete</Button>
            </div>
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
            <Button onClick={runTraversal} className="w-full" icon={Play} accent={ACCENT}>Run Traversal</Button>
          ) : (
            <Button onClick={() => { stopRef.current = true; if(stepMode) nextStep(); }} variant="danger" icon={StopCircle} className="w-full">Stop Traversal</Button>
          )}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={() => {
              if (treeMode === 'avl') {
                const vals = new Set<number>();
                while (vals.size < 9) vals.add(Math.floor(Math.random() * 90) + 10);
                const sorted = Array.from(vals).sort((a,b) => a - b);
                const buildBalanced = (arr: number[]): TreeNode | null => {
                  if(arr.length === 0) return null;
                  const mid = Math.floor(arr.length / 2);
                  const node: TreeNode = { id: generateId(), val: arr[mid], left: null, right: null, height: 1 };
                  node.left = buildBalanced(arr.slice(0, mid));
                  node.right = buildBalanced(arr.slice(mid + 1));
                  const lh = node.left ? node.left.height : 0;
                  const rh = node.right ? node.right.height : 0;
                  node.height = 1 + Math.max(lh, rh);
                  return node;
                };
                setRoot(buildBalanced(sorted));
              } else {
                const r: TreeNode = { id: generateId(), val: 50, left: null, right: null, height: 1 };
                const vals = [25, 75, 10, 30, 60, 90];
                for(let i=0; i<3; i++) vals.push(Math.floor(Math.random() * 90) + 10);
                const insertIter = (node: TreeNode, v: number) => {
                  if (compareValues(v, node.val) < 0) {
                    if(!node.left) node.left = { id: generateId(), val: v, left: null, right: null, height: 1 };
                    else insertIter(node.left, v);
                  } else {
                    if(!node.right) node.right = { id: generateId(), val: v, left: null, right: null, height: 1 };
                    else insertIter(node.right, v);
                  }
                };
                vals.forEach(v => insertIter(r, v));
                setRoot(r);
              }
            }} variant="secondary" icon={Dices} disabled={isRunning}>Randomize</Button>
            <Button onClick={() => setRoot(null)} variant="danger" icon={Trash2} disabled={isRunning}>Clear All</Button>
          </div>
        </div>
      </div>
      {/* RIGHT: Canvas */}
      <div
        className="flex-1 min-h-[60vh] lg:min-h-0 relative flex flex-col items-center justify-start pt-24 overflow-auto"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: 600, height: 600, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT_HEX}08 0%, transparent 70%)`,
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        />
        <GridBackground />
        
        {/* Status Message Overlay */}
        <AnimatePresence>
          {message && message !== 'Idle' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-8 px-6 py-2 rounded-full font-mono text-sm shadow-lg z-50 border"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: ACCENT,
                color: 'var(--text-primary)'
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Panel */}
        {CODE_SNIPPETS[currentOp] && (
          <div className="absolute bottom-8 left-8 z-30">
            <CodePanel code={CODE_SNIPPETS[currentOp]} activeLine={activeLine} accent={ACCENT} />
          </div>
        )}

        <div className="relative w-full h-full max-w-4xl min-h-[600px] flex justify-center">
          <AnimatePresence>
            <svg className="absolute w-full h-full pointer-events-none overflow-visible">
              {nodesList.map(n => typeof n.px === 'number' && (
                <motion.line 
                  key={`line-${n.id}`} 
                  initial={{ pathLength: 0 }} 
                  animate={{ pathLength: 1 }} 
                  exit={{ opacity: 0 }}
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
            {nodesList.map(n => (
              <motion.div 
                layout
                key={`node-${n.id}`} 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300"
                style={{
                  left: n.x + 450 - 24,
                  top: n.y,
                  background: activeNode === n.id ? ACCENT_HEX : 'var(--bg-elevated)',
                  borderColor: activeNode === n.id ? ACCENT_HEX : ACCENT_HEX + '50',
                  color: activeNode === n.id ? 'black' : 'var(--text-primary)',
                  transform: activeNode === n.id ? 'scale(1.25)' : 'scale(1)',
                  zIndex: activeNode === n.id ? 10 : 1,
                }}
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
