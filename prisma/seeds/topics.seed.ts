import { Prisma } from '@prisma/client';

export const topicsData: Prisma.TopicsCreateInput[] = [
  {
    name: 'family',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    name: 'romance',
    emoji: '💓',
  },
  {
    name: 'farewell',
    emoji: '💔',
  },
  {
    name: 'self-esteem',
    emoji: '🙌',
  },
  {
    name: 'relationship',
    emoji: '🤝',
  },
  {
    name: 'study',
    emoji: '🎓',
  },
  {
    name: 'money',
    emoji: '💰',
  },
  {
    name: 'school',
    emoji: '🏫',
  },
  {
    name: 'work',
    emoji: '💼',
  },
  {
    name: 'health',
    emoji: '💪',
  },
  {
    name: 'no-subject',
    emoji: '❌',
  },
];
