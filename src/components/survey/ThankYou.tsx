import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Confetti from 'react-confetti';
import bgImage from '../../assets/La-Samanna4.jpg';

const confettiColors = [
  '#ff595e', // red
  '#ffca3a', // yellow
  '#8ac926', // green
  '#1982c4', // blue
  '#6a4c93', // purple
  '#fff',    // white
  '#f72585', // pink
  '#b5179e', // magenta
  '#f9c74f', // gold
  '#43aa8b', // teal
];

const ThankYou: React.FC = () => {
  const [confettiKey, setConfettiKey] = useState(0);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When confetti completes, immediately trigger another blast
  const handleConfettiComplete = () => {
    setTimeout(() => setConfettiKey(k => k + 1), 0);
  };

  // Confetti rendered in a portal at the top of the DOM
  const confetti = (
    <Confetti
      key={confettiKey}
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={600}
      recycle={false}
      gravity={0.5}
      initialVelocityY={20}
      colors={confettiColors}
      onConfettiComplete={handleConfettiComplete}
      confettiSource={{ x: 0, y: 0, w: dimensions.width, h: 0 }}
    />
  );

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center">
      {/* Background image layer */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 select-none"
        style={{ backgroundImage: `url(${bgImage})`, filter: 'brightness(0.7)' }}
      />
      {/* Confetti celebration, fixed to viewport, always at the top via portal */}
      {typeof window !== 'undefined' && ReactDOM.createPortal(confetti, document.body)}
      {/* Thank you message, centered */}
      <div className="relative z-30 text-center mt-8 md:mt-12 w-full max-w-xl mx-auto">
        <h2 className="text-xl md:text-3xl font-bold mb-2 text-white break-words">Thank you for participating!</h2>
        <p className="italic text-white text-sm md:text-base">Tot Ziens, Au revoir, Bye</p>
      </div>
    </div>
  );
};

export default ThankYou; 