import React from 'react';
import { Header } from './components/Header';
import { Survey } from './components/survey/survey';
// import { Footer } from '../src/components/Footer'; // Remove this import
import { SurveyProvider } from './contexts/SurveyContext';

export const App: React.FC = () => (
  <SurveyProvider>
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex-grow flex flex-col">
        <Survey />
      </div>
      {/* <Footer /> Removed to prevent duplicate footers */}
    </div>
  </SurveyProvider>
);