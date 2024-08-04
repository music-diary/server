-- AlterTable
ALTER TABLE "users" ADD COLUMN     "withdrawals_id" UUID;

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

-- CreateIndex
CREATE INDEX "withdraws_id_withdrawal_reasons_id_idx" ON "withdraws"("id", "withdrawal_reasons_id");

-- CreateIndex
CREATE INDEX "withdraws_reasons_id_idx" ON "withdraws_reasons"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_withdrawals_id_fkey" FOREIGN KEY ("withdrawals_id") REFERENCES "withdraws"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_withdrawal_reasons_id_fkey" FOREIGN KEY ("withdrawal_reasons_id") REFERENCES "withdraws_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
