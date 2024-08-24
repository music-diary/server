/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `contact_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `emotions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `genres` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `topics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `withdraws_reasons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contact_types_name_key" ON "contact_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "emotions_name_key" ON "emotions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "withdraws_reasons_name_key" ON "withdraws_reasons"("name");
