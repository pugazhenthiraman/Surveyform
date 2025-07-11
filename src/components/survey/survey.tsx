import React from 'react';
import { useSurvey } from '../../hook/useSurvey';
import { Section } from './Section';
import { sections } from '../../data/sections';
import bgImage from '../../assets/La-Samanna4.jpg';
import HorizontalStepper from './HorizontalStepper';
import ThankYou from './ThankYou';
import { Footer } from '../Footer';

export const Survey: React.FC = () => {
  const {
    currentSection,
    currentSectionIndex,
    sectionQuestions,
    goToSection,
  } = useSurvey();

  // Debug: Log current section index and total sections
  console.log('Survey debug:', { currentSectionIndex, totalSections: sections.length });

  // Determine completed sections (all questions answered)
  const completedSectionIds = [];
  for (let i = 0; i < currentSectionIndex; i++) {
    completedSectionIds.push(i + 1); // section id is 1-based
  }

  // Render Thank You message if all sections are completed
  const isSurveyFinished = currentSectionIndex >= sections.length;
  if (isSurveyFinished) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center items-center">
          <ThankYou />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div className="relative flex-grow flex flex-col items-center justify-center w-full min-h-0">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 select-none"
          style={{ backgroundImage: `url(${bgImage})`, filter: 'brightness(0.7)' }}
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center mt-12 mb-12 w-full">
          {/* Only render HorizontalStepper if not finished and currentSection exists */}
          {currentSection && (
            <>
              <HorizontalStepper
                sections={sections}
                currentSectionId={currentSection.id}
                completedSectionIds={completedSectionIds}
                onSectionClick={goToSection}
              />
              <div className="w-full flex flex-col items-center justify-center">
                <Section
                  section={currentSection}
                  questions={sectionQuestions}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Survey;