import React from 'react';
import type { SectionMeta } from '../../data/sections';

interface HorizontalStepperProps {
  sections: SectionMeta[];
  currentSectionId: number;
  completedSectionIds: number[];
  onSectionClick?: (sectionIdx: number) => void;
}

const stepColors = {
  completed: 'bg-[#f09307] text-white border-[#f09307]',
  current: 'bg-white text-[#f09307] border-[#f09307] shadow-lg',
  upcoming: 'bg-gray-200 text-gray-400 border-gray-300',
};

const HorizontalStepper: React.FC<HorizontalStepperProps> = ({
  sections,
  currentSectionId,
  completedSectionIds,
  onSectionClick,
}) => {
  return (
    <nav className="w-[75%] mx-auto flex items-center justify-center gap-0 md:gap-2 py-6">
      {sections.map((section, idx) => {
        const isCurrent = section.id === currentSectionId;
        const isCompleted = completedSectionIds.includes(section.id);
        let stepClass = stepColors.upcoming;
        if (isCompleted) stepClass = stepColors.completed;
        if (isCurrent) stepClass = stepColors.current;
        return (
          <React.Fragment key={section.id}>
            <button
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-4 font-bold text-lg md:text-2xl transition-colors duration-200 focus:outline-none ${stepClass}`}
              style={{ cursor: onSectionClick ? 'pointer' : 'default' }}
              onClick={() => onSectionClick && onSectionClick(idx)}
              aria-current={isCurrent ? 'page' : undefined}
              title={section.name}
            >
              {idx + 1}
            </button>
            {idx < sections.length - 1 && (
              <div className="flex-1 h-1 bg-gray-300 mx-1 md:mx-2" style={{ minWidth: 16 }} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default HorizontalStepper; 