 import { getCachedSymptom, getCachedSymptoms } from './database';
import { Symptom as SymptomType, Variant, DBSymptom, DBSymptomVariant, DBHerb, DBSupplement, Product } from '../types/symptom';

export async function getSymptomBySlug(slug: string): Promise<SymptomType | null> {
  try {
    const dbSymptom = await getCachedSymptom(slug) as DBSymptom | null;

    if (!dbSymptom) {
      return null;
    }

    // Transform database data to match the Symptom type
    console.log(`[DEBUG] Transforming variants for ${dbSymptom.title}:`, {
      hasVariants: !!dbSymptom.variants,
      variantsLength: dbSymptom.variants?.length || 0,
      variantNames: dbSymptom.variants?.map((v: DBSymptomVariant) => v.name) || []
    });
    
    const transformedVariants = dbSymptom.variants?.reduce((acc: Record<string, Variant>, variant: DBSymptomVariant) => {
      // Use variant.name as the key for the object
      console.log(`[DEBUG] Processing variant: ${variant.name}`);
      acc[variant.name] = {
        slug: variant.slug, // Add the slug property here
        paragraphs: variant.description ? [variant.description] : [],
        cautions: variant.cautions || undefined,
        description: variant.description || undefined,
        commonSymptoms: variant.commonSymptoms || undefined, // ✅ COPY COMMON SYMPTOMS FROM DB
        bestHerb: variant.herbs?.[0] ? {
          name: variant.herbs[0].name || variant.herbs[0].commonName || '',
          description: variant.herbs[0].description || '',
          price: 'Price TBD', // Will be sourced from real product data when scraper is deployed
          affiliateLink: '#', // Will be sourced from real affiliate data when scraper is deployed
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        } : undefined,
        bestStandardized: variant.supplements?.[0] ? {
          name: variant.supplements[0].name || '',
          description: variant.supplements[0].description || '',
          price: 'Price TBD', // Will be sourced from real product data when scraper is deployed
          affiliateLink: '#', // Will be sourced from real affiliate data when scraper is deployed
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        } : undefined,
        topSupplements: variant.supplements?.slice(1).map((supp: DBSupplement): Product => ({
          name: supp.name || '',
          description: supp.description || '',
          price: 'Price TBD', // Will be sourced from real product data when scraper is deployed
          affiliateLink: '#', // Will be sourced from real affiliate data when scraper is deployed
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        })) || [],
        herbs: variant.herbs?.map((herb: DBHerb): Product => ({
          name: herb.name || herb.commonName || '',
          description: herb.description || '',
          price: 'Price TBD', // TODO: Integrate with product scraper when deployed
          affiliateLink: '#', // TODO: Integrate with product scraper when deployed
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        })) || [],
        supplements: variant.supplements?.map((supp: DBSupplement): Product => ({
          name: supp.name || '',
          description: supp.description || '',
          price: 'Price TBD', // TODO: Integrate with product scraper when deployed
          affiliateLink: '#', // TODO: Integrate with product scraper when deployed
          image: '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'
        })) || []
      };
      return acc;
    }, {} as Record<string, Variant>) || {};

    console.log(`[DEBUG] Transformed variants result:`, {
      transformedKeys: Object.keys(transformedVariants),
      transformedCount: Object.keys(transformedVariants).length
    });

    console.log(`[DEBUG] Creating symptom object for ${dbSymptom.title}:`, {
      hasCommonSymptoms: !!dbSymptom.commonSymptoms,
      commonSymptomsType: typeof dbSymptom.commonSymptoms,
      commonSymptomsLength: dbSymptom.commonSymptoms?.length,
      commonSymptomsData: dbSymptom.commonSymptoms
    });

    const symptom: SymptomType = {
      name: dbSymptom.title, // Use title as name for backward compatibility
      title: dbSymptom.title,
      description: dbSymptom.description || '',
      paragraphs: [], // Not in schema, use empty array
      symptoms: [], // Not in schema, use empty array
      causes: [], // Not in schema, use empty array
      naturalSolutions: [], // Not in schema, use empty array
      relatedSymptoms: [], // Not in schema, use empty array
      disclaimer: undefined, // Not in schema
      emergencyNote: undefined, // Not in schema
      cautions: dbSymptom.cautions || undefined,
      commonSymptoms: dbSymptom.commonSymptoms || undefined, // ✅ COPY MAIN SYMPTOM COMMON SYMPTOMS
      references: Array.isArray(dbSymptom.references) ? dbSymptom.references : [],
      variants: transformedVariants,
      products: dbSymptom.products?.map((product) => ({
        name: product.name,
        description: product.description || '',
        affiliateLink: product.affiliateLink,
        price: product.price || '',
        image: product.imageUrl || undefined,
        imageUrl: product.imageUrl || undefined,
        supplier: product.merchant.name,
        qualityScore: product.qualityScore || undefined,
        affiliateRevenue: product.affiliateRate || undefined,
        affiliateRate: product.affiliateRate || undefined,
        type: 'product'
      })) || []
    };

    console.log(`[DEBUG] Final symptom object commonSymptoms:`, {
      hasCommonSymptoms: !!symptom.commonSymptoms,
      commonSymptomsType: typeof symptom.commonSymptoms,
      commonSymptomsLength: symptom.commonSymptoms?.length,
      commonSymptomsData: symptom.commonSymptoms
    });

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
    const dbSymptoms = await getCachedSymptoms() as DBSymptom[];

    return dbSymptoms.map((dbSymptom: DBSymptom): SymptomType => ({
      name: dbSymptom.title, // Use title as name for backward compatibility
      title: dbSymptom.title,
      description: dbSymptom.description || '',
      paragraphs: [], // Not in schema, use empty array
      symptoms: [], // Not in schema, use empty array
      causes: [], // Not in schema, use empty array
      naturalSolutions: [], // Not in schema, use empty array
      relatedSymptoms: [], // Not in schema, use empty array
      disclaimer: undefined, // Not in schema
      emergencyNote: undefined, // Not in schema
      cautions: dbSymptom.cautions || undefined,
      references: Array.isArray(dbSymptom.references) ? dbSymptom.references : [],
      variants: {}, // Would need full relation loading - simplified for performance
      products: dbSymptom.products?.map((product) => ({
        name: product.name,
        description: product.description || '',
        affiliateLink: product.affiliateLink,
        price: product.price || '',
        image: product.imageUrl || undefined,
        imageUrl: product.imageUrl || undefined,
        supplier: product.merchant.name,
        qualityScore: product.qualityScore || undefined,
        affiliateRevenue: product.affiliateRate || undefined,
        affiliateRate: product.affiliateRate || undefined,
        type: 'product'
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching all symptoms:', error);
    return [];
  }
} 