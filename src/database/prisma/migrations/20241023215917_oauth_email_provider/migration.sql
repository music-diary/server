-- CreateEnum
CREATE TYPE "ProviderTypes" AS ENUM ('LOCAL', 'APPLE', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT,
ADD COLUMN     "provider_id" TEXT,
ADD COLUMN     "provider_type" "ProviderTypes" NOT NULL DEFAULT 'LOCAL';
