import React from 'react';
import type { Question as QType } from '../../data/questions';
import { useSurvey } from '../../hook/useSurvey';
import { useExpenseTotals } from '../../hook/useExpenseTotals';

interface Props { question: QType; number: number; inputErrors?: Record<string, string>; }

export const Question: React.FC<Props> = ({ question, number, inputErrors }) => {
  const { answers, setAnswer } = useSurvey();
  const value = answers[String(question.id)] || '';

  // Debug: Log the question object and when the custom Q9 block runs
  console.log('Rendering Question:', question);

  // Custom rendering for Q16 + Q17: income and email on the same page
  if (question.id === 16 && question.subQuestions) {
    return (
      <div>
        <p className="mb-1 text-base md:text-lg font-semibold text-white text-left">
          {number}. <span className="font-bold text-white">
            {(() => {
              // Highlight 'gross annual household income' in orange
              const parts = question.text.split(/(gross annual household income\??)/i);
              return parts.map((part, i) =>
                part.toLowerCase().includes('gross annual household income') ? (
                  <span key={i} className="text-orange-500">{part}</span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              );
            })()}
          </span>
        </p>
        {/* Currency input */}
        <div className="mb-4 flex items-center">
          <label className="mr-2 font-medium text-white">Currency:</label>
          <input
            type="text"
            className="border-b border-gray-400 p-1 w-full text-black bg-gray-100"
            value={answers['16a'] || ''}
            onChange={e => setAnswer('16a', e.target.value)}
            placeholder="e.g. USD"
          />
        </div>
        {/* Income range radio group */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {question.subQuestions.filter(sub => sub.id !== '16a').map(sub => (
            <label key={sub.id} className="flex items-center space-x-2 text-white">
              <input
                type="radio"
                name="q16_income"
                checked={answers['16_selected'] === sub.id}
                onChange={() => setAnswer('16_selected', sub.id)}
              />
              <span className="text-white">{sub.text}</span>
            </label>
          ))}
        </div>
        {/* Email input */}
        <div className="mb-4 flex flex-col items-start">
          <label className="font-medium mb-1 text-white">Email (raffle)</label>
          <input
            type="email"
            className="border-b border-gray-400 p-1 w-full text-black bg-gray-100"
            value={answers['17'] || ''}
            onChange={e => setAnswer('17', e.target.value)}
            placeholder="Enter your email "
            autoComplete="email"
          />
        </div>
      </div>
    );
  }
  // Custom rendering for Q15: country of permanent residence (radio + input fields)
  if (question.id === 15 && question.subQuestions) {
    const selected = answers['15_selected'];
    return (
      <>
        <p className="mb-1 text-base md:text-lg font-semibold text-white text-left">
          {number}. <span className="font-bold">
            {question.text.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < question.text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </p>
        <p className="mb-4 text-sm italic text-orange-500 text-left">(Write in CAPITAL letters)</p>
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-7 gap-2 items-end font-bold text-black text-sm mb-1">
            <div className="col-span-2"></div>
            <div className="col-span-2 text-center">{question.subQuestions[0]?.inputs?.[0]?.label || ''}</div>
            <div className="col-span-2 text-center">{question.subQuestions[0]?.inputs?.[1]?.label || ''}</div>
          </div>
          {question.subQuestions.map((sub) => {
            const isSelected = selected === sub.id;
            return (
              <div key={sub.id} className="grid grid-cols-7 gap-2 items-center mb-2">
                <div className="col-span-2 flex items-center">
                  <input
                    type="radio"
                    name="q15_selected"
                    checked={isSelected}
                    onChange={() => setAnswer('15_selected', sub.id)}
                    title={sub.text}
                    aria-label={sub.text}
                  />
                  <span className="ml-2 text-white font-medium">{sub.text}</span>
                </div>
                {sub.inputs?.map((input, i) => (
                  <React.Fragment key={input.name}>
                    <div className="col-span-2">
                      <label className="sr-only">{input.label}</label>
                      <input
                        type="text"
                        className={`border-b border-gray-400 p-1 w-full text-black bg-gray-100 ${sub.id === '15c' && i === 0 ? 'italic' : ''}`}
                        value={answers[`15_${sub.id}_${input.name}`] || ''}
                        onChange={e => setAnswer(`15_${sub.id}_${input.name}`, e.target.value.toUpperCase())}
                        placeholder={input.label}
                        title={input.label}
                        disabled={!isSelected}
                      />
                    </div>
                  </React.Fragment>
                ))}
                {/* Fill empty columns for rows with fewer than 2 inputs */}
                {sub.inputs && sub.inputs.length < 2 && <div className="col-span-2"></div>}
              </div>
            );
          })}
        </div>
      </>
    );
  }
  // Custom rendering for Q1 (on duty) radio highlight in subQuestions
  if (question.id === 1 && question.subQuestions) {
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">
          {number}. {question.text}
        </p>
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4 items-start">
          {question.subQuestions.map((sub) => (
            <div key={sub.id} className="w-full flex items-center justify-between">
              <label className="inline-flex items-center space-x-2 text-white">
                <input
                  type="radio"
                  name={`q1_${sub.id}`}
                  // checked logic may need to be adjusted based on your answer structure
                  checked={answers[`1_${sub.id}`] === 'Yes'}
                  onChange={() => setAnswer(`1_${sub.id}`, 'Yes')}
                />
                <span className="text-white">
                  {sub.id === '1a'
                    ? (<>
                        A Airline crew member <span className="italic text-orange-500">(on duty)</span>?
                      </>)
                    : sub.text}
                </span>
              </label>
              <label className="inline-flex items-center space-x-2 text-white">
                <input
                  type="radio"
                  name={`q1_${sub.id}`}
                  checked={answers[`1_${sub.id}`] === 'No'}
                  onChange={() => setAnswer(`1_${sub.id}`, 'No')}
                />
                <span className="text-white">No</span>
              </label>
            </div>
          ))}
        </div>
      </>
    );
  }
  // Custom rendering for Q3: highlight '1st visit' in the question text
  if (question.id === 3) {
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-left">
          {number}. {(() => {
            const parts = question.text.split(/("?1st visit"?)/i);
            return parts.map((part, i) =>
              part.toLowerCase().includes('1st visit') ? (
                <span key={i} className="text-orange-500 italic font-semibold">{part}</span>
              ) : (
                <React.Fragment key={i}>{part}</React.Fragment>
              )
            );
          })()}
        </p>
        <div className="w-full max-w-lg mx-auto flex flex-row gap-8 justify-center">
          <label className="inline-flex items-center space-x-2 text-white">
            <input
              type="radio"
              name={`q${question.id}`}
              checked={value === 'Yes'}
              onChange={() => setAnswer(String(question.id), 'Yes')}
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center space-x-2 text-white">
            <input
              type="radio"
              name={`q${question.id}`}
              checked={value === 'No'}
              onChange={() => setAnswer(String(question.id), 'No')}
            />
            <span>No</span>
          </label>
        </div>
      </>
    );
  }
  // Improved UI for Question 9: radio group for types, then Dutch/French checkboxes, then name input
  if (question.id === 9 && question.subQuestions) {
    console.log('Custom Q9 improved block running');
    const types = question.subQuestions.filter(sub => sub.id !== '9j');
    const nameInput = question.subQuestions.find(sub => sub.id === '9j');
    const selectedType = types.find(sub => answers['9_selected'] === sub.id);
    const isOther = selectedType && selectedType.id === '9i';
    const dutchChecked = selectedType && !!answers['9_dutch'];
    const frenchChecked = selectedType && !!answers['9_french'];
    // Helper: disable Next if neither Dutch nor French is checked
    const mustSelectLang = !!selectedType && !(dutchChecked || frenchChecked);

    return (
      <>
        <p className="mb-1 text-base md:text-lg font-semibold text-white text-left">{number}. <span className="font-bold">
          {question.text}
        </span></p>
        <p className="mb-4 text-sm italic text-orange-500 text-left">(Please indicate both Dutch and French accommodations where necessary)</p>
        {/* Radio group for accommodation types */}
        <ul className="text-white w-full max-w-lg mx-auto flex flex-col gap-2 items-start mb-4">
          {types.map(sub => (
            <li key={sub.id} className="w-full flex items-center">
              <label className="inline-flex items-center space-x-2 text-white">
                <input
                  type="radio"
                  name="q9_type"
                  checked={answers['9_selected'] === sub.id}
                  onChange={() => {
                    // Clear Dutch/French and Other text when changing type
                    setAnswer('9_selected', sub.id);
                    setAnswer('9_dutch', false);
                    setAnswer('9_french', false);
                    setAnswer('9i_other', '');
                  }}
                />
                <span className="text-white">{sub.text}</span>
              </label>
            </li>
          ))}
        </ul>
        {/* If a type is selected, show Dutch/French checkboxes */}
        {selectedType && (
          <div className="mb-4 flex gap-8 items-center">
            <label className="inline-flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={!!answers['9_dutch']}
                onChange={e => setAnswer('9_dutch', e.target.checked)}
                aria-label="Select Dutch"
              />
              <span>Dutch</span>
            </label>
            <label className="inline-flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={!!answers['9_french']}
                onChange={e => setAnswer('9_french', e.target.checked)}
                aria-label="Select French"
              />
              <span>French</span>
            </label>
            {mustSelectLang && <span className="text-red-400 ml-4">Please select at least one</span>}
          </div>
        )}
        {/* If 'Other' is selected, show text input */}
        {isOther && (
          <div className="mb-4 w-full max-w-lg mx-auto">
            <input
              type="text"
              className="border p-2 w-full rounded text-black bg-white placeholder-gray-400"
              value={typeof answers['9i_other'] === 'string' ? answers['9i_other'] : ''}
              onChange={e => setAnswer('9i_other', e.target.value)}
              placeholder="Please Specify type (e.g. Timeshare, Condo, Villa, Personal house)"
            />
            {inputErrors && inputErrors['9i_other'] && (
              <div className="text-red-500 text-xs mt-1">{inputErrors['9i_other']}</div>
            )}
          </div>
        )}
        {/* Accommodation name input */}
        {nameInput && (
          <div className="mt-4 w-full max-w-lg mx-auto">
            <label className="block text-white mb-1">{nameInput.text}</label>
            <input
              type="text"
              className="border p-2 w-full rounded text-black bg-white placeholder-gray-400"
              value={answers['9j'] || ''}
              onChange={e => setAnswer('9j', e.target.value)}
              placeholder="Enter Accommodation Name/Address"
            />
            {inputErrors && inputErrors['9j'] && <div className="text-red-500 text-xs mt-1">{inputErrors['9j']}</div>}
          </div>
        )}
      </>
    );
  }
  // Custom rendering for Q11: prepaid package logic
  if (question.id === 11) {
    const yesOpt = 'Yes, what is the name of the package provider?';
    const noOpt = 'No, skip to question 3';
    const selected = value;
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-left">{number}. <span className="font-bold">
          {question.text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < question.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span></p>
        <ul className="w-full max-w-lg flex flex-col gap-2 items-start mb-4">
          <li className="w-full flex items-center">
            <label className="inline-flex items-center space-x-2 text-white">
              <input
                type="radio"
                name={`q${question.id}`}
                checked={selected === yesOpt}
                onChange={() => setAnswer(String(question.id), yesOpt)}
              />
              <span>{yesOpt}</span>
            </label>
            {selected === yesOpt && (
              <input
                type="text"
                className="ml-4 border-b border-gray-400 p-1 w-1/2 text-black bg-white placeholder-gray-400"
                value={answers['11_provider'] || ''}
                onChange={e => setAnswer('11_provider', e.target.value)}
                placeholder="Provider Name"
              />
            )}
          </li>
          <li className="w-full flex items-center">
            <label className="inline-flex items-center space-x-2 text-white">
              <input
                type="radio"
                name={`q${question.id}`}
                checked={selected === noOpt}
                onChange={() => setAnswer(String(question.id), noOpt)}
              />
              <span>No, <span className="italic text-orange-500">skip to question 3</span></span>
            </label>
          </li>
        </ul>
        {inputErrors && inputErrors['11_provider'] && selected === yesOpt && (
          <div className="text-red-500 text-xs mt-1">{inputErrors['11_provider']}</div>
        )}
      </>
    );
  }
  // Custom rendering for Q12: 3-column table with Dutch/French inputs for every row, including Accommodations options, and totals at the bottom
  if (question.id === 12 && question.subQuestions) {
    console.log('Q12 custom block running');
    const rows = [
      { id: '12a', label: 'Round trip flight', onlyDutch: true },
      { id: '12b', label: 'Accommodations', isAccommodations: true },
      { id: '12c', label: 'Meals outside Accommodations' },
      { id: '12d', label: 'Rental Car' },
      { id: '12e', label: 'Tours' },
      { id: '12f', label: 'Public transportation (taxi, bus, etc)' },
      { id: '12g', label: 'Other', isOther: true },
    ];
    const accommodationsOptions = [
      'Room only',
      'Room & Breakfast included',
      'Room, Breakfast and other meals',
    ];
    // Collect all Dutch and French keys for calculation
    const dutchKeys = rows.map(row => `${row.id}_dutch`);
    const frenchKeys = rows.map(row => `${row.id}_french`);
    const { totalDutch, totalFrench, totalCombined } = useExpenseTotals(answers as any, dutchKeys, frenchKeys);

    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-left">{number}. <span className="font-bold">
          {question.text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < question.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span></p>
        <div className="w-full max-w-4xl mx-auto mb-4">
          <div className="grid grid-cols-3 gap-2 bg-white/10 rounded-t p-2 font-bold text-white text-center">
            <div className="text-left pl-2"></div>
            <div>Dutch</div>
            <div>French</div>
          </div>
          <div className="divide-y divide-white/20">
            {rows.map(row => {
              if (row.onlyDutch) {
                return (
                  <div key={row.id} className="grid grid-cols-3 gap-2 items-center py-2">
                    <div className="text-white text-left pr-2">{row.label}</div>
                    <input
                      type="text"
                      className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                      value={answers[`${row.id}_dutch`] || ''}
                      onChange={e => setAnswer(`${row.id}_dutch`, e.target.value)}
                      placeholder="Amount (Dutch)"
                    />
                    <div></div>
                  </div>
                );
              }
              if (row.isAccommodations) {
                return (
                  <div key={row.id} className="grid grid-cols-3 gap-2 items-center py-2">
                    <div className="text-white text-left pr-2 font-bold">Accommodations:</div>
                    <div className="col-span-2 flex flex-row items-center gap-4">
                      <div className="flex flex-col gap-1 flex-1">
                        {accommodationsOptions.map(opt => (
                          <label key={opt} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="12b"
                              checked={answers['12b'] === opt}
                              onChange={() => setAnswer('12b', opt)}
                              title={opt}
                            />
                            <span className="text-white">* {opt}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <input
                          type="text"
                          className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                          value={answers['12b_dutch'] || ''}
                          onChange={e => setAnswer('12b_dutch', e.target.value)}
                          placeholder="Amount (Dutch)"
                        />
                        <input
                          type="text"
                          className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                          value={answers['12b_french'] || ''}
                          onChange={e => setAnswer('12b_french', e.target.value)}
                          placeholder="Amount (French)"
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              if (row.isOther) {
                return (
                  <div key={row.id} className="grid grid-cols-3 gap-2 items-center py-2">
                    <div className="text-white text-left pr-2">Other</div>
                    <div className="col-span-2 w-full">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                          value={answers['12g_dutch'] || ''}
                          onChange={e => setAnswer('12g_dutch', e.target.value)}
                          placeholder="Amount (Dutch)"
                        />
                        <input
                          type="text"
                          className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                          value={answers['12g_french'] || ''}
                          onChange={e => setAnswer('12g_french', e.target.value)}
                          placeholder="Amount (French)"
                        />
                      </div>
                      <div className="flex items-center mt-2">
                 
                        <input
                          type="text"
                          className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                          value={answers['12g_other'] || ''}
                          onChange={e => setAnswer('12g_other', e.target.value)}
                          placeholder="Please Specify"
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={row.id} className="grid grid-cols-3 gap-2 items-center py-2">
                  <div className="text-white text-left pr-2">{row.label}</div>
                  <input
                    type="text"
                    className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                    value={answers[`${row.id}_dutch`] || ''}
                    onChange={e => setAnswer(`${row.id}_dutch`, e.target.value)}
                    placeholder="Amount (Dutch)"
                  />
                  <input
                    type="text"
                    className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                    value={answers[`${row.id}_french`] || ''}
                    onChange={e => setAnswer(`${row.id}_french`, e.target.value)}
                    placeholder="Amount (French)"
                  />
                </div>
              );
            })}
            {/* Totals */}
            <div className="grid grid-cols-3 gap-2 items-center py-2 font-bold">
              <div className="text-white text-left pr-2">Total spent:</div>
              <input
                type="text"
                className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full bg-yellow-100 font-bold"
                value={totalDutch.toLocaleString() || '0'}
                readOnly
                tabIndex={-1}
                placeholder="Total Dutch"
              />
              <input
                type="text"
                className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full bg-yellow-100 font-bold"
                value={totalFrench.toLocaleString() || '0'}
                readOnly
                tabIndex={-1}
                placeholder="Total French"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center py-2 font-bold">
              <div className="text-white text-left pr-2">Total combined (Dutch & French):</div>
              <input
                type="text"
                className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full col-span-2 bg-yellow-100 font-bold"
                value={totalCombined.toLocaleString() || '0'}
                readOnly
                tabIndex={-1}
                placeholder="Combined total"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  // Custom rendering for Q13: 3-column expenditure table (category, Dutch, French) with section headers and currency input
  if (question.id === 13 && question.subQuestions) {
    console.log('Q13 custom block running');
    // Section headers and their corresponding sub-question ids
    const sections = [
      { title: 'Accommodations', ids: ['13a', '13b'] },
      { title: 'Food & Beverages outside Accommodations', ids: ['13c', '13d', '13e'] },
      { title: 'Sports and recreational services', ids: ['13f', '13g', '13h', '13i', '13j', '13k'] },
      { title: 'Transportation within / to other Destinations', ids: ['13l', '13m', '13n', '13o', '13p'] },
      { title: 'Shopping', ids: ['13q', '13r', '13s', '13t', '13u'] },
      { title: 'Other Goods (Gifts, Amsterdam cheese, souvenirs etc.)', ids: ['13v'] },
      { title: 'Other Services (Health, education, laundry etc.)', ids: ['13w'] },
    ];
    // Map subQuestions by id for easy lookup
    const subMap = Object.fromEntries(question.subQuestions.map(sq => [sq.id, sq]));

    // Collect all Dutch and French keys for calculation
    const dutchKeys = sections.flatMap(section => section.ids.map(id => `${id}_dutch`));
    const frenchKeys = sections.flatMap(section => section.ids.map(id => `${id}_french`));
    const { totalDutch, totalFrench, totalCombined } = useExpenseTotals(answers as any, dutchKeys, frenchKeys);

    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-left">{number}. <span className="font-bold">
          {(() => {
            // Highlight 'TOTAL', 'IN', and the note
            const mainText = question.text.replace(/\(Excluding prepaid package and\/or airfare, question 12\)/, '').trim();
            const noteMatch = question.text.match(/\(Excluding prepaid package and\/or airfare, question 12\)/);
            // Highlight TOTAL and IN
            const parts = mainText.split(/(TOTAL|IN)/);
            return <>
              {parts.map((part, i) => {
                if (part === 'TOTAL' || part === 'IN') {
                  return <span key={i} className="text-orange-500 font-semibold">{part}</span>;
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
              })}
              {noteMatch && (
                <span className="block text-sm italic text-orange-500 mt-1">{noteMatch[0]}</span>
              )}
            </>;
          })()}
        </span></p>
        <div className="w-full max-w-4xl mx-auto mb-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-bold text-white">Currency:</span>
            <input
              type="text"
              className="border p-1 rounded text-black bg-white placeholder-gray-400 w-32"
              value={answers['13_currency'] || ''}
              onChange={e => setAnswer('13_currency', e.target.value)}
              placeholder="USD/EUR/etc."
            />
          </div>
          <div className="grid grid-cols-3 gap-2 bg-white/10 rounded-t p-2 font-bold text-white text-center">
            <div className="text-left pl-2">Category</div>
            <div>Dutch</div>
            <div>French</div>
          </div>
          {sections.map(section => (
            <React.Fragment key={section.title}>
              <div className="col-span-3 font-bold text-white bg-white/5 px-2 py-1 text-left border-b border-white/20">{section.title}</div>
              {section.ids.map(id => {
                const sub = subMap[id];
                if (!sub) return null;
                return (
                  <div key={sub.id} className="grid grid-cols-3 gap-2 items-center border-b border-white/20 p-2">
                    <div className="text-white text-left pr-2">{sub.text}</div>
                    <input
                      type="text"
                      className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                      value={answers[`${sub.id}_dutch`] || ''}
                      onChange={e => setAnswer(`${sub.id}_dutch`, e.target.value)}
                      placeholder="Amount (Dutch)"
                    />
                    <input
                      type="text"
                      className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                      value={answers[`${sub.id}_french`] || ''}
                      onChange={e => setAnswer(`${sub.id}_french`, e.target.value)}
                      placeholder="Amount (French)"
                    />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
          {/* Total spent row */}
          <div className="grid grid-cols-3 gap-2 items-center py-2 font-bold">
            <div className="text-white text-left pr-2">Total spent:</div>
            <input
              type="text"
              className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full bg-yellow-100 font-bold"
              value={totalDutch.toLocaleString() || '0'}
              readOnly
              tabIndex={-1}
              placeholder="Total Dutch"
            />
            <input
              type="text"
              className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full bg-yellow-100 font-bold"
              value={totalFrench.toLocaleString() || '0'}
              readOnly
              tabIndex={-1}
              placeholder="Total French"
            />
          </div>
          {/* Total combined row */}
          <div className="grid grid-cols-3 gap-2 items-center py-2 font-bold">
            <div className="text-white text-left pr-2">Total combined (Dutch & French):</div>
            <input
              type="text"
              className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full col-span-2 bg-yellow-100 font-bold"
              value={totalCombined.toLocaleString() || '0'}
              readOnly
              tabIndex={-1}
              placeholder="Combined total"
            />
          </div>
        </div>
      </>
    );
  }
  if (question.type === 'radio' && number === 4) {
    const isScrollable = question.options && question.options.length > 5;
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
          {question.text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < question.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span></p>
        <ul
          className={`text-white w-full max-w-lg mx-auto${isScrollable ? ' scrollable-options' : ' flex flex-col gap-4 items-start'}`}
        >
          {question.options!.map(optRaw => {
            const [opt] = optRaw.split('|');
            let placeholder = '';
            if (opt === 'Attend Events / Festivals') placeholder = 'Please Specify';
            if (opt === 'Transit') placeholder = 'Final Destination';
            if (opt === 'Other') placeholder = 'Please Specify';
            const isSelected = value === opt;
            // Key for the input field
            const inputKey = `${question.id}_${opt.replace(/\s+/g, '_').toLowerCase()}`;
            // When changing radio, clear all other input fields
            const handleRadioChange = () => {
              setAnswer(String(question.id), opt);
              // Clear all other input fields for this question
              ['Attend Events / Festivals', 'Transit', 'Other'].forEach(option => {
                const key = `${question.id}_${option.replace(/\s+/g, '_').toLowerCase()}`;
                if (option !== opt && answers[key]) {
                  setAnswer(key, '');
                }
              });
            };
            return (
              <li key={optRaw} className="w-full flex items-center justify-between">
                <label className="inline-flex items-center space-x-2 text-white">
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    checked={isSelected}
                    onChange={handleRadioChange}
                  />
                  <span className="text-white">{opt}</span>
                </label>
                {(opt === 'Attend Events / Festivals' || opt === 'Transit' || opt === 'Other') && (
                  <input
                    type="text"
                    className="ml-4 border p-1 rounded text-black bg-white placeholder-gray-400 w-1/2"
                    value={answers[inputKey] as string || ''}
                    onChange={e => setAnswer(inputKey, e.target.value)}
                    placeholder={placeholder}
                    disabled={!isSelected}
                    style={!isSelected ? { backgroundColor: '#e5e7eb' } : {}}
                  />
                )}
                {inputErrors && inputErrors[inputKey] && <div className="text-red-500 text-xs mt-1">{inputErrors[inputKey]}</div>}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  if (question.type === 'radio') {
    const isScrollable = question.options && question.options.length > 5;
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
          {question.text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < question.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span></p>
        <ul
          className={`text-white w-full max-w-lg mx-auto${isScrollable ? ' scrollable-options' : ' flex flex-col gap-4 items-start'}`}
        >
          {question.options!.map(optRaw => {
            const [opt, extra] = optRaw.split('|');
            return (
              <li key={optRaw} className="w-full">
                <label className="inline-flex items-center space-x-2 text-white w-full">
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    checked={value === opt}
                    onChange={() => setAnswer(String(question.id), opt)}
                  />
                  <span className="text-white">{opt}</span>
                </label>
                {extra && value === opt && (
                  <input
                    type="text"
                    className="ml-4 mt-2 border p-1 rounded text-black bg-white placeholder-gray-400 w-2/3"
                    value={answers[`${question.id}_other`] as string || ''}
                    onChange={e => setAnswer(`${question.id}_other`, e.target.value)}
                    placeholder={extra}
                  />
                )}
                {inputErrors && inputErrors[`${question.id}_other`] && <div className="text-red-500 text-xs mt-1">{inputErrors[`${question.id}_other`]}</div>}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  if (question.type === 'checkbox') {
    const isScrollable = question.options && question.options.length > 5;
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
          {question.text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < question.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span></p>
        <ul
          className={`text-white${isScrollable ? ' scrollable-options' : ' flex flex-wrap gap-4 justify-center'}`}
        >
          {question.options!.map(opt => {
            const checked = Array.isArray(value) ? value.includes(opt) : false;
            return (
              <li key={opt}>
                <label className="inline-flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    name={`q${question.id}`}
                    checked={checked}
                    onChange={e => {
                      let newValue = Array.isArray(value) ? [...value] : [];
                      if (e.target.checked) newValue.push(opt);
                      else newValue = newValue.filter((v: string) => v !== opt);
                      setAnswer(String(question.id), newValue);
                    }}
                  />
                  <span className="text-white">{opt}</span>
                </label>
                {(opt.toLowerCase().includes('other') || opt.toLowerCase().includes('specify')) && checked && (
                  <input
                    type="text"
                    className="ml-2 border p-1 rounded text-black bg-white placeholder-gray-400"
                    value={answers[`${question.id}_other`] as string || ''}
                    onChange={e => setAnswer(`${question.id}_other`, e.target.value)}
                    placeholder="Please Specify"
                  />
                )}
                {inputErrors && inputErrors[`${question.id}_other`] && <div className="text-red-500 text-xs mt-1">{inputErrors[`${question.id}_other`]}</div>}
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  if (question.type === 'group' && [2, 7, 8, 9].includes(question.id) && question.subQuestions) {
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
          {question.id === 8
            ? (() => {
                // Highlight 'Nights' in orange for question 8
                const parts = question.text.split(/(Nights)/);
                return parts.map((part, i) =>
                  part === 'Nights' ? (
                    <span key={i} className="text-orange-500">{part}</span>
                  ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                  )
                );
              })()
            : question.text.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < question.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
        </span></p>
        <ul className="text-white w-full max-w-lg mx-auto flex flex-col gap-4 items-start">
          {question.subQuestions.map((sub) => (
            <li key={sub.id} className="w-full flex items-center justify-between">
              <label className="inline-flex items-center space-x-2 text-white">
                <input
                  type="radio"
                  name={`q${question.id}`}
                  checked={value === sub.id}
                  onChange={() => setAnswer(String(question.id), sub.id)}
                />
                <span className="text-white">
                  {sub.text.includes('question 4') ? (
                    <>
                      {sub.text.split(/(question 4\.?)/i).map((part, i) =>
                        part.toLowerCase().includes('question 4') ? (
                          <span key={i} className="text-orange-500 font-semibold">{part}</span>
                        ) : (
                          <React.Fragment key={i}>{part}</React.Fragment>
                        )
                      )}
                    </>
                  ) : sub.text}
                </span>
              </label>
              {sub.type === 'text' && value === sub.id && (
                <input
                  type="text"
                  className="ml-4 border p-1 rounded text-black bg-white placeholder-gray-400 w-1/2"
                  value={answers[`${question.id}_${sub.id}_text`] || ''}
                  onChange={e => setAnswer(`${question.id}_${sub.id}_text`, e.target.value)}
                  placeholder={sub.placeholder || 'Please Specify'}
                />
              )}
              {inputErrors && inputErrors[`${question.id}_${sub.id}_text`] && <div className="text-red-500 text-xs mt-1">{inputErrors[`${question.id}_${sub.id}_text`]}</div>}
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (question.type === 'group' && question.subQuestions) {
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
          {question.text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < question.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span></p>
        <div className="space-y-4">
          {question.subQuestions.map((sub) => {
            const subValue = answers[String(sub.id)] || '';
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
                        onChange={() => setAnswer(String(sub.id), opt)}
                      />
                      <span className="text-white">{opt}</span>
                    </label>
                  ))}
                  {sub.type === 'text' && (
                    <input
                      type="text"
                      className="ml-2 border p-1 rounded text-black bg-white placeholder-gray-400"
                      value={answers[String(sub.id)] as string || ''}
                      onChange={e => setAnswer(String(sub.id), e.target.value)}
                      placeholder="Please Specify"
                    />
                  )}
                  {sub.options && sub.options.some(opt => opt.toLowerCase().includes('other') || opt.toLowerCase().includes('specify')) &&
                    ((Array.isArray(subValue) && subValue.includes('Other')) || subValue === 'Other') && (
                      <input
                        type="text"
                        className="ml-2 border p-1 rounded text-black bg-white placeholder-gray-400"
                        value={answers[`${sub.id}_other`] as string || ''}
                        onChange={e => setAnswer(`${sub.id}_other`, e.target.value)}
                        placeholder="Please Specify"
                      />
                  )}
                  {inputErrors && inputErrors[`${sub.id}_other`] && <div className="text-red-500 text-xs mt-1">{inputErrors[`${sub.id}_other`]}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  // Custom matrix/grid for question 10 (age/gender categories)
  if (question.id === 10 && question.matrix) {
    const ageCategories = question.matrix.rows;
    const genders = question.matrix.columns;
    return (
      <>
        <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
          {(() => {
            // Highlight 'including Yourself' and '(Indicate a number for each category)'
            const mainText = question.text.replace(/\(Indicate a number for each category\)/, '').trim();
            const noteMatch = question.text.match(/\(Indicate a number for each category\)/);
            const parts = mainText.split(/(including Yourself)/);
            return <>
              {parts.map((part, i) =>
                part === 'including Yourself' ? (
                  <span key={i} className="text-orange-500 font-semibold">{part}</span>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              )}
              {noteMatch && (
                <span className="block text-sm italic text-orange-500 mt-1">{noteMatch[0]}</span>
              )}
            </>;
          })()}
        </span></p>
        <table className="w-full max-w-lg mx-auto text-white border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-left">&nbsp;</th>
              {genders.map(gender => (
                <th key={gender} className="text-center">{gender}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ageCategories.map(age => (
              <tr key={age}>
                <td className="pr-2 whitespace-nowrap">{age}</td>
                {genders.map(gender => {
                  const key = `${question.id}_${gender.toLowerCase()}_${age.replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase()}`;
                  const val = answers[key] || '';
                  return (
                    <td key={gender} className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="border p-1 rounded text-black bg-white w-16 text-center"
                        value={val}
                        onChange={e => {
                          const v = e.target.value;
                          if (/^\d*$/.test(v)) setAnswer(key, v);
                        }}
                        placeholder="0"
                      />
                      {inputErrors && inputErrors[key] && <div className="text-red-500 text-xs mt-1">{inputErrors[key]}</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  // Force line break for question 4
  if (question.id === 4) {
    const [first, second] = question.text.split('/');
    return (
      <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">
        {number}. {first}/<br />{second}
      </p>
    );
  }
  return (
    <>
      <p className="mb-4 text-base md:text-lg font-semibold text-white text-center">{number}. <span className="font-bold">
        {question.text.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < question.text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </span></p>
      <input
        type="text"
        className="border p-2 w-full rounded text-white bg-transparent placeholder-white"
        value={value}
        onChange={e => setAnswer(String(question.id), e.target.value)}
        placeholder="Type your answer..."
      />
      {inputErrors && inputErrors[String(question.id)] && <div className="text-red-500 text-xs mt-1">{inputErrors[String(question.id)]}</div>}
    </>
  );
};