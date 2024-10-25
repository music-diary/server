-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "birth_day" DROP NOT NULL,
ALTER COLUMN "is_genre_suggested" DROP NOT NULL,
ALTER COLUMN "is_agreed_marketing" DROP NOT NULL;
