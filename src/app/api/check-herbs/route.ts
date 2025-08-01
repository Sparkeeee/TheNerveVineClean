import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const expectedHerbs = [
  "Lemon Balm", "Ashwagandha", "Chamomile", "Lavender", "St. John's Wort",
  "Rhodiola Rosea", "Holy Basil", "Licorice Root", "Ginseng", "Feverfew",
  "Passionflower", "Damiana", "Skullcap", "Valerian Root", "Kava Kava",
  "Maca Root", "Siberian Ginseng", "Hawthorn", "Willow Bark",
  "Chilli Pepper", "American Ginseng", "Schisandra Berry", "Astragalus",
  "Ginkgo Biloba", "Bilberry", "Milk Thistle"
];

export async function GET() {
  try {
    const herbs = await prisma.herb.findMany({
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
    
  } catch (error) {
    console.error('Error checking herbs:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check herbs' 
    }, { status: 500 });
  }
} 