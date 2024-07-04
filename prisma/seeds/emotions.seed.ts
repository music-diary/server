import { Prisma } from '@prisma/client';

export const basicEmotionsData: Prisma.EmotionsCreateInput[] = [
  {
    name: 'good',
    label: '좋았어요',
  },
  {
    name: 'normal',
    label: '그저그래요',
  },
  // {
  //   name: 'bad',
  //   label: '별로였어요',
  // },
];

export const positiveFirstDepthEmotionsData: Prisma.EmotionsCreateInput[] = [
  // good
  {
    name: 'happy',
    label: '행복한',
    level: 1,
  },
  {
    name: 'expected',
    label: '기대하는',
    level: 1,
  },
  // {
  //   name: 'grateful',
  //   label: '감사한',
  //   level: 1,
  // },
  // {
  //   name: 'comfortable',
  //   label: '편안한',
  //   level: 1,
  // },
  // {
  //   name: 'relieved',
  //   label: '후련한',
  //   level: 1,
  // },
  // {
  //   name: 'nostalgic',
  //   label: '추억하는',
  //   level: 1,
  // },
  // {
  //   name: 'overwhelmed',
  //   label: '벅차오르는',
  //   level: 1,
  // },
];

export const positiveSecondDepthEmotionsData: Prisma.EmotionsCreateInput[][] = [
  // good
  // 행복한
  [
    {
      name: 'glad',
      label: '반가운',
      level: 2,
    },
    {
      name: 'pleased',
      label: '즐거운',
      level: 2,
    },
    {
      name: 'joyful',
      label: '신나는',
      level: 2,
    },
    {
      name: 'cheerful',
      label: '발랄한',
      level: 2,
    },
    {
      name: 'excited',
      label: '설레는',
      level: 2,
    },
    {
      name: 'beautiful',
      label: '아름다운',
      level: 2,
    },
  ],
  [
    // 기대하는
    {
      name: 'motivated',
      label: '의욕적인',
      level: 2,
    },
    {
      name: 'proud',
      label: '뿌듯한',
      level: 2,
    },
    {
      name: 'hopeful',
      label: '희망찬',
      level: 2,
    },
    {
      name: 'flattered',
      label: '설레는',
      level: 2,
    },
    {
      name: 'satisfied',
      label: '충만한',
      level: 2,
    },
    {
      name: 'shy',
      label: '수줍은',
      level: 2,
    },
  ],
  // [], // 감사한
  // [], // 편안한
  // [], // 후련한
  // [], // 추억하는
];

export const neutralFirstDepthEmotionsData: Prisma.EmotionsCreateInput[] = [
  // normal
  {
    name: 'ordinary',
    label: '평범한',
    level: 1,
  },
  {
    name: 'indifferent',
    label: '무관심한',
    level: 1,
  },
  // {
  //   name: 'worry',
  //   label: '고민되는',
  //   level: 1,
  // },
];

export const neutralSecondDepthEmotionsData: Prisma.EmotionsCreateInput[][] = [
  // normal
  [
    // 평범한
    {
      name: 'usual',
      label: '일상적인',
      level: 2,
    },
    {
      name: 'so-so',
      label: '그저그런',
      level: 2,
    },
    {
      name: 'composed',
      label: '담담한',
      level: 2,
    },
    {
      name: 'monotonous',
      label: '단조로운',
      level: 2,
    },
  ],
  [
    // 무관심한
    {
      name: 'mindless',
      label: '아무생각 없는',
      level: 2,
    },
    {
      name: 'dry',
      label: '무미건조한',
      level: 2,
    },
    {
      name: 'space-out',
      label: '멍때리는',
      level: 2,
    },
    {
      name: 'troublesome',
      label: '귀찮은',
      level: 2,
    },
  ],
];

export const firstDepthsEmotionsData: Prisma.EmotionsCreateInput[][] = [
  [...positiveFirstDepthEmotionsData],
  [...neutralFirstDepthEmotionsData],
];

export const secondDepthsEmotionsData: Prisma.EmotionsCreateInput[][][] = [
  [...positiveSecondDepthEmotionsData],
  [...neutralSecondDepthEmotionsData],
];
