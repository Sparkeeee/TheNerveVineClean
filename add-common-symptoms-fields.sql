-- Safe migration to add commonSymptoms fields
-- This script adds the missing commonSymptoms fields without affecting existing data

-- Add commonSymptoms field to Symptom table
ALTER TABLE "public"."Symptom" 
ADD COLUMN "commonSymptoms" TEXT[] DEFAULT '{}';

-- Add commonSymptoms field to SymptomVariant table  
ALTER TABLE "public"."SymptomVariant" 
ADD COLUMN "commonSymptoms" TEXT[] DEFAULT '{}';

-- Verify the changes
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('Symptom', 'SymptomVariant') 
AND column_name = 'commonSymptoms'
ORDER BY table_name, column_name;
