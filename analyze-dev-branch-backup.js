const fs = require('fs');

async function analyzeDevBranchBackup() {
  console.log('🔍 Analyzing development branch backup for missing symptom consolidation...\n');

  try {
    // Read the development branch backup
    const backupData = JSON.parse(fs.readFileSync('database_backup_corrected_2025-08-10T15-55-01-237Z.json', 'utf8'));
    
    if (!backupData.Symptom || !backupData.Symptom.data) {
      console.log('❌ No Symptom data found in backup');
      return;
    }

    const symptoms = backupData.Symptom.data;
    const variants = backupData.SymptomVariant.data;

    console.log(`📊 Development Branch Analysis:`);
    console.log(`   Total Symptoms: ${symptoms.length}`);
    console.log(`   Total Variants: ${variants.length}\n`);

    // Group variants by parent symptom
    const variantsByParent = {};
    variants.forEach(variant => {
      const parentId = variant.parentSymptomId;
      if (!variantsByParent[parentId]) {
        variantsByParent[parentId] = [];
      }
      variantsByParent[parentId].push(variant);
    });

    // Show symptoms with their variant counts
    console.log('🎯 Symptoms with Variants (Consolidated):');
    symptoms.forEach(symptom => {
      const variantCount = variantsByParent[symptom.id] ? variantsByParent[symptom.id].length : 0;
      if (variantCount > 0) {
        console.log(`\n   ${symptom.title} (${symptom.slug}) - ${variantCount} variants:`);
        variantsByParent[symptom.id].forEach(variant => {
          console.log(`     • ${variant.name} (${variant.slug})`);
        });
      }
    });

    // Show symptoms without variants (that might need consolidation)
    console.log('\n⚠️  Symptoms WITHOUT Variants (Need Consolidation):');
    symptoms.forEach(symptom => {
      const variantCount = variantsByParent[symptom.id] ? variantsByParent[symptom.id].length : 0;
      if (variantCount === 0) {
        console.log(`   • ${symptom.title} (${symptom.slug})`);
      }
    });

    // Check for orphaned variants
    const orphanedVariants = variants.filter(variant => {
      return !symptoms.find(s => s.id === variant.parentSymptomId);
    });

    if (orphanedVariants.length > 0) {
      console.log('\n🚨 Orphaned Variants (Missing Parent Symptoms):');
      orphanedVariants.forEach(variant => {
        console.log(`   • ${variant.name} (${variant.slug}) - Parent ID: ${variant.parentSymptomId}`);
      });
    }

    // Show the complete structure that should exist
    console.log('\n📋 COMPLETE STRUCTURE FROM DEVELOPMENT BRANCH:');
    console.log('This is what your main branch should look like:');
    
    symptoms.forEach(symptom => {
      const variantCount = variantsByParent[symptom.id] ? variantsByParent[symptom.id].length : 0;
      console.log(`\n   ${symptom.title} (${symptom.slug})`);
      if (variantCount > 0) {
        variantsByParent[symptom.id].forEach(variant => {
          console.log(`     └─ ${variant.name} (${variant.slug})`);
        });
      } else {
        console.log(`     └─ [No variants - needs consolidation]`);
      }
    });

  } catch (error) {
    console.error('Error analyzing development branch backup:', error);
  }
}

analyzeDevBranchBackup();
