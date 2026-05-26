import React from 'react';

export const GridBackground: React.FC = () => (
  <div
    className="absolute inset-0 pointer-events-none select-none"
    aria-hidden
  >
    {/* Primary grid — fine 48px cells */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
    {/* Accent grid — larger 192px cells for depth */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--border-active) 1px, transparent 1px), linear-gradient(to bottom, var(--border-active) 1px, transparent 1px)',
        backgroundSize: '192px 192px',
      }}
    />
  </div>
);
