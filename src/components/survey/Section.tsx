import React, { useState } from 'react';
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
        stroke="#2563eb"
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
  const { currentQuestionIndex, nextQuestion, prevQuestion, isFirstQuestion, isLastQuestion, answers, nextSection } = useSurvey();

  // Debug: log answers to check what is being stored
  console.log('Survey answers:', answers);

  const [error, setError] = useState<string | null>(null);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  // Helper to show toaster
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000)
  }

  // Helper to check if a question is answered
  function isAnswered(q: QType): boolean {
    const val = answers[String(q.id)];
    // Q10: matrix/grid, require at least one cell to be filled with a non-zero value
    if (q.id === 10 && q.matrix) {
      const ageCategories = q.matrix.rows;
      const genders = q.matrix.columns;
      return ageCategories.some(age =>
        genders.some(gender => {
          const key = `${q.id}_${gender.toLowerCase()}_${age.replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase()}`;
          const v = answers[key];
          return v && !isNaN(Number(v)) && Number(v) > 0;
        })
      );
    }
    // Q9: accommodation logic (require name)
    if (q.id === 9) {
      return (
        !!answers['9_selected'] &&
        (answers['9_dutch'] || answers['9_french']) &&
        !!answers['9j'] && answers['9j'].trim() !== '' &&
        // If 'Other' is selected, require the input
        (answers['9_selected'] !== '9i' || (answers['9i_other'] && answers['9i_other'].trim() !== ''))
      );
    }
    // Q2, Q7, Q8: answered if group value is set
    if ((q.id === 2 || q.id === 7 || q.id === 8) && q.type === 'group') {
      // If a selected option requires an input, require it to be filled
      const selected = answers[q.id];
      if (selected && typeof selected === 'string') {
        // Check for any subQuestion with a placeholder or extra (e.g., please specify)
        const sub = q.subQuestions?.find(sq => sq.id === selected);
        if (sub && (sub.placeholder || sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
          const otherKey = `${q.id}_${selected}_text`;
          return !!answers[q.id] && answers[q.id] !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
        }
      }
      return !!answers[q.id] && answers[q.id] !== '';
    }
    // Q1: all sub-questions answered
    if (q.id === 1 && q.type === 'group' && q.subQuestions) {
      return q.subQuestions.every(sub => {
        const subVal = answers[String(sub.id)];
        if ((sub.type === 'radio' || sub.type === 'text')) {
          // If sub-question requires input, require it to be filled
          if (subVal && typeof subVal === 'string' && (sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
            const otherKey = `${sub.id}_other`;
            return !!subVal && subVal !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
          }
          return !!subVal && subVal !== '';
        }
        if (sub.type === 'checkbox') {
          return Array.isArray(subVal) && subVal.length > 0;
        }
        return false;
      });
    }
    // Standard radio/text with input-revealing option
    if ((q.type === 'radio' || q.type === 'text') && val && typeof val === 'string') {
      // Find the selected option's extra/placeholder
      const opt = q.options?.find(o => o.startsWith(val));
      if (opt && opt.includes('|')) {
        const otherKey = `${q.id}_other`;
        return !!val && val !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
      }
      if (val.toLowerCase().includes('other')) {
        const otherKey = `${q.id}_other`;
        return !!val && val !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
      }
      return !!val && val !== '';
    }
    // Checkbox with input-revealing option
    if (q.type === 'checkbox' && Array.isArray(val)) {
      // If any checked option requires input, require it to be filled
      const needsInput = val.some(v => {
        const opt = q.options?.find(o => o.startsWith(v));
        return (opt && opt.includes('|')) || v.toLowerCase().includes('other');
      });
      if (needsInput) {
        const otherKey = `${q.id}_other`;
        return val.length > 0 && !!answers[otherKey] && answers[otherKey].trim() !== '';
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
            return !!subVal && subVal !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
          }
          return !!subVal && subVal !== '';
        }
        if (sub.type === 'checkbox') {
          return Array.isArray(subVal) && subVal.length > 0;
        }
        return false;
      });
    }
    return false;
  }

  const answeredCount = questions.filter(isAnswered).length;
  const percent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const currentQuestion = questions[currentQuestionIndex];
  const canProceed = isAnswered(currentQuestion);

  // Handler for Next button with conditional skip for Q11
  function handleNext() {
    if (!canProceed) {
      let errorMsg = 'Please answer the question before proceeding.';
      const inputErrs: Record<string, string> = {};
      // Q10: matrix/grid
      if (currentQuestion.id === 10 && currentQuestion.matrix) {
        errorMsg = 'Please enter at least one value in the table.';
      }
      // Q11: require provider name if Yes
      if (currentQuestion.id === 11) {
        if (answers[11] === 'Yes' && (!answers['11_provider'] || answers['11_provider'].trim() === '')) {
          errorMsg = 'Please enter the name of the package provider.';
          inputErrs['11_provider'] = errorMsg;
        }
      }
      // Q2, Q7, Q8: answered if group value is set
      if ((currentQuestion.id === 2 || currentQuestion.id === 7 || currentQuestion.id === 8) && currentQuestion.type === 'group') {
        // If a selected option requires an input, require it to be filled
        const selected = answers[currentQuestion.id];
        if (selected && typeof selected === 'string') {
          // Check for any subQuestion with a placeholder or extra (e.g., please specify)
          const sub = currentQuestion.subQuestions?.find(sq => sq.id === selected);
          if (sub && (sub.placeholder || sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
            const otherKey = `${currentQuestion.id}_${selected}_text`;
            if (!answers[otherKey] || answers[otherKey].trim() === '') {
              errorMsg = 'Please specify your answer.';
              inputErrs[otherKey] = errorMsg;
            }
          }
        }
      }
      // Q1: all sub-questions answered
      if (currentQuestion.id === 1 && currentQuestion.type === 'group' && currentQuestion.subQuestions) {
        return currentQuestion.subQuestions.every(sub => {
          const subVal = answers[String(sub.id)];
          if ((sub.type === 'radio' || sub.type === 'text')) {
            // If sub-question requires input, require it to be filled
            if (subVal && typeof subVal === 'string' && (sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
              const otherKey = `${sub.id}_other`;
              return !!subVal && subVal !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
            }
            return !!subVal && subVal !== '';
          }
          if (sub.type === 'checkbox') {
            return Array.isArray(subVal) && subVal.length > 0;
          }
          return false;
        });
      }
      // Standard radio/text with input-revealing option
      if ((currentQuestion.type === 'radio' || currentQuestion.type === 'text')) {
        const val = answers[String(currentQuestion.id)];
        // Find the selected option's extra/placeholder
        const opt = currentQuestion.options?.find(o => o.startsWith(val));
        if (opt && opt.includes('|')) {
          const otherKey = `${currentQuestion.id}_other`;
          if (!answers[otherKey] || answers[otherKey].trim() === '') {
            errorMsg = 'Please specify your answer.';
            inputErrs[otherKey] = errorMsg;
          }
        }
        if (val && typeof val === 'string' && val.toLowerCase().includes('other')) {
          const otherKey = `${currentQuestion.id}_other`;
          if (!answers[otherKey] || answers[otherKey].trim() === '') {
            errorMsg = 'Please specify your answer for "Other".';
            inputErrs[otherKey] = errorMsg;
          }
        }
      }
      // Checkbox with input-revealing option
      if (currentQuestion.type === 'checkbox') {
        const val = answers[String(currentQuestion.id)];
        if (Array.isArray(val)) {
          const needsInput = val.some(v => {
            const opt = currentQuestion.options?.find(o => o.startsWith(v));
            return (opt && opt.includes('|')) || v.toLowerCase().includes('other');
          });
          if (needsInput) {
            const otherKey = `${currentQuestion.id}_other`;
            if (!answers[otherKey] || answers[otherKey].trim() === '') {
              errorMsg = 'Please specify your answer.';
              inputErrs[otherKey] = errorMsg;
            }
          }
        }
      }
      // Fallback for other groups
      if (currentQuestion.type === 'group' && currentQuestion.subQuestions) {
        return currentQuestion.subQuestions.every(sub => {
          const subVal = answers[String(sub.id)];
          if ((sub.type === 'radio' || sub.type === 'text')) {
            if (subVal && typeof subVal === 'string' && (sub.text.toLowerCase().includes('specify') || sub.text.toLowerCase().includes('other'))) {
              const otherKey = `${sub.id}_other`;
              return !!subVal && subVal !== '' && !!answers[otherKey] && answers[otherKey].trim() !== '';
            }
            return !!subVal && subVal !== '';
          }
          if (sub.type === 'checkbox') {
            return Array.isArray(subVal) && subVal.length > 0;
          }
          return false;
        });
      }
      setError(errorMsg);
      setInputErrors(inputErrs);
      showToast(errorMsg);
      return;
    }
    setError(null);
    setInputErrors({});
    // Q11: skip to Q13 if No
    if (currentQuestion.id === 11 && answers[11] === 'No, skip to question 3') {
      // Find index of Q13
      const q13Idx = questions.findIndex(q => q.id === 13);
      if (q13Idx !== -1) {
        // Move to Q13
        // setCurrentQuestionIndex(q13Idx); // Not available, so use nextQuestion multiple times
        // Instead, use a workaround: call nextQuestion until at Q13
        let idx = currentQuestionIndex;
        while (idx < questions.length - 1 && questions[idx + 1].id !== 13) {
          idx++;
        }
        if (questions[idx + 1] && questions[idx + 1].id === 13) {
          // setCurrentQuestionIndex(idx + 1); // Not available, so call nextQuestion
          nextQuestion(); // Will move to idx+1 (Q13)
          return;
        }
      }
    }
    if (isLastQuestion) {
      nextSection();
    } else {
      nextQuestion();
    }
  }

  // Handler for Previous button with conditional skip back from Q13 to Q11
  function handlePrev() {
    // If on Q13 and previous is clicked, go back to Q11
    if (currentQuestion.id === 13) {
      const q11Idx = questions.findIndex(q => q.id === 11);
      if (q11Idx !== -1) {
        // setCurrentQuestionIndex(q11Idx); // Not available, so call prevQuestion until at Q11
        let idx = currentQuestionIndex;
        while (idx > 0 && questions[idx - 1].id !== 11) {
          idx--;
        }
        if (questions[idx - 1] && questions[idx - 1].id === 11) {
          prevQuestion(); // Will move to idx-1 (Q11)
          return;
        }
      }
    }
    prevQuestion();
  }

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-lg shadow-lg flex flex-col items-center">
      {/* Toaster notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-[9999] border-4 border-yellow-400" style={{zIndex: 9999}}>
          {toast}
        </div>
      )}
      {/* Pencil-style progress border */}
      <ProgressRingBorder percent={percent} />
      <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">{section.name}</h2>
      <div className="flex-1 flex flex-col justify-center items-center mt-6 mb-6 w-full">
        <Question question={currentQuestion} number={currentQuestionIndex + 1} inputErrors={inputErrors} />
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      </div>
      <div className="flex justify-between w-full mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          onClick={handlePrev}
          disabled={isFirstQuestion}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next
        </button>
      </div>
    </div>
  );
}; 