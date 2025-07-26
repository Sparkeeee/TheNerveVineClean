import { PrismaClient } from '@prisma/client';
import { Symptom as SymptomType } from '../types/symptom';

const prisma = new PrismaClient();

export async function getSymptomBySlug(slug: string): Promise<SymptomType | null> {
  try {
    const dbSymptom = await prisma.symptom.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            merchant: true
          }
        }
      }
    });

    if (!dbSymptom) {
      return null;
    }

    // Transform database data to match the Symptom type
    const symptom: SymptomType = {
      name: dbSymptom.name || dbSymptom.title,
      title: dbSymptom.title,
      description: dbSymptom.description || '',
      paragraphs: dbSymptom.paragraphs as string[] || [],
      symptoms: dbSymptom.symptoms as string[] || [],
      causes: dbSymptom.causes as string[] || [],
      naturalSolutions: dbSymptom.naturalSolutions as any[] || [],
      relatedSymptoms: dbSymptom.relatedSymptoms as any[] || [],
      disclaimer: dbSymptom.disclaimer || undefined,
      emergencyNote: dbSymptom.emergencyNote || undefined,
      variants: dbSymptom.variants as Record<string, any> || {},
      products: dbSymptom.products.map(product => ({
        name: product.name,
        description: product.description || '',
        affiliateLink: product.affiliateLink,
        price: product.price ? `$${product.price}` : '',
        image: product.imageUrl || undefined,
        supplier: product.merchant.name,
        qualityScore: product.qualityScore || undefined,
        affiliateRevenue: product.affiliateRate || undefined,
        type: 'product'
      }))
    };

    return symptom;
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return null;
  }
}

export async function getAllSymptomSlugs(): Promise<string[]> {
  try {
    const symptoms = await prisma.symptom.findMany({
      select: { slug: true }
    });
    return symptoms.map(s => s.slug);
  } catch (error) {
    console.error('Error fetching symptom slugs:', error);
    return [];
  }
}

export async function getAllSymptoms(): Promise<SymptomType[]> {
  try {
    const dbSymptoms = await prisma.symptom.findMany({
      include: {
        products: {
          include: {
            merchant: true
          }
        }
      }
    });

    return dbSymptoms.map(dbSymptom => ({
      name: dbSymptom.name || dbSymptom.title,
      title: dbSymptom.title,
      description: dbSymptom.description || '',
      paragraphs: dbSymptom.paragraphs as string[] || [],
      symptoms: dbSymptom.symptoms as string[] || [],
      causes: dbSymptom.causes as string[] || [],
      naturalSolutions: dbSymptom.naturalSolutions as any[] || [],
      relatedSymptoms: dbSymptom.relatedSymptoms as any[] || [],
      disclaimer: dbSymptom.disclaimer || undefined,
      emergencyNote: dbSymptom.emergencyNote || undefined,
      variants: dbSymptom.variants as Record<string, any> || {},
      products: dbSymptom.products.map(product => ({
        name: product.name,
        description: product.description || '',
        affiliateLink: product.affiliateLink,
        price: product.price ? `$${product.price}` : '',
        image: product.imageUrl || undefined,
        supplier: product.merchant.name,
        qualityScore: product.qualityScore || undefined,
        affiliateRevenue: product.affiliateRate || undefined,
        type: 'product'
      }))
    }));
  } catch (error) {
    console.error('Error fetching all symptoms:', error);
    return [];
  }
} 