// Rich herb descriptions with historical context and modern applications
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
  latinName?: string;
};

export const herbs: Herb[] = [
  {
    name: "Lemon Balm",
    latinName: "Melissa officinalis",
    slug: "lemon-balm",
    description: `Lemon Balm, with its gentle lemon fragrance and calming properties, has been cherished in herbal medicine for centuries as one of the premier nervine tonics. This member of the mint family contains rosmarinic acid and other compounds that work synergistically to soothe the nervous system and promote a sense of tranquility. Its ability to calm without sedation makes it particularly valuable for those who experience the 'wired and tired' feeling that comes from chronic stress.

Historically, Lemon Balm was known as 'the herb of the heart' and was used to 'make the heart merry' according to medieval herbalists. This reputation stems from its unique ability to gently uplift the mood while simultaneously calming agitation and irritability. The herb works by supporting the parasympathetic nervous system, which is responsible for the body's rest-and-digest functions.

In modern herbal practice, Lemon Balm excels at addressing stress-related digestive issues, particularly those that manifest as nervous stomach, indigestion, or loss of appetite due to anxiety. Its gentle nature makes it suitable for long-term use, and it's often combined with other calming herbs like Chamomile or Lavender for enhanced effects. The herb is particularly effective for children and the elderly, as it's very well-tolerated and has minimal side effects.

The essential oil of Lemon Balm contains citronellal and geranial, compounds that contribute to its distinctive aroma and therapeutic effects. When used as a tea, tincture, or essential oil, Lemon Balm can help reduce cortisol levels and promote healthy sleep patterns. It's especially beneficial for those who have difficulty falling asleep due to racing thoughts or anxiety.`,
    metaTitle: "Lemon Balm - Calming Herb for Stress Relief",
    metaDescription: "Lemon Balm is a calming herb that eases stress and digestive issues by supporting the parasympathetic nervous system.",
    heroImageUrl: "/images/Melissa_officinalis_Le_0.jpg",
    cardImageUrl: "/images/Melissa_officinalis_Le_0.jpg",
    galleryImages: ["/images/Melissa_officinalis_Le_0.jpg"],
    cautions: "Generally safe. May cause mild sedation.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" },
      { type: "tea", qualityCriteria: "loose leaf, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for stress relief in European herbalism." }
    ],
    indications: ["anxiety", "digestive tension", "insomnia"],
    traditionalUses: ["Stress and anxiety relief", "Digestive upset", "Sleep aid"]
  },
  {
    name: "Ashwagandha",
    latinName: "Withania somnifera",
    slug: "ashwagandha",
    description: `Ashwagandha, often called 'Indian ginseng,' is one of the most revered herbs in Ayurvedic medicine, with a documented history spanning over 3,000 years. This powerful adaptogen contains withanolides, particularly withaferin A and withanolide D, which work at the cellular level to help the body adapt to stress and maintain homeostasis. The herb's name translates to 'smell of horse,' referring to its traditional use to impart the strength and vitality of a horse.

The primary mechanism of Ashwagandha's effectiveness lies in its ability to modulate the hypothalamic-pituitary-adrenal (HPA) axis, the body's central stress response system. By helping to normalize cortisol levels and reduce the impact of chronic stress, Ashwagandha supports adrenal function and prevents the cascade of stress-related symptoms that can lead to burnout and fatigue. This makes it particularly valuable for those experiencing adrenal fatigue, chronic stress, or the 'wired and tired' state that characterizes modern life.

Clinical research has demonstrated Ashwagandha's ability to reduce cortisol levels by up to 30% in stressed individuals, while simultaneously improving energy levels and cognitive function. The herb also contains compounds that support thyroid function and may help regulate blood sugar levels, making it beneficial for those with stress-related metabolic issues. Its anti-inflammatory properties further contribute to its overall stress-protective effects.

In traditional Ayurvedic practice, Ashwagandha was considered a rasayana, or rejuvenating herb, used to promote longevity and vitality. It was particularly valued for its ability to support both physical and mental performance, making it a favorite among students, athletes, and those with demanding lifestyles. The herb's ability to improve sleep quality while enhancing daytime energy makes it unique among adaptogens.`,
    metaTitle: "Ashwagandha - Adaptogenic Herb for Stress Resilience",
    metaDescription: "Ashwagandha is an adaptogenic herb for stress and energy support.",
    heroImageUrl: "/images/Withania_somnifera_Ash_2.jpg",
    cardImageUrl: "/images/Withania_somnifera_Ash_2.jpg",
    galleryImages: ["/images/Withania_somnifera_Ash_2.jpg"],
    cautions: "Avoid in hyperthyroidism unless supervised. May interact with immunosuppressants.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 5% withanolides", tags: ["standardized"], affiliateLink: "", price: "" },
      { type: "powder", qualityCriteria: "organic, full spectrum", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to reduce cortisol in clinical studies." }
    ],
    indications: ["stress", "fatigue", "adrenal exhaustion"],
    traditionalUses: ["Ayurvedic tonic", "Energy support", "Stress adaptation"]
  },
  {
    name: "Chamomile",
    latinName: "Matricaria recutita",
    slug: "chamomile",
    description: `Chamomile, with its delicate daisy-like flowers and gentle apple-like aroma, has been a cornerstone of herbal medicine for thousands of years. This beloved herb contains apigenin, a flavonoid that binds to benzodiazepine receptors in the brain, promoting relaxation and sleep without the side effects associated with pharmaceutical sedatives. The herb's gentle nature and pleasant taste make it one of the most accessible and widely-used calming herbs.

The therapeutic properties of Chamomile extend beyond simple relaxation. The herb contains bisabolol and chamazulene, compounds with anti-inflammatory and antispasmodic properties that make it particularly effective for stress-related digestive issues. This dual action on both the nervous system and digestive tract explains why Chamomile has been traditionally used for 'nervous stomach' and digestive complaints that stem from anxiety or stress.

Historically, Chamomile was known as the 'plant's physician' because it was believed to help other plants grow when planted nearby. This reputation for nurturing and healing extends to its effects on humans, where it gently soothes both physical and emotional tension. The herb is especially valuable for those who experience racing thoughts or difficulty falling asleep due to anxiety, as it promotes a sense of calm without causing drowsiness during the day.

Modern research has confirmed Chamomile's effectiveness for generalized anxiety disorder, with studies showing significant improvement in anxiety scores compared to placebo. The herb's safety profile makes it suitable for long-term use, and it's often recommended for children and the elderly. Chamomile tea is particularly effective when consumed 30-60 minutes before bedtime, allowing its calming compounds to take effect naturally.`,
    metaTitle: "Chamomile - Gentle Relaxation Herb",
    metaDescription: "Chamomile is a gentle, calming herb for relaxation and sleep.",
    heroImageUrl: "/images/Matricaria_recutita_Ch_2.jpg",
    cardImageUrl: "/images/Matricaria_recutita_Ch_2.jpg",
    galleryImages: ["/images/Matricaria_recutita_Ch_2.jpg"],
    cautions: "Rare allergy in those sensitive to ragweed. Generally very safe.",
    productFormulations: [
      { type: "tea", qualityCriteria: "organic, loose leaf", tags: ["organic"], affiliateLink: "", price: "" },
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for sleep and relaxation in European herbalism." }
    ],
    indications: ["anxiety", "insomnia", "digestive tension"],
    traditionalUses: ["Sleep aid", "Digestive tonic", "Nervous tension"]
  }
];
  