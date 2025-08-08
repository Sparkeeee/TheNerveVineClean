import { getCachedSymptom, getCachedSymptoms } from './database';
import { Symptom as SymptomType, Variant } from '../types/symptom';

export async function getSymptomBySlug(slug: string): Promise<SymptomType | null> {
  try {
    const dbSymptom = await getCachedSymptom(slug);

    if (!dbSymptom) {
      return null;
    }

    // Transform database data to match the Symptom type
    console.log(`[DEBUG] Transforming variants for ${dbSymptom.title}:`, {
      hasVariants: !!dbSymptom.variants,
      variantsLength: dbSymptom.variants?.length || 0,
      variantNames: dbSymptom.variants?.map((v: { name: string }) => v.name) || []
    });
    
    const transformedVariants = dbSymptom.variants?.reduce((acc: Record<string, Variant>, variant: { name: string; description?: string; herbs?: Array<{ name: string; description: string }>; supplements?: Array<{ name: string; description: string }> }) => {
      // Use variant.name as the key for the object
      console.log(`[DEBUG] Processing variant: ${variant.name}`);
      acc[variant.name] = {
        paragraphs: variant.description ? [variant.description] : [],
        bestHerb: variant.herbs?.[0] ? {
          name: variant.herbs[0].name || '',
          description: variant.herbs[0].description || '',
          // PURGED: Removed static price/affiliate corruption - real data from Product table when available
          price: 'Price TBD', // Will be sourced from real product data when Product table is populated
          affiliateLink: '#', // Will be sourced from real affiliate data when available
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        } : undefined,
        bestStandardized: variant.supplements?.[0] ? {
          name: variant.supplements[0].name || '',
          description: variant.supplements[0].description || '',
          // PURGED: Removed static price/affiliate corruption - real data from Product table when available
          price: 'Price TBD', // Will be sourced from real product data when Product table is populated
          affiliateLink: '#', // Will be sourced from real affiliate data when available
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        } : undefined,
        topSupplements: variant.supplements?.slice(1).map((supp: { name: string; description: string }) => ({
          name: supp.name || '',
          description: supp.description || '',
          // PURGED: Removed static price/affiliate corruption - real data from Product table when available
          price: 'Price TBD', // Will be sourced from real product data when Product table is populated
          affiliateLink: '#', // Will be sourced from real affiliate data when available
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        })) || []
      };
      return acc;
    }, {} as Record<string, Variant>) || {};

    console.log(`[DEBUG] Transformed variants result:`, {
      transformedKeys: Object.keys(transformedVariants),
      transformedCount: Object.keys(transformedVariants).length
    });

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
      products: dbSymptom.products.map((product: { name: string; description?: string; affiliateLink: string; price?: number; imageUrl?: string; merchant: { name: string }; qualityScore?: number; affiliateRate?: number }) => ({
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
    return symptoms.map((s: { slug: string }) => s.slug);
  } catch (error) {
    console.error('Error fetching symptom slugs:', error);
    return [];
  }
}

export async function getAllSymptoms(): Promise<SymptomType[]> {
  try {
    const dbSymptoms = await getCachedSymptoms();

    return dbSymptoms.map((dbSymptom: { title: string; description?: string }) => ({
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