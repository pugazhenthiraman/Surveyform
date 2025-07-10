import { useContext } from 'react';
import { SurveyContext } from '../contexts/SurveyContext';

export const useSurvey = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error('useSurvey must be inside SurveyProvider');
  return ctx;
};