import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStorageUsage() {
  try {
    console.log('🔍 Investigating Database Storage Usage...\n');
    
    // Check for extremely large text fields
    console.log('📏 Checking for massive text content...');
    
    const herbs = await prisma.herb.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        comprehensiveArticle: true,
        traditionalUses: true,
        references: true,
        galleryImages: true
      }
    });
    
    let totalHerbSize = 0;
    let largeHerbs = [];
    
    herbs.forEach(herb => {
      const size = (herb.description?.length || 0) + 
                   (herb.comprehensiveArticle?.length || 0) +
                   (JSON.stringify(herb.traditionalUses || {}).length) +
                   (JSON.stringify(herb.references || {}).length) +
                   (JSON.stringify(herb.galleryImages || {}).length);
      
      totalHerbSize += size;
      
      if (size > 50000) { // 50KB threshold
        largeHerbs.push({ name: herb.name, size: size, id: herb.id });
      }
    });
    
    console.log(`📊 Herbs Storage:`);
    console.log(`- Total herbs: ${herbs.length}`);
    console.log(`- Total size: ${(totalHerbSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Large herbs (>50KB): ${largeHerbs.length}`);
    
    if (largeHerbs.length > 0) {
      console.log('\n⚠️  Large Herb Content:');
      largeHerbs.forEach(herb => {
        console.log(`  - ${herb.name}: ${(herb.size / 1024).toFixed(1)} KB`);
      });
    }
    
    // Check supplements
    const supplements = await prisma.supplement.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        comprehensiveArticle: true,
        references: true,
        galleryImages: true
      }
    });
    
    let totalSupplementSize = 0;
    let largeSupplements = [];
    
    supplements.forEach(supp => {
      const size = (supp.description?.length || 0) + 
                   (supp.comprehensiveArticle?.length || 0) +
                   (JSON.stringify(supp.references || {}).length) +
                   (JSON.stringify(supp.galleryImages || {}).length);
      
      totalSupplementSize += size;
      
      if (size > 50000) {
        largeSupplements.push({ name: supp.name, size: size, id: supp.id });
      }
    });
    
    console.log(`\n📊 Supplements Storage:`);
    console.log(`- Total supplements: ${supplements.length}`);
    console.log(`- Total size: ${(totalSupplementSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Large supplements (>50KB): ${largeSupplements.length}`);
    
    if (largeSupplements.length > 0) {
      console.log('\n⚠️  Large Supplement Content:');
      largeSupplements.forEach(supp => {
        console.log(`  - ${supp.name}: ${(supp.size / 1024).toFixed(1)} KB`);
      });
    }
    
    // Check symptoms
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        comprehensiveArticle: true,
        commonSymptoms: true
      }
    });
    
    let totalSymptomSize = 0;
    symptoms.forEach(symptom => {
      const size = (symptom.description?.length || 0) + 
                   (symptom.comprehensiveArticle?.length || 0) +
                   (JSON.stringify(symptom.commonSymptoms || []).length);
      totalSymptomSize += size;
    });
    
    console.log(`\n📊 Symptoms Storage:`);
    console.log(`- Total symptoms: ${symptoms.length}`);
    console.log(`- Total size: ${(totalSymptomSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Check products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true
      }
    });
    
    let totalProductSize = 0;
    products.forEach(product => {
      const size = (product.description?.length || 0) + (product.imageUrl?.length || 0);
      totalProductSize += size;
    });
    
    console.log(`\n📊 Products Storage:`);
    console.log(`- Total products: ${products.length}`);
    console.log(`- Total size: ${(totalProductSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Total estimated storage
    const totalEstimated = totalHerbSize + totalSupplementSize + totalSymptomSize + totalProductSize;
    console.log(`\n📏 TOTAL ESTIMATED STORAGE:`);
    console.log(`- Raw text: ${(totalEstimated / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- With overhead: ~${(totalEstimated * 1.5 / 1024 / 1024).toFixed(2)} MB`);
    
    // Check for potential issues
    console.log('\n🔍 Potential Storage Issues:');
    
    if (totalEstimated > 100 * 1024 * 1024) { // 100MB
      console.log('⚠️  Text content is very large - consider optimizing');
    }
    
    if (largeHerbs.length + largeSupplements.length > 10) {
      console.log('⚠️  Many large content items - review comprehensive articles');
    }
    
    if (products.length > 1000) {
      console.log('⚠️  High product count - consider archiving old products');
    }
    
    console.log('\n💡 Storage Optimization Tips:');
    console.log('1. Review comprehensive articles - are they too long?');
    console.log('2. Check if gallery images are storing full URLs unnecessarily');
    console.log('3. Consider truncating very long descriptions');
    console.log('4. Archive old test products');
    console.log('5. Check for duplicate data from restore operations');
    
  } catch (error) {
    console.error('❌ Error checking storage usage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStorageUsage();
