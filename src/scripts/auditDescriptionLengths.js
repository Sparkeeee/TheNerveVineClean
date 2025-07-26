import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function analyzeDescription(description) {
  if (!description) return { paragraphs: 0, sentences: 0, avgSentencesPerParagraph: 0, meetsCriteria: false };
  
  // Split into paragraphs (remove empty lines)
  const paragraphs = description.split('\n').filter(p => p.trim().length > 0);
  
  // Count sentences in each paragraph (split by . ! ?)
  const paragraphAnalysis = paragraphs.map(paragraph => {
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return {
      paragraph: paragraph.trim(),
      sentenceCount: sentences.length,
      sentences: sentences.map(s => s.trim())
    };
  });
  
  const totalSentences = paragraphAnalysis.reduce((sum, p) => sum + p.sentenceCount, 0);
  const avgSentencesPerParagraph = paragraphs.length > 0 ? totalSentences / paragraphs.length : 0;
  
  // Check if meets criteria: 3-5 paragraphs, each with 3-5 sentences
  const meetsCriteria = paragraphs.length >= 3 && paragraphs.length <= 5 && 
    paragraphAnalysis.every(p => p.sentenceCount >= 3 && p.sentenceCount <= 5);
  
  return {
    paragraphs: paragraphs.length,
    sentences: totalSentences,
    avgSentencesPerParagraph,
    meetsCriteria,
    paragraphAnalysis
  };
}

function isTrueVariantType(variants) {
  if (!variants || typeof variants !== 'object') return false;
  const keys = Object.keys(variants);
  // True variant type if more than one key, or any key that is not 'Default'
  return keys.length > 1 || (keys.length === 1 && keys[0] !== 'Default');
}

async function auditDescriptionLengths() {
  console.log('📊 AUDITING SYMPTOM VARIANT STRUCTURE...\n');
  console.log('Criteria: 3-5 paragraphs, each with 3-5 sentences of varying lengths\n');
  console.log('='.repeat(80));

  try {
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        variants: true,
        variantDescriptions: true
      }
    });

    const trueVariantTypes = [];
    const standardSymptoms = [];

    for (const symptom of symptoms) {
      const variants = symptom.variants;
      if (isTrueVariantType(variants)) {
        trueVariantTypes.push(symptom);
      } else {
        standardSymptoms.push(symptom);
      }
    }

    console.log('\n✅ TRUE VARIANT TYPES (multiple named variants, not just Default):');
    trueVariantTypes.forEach(s => {
      const keys = Object.keys(s.variants || {});
      console.log(`• ${s.title} (${s.slug}) - Variants: ${keys.join(', ')}`);
    });

    console.log('\n✅ STANDARD/NON-VARIANT SYMPTOMS (variants null, empty, or only Default):');
    standardSymptoms.forEach(s => {
      const keys = Object.keys(s.variants || {});
      console.log(`• ${s.title} (${s.slug}) - Variants: ${keys.length ? keys.join(', ') : 'none'}`);
    });

    console.log('\nSUMMARY:');
    console.log(`Total symptoms: ${symptoms.length}`);
    console.log(`True variant types: ${trueVariantTypes.length}`);
    console.log(`Standard/non-variant symptoms: ${standardSymptoms.length}`);

  } catch (error) {
    console.error('💥 Error during audit:', error);
  } finally {
    await prisma.$disconnect();
  }
}

auditDescriptionLengths(); 