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
import { supplements } from '../data/supplements';
const prisma = new PrismaClient();
function importHerbs() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const herb of herbs) {
            try {
                yield prisma.herb.create({
                    data: {
                        name: herb.name,
                        latinName: ('latinName' in herb ? herb.latinName : undefined),
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
            }
            catch (e) {
                console.error(`Failed to import herb: ${herb.name}`, e);
            }
        }
    });
}
function importSupplements() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const supp of supplements) {
            try {
                yield prisma.supplement.create({
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
            }
            catch (e) {
                console.error(`Failed to import supplement: ${supp.name}`, e);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield importHerbs();
        yield importSupplements();
        yield prisma.$disconnect();
    });
}
main();
