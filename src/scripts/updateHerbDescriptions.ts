import { PrismaClient } from '@prisma/client';
import { herbs } from '../data/herbs';

const prisma = new PrismaClient();

async function updateHerbDescriptions() {
  console.log('Updating herb descriptions with rich content...');
  
  for (const herb of herbs) {
    try {
      // First try to find existing herb by name
      const existingHerb = await prisma.herb.findFirst({
        where: { name: herb.name }
      });

      if (existingHerb) {
        // Update existing herb
        const updatedHerb = await prisma.herb.update({
          where: { id: existingHerb.id },
          data: {
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
      } else {
        // Create new herb
        const newHerb = await prisma.herb.create({
          data: {
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
        console.log(`Created herb: ${herb.name}`);
      }
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