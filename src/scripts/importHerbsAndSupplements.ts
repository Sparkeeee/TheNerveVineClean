import { PrismaClient } from '@prisma/client';
import { herbs } from '../data/herbs';
import { supplements } from '../data/supplements';

const prisma = new PrismaClient();

async function importHerbs() {
  console.log('Checking for existing herbs...');
  const existingHerbs = await prisma.herb.findMany();
  const existingHerbNames = existingHerbs.map(h => h.name?.toLowerCase());
  
  console.log(`Found ${existingHerbs.length} existing herbs:`, existingHerbNames);
  
  for (const herb of herbs) {
    // Check if herb already exists
    if (existingHerbNames.includes(herb.name.toLowerCase())) {
      console.log(`Skipping ${herb.name} - already exists`);
      continue;
    }
    
    try {
      await prisma.herb.create({
        data: {
          name: herb.name,
          latinName: ('latinName' in herb ? (herb as any).latinName : undefined),
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
      console.log(`Imported herb: ${herb.name}`);
    } catch (e) {
      console.error(`Failed to import herb: ${herb.name}`, e);
    }
  }
}

async function importSupplements() {
  console.log('Checking for existing supplements...');
  const existingSupplements = await prisma.supplement.findMany();
  const existingSupplementNames = existingSupplements.map(s => s.name.toLowerCase());
  
  console.log(`Found ${existingSupplements.length} existing supplements:`, existingSupplementNames);
  
  for (const supp of supplements) {
    // Check if supplement already exists
    if (existingSupplementNames.includes(supp.name.toLowerCase())) {
      console.log(`Skipping ${supp.name} - already exists`);
      continue;
    }
    
    try {
      await prisma.supplement.create({
        data: {
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
      console.log(`Imported supplement: ${supp.name}`);
    } catch (e) {
      console.error(`Failed to import supplement: ${supp.name}`, e);
    }
  }
}

async function main() {
  await importHerbs();
  await importSupplements();
  await prisma.$disconnect();
}

main(); 