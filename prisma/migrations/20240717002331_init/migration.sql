-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVE');

-- CreateEnum
CREATE TYPE "DiariesStatus" AS ENUM ('EDIT', 'PENDING', 'DONE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone_number" TEXT NOT NULL,
    "name" VARCHAR(6) NOT NULL,
    "birth_day" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'FEMALE',
    "is_genre_suggested" BOOLEAN NOT NULL,
    "is_agreed_marketing" BOOLEAN NOT NULL,
    "use_limit_count" INTEGER NOT NULL DEFAULT 1,
    "is_agreed_diary_alarm" BOOLEAN NOT NULL DEFAULT false,
    "diary_alarm_time" TIME(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "color" VARCHAR(10) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_genres" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "genre_id" UUID NOT NULL,

    CONSTRAINT "user_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diaries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(30),
    "content" VARCHAR(500),
    "template_id" UUID,
    "status" "DiariesStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emotions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(30) NOT NULL,
    "label" VARCHAR(30) NOT NULL,
    "parent_id" UUID,
    "level" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "emotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryEmotions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "diary_id" UUID NOT NULL,
    "emotion_id" UUID NOT NULL,
    "musicsId" UUID,

    CONSTRAINT "DiaryEmotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "emoji" VARCHAR(10),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryTopics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "diary_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "musicsId" UUID,

    CONSTRAINT "DiaryTopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_contents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "content" VARCHAR(200),
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" VARCHAR(20) NOT NULL,
    "label" VARCHAR(50) NOT NULL,

    CONSTRAINT "template_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "song_id" VARCHAR(20) NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "artist" VARCHAR(80) NOT NULL,
    "album_url" VARCHAR(255),
    "selected_lyric" VARCHAR(1000),
    "lyrics" VARCHAR(65535),
    "original_genre" VARCHAR(30),
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID,
    "diary_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "genres_id_name_idx" ON "genres"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_genres_id_key" ON "user_genres"("id");

-- CreateIndex
CREATE INDEX "user_genres_id_user_id_genre_id_idx" ON "user_genres"("id", "user_id", "genre_id");

-- CreateIndex
CREATE INDEX "diaries_id_user_id_template_id_idx" ON "diaries"("id", "user_id", "template_id");

-- CreateIndex
CREATE INDEX "emotions_id_parent_id_level_idx" ON "emotions"("id", "parent_id", "level");

-- CreateIndex
CREATE INDEX "DiaryEmotions_id_diary_id_emotion_id_idx" ON "DiaryEmotions"("id", "diary_id", "emotion_id");

-- CreateIndex
CREATE INDEX "topics_id_idx" ON "topics"("id");

-- CreateIndex
CREATE INDEX "DiaryTopics_id_diary_id_topic_id_idx" ON "DiaryTopics"("id", "diary_id", "topic_id");

-- CreateIndex
CREATE INDEX "templates_id_idx" ON "templates"("id");

-- CreateIndex
CREATE INDEX "template_contents_id_template_id_idx" ON "template_contents"("id", "template_id");

-- CreateIndex
CREATE INDEX "musics_id_user_id_diary_id_idx" ON "musics"("id", "user_id", "diary_id");

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emotions" ADD CONSTRAINT "emotions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "emotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "emotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_contents" ADD CONSTRAINT "template_contents_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
