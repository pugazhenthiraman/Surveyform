import React from 'react';
import type { Question as QType } from '../../data/questions';
import { useSurvey } from '../../hook/useSurvey';

interface Props { question: QType; number: number; inputErrors?: Record<string, string>; }

export const Question: React.FC<Props> = ({ question, number, inputErrors }) => {
  const { answers, setAnswer } = useSurvey();
  const value = answers[String(question.id)] || '';

  // Debug: Log the question object and when the custom Q9 block runs
  console.log('Rendering Question:', question);

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
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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
              value={answers['9i_other'] || ''}
              onChange={e => setAnswer('9i_other', e.target.value)}
              placeholder="please specify type (e.g. Timeshare, Condo, Villa, Personal house)"
            />
            {inputErrors && inputErrors['9i_other'] && <div className="text-red-500 text-xs mt-1">{inputErrors['9i_other']}</div>}
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
              placeholder="Enter accommodation name/address"
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
        <p className="mb-4 text-lg font-semibold text-white text-left">{number}. <span className="font-bold">{question.text}</span></p>
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
                placeholder="Provider name"
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
              <span>No, <span className="italic text-orange-500">skip to question 13</span></span>
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
    return (
      <>
        <p className="mb-4 text-lg font-semibold text-white text-left">{number}. <span className="font-bold">{question.text}</span></p>
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
                    <div className="col-span-3 flex items-center mt-2 ml-8">
                      <span className="text-white mr-2">please specify</span>
                      <input
                        type="text"
                        className="border p-1 rounded text-black bg-white placeholder-gray-400 w-1/2"
                        value={answers['12g_other'] || ''}
                        onChange={e => setAnswer('12g_other', e.target.value)}
                        placeholder="please specify"
                      />
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
                className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                value={answers['12_total_dutch'] || ''}
                onChange={e => setAnswer('12_total_dutch', e.target.value)}
                placeholder="Total Dutch"
              />
              <input
                type="text"
                className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full"
                value={answers['12_total_french'] || ''}
                onChange={e => setAnswer('12_total_french', e.target.value)}
                placeholder="Total French"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center py-2 font-bold">
              <div className="text-white text-left pr-2">Total combined (Dutch & French):</div>
              <input
                type="text"
                className="border p-1 rounded text-black bg-white placeholder-gray-400 w-full col-span-2"
                value={answers['12_total_combined'] || ''}
                onChange={e => setAnswer('12_total_combined', e.target.value)}
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
    return (
      <>
        <p className="mb-4 text-lg font-semibold text-white text-left">{number}. <span className="font-bold">{question.text}</span></p>
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
        </div>
      </>
    );
  }
  if (question.type === 'radio' && number === 4) {
    const isScrollable = question.options && question.options.length > 5;
    return (
      <>
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
        <ul
          className={`text-white w-full max-w-lg mx-auto${isScrollable ? ' scrollable-options' : ' flex flex-col gap-4 items-start'}`}
        >
          {question.options!.map(optRaw => {
            const [opt] = optRaw.split('|');
            let placeholder = '';
            if (opt === 'Attend Events / Festivals') placeholder = 'please specify';
            if (opt === 'Transit') placeholder = 'final destination';
            if (opt === 'Other') placeholder = 'please specify';
            return (
              <li key={optRaw} className="w-full flex items-center justify-between">
                <label className="inline-flex items-center space-x-2 text-white">
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    checked={value === opt}
                    onChange={() => setAnswer(String(question.id), opt)}
                  />
                  <span className="text-white">{opt}</span>
                </label>
                {(opt === 'Attend Events / Festivals' || opt === 'Transit' || opt === 'Other') && (
                  <input
                    type="text"
                    className="ml-4 border p-1 rounded text-black bg-white placeholder-gray-400 w-1/2"
                    value={answers[`${question.id}_${opt.replace(/\s+/g, '_').toLowerCase()}`] as string || ''}
                    onChange={e => setAnswer(`${question.id}_${opt.replace(/\s+/g, '_').toLowerCase()}`, e.target.value)}
                    placeholder={placeholder}
                  />
                )}
                {inputErrors && inputErrors[`${question.id}_${opt.replace(/\s+/g, '_').toLowerCase()}`] && <div className="text-red-500 text-xs mt-1">{inputErrors[`${question.id}_${opt.replace(/\s+/g, '_').toLowerCase()}`]}</div>}
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
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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
                    placeholder="Please specify"
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
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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
                <span className="text-white">{sub.text}</span>
              </label>
              {sub.type === 'text' && value === sub.id && (
                <input
                  type="text"
                  className="ml-4 border p-1 rounded text-black bg-white placeholder-gray-400 w-1/2"
                  value={answers[`${question.id}_${sub.id}_text`] || ''}
                  onChange={e => setAnswer(`${question.id}_${sub.id}_text`, e.target.value)}
                  placeholder={sub.placeholder || 'Please specify'}
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
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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
                      placeholder="Please specify"
                    />
                  )}
                  {sub.options && sub.options.some(opt => opt.toLowerCase().includes('other') || opt.toLowerCase().includes('specify')) &&
                    ((Array.isArray(subValue) && subValue.includes('Other')) || subValue === 'Other') && (
                      <input
                        type="text"
                        className="ml-2 border p-1 rounded text-black bg-white placeholder-gray-400"
                        value={answers[`${sub.id}_other`] as string || ''}
                        onChange={e => setAnswer(`${sub.id}_other`, e.target.value)}
                        placeholder="Please specify"
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
        <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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
  return (
    <>
      <p className="mb-4 text-lg font-semibold text-white text-center">{number}. {question.text}</p>
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