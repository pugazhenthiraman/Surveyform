// src/components/Header.tsx
import React from 'react';

export const Header: React.FC = () => (
  <header className="w-full py-4 flex items-center justify-center px-12 shadow-lg backdrop-blur-md border-b border-white/40" style={{ minHeight: '80px', background: '#e10293' }}>
    <div className="relative flex items-center justify-center w-full">
    
      
      {/* Image-in-text layer */}
      <h1
        className="relative text-3xl md:text-7xl font-extrabold uppercase tracking-wide text-center text-white whitespace-nowrap"
        style={{ zIndex: 1, fontFamily: "'Playfair Display', serif", textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
      >
        ST. MAARTEN
      </h1>
    </div>
  </header>
);
