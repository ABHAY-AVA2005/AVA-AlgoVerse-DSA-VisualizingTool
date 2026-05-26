# AVA AlgoVerse — Complete UI/UX Redesign Prompts
# Give each PROMPT block to your AI coding assistant (Cursor / Claude Code) independently.
# Do NOT modify animation logic, algorithm engines, or data structure implementations.
# Only structural, styling, and layout changes.

---

## PROMPT 1 — Global Design System (ThemeContext.tsx)

Replace the `GlobalStyles` component and CSS variables in `src/components/core/ThemeContext.tsx`.

**Goals:**
- Introduce a richer design token system with per-module accent colors
- Add a proper display font alongside the mono font
- Improve spacing scale and card surface definitions

**Instructions:**

Replace the entire `<style>` content inside `GlobalStyles` with the following:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;500;600;700;800&display=swap');

:root {
  /* --- Surfaces --- */
  --bg-primary: #08090C;
  --bg-secondary: #0D0F14;
  --bg-tertiary: #111318;
  --bg-elevated: #161921;

  /* --- Text --- */
  --text-primary: #E8EAF0;
  --text-secondary: #6B7280;
  --text-muted: #3D4149;

  /* --- Brand accent (Arrays / default) --- */
  --primary: #22D3EE;
  --primary-dim: rgba(34, 211, 238, 0.12);
  --primary-glow: rgba(34, 211, 238, 0.25);

  /* --- Per-module accent palette --- */
  --accent-arrays:    #22D3EE;   /* cyan    */
  --accent-ll:        #A78BFA;   /* violet  */
  --accent-search:    #34D399;   /* emerald */
  --accent-sorting:   #F59E0B;   /* amber   */
  --accent-hashing:   #F472B6;   /* pink    */
  --accent-stack:     #60A5FA;   /* blue    */
  --accent-tree:      #4ADE80;   /* green   */
  --accent-graph:     #FB923C;   /* orange  */
  --accent-sched:     #E879F9;   /* fuchsia */

  /* --- Borders --- */
  --border-color: rgba(255, 255, 255, 0.06);
  --border-active: rgba(255, 255, 255, 0.14);

  /* --- Card surfaces --- */
  --card-bg: rgba(13, 15, 20, 0.85);
  --card-bg-hover: rgba(22, 25, 33, 0.9);

  /* --- Typography --- */
  --font-display: 'Syne', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* --- Radius --- */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

[data-theme='light'] {
  --bg-primary: #F8F9FC;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #EFF1F5;
  --bg-elevated: #FFFFFF;
  --text-primary: #111318;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --primary: #0E7AC4;
  --primary-dim: rgba(14, 122, 196, 0.08);
  --primary-glow: rgba(14, 122, 196, 0.18);
  --border-color: rgba(0, 0, 0, 0.07);
  --border-active: rgba(0, 0, 0, 0.15);
  --card-bg: rgba(255, 255, 255, 0.9);
  --card-bg-hover: rgba(248, 249, 252, 0.95);
}

*, *::before, *::after { box-sizing: border-box; }

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button, a, input, select, textarea { cursor: none !important; }

.font-display { font-family: var(--font-display) !important; }
.font-mono    { font-family: var(--font-mono) !important; }

/* Subtle grid background — tighter, less noise */
.grid-bg {
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

/* Selection */
::selection { background: var(--primary-dim); }
```

Also update the `THEME` export to:

```typescript
export const THEME = {
  bg:      "bg-[var(--bg-primary)]",
  sidebar: "bg-[var(--bg-secondary)] border-r border-[var(--border-color)]",
  canvas:  "bg-[var(--bg-primary)] relative overflow-hidden",
  card:    "bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)]",
  text:    "text-[var(--text-primary)]",
  textMuted: "text-[var(--text-secondary)]",
};
```

---

## PROMPT 2 — Navigation Sidebar (TopBar.tsx → LeftSidebar.tsx)

**Create a new file** `src/components/layouts/LeftSidebar.tsx`.
**Then update** `src/App.tsx` to use it.

**Goal:** Replace the hamburger + slide drawer with a persistent left sidebar that gives users constant spatial orientation. The sidebar collapses to icon-only on small screens.

**Instructions — create `src/components/layouts/LeftSidebar.tsx`:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, Hash, Layers, GitBranch, Search as SearchIcon,
  Clock, BarChart3, List, Network, TreePine
} from 'lucide-react';
import { ThemeContext } from '../core/ThemeContext';

interface LeftSidebarProps {
  activeSection: string;
}

const NAV_ITEMS = [
  { id: 'home',    label: 'Home',          icon: Home,       accent: '#22D3EE' },
  { id: 'arrays',  label: 'Arrays',        icon: List,       accent: '#22D3EE' },
  { id: 'll',      label: 'Linked Lists',  icon: GitBranch,  accent: '#A78BFA' },
  { id: 'search',  label: 'Search',        icon: SearchIcon, accent: '#34D399' },
  { id: 'sorting', label: 'Sorting',       icon: BarChart3,  accent: '#F59E0B' },
  { id: 'hashing', label: 'Hashing',       icon: Hash,       accent: '#F472B6' },
  { id: 'stack',   label: 'Stack / Queue', icon: Layers,     accent: '#60A5FA' },
  { id: 'tree',    label: 'Trees',         icon: TreePine,   accent: '#4ADE80' },
  { id: 'graph',   label: 'Graphs',        icon: Network,    accent: '#FB923C' },
  { id: 'sched',   label: 'Scheduling',    icon: Clock,      accent: '#E879F9' },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeSection }) => {
  const { isDark, toggleTheme } = React.useContext(ThemeContext);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop sidebar — fixed left */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 w-[64px] xl:w-[200px]"
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => scrollTo('home')}
          className="flex items-center gap-3 px-4 py-5 cursor-pointer shrink-0"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg" style={{ border: '1px solid rgba(34,211,238,0.3)' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span
            className="hidden xl:block text-sm font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            AVA
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full flex items-center gap-3 px-4 py-2.5 relative transition-all text-left"
                style={{
                  color: isActive ? item.accent : 'var(--text-secondary)',
                  background: isActive ? `${item.accent}10` : 'transparent',
                  borderRight: isActive ? `2px solid ${item.accent}` : '2px solid transparent',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                <span
                  className="hidden xl:block text-[11px] tracking-wider uppercase truncate"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div
          className="p-3 shrink-0"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center xl:justify-start gap-3 px-1 py-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="text-xs">{isDark ? '☀' : '☽'}</span>
            <span className="hidden xl:block text-[10px] tracking-wider uppercase font-mono">
              {isDark ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar — compact */}
      <nav
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <span
          className="text-sm font-bold tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          AVA
        </span>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="p-2 rounded-lg shrink-0 transition-all"
                style={{
                  color: isActive ? item.accent : 'var(--text-muted)',
                  background: isActive ? `${item.accent}15` : 'transparent',
                }}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>
        <button onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }} className="text-sm ml-2">
          {isDark ? '☀' : '☽'}
        </button>
      </nav>
    </>
  );
};
```

**Update `src/App.tsx`:**

1. Replace `import { TopBar } from './components/layouts/TopBar';` with `import { LeftSidebar } from './components/layouts/LeftSidebar';`
2. Replace `<TopBar activeSection={sect} />` with `<LeftSidebar activeSection={sect} />`
3. Wrap `<main>` in a layout div that offsets for the sidebar:

```tsx
<div className="flex">
  <LeftSidebar activeSection={sect} />
  <main className="flex-1 lg:ml-[64px] xl:ml-[200px] mt-[53px] lg:mt-0">
    {/* all sections here */}
  </main>
</div>
```

4. Remove the old TopBar import entirely.

---

## PROMPT 3 — Section Layout (per-module accent color system)

**Goal:** Make each section visually distinct using its module accent color. Update the sidebar panel of every section to carry the module's accent color for borders, icons, and labels. The canvas side gets a subtle radial glow matching the accent.

**Instructions — update the layout wrapper inside EVERY Section component** (ArraySection, LinkedListSection, SearchSection, SortingSection, HashingSection, StackQueueSection, TreeSection, GraphSection, SchedulingSection):

Add an `accent` prop/constant to each section and apply it throughout. Here's the pattern using ArraySection as the reference — apply the same approach to every other section:

**In `ArraySection.tsx`:**

At the top of the component, add:
```tsx
const ACCENT = 'var(--accent-arrays)'; // use the correct var per section
```

Update the section wrapper `<section>` to:
```tsx
<section
  id={id}
  className="min-h-screen w-full flex flex-col lg:flex-row relative"
  style={{ borderTop: '1px solid var(--border-color)' }}
>
```

Update the sidebar `<div>` (the 30% panel) to:
```tsx
<div
  className="w-full lg:w-[300px] shrink-0 flex flex-col z-20 gap-6 p-6 lg:p-8"
  style={{
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    borderLeft: `2px solid ${ACCENT}`,
  }}
>
```

Update the canvas `<div>` (the 70% panel) to:
```tsx
<div
  className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-hidden"
  style={{ background: 'var(--bg-primary)' }}
>
  {/* Accent radial glow — purely decorative */}
  <div
    className="absolute pointer-events-none"
    style={{
      width: 600,
      height: 600,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  />
  <GridBackground />
  {/* ...existing visualization content... */}
</div>
```

**Per-section ACCENT values:**
```
ArraySection:      var(--accent-arrays)   → #22D3EE
LinkedListSection: var(--accent-ll)       → #A78BFA
SearchSection:     var(--accent-search)   → #34D399
SortingSection:    var(--accent-sorting)  → #F59E0B
HashingSection:    var(--accent-hashing)  → #F472B6
StackQueueSection: var(--accent-stack)    → #60A5FA
TreeSection:       var(--accent-tree)     → #4ADE80
GraphSection:      var(--accent-graph)    → #FB923C
SchedulingSection: var(--accent-sched)    → #E879F9
```

---

## PROMPT 4 — SectionHeader Component (SectionHeader.tsx)

**Goal:** Make section headers feel premium — large display-font number on the right, bold display-font title, subtitle in mono. Currently the "01" ghost number is barely visible and the title is small mono text.

**Replace the entire contents of `src/components/ui/SectionHeader.tsx`:**

```tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  index: string;
  accent?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, subtitle, icon: Icon, index, accent = 'var(--primary)'
}) => (
  <div className="relative pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
    {/* Ghost index number */}
    <span
      className="absolute -top-2 right-0 select-none pointer-events-none font-bold leading-none"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '72px',
        color: accent,
        opacity: 0.06,
        letterSpacing: '-4px',
      }}
    >
      {index}
    </span>

    {/* Icon + Tag */}
    <div className="flex items-center gap-2 mb-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
      >
        <Icon size={13} style={{ color: accent }} />
      </div>
      <span
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ color: accent, fontFamily: 'var(--font-mono)' }}
      >
        Module {index}
      </span>
    </div>

    {/* Title */}
    <h2
      className="text-2xl font-bold leading-tight mb-1"
      style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
    >
      {title}
    </h2>

    {/* Subtitle */}
    <p
      className="text-xs"
      style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
    >
      {subtitle}
    </p>
  </div>
);
```

Also update every section that uses `SectionHeader` to pass the `accent` prop:
```tsx
<SectionHeader title="Arrays" subtitle="Linear Memory Blocks." icon={List} index="01" accent={ACCENT} />
```

---

## PROMPT 5 — ComplexityHUD Component (ComplexityHUD.tsx)

**Goal:** Make the Performance Analytics card feel data-dense and premium. Add a colored indicator dot per complexity tier, improve label hierarchy, and add a subtle active state border on hover.

**Replace entire `src/components/ui/ComplexityHUD.tsx`:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface ComplexityData {
  time: { best: string; avg: string; worst: string; };
  space: string;
  note?: string;
}

interface ComplexityHUDProps {
  data: ComplexityData;
  accent?: string;
}

const TIERS = [
  { key: 'best',  label: 'Best (Ω)',  color: '#10B981' },
  { key: 'avg',   label: 'Avg (Θ)',   color: 'var(--primary)' },
  { key: 'worst', label: 'Worst (O)', color: '#F43F5E' },
] as const;

export const ComplexityHUD: React.FC<ComplexityHUDProps> = ({ data, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-[var(--radius-lg)] overflow-hidden"
    style={{
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border-color)',
    }}
  >
    {/* Header */}
    <div
      className="flex items-center gap-2 px-4 py-2.5"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Activity
        size={11}
        style={{ color: accent || 'var(--primary)' }}
      />
      <span
        className="text-[9px] uppercase tracking-[0.18em]"
        style={{ color: accent || 'var(--primary)', fontFamily: 'var(--font-mono)' }}
      >
        Performance Analytics
      </span>
    </div>

    {/* Complexity grid */}
    <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'var(--border-color)' }}>
      {TIERS.map(({ key, label, color }) => (
        <div key={key} className="px-3 py-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
            <span
              className="text-[8px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {label}
            </span>
          </div>
          <span
            className="text-sm font-bold font-mono"
            style={{ color }}
          >
            {data.time[key]}
          </span>
        </div>
      ))}
    </div>

    {/* Space row */}
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
      <span
        className="text-[9px] uppercase tracking-wider"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        Space
      </span>
      <span
        className="text-xs font-mono font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {data.space}
      </span>
    </div>

    {/* Note */}
    {data.note && (
      <div
        className="px-4 py-2.5 flex gap-2 items-start text-[10px] font-mono leading-relaxed"
        style={{
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ background: accent || 'var(--primary)' }} />
        {data.note}
      </div>
    )}
  </motion.div>
);
```

---

## PROMPT 6 — Button Component (Button.tsx)

**Goal:** Make buttons feel more intentional — cleaner shape, stronger affordance, less neon glow.

**Replace entire `src/components/ui/Button.tsx`:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ai' | 'active' | 'ghost';
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  accent?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children, onClick, variant = 'primary', className, disabled, icon: Icon, accent
}) => {
  const base = "px-4 py-2.5 rounded-[var(--radius-md)] font-mono font-medium text-[11px] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none tracking-[0.05em] uppercase";

  const variants: Record<string, string> = {
    primary:   "text-cyan-400 border border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 hover:border-cyan-500/50",
    secondary: "text-[var(--text-secondary)] border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
    danger:    "text-rose-400 border border-rose-500/25 bg-rose-500/8 hover:bg-rose-500/15 hover:border-rose-500/40",
    ai:        "text-violet-400 border border-violet-500/30 bg-violet-500/8 hover:bg-violet-500/15",
    active:    "text-black bg-cyan-400 border-none font-bold shadow-none",
    ghost:     "text-[var(--text-secondary)] border-none bg-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
  };

  const style = accent && variant === 'primary' ? {
    color: accent,
    borderColor: `${accent}40`,
    backgroundColor: `${accent}0D`,
  } : {};

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={cn(base, variants[variant], className)}
    >
      {Icon && <Icon size={13} />}
      {children}
    </motion.button>
  );
};
```

