export interface MatrixDef {
  rows: string[];
  columns: string[];
}

export interface SubQuestion {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'text';
  options?: string[];
  highlight?: boolean;
  placeholder?: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'group' | 'radio' | 'checkbox' | 'text' | 'matrix';
  subQuestions?: SubQuestion[];
  options?: string[];
  note?: string;
  matrix?: MatrixDef;
  required?: boolean;
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
      'Attend Events / Festivals|please specify',
      'Transit|final destination',
      'Other|please specify'
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
  },
  {
    id: 6,
    text: 'What means of transport did you use while in destination? (select all applicable)',
    type: 'checkbox',
    options: [
      'Bicycle',
      'Public Bus',
      'Rented Van',
      'Chartered Bus',
      'Rented Car',
      'Taxi',
      'Personal vehicle',
      'Rented Motorcycle / ATV',
      'Walking'
    ]
  },
  {
    id: 7,
    text: 'What method did you use to book your travel?',
    type: 'group',
    subQuestions: [
      { id: '7a', text: 'Travel agent', type: 'radio', options: ['Yes'] },
      { id: '7b', text: 'Airline / Hotel Official website', type: 'radio', options: ['Yes'] },
      { id: '7c', text: 'Direct phone call', type: 'radio', options: ['Yes'] },
      { id: '7d', text: 'Other online websites', type: 'text' },
      { id: '7e', text: 'Other (please specify)', type: 'text' }
    ]
  },
  {
    id: 8,
    text: 'How many Nights did you stay on the island?',
    type: 'group',
    subQuestions: [
      { id: '8a', text: 'Dutch St. Maarten', type: 'text' },
      { id: '8b', text: 'French St. Martin', type: 'text' },
      { id: '8c', text: 'In-Transit to/from another country and did not leave the airport.', type: 'radio', options: ['Yes'] },
      { id: '8d', text: 'One-day visit to/from another country and did leave the airport.', type: 'radio', options: ['Yes'] }
    ]
  },
  {
    id: 9,
    text: 'Where did you stay in St. Maarten / St. Martin during your present visit? (Please indicate both Dutch and French accommodations where necessary)',
    type: 'group',
    subQuestions: [
      { id: '9a', text: 'Hotel', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9b', text: 'Time Share', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9c', text: 'Guest House', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9d', text: 'Condo / Villa', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9e', text: 'AirBnB / VRBO / etc', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9f', text: 'Friend / Relative', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9g', text: 'Own Property', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9h', text: 'Yacht', type: 'checkbox', options: ['Dutch', 'French'] },
      { id: '9i', text: 'Other', type: 'text'},
      { id: '9j', text: 'Provide your accommodation\'s name', type: 'text' }
    ]
  }
];