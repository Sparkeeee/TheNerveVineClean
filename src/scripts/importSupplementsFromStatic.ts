import { PrismaClient } from '@prisma/client';
import { supplements } from '../data/supplements';

const prisma = new PrismaClient();

// Helper: Generate 4 rich paragraphs for each supplement
function generateDescription(slug: string): string {
  switch (slug) {
    case 'magnesium-glycinate':
      return [
        "Magnesium glycinate is a chelated form of magnesium that is highly regarded for its superior absorption and gentle effect on the digestive system. Unlike other forms of magnesium, such as magnesium oxide or citrate, glycinate is less likely to cause diarrhea, making it a preferred choice for individuals with sensitive stomachs. This supplement is often recommended for those who need to increase their magnesium intake without experiencing unwanted gastrointestinal side effects. Magnesium is an essential mineral involved in hundreds of biochemical reactions in the body, including muscle and nerve function, blood glucose control, and protein synthesis.",
        "One of the primary benefits of magnesium glycinate is its ability to promote relaxation and improve sleep quality. Research has shown that magnesium plays a key role in regulating neurotransmitters that are responsible for calming the mind and body. Many people use magnesium glycinate as a natural remedy for insomnia, anxiety, and muscle cramps, especially when these issues are related to stress or physical exertion. The glycine component itself is an amino acid that also supports relaxation and healthy sleep patterns.",
        "Athletes and active individuals may benefit from magnesium glycinate supplementation due to its role in muscle recovery and energy production. Adequate magnesium levels help prevent muscle cramps, spasms, and fatigue during intense physical activity. Additionally, magnesium supports cardiovascular health by helping to maintain normal blood pressure and heart rhythm. People with chronic conditions such as migraines, fibromyalgia, or type 2 diabetes may also find magnesium glycinate helpful as part of their overall wellness plan.",
        "For best results, magnesium glycinate should be taken consistently, ideally in the evening or before bedtime to maximize its calming effects. It is important to consult with a healthcare provider before starting supplementation, especially for individuals with kidney disease or those taking medications that affect magnesium levels. As with any supplement, quality matters—look for products that are third-party tested and free from unnecessary additives."
      ].join('\n\n');
    case 'l-tryptophan':
      return [
        "L-Tryptophan is an essential amino acid that serves as a precursor to serotonin, a neurotransmitter that influences mood, sleep, and appetite. Because the body cannot produce tryptophan on its own, it must be obtained through diet or supplementation. Foods rich in tryptophan include turkey, eggs, cheese, and nuts, but supplements provide a concentrated dose for those seeking specific health benefits. L-Tryptophan is commonly used to support emotional well-being and healthy sleep cycles.",
        "Supplementing with L-tryptophan may help alleviate symptoms of mild depression and anxiety by increasing serotonin levels in the brain. It is also converted into melatonin, the hormone responsible for regulating the sleep-wake cycle, making it a popular choice for individuals struggling with insomnia or irregular sleep patterns. Clinical studies have shown that L-tryptophan can improve sleep quality, reduce the time it takes to fall asleep, and enhance overall mood.",
        "L-Tryptophan is often recommended for people experiencing stress, low mood, or difficulty relaxing at night. When combined with a healthy lifestyle, it can be a valuable tool for mental and emotional balance. Some research suggests that L-tryptophan may also help reduce carbohydrate cravings and support weight management by promoting satiety. It is important to use L-tryptophan supplements as directed and to consult a healthcare professional if you are taking medications that affect serotonin levels, such as antidepressants.",
        "For optimal absorption, L-tryptophan supplements are best taken on an empty stomach, ideally in the evening or before bedtime. As with any supplement, quality and purity are important—choose products that are third-party tested and free from contaminants. Individuals with liver or kidney disease, or those who are pregnant or breastfeeding, should seek medical advice before using L-tryptophan."
      ].join('\n\n');
    case 'b-complex':
      return [
        "B-Complex vitamins are a group of eight essential nutrients that work together to support energy production, brain function, and overall metabolic health. These water-soluble vitamins include B1 (thiamine), B2 (riboflavin), B3 (niacin), B5 (pantothenic acid), B6 (pyridoxine), B7 (biotin), B9 (folate), and B12 (cobalamin). Each vitamin plays a unique role in maintaining cellular health, supporting the nervous system, and aiding in the conversion of food into usable energy.",
        "Supplementing with a B-Complex can help combat fatigue, improve cognitive performance, and support a healthy nervous system. These vitamins are especially important during periods of stress, physical exertion, or restricted diets, as deficiencies can lead to low energy, poor concentration, and mood disturbances. B vitamins are also involved in the synthesis of neurotransmitters, red blood cell formation, and DNA repair.",
        "Certain populations, such as pregnant women, older adults, and individuals with digestive disorders, may have increased needs for B vitamins. B-Complex supplements can help fill nutritional gaps and ensure adequate intake of all eight vitamins. Some research suggests that B vitamins may also support cardiovascular health by helping to regulate homocysteine levels, a marker associated with heart disease risk.",
        "For best absorption, B-Complex supplements should be taken with food, and it is important to choose products that provide balanced amounts of each vitamin. Look for supplements that are free from artificial colors, flavors, and unnecessary fillers. If you have specific health concerns or are taking medications that may interact with B vitamins, consult with a healthcare provider for personalized advice."
      ].join('\n\n');
    default:
      return "This supplement supports overall wellness and may provide a range of health benefits. Consult a healthcare provider for personalized advice.";
  }
}

async function upsertSupplements() {
  for (const s of supplements) {
    const description = generateDescription(s.slug || '');
    const existing = await prisma.supplement.findFirst({ where: { slug: s.slug } });
    if (existing) {
      await prisma.supplement.update({
        where: { id: existing.id },
        data: {
          name: s.name,
          slug: s.slug,
          description,
          metaTitle: s.metaTitle,
          metaDescription: s.metaDescription,
          heroImageUrl: s.heroImageUrl,
          cardImageUrl: s.cardImageUrl,
          galleryImages: s.galleryImages,
          cautions: s.cautions,
          productFormulations: s.productFormulations,
          references: s.references,
          tags: s.tags,
        },
      });
      console.log(`Updated: ${s.name}`);
    } else {
      await prisma.supplement.create({
        data: {
          name: s.name,
          slug: s.slug,
          description,
          metaTitle: s.metaTitle,
          metaDescription: s.metaDescription,
          heroImageUrl: s.heroImageUrl,
          cardImageUrl: s.cardImageUrl,
          galleryImages: s.galleryImages,
          cautions: s.cautions,
          productFormulations: s.productFormulations,
          references: s.references,
          tags: s.tags,
        },
      });
      console.log(`Created: ${s.name}`);
    }
  }
  await prisma.$disconnect();
}

upsertSupplements().then(() => {
  console.log('Supplement import/update complete.');
  process.exit(0);
}).catch((err) => {
  console.error('Error importing supplements:', err);
  process.exit(1);
}); 