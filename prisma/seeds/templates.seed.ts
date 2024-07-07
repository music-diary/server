import { Prisma } from '@prisma/client';

export const templatesData: Prisma.TemplatesCreateInput[] = [
  {
    name: 'SCS 회고',
    description: '더 강하고 단단한 나로 발전하고 싶을 때',
    type: 'SCS',
    templateContent: {
      Stop: '멈추고 싶은 것',
      Continue: '이어나갈 것',
      Start: '새롭게 시작하고 싶은 것',
    },
  },
  {
    name: 'KPT 회고',
    description: '사실에 기반해 더 나은 나로 발전하고 싶을 때',
    type: 'KPT',
    templateContent: {
      Keep: '유지할 것',
      Problem: '해결해야 할 것',
      Try: '시도해볼 것',
    },
  },
  {
    name: 'MSG 회고',
    description: '거침없이 감정에 솔직하고 싶을 때',
    type: 'MSG',
    templateContent: {
      Mad: '화남',
      Sad: '슬픔',
      Good: '기쁨',
    },
  },
  {
    name: '4L 회고',
    description: '내면의 열망을 이끌어 내고 싶을 때',
    type: '4L',
    templateContent: {
      Loved: '사랑하는 것',
      Learned: '배웠던 것',
      Lacked: '부족했던 것',
      'Longed-for': '열망하는 것',
    },
  },
  {
    name: '5F 회고',
    description: '사실과 감정을 균형있게 담긴 일기를 쓰고 싶을 때',
    type: '5F',
    templateContent: {
      Fact: '사실',
      Feeling: '느낌',
      Finding: '인사이트',
      'Future Action': '향후 계획',
      Feedback: '피드백',
    },
  },
];
