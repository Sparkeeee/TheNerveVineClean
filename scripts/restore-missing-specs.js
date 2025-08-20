const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function restoreMissingSpecs() {
  try {
    console.log('🔧 Restoring missing Acetyl-L-Carnitine and 5-HTP specs...');
    
    // First, let's check what formulation types we have
    const formulationTypes = await prisma.formulationType.findMany({
      select: { id: true, name: true }
    });
    
    console.log('Available formulation types:');
    formulationTypes.forEach(ft => console.log(`  ${ft.id}: ${ft.name}`));
    
    // Find the supplement IDs for 5-HTP and Acetyl-L-Carnitine
    const fiveHtp = await prisma.supplement.findFirst({
      where: { slug: '5-htp' },
      select: { id: true, name: true, slug: true }
    });
    
    const acetylCarnitine = await prisma.supplement.findFirst({
      where: { slug: 'acetyl-l-carnitine' },
      select: { id: true, name: true, slug: true }
    });
    
    if (!fiveHtp) {
      console.log('❌ 5-HTP supplement not found');
      return;
    }
    
    if (!acetylCarnitine) {
      console.log('❌ Acetyl-L-Carnitine supplement not found');
      return;
    }
    
    console.log(`Found 5-HTP: ID ${fiveHtp.id}, ${fiveHtp.name}`);
    console.log(`Found Acetyl-L-Carnitine: ID ${acetylCarnitine.id}, ${acetylCarnitine.name}`);
    
    // Find the formulation type IDs
    const supplementCapsulesId = formulationTypes.find(ft => ft.name === 'Supplement Capsules/Tablets')?.id;
    const supplementPowderId = formulationTypes.find(ft => ft.name === 'Supplement Powder')?.id;
    
    if (!supplementCapsulesId || !supplementPowderId) {
      console.log('❌ Required formulation types not found');
      return;
    }
    
    // Restore 5-HTP spec
    const fiveHtpSpec = await prisma.qualitySpecification.create({
      data: {
        supplementId: fiveHtp.id,
        supplementName: fiveHtp.name,
        supplementSlug: fiveHtp.slug,
        productType: 'supplement',
        formulationTypeId: supplementCapsulesId,
        standardised: true,
        customSpecs: 'minimum 100mg, 5-HTP',
        notes: 'Standardized 5-HTP for consistent serotonin precursor support. Capsule form ensures proper dosing and bioavailability.',
        requiredTerms: ['standardized', 'bioavailable form', 'quality assurance'],
        preferredTerms: [],
        avoidTerms: [],
        priceRange: {},
        ratingThreshold: 4.0,
        reviewCountThreshold: 10
      }
    });
    
    console.log(`✅ Restored 5-HTP spec: ID ${fiveHtpSpec.id}`);
    
    // Restore Acetyl-L-Carnitine spec
    const acetylCarnitineSpec = await prisma.qualitySpecification.create({
      data: {
        supplementId: acetylCarnitine.id,
        supplementName: acetylCarnitine.name,
        supplementSlug: acetylCarnitine.slug,
        productType: 'supplement',
        formulationTypeId: supplementCapsulesId,
        standardised: true,
        customSpecs: 'minimum 500mg, Acetyl-L-Carnitine',
        notes: 'Acetylated form for enhanced brain function and mitochondrial support. High bioavailability for cognitive enhancement.',
        requiredTerms: ['acetylated', 'bioavailable form', 'quality assurance'],
        preferredTerms: [],
        avoidTerms: [],
        priceRange: {},
        ratingThreshold: 4.0,
        reviewCountThreshold: 10
      }
    });
    
    console.log(`✅ Restored Acetyl-L-Carnitine spec: ID ${acetylCarnitineSpec.id}`);
    
    console.log('\n🌿 Now adding tincture specs for first 10 herbs (excluding capsicum, butterbur, bladderwrack)...');
    
    // Get the first 10 herbs
    const firstTenHerbs = await prisma.herb.findMany({
      take: 10,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true }
    });
    
    console.log('First 10 herbs:');
    firstTenHerbs.forEach(herb => console.log(`  ${herb.name} (${herb.slug})`));
    
    // Find the tincture formulation type
    const tinctureId = formulationTypes.find(ft => ft.name === 'Tincture')?.id;
    
    if (!tinctureId) {
      console.log('❌ Tincture formulation type not found');
      return;
    }
    
    // Herbs to exclude from tincture specs
    const excludeFromTincture = ['capsicum', 'butterbur', 'bladderwrack'];
    
    // Add tincture specs for eligible herbs
    for (const herb of firstTenHerbs) {
      if (excludeFromTincture.includes(herb.slug)) {
        console.log(`⏭️ Skipping tincture for ${herb.name} (excluded)`);
        continue;
      }
      
      // Check if tincture spec already exists
      const existingTincture = await prisma.qualitySpecification.findFirst({
        where: {
          herbId: herb.id,
          formulationTypeId: tinctureId
        }
      });
      
      if (existingTincture) {
        console.log(`⏭️ Tincture spec already exists for ${herb.name}`);
        continue;
      }
      
      // Create tincture spec
      const tinctureSpec = await prisma.qualitySpecification.create({
        data: {
          herbId: herb.id,
          herbName: herb.name,
          herbSlug: herb.slug,
          productType: 'herb',
          formulationTypeId: tinctureId,
          standardised: false,
          approach: 'Traditional',
          customSpecs: '1:5 ratio, organic or wildcrafted',
          notes: `Traditional ${herb.name} tincture using organic or wildcrafted herb. 1:5 ratio for optimal extraction and potency.`,
          requiredTerms: ['organic OR wildcrafted', 'clear ratios', 'traditional approach'],
          preferredTerms: [],
          avoidTerms: [],
          priceRange: {},
          ratingThreshold: 4.0,
          reviewCountThreshold: 10
        }
      });
      
      console.log(`✅ Added tincture spec for ${herb.name}: ID ${tinctureSpec.id}`);
    }
    
    console.log('\n🎉 All missing specs restored and additional tincture specs added!');
    
  } catch (error) {
    console.error('❌ Error restoring specs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreMissingSpecs();
