import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1.5s total active duration
    const totalDuration = 1500;
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Allow time for the sophisticated blur/scale exit animation
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 700); 
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`preloader-root ${isExiting ? 'exit-active' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500;800&display=swap');

        .preloader-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: all 0.8s cubic-bezier(0.6, -0.05, 0.01, 0.99);
          overflow: hidden;
        }

        /* Sophisticated Apple Exit: Scale + Blur + Fade */
        .preloader-root.exit-active {
          opacity: 0;
          transform: scale(1.2);
          filter: blur(15px) brightness(1.2);
          pointer-events: none;
        }

        .core-glow {
          position: absolute;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle at center, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
          filter: blur(60px);
          animation: pulse 3s infinite ease-in-out;
        }

        .logo-container {
          position: relative;
          z-index: 10;
          text-align: center;
        }

        .logo-text {
          font-size: clamp(3rem, 8vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          margin: 0;
          color: rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            to right, 
            rgba(255,255,255,0.1) 0%, 
            rgba(255,255,255,0.1) 40%, 
            rgba(255,255,255,1) 50%, 
            rgba(255,255,255,0.1) 60%, 
            rgba(255,255,255,0.1) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 1.8s ease-out forwards, tracking 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards;
        }

        .tagline {
          margin-top: 0.75rem;
          font-size: clamp(0.65rem, 1.5vw, 0.8rem);
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 300;
          opacity: 0;
          transform: translateY(10px);
          animation: slideUp 0.8s 0.4s ease-out forwards;
        }

        .progress-track {
          margin-top: 3rem;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          opacity: 0;
          animation: fadeIn 0.5s 0.2s forwards;
        }

        .progress-bar {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
          transform: translateX(-100%);
          animation: progressMove 1.5s ease-in-out forwards;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
        }

        @keyframes shine {
          to { 
            background-position: 200% center; 
            color: rgba(255, 255, 255, 0.95);
            text-shadow: 0 0 20px rgba(255,255,255,0.2);
          }
        }

        @keyframes tracking {
           0% { letter-spacing: -0.1em; opacity: 0; transform: translateY(10px); }
           40% { opacity: 0.6; }
           100% { letter-spacing: -0.04em; opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes progressMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        .particle {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          opacity: 0;
          animation: floatUp 1.5s infinite linear;
        }

        @keyframes floatUp {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-60px) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Ambient background elements */}
      <div className="core-glow" />
      
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            left: `${40 + Math.random() * 20}%`,
            top: `${50 + Math.random() * 10}%`,
            animationDelay: `${Math.random() * 1.5}s`,
          }}
        />
      ))}

      <div className="logo-container">
        <h1 className="logo-text">ALGOVERSE</h1>
        <p className="tagline">Where Algorithms Come Alive.</p>
        
        <div className="progress-track">
          <div className="progress-bar" />
        </div>
      </div>
    </div>
  );
};
