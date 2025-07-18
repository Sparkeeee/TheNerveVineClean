import { PrismaClient } from '@prisma/client';
import { herbs } from '../data/herbs';
import { supplements } from '../data/supplements';

const prisma = new PrismaClient();

async function importHerbs() {
  for (const herb of herbs) {
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
  for (const supp of supplements) {
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