---

## PROMPT 7 — Input Component (Input.tsx)

**Goal:** Inputs should feel clean, focused, and not generic. Remove the glowing border on focus, use a subtle underline-style active state instead.

**Replace entire `src/components/ui/Input.tsx`:**

```tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  accent?: string;
}

export const Input: React.FC<InputProps> = ({
  value, onChange, placeholder, className, type = 'text', accent
}) => (
  <div className="relative w-full group">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-[var(--radius-md)] px-3 py-2.5 text-[11px] font-mono transition-all duration-200 outline-none",
        "placeholder:text-[var(--text-muted)]",
        className
      )}
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = accent || 'rgba(34,211,238,0.4)';
        e.currentTarget.style.background = 'var(--bg-tertiary)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.background = 'var(--bg-primary)';
      }}
    />
  </div>
);
```

---

## PROMPT 8 — Array Element Cards (ArraySection.tsx visualization only)

**Goal:** Array element cards should feel like physical memory blocks — structured, with an index badge at the bottom and value prominently centered. Currently they're nearly identical to generic cards.

**Replace only the `motion.div` inside the `arr.map()` in `ArraySection.tsx`:**

```tsx
<motion.div
  layout
  key={`${i}-${v}`}
  initial={{ opacity: 0, scale: 0.6, y: 20 }}
  animate={{
    opacity: 1,
    scale: active === i ? 1.08 : 1,
    y: 0,
  }}
  exit={{ opacity: 0, scale: 0.5, y: -10 }}
  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
  className="relative flex flex-col items-center justify-center"
  style={{
    width: 76,
    height: 92,
    borderRadius: 'var(--radius-md)',
    background: active === i ? 'rgba(34,211,238,0.08)' : 'var(--bg-elevated)',
    border: `1px solid ${active === i ? 'rgba(34,211,238,0.5)' : 'var(--border-color)'}`,
    boxShadow: active === i ? '0 0 24px rgba(34,211,238,0.15)' : 'none',
    transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
  }}
>
  {/* Top address bar */}
  <div
    className="absolute top-0 left-0 right-0 h-1 rounded-t-[var(--radius-md)]"
    style={{ background: active === i ? '#22D3EE' : 'var(--border-color)' }}
  />

  {/* Value */}
  <span
    className="text-xl font-bold font-mono"
    style={{ color: active === i ? '#22D3EE' : 'var(--text-primary)' }}
  >
    {v}
  </span>

  {/* Index badge */}
  <div
    className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-1.5 rounded-b-[var(--radius-md)]"
    style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}
  >
    <span
      className="text-[8px] font-mono tracking-wider uppercase"
      style={{ color: 'var(--text-muted)' }}
    >
      [{i}]
    </span>
  </div>
</motion.div>
```

