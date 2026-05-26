import React from 'react';

export const ThemeContext = React.createContext({ isDark: true, toggleTheme: () => {}, speedFactor: 1, setSpeedFactor: (val: number) => {} });

export const GlobalStyles = () => (
  <style>{`
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
      --accent-arrays:  #22D3EE;
      --accent-ll:      #A78BFA;
      --accent-search:  #34D399;
      --accent-sorting: #F59E0B;
      --accent-hashing: #F472B6;
      --accent-stack:   #60A5FA;
      --accent-tree:    #4ADE80;
      --accent-graph:   #FB923C;
      --accent-sched:   #E879F9;

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
      --bg-primary: #F6F9FC;
      --bg-secondary: #FFFFFF;
      --bg-tertiary: #E3E8EE;
      --bg-elevated: #FFFFFF;
      --text-primary: #1A1F36;
      --text-secondary: #4F566B;
      --text-muted: #8792A2;
      --primary: #635BFF;
      --primary-dim: rgba(99, 91, 255, 0.08);
      --primary-glow: rgba(99, 91, 255, 0.15);
      --border-color: rgba(26, 31, 54, 0.08);
      --border-active: rgba(26, 31, 54, 0.15);
      --card-bg: rgba(255, 255, 255, 0.65);
      --card-bg-hover: rgba(255, 255, 255, 0.95);
    }

    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      overflow-x: hidden;
    }
    body {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      margin: 0;
      padding: 0;
      font-family: var(--font-mono);
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.3s ease, color 0.3s ease;
    }



    .font-display { font-family: var(--font-display) !important; }
    .font-mono    { font-family: var(--font-mono) !important; }

    .grid-bg {
      background-image:
        linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

    ::selection { background: var(--primary-dim); }
  `}</style>
);

export const THEME = {
  bg:        "bg-[var(--bg-primary)]",
  sidebar:   "bg-[var(--bg-secondary)] border-r border-[var(--border-color)]",
  canvas:    "bg-[var(--bg-primary)] relative overflow-hidden",
  card:      "bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)]",
  text:      "text-[var(--text-primary)]",
  textMuted: "text-[var(--text-secondary)]",
};
