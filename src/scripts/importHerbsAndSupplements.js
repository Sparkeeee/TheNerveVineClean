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
        console.log('Checking for existing herbs...');
        const existingHerbs = yield prisma.herb.findMany();
        const existingHerbNames = existingHerbs.map(h => { var _a; return (_a = h.name) === null || _a === void 0 ? void 0 : _a.toLowerCase(); });
        console.log(`Found ${existingHerbs.length} existing herbs:`, existingHerbNames);
        for (const herb of herbs) {
            // Check if herb already exists
            if (existingHerbNames.includes(herb.name.toLowerCase())) {
                console.log(`Skipping ${herb.name} - already exists`);
                continue;
            }
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
        console.log('Checking for existing supplements...');
        const existingSupplements = yield prisma.supplement.findMany();
        const existingSupplementNames = existingSupplements.map(s => s.name.toLowerCase());
        console.log(`Found ${existingSupplements.length} existing supplements:`, existingSupplementNames);
        for (const supp of supplements) {
            // Check if supplement already exists
            if (existingSupplementNames.includes(supp.name.toLowerCase())) {
                console.log(`Skipping ${supp.name} - already exists`);
                continue;
            }
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
