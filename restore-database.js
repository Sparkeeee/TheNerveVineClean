import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function restoreDatabase() {
  try {
    console.log('🔄 Starting database restoration...');
    
    // Read the backup file
    const backupData = JSON.parse(fs.readFileSync('./development_database_corrected_2025-08-10T16-34-14-694Z.json', 'utf8'));
    
    console.log('📊 Backup data loaded, starting restoration...');
    
    // Restore Herbs
    if (backupData.Herb && backupData.Herb.data) {
      console.log(`🌿 Restoring ${backupData.Herb.data.length} herbs...`);
      for (const herb of backupData.Herb.data) {
        await prisma.herb.upsert({
          where: { id: herb.id },
          update: herb,
          create: herb
        });
      }
      console.log('✅ Herbs restored successfully');
    }
    
    // Restore Symptoms
    if (backupData.Symptom && backupData.Symptom.data) {
      console.log(`🩺 Restoring ${backupData.Symptom.data.length} symptoms...`);
      for (const symptom of backupData.Symptom.data) {
        await prisma.symptom.upsert({
          where: { id: symptom.id },
          update: symptom,
          create: symptom
        });
      }
      console.log('✅ Symptoms restored successfully');
    }
    
    // Restore SymptomVariants
    if (backupData.SymptomVariant && backupData.SymptomVariant.data) {
      console.log(`🔄 Restoring ${backupData.SymptomVariant.data.length} symptom variants...`);
      for (const variant of backupData.SymptomVariant.data) {
        await prisma.symptomVariant.upsert({
          where: { id: variant.id },
          update: variant,
          create: variant
        });
      }
      console.log('✅ Symptom variants restored successfully');
    }
    
    // Restore Supplements
    if (backupData.Supplement && backupData.Supplement.data) {
      console.log(`💊 Restoring ${backupData.Supplement.data.length} supplements...`);
      for (const supplement of backupData.Supplement.data) {
        await prisma.supplement.upsert({
          where: { id: supplement.id },
          update: supplement,
          create: supplement
        });
      }
      console.log('✅ Supplements restored successfully');
    }
    
    // Restore Indications
    if (backupData.Indication && backupData.Indication.data) {
      console.log(`🏷️ Restoring ${backupData.Indication.data.length} indications...`);
      for (const indication of backupData.Indication.data) {
        await prisma.indication.upsert({
          where: { id: indication.id },
          update: indication,
          create: indication
        });
      }
      console.log('✅ Indications restored successfully');
    }
    
    // Restore Products
    if (backupData.Product && backupData.Product.data) {
      console.log(`🛍️ Restoring ${backupData.Product.data.length} products...`);
      for (const product of backupData.Product.data) {
        await prisma.product.upsert({
          where: { id: product.id },
          update: product,
          create: product
        });
      }
      console.log('✅ Products restored successfully');
    }
    
    // Restore Merchants
    if (backupData.Merchant && backupData.Merchant.data) {
      console.log(`🏪 Restoring ${backupData.Merchant.data.length} merchants...`);
      for (const merchant of backupData.Merchant.data) {
        await prisma.merchant.upsert({
          where: { id: merchant.id },
          update: merchant,
          create: merchant
        });
      }
      console.log('✅ Merchants restored successfully');
    }
    
    // Restore QualitySpecifications
    if (backupData.QualitySpecification && backupData.QualitySpecification.data) {
      console.log(`⚖️ Restoring ${backupData.QualitySpecification.data.length} quality specifications...`);
      for (const spec of backupData.QualitySpecification.data) {
        await prisma.qualitySpecification.upsert({
          where: { id: spec.id },
          update: spec,
          create: spec
        });
      }
      console.log('✅ Quality specifications restored successfully');
    }
    
    // Restore BlogPages
    if (backupData.BlogPage && backupData.BlogPage.data) {
      console.log(`📝 Restoring ${backupData.BlogPage.data.length} blog pages...`);
      for (const blog of backupData.BlogPage.data) {
        await prisma.blogPage.upsert({
          where: { id: blog.id },
          update: blog,
          create: blog
        });
      }
      console.log('✅ Blog pages restored successfully');
    }
    
    // Restore Users
    if (backupData.User && backupData.User.data) {
      console.log(`👤 Restoring ${backupData.User.data.length} users...`);
      for (const user of backupData.User.data) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user
        });
      }
      console.log('✅ Users restored successfully');
    }
    
    // Restore ShoppingLists
    if (backupData.ShoppingList && backupData.ShoppingList.data) {
      console.log(`🛒 Restoring ${backupData.ShoppingList.data.length} shopping lists...`);
      for (const list of backupData.ShoppingList.data) {
        await prisma.shoppingList.upsert({
          where: { id: list.id },
          update: list,
          create: list
        });
      }
      console.log('✅ Shopping lists restored successfully');
    }
    
    console.log('🎉 Database restoration completed successfully!');
    
    // Verify the restoration
    const herbCount = await prisma.herb.count();
    const symptomCount = await prisma.symptom.count();
    const indicationCount = await prisma.indication.count();
    
    console.log(`\n📊 Verification:`);
    console.log(`🌿 Herbs: ${herbCount}`);
    console.log(`🩺 Symptoms: ${symptomCount}`);
    console.log(`🏷️ Indications: ${indicationCount}`);
    
  } catch (error) {
    console.error('❌ Error during restoration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDatabase();


