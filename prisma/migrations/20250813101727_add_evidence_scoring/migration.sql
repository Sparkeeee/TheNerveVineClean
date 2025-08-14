-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "price" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Symptom" ADD COLUMN     "commonSymptoms" TEXT[],
ADD COLUMN     "herbs" JSONB,
ADD COLUMN     "supplements" JSONB;

-- AlterTable
ALTER TABLE "public"."SymptomVariant" ADD COLUMN     "commonSymptoms" TEXT[];

-- CreateTable
CREATE TABLE "public"."HerbIndicationScore" (
    "id" SERIAL NOT NULL,
    "herbId" INTEGER NOT NULL,
    "indicationId" INTEGER NOT NULL,
    "traditionalScore" SMALLINT NOT NULL,
    "researchScore" SMALLINT NOT NULL,
    "totalScore" DECIMAL(3,1) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HerbIndicationScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HerbIndicationScore_indicationId_totalScore_idx" ON "public"."HerbIndicationScore"("indicationId", "totalScore" DESC);

-- CreateIndex
CREATE INDEX "HerbIndicationScore_herbId_idx" ON "public"."HerbIndicationScore"("herbId");

-- CreateIndex
CREATE UNIQUE INDEX "HerbIndicationScore_herbId_indicationId_key" ON "public"."HerbIndicationScore"("herbId", "indicationId");

-- AddForeignKey
ALTER TABLE "public"."HerbIndicationScore" ADD CONSTRAINT "HerbIndicationScore_herbId_fkey" FOREIGN KEY ("herbId") REFERENCES "public"."Herb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HerbIndicationScore" ADD CONSTRAINT "HerbIndicationScore_indicationId_fkey" FOREIGN KEY ("indicationId") REFERENCES "public"."Indication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
