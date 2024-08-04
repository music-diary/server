/*
  Warnings:

  - You are about to drop the column `editor` on the `musics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "musics" DROP COLUMN "editor",
ADD COLUMN     "editor_pick" VARCHAR(30);
