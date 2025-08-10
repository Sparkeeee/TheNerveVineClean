export type Product = {
  name: string;
  description: string;
  affiliateLink?: string;
  affiliateUrl?: string;
  price: string;
  image?: string;
  imageUrl?: string;
  supplier?: string;
  qualityScore?: number;
  affiliateRevenue?: number;
  affiliateRate?: number;
  type?: string;
  clinicalEvidence?: string;
  productLink?: string;
  merchant?: {
    name: string;
  };
};

// Database SymptomVariant type (from Prisma schema)
export interface DBSymptomVariant {
  id: number;
  parentSymptomId: number;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  cautions?: string;
  references?: any; // JSON field
  commonSymptoms?: string[]; // Array of common symptom descriptions
  herbs: DBHerb[];
  supplements: DBSupplement[];
}

// Database Herb type
export interface DBHerb {
  id: number;
  name?: string;
  commonName?: string;
  latinName?: string;
  slug?: string;
  description: string;
  cautions?: string;
  references?: any; // JSON field
}

// Database Supplement type
export interface DBSupplement {
  id: number;
  name: string;
  slug?: string;
  description: string;
  cautions?: string;
  references?: any; // JSON field
}

// Frontend Variant type (transformed for UI)
export interface Variant {
  paragraphs?: string[];
  bestHerb?: Product;
  bestStandardized?: Product;
  topSupplements?: Product[];
  emergencyNote?: string;
  productFormulations?: Record<string, Product>;
  cautions?: string;
  relatedSymptoms?: { name: string; href: string; color: string }[];
  description?: string;
  commonSymptoms?: string[]; // ✅ ADDED COMMON SYMPTOMS TO FRONTEND VARIANT
  products?: Product[];
  herbs?: Product[];
  supplements?: Product[];
}

// Database Symptom type (from Prisma schema)
export interface DBSymptom {
  id: number;
  slug: string;
  title: string; // Required in DB
  description?: string;
  articles?: any; // JSON field
  associatedSymptoms?: any; // JSON field
  cautions?: string;
  references?: any; // JSON field
  metaDescription?: string;
  metaTitle?: string;
  comprehensiveArticle?: string;
  commonSymptoms?: string[]; // Array of common symptom descriptions
  variants: DBSymptomVariant[];
  products: DBProduct[];
}

// Database Product type
export interface DBProduct {
  id: number;
  name: string;
  description?: string;
  affiliateLink: string;
  price?: string;
  imageUrl?: string;
  qualityScore?: number;
  affiliateRate?: number;
  merchant: {
    name: string;
  };
}

// Frontend Symptom type (transformed for UI)
export interface Symptom {
  name?: string; // For backward compatibility
  title?: string; // Maps to DB title field
  description?: string;
  paragraphs?: string[];
  variants?: Record<string, Variant>;
  disclaimer?: string;
  symptoms?: string[];
  causes?: string[];
  naturalSolutions?: Product[];
  products?: Product[];
  quickActions?: { name: string; href: string; color: string }[];
  relatedSymptoms?: { name: string; href: string; color: string }[];
  emergencyNote?: string;
  commonSymptoms?: string[]; // ✅ ADDED COMMON SYMPTOMS TO FRONTEND SYMPTOM
  references?: string[];
  cautions?: string;
} 