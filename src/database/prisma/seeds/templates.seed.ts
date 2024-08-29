import { Prisma } from '@prisma/client';

export const templatesData: Prisma.TemplatesCreateInput[] = [
  {
    id: 'b7e20d1e-65ec-4153-a20b-3b6c0b19a307',
    name: 'SCS 회고',
    description: '더 강하고 단단한 나로 발전하고 싶을 때',
    type: 'SCS',
    order: 0,
    isExample: true,
  },
  {
    id: 'a87794db-eb0a-423c-b848-aa8180234f82',
    name: 'KPT 회고',
    description: '사실에 기반해 더 나은 나로 발전하고 싶을 때',
    type: 'KPT',
    order: 1,
    isExample: true,
  },
  {
    id: '969e9224-8eae-45c3-b2cb-924b2a0b2654',
    name: '5F 회고',
    description: '사실과 감정을 균형있게 담긴 일기를 쓰고 싶을 때',
    type: '5F',
    order: 2,
    isExample: true,
  },
  {
    id: 'f696b3f4-4e0f-46bb-9b0b-191b0bef6ddc',
    name: '4L 회고',
    description: '내면의 열망을 이끌어 내고 싶을 때',
    type: '4L',
    order: 3,
    isExample: true,
  },

  {
    id: '9ef9a829-a464-49cf-81a0-b63323f5fd3a',
    name: 'Mad, Sad, Glad',
    description: '거침없이 감정에 솔직하고 싶을 때',
    type: 'MSG',
    order: 4,
    isExample: true,
  },
];

export const templateContentsData: Prisma.TemplateContentsCreateInput[][] = [
  // SCS
  [
    {
      id: 'fe9e75bc-dc7d-402e-97fc-b03336c416b9',
      order: 0,
      name: 'Stop',
      label: '멈추고 싶은 것',
    },
    {
      id: 'ea0f04b7-95dc-496d-bee2-7bc1aeedad6e',
      order: 1,
      name: 'Continue',
      label: '이어나갈 것',
    },
    {
      id: '759bd4bd-fbc3-4876-bce3-f0445e7a8b8f',
      order: 2,
      name: 'Start',
      label: '새롭게 시작하고 싶은 것',
    },
  ],
  // KPT
  [
    {
      id: '4a25b71d-c3a8-4295-9f12-db30f7bae5c6',
      order: 0,
      name: 'Keep',
      label: '유지할 것',
    },
    {
      id: 'fead7619-40a6-4b6d-801c-47ba118ae54d',
      order: 1,
      name: 'Problem',
      label: '해결해야 할 것',
    },
    {
      id: '7c3be847-5031-4a49-a19b-9963e44d03f4',
      order: 2,
      name: 'Try',
      label: '시도해볼 것',
    },
  ],
  // 5F
  [
    {
      id: 'e109c40f-697f-4ea1-ba4d-8385e4e285de',
      order: 0,
      name: 'Fact',
      label: '사실',
    },
    {
      id: '07b6d111-cf87-4dab-ab72-178faf1612a3',
      order: 1,
      name: 'Feeling',
      label: '느낌',
    },
    {
      id: '0036d642-f197-40de-a2db-90bffaed12f4',
      order: 2,
      name: 'Finding',
      label: '인사이트',
    },
    {
      id: '457512fa-37b1-441b-9aa7-f976b201dae7',
      order: 3,
      name: 'Future Action',
      label: '향후 계획',
    },
    {
      id: '149eca60-c8d3-4808-8acc-968fcdcf3e31',
      order: 4,
      name: 'Feedback',
      label: '피드백',
    },
  ],
  // 4L
  [
    {
      id: '5e61fa6e-21fe-45e8-ad5d-170294a81b61',
      order: 0,
      name: 'Loved',
      label: '사랑하는 것',
    },
    {
      id: '504da7e7-d61c-49d8-8491-15add5bb06df',
      order: 1,
      name: 'Learned',
      label: '배웠던 것',
    },
    {
      id: '014360c2-8ed2-4064-8315-ea4f8cabe70f',
      order: 2,
      name: 'Lacked',
      label: '부족했던 것',
    },
    {
      id: '32ac67a8-01f7-4728-b9e9-1eaab19a6128',
      order: 3,
      name: 'Longed-for',
      label: '열망하는 것',
    },
  ],
  // MSG
  [
    {
      id: '3ef8da52-4e5c-4b27-8b5b-2edfac40af18',
      order: 0,
      name: 'Mad',
      label: '화남',
    },
    {
      id: 'd38cda97-e707-45da-bf72-82660928edf9',
      order: 1,
      name: 'Sad',
      label: '슬픔',
    },
    {
      id: '4a7035ef-243c-48b8-a901-55dc8460b0aa',
      order: 2,
      name: 'Good',
      label: '기쁨',
    },
  ],
];
