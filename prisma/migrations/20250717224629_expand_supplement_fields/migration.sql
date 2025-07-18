/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Supplement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Supplement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Supplement" ADD COLUMN "cardImageUrl" TEXT;
ALTER TABLE "Supplement" ADD COLUMN "cautions" TEXT;
ALTER TABLE "Supplement" ADD COLUMN "galleryImages" JSONB;
ALTER TABLE "Supplement" ADD COLUMN "heroImageUrl" TEXT;
ALTER TABLE "Supplement" ADD COLUMN "metaDescription" TEXT;
ALTER TABLE "Supplement" ADD COLUMN "metaTitle" TEXT;
ALTER TABLE "Supplement" ADD COLUMN "productFormulations" JSONB;
ALTER TABLE "Supplement" ADD COLUMN "references" JSONB;
ALTER TABLE "Supplement" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Supplement_name_key" ON "Supplement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplement_slug_key" ON "Supplement"("slug");
