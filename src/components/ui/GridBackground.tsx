import React from 'react';

export const GridBackground = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
    <div className="absolute left-1/4 top-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-soft will-change-transform" />
    <div className="absolute right-1/4 bottom-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen animate-float will-change-transform" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
  </div>
));
