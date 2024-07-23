import { Prisma } from '@prisma/client';

export const contactTypesData: Prisma.ContactTypesCreateInput[] = [
  {
    name: 'APP_ERROR',
    label: '앱에 오류가 있어요',
    order: 0,
  },
  {
    name: 'NO_MUSIC',
    label: '음악 추천이 마음에 들지 않아요',
    order: 1,
  },
  {
    name: 'RESTORE_FRIENDS',
    label: '친구 목록을 복구하고 싶어요',
    order: 2,
  },
  {
    name: 'RESTORE_DIARY',
    label: '일기 데이터를 복구하고 싶어요',
    order: 3,
  },
  {
    name: 'OTHER',
    label: '기타',
    order: 4,
  },
];
