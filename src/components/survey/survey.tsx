import React from 'react';
import { useSurvey } from '../../hook/useSurvey';
import { VerticalSectionTracker } from './VerticalSectionTracker';
import { Section } from './Section';
import { sections } from '../../data/sections';
import bgImage from '../../assets/La-Samanna4.jpg';

export const Survey: React.FC = () => {
  const {
    currentSection,
    currentSectionIndex,
    sectionQuestions,
    goToSection,
  } = useSurvey();

  // Determine completed sections (all questions answered)
  const completedSectionIds = [];
  for (let i = 0; i < currentSectionIndex; i++) {
    completedSectionIds.push(i + 1); // section id is 1-based
  }

  return (
    <div className="relative flex-grow flex flex-col items-center justify-center w-full min-h-0">
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 select-none"
        style={{ backgroundImage: `url(${bgImage})`, filter: 'brightness(0.7)' }}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center mt-12 mb-12 w-full">
        <div className="flex flex-row items-center justify-center">
          <div className="mr-6 flex-shrink-0">
            <VerticalSectionTracker
              sections={sections}
              currentSectionId={currentSection.id}
              completedSectionIds={completedSectionIds}
              onSectionClick={goToSection}
            />
          </div>
          <div>
            <Section
              section={currentSection}
              questions={sectionQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;