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
    }[];
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
      affiliates: [
        {
          name: "Nature's Way Korean Ginseng",
          url: "https://amzn.to/natures-way-ginseng",
          price: "$24.99",
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
      affiliates: [
        {
          name: "Traditional Medicinals Passionflower",
          url: "https://amzn.to/traditional-passionflower",
          price: "$5.99",
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
      affiliates: [
        {
          name: "Nature's Way Ginkgo Biloba",
          url: "https://amzn.to/natures-way-ginkgo",
          price: "$18.99",
        },
      ],
    },
  ];
  