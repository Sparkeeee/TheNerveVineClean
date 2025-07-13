"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Search data types
interface SearchItem {
  id: string;
  title: string;
  description: string;
  type: 'herb' | 'supplement' | 'symptom';
  slug: string;
  tags: string[];
  benefits?: string[];
  symptoms?: string[];
}

// Search data - this would ideally come from your actual data files
const searchData: SearchItem[] = [
  // Herbs
  {
    id: 'lemon-balm',
    title: 'Lemon Balm',
    description: 'Calming herb used to ease stress and digestive issues',
    type: 'herb',
    slug: '/herbs/lemon-balm',
    tags: ['anxiety', 'stress', 'digestive', 'calming', 'nervine', 'sleep', 'melissa officinalis', 'balm', 'melissa'],
    benefits: ['Reduces anxiety and stress', 'Promotes restful sleep', 'Supports digestive health']
  },
  {
    id: 'chamomile',
    title: 'Chamomile',
    description: 'Gentle herb known for its calming properties',
    type: 'herb',
    slug: '/herbs/chamomile',
    tags: ['sleep', 'anxiety', 'digestive', 'calming', 'gentle', 'matricaria chamomilla', 'german chamomile'],
    benefits: ['Promotes deep, restful sleep', 'Soothes digestive discomfort', 'Reduces anxiety and stress']
  },
  {
    id: 'lavender',
    title: 'Lavender',
    description: 'Versatile herb known for relaxation and sleep',
    type: 'herb',
    slug: '/herbs/lavender',
    tags: ['sleep', 'relaxation', 'anxiety', 'aromatherapy', 'calming', 'lavandula angustifolia', 'english lavender'],
    benefits: ['Promotes deep relaxation and sleep', 'Reduces anxiety and stress', 'Soothes skin irritation']
  },
  {
    id: 'valerian',
    title: 'Valerian Root',
    description: 'Natural sleep aid and sedative herb',
    type: 'herb',
    slug: '/herbs/valerian',
    tags: ['sleep', 'insomnia', 'sedative', 'calming', 'rest', 'valeriana officinalis', 'garden valerian'],
    benefits: ['Promotes deep, restful sleep', 'Reduces time to fall asleep', 'Improves sleep quality']
  },
  {
    id: 'st-johns-wort',
    title: "St. John's Wort",
    description: 'Traditional herb for mood support and emotional balance',
    type: 'herb',
    slug: '/herbs/st-johns-wort',
    tags: ['depression', 'mood', 'emotional', 'nervous system', 'balance', 'hypericum perforatum', 'goatweed', 'klamath weed'],
    benefits: ['Supports emotional well-being', 'May help with mild to moderate depression', 'Promotes positive mood']
  },
  {
    id: 'ashwagandha',
    title: 'Ashwagandha',
    description: 'Powerful adaptogenic herb for stress and energy',
    type: 'herb',
    slug: '/herbs/ashwagandha',
    tags: ['stress', 'adaptogen', 'energy', 'anxiety', 'immune', 'withania somnifera', 'indian ginseng', 'winter cherry'],
    benefits: ['Reduces stress and anxiety', 'Supports energy and stamina', 'Promotes restful sleep']
  },
  {
    id: 'korean-ginseng',
    title: 'Korean Ginseng',
    description: 'Traditional herb for energy and vitality',
    type: 'herb',
    slug: '/herbs/korean-ginseng',
    tags: ['energy', 'vitality', 'adaptogen', 'immune', 'focus', 'panax ginseng', 'asian ginseng', 'korean ginseng'],
    benefits: ['Boosts energy and vitality', 'Supports immune function', 'Improves mental focus']
  },
  {
    id: 'siberian-ginseng',
    title: 'Siberian Ginseng',
    description: 'Adaptogenic herb for stress resistance and energy',
    type: 'herb',
    slug: '/herbs/siberian-ginseng',
    tags: ['adaptogen', 'stress', 'energy', 'immune', 'resistance', 'eleutherococcus senticosus', 'eleuthero', 'devil\'s shrub'],
    benefits: ['Increases stress resistance', 'Boosts energy and stamina', 'Supports immune system function']
  },
  {
    id: 'astragalus',
    title: 'Astragalus',
    description: 'Traditional herb for immune support and vitality',
    type: 'herb',
    slug: '/herbs/astragalus',
    tags: ['immune', 'vitality', 'traditional', 'energy', 'health', 'astragalus membranaceus', 'huang qi', 'milk vetch'],
    benefits: ['Supports immune system function', 'Promotes vitality and energy', 'Traditional immune-supporting herb']
  },
  {
    id: 'holy-basil',
    title: 'Holy Basil (Tulsi)',
    description: 'Sacred herb for stress adaptation and mental clarity',
    type: 'herb',
    slug: '/herbs/holy-basil',
    tags: ['stress', 'clarity', 'adaptogen', 'immune', 'spiritual', 'ocimum sanctum', 'tulsi', 'sacred basil'],
    benefits: ['Reduces stress and anxiety', 'Promotes mental clarity', 'Supports immune function']
  },
  {
    id: 'reishi',
    title: 'Reishi',
    description: 'Medicinal mushroom known as the "mushroom of immortality"',
    type: 'herb',
    slug: '/herbs/reishi',
    tags: ['immune', 'adaptogen', 'longevity', 'stress', 'mushroom', 'ganoderma lucidum', 'lingzhi', 'mushroom of immortality'],
    benefits: ['Supports immune system function', 'Reduces stress and fatigue', 'Promotes longevity and vitality']
  },
  {
    id: 'lions-mane',
    title: "Lion's Mane",
    description: 'Medicinal mushroom for brain health and cognitive function',
    type: 'herb',
    slug: '/herbs/lions-mane',
    tags: ['brain', 'cognitive', 'memory', 'focus', 'mushroom', 'nervous system', 'hericium erinaceus', 'bearded tooth', 'pom pom mushroom'],
    benefits: ['Supports brain health and cognitive function', 'May improve memory and focus', 'Supports nervous system health']
  },
  {
    id: 'damiana',
    title: 'Damiana',
    description: 'Traditional herb for mood enhancement and aphrodisiac properties',
    type: 'herb',
    slug: '/herbs/damiana',
    tags: ['mood', 'aphrodisiac', 'energy', 'libido', 'traditional', 'turnera diffusa', 'old woman\'s broom'],
    benefits: ['Supports mood and emotional well-being', 'May enhance libido and energy', 'Traditional aphrodisiac herb']
  },
  {
    id: 'oatstraw',
    title: 'Oatstraw',
    description: 'Nervine herb known for its calming and nutritive properties',
    type: 'herb',
    slug: '/herbs/oatstraw',
    tags: ['nervine', 'calming', 'nutritive', 'stress', 'nervous system', 'avena sativa', 'wild oats', 'oat tops'],
    benefits: ['Calms the nervous system', 'Provides nutritive support', 'Reduces stress and anxiety']
  },
  {
    id: 'skullcap',
    title: 'Skullcap',
    description: 'Nervine herb for anxiety, stress, and nervous system support',
    type: 'herb',
    slug: '/herbs/skullcap',
    tags: ['nervine', 'anxiety', 'stress', 'nervous system', 'calming', 'scutellaria lateriflora', 'american skullcap', 'mad dog skullcap'],
    benefits: ['Reduces anxiety and nervous tension', 'Supports nervous system health', 'Promotes calm and relaxation']
  },
  {
    id: 'korean-ginseng',
    title: 'Korean Ginseng (Panax)',
    description: 'Traditional adaptogenic herb for energy and vitality',
    type: 'herb',
    slug: '/herbs/korean-ginseng',
    tags: ['adaptogen', 'energy', 'vitality', 'immune', 'traditional', 'panax ginseng', 'asian ginseng', 'true ginseng'],
    benefits: ['Boosts energy and stamina', 'Supports immune function', 'Improves mental and physical performance']
  },
  {
    id: 'siberian-ginseng',
    title: 'Siberian Ginseng (Eleuthero)',
    description: 'Adaptogenic herb for stress resistance and energy',
    type: 'herb',
    slug: '/herbs/siberian-ginseng',
    tags: ['adaptogen', 'stress', 'energy', 'immune', 'resistance', 'eleutherococcus senticosus', 'eleuthero', 'devil\'s shrub'],
    benefits: ['Increases stress resistance', 'Boosts energy and stamina', 'Supports immune system function']
  },
  {
    id: 'astragalus',
    title: 'Astragalus',
    description: 'Traditional herb for immune support and vitality',
    type: 'herb',
    slug: '/herbs/astragalus',
    tags: ['immune', 'vitality', 'traditional', 'energy', 'health', 'astragalus membranaceus', 'huang qi', 'milk vetch'],
    benefits: ['Supports immune system function', 'Promotes vitality and energy', 'Traditional immune-supporting herb']
  },
  {
    id: 'borage',
    title: 'Borage',
    description: 'Herb rich in gamma-linolenic acid for hormonal balance',
    type: 'herb',
    slug: '/herbs/borage',
    tags: ['hormonal', 'balance', 'skin', 'inflammation', 'omega-6', 'borago officinalis', 'starflower', 'bee bread'],
    benefits: ['Supports hormonal balance', 'Promotes healthy skin', 'Reduces inflammation']
  },
  {
    id: 'nettle-seed',
    title: 'Nettle Seed',
    description: 'Nutritive herb for energy and adrenal support',
    type: 'herb',
    slug: '/herbs/nettle-seed',
    tags: ['nutritive', 'energy', 'adrenal', 'vitality', 'support', 'urtica dioica', 'stinging nettle', 'common nettle'],
    benefits: ['Provides nutritive support', 'Supports adrenal function', 'Boosts energy and vitality']
  },

  // Supplements
  {
    id: 'omega-3',
    title: 'Omega-3 Fatty Acids',
    description: 'Essential fats for brain health and heart health',
    type: 'supplement',
    slug: '/supplements/omega-3',
    tags: ['brain', 'heart', 'inflammation', 'mood', 'memory'],
    benefits: ['Supports brain function and memory', 'Reduces inflammation', 'Supports heart health']
  },
  {
    id: 'vitamin-d',
    title: 'Vitamin D',
    description: 'Sunshine vitamin for mood and bone health',
    type: 'supplement',
    slug: '/supplements/vitamin-d',
    tags: ['mood', 'bones', 'immune', 'depression', 'energy'],
    benefits: ['Supports mood and brain function', 'Essential for bone health', 'Supports immune function']
  },
  {
    id: 'magnesium',
    title: 'Magnesium',
    description: 'Essential mineral for relaxation and muscle function',
    type: 'supplement',
    slug: '/supplements/magnesium',
    tags: ['relaxation', 'muscles', 'sleep', 'anxiety', 'calm'],
    benefits: ['Helps relax muscles and reduce tension', 'Supports healthy sleep patterns', 'May reduce anxiety']
  },
  {
    id: 'b-complex',
    title: 'B-Complex Vitamins',
    description: 'Essential vitamins for energy and nervous system',
    type: 'supplement',
    slug: '/supplements/b-complex',
    tags: ['energy', 'nervous system', 'brain', 'metabolism', 'stress'],
    benefits: ['Supports energy production', 'Essential for nervous system function', 'Helps convert food into energy']
  },
  {
    id: 'l-theanine',
    title: 'L-Theanine',
    description: 'Amino acid for calm focus and relaxation',
    type: 'supplement',
    slug: '/supplements/l-theanine',
    tags: ['focus', 'calm', 'anxiety', 'relaxation', 'amino acid'],
    benefits: ['Promotes calm focus and concentration', 'Reduces stress and anxiety', 'Improves sleep quality']
  },

  // Symptoms
  {
    id: 'insomnia',
    title: 'Insomnia',
    description: 'Difficulty falling asleep or staying asleep',
    type: 'symptom',
    slug: '/symptoms/insomnia',
    tags: ['sleep', 'restlessness', 'fatigue', 'stress', 'anxiety'],
    symptoms: ['Trouble falling asleep', 'Waking up frequently', 'Feeling tired during the day']
  },
  {
    id: 'depression',
    title: 'Depression',
    description: 'Persistent feelings of sadness and loss of interest',
    type: 'symptom',
    slug: '/symptoms/depression',
    tags: ['mood', 'sadness', 'fatigue', 'hopelessness', 'emotional'],
    symptoms: ['Persistent sad mood', 'Loss of interest', 'Fatigue or loss of energy']
  },
  {
    id: 'anxiety',
    title: 'Anxiety',
    description: 'Excessive worry and nervousness',
    type: 'symptom',
    slug: '/symptoms/anxiety',
    tags: ['worry', 'nervousness', 'stress', 'tension', 'fear'],
    symptoms: ['Excessive worrying', 'Restlessness', 'Muscle tension']
  },
  {
    id: 'brain-fog',
    title: 'Brain Fog',
    description: 'Difficulty thinking clearly and concentrating',
    type: 'symptom',
    slug: '/symptoms/brain-fog',
    tags: ['concentration', 'memory', 'focus', 'mental clarity', 'cognitive'],
    symptoms: ['Difficulty concentrating', 'Memory problems', 'Mental fatigue']
  },
  {
    id: 'stress',
    title: 'Stress',
    description: 'Physical and emotional tension from pressure',
    type: 'symptom',
    slug: '/symptoms/stress',
    tags: ['tension', 'pressure', 'overwhelm', 'emotional', 'physical'],
    symptoms: ['Muscle tension', 'Irritability', 'Difficulty relaxing']
  },
  {
    id: 'fatigue',
    title: 'Fatigue',
    description: 'Persistent tiredness and lack of energy',
    type: 'symptom',
    slug: '/symptoms/fatigue',
    tags: ['tiredness', 'energy', 'exhaustion', 'weakness', 'lethargy'],
    symptoms: ['Persistent tiredness', 'Lack of energy', 'Difficulty with daily activities']
  },
  {
    id: 'burnout',
    title: 'Emotional Burnout',
    description: 'Physical and emotional exhaustion from chronic stress',
    type: 'symptom',
    slug: '/symptoms/burnout',
    tags: ['exhaustion', 'stress', 'emotional', 'overwhelm', 'depletion'],
    symptoms: ['Emotional exhaustion', 'Reduced performance', 'Cynicism']
  },
  {
    id: 'muscle-tension',
    title: 'Muscle Tension',
    description: 'Tight, contracted muscles causing discomfort',
    type: 'symptom',
    slug: '/symptoms/muscle-tension',
    tags: ['tension', 'pain', 'muscles', 'stress', 'discomfort'],
    symptoms: ['Tight muscles', 'Pain and discomfort', 'Reduced flexibility']
  },
  {
    id: 'neck-tension',
    title: 'Neck Tension',
    description: 'Tightness and discomfort in the neck area',
    type: 'symptom',
    slug: '/symptoms/neck-tension',
    tags: ['neck', 'tension', 'pain', 'stress', 'posture'],
    symptoms: ['Neck stiffness', 'Pain and discomfort', 'Limited range of motion']
  },
  {
    id: 'blood-pressure',
    title: 'Blood Pressure Issues',
    description: 'Abnormal blood pressure levels affecting health',
    type: 'symptom',
    slug: '/symptoms/blood-pressure',
    tags: ['cardiovascular', 'pressure', 'heart', 'circulation', 'health'],
    symptoms: ['High or low blood pressure', 'Dizziness', 'Headaches']
  },
  {
    id: 'heart-support',
    title: 'Heart Health Support',
    description: 'Supporting cardiovascular health and function',
    type: 'symptom',
    slug: '/symptoms/heart-support',
    tags: ['heart', 'cardiovascular', 'circulation', 'health', 'support'],
    symptoms: ['Heart health concerns', 'Circulation issues', 'Cardiovascular support needs']
  },
  {
    id: 'liver-detox',
    title: 'Liver Function Support',
    description: 'Supporting liver health and detoxification',
    type: 'symptom',
    slug: '/symptoms/liver-detox',
    tags: ['liver', 'detox', 'toxicity', 'health', 'cleansing'],
    symptoms: ['Liver health concerns', 'Toxicity issues', 'Detoxification support needs']
  },
  {
    id: 'digestive-health',
    title: 'Digestive Health',
    description: 'Supporting healthy digestion and gut function',
    type: 'symptom',
    slug: '/symptoms/digestive-health',
    tags: ['digestion', 'gut', 'stomach', 'health', 'comfort'],
    symptoms: ['Digestive discomfort', 'Gut health issues', 'Digestion support needs']
  },
  {
    id: 'adrenal-overload',
    title: 'Adrenal Overload',
    description: 'Excessive stress affecting adrenal gland function',
    type: 'symptom',
    slug: '/symptoms/adrenal-overload',
    tags: ['adrenals', 'stress', 'overload', 'hormones', 'exhaustion'],
    symptoms: ['Adrenal fatigue', 'Chronic stress', 'Hormonal imbalances']
  },
  {
    id: 'adrenal-exhaustion',
    title: 'Adrenal Exhaustion',
    description: 'Severe fatigue from chronic stress and adrenal depletion',
    type: 'symptom',
    slug: '/symptoms/adrenal-exhaustion',
    tags: ['adrenals', 'exhaustion', 'fatigue', 'stress', 'depletion'],
    symptoms: ['Severe fatigue', 'Adrenal depletion', 'Chronic exhaustion']
  },
  {
    id: 'circadian-support',
    title: 'Circadian Rhythm Support',
    description: 'Supporting natural sleep-wake cycles',
    type: 'symptom',
    slug: '/symptoms/circadian-support',
    tags: ['sleep', 'circadian', 'rhythm', 'cycles', 'timing'],
    symptoms: ['Sleep cycle issues', 'Timing problems', 'Rhythm disruption']
  },
  {
    id: 'vagus-nerve',
    title: 'Vagus Nerve Support',
    description: 'Supporting the body\'s main parasympathetic nerve',
    type: 'symptom',
    slug: '/symptoms/vagus-nerve',
    tags: ['vagus', 'nervous system', 'parasympathetic', 'calm', 'regulation'],
    symptoms: ['Nervous system issues', 'Regulation problems', 'Calm support needs']
  },
  {
    id: 'dysbiosis',
    title: 'Dysbiosis',
    description: 'Imbalance in gut microbiome affecting health',
    type: 'symptom',
    slug: '/symptoms/dysbiosis',
    tags: ['gut', 'microbiome', 'imbalance', 'digestion', 'health'],
    symptoms: ['Gut microbiome issues', 'Digestive imbalances', 'Health concerns']
  },
  {
    id: 'leaky-gut',
    title: 'Leaky Gut / Leaky Brain',
    description: 'Increased intestinal permeability affecting health',
    type: 'symptom',
    slug: '/symptoms/leaky-gut',
    tags: ['gut', 'permeability', 'inflammation', 'brain', 'health'],
    symptoms: ['Intestinal permeability', 'Inflammation', 'Health issues']
  },
  {
    id: 'ibs',
    title: 'IBS',
    description: 'Irritable bowel syndrome affecting digestive health',
    type: 'symptom',
    slug: '/symptoms/ibs',
    tags: ['ibs', 'digestive', 'bowel', 'irritable', 'discomfort'],
    symptoms: ['Digestive discomfort', 'Bowel issues', 'Irritable symptoms']
  },
  {
    id: 'mood-swings',
    title: 'Mood Swings',
    description: 'Rapid changes in emotional state and mood',
    type: 'symptom',
    slug: '/symptoms/mood-swings',
    tags: ['mood', 'emotions', 'swings', 'emotional', 'stability'],
    symptoms: ['Rapid mood changes', 'Emotional instability', 'Mood regulation issues']
  },
  {
    id: 'thyroid-issues',
    title: 'Thyroid Issues',
    description: 'Problems with thyroid gland function and hormones',
    type: 'symptom',
    slug: '/symptoms/thyroid-issues',
    tags: ['thyroid', 'hormones', 'metabolism', 'energy', 'health'],
    symptoms: ['Thyroid function issues', 'Hormonal imbalances', 'Metabolism problems']
  }
];

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredResults = searchData.filter(item => {
      const matchesQuery = 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (item.benefits && item.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm))) ||
        (item.symptoms && item.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm)));

      return matchesQuery;
    });

    // Sort by relevance (exact title matches first, then description, then tags)
    filteredResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return a.title.localeCompare(b.title);
    });

    setResults(filteredResults.slice(0, 8)); // Limit to 8 results
  }, [query]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'herb': return '🌿';
      case 'supplement': return '💊';
      case 'symptom': return '🩺';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'herb': return 'text-green-600 bg-green-50';
      case 'supplement': return 'text-blue-600 bg-blue-50';
      case 'symptom': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search herbs, supplements, symptoms..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-600"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.slug}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  {item.benefits && item.benefits.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-medium">Benefits:</p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {item.benefits.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}
                  {item.symptoms && item.symptoms.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-medium">Symptoms:</p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {item.symptoms.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() !== "" && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-gray-500 text-center">
            No results found for &quot;{query}&quot;
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Try searching for herbs, supplements, or symptoms
          </p>
        </div>
      )}
    </div>
  );
} 