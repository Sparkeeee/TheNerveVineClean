import { PrismaClient, Prisma } from '@prisma/client';
import { herbs } from '../data/herbs';
import { supplements } from '../data/supplements';
import { symptoms } from '../data/symptoms';

const prisma = new PrismaClient();

async function importHerbs() {
  for (const herb of herbs) {
    try {
      await prisma.herb.upsert({
        where: { slug: herb.slug! },
        update: {
          name: herb.name,
          latinName: herb.latinName,
          slug: herb.slug,
          description: herb.description,
          metaTitle: herb.metaTitle,
          metaDescription: herb.metaDescription,
          heroImageUrl: herb.heroImageUrl,
          cardImageUrl: herb.cardImageUrl,
          galleryImages: herb.galleryImages as Prisma.InputJsonValue,
          cautions: herb.cautions,
          productFormulations: herb.productFormulations as Prisma.InputJsonValue,
          references: herb.references as Prisma.InputJsonValue,
          indications: herb.indications as Prisma.InputJsonValue,
          traditionalUses: herb.traditionalUses as Prisma.InputJsonValue,
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
          galleryImages: herb.galleryImages as Prisma.InputJsonValue,
          cautions: herb.cautions,
          productFormulations: herb.productFormulations as Prisma.InputJsonValue,
          references: herb.references as Prisma.InputJsonValue,
          indications: herb.indications as Prisma.InputJsonValue,
          traditionalUses: herb.traditionalUses as Prisma.InputJsonValue,
        },
      });
      console.log(`Upserted herb: ${herb.name}`);
    } catch (e) {
      console.error(`Failed to upsert herb: ${herb.name}`, e);
    }
  }
}

async function importSupplements() {
  for (const supp of supplements) {
    try {
      await prisma.supplement.upsert({
        where: { slug: supp.slug! },
        update: {
          name: supp.name,
          slug: supp.slug,
          description: supp.description,
          metaTitle: supp.metaTitle,
          metaDescription: supp.metaDescription,
          heroImageUrl: supp.heroImageUrl,
          cardImageUrl: supp.cardImageUrl,
          galleryImages: supp.galleryImages as Prisma.InputJsonValue,
          cautions: supp.cautions,
          productFormulations: supp.productFormulations as Prisma.InputJsonValue,
          references: supp.references as Prisma.InputJsonValue,
          tags: supp.tags as Prisma.InputJsonValue,
        },
        create: {
          name: supp.name,
          slug: supp.slug,
          description: supp.description,
          metaTitle: supp.metaTitle,
          metaDescription: supp.metaDescription,
          heroImageUrl: supp.heroImageUrl,
          cardImageUrl: supp.cardImageUrl,
          galleryImages: supp.galleryImages as Prisma.InputJsonValue,
          cautions: supp.cautions,
          productFormulations: supp.productFormulations as Prisma.InputJsonValue,
          references: supp.references as Prisma.InputJsonValue,
          tags: supp.tags as Prisma.InputJsonValue,
        },
      });
      console.log(`Upserted supplement: ${supp.name}`);
    } catch (e) {
      console.error(`Failed to upsert supplement: ${supp.name}`, e);
    }
  }
}

async function importSymptoms() {
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
          variants: symptom.variants as Prisma.InputJsonValue,
          associatedSymptoms: symptom.relatedSymptoms as Prisma.InputJsonValue,
        },
        create: {
          slug,
          title: symptom.title,
          description: symptom.description,
          cautions: typeof symptom.cautions === 'string' ? symptom.cautions : null,
          variants: symptom.variants as Prisma.InputJsonValue,
          associatedSymptoms: symptom.relatedSymptoms as Prisma.InputJsonValue,
        },
      });
      console.log(`Upserted symptom: ${slug}`);
    } catch (e) {
      console.error(`Failed to upsert symptom: ${slug}`, e);
    }
  }
}

async function main() {
  await importHerbs();
  await importSupplements();
  await importSymptoms();
  await prisma.$disconnect();
}

main()
  .then(() => {
    console.log('Migration complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  }); 