import { Prisma } from '@prisma/client';

export const musicsData: Prisma.MusicsCreateInput[] = [
  {
    songId: '99999999',
    title: '밤양갱',
    artist: '비비',
    albumUrl: undefined,
    selectedLyric: '선택된 가사',
    lyric: '전체 가사',
  },
];
