/*
  Warnings:

  - Added the required column `user_id` to the `DiaryEmotions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `DiaryTopics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiaryEmotions" ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "DiaryTopics" ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