---

## PROMPT 9 — Sorting Bar Visualization (SortingSection.tsx)

**Goal:** Sorting bars need semantic color — comparing bars should be amber, pivot should be the accent, sorted bars should turn green. Replace the plain white/gray bars with a color-coded system.

**In `SortingSection.tsx`, replace the bar rendering inside the canvas with this pattern:**

First, ensure you have these state variables already in the component (they already exist):
- `active` — indices being compared
- `pivots` — pivot index
- `subLeft`, `subRight` — sub-partition indicators

**Replace the bar rendering div:**

```tsx
{/* In the canvas div, replace the bars mapping */}
<div className="flex items-end gap-1 h-64 px-4" style={{ minWidth: 0 }}>
  {arr.map((v, i) => {
    const isActive = active.includes(i);
    const isPivot  = pivots.includes(i);
    const isLeft   = subLeft.includes(i);
    const isRight  = subRight.includes(i);

    let barColor = 'var(--text-muted)';
    let glowColor = 'transparent';

    if (isPivot) {
      barColor = '#F59E0B';   // amber — pivot
      glowColor = 'rgba(245,158,11,0.25)';
    } else if (isActive) {
      barColor = '#22D3EE';   // cyan — active comparison
      glowColor = 'rgba(34,211,238,0.2)';
    } else if (isLeft) {
      barColor = '#A78BFA';   // violet — left partition
    } else if (isRight) {
      barColor = '#34D399';   // green — right partition
    }

    const numVal = typeof v === 'number' ? v : 50;
    const heightPx = Math.max(8, (numVal / 100) * 240);

    return (
      <motion.div
        key={i}
        layout
        animate={{ height: heightPx, backgroundColor: barColor }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 rounded-t-sm relative"
        style={{
          minWidth: 4,
          boxShadow: glowColor !== 'transparent'
            ? `0 0 12px ${glowColor}`
            : 'none',
        }}
      />
    );
  })}
</div>
```

