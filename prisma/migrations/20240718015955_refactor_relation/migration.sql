/*
  Warnings:

  - You are about to drop the column `musicsId` on the `DiaryEmotions` table. All the data in the column will be lost.
  - You are about to drop the column `musicsId` on the `DiaryTopics` table. All the data in the column will be lost.
  - You are about to drop the `user_genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_genres" DROP CONSTRAINT "user_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "user_genres" DROP CONSTRAINT "user_genres_user_id_fkey";

-- AlterTable
ALTER TABLE "DiaryEmotions" DROP COLUMN "musicsId",
ADD COLUMN     "music_id" UUID;

-- AlterTable
ALTER TABLE "DiaryTopics" DROP COLUMN "musicsId",
ADD COLUMN     "music_id" UUID;

-- DropTable
DROP TABLE "user_genres";

-- CreateTable
CREATE TABLE "_UserGenres" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserGenres_AB_unique" ON "_UserGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_UserGenres_B_index" ON "_UserGenres"("B");

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "musics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "musics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGenres" ADD CONSTRAINT "_UserGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGenres" ADD CONSTRAINT "_UserGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
