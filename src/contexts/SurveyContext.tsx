import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Question } from '../data/questions';
import { questions as section1Questions } from '../data/questions';
import { section2Questions } from '../data/section2';
import { section3Questions } from '../data/section3';
import { sections } from '../data/sections';
import type { SectionMeta } from '../data/sections';

interface SurveyContextType {
  currentSection: SectionMeta;
  currentSectionIndex: number;
  currentQuestion: Question;
  currentQuestionIndex: number;
  sectionQuestions: Question[];
  answers: Record<string, any>;
  setAnswer: (id: string, val: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  nextSection: () => void;
  prevSection: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  isLastSection: boolean;
  isFirstSection: boolean;
  goToSection: (sectionIdx: number) => void;
}

// Disable fast-refresh rule since this file exports both context and provider
/* eslint-disable react-refresh/only-export-components */
export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

interface SurveyProviderProps {
  children: ReactNode;
}

const sectionQuestionsMap: Record<number, Question[]> = {
  1: section1Questions,
  2: section2Questions,
  3: section3Questions,
};

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentSection = sections[currentSectionIndex];
  const sectionQuestions = sectionQuestionsMap[currentSection.id];
  const currentQuestion = sectionQuestions[currentQuestionIndex];

  const setAnswer = (id: string, val: any) => setAnswers(a => ({ ...a, [id]: val }));

  const nextQuestion = () => {
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(i => i + 1);
      setCurrentQuestionIndex(0);
    }
  };
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(i => i - 1);
      const prevSectionQuestions = sectionQuestionsMap[sections[currentSectionIndex - 1].id];
      setCurrentQuestionIndex(prevSectionQuestions.length - 1);
    }
  };
  const nextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(i => i + 1);
      setCurrentQuestionIndex(0);
    }
  };
  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(i => i - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goToSection = (sectionIdx: number) => {
    setCurrentSectionIndex(sectionIdx);
    setCurrentQuestionIndex(0);
  };

  const isLastQuestion = currentQuestionIndex === sectionQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  return (
    <SurveyContext.Provider
      value={{
        currentSection,
        currentSectionIndex,
        currentQuestion,
        currentQuestionIndex,
        sectionQuestions,
        answers,
        setAnswer,
        nextQuestion,
        prevQuestion,
        nextSection,
        prevSection,
        isLastQuestion,
        isFirstQuestion,
        isLastSection,
        isFirstSection,
        goToSection,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};