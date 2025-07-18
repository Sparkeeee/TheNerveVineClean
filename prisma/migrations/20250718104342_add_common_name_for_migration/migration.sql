/*
  Warnings:

  - You are about to drop the `_HerbIndications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HerbSymptoms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SymptomSupplements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `affiliatePercentage` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `customerReviews` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `formulation` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `herbId` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `organic` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `strength` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Symptom` table. All the data in the column will be lost.
  - Made the column `description` on table `Herb` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Supplement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `Symptom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Symptom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_HerbIndications_B_index";

-- DropIndex
DROP INDEX "_HerbIndications_AB_unique";

-- DropIndex
DROP INDEX "_HerbSymptoms_B_index";

-- DropIndex
DROP INDEX "_HerbSymptoms_AB_unique";

-- DropIndex
DROP INDEX "_SymptomSupplements_B_index";

-- DropIndex
DROP INDEX "_SymptomSupplements_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_HerbIndications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_HerbSymptoms";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SymptomSupplements";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Herb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "commonName" TEXT,
    "latinName" TEXT,
    "slug" TEXT,
    "description" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "heroImageUrl" TEXT,
    "cardImageUrl" TEXT,
    "galleryImages" JSONB,
    "cautions" TEXT,
    "productFormulations" JSONB,
    "references" JSONB,
    "indications" JSONB,
    "traditionalUses" JSONB
);
INSERT INTO "new_Herb" ("cardImageUrl", "cautions", "commonName", "description", "galleryImages", "heroImageUrl", "id", "latinName", "metaDescription", "metaTitle", "productFormulations", "references", "slug") SELECT "cardImageUrl", "cautions", "commonName", "description", "galleryImages", "heroImageUrl", "id", "latinName", "metaDescription", "metaTitle", "productFormulations", "references", "slug" FROM "Herb";
DROP TABLE "Herb";
ALTER TABLE "new_Herb" RENAME TO "Herb";
CREATE TABLE "new_Supplement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "heroImageUrl" TEXT,
    "cardImageUrl" TEXT,
    "galleryImages" JSONB,
    "cautions" TEXT,
    "productFormulations" JSONB,
    "references" JSONB,
    "tags" JSONB
);
INSERT INTO "new_Supplement" ("cardImageUrl", "cautions", "description", "galleryImages", "heroImageUrl", "id", "metaDescription", "metaTitle", "name", "productFormulations", "references", "slug") SELECT "cardImageUrl", "cautions", "description", "galleryImages", "heroImageUrl", "id", "metaDescription", "metaTitle", "name", "productFormulations", "references", "slug" FROM "Supplement";
DROP TABLE "Supplement";
ALTER TABLE "new_Supplement" RENAME TO "Supplement";
CREATE TABLE "new_Symptom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Symptom" ("description", "id") SELECT "description", "id" FROM "Symptom";
DROP TABLE "Symptom";
ALTER TABLE "new_Symptom" RENAME TO "Symptom";
CREATE UNIQUE INDEX "Symptom_slug_key" ON "Symptom"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
