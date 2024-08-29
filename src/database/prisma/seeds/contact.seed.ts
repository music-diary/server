import { Prisma } from '@prisma/client';

export const contactTypesData: Prisma.ContactTypesCreateInput[] = [
  {
    id: '1c9072a2-5564-4cdb-8846-930a3c499abe',
    name: 'APP_ERROR',
    label: '앱에 오류가 있어요',
    order: 0,
  },
  {
    id: '2b88d5aa-7910-4e44-81ea-6a36331cfbf1',
    name: 'NO_MUSIC',
    label: '음악 추천이 마음에 들지 않아요',
    order: 1,
  },
  {
    id: 'c31c5595-e13a-4fb2-91b5-d41d658877da',
    name: 'RESTORE_DIARY',
    label: '일기 데이터를 복구하고 싶어요',
    order: 2,
  },
  {
    id: '432cc60e-aeff-4d1b-a3d2-b1f453b91305',
    name: 'OTHER',
    label: '기타',
    order: 3,
  },
];
