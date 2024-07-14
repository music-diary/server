/*
  Warnings:

  - You are about to alter the column `content` on the `diaries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1500)` to `VarChar(500)`.
  - You are about to drop the column `templateContent` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiaryEmotions" ADD COLUMN     "musicsId" TEXT;

-- AlterTable
ALTER TABLE "DiaryTopics" ADD COLUMN     "musicsId" TEXT;

-- AlterTable
ALTER TABLE "diaries" ALTER COLUMN "content" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "emotions" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "genres" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "templateContent",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "diary_alarm_time" TIME(3),
ADD COLUMN     "is_agreed_diary_alarm" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "template_contents" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "content" VARCHAR(200),
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" VARCHAR(20) NOT NULL,
    "label" VARCHAR(50) NOT NULL,

    CONSTRAINT "template_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryMusic" (
    "id" TEXT NOT NULL,
    "diary_id" TEXT NOT NULL,
    "mucsic_id" TEXT NOT NULL,

    CONSTRAINT "DiaryMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musics" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "artist" VARCHAR(80) NOT NULL,
    "album" VARCHAR(80),
    "album_image_url" VARCHAR(255),
    "selected_lyrics" VARCHAR(1000),
    "full_lyrics" VARCHAR(65535),
    "user_id" TEXT,
    "diary_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_contents_id_template_id_idx" ON "template_contents"("id", "template_id");

-- CreateIndex
CREATE INDEX "DiaryMusic_id_diary_id_mucsic_id_idx" ON "DiaryMusic"("id", "diary_id", "mucsic_id");

-- CreateIndex
CREATE INDEX "musics_id_user_id_diary_id_idx" ON "musics"("id", "user_id", "diary_id");

-- AddForeignKey
ALTER TABLE "template_contents" ADD CONSTRAINT "template_contents_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryMusic" ADD CONSTRAINT "DiaryMusic_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryMusic" ADD CONSTRAINT "DiaryMusic_mucsic_id_fkey" FOREIGN KEY ("mucsic_id") REFERENCES "musics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
