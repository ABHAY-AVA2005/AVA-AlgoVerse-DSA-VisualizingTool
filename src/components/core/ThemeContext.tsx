import React from 'react';

export const ThemeContext = React.createContext({ isDark: true, toggleTheme: () => {} });

export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap');
    
    :root {
      --bg-primary: #050505;
      --bg-secondary: #0A0A0A;
      --text-primary: #e5e5e5;
      --text-secondary: #a3a3a3;
      --primary: #22d3ee;
      --border-color: rgba(255, 255, 255, 0.08);
      --card-bg: rgba(5, 5, 5, 0.6);
    }

    [data-theme='light'] {
      --bg-primary: #ffffff;
      --bg-secondary: #f6f8fa;
      --text-primary: #1f2328;
      --text-secondary: #656d76;
      --primary: #0969da;
      --border-color: #d0d7de;
      --card-bg: rgba(255, 255, 255, 0.85);
    }

    body, button, a, input, select, textarea {
      cursor: none !important;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      margin: 0;
      padding: 0;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .font-mono { font-family: 'JetBrains Mono', monospace !important; }

    .spotlight {
      background: radial-gradient(
        circle at 50% 0%, 
        var(--primary) 0%, 
        transparent 60%
      );
      opacity: 0.15;
      pointer-events: none;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-secondary); }
    ::-webkit-scrollbar-thumb { background: var(--text-secondary); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
  `}</style>
);

export const THEME = {
  bg: "bg-[var(--bg-primary)]",
  sidebar: "bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-[var(--border-color)] shadow-[5px_0_40px_-10px_rgba(0,0,0,0.1)]", 
  canvas: "bg-[var(--bg-primary)] relative overflow-hidden transition-colors duration-300",
  card: "bg-[var(--card-bg)] border border-[var(--border-color)]",
  text: "text-[var(--text-primary)]",
  textMuted: "text-[var(--text-secondary)]"
};
