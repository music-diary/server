import { Prisma } from '@prisma/client';

export const genresData: Prisma.GenresCreateInput[] = [
  {
    label: '발라드',
    name: 'ballade',
    color: '#FFD700',
    order: 0,
  },
  {
    label: '댄스',
    name: 'dance',
    color: '#FF69B4',
    order: 1,
  },
  {
    label: '랩/힙합',
    name: 'hip-hop',
    color: '#FF4500',
    order: 2,
  },
  {
    label: 'R&B',
    name: 'rnb',
    color: '#FF1493',
    order: 3,
  },
  {
    label: '인디',
    name: 'indie',
    color: '#0099FF',
    order: 4,
  },
  {
    label: '록/메탈',
    name: 'rock',
    color: '#FF3BAB',
    order: 5,
  },
  {
    label: 'POP',
    name: 'pop',
    color: '#7850F8',
    order: 6,
  },
  {
    label: '뉴에이지',
    name: 'new-age',
    color: '#00FF00',
    order: 7,
  },
  {
    label: '포크/블루스',
    name: 'fork',
    color: '#FF0000',
    order: 8,
  },
  {
    label: '일렉트로니카',
    name: 'electronica',
    color: '#FF00FF',
    order: 9,
  },
  {
    label: 'OST',
    name: 'ost',
    color: '#00FFFF',
    order: 10,
  },
  {
    label: '재즈',
    name: 'jazz',
    color: '#FF6347',
    order: 11,
  },
  {
    label: 'J-pop',
    name: 'j-pop',
    color: '#FFA500',
    order: 12,
  },
];
