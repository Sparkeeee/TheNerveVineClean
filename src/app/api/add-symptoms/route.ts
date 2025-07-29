import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const basicSymptoms = [
  {
    slug: 'insomnia',
    title: 'Insomnia',
    description: 'Difficulty falling asleep, staying asleep, or getting restful sleep. Natural solutions can help regulate sleep cycles and promote relaxation.',
    metaTitle: 'Natural Insomnia Solutions - Herbal Sleep Support',
    metaDescription: 'Discover natural remedies for insomnia including herbs, supplements, and lifestyle changes to improve sleep quality naturally.'
  },
  {
    slug: 'anxiety',
    title: 'Anxiety',
    description: 'Persistent worry, nervousness, and stress that can affect daily life. Natural approaches focus on calming the nervous system and reducing stress hormones.',
    metaTitle: 'Natural Anxiety Relief - Herbal Stress Support',
    metaDescription: 'Explore natural anxiety remedies including adaptogenic herbs, calming supplements, and stress management techniques.'
  },
  {
    slug: 'depression',
    title: 'Depression',
    description: 'Persistent low mood, lack of energy, and loss of interest in activities. Natural support focuses on mood regulation and nervous system balance.',
    metaTitle: 'Natural Depression Support - Herbal Mood Enhancement',
    metaDescription: 'Learn about natural depression support including mood-enhancing herbs, supplements, and holistic wellness approaches.'
  },
  {
    slug: 'stress',
    title: 'Stress',
    description: 'Physical and emotional responses to challenging situations. Natural solutions help the body adapt and maintain balance during stressful periods.',
    metaTitle: 'Natural Stress Relief - Herbal Adaptogenic Support',
    metaDescription: 'Discover natural stress relief methods including adaptogenic herbs, relaxation techniques, and lifestyle modifications.'
  },
  {
    slug: 'fatigue',
    title: 'Fatigue',
    description: 'Persistent tiredness and lack of energy that can affect daily functioning. Natural approaches focus on energy production and adrenal support.',
    metaTitle: 'Natural Fatigue Relief - Herbal Energy Support',
    metaDescription: 'Explore natural fatigue remedies including energy-boosting herbs, adrenal support, and lifestyle optimization.'
  }
];

export async function GET() {
  try {
    console.log('Checking database for symptoms...');
    
    const existingSymptoms = await prisma.symptom.findMany();
    console.log(`Found ${existingSymptoms.length} existing symptoms`);
    
    if (existingSymptoms.length === 0) {
      console.log('No symptoms found. Adding basic symptoms...');
      
      const addedSymptoms = [];
      for (const symptom of basicSymptoms) {
        const added = await prisma.symptom.create({
          data: symptom
        });
        addedSymptoms.push(added);
        console.log(`Added symptom: ${symptom.title}`);
      }
      
      console.log('✅ Basic symptoms added successfully!');
      
      return NextResponse.json({
        success: true,
        message: `Added ${addedSymptoms.length} symptoms to database`,
        symptoms: addedSymptoms
      });
    } else {
      console.log('Symptoms already exist in database:');
      existingSymptoms.forEach(symptom => {
        console.log(`- ${symptom.title} (${symptom.slug})`);
      });
      
      return NextResponse.json({
        success: true,
        message: `${existingSymptoms.length} symptoms already exist in database`,
        symptoms: existingSymptoms
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}