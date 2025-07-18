/*
  Warnings:

  - You are about to drop the column `name` on the `Herb` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_HerbIndications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_HerbIndications_A_fkey" FOREIGN KEY ("A") REFERENCES "Herb" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HerbIndications_B_fkey" FOREIGN KEY ("B") REFERENCES "Symptom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Herb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commonName" TEXT,
    "latinName" TEXT,
    "slug" TEXT,
    "description" TEXT,
    "cautions" TEXT,
    "heroImageUrl" TEXT,
    "cardImageUrl" TEXT,
    "galleryImages" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "productFormulations" JSONB,
    "references" JSONB
);
INSERT INTO "new_Herb" ("commonName", "description", "id") SELECT "name", "description", "id" FROM "Herb";
DROP TABLE "Herb";
ALTER TABLE "new_Herb" RENAME TO "Herb";
CREATE UNIQUE INDEX "Herb_slug_key" ON "Herb"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_HerbIndications_AB_unique" ON "_HerbIndications"("A", "B");

-- CreateIndex
CREATE INDEX "_HerbIndications_B_index" ON "_HerbIndications"("B");
