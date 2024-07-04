import { Prisma } from '@prisma/client';

export const usersData: Prisma.UsersCreateInput[] = [
  // {
  //   phoneNumber: '+8201012345678',
  //   name: 'User1',
  //   birthDay: new Date('1999-01-01'),
  //   gender: Gender.FEMALE,
  //   isGenreSuggested: true,
  //   isAgreedMarketing: true,
  //   role: Role.USER,
  //   status: UserStatus.ACTIVE,
  // },
  {
    // id: '73370903-3d83-42f0-a634-9683f6ad1ab8',
    phoneNumber: '+8201042334716',
    name: '이성수',
    birthDay: new Date('1996-06-30'),
    gender: 'FEMALE',
    isGenreSuggested: true,
    isAgreedMarketing: true,
    createdAt: new Date('2024-06-24 15:01:43.535'),
    updatedAt: new Date('2024-06-24 15:01:43.535'),
  },
  {
    // id: '49b73a66-0572-4d47-8f53-defa791ab9e0',
    phoneNumber: '+8201042334716',
    name: '이성수',
    birthDay: new Date('1996-06-30'),
    gender: 'FEMALE',
    isGenreSuggested: false,
    isAgreedMarketing: false,
    createdAt: new Date('2024-06-25 01:51:23.390'),
    updatedAt: new Date('2024-06-25 01:51:23.390'),
  },
];
