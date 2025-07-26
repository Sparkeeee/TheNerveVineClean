// Migrate enhanced symptom content to the database
// Usage: npx ts-node src/scripts/migrateEnhancedSymptomContent.ts [--dry-run]
// - Only updates existing symptoms/variants (never creates or deletes)
// - Logs all actions; use --dry-run to preview changes
// - Run manually, never automatically

import { PrismaClient } from '@prisma/client';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const enhancedSymptomContent = require('../../enhanced-symptom-content.js');

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

async function main() {
  const dbSymptoms = await prisma.symptom.findMany();
  let updated = 0;
  let skipped = 0;

  for (const dbSymptom of dbSymptoms) {
    const slug = dbSymptom.slug;
    const staged = enhancedSymptomContent[slug];
    if (!staged) {
      console.log(`[SKIP] No staged content for symptom: ${slug}`);
      skipped++;
      continue;
    }
    
    // Main description
    if (Array.isArray(staged.mainDescription)) {
      const newDesc = staged.mainDescription.join('\n\n');
      if (dbSymptom.description !== newDesc) {
        console.log(`[UPDATE] Symptom: ${slug} main description`);
        if (!dryRun) {
          await prisma.symptom.update({
            where: { id: dbSymptom.id },
            data: { description: newDesc },
          });
        }
        updated++;
      }
    }
    
    // Variants - stored as JSON in the variants field
    if (staged.variants && dbSymptom.variants) {
      const currentVariants = dbSymptom.variants as any;
      const updatedVariants = { ...currentVariants };
      let variantsUpdated = false;
      
      for (const [variantName, variantContent] of Object.entries(staged.variants)) {
        if (Array.isArray(variantContent) && currentVariants[variantName]) {
          const newVariantDesc = variantContent.join('\n\n');
          if (currentVariants[variantName].paragraphs?.join('\n\n') !== newVariantDesc) {
            console.log(`[UPDATE] Variant: ${slug} - ${variantName}`);
            updatedVariants[variantName] = {
              ...currentVariants[variantName],
              paragraphs: variantContent
            };
            variantsUpdated = true;
            updated++;
          }
        } else {
          console.log(`[SKIP] No staged content for variant: ${slug} - ${variantName}`);
          skipped++;
        }
      }
      
      if (variantsUpdated && !dryRun) {
        await prisma.symptom.update({
          where: { id: dbSymptom.id },
          data: { variants: updatedVariants },
        });
      }
    }
  }
  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 