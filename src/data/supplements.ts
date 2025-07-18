export type Supplement = {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: string[];
  cautions?: string;
  productFormulations?: Array<{
    type: string;
    qualityCriteria?: string;
    tags?: string[];
    affiliateLink?: string;
    price?: string;
  }>;
  references?: Array<{ type: string; value: string }>;
  tags?: string[];
};

export const supplements: Supplement[] = [
  {
    name: "L-Tryptophan",
    slug: "l-tryptophan",
    description: "L-Tryptophan is an amino acid supplement used for mood and sleep support.",
    metaTitle: "L-Tryptophan - Amino Acid Supplement",
    metaDescription: "L-Tryptophan is an amino acid supplement used for mood and sleep support.",
    heroImageUrl: "",
    cardImageUrl: "",
    galleryImages: [],
    cautions: "Consult a healthcare provider before use.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "vegan, >4 stars", tags: ["vegan", ">4 stars"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to support mood in clinical studies." }
    ],
    tags: ["amino acid", "mood"]
  },
  {
    name: "Magnesium Glycinate",
    slug: "magnesium-glycinate",
    description: "Magnesium Glycinate is a highly absorbable form of magnesium for relaxation and sleep.",
    metaTitle: "Magnesium Glycinate - Relaxation Supplement",
    metaDescription: "Highly absorbable magnesium for relaxation and sleep support.",
    heroImageUrl: "",
    cardImageUrl: "",
    galleryImages: [],
    cautions: "May cause diarrhea at high doses.",
    productFormulations: [
      { type: "tablet", qualityCriteria: "chelated, >4 stars", tags: ["chelated", ">4 stars"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Supports muscle relaxation and sleep." }
    ],
    tags: ["mineral", "sleep"]
  },
  {
    name: "B-Complex Vitamins",
    slug: "b-complex",
    description: "B-Complex vitamins support energy and nervous system health.",
    metaTitle: "B-Complex - Energy Support",
    metaDescription: "B-Complex vitamins support energy and nervous system health.",
    heroImageUrl: "",
    cardImageUrl: "",
    galleryImages: [],
    cautions: "Generally safe. May cause bright yellow urine.",
    productFormulations: [],
    references: [],
    tags: ["vitamin", "energy"]
  }
];
