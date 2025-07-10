import React from 'react';
import { useSurvey } from '../../hook/useSurvey';
import { Question } from './Question';
import { ProgressBar } from './ProgressBar';
import bgImage from '../../assets/La-Samanna4.jpg';
import { AnimatePresence, motion } from 'framer-motion';

export const Survey: React.FC = () => {
  const { current, index, total, next, prev, answers } = useSurvey();

  // Count only answered questions
  const answeredCount = Object.keys(answers).length;
  const progress = total > 0 ? answeredCount / total : 0;

  return (
    <div className="relative flex-grow flex items-center justify-center w-full min-h-0">
      {/* Background image layer with moderate brightness, no blur or opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 select-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'brightness(0.7)'
        }}
      />
      {/* Dark overlay for background image */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      {/* Centered glassmorphic card with thicker, more visible white border */}
      <div className="relative z-10 w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border-2 border-white/80 bg-white/5 backdrop-blur-lg shadow-lg flex flex-col items-center">
        <div className="w-full flex flex-col">
          <ProgressBar progress={progress} />
          <div className="flex-1 flex flex-col justify-center items-center mt-6 mb-6 w-full">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Question question={current} number={index + 1} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick={prev}
              disabled={index === 0}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={next}
              disabled={index === total - 1}
            >
              {index === total - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;