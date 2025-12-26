import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Github, Hash, Layers, GitBranch, Search as SearchIcon, Clock, BarChart3, List, Menu, Sun, Moon, X, Network
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeContext } from '../core/ThemeContext';

interface TopBarProps {
  activeSection: string;
}

export const TopBar: React.FC<TopBarProps> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = React.useContext(ThemeContext);
  
  const sections = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'arrays', label: 'Arrays', icon: List },
    { id: 'll', label: 'Linked Lists', icon: GitBranch },
    { id: 'search', label: 'Searching', icon: SearchIcon },
    { id: 'hashing', label: 'Hashing', icon: Hash },
    { id: 'stack', label: 'Stacks & Queues', icon: Layers },
    { id: 'tree', label: 'Tree', icon: GitBranch },
    { id: 'graph', label: 'Graphs', icon: Network },
    { id: 'sched', label: 'Scheduling', icon: Clock },
    { id: 'sorting', label: 'Sorting', icon: BarChart3 },
  ];

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
         <div onClick={() => scrollTo('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 border border-cyan-500/30 rounded" />
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold font-mono tracking-widest text-[var(--text-primary)] group-hover:text-cyan-500 transition-colors">
                AVA
            </span>
         </div>
         
         <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="p-2 hover:bg-[var(--bg-primary)] rounded-full text-[var(--text-primary)] transition-all border border-transparent hover:border-[var(--border-color)]">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-[var(--bg-primary)] rounded-full text-[var(--text-primary)] transition-all">
                <Menu size={24} />
             </button>
         </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
           <>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
             />
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 right-0 w-full sm:w-80 bg-[var(--bg-secondary)] border-l border-[var(--border-color)] z-[70] flex flex-col shadow-2xl backdrop-blur-2xl"
             >
                <div className="p-6 flex justify-between items-center border-b border-[var(--border-color)]">
                    <span className="text-lg font-bold font-mono tracking-widest text-cyan-500">NAVIGATION</span>
                    <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                   {sections.map((section) => (
                      <button 
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className={cn(
                           "w-full text-left px-8 py-4 flex items-center gap-4 hover:bg-[var(--bg-primary)] transition-all group font-mono relative overflow-hidden",
                           activeSection === section.id ? "text-cyan-500 bg-cyan-500/5" : "text-[var(--text-secondary)]"
                        )}
                      >
                          {activeSection === section.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />}
                          <section.icon size={18} />
                          <span className="text-sm font-medium tracking-wide uppercase">{section.label}</span>
                      </button>
                   ))}
                </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>
    </>
  );
};
