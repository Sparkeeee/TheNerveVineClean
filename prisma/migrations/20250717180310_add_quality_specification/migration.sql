-- CreateTable
CREATE TABLE "Herb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Supplement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organic" BOOLEAN NOT NULL DEFAULT false,
    "strength" TEXT,
    "formulation" TEXT,
    "affiliatePercentage" REAL,
    "customerReviews" INTEGER,
    "herbId" INTEGER,
    CONSTRAINT "Supplement_herbId_fkey" FOREIGN KEY ("herbId") REFERENCES "Herb" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT
);

-- CreateTable
CREATE TABLE "QualitySpecification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "herbSlug" TEXT NOT NULL,
    "herbName" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "requiredTerms" JSONB NOT NULL,
    "preferredTerms" JSONB NOT NULL,
    "avoidTerms" JSONB NOT NULL,
    "standardization" JSONB,
    "alcoholSpecs" JSONB,
    "dosageSpecs" JSONB,
    "priceRange" JSONB NOT NULL,
    "ratingThreshold" REAL NOT NULL,
    "reviewCountThreshold" INTEGER NOT NULL,
    "brandPreferences" JSONB,
    "brandAvoid" JSONB
);

-- CreateTable
CREATE TABLE "_HerbSymptoms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_HerbSymptoms_A_fkey" FOREIGN KEY ("A") REFERENCES "Herb" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HerbSymptoms_B_fkey" FOREIGN KEY ("B") REFERENCES "Symptom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SymptomSupplements" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SymptomSupplements_A_fkey" FOREIGN KEY ("A") REFERENCES "Supplement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SymptomSupplements_B_fkey" FOREIGN KEY ("B") REFERENCES "Symptom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Herb_name_key" ON "Herb"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_name_key" ON "Symptom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_HerbSymptoms_AB_unique" ON "_HerbSymptoms"("A", "B");

-- CreateIndex
CREATE INDEX "_HerbSymptoms_B_index" ON "_HerbSymptoms"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SymptomSupplements_AB_unique" ON "_SymptomSupplements"("A", "B");

-- CreateIndex
CREATE INDEX "_SymptomSupplements_B_index" ON "_SymptomSupplements"("B");
