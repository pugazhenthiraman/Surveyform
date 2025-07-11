import React from 'react';
import type { SectionMeta } from '../../data/sections';
import type { Question as QType } from '../../data/questions';
import { useSurvey } from '../../hook/useSurvey';
import { Question } from './Question';

interface SectionProps {
  section: SectionMeta;
  questions: QType[];
}

// Pencil-style ProgressRingBorder (rectangle, no radius, thin line)
const ProgressRingBorder: React.FC<{ percent: number }> = ({ percent }) => {
  const stroke = 1; // very thin line
  const radius = 0; // no rounded corners
  return (
    <svg
      className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <rect
        x={stroke / 2}
        y={stroke / 2}
        width={100 - stroke}
        height={100 - stroke}
        rx={radius}
        ry={radius}
        fill="none"
        stroke="#f09307"
        strokeWidth={stroke}
        strokeDasharray={2 * (100 - stroke) + 2 * (100 - stroke)}
        strokeDashoffset={(2 * (100 - stroke) + 2 * (100 - stroke)) * (1 - percent / 100)}
        strokeLinecap="square"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
    </svg>
  );
};

export const Section: React.FC<SectionProps> = ({ section, questions }) => {
  const { currentQuestionIndex, nextQuestion, prevQuestion, isFirstQuestion, isLastQuestion, answers, nextSection, isLastSection, setCurrentQuestionIndex, finishSurvey } = useSurvey();

  // Ensure booleans
  const firstQuestion = Boolean(isFirstQuestion);
  const lastQuestion = Boolean(isLastQuestion);
  const lastSection = Boolean(isLastSection);

  // Debug: log answers to check what is being stored
  console.log('Survey answers:', answers);

  const currentQuestion = questions[currentQuestionIndex];

  // Helper to check if a question is answered
  function isAnswered(q: QType): boolean {
    const val = answers[String(q.id)];
    // Q12: always allow advancing
    if (q.id === 12) {
      return true;
    }
    // Q13: always allow advancing
    if (q.id === 13) {
      return true;
    }
    // Q10: matrix/grid, require at least one cell to be filled with a non-zero value
    if (q.id === 10 && q.matrix) {
      const ageCategories = q.matrix.rows;
      const genders = q.matrix.columns;
      return ageCategories.some(age =>
        genders.some(gender => {
          const key = `${q.id}_${gender.toLowerCase()}_${age.replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase()}`;
          const v = answers[key];
          return typeof v === 'string' && v !== '' && !isNaN(Number(v)) && Number(v) > 0;
        })
      );
    }
    // Q9: accommodation logic (require name)
    if (q.id === 9) {
      return (
        Boolean(answers['9_selected']) &&
        (answers['9_dutch'] || answers['9_french']) &&
        typeof answers['9j'] === 'string' && answers['9j'].trim() !== '' &&
        // If 'Other' is selected, require the input
        (answers['9_selected'] !== '9i' || (typeof answers['9i_other'] === 'string' && answers['9i_other'].trim() !== ''))
      );
    }
    // Q2, Q7, Q8: answered if group value is set
    if ((q.id === 2 || q.id === 7 || q.id === 8) && q.type === 'group') {
      // If a selected option requires an input, require it to be filled
      const selected = answers[q.id];
      if (selected && typeof selected === 'string') {
        // Check for any subQuestion with a placeholder or extra (e.g., Please Specify)
        const sub = q.subQuestions?.find(sq => sq.id === selected);
        if (sub && (sub.placeholder || sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
          const otherKey = `${q.id}_${selected}_text`;
          return Boolean(answers[q.id]) && answers[q.id] !== '' && typeof answers[otherKey] === 'string' && answers[otherKey].trim() !== '';
        }
      }
      return Boolean(answers[q.id]) && answers[q.id] !== '';
    }
    // Q1: all sub-questions answered
    if (q.id === 1 && q.type === 'group' && q.subQuestions) {
      return q.subQuestions.every(sub => {
        const subVal = answers[String(sub.id)];
        if ((sub.type === 'radio' || sub.type === 'text')) {
          // If sub-question requires input, require it to be filled
          if (subVal && typeof subVal === 'string' && (sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
            const otherKey = `${sub.id}_other`;
            return Boolean(subVal) && subVal !== '' && typeof answers[otherKey] === 'string' && answers[otherKey].trim() !== '';
          }
          return Boolean(subVal) && subVal !== '';
        }
        if (sub.type === 'checkbox') {
          return Array.isArray(subVal) && subVal.length > 0;
        }
        return false;
      });
    }
    // Standard radio/text with input-revealing option
    if ((q.type === 'radio' || q.type === 'text') && typeof val === 'string') {
      // Find the selected option's extra/placeholder
      const opt = q.options?.find(o => o.startsWith(val));
      if (opt && opt.includes('|')) {
        const otherKey = `${q.id}_other`;
        return val !== '' && typeof answers[otherKey] === 'string' && answers[otherKey].trim() !== '';
      }
      if (val.toLowerCase().includes('other')) {
        const otherKey = `${q.id}_other`;
        return val !== '' && typeof answers[otherKey] === 'string' && answers[otherKey].trim() !== '';
      }
      return val !== '';
    }
    // Checkbox with input-revealing option
    if (q.type === 'checkbox' && Array.isArray(val)) {
      // If any checked option requires input, require it to be filled
      const needsInput = val.some(v => {
        const opt = q.options?.find(o => o.startsWith(v));
        return (opt && opt.includes('|')) || (typeof v === 'string' && v.toLowerCase().includes('other'));
      });
      if (needsInput) {
        const otherKey = `${q.id}_other`;
        return val.length > 0 && typeof answers[otherKey] === 'string' && answers[otherKey].trim() !== '';
      }
      return val.length > 0;
    }
    // Fallback for other groups
    if (q.type === 'group' && q.subQuestions) {
      return q.subQuestions.every(sub => {
        const subVal = answers[String(sub.id)];
        if ((sub.type === 'radio' || sub.type === 'text')) {
          if (subVal && typeof subVal === 'string' && (sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
            const otherKey = `${sub.id}_other`;
            return Boolean(subVal) && subVal !== '' && typeof answers[otherKey] === 'string' && answers[otherKey].trim() !== '';
          }
          return Boolean(subVal) && subVal !== '';
        }
        if (sub.type === 'checkbox') {
          return Array.isArray(subVal) && subVal.length > 0;
        }
        return false;
      });
    }
    // Special logic for Q15: only require selected radio and its inputs
    if (q.id === 15 && q.subQuestions) {
      const selected = answers['15_selected'];
      if (!selected) return false;
      const selectedSub = q.subQuestions.find(sub => sub.id === selected);
      if (!selectedSub) {
        return false;
      }
      if (!selectedSub.inputs) {
        return true;
      }
      let allFilled = true;
      selectedSub.inputs.forEach(input => {
        const val = answers[`15_${selectedSub.id}_${input.name}`];
        if (!(typeof val === 'string' && val.trim() !== '')) {
          allFilled = false;
        }
      });
      return allFilled;
    }
    return false;
  }

  const answeredCount = questions.filter(isAnswered).length;
  const percent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  // Handler for Previous button with conditional skip back from Q13 to Q11
  function handlePrev() {
    // Section 2 skip logic: If on Q13 and Q11 was answered 'No, skip to question 3', go back to Q11
    if (
      section.id === 2 &&
      currentQuestion.id === 13 &&
      answers['11'] === 'No, skip to question 3'
    ) {
      const q11Idx = questions.findIndex(q => q.id === 11);
      if (q11Idx !== -1) {
        setCurrentQuestionIndex(q11Idx);
        return;
      }
    }
    // If on Q13 and previous is clicked, go back to Q11 (default logic)
    if (currentQuestion.id === 13) {
      const q11Idx = questions.findIndex(q => q.id === 11);
      if (q11Idx !== -1) {
        let idx = currentQuestionIndex;
        while (idx > 0 && questions[idx - 1].id !== 11) {
          idx--;
        }
        if (questions[idx - 1] && questions[idx - 1].id === 11) {
          prevQuestion();
          return;
        }
      }
    }
    prevQuestion();
  }

  // Handler for Next button with conditional skip from Q11 to Q13
  function handleNext() {
    // Section 2 skip logic: If on Q11 and answer is 'No, skip to question 3', skip to Q13
    if (
      section.id === 2 &&
      currentQuestion.id === 11 &&
      answers['11'] === 'No, skip to question 3'
    ) {
      const q13Idx = questions.findIndex(q => q.id === 13);
      if (q13Idx !== -1) {
        setCurrentQuestionIndex(q13Idx);
        return;
      }
    }
    // Section 1 skip logic: If on Q2 and answer is subQuestion id '2a', skip to Q4
    if (
      section.id === 1 &&
      currentQuestion.id === 2 &&
      answers['2'] === '2a'
    ) {
      const q4Idx = questions.findIndex(q => q.id === 4);
      if (q4Idx !== -1) {
        setCurrentQuestionIndex(q4Idx);
        return;
      }
    }
    if (isLastQuestion) {
      nextSection();
    } else {
      nextQuestion();
    }
  }

  function handleFinish() {
    finishSurvey();
  }

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-lg shadow-lg flex flex-col items-center min-h-[60vh]">
      {/* Pencil-style progress border */}
      <ProgressRingBorder percent={percent} />
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center break-words" style={{ color: '#f09307' }}>{section.name}</h2>
      <div className="flex-1 flex flex-col justify-center items-center mt-4 mb-6 w-full">
        <Question question={currentQuestion} number={currentQuestionIndex + 1} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between w-full mt-4 gap-2">
        <button
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-full shadow font-semibold hover:bg-gray-300 transition text-base md:text-lg"
          onClick={handlePrev}
          disabled={firstQuestion}
        >
          Previous
        </button>
        {lastSection && lastQuestion ? (
          <button
            className="w-full sm:w-auto px-6 py-2 bg-[#e10293] text-white rounded-full shadow font-semibold hover:bg-pink-700 transition text-base md:text-lg"
            onClick={handleFinish}
          >
            Finish
          </button>
        ) : (
          <button
            className="w-full sm:w-auto px-6 py-2 bg-[#e10293] text-white rounded-full shadow font-semibold hover:bg-pink-700 transition text-base md:text-lg"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}; 