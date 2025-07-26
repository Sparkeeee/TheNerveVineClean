import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch herbs, supplements, and symptoms from database
    const [herbs, supplements, symptoms] = await Promise.all([
      prisma.herb.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          indications: true,
          traditionalUses: true,
        }
      }),
      prisma.supplement.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          tags: true,
        }
      }),
      prisma.symptom.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          associatedSymptoms: true,
        }
      })
    ]);

    // Transform herbs into search items
    const herbSearchItems = herbs.map(herb => ({
      id: `herb-${herb.id}`,
      title: herb.name || 'Unknown Herb',
      description: herb.description || '',
      type: 'herb' as const,
      slug: `/herbs/${herb.slug}`,
      tags: [
        ...(herb.indications ? (Array.isArray(herb.indications) ? herb.indications : []) : []),
        ...(herb.traditionalUses ? (Array.isArray(herb.traditionalUses) ? herb.traditionalUses : []) : [])
      ].filter(Boolean),
      benefits: herb.traditionalUses ? (Array.isArray(herb.traditionalUses) ? herb.traditionalUses : []) : []
    }));

    // Transform supplements into search items
    const supplementSearchItems = supplements.map(supplement => ({
      id: `supplement-${supplement.id}`,
      title: supplement.name,
      description: supplement.description || '',
      type: 'supplement' as const,
      slug: `/supplements/${supplement.slug}`,
      tags: supplement.tags ? (Array.isArray(supplement.tags) ? supplement.tags : []) : [],
      benefits: [] // Could be derived from description or tags
    }));

    // Transform symptoms into search items
    const symptomSearchItems = symptoms.map(symptom => ({
      id: `symptom-${symptom.id}`,
      title: symptom.title,
      description: symptom.description || '',
      type: 'symptom' as const,
      slug: `/symptoms/${symptom.slug}`,
      tags: symptom.associatedSymptoms ? (Array.isArray(symptom.associatedSymptoms) ? symptom.associatedSymptoms : []) : [],
      symptoms: symptom.associatedSymptoms ? (Array.isArray(symptom.associatedSymptoms) ? symptom.associatedSymptoms : []) : []
    }));

    const searchData = [
      ...herbSearchItems,
      ...supplementSearchItems,
      ...symptomSearchItems
    ];

    return NextResponse.json({
      success: true,
      data: searchData,
      counts: {
        herbs: herbSearchItems.length,
        supplements: supplementSearchItems.length,
        symptoms: symptomSearchItems.length,
        total: searchData.length
      }
    });

  } catch (error) {
    console.error('Error fetching search data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch search data' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 