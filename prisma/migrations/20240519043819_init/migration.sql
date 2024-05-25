-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVE');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" CHAR(6) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'FEMALE',
    "isGenreSuggested" BOOLEAN NOT NULL,
    "isAgreedMarketing" BOOLEAN NOT NULL,
    "profileImageKey" TEXT,
    "profileImageUrl" TEXT,
    "isAvailableFriendLetter" BOOLEAN NOT NULL DEFAULT false,
    "useLimitCount" INTEGER NOT NULL DEFAULT 1,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_account_key" ON "Users"("account");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "Users"("phoneNumber");
