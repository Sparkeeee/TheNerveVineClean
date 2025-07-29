import { getCachedSymptom, getCachedSymptoms } from './database';
import { Symptom as SymptomType, Variant } from '../types/symptom';

export async function getSymptomBySlug(slug: string): Promise<SymptomType | null> {
  try {
    const dbSymptom = await getCachedSymptom(slug);

    if (!dbSymptom) {
      return null;
    }

    // Transform database data to match the Symptom type
    const transformedVariants = dbSymptom.variants?.reduce((acc: Record<string, Variant>, variant: any) => {
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
        topSupplements: variant.supplements?.slice(1).map((supp: any) => ({
          name: supp.name || '',
          description: supp.description || '',
          price: '$15.99', // Placeholder - would come from product data
          affiliateLink: '#', // Placeholder - would come from product data
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        })) || []
      };
      return acc;
    }, {} as Record<string, Variant>) || {};

    const symptom: SymptomType = {
      name: dbSymptom.title, // Use title as name since name doesn't exist in schema
      title: dbSymptom.title,
      description: dbSymptom.description || '',
      paragraphs: [], // Not in schema, use empty array
      symptoms: [], // Not in schema, use empty array
      causes: [], // Not in schema, use empty array
      naturalSolutions: [], // Not in schema, use empty array
      relatedSymptoms: [], // Not in schema, use empty array
      disclaimer: undefined, // Not in schema
      emergencyNote: undefined, // Not in schema
      variants: transformedVariants,
      products: dbSymptom.products.map((product: any) => ({
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
    const symptoms = await getCachedSymptoms();
    return symptoms.map((s: any) => s.slug);
  } catch (error) {
    console.error('Error fetching symptom slugs:', error);
    return [];
  }
}

export async function getAllSymptoms(): Promise<SymptomType[]> {
  try {
    const dbSymptoms = await getCachedSymptoms();

    return dbSymptoms.map((dbSymptom: any) => ({
      name: dbSymptom.title, // Use title as name since name doesn't exist in schema
      title: dbSymptom.title,
      description: dbSymptom.description || '',
      paragraphs: [], // Not in schema, use empty array
      symptoms: [], // Not in schema, use empty array
      causes: [], // Not in schema, use empty array
      naturalSolutions: [], // Not in schema, use empty array
      relatedSymptoms: [], // Not in schema, use empty array
      disclaimer: undefined, // Not in schema
      emergencyNote: undefined, // Not in schema
      variants: {}, // Simplified for now
      products: [] // Simplified for now
    }));
  } catch (error) {
    console.error('Error fetching all symptoms:', error);
    return [];
  }
} 