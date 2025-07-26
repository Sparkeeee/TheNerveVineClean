"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const herbs_1 = require("../data/herbs");
const supplements_1 = require("../data/supplements");
const symptoms_1 = require("../data/symptoms");
const prisma = new client_1.PrismaClient();
async function importHerbs() {
    for (const herb of herbs_1.herbs) {
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
        }
        catch (e) {
            console.error(`Failed to upsert herb: ${herb.name}`, e);
        }
    }
}
async function importSupplements() {
    for (const supp of supplements_1.supplements) {
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
        }
        catch (e) {
            console.error(`Failed to upsert supplement: ${supp.name}`, e);
        }
    }
}
async function importSymptoms() {
    console.log('Symptom keys:', Object.keys(symptoms_1.symptoms));
    for (const [slug, symptom] of Object.entries(symptoms_1.symptoms)) {
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
        }
        catch (e) {
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
