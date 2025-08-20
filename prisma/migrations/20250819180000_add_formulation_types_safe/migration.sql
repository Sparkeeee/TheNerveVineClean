-- CreateFormulationType
CREATE TABLE "FormulationType" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "category" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns to QualitySpecification (without dropping existing ones)
ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "herbId" INTEGER;
ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "supplementId" INTEGER;
ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "formulationTypeId" INTEGER;
ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "standardised" BOOLEAN DEFAULT false;
ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "customSpecs" TEXT;
ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Create indexes
CREATE INDEX IF NOT EXISTS "QualitySpecification_herbId_idx" ON "QualitySpecification"("herbId");
CREATE INDEX IF NOT EXISTS "QualitySpecification_supplementId_idx" ON "QualitySpecification"("supplementId");
CREATE INDEX IF NOT EXISTS "QualitySpecification_formulationTypeId_idx" ON "QualitySpecification"("formulationTypeId");

-- Add foreign key constraints
ALTER TABLE "QualitySpecification" 
ADD CONSTRAINT "QualitySpecification_formulationTypeId_fkey" 
FOREIGN KEY ("formulationTypeId") REFERENCES "FormulationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "QualitySpecification" 
ADD CONSTRAINT "QualitySpecification_herbId_fkey" 
FOREIGN KEY ("herbId") REFERENCES "Herb"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "QualitySpecification" 
ADD CONSTRAINT "QualitySpecification_supplementId_fkey" 
FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
