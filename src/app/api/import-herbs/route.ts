import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const herbs = [
  {
    name: "Lemon Balm",
    latinName: "Melissa officinalis",
    slug: "lemon-balm",
    description: "Lemon Balm is a calming herb that eases stress and digestive issues by supporting the parasympathetic nervous system.",
    metaTitle: "Lemon Balm - Calming Herb",
    metaDescription: "Lemon Balm is a calming herb that eases stress and digestive issues...",
    heroImageUrl: "/images/Melissa_officinalis_Le_0.jpg",
    cardImageUrl: "/images/Melissa_officinalis_Le_0.jpg",
    galleryImages: ["/images/Melissa_officinalis_Le_0.jpg"],
    cautions: "Generally safe. May cause mild sedation.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for stress relief in European herbalism." }
         ],
     traditionalUses: ["Stress and anxiety relief", "Digestive upset"]
  },
  {
    name: "Ashwagandha",
    latinName: "Withania somnifera",
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
     traditionalUses: ["Ayurvedic tonic", "Energy support"]
  },
  {
    name: "Chamomile",
    latinName: "Matricaria recutita",
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

    traditionalUses: ["Sleep aid", "Digestive tonic"]
  },
  {
    name: "Lavender",
    latinName: "Lavandula angustifolia",
    slug: "lavender",
    description: "Lavender is a classic calming herb known for its soothing aroma and gentle sedative properties.",
    metaTitle: "Lavender - Soothing Calming Herb",
    metaDescription: "Lavender is a classic calming herb known for its soothing aroma and gentle sedative properties.",
    heroImageUrl: "/images/lavender.jpg",
    cardImageUrl: "/images/lavender.jpg",
    galleryImages: ["/images/lavender.jpg"],
    cautions: "Essential oil should be diluted. Generally safe when used properly.",
    productFormulations: [
      { type: "essential oil", qualityCriteria: "pure, therapeutic grade", tags: ["pure"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to reduce anxiety in clinical studies." }
    ],

    traditionalUses: ["Relaxation", "Sleep aid", "Nervous system support"]
  },
  {
    name: "St. John's Wort",
    latinName: "Hypericum perforatum",
    slug: "st-johns-wort",
    description: "St. John's Wort is a well-researched herb for mild to moderate depression and seasonal affective disorder.",
    metaTitle: "St. John's Wort - Natural Mood Support",
    metaDescription: "St. John's Wort is a well-researched herb for mild to moderate depression and seasonal affective disorder.",
    heroImageUrl: "/images/st-johns-wort.jpg",
    cardImageUrl: "/images/st-johns-wort.jpg",
    galleryImages: ["/images/st-johns-wort.jpg"],
    cautions: "Interacts with many medications. Consult healthcare provider. Avoid sun exposure.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 0.3% hypericin", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Multiple studies show effectiveness for mild depression." }
    ],

    traditionalUses: ["Mood support", "Depression", "Seasonal blues"]
  },
  {
    name: "Rhodiola Rosea",
    latinName: "Rhodiola rosea",
    slug: "rhodiola-rosea",
    description: "Rhodiola Rosea is an adaptogenic herb that helps the body adapt to stress and maintain energy levels.",
    metaTitle: "Rhodiola Rosea - Adaptogenic Energy Support",
    metaDescription: "Rhodiola Rosea is an adaptogenic herb that helps the body adapt to stress and maintain energy levels.",
    heroImageUrl: "/images/Rhodiola_rosea_Rhodiol_3.jpg",
    cardImageUrl: "/images/Rhodiola_rosea_Rhodiol_3.jpg",
    galleryImages: ["/images/Rhodiola_rosea_Rhodiol_3.jpg"],
    cautions: "May be stimulating. Avoid in the evening. Generally safe.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 3% rosavins", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to improve stress resilience and energy in studies." }
    ],

    traditionalUses: ["Stress adaptation", "Energy support", "Mental performance"]
  },
  {
    name: "Holy Basil",
    latinName: "Ocimum sanctum",
    slug: "holy-basil",
    description: "Holy Basil is a sacred herb in Ayurvedic medicine with powerful adaptogenic properties.",
    metaTitle: "Holy Basil - Sacred Adaptogenic Herb",
    metaDescription: "Holy Basil is a sacred herb in Ayurvedic medicine with powerful adaptogenic properties.",
    heroImageUrl: "/images/holy-basil.jpg",
    cardImageUrl: "/images/holy-basil.jpg",
    galleryImages: ["/images/holy-basil.jpg"],
    cautions: "May lower blood sugar. Monitor if diabetic. Generally safe.",
    productFormulations: [
      { type: "tea", qualityCriteria: "organic, loose leaf", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Sacred herb in Ayurvedic medicine for stress and spiritual support." }
    ],

    traditionalUses: ["Stress adaptation", "Mental clarity", "Spiritual support"]
  },
  {
    name: "Licorice Root",
    latinName: "Glycyrrhiza glabra",
    slug: "licorice-root",
    description: "Licorice Root is a sweet-tasting herb that supports the adrenal glands and helps regulate cortisol levels.",
    metaTitle: "Licorice Root - Adrenal Support Herb",
    metaDescription: "Licorice Root is a sweet-tasting herb that supports the adrenal glands and helps regulate cortisol levels.",
    heroImageUrl: "/images/licorice-root.jpg",
    cardImageUrl: "/images/licorice-root.jpg",
    galleryImages: ["/images/licorice-root.jpg"],
    cautions: "May raise blood pressure. Avoid if hypertensive. Use deglycyrrhizinated form for long-term use.",
    productFormulations: [
      { type: "tea", qualityCriteria: "organic, loose leaf", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to support adrenal function and cortisol regulation." }
    ],

    traditionalUses: ["Adrenal support", "Energy tonic", "Stress adaptation"]
  },
  {
    name: "Ginseng",
    latinName: "Panax ginseng",
    slug: "ginseng",
    description: "Ginseng is a powerful adaptogenic herb that has been used in traditional Chinese medicine for thousands of years.",
    metaTitle: "Ginseng - Powerful Adaptogenic Herb",
    metaDescription: "Ginseng is a powerful adaptogenic herb that has been used in traditional Chinese medicine for thousands of years.",
    heroImageUrl: "/images/Panax_ginseng_Korean_g_1.jpg",
    cardImageUrl: "/images/Panax_ginseng_Korean_g_1.jpg",
    galleryImages: ["/images/Panax_ginseng_Korean_g_1.jpg"],
    cautions: "May be stimulating. Avoid in the evening. May interact with blood thinners.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 4% ginsenosides", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Extensive research shows effectiveness for energy and stress adaptation." }
    ],

    traditionalUses: ["Energy tonic", "Stress adaptation", "Cognitive support"]
  },
  {
    name: "Feverfew",
    latinName: "Tanacetum parthenium",
    slug: "feverfew",
    description: "Feverfew is a traditional herb used for migraine prevention and relief.",
    metaTitle: "Feverfew - Migraine Prevention Herb",
    metaDescription: "Feverfew is a traditional herb used for migraine prevention and relief.",
    heroImageUrl: "/images/feverfew.jpg",
    cardImageUrl: "/images/feverfew.jpg",
    galleryImages: ["/images/feverfew.jpg"],
    cautions: "May cause mouth ulcers in some people. Generally safe when used properly.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 0.2% parthenolide", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Multiple studies show effectiveness for migraine prevention." }
    ],

    traditionalUses: ["Migraine prevention", "Headache relief", "Inflammation reduction"]
  },
  {
    name: "Passionflower",
    latinName: "Passiflora incarnata",
    slug: "passionflower",
    description: "Passionflower is a gentle sedative herb that promotes relaxation and sleep.",
    metaTitle: "Passionflower - Gentle Sedative Herb",
    metaDescription: "Passionflower is a gentle sedative herb that promotes relaxation and sleep.",
    heroImageUrl: "/images/passionflower.jpg",
    cardImageUrl: "/images/passionflower.jpg",
    galleryImages: ["/images/passionflower.jpg"],
    cautions: "May cause drowsiness. Avoid when driving. Generally safe.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for anxiety and sleep in European herbalism." }
    ],

    traditionalUses: ["Sleep aid", "Anxiety relief", "Nervous system support"]
  },
  {
    name: "Damiana",
    latinName: "Turnera diffusa",
    slug: "damiana",
    description: "Damiana is a traditional herb used for mood enhancement and nervous system support.",
    metaTitle: "Damiana - Mood Enhancement Herb",
    metaDescription: "Damiana is a traditional herb used for mood enhancement and nervous system support.",
    heroImageUrl: "/images/damiana.jpg",
    cardImageUrl: "/images/damiana.jpg",
    galleryImages: ["/images/damiana.jpg"],
    cautions: "May lower blood sugar. Monitor if diabetic. Generally safe.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for mood enhancement in traditional medicine." }
    ],

    traditionalUses: ["Mood enhancement", "Nervous system tonic", "Emotional balance"]
  },
  {
    name: "Skullcap",
    latinName: "Scutellaria lateriflora",
    slug: "skullcap",
    description: "Skullcap is a nervine herb that helps calm the nervous system and reduce anxiety.",
    metaTitle: "Skullcap - Nervine Calming Herb",
    metaDescription: "Skullcap is a nervine herb that helps calm the nervous system and reduce anxiety.",
    heroImageUrl: "/images/skullcap.jpg",
    cardImageUrl: "/images/skullcap.jpg",
    galleryImages: ["/images/skullcap.jpg"],
    cautions: "May cause drowsiness. Avoid when driving. Generally safe.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for anxiety and nervous system support in traditional medicine." }
    ],

    traditionalUses: ["Nervous system support", "Anxiety relief", "Sleep aid"]
  },
  {
    name: "Valerian Root",
    latinName: "Valeriana officinalis",
    slug: "valerian-root",
    description: "Valerian Root is a traditional herb used for sleep support and anxiety relief.",
    metaTitle: "Valerian Root - Sleep Support Herb",
    metaDescription: "Valerian Root is a traditional herb used for sleep support and anxiety relief.",
    heroImageUrl: "/images/valerian.jpg",
    cardImageUrl: "/images/valerian.jpg",
    galleryImages: ["/images/valerian.jpg"],
    cautions: "May cause drowsiness. Avoid when driving. May interact with sedatives.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 0.8% valerenic acid", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Multiple studies show effectiveness for sleep support." }
    ],

    traditionalUses: ["Sleep aid", "Anxiety relief", "Nervous system support"]
  },
  {
    name: "Kava Kava",
    latinName: "Piper methysticum",
    slug: "kava-kava",
    description: "Kava Kava is a traditional herb used for anxiety relief and relaxation.",
    metaTitle: "Kava Kava - Traditional Anxiety Relief",
    metaDescription: "Kava Kava is a traditional herb used for anxiety relief and relaxation.",
    heroImageUrl: "/images/kava.jpg",
    cardImageUrl: "/images/kava.jpg",
    galleryImages: ["/images/kava.jpg"],
    cautions: "May affect liver function. Avoid if liver issues. Use with caution.",
    productFormulations: [
      { type: "tincture", qualityCriteria: "1:3, organic", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to reduce anxiety in clinical studies." }
    ],

    traditionalUses: ["Anxiety relief", "Relaxation", "Social anxiety"]
  },
  {
    name: "Maca Root",
    latinName: "Lepidium meyenii",
    slug: "maca-root",
    description: "Maca Root is an adaptogenic herb used for energy support and hormonal balance.",
    metaTitle: "Maca Root - Energy and Hormonal Support",
    metaDescription: "Maca Root is an adaptogenic herb used for energy support and hormonal balance.",
    heroImageUrl: "/images/Lepidium_meyenii_Maca_0.jpg",
    cardImageUrl: "/images/Lepidium_meyenii_Maca_0.jpg",
    galleryImages: ["/images/Lepidium_meyenii_Maca_0.jpg"],
    cautions: "May affect hormone levels. Monitor if on hormone therapy. Generally safe.",
    productFormulations: [
      { type: "powder", qualityCriteria: "organic, raw", tags: ["organic"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for energy and hormonal balance in traditional Peruvian medicine." }
    ],

    traditionalUses: ["Energy tonic", "Hormonal balance", "Stress adaptation"]
  },
  {
    name: "Siberian Ginseng",
    latinName: "Eleutherococcus senticosus",
    slug: "siberian-ginseng",
    description: "Siberian Ginseng is an adaptogenic herb that helps the body adapt to stress and maintain energy levels.",
    metaTitle: "Siberian Ginseng - Adaptogenic Energy Support",
    metaDescription: "Siberian Ginseng is an adaptogenic herb that helps the body adapt to stress and maintain energy levels.",
    heroImageUrl: "/images/Eleutherococcus_sentic_3.jpg",
    cardImageUrl: "/images/Eleutherococcus_sentic_3.jpg",
    galleryImages: ["/images/Eleutherococcus_sentic_3.jpg"],
    cautions: "May be stimulating. Avoid in the evening. May interact with blood thinners.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 0.8% eleutherosides", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to improve stress resilience and energy in studies." }
    ],

    traditionalUses: ["Stress adaptation", "Energy support", "Adrenal support"]
  },
  {
    name: "Hawthorn",
    latinName: "Crataegus monogyna",
    slug: "hawthorn",
    description: "Hawthorn is a traditional herb used for heart and cardiovascular support.",
    metaTitle: "Hawthorn - Heart and Cardiovascular Support",
    metaDescription: "Hawthorn is a traditional herb used for heart and cardiovascular support.",
    heroImageUrl: "/images/hawthorn.jpg",
    cardImageUrl: "/images/hawthorn.jpg",
    galleryImages: ["/images/hawthorn.jpg"],
    cautions: "May affect blood pressure. Monitor if hypertensive. May interact with heart medications.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 1.8% vitexin", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Multiple studies show effectiveness for cardiovascular support." }
    ],

    traditionalUses: ["Heart support", "Cardiovascular tonic", "Circulation improvement"]
  },
  {
    name: "Willow Bark",
    latinName: "Salix alba",
    slug: "willow-bark",
    description: "Willow Bark is a traditional herb used for pain relief and inflammation reduction.",
    metaTitle: "Willow Bark - Natural Pain Relief",
    metaDescription: "Willow Bark is a traditional herb used for pain relief and inflammation reduction.",
    heroImageUrl: "/images/willow-bark.jpg",
    cardImageUrl: "/images/willow-bark.jpg",
    galleryImages: ["/images/willow-bark.jpg"],
    cautions: "May affect blood clotting. Avoid if on blood thinners. May cause stomach upset.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 15% salicin", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for pain relief in traditional medicine for centuries." }
    ],

    traditionalUses: ["Pain relief", "Inflammation reduction", "Headache relief"]
  },
  {
    name: "Chilli Pepper",
    latinName: "Capsicum annuum",
    slug: "chilli-pepper",
    description: "Chilli Pepper is a traditional herb used for pain relief and circulation support.",
    metaTitle: "Chilli Pepper - Natural Pain Relief",
    metaDescription: "Chilli Pepper is a traditional herb used for pain relief and circulation support.",
    heroImageUrl: "/images/capsaicin.jpg",
    cardImageUrl: "/images/capsaicin.jpg",
    galleryImages: ["/images/capsaicin.jpg"],
    cautions: "May cause burning sensation. Avoid contact with eyes. Test on small area first.",
    productFormulations: [
      { type: "cream", qualityCriteria: "0.025-0.075% capsaicin", tags: ["topical"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Multiple studies show effectiveness for pain relief." }
    ],

    traditionalUses: ["Pain relief", "Muscle relaxation", "Tension reduction"]
  },
  {
    name: "American Ginseng",
    latinName: "Panax quinquefolius",
    slug: "american-ginseng",
    description: "American Ginseng is an adaptogenic herb that helps the body adapt to stress and maintain energy levels.",
    metaTitle: "American Ginseng - Adaptogenic Energy Support",
    metaDescription: "American Ginseng is an adaptogenic herb that helps the body adapt to stress and maintain energy levels.",
    heroImageUrl: "/images/american-ginseng.jpg",
    cardImageUrl: "/images/american-ginseng.jpg",
    galleryImages: ["/images/american-ginseng.jpg"],
    cautions: "May be stimulating. Avoid in the evening. May interact with blood thinners.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 4% ginsenosides", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "clinical", value: "Shown to improve stress resilience and cognitive function in studies." }
    ],

    traditionalUses: ["Stress adaptation", "Energy support", "Cognitive enhancement"]
  },
  {
    name: "Schisandra Berry",
    latinName: "Schisandra chinensis",
    slug: "schisandra-berry",
    description: "Schisandra Berry is an adaptogenic herb used in traditional Chinese medicine for stress adaptation and liver support.",
    metaTitle: "Schisandra Berry - Comprehensive Adaptogenic Herb",
    metaDescription: "Schisandra Berry is an adaptogenic herb used in traditional Chinese medicine for stress adaptation and liver support.",
    heroImageUrl: "/images/Schisandra_chinensis_S_0.jpg",
    cardImageUrl: "/images/Schisandra_chinensis_S_0.jpg",
    galleryImages: ["/images/Schisandra_chinensis_S_0.jpg"],
    cautions: "May affect liver enzymes. Monitor if on liver medications. Generally safe.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 2% schisandrin", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for stress adaptation and liver support in traditional Chinese medicine." }
    ],

    traditionalUses: ["Stress adaptation", "Liver support", "Energy tonic"]
  },
  {
    name: "Astragalus",
    latinName: "Astragalus membranaceus",
    slug: "astragalus",
    description: "Astragalus is an adaptogenic herb used in traditional Chinese medicine for immune support and stress adaptation.",
    metaTitle: "Astragalus - Immune and Stress Support",
    metaDescription: "Astragalus is an adaptogenic herb used in traditional Chinese medicine for immune support and stress adaptation.",
    heroImageUrl: "/images/Astragalus_membranaceu_2.jpg",
    cardImageUrl: "/images/Astragalus_membranaceu_2.jpg",
    galleryImages: ["/images/Astragalus_membranaceu_2.jpg"],
    cautions: "May affect immune function. Avoid if on immunosuppressants. Generally safe.",
    productFormulations: [
      { type: "capsule", qualityCriteria: "standardized to 0.5% astragaloside IV", tags: ["standardized"], affiliateLink: "", price: "" }
    ],
    references: [
      { type: "traditional", value: "Used for immune support and stress adaptation in traditional Chinese medicine." }
    ],

    traditionalUses: ["Immune support", "Stress adaptation", "Energy tonic"]
  }
];

