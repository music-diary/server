import { Prisma } from '@prisma/client';

// 분석용 감정은 영어, UI 표시용 감정은 한글로 저장
// mock example data (positive emotions)
export const basicEmotionsData: Prisma.EmotionsCreateInput[] = [
  {
    name: '긍정', // 좋았어요
  },
];

export const positiveFirstDepthEmotionsData: Prisma.EmotionsCreateInput[] = [
  {
    name: '행복한',
  },
  {
    name: '기대하는',
  },
  {
    name: '감사한',
  },
  {
    name: '편안한',
  },
  {
    name: '후련한',
  },
  {
    name: '추억하는',
  },
];

export const positiveSecondDepthEmotionsData: Prisma.EmotionsCreateInput[][] = [
  [
    // 행복한
    {
      name: '반가운',
    },
    {
      name: '즐거운',
    },
    {
      name: '신나는',
    },
    {
      name: '발랄한',
    },
    {
      name: '설레는',
    },
    {
      name: '아름다운',
    },
  ],
  [
    // 기대하는
    {
      name: '의욕적인',
    },
    {
      name: '뿌듯한',
    },
    {
      name: '희망찬',
    },
    {
      name: '설레는',
    },
    {
      name: '충만한',
    },
    {
      name: '수줍은',
    },
  ],
  [], // 감사한
  [], // 편안한
  [], // 후련한
  [], // 추억하는
];
