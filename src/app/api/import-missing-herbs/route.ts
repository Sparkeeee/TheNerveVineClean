import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const missingHerbs = [
  {
    name: "Ginkgo Biloba",
    latinName: "Ginkgo biloba",
    slug: "ginkgo-biloba",
    description: "Ginkgo Biloba is a powerful cognitive enhancer that improves blood flow to the brain and supports memory, concentration, and mental clarity by protecting against oxidative stress and inflammation.",
    metaTitle: "Ginkgo Biloba - Cognitive Enhancement",
    metaDescription: "Ginkgo Biloba improves blood flow to the brain, supporting memory, concentration, and mental clarity while protecting against oxidative stress.",
    heroImageUrl: "/images/ginkgo-biloba.jpg",
    cardImageUrl: "/images/ginkgo-biloba.jpg",
    galleryImages: ["/images/ginkgo-biloba.jpg"],
    cautions: "May interact with blood thinners. Consult healthcare provider if taking medications.",
    productFormulations: [
      { type: "capsule", dosage: "120mg", frequency: "twice daily" },
      { type: "tablet", dosage: "60mg", frequency: "once daily" },
      { type: "liquid", dosage: "1ml", frequency: "twice daily" }
    ],
    references: [
      "Ginkgo biloba for cognitive impairment and dementia. Cochrane Database Syst Rev. 2009.",
      "Effects of Ginkgo biloba on cognitive function. Phytomedicine. 2015."
    ],
    indications: ["Memory support", "Cognitive enhancement", "Blood circulation", "Anti-aging"],
    traditionalUses: ["Memory enhancement", "Cognitive function", "Blood flow improvement", "Anti-oxidant support"]
  },
  {
    name: "Bilberry",
    latinName: "Vaccinium myrtillus",
    slug: "bilberry",
    description: "Bilberry is a potent antioxidant that supports eye health and vision by protecting the retina from oxidative damage and improving blood flow to the eyes, making it essential for maintaining healthy vision and preventing age-related eye conditions.",
    metaTitle: "Bilberry - Eye Health Support",
    metaDescription: "Bilberry supports eye health and vision by protecting the retina from oxidative damage and improving blood flow to the eyes.",
    heroImageUrl: "/images/bilberry.jpg",
    cardImageUrl: "/images/bilberry.jpg",
    galleryImages: ["/images/bilberry.jpg"],
    cautions: "Generally safe. May lower blood sugar levels.",
    productFormulations: [
      { type: "capsule", dosage: "160mg", frequency: "twice daily" },
      { type: "tablet", dosage: "80mg", frequency: "once daily" },
      { type: "liquid", dosage: "2ml", frequency: "twice daily" }
    ],
    references: [
      "Bilberry and eye health: A systematic review. J Med Food. 2014.",
      "Vaccinium myrtillus for vision support. Phytother Res. 2016."
    ],
    indications: ["Eye health", "Vision support", "Retinal protection", "Antioxidant"],
    traditionalUses: ["Eye health", "Vision improvement", "Retinal protection", "Antioxidant support"]
  },
  {
    name: "Milk Thistle",
    latinName: "Silybum marianum",
    slug: "milk-thistle",
    description: "Milk Thistle is a powerful liver protector that supports detoxification and liver health by protecting liver cells from damage and promoting regeneration, making it essential for maintaining optimal liver function and overall health.",
    metaTitle: "Milk Thistle - Liver Protection",
    metaDescription: "Milk Thistle supports liver health and detoxification by protecting liver cells from damage and promoting regeneration.",
    heroImageUrl: "/images/milk-thistle.jpg",
    cardImageUrl: "/images/milk-thistle.jpg",
    galleryImages: ["/images/milk-thistle.jpg"],
    cautions: "Generally safe. May interact with some medications.",
    productFormulations: [
      { type: "capsule", dosage: "250mg", frequency: "twice daily" },
      { type: "tablet", dosage: "150mg", frequency: "once daily" },
      { type: "liquid", dosage: "1ml", frequency: "twice daily" }
    ],
    references: [
      "Milk thistle for liver diseases. Cochrane Database Syst Rev. 2007.",
      "Silybum marianum for liver protection. Phytomedicine. 2018."
    ],
    indications: ["Liver support", "Detoxification", "Liver protection", "Cell regeneration"],
    traditionalUses: ["Liver health", "Detoxification", "Liver protection", "Cell regeneration"]
  }
];

export async function GET() {
  try {
    let imported = 0;
    let updated = 0;
    
    // Import missing herbs
    for (const herb of missingHerbs) {
      const existing = await prisma.herb.findFirst({
        where: { slug: herb.slug }
      });
      
      if (!existing) {
        await prisma.herb.create({
          data: herb
        });
        imported++;
      }
    }
    
    // Fix Latin names for first 3 herbs
    const herbsToUpdate = [
      { slug: "lemon-balm", latinName: "Melissa officinalis" },
      { slug: "ashwagandha", latinName: "Withania somnifera" },
      { slug: "chamomile", latinName: "Matricaria recutita" }
    ];
    
    for (const update of herbsToUpdate) {
      const result = await prisma.herb.updateMany({
        where: { slug: update.slug },
        data: { latinName: update.latinName }
      });
      if (result.count > 0) {
        updated++;
      }
    }
    
    const totalHerbs = await prisma.herb.count();
    
    return NextResponse.json({
      success: true,
      message: `Import completed! Imported ${imported} herbs, updated ${updated} Latin names. Total herbs in database: ${totalHerbs}`,
      imported,
      updated,
      total: totalHerbs
    });
    
  } catch (error) {
    console.error('Error importing missing herbs:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to import missing herbs' 
    }, { status: 500 });
  }
} 