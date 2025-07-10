export interface SubQuestion {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'text';
  options?: string[];
  highlight?: boolean;
}

export interface Question {
  id: number;
  text: string;
  type: 'group' | 'radio' | 'checkbox' | 'text';
  subQuestions?: SubQuestion[];
  options?: string[];
  note?: string;
}

export const questions: Question[] = [
  {
    id: 1,
    text: 'Are you:',
    type: 'group',
    subQuestions: [
      { id: '1a', text: 'A Airline crew member (on duty)?', type: 'radio', options: ['Yes', 'No'], },
      { id: '1b', text: 'On business, employed by a resident entity?', type: 'radio', options: ['Yes', 'No'] },
      { id: '1c', text: 'A St. Maarten / St. Martin national residing abroad?', type: 'radio', options: ['Yes', 'No'] }
    ]
  },
  {
    id: 2,
    text: 'Is this your first visit to St. Maarten / St. Martin?',
    type: 'group',
    subQuestions: [
      { id: '2a', text: 'Yes, proceed to question 4.', type: 'radio', options: ['Yes'] },
      { id: '2b', text: 'No, how many times before?', type: 'radio', options: ['1', '2', '3', '4', '5+'] }
    ]
  },
  {
    id: 3,
    text: 'Was your "1st visit" to St. Maarten via cruise?',
    type: 'radio',
    options: ['Yes', 'No']
  },
  {
    id: 4,
    text: 'Please indicate the MAIN reason for your visit to St. Maarten / St. Martin.',
    type: 'radio',
    options: [
      'Vacation / Leisure',
      'Visiting Friends or Relatives',
      'Business / Convention',
      'Honeymoon / Wedding',
      'Yachting / Boat Charter',
      'Shopping',
      'Education / Training (less than 1 year)',
      'Health and medical care',
      'Attend Events / Festivals',
      'Transit',
      'Other'
    ],
    note: 'Only 1 answer possible'
  },
  {
    id: 5,
    text: 'How far in advance did you plan this trip?',
    type: 'radio',
    options: [
      '1 week or Less',
      '2 weeks - 1 month',
      '2 - 3 months',
      '4 - 7 months',
      '8 - 12 months',
      '12+ months'
    ]
  }
];