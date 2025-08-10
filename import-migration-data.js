const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importMigrationData() {
  try {
    console.log('🔄 Starting import of production data to development...');
    
    // Read migration data
    const migrationData = JSON.parse(fs.readFileSync('migration-data.json', 'utf8'));
    
    console.log('📊 Importing production data...');
    
    // Clear existing development data (optional - comment out if you want to keep existing)
    console.log('🧹 Clearing existing development data...');
    await prisma.product.deleteMany();
    await prisma.qualitySpecification.deleteMany();
    await prisma.herb.deleteMany();
    await prisma.symptom.deleteMany();
    await prisma.supplement.deleteMany();
    await prisma.merchant.deleteMany();
    await prisma.indication.deleteMany();
    
    // Import herbs
    console.log(`📦 Importing ${migrationData.herbs.length} herbs...`);
    for (const herb of migrationData.herbs) {
      await prisma.herb.create({
        data: {
          name: herb.name,
          commonName: herb.commonName,
          latinName: herb.latinName,
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
          traditionalUses: herb.traditionalUses,
          comprehensiveArticle: herb.comprehensiveArticle
        }
      });
    }
    
    // Import symptoms
    console.log(`📦 Importing ${migrationData.symptoms.length} symptoms...`);
    for (const symptom of migrationData.symptoms) {
      await prisma.symptom.create({
        data: {
          slug: symptom.slug,
          title: symptom.title,
          description: symptom.description,
          articles: symptom.articles,
          associatedSymptoms: symptom.associatedSymptoms,
          cautions: symptom.cautions,
          references: symptom.references,
          metaDescription: symptom.metaDescription,
          metaTitle: symptom.metaTitle,
          comprehensiveArticle: symptom.comprehensiveArticle
        }
      });
    }
    
    // Import supplements
    console.log(`📦 Importing ${migrationData.supplements.length} supplements...`);
    for (const supplement of migrationData.supplements) {
      await prisma.supplement.create({
        data: {
          name: supplement.name,
          slug: supplement.slug,
          description: supplement.description,
          metaTitle: supplement.metaTitle,
          metaDescription: supplement.metaDescription,
          heroImageUrl: supplement.heroImageUrl,
          cardImageUrl: supplement.cardImageUrl,
          galleryImages: supplement.galleryImages,
          cautions: supplement.cautions,
          productFormulations: supplement.productFormulations,
          references: supplement.references,
          tags: supplement.tags,
          comprehensiveArticle: supplement.comprehensiveArticle
        }
      });
    }
    
    // Import merchants
    console.log(`📦 Importing ${migrationData.merchants.length} merchants...`);
    for (const merchant of migrationData.merchants) {
      await prisma.merchant.create({
        data: {
          name: merchant.name,
          apiSource: merchant.apiSource,
          logoUrl: merchant.logoUrl,
          websiteUrl: merchant.websiteUrl,
          region: merchant.region,
          defaultAffiliateRate: merchant.defaultAffiliateRate
        }
      });
    }
    
    // Import quality specs
    console.log(`📦 Importing ${migrationData.qualitySpecs.length} quality specs...`);
    for (const spec of migrationData.qualitySpecs) {
      await prisma.qualitySpecification.create({
        data: {
          herbSlug: spec.herbSlug,
          herbName: spec.herbName,
          supplementSlug: spec.supplementSlug,
          supplementName: spec.supplementName,
          productType: spec.productType,
          formulationName: spec.formulationName,
          approach: spec.approach,
          requiredTerms: spec.requiredTerms,
          preferredTerms: spec.preferredTerms,
          avoidTerms: spec.avoidTerms,
          standardization: spec.standardization,
          alcoholSpecs: spec.alcoholSpecs,
          dosageSpecs: spec.dosageSpecs,
          priceRange: spec.priceRange,
          ratingThreshold: spec.ratingThreshold,
          reviewCountThreshold: spec.reviewCountThreshold,
          brandPreferences: spec.brandPreferences,
          brandAvoid: spec.brandAvoid,
          notes: spec.notes
        }
      });
    }
    
    // Import products
    console.log(`📦 Importing ${migrationData.products.length} products...`);
    for (const product of migrationData.products) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          region: product.region,
          affiliateLink: product.affiliateLink,
          imageUrl: product.imageUrl,
          merchantId: product.merchantId,
          herbId: product.herbId,
          supplementId: product.supplementId,
          symptomId: product.symptomId
        }
      });
    }
    
    // Import indications
    console.log(`📦 Importing ${migrationData.indications.length} indications...`);
    for (const indication of migrationData.indications) {
      await prisma.indication.create({
        data: {
          name: indication.name,
          description: indication.description,
          category: indication.category
        }
      });
    }
    
    // Verify import
    const finalHerbCount = await prisma.herb.count();
    const finalSymptomCount = await prisma.symptom.count();
    const finalSupplementCount = await prisma.supplement.count();
    
    console.log('✅ Import complete!');
    console.log(`📊 Final development database:`);
    console.log(`   - ${finalHerbCount} herbs`);
    console.log(`   - ${finalSymptomCount} symptoms`);
    console.log(`   - ${finalSupplementCount} supplements`);
    console.log('');
    console.log('🎉 Migration successful! Development database now matches production!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importMigrationData();
