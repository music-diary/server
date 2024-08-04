-- DropIndex
DROP INDEX "DiaryTopics_id_diary_id_topic_id_idx";

-- DropIndex
DROP INDEX "emotions_id_parent_id_level_idx";

-- DropIndex
DROP INDEX "genres_id_name_idx";

-- AlterTable
ALTER TABLE "diaries" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "DiaryTopics_id_diary_id_topic_id_music_id_idx" ON "DiaryTopics"("id", "diary_id", "topic_id", "music_id");

-- CreateIndex
CREATE INDEX "emotions_id_parent_id_root_id_idx" ON "emotions"("id", "parent_id", "root_id");

-- CreateIndex
CREATE INDEX "genres_id_name_label_idx" ON "genres"("id", "name", "label");
