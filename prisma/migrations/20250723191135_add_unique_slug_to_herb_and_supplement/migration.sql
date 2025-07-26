/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Herb` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Supplement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Symptom" ADD COLUMN     "articles" JSONB,
ADD COLUMN     "associatedSymptoms" JSONB,
ADD COLUMN     "cautions" TEXT,
ADD COLUMN     "variants" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Herb_slug_key" ON "Herb"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Supplement_slug_key" ON "Supplement"("slug");
