import React from 'react';
import type { SectionMeta } from '../../data/sections';

interface SectionTrackerProps {
  sections: SectionMeta[];
  currentSectionId: number;
  completedSectionIds: number[];
  onSectionClick?: (sectionIdx: number) => void;
}

export const SectionTracker: React.FC<SectionTrackerProps> = ({
  sections,
  currentSectionId,
  completedSectionIds,
  onSectionClick,
}) => {
  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2 my-4 w-full">
      {sections.map((section, idx) => {
        const isCurrent = section.id === currentSectionId;
        const isCompleted = completedSectionIds.includes(section.id);
        // Colors and styles
        let borderColor = 'border-gray-400';
        let textColor = 'text-gray-500';
        let bgColor = 'bg-white';
        if (isCompleted) {
          borderColor = 'border-blue-500';
          textColor = 'text-white';
          bgColor = 'bg-blue-500';
        } else if (isCurrent) {
          borderColor = 'border-blue-500';
          textColor = 'text-blue-600';
          bgColor = 'bg-white';
        }
        return (
          <React.Fragment key={section.id}>
            <button
              className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 ${borderColor} ${bgColor} ${textColor} font-bold text-base sm:text-lg shadow transition-colors duration-200 focus:outline-none`}
              style={{ cursor: onSectionClick ? 'pointer' : 'default' }}
              onClick={() => onSectionClick && onSectionClick(idx)}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {idx + 1}
            </button>
            {idx < sections.length - 1 && (
              <span className="w-4 sm:w-8 h-0.5 bg-gray-300 rounded-full mx-0.5 sm:mx-1" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}; 