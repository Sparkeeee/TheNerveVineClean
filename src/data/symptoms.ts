export type Symptom = {
  slug: string;
  title: string;
  description: string;
  variants: Record<string, {
    paragraphs: string[];
    bestHerb?: {
      name: string;
      description: string;
      affiliateLink: string;
      price: string;
    };
    bestStandardized?: {
      name: string;
      description: string;
      affiliateLink: string;
      price: string;
    };
    topSupplements?: {
      name: string;
      description: string;
      affiliateLink: string;
      price: string;
    }[];
  }>;
  symptoms?: string[];
  causes?: string[];
  naturalSolutions?: {
    type: string;
    name: string;
    description: string;
    affiliateLink: string;
    price: string;
    clinicalEvidence?: string;
  }[];
  disclaimer?: string;
  herb?: unknown;
  extract?: unknown;
  supplements?: unknown;
  cautions?: unknown;
  related?: unknown;
  faq?: unknown;
};

export const symptoms: Symptom[] = [
  // ... (all symptom entries from src/app/symptoms/[slug]/page.tsx, each as an object with a slug field matching the key)
]; 