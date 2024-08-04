import { Prisma } from '@prisma/client';

export const withdrawalData: Prisma.WithdrawalReasonsCreateInput[] = [
  {
    name: 'NO_MUSIC',
    label: '음악 추천이 마음에 들지 않아요',
    order: 0,
  },
  {
    name: 'NO_DIARY',
    label: '더 이상 일기를 쓰지 않아요',
    order: 1,
  },
  {
    name: 'NO_APP',
    label: '앱 사용법을 모르겠어요',
    order: 2,
  },
  {
    name: 'NEW_ACCOUNT',
    label: '새로운 계정으로 다시 시작하고 싶어요',
    order: 3,
  },
  {
    name: 'OTHER',
    label: '기타',
    order: 4,
  },
];
