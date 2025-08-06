-- AlterTable
ALTER TABLE "public"."QualitySpecification" ADD COLUMN     "approach" TEXT DEFAULT 'traditional',
ADD COLUMN     "formulationName" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "supplementName" TEXT,
ADD COLUMN     "supplementSlug" TEXT,
ALTER COLUMN "herbSlug" DROP NOT NULL,
ALTER COLUMN "herbName" DROP NOT NULL;
