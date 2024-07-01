import { Prisma, TemplateType } from '@prisma/client';

export const templatesData: Prisma.TemplatesCreateInput[] = [
  {
    name: 'SCS 회고',
    description: '더 강하고 단단한 나로 발전하고 싶을 때',
    type: TemplateType.SCS,
    templateContent: {
      stop: '멈추고 싶은 것',
      continue: '이어나갈 것',
      start: '새롭게 시작하고 싶은 것',
    },
  },
  {
    name: 'KPT 회고',
    description: '사실에 기반해 더 나은 나로 발전하고 싶을 때',
    type: TemplateType.KPT,
    templateContent: {
      keep: '유지할 것',
      problem: '해결해야 할 것',
      try: '시도해볼 것',
    },
  },
  {
    name: 'MSG 회고',
    description: '거침없이 감정에 솔직하고 싶을 때',
    type: TemplateType.MSG,
    templateContent: {
      mad: '멈추고 싶은 것',
      sad: '이어나갈 것',
      good: '새롭게 시작하고 싶은 것',
    },
  },
  {
    name: '4L 회고',
    description: '내면의 열망을 이끌어 내고 싶을 때',
    type: TemplateType.FOURL,
    templateContent: {
      loved: '사랑하는 것',
      learned: '배웠던 것',
      lacked: '부족했던 것',
      'longed-for': '열망하는 것',
    },
  },
  {
    name: '5F 회고',
    description: '사실과 감정을 균형있게 담긴 일기를 쓰고 싶을 때',
    type: TemplateType.FIVEF,
    templateContent: {
      fact: '사실',
      feeling: '느낌',
      finding: '인사이트',
      'future-action': '향후 계획',
      feedback: '피드백',
    },
  },
];
