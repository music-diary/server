import { Prisma } from '@prisma/client';

export const topicsData: Prisma.TopicsCreateInput[] = [
  {
    label: '가족',
    name: 'family',
    emoji: '👨‍👩‍👧‍👦',
    order: 0,
  },
  {
    label: '연애',
    name: 'romance',
    emoji: '💓',
    order: 1,
  },
  {
    label: '이별',
    name: 'farewell',
    emoji: '💔',
    order: 2,
  },
  {
    label: '지존감',
    name: 'self-esteem',
    emoji: '🙌',
    order: 3,
  },
  {
    label: '인간관계',
    name: 'relationship',
    emoji: '🤝',
    order: 4,
  },
  {
    label: '공부',
    name: 'study',
    emoji: '🎓',
    order: 5,
  },
  {
    label: '돈',
    name: 'money',
    emoji: '💰',
    order: 6,
  },
  {
    label: '학교',
    name: 'school',
    emoji: '🏫',
    order: 7,
  },
  {
    label: '일',
    name: 'work',
    emoji: '💼',
    order: 8,
  },
  {
    label: '건강',
    name: 'health',
    emoji: '💪',
    order: 9,
  },
  {
    label: '주제없음',
    name: 'no-subject',
    emoji: '❌',
    order: 10,
  },
];
