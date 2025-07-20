import { PrismaClient } from '@prisma/client';
import { herbs } from '../data/herbs';

const prisma = new PrismaClient();

async function updateHerbDescriptions() {
  console.log('Updating herb descriptions with rich content...');
  
  for (const herb of herbs) {
    try {
      const updatedHerb = await prisma.herb.upsert({
        where: { name: herb.name },
        update: {
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
          latinName: herb.latinName,
        },
        create: {
          name: herb.name,
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
          latinName: herb.latinName,
        },
      });
      console.log(`Updated herb: ${herb.name}`);
    } catch (e) {
      console.error(`Failed to update herb: ${herb.name}`, e);
    }
  }
}

async function main() {
  await updateHerbDescriptions();
  await prisma.$disconnect();
  console.log('Herb descriptions update complete!');
}

main(); 