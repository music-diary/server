import { Gender, Prisma, Role, UserStatus } from '@prisma/client';

const tgPhone = process.env.TG_PHONE_NUMBER;
const ssPhone = process.env.SS_PHONE_NUMBER;
if (!tgPhone || !ssPhone) {
  console.error(
    'Please set the TG_PHONE_NUMBER and SS_PHONE_NUMBER environment variables.',
  );
  process.exit(1);
}

export const userData: Prisma.UsersCreateInput = {
  phoneNumber: '+821012345678',
  name: 'User1',
  birthDay: new Date('1999-01-01'),
  gender: Gender.FEMALE,
  isGenreSuggested: true,
  isAgreedMarketing: true,
  role: Role.USER,
  status: UserStatus.ACTIVE,
};

export const adminUserData: Prisma.UsersCreateInput = {
  phoneNumber: '+821012341234',
  name: 'admin',
  birthDay: new Date('2000-02-02'),
  gender: Gender.FEMALE,
  isGenreSuggested: false,
  isAgreedMarketing: false,
  role: Role.ADMIN,
  status: UserStatus.ACTIVE,
};

export const tgUserData: Prisma.UsersCreateInput = {
  phoneNumber: tgPhone,
  name: '김태건01',
  birthDay: new Date('1999-09-09'),
  gender: Gender.MALE,
  isGenreSuggested: true,
  isAgreedMarketing: true,
  role: Role.USER,
  status: UserStatus.ACTIVE,
};

export const ssUserData: Prisma.UsersCreateInput = {
  phoneNumber: ssPhone,
  name: '이성수01',
  birthDay: new Date('1998-08-08'),
  gender: Gender.MALE,
  isGenreSuggested: true,
  isAgreedMarketing: false,
  role: Role.USER,
  status: UserStatus.ACTIVE,
};
