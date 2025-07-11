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
      'Other|Please Specify',
    ],
    required: true,
  },
  {
    id: 15,
    type: 'group',
    text: 'Please indicate your country of permanent residence. ',
    subQuestions: [
      {
        id: '15a',
        text: 'United States',
        type: 'radio',
        inputs: [
          { name: 'state', label: 'State', placeholder: 'State' },
          { name: 'zip', label: 'Zip Code', placeholder: 'Zip Code' },
        ],
      },
      {
        id: '15b',
        text: 'Canada',
        type: 'radio',
        inputs: [
          { name: 'province', label: 'Province', placeholder: 'Province' },
          { name: 'postal', label: 'Postal Code', placeholder: 'Postal Code' },
        ],
      },
      {
        id: '15c',
        text: 'Caribbean',
        type: 'radio',
        inputs: [
          { name: 'specify', label: '(Specify)', placeholder: 'specify' },
        ],
      },
      {
        id: '15d',
        text: 'South America',
        type: 'radio',
        inputs: [
          { name: 'country', label: 'Country', placeholder: 'Country' },
          { name: 'city', label: 'City', placeholder: 'City' },
        ],
      },
      {
        id: '15e',
        text: 'Europe',
        type: 'radio',
        inputs: [
          { name: 'country', label: 'Country', placeholder: 'Country' },
          { name: 'city', label: 'City', placeholder: 'City' },
        ],
      },
      {
        id: '15f',
        text: 'Other',
        type: 'radio',
        inputs: [
          { name: 'country', label: 'Country', placeholder: 'Country' },
          { name: 'city', label: 'City', placeholder: 'City' },
        ],
      },
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
 
]; 