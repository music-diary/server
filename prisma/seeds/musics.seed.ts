import { Prisma } from '@prisma/client';

export const musicsData: Prisma.MusicsCreateInput[] = [
  {
    title: '밤양갱',
    artist: '비비',
    album: '앨범명',
    albumImageUrl: undefined,
    selectedLyrics: '선택된 가사',
    fullLyrics: '전체 가사',
  },
];
