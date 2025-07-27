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
        },
        variants: {
          include: {
            herbs: true,
            supplements: true
          }
        }
      }
    });

    if (!dbSymptom) {
      return null;
    }

    // Transform database data to match the Symptom type
    const transformedVariants = dbSymptom.variants?.reduce((acc, variant) => {
      acc[variant.name] = {
        paragraphs: variant.description ? [variant.description] : [],
        bestHerb: variant.herbs?.[0] ? {
          name: variant.herbs[0].name || '',
          description: variant.herbs[0].description || '',
          price: '$24.99', // Placeholder - would come from product data
          affiliateLink: '#', // Placeholder - would come from product data
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        } : undefined,
        bestStandardized: variant.supplements?.[0] ? {
          name: variant.supplements[0].name || '',
          description: variant.supplements[0].description || '',
          price: '$19.99', // Placeholder - would come from product data
          affiliateLink: '#', // Placeholder - would come from product data
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        } : undefined,
        topSupplements: variant.supplements?.slice(1).map(supp => ({
          name: supp.name || '',
          description: supp.description || '',
          price: '$15.99', // Placeholder - would come from product data
          affiliateLink: '#', // Placeholder - would come from product data
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        })) || []
      };
      return acc;
    }, {} as Record<string, any>) || {};

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
      variants: transformedVariants,
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
        },
        variants: {
          include: {
            herbs: true,
            supplements: true
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
      variants: dbSymptom.variants?.reduce((acc, variant) => {
        acc[variant.name] = {
          paragraphs: variant.description ? [variant.description] : [],
          bestHerb: variant.herbs?.[0] ? {
            name: variant.herbs[0].name || '',
            description: variant.herbs[0].description || '',
            price: '$24.99', // Placeholder - would come from product data
            affiliateLink: '#', // Placeholder - would come from product data
            image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
          } : undefined,
          bestStandardized: variant.supplements?.[0] ? {
            name: variant.supplements[0].name || '',
            description: variant.supplements[0].description || '',
            price: '$19.99', // Placeholder - would come from product data
            affiliateLink: '#', // Placeholder - would come from product data
            image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
          } : undefined,
          topSupplements: variant.supplements?.slice(1).map(supp => ({
            name: supp.name || '',
            description: supp.description || '',
            price: '$15.99', // Placeholder - would come from product data
            affiliateLink: '#', // Placeholder - would come from product data
            image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
          })) || []
        };
        return acc;
      }, {} as Record<string, any>) || {},
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