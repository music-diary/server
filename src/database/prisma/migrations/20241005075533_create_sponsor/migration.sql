-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SPONSOR';

-- CreateTable
CREATE TABLE "sponsors" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sponsors_id_phoneNumber_idx" ON "sponsors"("id", "phoneNumber");
