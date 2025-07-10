import React, { createContext, useState, ReactNode } from 'react';
import type { Question } from '../data/questions';
import { questions } from '../data/questions';

interface SurveyContextType {
  current: Question;
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
  answers: Record<number, string>;
  setAnswer: (id: number, val: string) => void;
}

// Disable fast-refresh rule since this file exports both context and provider
/* eslint-disable react-refresh/only-export-components */
export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

interface SurveyProviderProps {
  children: ReactNode;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const next = () => setIndex(i => Math.min(i + 1, questions.length - 1));
  const prev = () => setIndex(i => Math.max(i - 1, 0));
  const setAnswer = (id: number, val: string) =>
    setAnswers(a => ({ ...a, [id]: val }));

  return (
    <SurveyContext.Provider
      value={{
        current: questions[index],
        index,
        total: questions.length,
        next,
        prev,
        answers,
        setAnswer,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};