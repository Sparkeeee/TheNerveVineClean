/*
  Warnings:

  - You are about to drop the column `variantDescriptions` on the `Symptom` table. All the data in the column will be lost.
  - You are about to drop the column `variants` on the `Symptom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "variantDescriptions",
DROP COLUMN "variants";

-- CreateTable
CREATE TABLE "SymptomVariant" (
    "id" SERIAL NOT NULL,
    "parentSymptomId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "cautions" TEXT,
    "references" JSONB,

    CONSTRAINT "SymptomVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VariantHerbs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VariantHerbs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VariantSupplements" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VariantSupplements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SymptomVariant_slug_key" ON "SymptomVariant"("slug");

-- CreateIndex
CREATE INDEX "SymptomVariant_parentSymptomId_idx" ON "SymptomVariant"("parentSymptomId");

-- CreateIndex
CREATE INDEX "_VariantHerbs_B_index" ON "_VariantHerbs"("B");

-- CreateIndex
CREATE INDEX "_VariantSupplements_B_index" ON "_VariantSupplements"("B");

-- AddForeignKey
ALTER TABLE "SymptomVariant" ADD CONSTRAINT "SymptomVariant_parentSymptomId_fkey" FOREIGN KEY ("parentSymptomId") REFERENCES "Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantHerbs" ADD CONSTRAINT "_VariantHerbs_A_fkey" FOREIGN KEY ("A") REFERENCES "Herb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantHerbs" ADD CONSTRAINT "_VariantHerbs_B_fkey" FOREIGN KEY ("B") REFERENCES "SymptomVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantSupplements" ADD CONSTRAINT "_VariantSupplements_A_fkey" FOREIGN KEY ("A") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantSupplements" ADD CONSTRAINT "_VariantSupplements_B_fkey" FOREIGN KEY ("B") REFERENCES "SymptomVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