---

## PROMPT 10 — Linked List Node Visualization (LinkedListSection.tsx)

**Goal:** Linked list nodes should look like actual memory nodes — a value cell on the left and a pointer cell on the right, connected by arrows. Replace any existing node rendering.

**In `LinkedListSection.tsx`, replace the node rendering inside the canvas with:**

```tsx
<div className="flex items-center flex-wrap gap-0 justify-center max-w-4xl">
  {list.map((node, i) => (
    <div key={i} className="flex items-center">
      {/* Node card — value | pointer */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: active === i ? 1.06 : 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="flex overflow-hidden"
        style={{
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${active === i ? '#A78BFA60' : 'var(--border-color)'}`,
          background: active === i ? 'rgba(167,139,250,0.08)' : 'var(--bg-elevated)',
          boxShadow: active === i ? '0 0 20px rgba(167,139,250,0.15)' : 'none',
        }}
      >
        {/* Value cell */}
        <div
          className="w-16 h-12 flex items-center justify-center font-mono font-bold text-base"
          style={{ color: active === i ? '#A78BFA' : 'var(--text-primary)' }}
        >
          {node.val}
        </div>
        {/* Pointer cell */}
        <div
          className="w-10 h-12 flex items-center justify-center"
          style={{
            borderLeft: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: i < list.length - 1 ? '#A78BFA' : 'var(--text-muted)' }}
          />
        </div>
      </motion.div>

      {/* Arrow connector */}
      {i < list.length - 1 && (
        <div className="flex items-center mx-1">
          <div className="h-px w-6" style={{ background: 'var(--border-active)' }} />
          <div
            className="w-0 h-0"
            style={{
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderLeft: '5px solid var(--border-active)',
            }}
          />
        </div>
      )}
    </div>
  ))}
