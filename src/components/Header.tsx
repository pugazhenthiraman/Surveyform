// src/components/Header.tsx
import React from 'react';

export const Header: React.FC = () => (
  <header className="w-full py-4 flex items-center justify-center px-12 shadow-lg backdrop-blur-md border-b border-white/40" style={{ minHeight: '80px', background: 'rgba(249, 222, 179, 0.85)' }}>
    <div className="relative flex items-center justify-center w-full">
    
      
      {/* Image-in-text layer */}
      <h1
        className="relative text-5xl md:text-7xl font-extrabold uppercase tracking-wide text-center bg-[url('/src/assets/martin.jpg')] bg-cover bg-[50%_100%] bg-clip-text text-transparent"
        style={{ zIndex: 1 }}
      >
        ST. MAARTEN
      </h1>
    </div>
  </header>
);
