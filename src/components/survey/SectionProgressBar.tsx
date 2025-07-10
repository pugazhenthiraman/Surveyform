import React from 'react';

interface SectionProgressBarProps {
  current: number;
  total: number;
  sectionName?: string;
}

export const SectionProgressBar: React.FC<SectionProgressBarProps> = ({ current, total, sectionName }) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {sectionName && (
        <div className="mb-2 text-center text-lg font-semibold text-blue-700">{sectionName} Progress</div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
        <div
          className="bg-blue-600 h-5 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
          style={{ width: `${percent}%` }}
        >
          <span className="text-white text-sm font-bold">{percent}%</span>
        </div>
      </div>
      <div className="text-center text-sm text-gray-600 mt-1">
        {current} of {total} questions answered
      </div>
    </div>
  );
}; 