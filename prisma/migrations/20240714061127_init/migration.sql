/*
  Warnings:

  - You are about to drop the column `album_image_url` on the `musics` table. All the data in the column will be lost.
  - You are about to drop the column `full_lyrics` on the `musics` table. All the data in the column will be lost.
  - You are about to drop the column `selected_lyrics` on the `musics` table. All the data in the column will be lost.
  - Added the required column `song_id` to the `musics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "musics" DROP COLUMN "album_image_url",
DROP COLUMN "full_lyrics",
DROP COLUMN "selected_lyrics",
ADD COLUMN     "album_url" VARCHAR(255),
ADD COLUMN     "lyrics" VARCHAR(65535),
ADD COLUMN     "original_genre" VARCHAR(30),
ADD COLUMN     "selected_lyric" VARCHAR(1000),
ADD COLUMN     "song_id" VARCHAR(20) NOT NULL;
