import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from './ThemeContext';

export const SystemCursor = () => {
  const { isDark } = useContext(ThemeContext);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const mouseRef = useRef({ x: -100, y: -100 });
  // FIX: scrollRef now allows number for requestAnimationFrame ID
  const scrollRef = useRef<number | null>(null);
  const isInside = useRef(false);

  useEffect(() => {
    // FIX: Parameter 'e' type defined as MouseEvent
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });
      mouseRef.current = { x: clientX, y: clientY };
      isInside.current = true;
    };

    const handleMouseLeave = () => { isInside.current = false; };
    const handleMouseEnter = () => { isInside.current = true; };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (!isInside.current) {
        scrollRef.current = window.requestAnimationFrame(checkScroll);
        return;
      }
      const elementUnderCursor = document.elementFromPoint(mouseRef.current.x, mouseRef.current.y);
      const isSafeZone = elementUnderCursor?.closest('.no-scroll');
      if (isSafeZone) {
        scrollRef.current = window.requestAnimationFrame(checkScroll);
        return;
      }
      const h = window.innerHeight;
      const y = mouseRef.current.y;
      const threshold = 100;
      const maxSpeed = 12;
      if (y > h - threshold) {
        const intensity = (y - (h - threshold)) / threshold;
        window.scrollBy(0, intensity * maxSpeed);
      }
      // Removed auto-scroll for top edge
      scrollRef.current = window.requestAnimationFrame(checkScroll);
    };
    // FIX: Assigning number to Ref
    scrollRef.current = window.requestAnimationFrame(checkScroll);
    return () => { if (scrollRef.current) window.cancelAnimationFrame(scrollRef.current); };
  }, []);

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] ${isDark ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9),0_0_30px_rgba(34,211,238,0.6)] mix-blend-screen' : 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.9),0_0_30px_rgba(37,99,235,0.6)]'}`}
        animate={{ x: mousePos.x - 4, y: mousePos.y - 4, opacity: isInside.current ? 1 : 0 }}
        transition={{ duration: 0 }}
      />
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-[9998] flex items-center justify-center ${isDark ? 'border-cyan-400/40 shadow-[inset_0_0_10px_rgba(34,211,238,0.3),0_0_20px_rgba(34,211,238,0.4)]' : 'border-blue-500/60 shadow-[inset_0_0_10px_rgba(37,99,235,0.3),0_0_20px_rgba(37,99,235,0.4)]'}`}
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          opacity: isInside.current ? 1 : 0,
          scale: 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.2 }}
      >
        <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-cyan-300 shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'bg-blue-400 shadow-[0_0_5px_rgba(37,99,235,0.8)]'}`} />
      </motion.div>
    </>
  );
};
