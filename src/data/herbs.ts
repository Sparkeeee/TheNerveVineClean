export type Herb = {
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
  indications?: string[];
  traditionalUses?: string[];
};

export const herbs: Herb[] = [
  {
    name: "Lemon Balm",
    slug: "lemon-balm",
    description: "Lemon Balm is a calming herb that eases stress and digestive issues by supporting the parasympathetic nervous system.",
    metaTitle: "Lemon Balm - Calming Herb",
    metaDescription: "Lemon Balm is a calming herb that eases stress and digestive issues...",
    heroImageUrl: "/images/Melissa_officinalis_Le_0.jpg",
    cardImageUrl: "/images/Melissa_officinalis_Le_0.jpg",
    galleryImages: ["/images/Melissa_officinalis_Le_0.jpg"],
    cautions: "Generally safe. May cause mild sedation.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" },
      { type: "cream", qualityCriteria: "standard", tags: [], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for stress relief in European herbalism." }
    ],
    indications: ["anxiety", "digestive tension"],
    traditionalUses: ["Stress and anxiety relief", "Digestive upset"]
  },
  {
    name: "Ashwagandha",
    slug: "ashwagandha",
    description: "Ashwagandha is an adaptogenic herb used to support stress resilience and energy.",
    metaTitle: "Ashwagandha - Adaptogen",
    metaDescription: "Ashwagandha is an adaptogenic herb for stress and energy support.",
    heroImageUrl: "/images/Withania_somnifera_Ash_2.jpg",
    cardImageUrl: "/images/Withania_somnifera_Ash_2.jpg",
    galleryImages: ["/images/Withania_somnifera_Ash_2.jpg"],
    cautions: "Avoid in hyperthyroidism unless supervised.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 5% withanolides", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to reduce cortisol in clinical studies." }
    ],
    indications: ["stress", "fatigue"],
    traditionalUses: ["Ayurvedic tonic", "Energy support"]
  },
  {
    name: "Chamomile",
    slug: "chamomile",
    description: "Chamomile is a gentle, calming herb for relaxation and sleep.",
    metaTitle: "Chamomile - Relaxation Herb",
    metaDescription: "Chamomile is a gentle, calming herb for relaxation and sleep.",
    heroImageUrl: "/images/Matricaria_recutita_Ch_2.jpg",
    cardImageUrl: "/images/Matricaria_recutita_Ch_2.jpg",
    galleryImages: ["/images/Matricaria_recutita_Ch_2.jpg"],
    cautions: "Rare allergy in those sensitive to ragweed.",
    productFormulations: [],
    references: [],
    indications: ["anxiety", "insomnia"],
    traditionalUses: ["Sleep aid", "Digestive tonic"]
  }
];
  