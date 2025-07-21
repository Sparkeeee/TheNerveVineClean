var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const expectedHerbs = [
    "Lemon Balm", "Ashwagandha", "Chamomile", "Lavender", "St. John's Wort",
    "Rhodiola Rosea", "Holy Basil (Tulsi)", "Licorice Root", "Ginseng", "Feverfew",
    "Passionflower", "Damiana", "Skullcap", "Valerian Root", "Kava Kava",
    "Maca Root", "Siberian Ginseng (Eleuthero)", "Hawthorn", "Willow Bark",
    "Capsaicin (Chilli Extract)", "American Ginseng", "Schisandra Berry", "Astragalus Root",
    "Ginkgo Biloba", "Bilberry", "Milk Thistle"
];
export function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const herbs = yield prisma.herb.findMany({
                select: {
                    id: true,
                    name: true,
                    latinName: true,
                    slug: true,
                    description: true
                }
            });
            const existingNames = herbs.map(h => h.name);
            const missingHerbs = expectedHerbs.filter(name => !existingNames.includes(name));
            return NextResponse.json({
                success: true,
                totalExpected: expectedHerbs.length,
                totalFound: herbs.length,
                missingCount: missingHerbs.length,
                missingHerbs: missingHerbs,
                existingHerbs: herbs.map(h => ({
                    name: h.name,
                    latinName: h.latinName,
                    slug: h.slug,
                    hasDescription: !!h.description
                }))
            });
        }
        catch (error) {
            console.error('Error checking herbs:', error);
            return NextResponse.json({
                success: false,
                error: 'Failed to check herbs'
            }, { status: 500 });
        }
    });
}
