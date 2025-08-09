export type Product = {
  name: string;
  description: string;
  affiliateLink?: string;
  affiliateUrl?: string;
  price: string;
  image?: string;
  supplier?: string;
  qualityScore?: number;
  affiliateRevenue?: number;
  type?: string;
  clinicalEvidence?: string;
  productLink?: string;
};

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
  products?: Product[];
  herbs?: Product[];
  supplements?: Product[];
}

export interface Symptom {
  name?: string;
  title?: string;
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
  references?: string[];
  cautions?: string;
} 