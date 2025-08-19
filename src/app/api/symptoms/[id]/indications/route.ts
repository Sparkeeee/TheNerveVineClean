import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch current indications for a symptom or variant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Check if this is a symptom or variant
    const symptom = await prisma.symptom.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            herbs: true,
            supplements: true
          }
        }
      }
    });

    if (symptom) {
      // This is a symptom - check if we want symptom-level or variant-level data
      if (targetType === 'variant') {
        // Return aggregated data from all variants (for when clicking on variants)
        const allHerbs = new Set();
        const allSupplements = new Set();

        symptom.variants.forEach(variant => {
          variant.herbs.forEach(herb => allHerbs.add(herb.id));
          variant.supplements.forEach(supplement => allSupplements.add(supplement.id));
        });

        const herbs = await prisma.herb.findMany({
          where: { id: { in: Array.from(allHerbs) as number[] } },
          select: { id: true, name: true, slug: true }
        });

        const supplements = await prisma.supplement.findMany({
          where: { id: { in: Array.from(allSupplements) as number[] } },
          select: { id: true, name: true, slug: true }
        });

        return NextResponse.json({
          success: true,
          data: { herbs, supplements }
        });
      } else {
        // Return symptom-level indications from the JSON columns
        const symptomHerbs = symptom.herbs as number[] || [];
        const symptomSupplements = symptom.supplements as number[] || [];
        
        console.log(`🔍 Symptom ${id} has herbs:`, symptomHerbs, 'and supplements:', symptomSupplements);
        
        // Fetch the actual herb and supplement data
        const herbs = symptomHerbs.length > 0 ? await prisma.herb.findMany({
          where: { id: { in: symptomHerbs } },
          select: { id: true, name: true, slug: true }
        }) : [];
        
        const supplements = symptomSupplements.length > 0 ? await prisma.supplement.findMany({
          where: { id: { in: symptomSupplements } },
          select: { id: true, name: true, slug: true }
        }) : [];
        
        console.log(`✅ Fetched herbs:`, herbs, 'and supplements:', supplements);
        
        return NextResponse.json({
          success: true,
          data: { herbs, supplements }
        });
      }
    }

    // Check if this is a variant
    const variant = await prisma.symptomVariant.findUnique({
      where: { id },
      include: {
        herbs: {
          select: { id: true, name: true, slug: true }
        },
        supplements: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (variant) {
      console.log(`🔍 Variant ${id} found:`, variant.name);
      console.log(`   Herbs: ${variant.herbs ? variant.herbs.length : 0}`);
      console.log(`   Supplements: ${variant.supplements ? variant.supplements.length : 0}`);
      
      return NextResponse.json({
        success: true,
        data: {
          herbs: variant.herbs || [],
          supplements: variant.supplements || []
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Symptom or variant not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching indications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update indications for a symptom or variant
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { herbs, supplements, targetType } = await request.json();
    
    console.log(`📥 POST request received:`, { id, herbs, supplements, targetType });
    
    if (isNaN(id)) {
      console.error(`❌ Invalid ID: ${params.id}`);
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    if (targetType === 'variant') {
      console.log(`🔄 Updating variant ${id} indications...`);
      console.log(`   Herbs to set:`, herbs);
      console.log(`   Supplements to set:`, supplements);
      
      try {
        // Update variant indications
        await prisma.symptomVariant.update({
          where: { id },
          data: {
            herbs: {
              set: herbs.map((herbId: number) => ({ id: herbId }))
            },
            supplements: {
              set: supplements.map((supplementId: number) => ({ id: supplementId }))
            }
          }
        });
        console.log(`✅ Variant ${id} updated successfully`);
      } catch (updateError) {
        console.error(`❌ Error updating variant ${id}:`, updateError);
        throw updateError;
      }
    } else {
      console.log(`🔄 Updating symptom ${id} indications in JSON columns...`);
      console.log(`   Herbs to set:`, herbs);
      console.log(`   Supplements to set:`, supplements);
      
      try {
        // Update symptom-level indications in the JSON columns
        await prisma.symptom.update({
          where: { id },
          data: {
            herbs: herbs,
            supplements: supplements
          }
        });
        
        console.log(`✅ Symptom ${id} updated successfully with herbs:`, herbs, 'and supplements:', supplements);
      } catch (updateError) {
        console.error(`❌ Error updating symptom ${id}:`, updateError);
        throw updateError;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Indications updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating indications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
