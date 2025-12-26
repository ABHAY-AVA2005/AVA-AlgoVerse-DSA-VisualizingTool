import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ThemeContext, GlobalStyles } from './components/core/ThemeContext';
import { SystemCursor } from './components/core/SystemCursor';
import { TopBar } from './components/layouts/TopBar';
import { Footer } from './components/layouts/Footer';
import { CreatorBadge } from './components/core/CreatorBadge';
import { AIAssistant } from './components/core/AIAssistant';
import { Preloader } from './components/core/Preloader';
import { Hero } from './components/sections/Hero';
import { ArraySection } from './components/sections/ArraySection';
import { LinkedListSection } from './components/sections/LinkedListSection';
import { SearchSection } from './components/sections/SearchSection';
import { SortingSection } from './components/sections/SortingSection';
import { HashingSection } from './components/sections/HashingSection';
import { StackQueueSection } from './components/sections/StackQueueSection';
import { TreeSection } from './components/sections/TreeSection';
import { GraphSection } from './components/sections/GraphSection';
import { SchedulingSection } from './components/sections/SchedulingSection';









export default function App() {
   const [sect, setSect] = useState('home');
   const [aiOpen, setAiOpen] = useState(false);
   const [loading, setLoading] = useState(true);
   const [isDark, setIsDark] = useState(true);
   const toggleTheme = () => setIsDark(prev => !prev);

   useEffect(() => { const timer = setTimeout(() => setLoading(false), 4000); return () => clearTimeout(timer); }, []);
   useEffect(() => { document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light'); }, [isDark]);
   useEffect(() => {
     let timeoutId: number | null = null;
     const handleScroll = () => {
       const sections = ['home','arrays','ll','search','sorting','hashing','stack','tree','graph','sched'];
       let current = 'home';
       let minDist = Infinity;
       sections.forEach(id => {
         const el = document.getElementById(id);
         if (el) {
           const rect = el.getBoundingClientRect();
           const dist = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
           if (dist < minDist) { minDist = dist; current = id; }
         }
       });
       if (current !== sect) setSect(current);
     };
     const throttledScroll = () => { if (timeoutId) return; timeoutId = window.setTimeout(() => { handleScroll(); timeoutId = null; }, 100); };
     window.addEventListener('scroll', throttledScroll);
     return () => window.removeEventListener('scroll', throttledScroll);
   }, [sect]);

   return (
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <AnimatePresence>{loading && <Preloader key="loader" onLoadingComplete={() => setLoading(false)} />}</AnimatePresence>
        <div className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--primary)]/30 overflow-x-hidden relative transition-colors duration-300">
           <GlobalStyles /><SystemCursor /><TopBar activeSection={sect} />
           <main>
              <Hero id="home" />
              {/* Algorithm sections follow with 3:7 split */}
              <ArraySection id="arrays" />
              <LinkedListSection id="ll" />
              <SearchSection id="search" />
              <SortingSection id="sorting" />
              <HashingSection id="hashing" />
              <StackQueueSection id="stack" />
              <TreeSection id="tree" />
              <GraphSection id="graph" />
              <SchedulingSection id="sched" />
              <Footer />
           </main>
           
           <AnimatePresence>
             {sect === 'home' && <CreatorBadge />}
           </AnimatePresence>

           <div className="fixed bottom-8 right-8 z-50 no-scroll">
              <button onClick={() => setAiOpen(!aiOpen)} className="group p-4 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all border border-[var(--primary)]/50 shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-md">
                  <Sparkles size={24} className="group-hover:animate-pulse" />
              </button>
           </div>
           <AIAssistant activeSection={sect} isOpen={aiOpen} onClose={() => setAiOpen(false)} />
        </div>
      </ThemeContext.Provider>
   );
}