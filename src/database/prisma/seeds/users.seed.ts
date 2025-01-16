import { Gender, Prisma, Role, UserStatus } from '@prisma/client';

export const userData: Prisma.UsersCreateInput = {
  id: '1ea6b340-a8a7-480c-b81a-b9a20a9e53f9',
  phoneNumber: '+821012345678',
  name: 'User1',
  birthDay: new Date('1999-01-01'),
  gender: Gender.FEMALE,
  isGenreSuggested: true,
  isAgreedMarketing: true,
  role: Role.USER,
  status: UserStatus.ACTIVE,
};

export const sponsorData: Prisma.UsersCreateInput = {
  id: 'b5bea5de-4f08-4d4d-8d0d-a74326d708e2',
  phoneNumber: '+821011111111',
  name: 'Sponsor',
  birthDay: new Date('2011-11-11'),
  gender: Gender.FEMALE,
  isGenreSuggested: false,
  isAgreedMarketing: false,
  role: Role.SPONSOR,
  status: UserStatus.ACTIVE,
};

export const adminUserData: Prisma.UsersCreateInput = {
  id: '6f518d45-f394-427d-a847-c6804195e92b',
  phoneNumber: '+821012341234',
  name: 'admin',
  birthDay: new Date('2000-02-02'),
  gender: Gender.FEMALE,
  isGenreSuggested: false,
  isAgreedMarketing: false,
  role: Role.ADMIN,
  status: UserStatus.ACTIVE,
};
