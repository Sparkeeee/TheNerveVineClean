export type Herb = {
    name: string;
    slug: string;
    actions: string[];
    usedFor: string[];
    mechanism: string;
    description: string;
    image: string;
    affiliates: {
      name: string;
      url: string;
      price?: string;
      image?: string;
      description?: string;
    }[];
    subtitle?: string;
    benefits?: string[];
    traditionalUses?: string[];
    safety?: string;
    preparation?: string;
  };
  
  export const herbs: Herb[] = [
    {
      name: "Lemon Balm",
      slug: "lemon-balm",
      actions: ["nervine", "carminative", "mild sedative"],
      usedFor: ["anxiety", "digestive tension", "restlessness"],
      mechanism: "GABAergic, antispasmodic",
      description:
        "Lemon Balm is a calming herb used to ease stress and digestive issues. It supports the parasympathetic nervous system and helps reduce tension.",
      image: "/lemon-balm.jpg",
      benefits: [
        "Calms the nervous system and reduces anxiety",
        "Eases digestive discomfort",
        "Supports restful sleep",
        "May improve mood and cognitive function"
      ],
      traditionalUses: [
        "Stress and anxiety relief",
        "Digestive upset",
        "Mild insomnia",
        "Mood enhancement"
      ],
      safety: "Generally safe. May cause mild sedation. Consult a healthcare provider if pregnant or taking thyroid medication.",
      preparation: "Tea: 1-2 tsp dried leaves per cup, steep 5-10 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Gaia Herbs Lemon Balm",
          url: "https://amzn.to/gaia-lemon-balm",
          price: "$17.99",
        },
      ],
    },
    {
      name: "Chamomile",
      slug: "chamomile",
      actions: ["nervine", "carminative", "anti-inflammatory"],
      usedFor: ["anxiety", "insomnia", "digestive issues"],
      mechanism: "GABAergic, antispasmodic",
      description:
        "Chamomile is a gentle, calming herb that promotes relaxation and sleep. It's particularly effective for anxiety and digestive discomfort.",
      image: "/chamomile.jpg",
      benefits: [
        "Promotes relaxation and restful sleep",
        "Eases digestive upset and cramps",
        "Reduces anxiety and stress",
        "Soothes mild inflammation"
      ],
      traditionalUses: [
        "Sleep aid",
        "Digestive tonic",
        "Calming children",
        "Relief of mild pain or inflammation"
      ],
      safety: "Generally safe. Rare allergy in those sensitive to ragweed. May increase drowsiness with sedatives.",
      preparation: "Tea: 1-2 tsp dried flowers per cup, steep 5-10 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Traditional Medicinals Chamomile",
          url: "https://amzn.to/traditional-chamomile",
          price: "$5.99",
        },
      ],
    },
    {
      name: "Lavender",
      slug: "lavender",
      actions: ["nervine", "antispasmodic", "antimicrobial"],
      usedFor: ["anxiety", "insomnia", "skin conditions"],
      mechanism: "GABAergic, anxiolytic",
      description:
        "Lavender is a versatile herb known for its calming aroma and relaxing properties. It supports nervous system health and promotes restful sleep.",
      image: "/lavender.jpg",
      benefits: [
        "Reduces anxiety and stress",
        "Promotes restful sleep",
        "Soothes headaches and tension",
        "Supports skin healing and reduces irritation"
      ],
      traditionalUses: [
        "Aromatherapy for relaxation",
        "Sleep aid",
        "Topical use for skin health",
        "Headache relief"
      ],
      safety: "Generally safe. May cause mild GI upset. Essential oil should not be ingested.",
      preparation: "Tea: 1 tsp dried flowers per cup, steep 5-10 minutes. Essential oil: diffuse or dilute for topical use.",
      affiliates: [
        {
          name: "doTERRA Lavender Essential Oil",
          url: "https://amzn.to/doterra-lavender",
          price: "$28.99",
        },
      ],
    },
    {
      name: "St. John's Wort",
      slug: "st-johns-wort",
      actions: ["nervine", "antidepressant", "anti-inflammatory"],
      usedFor: ["depression", "anxiety", "nerve pain"],
      mechanism: "Serotonergic, MAO inhibition",
      description:
        "St. John's Wort is a traditional herb used for mood support and nervous system health. It's particularly effective for mild to moderate depression.",
      image: "/st-johns-wort.jpg",
      benefits: [
        "Supports mood and emotional balance",
        "Reduces mild to moderate depression symptoms",
        "Eases nerve pain and tension",
        "Anti-inflammatory properties"
      ],
      traditionalUses: [
        "Mood enhancement",
        "Nerve pain relief",
        "Wound healing (topical)"
      ],
      safety: "May interact with many medications. Increases sun sensitivity. Not recommended during pregnancy.",
      preparation: "Capsules: 300mg 1-3 times daily. Tea: 1-2 tsp dried herb per cup, steep 5-10 minutes.",
      affiliates: [
        {
          name: "Nature's Way St. John's Wort",
          url: "https://amzn.to/natures-way-st-johns-wort",
          price: "$16.99",
        },
      ],
    },
    {
      name: "Ashwagandha",
      slug: "ashwagandha",
      actions: ["adaptogen", "nervine", "immunomodulator"],
      usedFor: ["stress", "fatigue", "adrenal support"],
      mechanism: "Cortisol regulation, GABAergic",
      description:
        "Ashwagandha is a powerful adaptogenic herb that helps the body adapt to stress and supports adrenal gland function.",
      image: "/ashwagandha.jpg",
      benefits: [
        "Reduces stress and anxiety",
        "Supports adrenal health",
        "Improves energy and stamina",
        "Enhances sleep quality",
        "May support thyroid function"
      ],
      traditionalUses: [
        "Stress adaptation",
        "Fatigue and low energy",
        "Sleep support",
        "Male reproductive health"
      ],
      safety: "Generally safe. May cause mild GI upset. Avoid in hyperthyroidism or during pregnancy unless supervised.",
      preparation: "Capsules: 300-600mg daily. Powder: 1-2 tsp in warm milk. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Organic India Ashwagandha",
          url: "https://amzn.to/organic-india-ashwagandha",
          price: "$24.99",
        },
      ],
    },
    {
      name: "Rhodiola Rosea",
      slug: "rhodiola",
      actions: ["adaptogen", "nervine", "cognitive enhancer"],
      usedFor: ["fatigue", "stress", "cognitive function"],
      mechanism: "Dopaminergic, serotonergic",
      description:
        "Rhodiola Rosea is an adaptogenic herb that improves mental and physical performance while reducing fatigue and stress.",
      image: "/rhodiola.jpg",
      benefits: [
        "Boosts mental and physical stamina",
        "Reduces fatigue and stress",
        "Enhances cognitive function",
        "Supports mood balance"
      ],
      traditionalUses: [
        "Fatigue and low energy",
        "Stress adaptation",
        "Cognitive enhancement",
        "Mood support"
      ],
      safety: "Generally safe. May cause mild stimulation. Avoid in bipolar disorder. Start with low dose.",
      preparation: "Capsules: 200-400mg daily. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "NOW Foods Rhodiola Rosea",
          url: "https://amzn.to/now-rhodiola",
          price: "$19.99",
        },
      ],
    },
    {
      name: "Holy Basil (Tulsi)",
      slug: "holy-basil",
      actions: ["adaptogen", "nervine", "immunomodulator"],
      usedFor: ["stress", "anxiety", "immune support"],
      mechanism: "Cortisol regulation, GABAergic",
      description:
        "Holy Basil is a sacred herb in Ayurvedic medicine that promotes mental clarity and helps the body adapt to stress.",
      image: "/holy-basil.jpg",
      benefits: [
        "Reduces stress and anxiety",
        "Supports immune function",
        "Promotes mental clarity",
        "May help balance blood sugar"
      ],
      traditionalUses: [
        "Stress adaptation",
        "Immune support",
        "Respiratory health",
        "Digestive aid"
      ],
      safety: "Generally safe. May lower blood sugar. Consult a healthcare provider if pregnant or on medication.",
      preparation: "Tea: 1-2 tsp dried leaves per cup, steep 5-10 minutes. Capsules: 300-500mg daily.",
      affiliates: [
        {
          name: "Organic India Tulsi Tea",
          url: "https://amzn.to/organic-india-tulsi",
          price: "$8.99",
        },
      ],
    },
    {
      name: "Licorice Root",
      slug: "licorice-root",
      actions: ["adrenal tonic", "demulcent", "expectorant"],
      usedFor: ["adrenal fatigue", "digestive issues", "respiratory support"],
      mechanism: "Cortisol potentiation, anti-inflammatory",
      description:
        "Licorice Root supports adrenal gland function and is particularly effective for adrenal fatigue and digestive health.",
      image: "/licorice-root.jpg",
      benefits: [
        "Supports adrenal health and energy",
        "Soothes digestive tract",
        "Eases respiratory discomfort",
        "Anti-inflammatory properties"
      ],
      traditionalUses: [
        "Adrenal fatigue",
        "Digestive upset",
        "Coughs and sore throat"
      ],
      safety: "Avoid in high blood pressure or with potassium-lowering drugs. Not for long-term use without supervision.",
      preparation: "Tea: 1 tsp dried root per cup, steep 10-15 minutes. Capsules: 200-400mg daily.",
      affiliates: [
        {
          name: "Traditional Medicinals Licorice Root",
          url: "https://amzn.to/traditional-licorice",
          price: "$6.99",
        },
      ],
    },
    {
      name: "Ginseng",
      slug: "ginseng",
      actions: ["adaptogen", "nervine", "immunomodulator"],
      usedFor: ["fatigue", "stress", "cognitive function"],
      mechanism: "Ginsenosides, adaptogenic",
      description:
        "Ginseng is a revered adaptogenic herb that enhances energy, mental clarity, and overall vitality.",
      image: "/ginseng.jpg",
      benefits: [
        "Enhances energy and stamina",
        "Improves mental clarity",
        "Supports stress adaptation",
        "Boosts immune function",
        "May improve cognitive function",
        "Supports overall vitality"
      ],
      traditionalUses: [
        "Fatigue and low energy",
        "Mental and physical stress",
        "Cognitive enhancement",
        "Immune system support",
        "Sexual vitality",
        "Recovery from illness"
      ],
      safety: "Generally safe for most adults. May cause mild stimulation. Consult a healthcare provider if pregnant, nursing, or taking medications.",
      preparation: "Capsules: 200-400mg daily. Tea: 1 tsp dried root per cup, steep 10-15 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Nature's Way Korean Ginseng",
          url: "https://amzn.to/natures-way-ginseng",
          price: "$24.99",
        },
      ],
    },
    {
      name: "Feverfew",
      slug: "feverfew",
      actions: ["anti-inflammatory", "antispasmodic", "nervine"],
      usedFor: ["migraines", "headaches", "inflammation"],
      mechanism: "Parthenolide, serotonin inhibition",
      description:
        "Feverfew is a traditional herb specifically used for migraine prevention and relief. It reduces inflammation and prevents blood vessel constriction in the brain.",
      image: "/feverfew.jpg",
      benefits: [
        "Reduces frequency and severity of migraines",
        "Eases headache pain",
        "Anti-inflammatory properties",
        "May help with menstrual discomfort"
      ],
      traditionalUses: [
        "Migraine prevention",
        "Headache relief",
        "Inflammation reduction"
      ],
      safety: "Generally safe. May cause mouth ulcers or digestive upset in sensitive individuals. Not recommended during pregnancy.",
      preparation: "Capsules: 100-300mg daily. Tea: 1-2 tsp dried leaves per cup, steep 5-10 minutes.",
      affiliates: [
        {
          name: "Nature's Way Feverfew",
          url: "https://amzn.to/natures-way-feverfew",
          price: "$12.99",
        },
      ],
    },
    {
      name: "Passionflower",
      slug: "passionflower",
      actions: ["nervine", "sedative", "antispasmodic"],
      usedFor: ["anxiety", "insomnia", "nervous tension"],
      mechanism: "GABAergic, MAO inhibition",
      description:
        "Passionflower is a gentle nervine herb that promotes calm and relaxation, particularly effective for anxiety and sleep.",
      image: "/passionflower.jpg",
      benefits: [
        "Promotes relaxation and calm",
        "Supports restful sleep",
        "Eases nervous tension",
        "May reduce mild pain or spasms"
      ],
      traditionalUses: [
        "Sleep aid",
        "Anxiety relief",
        "Muscle relaxation"
      ],
      safety: "Generally safe. May increase drowsiness with sedatives. Avoid in pregnancy unless supervised.",
      preparation: "Tea: 1-2 tsp dried herb per cup, steep 5-10 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Traditional Medicinals Passionflower",
          url: "https://amzn.to/traditional-passionflower",
          price: "$5.99",
        },
      ],
    },
    {
      name: "Damiana",
      slug: "damiana",
      actions: ["nervine", "aphrodisiac", "mood enhancer"],
      usedFor: ["mood enhancement", "libido", "energy", "anxiety"],
      mechanism: "Serotonergic, dopaminergic",
      description:
        "Damiana is a traditional herb known for its mood-enhancing and aphrodisiac properties. It supports emotional well-being and may enhance libido and energy.",
      image: "/damiana.jpg",
      benefits: [
        "Enhances mood and emotional balance",
        "Supports libido and sexual health",
        "May boost energy and stamina",
        "Eases mild anxiety"
      ],
      traditionalUses: [
        "Mood enhancement",
        "Aphrodisiac",
        "Nervous system tonic"
      ],
      safety: "Generally safe. May cause mild GI upset. Avoid in pregnancy.",
      preparation: "Tea: 1-2 tsp dried leaves per cup, steep 5-10 minutes. Capsules: 200-400mg daily.",
      affiliates: [
        {
          name: "Nature's Way Damiana",
          url: "https://amzn.to/natures-way-damiana",
          price: "$13.99",
        },
      ],
    },
    {
      name: "Skullcap",
      slug: "skullcap",
      actions: ["nervine", "sedative", "antispasmodic"],
      usedFor: ["anxiety", "nervous tension", "muscle spasms"],
      mechanism: "GABAergic, muscle relaxant",
      description:
        "Skullcap is a traditional nervine herb that calms the nervous system and reduces anxiety and tension.",
      image: "/skullcap.jpg",
      benefits: [
        "Calms anxiety and nervous tension",
        "Relaxes muscles and reduces spasms",
        "Supports restful sleep",
        "May ease mild pain"
      ],
      traditionalUses: [
        "Anxiety relief",
        "Muscle relaxation",
        "Sleep support"
      ],
      safety: "Generally safe. May increase drowsiness with sedatives. Avoid in pregnancy.",
      preparation: "Tea: 1-2 tsp dried herb per cup, steep 5-10 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Herb Pharm Skullcap",
          url: "https://amzn.to/herb-pharm-skullcap",
          price: "$18.99",
        },
      ],
    },
    {
      name: "Motherwort",
      slug: "motherwort",
      actions: ["nervine", "cardiotonic", "emmenagogue"],
      usedFor: ["anxiety", "heart palpitations", "nervous tension"],
      mechanism: "Cardiotonic, nervine",
      description:
        "Motherwort is a heart-supporting herb that calms anxiety and heart palpitations while supporting nervous system health.",
      image: "/motherwort.jpg",
      benefits: [
        "Calms anxiety and nervous tension",
        "Supports heart health",
        "Eases palpitations",
        "May help with menstrual discomfort"
      ],
      traditionalUses: [
        "Heart tonic",
        "Anxiety relief",
        "Menstrual support"
      ],
      safety: "Avoid in pregnancy. May increase bleeding risk. Consult a healthcare provider if on medication.",
      preparation: "Tea: 1-2 tsp dried herb per cup, steep 5-10 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Herb Pharm Motherwort",
          url: "https://amzn.to/herb-pharm-motherwort",
          price: "$17.99",
        },
      ],
    },
    {
      name: "Oatstraw",
      slug: "oatstraw",
      actions: ["nervine", "demulcent", "tonic"],
      usedFor: ["nervous system support", "stress", "convalescence"],
      mechanism: "Nervine tonic, nutritive",
      description:
        "Oatstraw is a gentle, nourishing herb that supports nervous system health and promotes calm and vitality.",
      image: "/oatstraw.jpg",
      benefits: [
        "Nourishes and calms the nervous system",
        "Supports recovery from stress",
        "Promotes vitality and energy",
        "May ease mild anxiety"
      ],
      traditionalUses: [
        "Nervous system tonic",
        "Stress recovery",
        "Convalescence support"
      ],
      safety: "Generally safe. Rare allergy in those with oat sensitivity.",
      preparation: "Tea: 1-2 tsp dried straw per cup, steep 10-15 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Herb Pharm Oatstraw",
          url: "https://amzn.to/herb-pharm-oatstraw",
          price: "$16.99",
        },
      ],
    },
    {
      name: "Valerian Root",
      slug: "valerian",
      actions: ["nervine", "sedative", "antispasmodic"],
      usedFor: ["insomnia", "anxiety", "restlessness"],
      mechanism: "GABAergic, valerenic acid",
      description:
        "Valerian Root is a traditional sleep aid that promotes deep, restful sleep and reduces anxiety.",
      image: "/valerian.jpg",
      benefits: [
        "Promotes deep, restful sleep",
        "Reduces anxiety and restlessness",
        "Relaxes muscles and eases tension",
        "May help with mild pain or cramps"
      ],
      traditionalUses: [
        "Sleep aid",
        "Anxiety relief",
        "Muscle relaxation"
      ],
      safety: "May cause drowsiness. Avoid with alcohol or sedatives. Not recommended during pregnancy.",
      preparation: "Tea: 1 tsp dried root per cup, steep 10-15 minutes. Tincture: 30-60 drops 1-2 times daily.",
      affiliates: [
        {
          name: "Nature's Way Valerian Root",
          url: "https://amzn.to/natures-way-valerian",
          price: "$14.99",
        },
      ],
    },
    {
      name: "Ginkgo Biloba",
      slug: "ginkgo",
      actions: ["nervine", "cerebrotonic", "vasodilator"],
      usedFor: ["memory", "cognitive function", "circulation"],
      mechanism: "Ginkgolides, bilobalide, vasodilation",
      description:
        "Ginkgo Biloba is a powerful cognitive enhancer that improves memory, concentration, and blood circulation to the brain.",
      image: "/ginkgo.jpg",
      benefits: [
        "Enhances memory and cognitive function",
        "Improves circulation to the brain",
        "Supports mental clarity",
        "May help with mild anxiety"
      ],
      traditionalUses: [
        "Memory enhancement",
        "Cognitive support",
        "Circulatory tonic"
      ],
      safety: "May increase bleeding risk. Consult a healthcare provider if on blood thinners. Not recommended during pregnancy.",
      preparation: "Capsules: 60-120mg daily. Tea: 1-2 tsp dried leaves per cup, steep 5-10 minutes.",
      affiliates: [
        {
          name: "Nature's Way Ginkgo Biloba",
          url: "https://amzn.to/natures-way-ginkgo",
          price: "$18.99",
        },
      ],
    },
    {
      name: "Butterbur",
      slug: "butterbur",
      actions: ["antispasmodic", "anti-inflammatory", "nervine"],
      usedFor: ["migraines", "allergies", "respiratory support"],
      mechanism: "Petasin, isopetasin, vasodilation",
      description:
        "Butterbur is a traditional herb that reduces migraine frequency and supports respiratory health through its anti-inflammatory properties.",
      image: "/butterbur.jpg",
      benefits: [
        "Reduces migraine frequency",
        "Supports respiratory health",
        "Anti-inflammatory properties",
        "May help with allergies"
      ],
      traditionalUses: [
        "Migraine prevention",
        "Respiratory support",
        "Allergy relief"
      ],
      safety: "Use only PA-free extracts. May cause GI upset. Consult a healthcare provider before use.",
      preparation: "Capsules: 50-75mg twice daily. Tea: 1 tsp dried root per cup, steep 10-15 minutes.",
      affiliates: [
        {
          name: "Nature's Way Butterbur",
          url: "https://amzn.to/natures-way-butterbur",
          price: "$24.99",
        },
      ],
    },
    {
      name: "Maca",
      slug: "maca",
      actions: ["adaptogen", "vitality enhancer", "hormonal support"],
      usedFor: ["energy", "stress adaptation", "hormonal balance", "vitality"],
      mechanism: "Adaptogenic, hormonal modulation, nutrient dense",
      description:
        "Maca is a powerful adaptogenic root that supports natural energy, stress adaptation, and hormonal balance, traditionally used for vitality and well-being.",
      image: "/maca.jpg",
      benefits: [
        "Boosts energy and stamina",
        "Supports hormonal balance",
        "Enhances mood and vitality",
        "May improve fertility"
      ],
      traditionalUses: [
        "Vitality enhancement",
        "Hormonal support",
        "Fertility and reproductive health"
      ],
      safety: "Generally safe. May cause mild GI upset. Consult a healthcare provider if pregnant or on medication.",
      preparation: "Powder: 1-2 tsp daily in smoothies. Capsules: 500-1000mg daily.",
      affiliates: [
        {
          name: "Navitas Organics Maca Powder",
          url: "https://amzn.to/navitas-maca",
          price: "$19.99",
        },
      ],
    },
    {
      name: "Siberian Ginseng (Eleuthero)",
      slug: "siberian-ginseng",
      actions: ["adaptogen", "immune tonic", "energy booster"],
      usedFor: ["fatigue", "stress", "immune support"],
      mechanism: "Enhances resilience to stress via HPA axis modulation; supports immune function.",
      description:
        "Siberian Ginseng (Eleutherococcus senticosus) is a classic adaptogen used to increase energy, stamina, and resistance to stress. It is also valued for supporting immune health and recovery.",
      image: "/siberian-ginseng.jpg",
      benefits: [
        "Enhances resilience to stress and fatigue",
        "Supports immune function and recovery",
        "Improves stamina and endurance",
        "May boost mental performance",
        "Promotes overall vitality"
      ],
      traditionalUses: [
        "Fatigue and low energy",
        "Recovery from illness",
        "Immune system support",
        "Adaptation to physical and mental stress"
      ],
      safety: "Generally well tolerated. May cause mild stimulation. Consult a healthcare provider if pregnant, nursing, or taking medications.",
      preparation: "Capsules: 200-400mg daily. Tincture: 30-60 drops 1-2 times daily. Tea: 1 tsp dried root per cup, steep 10-15 minutes.",
      affiliates: [
        {
          name: "Gaia Herbs Siberian Eleuthero Root",
          url: "https://amzn.to/gaia-siberian-eleuthero",
          price: "$19.99",
        },
      ],
    },
    {
      name: "Hawthorn",
      slug: "hawthorn",
      actions: ["cardiotonic", "antioxidant", "circulatory tonic"],
      usedFor: ["heart health", "circulation", "mild hypertension"],
      mechanism: "Flavonoids and procyanidins support heart function and blood vessel health.",
      description:
        "Hawthorn (Crataegus spp.) is a traditional heart tonic used to support cardiovascular health, improve circulation, and strengthen blood vessels.",
      image: "/hawthorn.jpg",
      benefits: [
        "Supports healthy heart function",
        "Improves circulation",
        "Strengthens blood vessels",
        "Rich in antioxidants",
        "May help with mild hypertension"
      ],
      traditionalUses: [
        "Heart tonic",
        "Circulatory support",
        "Recovery from heart-related illness"
      ],
      safety: "Generally safe. May interact with heart medications. Consult a healthcare provider if taking prescription drugs.",
      preparation: "Capsules: 250-500mg 2-3 times daily. Tea: 1-2 tsp dried berries per cup, steep 10-15 minutes.",
      affiliates: [
        {
          name: "Gaia Herbs Hawthorn Supreme",
          url: "https://amzn.to/gaia-hawthorn",
          price: "$21.99",
        },
      ],
    },
    {
      name: "Willow Bark",
      slug: "willow-bark",
      actions: ["analgesic", "anti-inflammatory", "antipyretic"],
      usedFor: ["pain relief", "inflammation", "fever"],
      mechanism: "Salicin and related compounds reduce pain and inflammation.",
      description:
        "Willow Bark (Salix alba) is a natural source of salicin, traditionally used for pain relief, reducing inflammation, and lowering fever.",
      image: "/willow-bark.jpg",
      benefits: [
        "Reduces pain and inflammation",
        "May lower fever",
        "Natural alternative to aspirin",
        "Supports joint health"
      ],
      traditionalUses: [
        "Headaches",
        "Muscle and joint pain",
        "Fever reduction"
      ],
      safety: "Avoid if allergic to aspirin or on blood thinners. Not recommended for children with viral infections.",
      preparation: "Capsules: 240mg salicin daily. Tea: 1-2 tsp dried bark per cup, steep 10-15 minutes.",
      affiliates: [
        {
          name: "Nature's Way Willow Bark",
          url: "https://amzn.to/natures-way-willow-bark",
          price: "$12.99",
        },
      ],
    },
    {
      name: "Capsaicin (Chilli Extract)",
      slug: "capsaicin",
      actions: ["analgesic", "circulatory stimulant", "metabolic enhancer"],
      usedFor: ["pain relief", "circulation", "metabolism"],
      mechanism: "Capsaicin activates TRPV1 receptors, increasing circulation and reducing pain signals.",
      description:
        "Capsaicin (from Capsicum spp.) is the active compound in chilli peppers, used to relieve pain, boost circulation, and enhance metabolism.",
      image: "/capsaicin.jpg",
      benefits: [
        "Relieves pain when used topically",
        "Boosts circulation",
        "Enhances metabolism",
        "May support weight management"
      ],
      traditionalUses: [
        "Topical pain relief",
        "Circulatory support",
        "Digestive stimulant"
      ],
      safety: "May cause burning sensation. Avoid contact with eyes and mucous membranes. Not for use on broken skin.",
      preparation: "Topical cream: apply as directed. Capsules: 100-200mg daily. Use gloves when handling extracts.",
      affiliates: [
        {
          name: "NOW Foods Cayenne Capsaicin",
          url: "https://amzn.to/now-cayenne-capsaicin",
          price: "$9.99",
        },
      ],
    },
    {
      name: "American Ginseng",
      slug: "american-ginseng",
      actions: ["adaptogen", "immune tonic", "energy booster"],
      usedFor: ["fatigue", "immune support", "cognitive function"],
      mechanism: "Ginsenosides support stress adaptation and immune function.",
      description:
        "American Ginseng (Panax quinquefolius) is a North American adaptogen valued for its ability to boost energy, support immune health, and enhance mental performance.",
      image: "/american-ginseng.jpg",
      benefits: [
        "Boosts energy and stamina",
        "Supports immune function",
        "Enhances cognitive performance",
        "Promotes stress adaptation"
      ],
      traditionalUses: [
        "Fatigue and weakness",
        "Immune system support",
        "Cognitive enhancement"
      ],
      safety: "Generally safe. May cause mild stimulation. Consult a healthcare provider if pregnant, nursing, or taking medications.",
      preparation: "Capsules: 200-400mg daily. Tea: 1 tsp dried root per cup, steep 10-15 minutes.",
      affiliates: [
        {
          name: "NOW Foods American Ginseng",
          url: "https://amzn.to/now-american-ginseng",
          price: "$19.99",
        },
      ],
    },
    {
      name: "Astragalus Root",
      slug: "astragalus",
      actions: ["immune tonic", "adaptogen", "anti-inflammatory"],
      usedFor: ["immune support", "fatigue", "recovery"],
      mechanism: "Polysaccharides and saponins modulate immune response and support vitality.",
      description:
        "Astragalus (Astragalus membranaceus) is a foundational herb in Traditional Chinese Medicine, prized for its ability to strengthen the immune system, boost energy, and support recovery from illness or stress.",
      image: "/astragalus.jpg",
      benefits: [
        "Strengthens immune function",
        "Supports recovery from illness",
        "Boosts energy and stamina",
        "Anti-inflammatory properties"
      ],
      traditionalUses: [
        "Immune tonic",
        "Recovery support",
        "Vitality enhancement"
      ],
      safety: "Generally safe. Avoid in acute infections or with immunosuppressive drugs.",
      preparation: "Tea: 1-2 tsp dried root per cup, simmer 20-30 minutes. Capsules: 500-1000mg daily.",
      affiliates: [
        {
          name: "Nature's Way Astragalus Root",
          url: "https://amzn.to/natures-way-astragalus",
          price: "$14.99",
        },
      ],
    },
  ];
  