/*
  Warnings:

  - The `diary_alarm_time` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "birth_day" SET DATA TYPE DATE,
DROP COLUMN "diary_alarm_time",
ADD COLUMN     "diary_alarm_time" DATE;
