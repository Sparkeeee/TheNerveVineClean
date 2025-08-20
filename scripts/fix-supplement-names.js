const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping of supplement slugs to proper names
const supplementNameMap = {
  '5-htp': '5-HTP',
  'acetyl-l-carnitine': 'Acetyl L-Carnitine',
  'alpha-lipoic-acid': 'Alpha Lipoic Acid',
  'b-complex': 'B-Complex',
  'biotin': 'Biotin',
  'boron': 'Boron',
  'bromelain': 'Bromelain',
  'calcium': 'Calcium',
  'carnitine': 'L-Carnitine',
  'choline': 'Choline'
};

async function fixSupplementNames() {
  try {
    console.log('🔧 Fixing supplement names in QualitySpecification table...\n');
    
    // Get all quality specs with supplementSlug but NULL supplementName
    const specsToFix = await prisma.qualitySpecification.findMany({
      where: {
        supplementSlug: { not: null },
        supplementName: null
      }
    });
    
    console.log(`📊 Found ${specsToFix.length} supplement specs with NULL names`);
    
    if (specsToFix.length === 0) {
      console.log('✅ All supplement names are already populated');
      return;
    }
    
    let updatedCount = 0;
    
    for (const spec of specsToFix) {
      const properName = supplementNameMap[spec.supplementSlug];
      
      if (properName) {
        await prisma.qualitySpecification.update({
          where: { id: spec.id },
          data: { supplementName: properName }
        });
        
        console.log(`✅ Updated ${spec.supplementSlug} → ${properName}`);
        updatedCount++;
      } else {
        console.log(`⚠️  No name mapping found for: ${spec.supplementSlug}`);
      }
    }
    
    console.log(`\n🎉 Updated ${updatedCount} supplement names`);
    
    // Verify the fixes
    console.log('\n🔍 Verifying fixes...');
    const fixedSpecs = await prisma.qualitySpecification.findMany({
      where: {
        supplementSlug: { not: null },
        supplementName: { not: null }
      },
      select: {
        supplementSlug: true,
        supplementName: true,
        customSpecs: true
      }
    });
    
    console.log('\n📋 Fixed supplement specs:');
    fixedSpecs.forEach(spec => {
      console.log(`  ${spec.supplementSlug} → ${spec.supplementName}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing supplement names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSupplementNames();
