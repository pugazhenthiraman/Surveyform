import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // between 0 and 1
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden shadow-inner">
    <motion.div
      className="h-4 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-md"
      style={{ width: `${progress * 100}%` }}
      initial={{ width: 0 }}
      animate={{ width: `${progress * 100}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </div>
);