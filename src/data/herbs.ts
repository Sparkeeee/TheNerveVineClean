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
          url: "https://www.gaiaherbs.com/products/lemon-balm",
          price: "£17.99",
        },
      ],
    },
  ];
  