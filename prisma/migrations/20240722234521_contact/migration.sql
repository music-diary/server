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

-- CreateIndex
CREATE INDEX "contact_history_id_idx" ON "contact_history"("id");

-- CreateIndex
CREATE INDEX "contact_types_id_idx" ON "contact_types"("id");

-- AddForeignKey
ALTER TABLE "contact_history" ADD CONSTRAINT "contact_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_history" ADD CONSTRAINT "contact_history_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "contact_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
