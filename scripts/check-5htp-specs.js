const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check5HTPSpecs() {
  try {
    console.log('🔍 Checking for 5-HTP quality specifications...\n');
    
    // Check all quality specs
    const allSpecs = await prisma.qualitySpecification.findMany();
    console.log(`📊 Total quality specs: ${allSpecs.length}\n`);
    
    // Look for 5-HTP specifically
    const htpSpecs = allSpecs.filter(spec => 
      spec.supplementSlug === '5-htp' || 
      spec.supplementName === '5-HTP'
    );
    
    console.log(`🎯 Found ${htpSpecs.length} specs for 5-HTP:\n`);
    
    htpSpecs.forEach((spec, index) => {
      console.log(`Spec ${index + 1}:`);
      console.log(`  ID: ${spec.id}`);
      console.log(`  Supplement Slug: ${spec.supplementSlug}`);
      console.log(`  Supplement Name: ${spec.supplementName}`);
      console.log(`  Formulation Type ID: ${spec.formulationTypeId}`);
      console.log(`  Approach: ${spec.approach}`);
      console.log(`  Standardised: ${spec.standardised}`);
      console.log(`  Custom Specs: ${spec.customSpecs}`);
      console.log(`  Notes: ${spec.notes}`);
      console.log('');
    });
    
    // Check what formulation type ID 7 is
    const formulationType = await prisma.formulationType.findUnique({
      where: { id: 7 }
    });
    
    if (formulationType) {
      console.log(`🔍 Formulation Type ID 7: ${formulationType.name}`);
    } else {
      console.log('❌ Formulation Type ID 7 not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check5HTPSpecs();
