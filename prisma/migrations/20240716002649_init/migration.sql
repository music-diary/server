/*
  Warnings:

  - You are about to drop the column `profile_image_key` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image_url` on the `users` table. All the data in the column will be lost.
  - Made the column `user_id` on table `user_genres` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre_id` on table `user_genres` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "musics" ADD COLUMN     "selected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_genres" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "genre_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_image_key",
DROP COLUMN "profile_image_url";
