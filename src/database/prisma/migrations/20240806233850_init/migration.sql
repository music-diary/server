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
    "birth_day" DATE NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'FEMALE',
    "is_genre_suggested" BOOLEAN NOT NULL,
    "is_agreed_marketing" BOOLEAN NOT NULL,
    "use_limit_count" INTEGER NOT NULL DEFAULT 1,
    "is_agreed_diary_alarm" BOOLEAN NOT NULL DEFAULT false,
    "diary_alarm_time" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "withdrawals_id" UUID,
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
CREATE TABLE "diaries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(30),
    "content" VARCHAR(500),
    "template_id" UUID,
    "status" "DiariesStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "diaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emotions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(30) NOT NULL,
    "label" VARCHAR(30) NOT NULL,
    "parent_id" UUID,
    "root_id" UUID,
    "level" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "ai_scale" INTEGER,

    CONSTRAINT "emotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryEmotions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "diary_id" UUID NOT NULL,
    "emotion_id" UUID NOT NULL,
    "music_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
    "user_id" UUID NOT NULL,
    "diary_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "music_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiaryTopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_example" BOOLEAN NOT NULL DEFAULT false,

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
    "youtube_url" VARCHAR(255),
    "editor_pick" VARCHAR(30),
    "user_id" UUID,
    "diary_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdraws" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "withdrawal_reasons_id" UUID,
    "content" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdraws_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdraws_reasons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(30) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "withdraws_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type_id" UUID NOT NULL,
    "content" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(30) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "contact_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserGenres" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "genres_id_name_label_idx" ON "genres"("id", "name", "label");

-- CreateIndex
CREATE INDEX "diaries_id_user_id_template_id_idx" ON "diaries"("id", "user_id", "template_id");

-- CreateIndex
CREATE INDEX "emotions_id_parent_id_root_id_idx" ON "emotions"("id", "parent_id", "root_id");

-- CreateIndex
CREATE INDEX "DiaryEmotions_id_diary_id_emotion_id_idx" ON "DiaryEmotions"("id", "diary_id", "emotion_id");

-- CreateIndex
CREATE INDEX "topics_id_idx" ON "topics"("id");

-- CreateIndex
CREATE INDEX "DiaryTopics_id_diary_id_topic_id_music_id_idx" ON "DiaryTopics"("id", "diary_id", "topic_id", "music_id");

-- CreateIndex
CREATE INDEX "templates_id_idx" ON "templates"("id");

-- CreateIndex
CREATE INDEX "template_contents_id_template_id_idx" ON "template_contents"("id", "template_id");

-- CreateIndex
CREATE INDEX "musics_id_user_id_diary_id_idx" ON "musics"("id", "user_id", "diary_id");

-- CreateIndex
CREATE INDEX "withdraws_id_withdrawal_reasons_id_idx" ON "withdraws"("id", "withdrawal_reasons_id");

-- CreateIndex
CREATE INDEX "withdraws_reasons_id_idx" ON "withdraws_reasons"("id");

-- CreateIndex
CREATE INDEX "contact_history_id_idx" ON "contact_history"("id");

-- CreateIndex
CREATE INDEX "contact_types_id_idx" ON "contact_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserGenres_AB_unique" ON "_UserGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_UserGenres_B_index" ON "_UserGenres"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_withdrawals_id_fkey" FOREIGN KEY ("withdrawals_id") REFERENCES "withdraws"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emotions" ADD CONSTRAINT "emotions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "emotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_emotion_id_fkey" FOREIGN KEY ("emotion_id") REFERENCES "emotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEmotions" ADD CONSTRAINT "DiaryEmotions_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "musics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryTopics" ADD CONSTRAINT "DiaryTopics_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "musics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_contents" ADD CONSTRAINT "template_contents_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_diary_id_fkey" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_withdrawal_reasons_id_fkey" FOREIGN KEY ("withdrawal_reasons_id") REFERENCES "withdraws_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_history" ADD CONSTRAINT "contact_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_history" ADD CONSTRAINT "contact_history_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "contact_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGenres" ADD CONSTRAINT "_UserGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGenres" ADD CONSTRAINT "_UserGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
