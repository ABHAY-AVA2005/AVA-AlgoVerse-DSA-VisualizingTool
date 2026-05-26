import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Hash, Layers, GitBranch, Search as SearchIcon,
  Clock, BarChart3, List, Network, TreePine, Sun, Moon, Volume2, VolumeX
} from 'lucide-react';
import { ThemeContext } from '../core/ThemeContext';
import { soundEngine } from '../../lib/SoundEngine';

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
  const { isDark, toggleTheme, speedFactor, setSpeedFactor } = React.useContext(ThemeContext);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);

  const toggleMute = () => {
    soundEngine.isMuted = !soundEngine.isMuted;
    setIsMuted(soundEngine.isMuted);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Desktop sidebar — fixed left ── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 w-[160px]"
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
            className="text-sm font-bold tracking-widest uppercase"
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
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.button
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
                    className="text-[11px] tracking-wider uppercase truncate"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {item.label}
                  </span>
                </motion.button>

                {/* Tooltip — slides in from the right of the sidebar */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -6, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -4, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-[168px] top-1/2 -translate-y-1/2 z-[200] pointer-events-none"
                    >
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider whitespace-nowrap"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: `1px solid ${item.accent}50`,
                          color: item.accent,
                          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${item.accent}20`,
                        }}
                      >
                        {/* Accent dot */}
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: item.accent }}
                        />
                        {item.label}
                      </div>
                      {/* Arrow pointing left */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -left-[5px] w-0 h-0"
                        style={{
                          borderTop: '5px solid transparent',
                          borderBottom: '5px solid transparent',
                          borderRight: `5px solid ${item.accent}50`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto border-t border-[var(--border-color)]">
          {/* Settings row */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-active)',
                color: isDark ? '#FBBF24' : '#6366F1',
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-xs font-bold font-mono">
                {isDark ? 'LIGHT' : 'DARK'}
              </span>
            </button>
            
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl transition-all flex items-center justify-center"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-active)',
                color: 'var(--text-secondary)',
              }}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] font-mono mb-2">
            <span>Speed</span>
            <span style={{ color: 'var(--primary)' }}>{speedFactor}x</span>
          </div>
          <input 
            type="range" 
            min="0.25" max="4" step="0.25" 
            value={speedFactor} 
            onChange={(e) => setSpeedFactor(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ background: 'var(--border-active)', accentColor: 'var(--primary)' }}
          />
        </div>
      </aside>

      {/* ── Mobile top bar — compact icon strip ── */}
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
        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
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
        {/* Mobile controls */}
        <div className="flex items-center gap-2 ml-2">
          <motion.button
            onClick={toggleMute}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-active)',
              color: 'var(--text-secondary)',
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-active)',
              color: isDark ? '#FBBF24' : '#6366F1',
            }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </motion.button>
        </div>
      </nav>
    </>
  );
};
