-- CreateTable
CREATE TABLE "Herb" (
    "id" SERIAL NOT NULL,
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
    "traditionalUses" JSONB,

    CONSTRAINT "Herb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplement" (
    "id" SERIAL NOT NULL,
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
    "tags" JSONB,

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNote" TEXT,

    CONSTRAINT "BlogPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualitySpecification" (
    "id" SERIAL NOT NULL,
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
    "ratingThreshold" DOUBLE PRECISION NOT NULL,
    "reviewCountThreshold" INTEGER NOT NULL,
    "brandPreferences" JSONB,
    "brandAvoid" JSONB,

    CONSTRAINT "QualitySpecification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_slug_key" ON "Symptom"("slug");