</div>
```

---

## PROMPT 11 — Hero Section (Hero.tsx)

**Goal:** The Hero should feel like a command center boot screen — not just text on black. Use the display font for "AlgoVerse", add a proper grid-based layout with a stats footer, and add a subtle animated background.

**Replace entire `src/components/sections/Hero.tsx`:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps { id: string; }

const STATS = [
  { label: 'Algorithms', value: '20+' },
  { label: 'Structures',  value: '10'  },
  { label: 'Latency',     value: '12ms' },
  { label: 'Modules',     value: '9'   },
];

export const Hero = React.memo<HeroProps>(({ id }) => (
  <section
    id={id}
    className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    style={{ background: 'var(--bg-primary)' }}
  >
    {/* Subtle grid */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    {/* Radial glow */}
    <div
      className="absolute pointer-events-none"
      style={{
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase" style={{ color: 'var(--text-secondary)' }}>
          System v3.0 — Online
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <h1
          className="leading-[0.88] font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 12vw, 120px)',
            color: 'var(--text-primary)',
            letterSpacing: '-3px',
          }}
        >
          Algo<span style={{ color: '#22D3EE' }}>Verse</span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-sm max-w-sm leading-relaxed"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
      >
        Algorithm visualization architecture.{' '}
        <span style={{ color: 'var(--text-muted)' }}>
          Precision engineering for data structures.
        </span>
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => document.getElementById('arrays')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-3 px-7 py-3 font-mono font-bold text-xs tracking-[0.12em] uppercase rounded-full transition-all"
        style={{
          background: 'rgba(34,211,238,0.1)',
          border: '1px solid rgba(34,211,238,0.35)',
          color: '#22D3EE',
        }}
      >
        Initialize
        <ArrowRight size={14} />
      </motion.button>
    </div>

    {/* Stats footer bar */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="absolute bottom-0 w-full flex items-center justify-center gap-0"
      style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="flex-1 flex flex-col items-center py-4 gap-0.5"
          style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--border-color)' : 'none' }}
        >
          <span
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {s.value}
          </span>
          <span
            className="text-[8px] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  </section>
));
```

