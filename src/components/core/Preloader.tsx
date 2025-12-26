import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const totalDuration = 2200;
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setLoading(false);
        if (onLoadingComplete) onLoadingComplete();
      }, 800);
    }, totalDuration);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!loading) return null;

  return (
    <div className={`loader-container ${isFadingOut ? 'fade-out' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;800&display=swap');
        .loader-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #050505; display: flex; justify-content: center; align-items: center; z-index: 9999; font-family: 'Montserrat', sans-serif; overflow: hidden; transition: opacity 0.8s ease-in-out; }
        .loader-container.fade-out { opacity: 0; pointer-events: none; }
        .aurora-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; animation: floatAround 10s infinite ease-in-out alternate; z-index: 0; }
        .blob-1 { top: 20%; left: 20%; width: 400px; height: 400px; background: #00C2FF; }
        .blob-2 { bottom: 20%; right: 20%; width: 500px; height: 500px; background: #004488; animation-delay: -5s; }
        .particle { position: absolute; width: 2px; height: 2px; background: rgba(255, 255, 255, 0.4); border-radius: 50%; animation: driftUp linear infinite; }
        .p1 { left: 10%; top: 100%; animation-duration: 7s; } .p2 { left: 30%; top: 100%; animation-duration: 10s; animation-delay: 2s; }
        .visual-wrapper { position: relative; width: 450px; height: 450px; display: flex; align-items: center; justify-content: center; z-index: 5; }
        .trail-svg { position: absolute; width: 100%; height: 100%; overflow: visible; }
        .liquid-path { fill: none; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 600; stroke-dashoffset: 600; filter: drop-shadow(0 0 10px rgba(0, 194, 255, 0.5)); }
        .path-blue { stroke: url(#gradBlue); animation: drawLiquid 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .path-white { stroke: url(#gradWhite); animation: drawLiquid 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .text-content { z-index: 10; text-align: center; position: absolute; animation: floatText 4s ease-in-out infinite; }
        .title-ava { font-size: 6rem; font-weight: 800; background: linear-gradient(180deg, #FFFFFF 10%, #B0E0FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: driftReveal 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) 1.2s forwards; opacity: 0; }
        .subtitle-algoverse { font-size: 0.85rem; color: #00C2FF; letter-spacing: 4px; text-transform: uppercase; animation: breatheSub 1.2s ease-out 1.5s forwards; opacity: 0; }
        @keyframes floatAround { 0% { transform: translate(0, 0); } 100% { transform: translate(40px, -40px); } }
        @keyframes driftUp { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 0.5; } 100% { transform: translateY(-100vh); opacity: 0; } }
        @keyframes drawLiquid { to { stroke-dashoffset: 0; } }
        @keyframes driftReveal { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes breatheSub { 0% { opacity: 0; } 100% { opacity: 1; letter-spacing: 10px; } }
        @keyframes floatText { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
      <div className="aurora-blob blob-1"></div>
      <div className="aurora-blob blob-2"></div>
      <div className="particle p1"></div><div className="particle p2"></div>
      <div className="visual-wrapper">
        <svg className="trail-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00C2FF" stopOpacity="0.1" /><stop offset="100%" stopColor="#00C2FF" stopOpacity="1" /></linearGradient>
            <linearGradient id="gradWhite" x1="100%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" /></linearGradient>
          </defs>
          <path className="liquid-path path-blue" d="M 100 10 C 100 10, 180 50, 150 100 C 130 130, 100 100, 100 100" />
          <path className="liquid-path path-white" d="M 100 190 C 100 190, 20 150, 50 100 C 70 70, 100 100, 100 100" />
        </svg>
        <div className="text-content">
          <h1 className="title-ava">AVA</h1>
          <h2 className="subtitle-algoverse">ALGOVERSE</h2>
        </div>
      </div>
    </div>
  );
};
