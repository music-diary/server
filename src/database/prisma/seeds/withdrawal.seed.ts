import { Prisma } from '@prisma/client';

export const withdrawalData: Prisma.WithdrawalReasonsCreateInput[] = [
  {
    id: 'c930be78-8a38-473b-b144-e04e068895e4',
    name: 'NO_MUSIC',
    label: '음악 추천이 마음에 들지 않아요',
    order: 0,
  },
  {
    id: 'a9c0eb91-ece5-4dbf-ab4b-476853c19dc0',
    name: 'NO_DIARY',
    label: '더 이상 일기를 쓰지 않아요',
    order: 1,
  },
  {
    id: '1fd90ce8-0fc9-46cd-85cf-7ed758e9baa5',
    name: 'NO_APP',
    label: '앱 사용법을 모르겠어요',
    order: 2,
  },
  {
    id: '333cec43-cb69-40f4-b661-3f31e42d4000',
    name: 'NEW_ACCOUNT',
    label: '새로운 계정으로 다시 시작하고 싶어요',
    order: 3,
  },
  {
    id: '839f5088-9a65-42ae-9f3a-20ba57455fae',
    name: 'OTHER',
    label: '기타',
    order: 4,
  },
];