---

## PROMPT 12 — GridBackground Component (GridBackground.tsx)

**Goal:** Replace the current dot/grid background with a two-layer crosshatch that's subtle but adds depth without visual noise.

**Replace entire `src/components/ui/GridBackground.tsx`:**

```tsx
import React from 'react';

export const GridBackground: React.FC = () => (
  <div
    className="absolute inset-0 pointer-events-none select-none"
    aria-hidden
  >
    {/* Primary grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
    {/* Accent grid — larger cells */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '192px 192px',
      }}
    />
  </div>
);
```

---

## PROMPT 13 — StepControl Component (StepControl.tsx)

**Goal:** The step mode toggle should be styled as a proper labeled row with a clean pill toggle, not using browser default checkboxes.

**Replace entire `src/components/ui/StepControl.tsx`:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface StepControlProps {
  stepMode: boolean;
  setStepMode: (v: boolean) => void;
  onNext: () => void;
  accent?: string;
}

export const StepControl: React.FC<StepControlProps> = ({
  stepMode, setStepMode, onNext, accent = 'var(--primary)'
}) => (
  <div className="flex flex-col gap-3">
    {/* Toggle row */}
    <div className="flex items-center justify-between">
      <span
        className="text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
      >
        Step Mode
      </span>
      <button
        onClick={() => setStepMode(!stepMode)}
        className="relative w-10 h-5 rounded-full transition-all duration-200"
        style={{
          background: stepMode ? accent : 'var(--bg-elevated)',
          border: '1px solid var(--border-active)',
        }}
        aria-label="Toggle step mode"
      >
        <motion.div
          animate={{ x: stepMode ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 rounded-full"
          style={{ background: stepMode ? 'black' : 'var(--text-secondary)' }}
        />
      </button>
    </div>

    {/* Next Step button — only visible when step mode is on */}
    {stepMode && (
      <motion.button
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        onClick={onNext}
        className="flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-md)] text-[11px] font-mono font-bold uppercase tracking-wider transition-all"
        style={{
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          color: accent,
        }}
      >
        <ChevronRight size={13} />
        Next Step
      </motion.button>
    )}
  </div>
);
```

---

## PROMPT 14 — Tailwind config update (tailwind.config.js)

**Update `tailwind.config.js` to extend the theme with the custom CSS variable references**, so Tailwind purging keeps the relevant classes and you can use `lg:ml-[64px]`, `xl:ml-[200px]` etc:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: {
          arrays:  '#22D3EE',
          ll:      '#A78BFA',
          search:  '#34D399',
          sorting: '#F59E0B',
          hashing: '#F472B6',
          stack:   '#60A5FA',
          tree:    '#4ADE80',
          graph:   '#FB923C',
          sched:   '#E879F9',
        }
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      }
    },
  },
  plugins: [],
};
```

---

## Summary — Order of Changes

Apply prompts in this order to avoid broken imports:

1. **PROMPT 1** — ThemeContext.tsx (design tokens, first, everything depends on this)
2. **PROMPT 14** — tailwind.config.js (extend theme)
3. **PROMPT 6** — Button.tsx
4. **PROMPT 7** — Input.tsx
5. **PROMPT 5** — ComplexityHUD.tsx
6. **PROMPT 4** — SectionHeader.tsx
7. **PROMPT 12** — GridBackground.tsx
8. **PROMPT 13** — StepControl.tsx
9. **PROMPT 2** — LeftSidebar.tsx (new file) + App.tsx update
10. **PROMPT 3** — All section layout wrappers (arrays, ll, search, sorting, hashing, stack, tree, graph, sched)
11. **PROMPT 8** — Array element card visual (ArraySection.tsx only)
12. **PROMPT 9** — Sorting bar visual (SortingSection.tsx only)
13. **PROMPT 10** — Linked List node visual (LinkedListSection.tsx only)
14. **PROMPT 11** — Hero.tsx

---

## What You'll Get After All Prompts

- Persistent left sidebar with icon labels + active section indicator per module color
- Each section has a unique accent color — you instantly know which module you're in
- Display font (Syne) for titles and headings; mono only for data/code
- Memory block–style array cards with address bar and index badge
- Color-coded sorting bars (comparing = cyan, pivot = amber, partitions = violet/green)
- Linked list nodes with value/pointer split cells and arrow connectors
- Premium complexity HUD with colored tier dots
- Hero with display font title, stat strip footer, and radial glow
- Clean toggle-style StepControl with animated thumb
- Two-layer subtle grid background
- No more hamburger — always-visible sidebar navigation
