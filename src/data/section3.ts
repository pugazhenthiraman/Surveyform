// Section 3: GENERAL INFORMATION
import type { Question } from './questions';

export const section3Questions: Question[] = [
  {
    id: 14,
    type: 'radio',
    text: 'Which of the following best describes your immediate travel party?',
    options: [
      'Alone, no travel companion',
      'You & your spouse/partner only',
      'Family & Friends',
      'Family only',
      'Friends only',
      'Business Associates',
      'Other|please specify',
    ],
    required: true,
  },
  {
    id: 15,
    type: 'group',
    text: 'Please indicate your country of permanent residence.',
    subQuestions: [
      { id: '15a', text: 'United States', type: 'text', placeholder: 'State, Zip Code' },
      { id: '15b', text: 'Canada', type: 'text', placeholder: 'Province, Postal Code' },
      { id: '15c', text: 'Caribbean', type: 'text', placeholder: 'specify' },
      { id: '15d', text: 'South America', type: 'text', placeholder: 'Country, City' },
      { id: '15e', text: 'Europe', type: 'text', placeholder: 'Country, City' },
      { id: '15f', text: 'Other', type: 'text', placeholder: 'Country, City' },
    ],
    required: true,
  },
  {
    id: 16,
    type: 'group',
    text: 'Please indicate your gross annual household income?',
    subQuestions: [
      { id: '16a', text: 'Currency', type: 'text' },
      { id: '16b', text: 'Less than 25,000', type: 'radio' },
      { id: '16c', text: '25,001 - 50,000', type: 'radio' },
      { id: '16d', text: '50,001 - 75,000', type: 'radio' },
      { id: '16e', text: '75,001 - 100,000', type: 'radio' },
      { id: '16f', text: '100,001 - 125,000', type: 'radio' },
      { id: '16g', text: 'More than 125,000', type: 'radio' },
    ],
    required: true,
  },
  {
    id: 17,
    type: 'text',
    text: 'Email (raffle)',
    required: false,
  },
]; 