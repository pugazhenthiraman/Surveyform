// Survey section metadata
export interface SectionMeta {
  id: number;
  name: string;
  questionIds: (number | string)[];
}

export const sections: SectionMeta[] = [
  {
    id: 1,
    name: 'TRAVEL ACTIVITIES',
    questionIds: [1,2,3,4,5,6,7,8,9], // adjust as per your Section 1 question IDs
  },
  {
    id: 2,
    name: 'EXPENDITURE INFORMATION',
    questionIds: [10,11,12,13],
  },
  {
    id: 3,
    name: 'GENERAL INFORMATION',
    questionIds: [14,15,16,17],
  },
]; 