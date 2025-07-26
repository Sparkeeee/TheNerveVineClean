import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditSymptomContent() {
  console.log('🔍 Auditing symptom content in database...\n');
  
  try {
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        articles: true,
        associatedSymptoms: true,
        cautions: true,
        variants: true,
        references: true
      }
    });

    console.log(`📊 Found ${symptoms.length} symptoms in database\n`);

    const needsContent = [];
    const hasContent = [];

    symptoms.forEach(symptom => {
      const hasDescription = symptom.description && symptom.description.trim().length > 50;
      const hasArticles = symptom.articles && Array.isArray(symptom.articles) && symptom.articles.length > 0;
      
      if (!hasDescription && !hasArticles) {
        needsContent.push({
          id: symptom.id,
          slug: symptom.slug,
          title: symptom.title,
          currentDescription: symptom.description || 'No description'
        });
      } else {
        hasContent.push({
          slug: symptom.slug,
          title: symptom.title,
          hasDescription: hasDescription,
          hasArticles: hasArticles
        });
      }
    });

    console.log('❌ SYMPTOMS NEEDING CONTENT:');
    console.log('============================');
    needsContent.forEach(symptom => {
      console.log(`• ${symptom.title} (${symptom.slug})`);
      console.log(`  Current: "${symptom.currentDescription}"`);
      console.log('');
    });

    console.log(`\n✅ SYMPTOMS WITH CONTENT: ${hasContent.length}`);
    console.log('============================');
    hasContent.forEach(symptom => {
      console.log(`• ${symptom.title} (${symptom.slug})`);
      console.log(`  Description: ${symptom.hasDescription ? '✅' : '❌'}`);
      console.log(`  Articles: ${symptom.hasArticles ? '✅' : '❌'}`);
      console.log('');
    });

    console.log(`\n📈 SUMMARY:`);
    console.log(`• Total symptoms: ${symptoms.length}`);
    console.log(`• Need content: ${needsContent.length}`);
    console.log(`• Have content: ${hasContent.length}`);
    console.log(`• Content needed: ${Math.round((needsContent.length / symptoms.length) * 100)}%`);

  } catch (error) {
    console.error('💥 Error auditing symptoms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

auditSymptomContent(); 