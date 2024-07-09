import { Prisma } from '@prisma/client';

export const templatesData: Prisma.TemplatesCreateInput[] = [
  {
    name: 'SCS 회고',
    description: '더 강하고 단단한 나로 발전하고 싶을 때',
    type: 'SCS',
  },
  {
    name: 'KPT 회고',
    description: '사실에 기반해 더 나은 나로 발전하고 싶을 때',
    type: 'KPT',
  },
  {
    name: '5F 회고',
    description: '사실과 감정을 균형있게 담긴 일기를 쓰고 싶을 때',
    type: '5F',
  },
  {
    name: '4L 회고',
    description: '내면의 열망을 이끌어 내고 싶을 때',
    type: '4L',
  },

  {
    name: 'Mad, Sad, Glad',
    description: '거침없이 감정에 솔직하고 싶을 때',
    type: 'MSG',
  },
];

export const templateContentsData: Prisma.TemplateContentsCreateInput[][] = [
  // SCS
  [
    {
      order: 0,
      name: 'Stop',
      label: '멈추고 싶은 것',
    },
    {
      order: 1,
      name: 'Continue',
      label: '이어나갈 것',
    },
    {
      order: 2,
      name: 'Start',
      label: '새롭게 시작하고 싶은 것',
    },
  ],
  // KPT
  [
    {
      order: 0,
      name: 'Keep',
      label: '유지할 것',
    },
    {
      order: 1,
      name: 'Problem',
      label: '해결해야 할 것',
    },
    {
      order: 2,
      name: 'Stop',
      label: '시도해볼 것',
    },
  ],
  // 5F
  [
    {
      order: 0,
      name: 'Fact',
      label: '사실',
    },
    {
      order: 1,
      name: 'Feeling',
      label: '느낌',
    },
    {
      order: 2,
      name: 'Finding',
      label: '인사이트',
    },
    {
      order: 3,
      name: 'Future Action',
      label: '향후 계획',
    },
    {
      order: 4,
      name: 'Feedback',
      label: '피드백',
    },
  ],
  // 4L
  [
    {
      order: 0,
      name: 'Loved',
      label: '사랑하는 것',
    },
    {
      order: 1,
      name: 'Learned',
      label: '배웠던 것',
    },
    {
      order: 2,
      name: 'Lacked',
      label: '부족했던 것',
    },
    {
      order: 3,
      name: 'Longed-for',
      label: '열망하는 것',
    },
  ],
  // MSG
  [
    {
      order: 0,
      name: 'Mad',
      label: '화남',
    },
    {
      order: 1,
      name: 'Sad',
      label: '슬픔',
    },
    {
      order: 2,
      name: 'Good',
      label: '기쁨',
    },
  ],
];
