var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import { herbs } from '../data/herbs';
const prisma = new PrismaClient();
function updateHerbDescriptions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Updating herb descriptions with rich content...');
        for (const herb of herbs) {
            try {
                // First try to find existing herb by name
                const existingHerb = yield prisma.herb.findFirst({
                    where: { name: herb.name }
                });
                if (existingHerb) {
                    // Update existing herb
                    const updatedHerb = yield prisma.herb.update({
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
                }
                else {
                    // Create new herb
                    const newHerb = yield prisma.herb.create({
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
            }
            catch (e) {
                console.error(`Failed to update herb: ${herb.name}`, e);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateHerbDescriptions();
        yield prisma.$disconnect();
        console.log('Herb descriptions update complete!');
    });
}
main();
