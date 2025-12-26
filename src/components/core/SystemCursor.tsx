import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const SystemCursor = () => {
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
      } else if (y < threshold && window.scrollY > 0) {
        const intensity = (threshold - y) / threshold;
        window.scrollBy(0, -(intensity * maxSpeed));
      }
      scrollRef.current = window.requestAnimationFrame(checkScroll);
    };
    // FIX: Assigning number to Ref
    scrollRef.current = window.requestAnimationFrame(checkScroll);
    return () => { if (scrollRef.current) window.cancelAnimationFrame(scrollRef.current); };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400/90 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        animate={{ x: mousePos.x - 3, y: mousePos.y - 3, opacity: isInside.current ? 1 : 0 }}
        transition={{ duration: 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border border-cyan-500/30 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
          opacity: isInside.current ? 1 : 0,
          scale: 1, 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.2 }} 
      >
        <div className="w-0.5 h-0.5 bg-cyan-500/50 rounded-full" />
      </motion.div>
    </>
  );
};
