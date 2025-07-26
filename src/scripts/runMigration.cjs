const { PrismaClient, Prisma } = require('@prisma/client');

async function runMigration() {
  try {
    // Import the data files
    const herbs = require('../data/herbs.cjs').herbs;
    const supplements = require('../data/supplements.cjs').supplements;
    const symptoms = require('../data/symptoms.cjs').symptoms;
    
    const prisma = new PrismaClient();

    console.log('Starting migration...');
    console.log(`Found ${herbs.length} herbs`);
    console.log(`Found ${supplements.length} supplements`);
    console.log(`Found ${Object.keys(symptoms).length} symptoms`);

    // Import herbs
    for (const herb of herbs) {
      try {
        await prisma.herb.upsert({
          where: { slug: herb.slug },
          update: {
            name: herb.name,
            latinName: herb.latinName,
            slug: herb.slug,
            description: herb.description,
            metaTitle: herb.metaTitle,
            metaDescription: herb.metaDescription,
            heroImageUrl: herb.heroImageUrl,
            cardImageUrl: herb.cardImageUrl,
            galleryImages: herb.galleryImages,
            cautions: herb.cautions,
            productFormulations: herb.productFormulations,
            references: herb.references,
            indications: herb.indications,
            traditionalUses: herb.traditionalUses,
          },
          create: {
            name: herb.name,
            latinName: herb.latinName,
            slug: herb.slug,
            description: herb.description,
            metaTitle: herb.metaTitle,
            metaDescription: herb.metaDescription,
            heroImageUrl: herb.heroImageUrl,
            cardImageUrl: herb.cardImageUrl,
            galleryImages: herb.galleryImages,
            cautions: herb.cautions,
            productFormulations: herb.productFormulations,
            references: herb.references,
            indications: herb.indications,
            traditionalUses: herb.traditionalUses,
          },
        });
        console.log(`Upserted herb: ${herb.name}`);
      } catch (e) {
        console.error(`Failed to upsert herb: ${herb.name}`, e);
      }
    }

    // Import supplements
    for (const supp of supplements) {
      try {
        await prisma.supplement.upsert({
          where: { slug: supp.slug },
          update: {
            name: supp.name,
            slug: supp.slug,
            description: supp.description,
            metaTitle: supp.metaTitle,
            metaDescription: supp.metaDescription,
            heroImageUrl: supp.heroImageUrl,
            cardImageUrl: supp.cardImageUrl,
            galleryImages: supp.galleryImages,
            cautions: supp.cautions,
            productFormulations: supp.productFormulations,
            references: supp.references,
            tags: supp.tags,
          },
          create: {
            name: supp.name,
            slug: supp.slug,
            description: supp.description,
            metaTitle: supp.metaTitle,
            metaDescription: supp.metaDescription,
            heroImageUrl: supp.heroImageUrl,
            cardImageUrl: supp.cardImageUrl,
            galleryImages: supp.galleryImages,
            cautions: supp.cautions,
            productFormulations: supp.productFormulations,
            references: supp.references,
            tags: supp.tags,
          },
        });
        console.log(`Upserted supplement: ${supp.name}`);
      } catch (e) {
        console.error(`Failed to upsert supplement: ${supp.name}`, e);
      }
    }

    // Import symptoms
    console.log('Symptom keys:', Object.keys(symptoms));
    for (const [slug, symptom] of Object.entries(symptoms)) {
      try {
        await prisma.symptom.upsert({
          where: { slug },
          update: {
            slug,
            title: symptom.title,
            description: symptom.description,
            cautions: typeof symptom.cautions === 'string' ? symptom.cautions : null,
            variants: symptom.variants,
            associatedSymptoms: symptom.relatedSymptoms,
          },
          create: {
            slug,
            title: symptom.title,
            description: symptom.description,
            cautions: typeof symptom.cautions === 'string' ? symptom.cautions : null,
            variants: symptom.variants,
            associatedSymptoms: symptom.relatedSymptoms,
          },
        });
        console.log(`Upserted symptom: ${slug}`);
      } catch (e) {
        console.error(`Failed to upsert symptom: ${slug}`, e);
      }
    }

    await prisma.$disconnect();
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 