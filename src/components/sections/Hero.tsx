import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  id: string;
}

export const Hero = React.memo<HeroProps>(({ id }) => {
  return (
    <section id={id} className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#020202]">
      <div className="absolute top-0 left-0 right-0 h-[80vh] spotlight z-0" />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div></div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /><span className="text-[10px] font-mono tracking-[0.3em] text-neutral-400 uppercase">System v3.0 // Online</span>
        </motion.div>
        <div className="relative text-center">
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[4rem] sm:text-[6rem] md:text-[9rem] leading-[0.85] font-bold font-mono text-white tracking-tighter opacity-90">Algo<span className="text-cyan-400">Verse</span></motion.h1>
        </div>
        <motion.div className="flex flex-col items-center gap-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-md text-center text-sm font-mono text-neutral-500 leading-relaxed tracking-wide">Algorithm Visualization Architecture.<br /><span className="text-neutral-700">Precision engineering for data structures.</span></motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 opacity-30 cursor-default"><div className="w-px h-3 bg-neutral-700" /><span className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase">Creator: Abhay Varshit Aripirala</span><div className="w-px h-3 bg-neutral-700" /></motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}><button onClick={() => document.getElementById('arrays')?.scrollIntoView({ behavior: 'smooth' })} className="group relative px-8 py-3 bg-transparent overflow-hidden"><div className="absolute inset-0 border-y border-white/10 group-hover:border-cyan-500/50" /><span className="relative text-xs font-mono font-bold tracking-[0.2em] text-neutral-300 group-hover:text-cyan-400 uppercase flex items-center gap-3">Initialize <ArrowRight size={14} /></span></button></motion.div>
      </div>
      <div className="absolute bottom-0 w-full border-t border-white/5 bg-[#020202]/80 backdrop-blur-md py-4 px-8 flex justify-between items-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest z-20">
        <div className="flex gap-8"><span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> Latency: 12ms</span><span className="hidden sm:flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500 rounded-full"></div> WebGL: Active</span></div>
        <div className="flex gap-4 opacity-50"><span>SCROLL TO BEGIN</span><div className="w-[1px] h-3 bg-neutral-700"></div><ChevronDown size={12} className="animate-bounce" /></div>
      </div>
    </section>
  );
});
