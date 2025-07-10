import React from 'react';
import type { SectionMeta } from '../../data/sections';

const sectionIcons = [
  // Use emoji for now; swap for Heroicons or FontAwesome if available
  '✈️', // Travel Activities
  '💰', // Expenditure Information
  '📝', // General Information
];

interface VerticalSectionTrackerProps {
  sections: SectionMeta[];
  currentSectionId: number;
  completedSectionIds: number[];
  onSectionClick?: (sectionIdx: number) => void;
}

export const VerticalSectionTracker: React.FC<VerticalSectionTrackerProps> = ({
  sections,
  currentSectionId,
  completedSectionIds,
  onSectionClick,
}) => {
  return (
    <nav className="flex flex-col items-center sm:items-start gap-4 py-6 w-20 sm:w-28">
      {sections.map((section, idx) => {
        const isCurrent = section.id === currentSectionId;
        const isCompleted = completedSectionIds.includes(section.id);
        // Colors and styles
        let bgColor = 'bg-white';
        let borderColor = 'border-gray-300';
        let iconColor = 'text-gray-400';
        if (isCompleted) {
          bgColor = 'bg-green-500';
          borderColor = 'border-green-500';
          iconColor = 'text-white';
        } else if (isCurrent) {
          bgColor = 'bg-blue-600';
          borderColor = 'border-blue-600';
          iconColor = 'text-white';
        }
        return (
          <React.Fragment key={section.id}>
            <button
              className={`w-12 h-12 flex items-center justify-center rounded-full border-4 ${bgColor} ${borderColor} ${iconColor} text-2xl font-bold shadow transition-colors duration-200 focus:outline-none`}
              style={{ cursor: onSectionClick ? 'pointer' : 'default' }}
              onClick={() => onSectionClick && onSectionClick(idx)}
              aria-current={isCurrent ? 'page' : undefined}
              title={section.name}
            >
              <span>{sectionIcons[idx]}</span>
            </button>
            {idx < sections.length - 1 && (
              <span className="w-1 h-8 bg-gray-300 mx-auto block" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}; 