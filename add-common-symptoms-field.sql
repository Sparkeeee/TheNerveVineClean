-- Add commonSymptoms JSON field to SymptomVariant table
-- This will store the symptom bullet points in the database instead of hardcoded

ALTER TABLE "SymptomVariant" ADD COLUMN "commonSymptoms" TEXT[];

-- Also add to main Symptom table for symptoms without variants
ALTER TABLE "Symptom" ADD COLUMN "commonSymptoms" TEXT[];