export async function GET() {
  try {
    console.log('Starting herb import via API...');
    
    // Check existing herbs
    const existingHerbs = await prisma.herb.findMany();
    console.log(`Found ${existingHerbs.length} existing herbs`);
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const herb of herbs) {
      // Check if herb already exists
      const existing = await prisma.herb.findFirst({
        where: { name: herb.name }
      });
      
      if (existing) {
        console.log(`Skipping ${herb.name} - already exists`);
        skippedCount++;
        continue;
      }
      
      try {
                 await prisma.herb.create({
           data: {
             name: herb.name,
             latinName: herb.latinName,
             slug: herb.slug,
             description: herb.description,
             metaTitle: herb.metaTitle,
             metaDescription: herb.metaDescription,
             heroImageUrl: herb.heroImageUrl,
             cardImageUrl: herb.cardImageUrl,
             galleryImages: herb.galleryImages,
             cautions: herb.cautions,
             productFormulations: herb.productFormulations,
             references: herb.references,
             traditionalUses: herb.traditionalUses,
           },
         });
        console.log(`Imported herb: ${herb.name}`);
        importedCount++;
      } catch (e) {
        console.error(`Failed to import herb: ${herb.name}`, e);
      }
    }
    
    const finalCount = await prisma.herb.count();
    
    return NextResponse.json({
      success: true,
      message: `Import completed! Imported ${importedCount} herbs, skipped ${skippedCount} existing herbs. Total herbs in database: ${finalCount}`,
      imported: importedCount,
      skipped: skippedCount,
      total: finalCount
    });
    
  } catch (error) {
    console.error('Error during import:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
} 
