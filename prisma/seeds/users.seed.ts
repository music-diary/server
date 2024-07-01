import { Gender, Prisma, Role, UserStatus } from '@prisma/client';

export const usersData: Prisma.UsersCreateInput[] = [
  {
    phoneNumber: '+8201012345678',
    name: 'User1',
    birthDay: new Date('1999-01-01'),
    gender: Gender.FEMALE,
    isGenreSuggested: true,
    isAgreedMarketing: true,
    role: Role.USER,
    status: UserStatus.ACTIVE,
  },
];
