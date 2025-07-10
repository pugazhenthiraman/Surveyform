import React from 'react';
import type { Question as QType } from '../../data/questions';
import { useSurvey } from '../../hook/useSurvey';

interface Props { question: QType; number: number; }

export const Question: React.FC<Props> = ({ question, number }) => {
  const { answers, setAnswer } = useSurvey();
  const value = answers[question.id] || '';

  if (question.type === 'radio') {
    const isScrollable = question.options && question.options.length > 6;
    return (
      <>
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
        <ul className={isScrollable ? "flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2 py-1" : "flex justify-center gap-8 text-white flex-wrap"} style={isScrollable ? { WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth', maxWidth: '100%' } : {}}>
          {question.options!.map(opt => (
            <li key={opt} className={isScrollable ? "min-w-max" : ""}>
              <label className="inline-flex items-center space-x-2 text-white">
                <input
                  type="radio"
                  name={`q${question.id}`}
                  checked={value === opt}
                  onChange={() => setAnswer(question.id, opt)}
                />
                <span className="text-white">{opt}</span>
              </label>
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (question.type === 'group' && question.subQuestions) {
    return (
      <>
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
        <div className="space-y-4">
          {question.subQuestions.map((sub, idx) => {
            const subValue = answers[sub.id] || '';
            return (
              <div key={sub.id} className="flex items-center justify-between bg-white/10 rounded p-3">
                <span className={sub.highlight ? 'font-bold text-orange-400' : 'font-medium text-white'}>{sub.text}</span>
                <div className="flex gap-4">
                  {sub.options?.map(opt => (
                    <label key={opt} className="inline-flex items-center space-x-2 text-white">
                      <input
                        type={sub.type}
                        name={`q${sub.id}`}
                        checked={subValue === opt}
                        onChange={() => setAnswer(sub.id, opt)}
                      />
                      <span className="text-white">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return (
    <>
      <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
      <input
        type="text"
        className="border p-2 w-full rounded text-white bg-transparent placeholder-white"
        value={value}
        onChange={e => setAnswer(question.id, e.target.value)}
        placeholder="Type your answer..."
      />
    </>
  );
};