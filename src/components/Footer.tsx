// src/components/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => (
  <footer className="w-full py-5 flex flex-col items-center space-y-2 shadow-lg backdrop-blur-md border-t border-white/40" style={{ minHeight: '60px', background: 'rgba(245, 222, 179, 0.85)' }}>
    <div className="text-base text-gray-700 font-semibold">Powered by:</div>
    <div className="flex flex-row items-center space-x-12">
      <div className="flex flex-col items-center">
        <img src="/assets/Official_STAT_logo.svg" alt="Department of Statistics" className="h-10 mb-1" />
        <span className="text-sm text-gray-700">The Department of Statistics</span>
      </div>
      <div className="flex flex-col items-center">
        <img src="/assets/St. Maarten Logo.jpg" alt="St. Maarten Tourism Bureau" className="h-10 mb-1 rounded" />
        <span className="text-sm text-gray-700">St. Maarten Tourism Bureau</span>
      </div>
    </div>
  </footer>
);
