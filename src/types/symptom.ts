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
  quickActions?: unknown[];
}

export interface Symptom {
  title: string;
  description: string;
  paragraphs?: string[];
  variants?: Record<string, Variant>;
  disclaimer?: string;
  symptoms?: string[];
  causes?: string[];
  naturalSolutions?: Product[];
  products?: Product[];
  herb?: unknown;
  extract?: unknown;
  supplements?: unknown;
  cautions?: unknown;
  related?: unknown;
  faq?: unknown;
  quickActions?: { name: string; href: string; color: string }[];
  relatedSymptoms?: { name: string; href: string; color: string }[];
  emergencyNote?: string;
} 