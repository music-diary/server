import { Prisma } from '@prisma/client';

export const topicsData: Prisma.TopicsCreateInput[] = [
  {
    label: '가족',
    name: 'family',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    label: '연애',
    name: 'romance',
    emoji: '💓',
  },
  {
    label: '이별',
    name: 'farewell',
    emoji: '💔',
  },
  {
    label: '지존감',
    name: 'self-esteem',
    emoji: '🙌',
  },
  {
    label: '인간관계',
    name: 'relationship',
    emoji: '🤝',
  },
  {
    label: '공부',
    name: 'study',
    emoji: '🎓',
  },
  {
    label: '돈',
    name: 'money',
    emoji: '💰',
  },
  {
    label: '학교',
    name: 'school',
    emoji: '🏫',
  },
  {
    label: '일',
    name: 'work',
    emoji: '💼',
  },
  {
    label: '건강',
    name: 'health',
    emoji: '💪',
  },
  {
    label: '주제없음',
    name: 'no-subject',
    emoji: '❌',
  },
];
