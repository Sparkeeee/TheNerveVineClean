import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VariantContent {
  paragraphs?: string[];
  productFormulations?: any[];
  cautions?: string;
}

interface VariantDescriptions {
  [variantName: string]: string; // variant name -> description
}

async function migrateVariantContent() {
  console.log('🔄 Migrating variant content to new structure...\n');

  try {
    // Get all symptoms
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        variants: true
      }
    });

    console.log(`📊 Found ${symptoms.length} symptoms to process\n`);

    let updatedCount = 0;
    const results = [];

    for (const symptom of symptoms) {
      console.log(`\n🔍 Processing: ${symptom.title} (${symptom.slug})`);
      
      const variants = symptom.variants as Record<string, VariantContent> | null;
      let newDescription = symptom.description || '';
      let variantDescriptions: VariantDescriptions = {};

      if (!variants || Object.keys(variants).length === 0) {
        // No variants - keep current description
        console.log(`  • No variants found - keeping current description`);
        results.push({
          symptom: symptom.title,
          action: 'no_change',
          reason: 'no_variants'
        });
        continue;
      }

      // Process each variant
      for (const [variantName, variantContent] of Object.entries(variants)) {
        if (variantContent && variantContent.paragraphs && Array.isArray(variantContent.paragraphs)) {
          // Convert paragraphs array to single description string
          const variantDescription = variantContent.paragraphs.join(' ');
          variantDescriptions[variantName] = variantDescription;
          
          console.log(`  • Variant "${variantName}": ${variantDescription.substring(0, 100)}...`);
          
          // If this is the "Default" variant, use it for main description
          if (variantName === 'Default') {
            newDescription = variantDescription;
            console.log(`  • Set main description from Default variant`);
          }
        }
      }

      // Update the symptom
      await prisma.symptom.update({
        where: { id: symptom.id },
        data: {
          description: newDescription,
          variantDescriptions: variantDescriptions
        }
      });

      updatedCount++;
      results.push({
        symptom: symptom.title,
        action: 'updated',
        descriptionLength: newDescription.length,
        variantCount: Object.keys(variantDescriptions).length
      });

      console.log(`  ✅ Updated with ${Object.keys(variantDescriptions).length} variants`);
    }

    console.log('\n📈 MIGRATION SUMMARY:');
    console.log('=====================');
    console.log(`• Total symptoms processed: ${symptoms.length}`);
    console.log(`• Symptoms updated: ${updatedCount}`);
    console.log(`• Symptoms unchanged: ${symptoms.length - updatedCount}`);

    console.log('\n📋 DETAILED RESULTS:');
    results.forEach(result => {
      if (result.action === 'updated') {
        console.log(`✅ ${result.symptom}: Updated (${result.variantCount} variants, ${result.descriptionLength} chars)`);
      } else {
        console.log(`⏭️  ${result.symptom}: No change (${result.reason})`);
      }
    });

  } catch (error) {
    console.error('💥 Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrateVariantContent();
}

export { migrateVariantContent }; 