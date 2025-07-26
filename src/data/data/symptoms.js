"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symptoms = void 0;
exports.symptoms = {
    'insomnia': {
        name: 'Insomnia',
        title: 'Insomnia',
        description: 'Difficulty falling asleep, staying asleep, or waking up too early.',
        variants: {
            "Sleep Onset Insomnia": {
                paragraphs: [
                    'Sleep onset insomnia is difficulty falling asleep at the beginning of the night. It is often related to stress, anxiety, or an overactive mind.',
                    'Supporting relaxation and calming the nervous system before bed is key. Establishing a consistent bedtime routine, reducing screen time before bed, and practicing relaxation techniques such as deep breathing or meditation can help signal to your body that it is time to sleep.',
                    'Limiting caffeine and heavy meals in the evening, as well as creating a comfortable sleep environment, are also important strategies for improving sleep onset. Even small changes in your evening habits can make a noticeable difference over time.',
                    'Remember, persistent sleep difficulties may indicate an underlying health issue. Consulting a healthcare professional is always a wise step if insomnia continues.'
                ],
                productFormulations: {
                    "Valerian Root": {
                        name: 'Valerian Root',
                        description: 'Traditional sleep herb with modern clinical studies showing effectiveness for falling asleep.',
                        affiliateLink: 'https://amzn.to/valerian-sleep',
                        price: '$18-25',
                        type: 'herb'
                    },
                    Melatonin: {
                        name: 'Melatonin (0.5-3mg)',
                        description: 'Most researched sleep supplement. Regulates circadian rhythm and helps initiate sleep.',
                        affiliateLink: 'https://amzn.to/melatonin-sleep',
                        price: '$15-25',
                        type: 'supplement'
                    }
                },
            },
            "Sleep Maintenance Insomnia": {
                paragraphs: [
                    'Sleep maintenance insomnia is waking up frequently during the night or having trouble staying asleep. It can be related to blood sugar swings, stress hormones, or environmental factors.',
                    'Nighttime awakenings can be frustrating and may leave you feeling unrested. Consider keeping your bedroom cool, dark, and quiet, and avoid using electronic devices if you wake up during the night.',
                    'Gentle stretching or a brief relaxation exercise can sometimes help you return to sleep. If you find yourself awake for more than 20 minutes, it may be helpful to get up and do a quiet activity until you feel sleepy again.',
                    'If sleep maintenance insomnia persists, it is important to discuss your symptoms with a healthcare provider to rule out underlying conditions such as sleep apnea or restless legs syndrome.'
                ],
                productFormulations: {
                    Passionflower: {
                        name: 'Passionflower',
                        description: 'Gentle nervine herb that enhances GABA activity for natural sleep support and reduces nighttime awakenings.',
                        affiliateLink: 'https://amzn.to/passionflower-sleep',
                        price: '$15-25',
                        type: 'herb'
                    },
                    "Magnesium Glycinate": {
                        name: 'Magnesium Glycinate',
                        description: 'Essential mineral for muscle relaxation and sleep maintenance.',
                        affiliateLink: 'https://amzn.to/magnesium-sleep',
                        price: '$18-28',
                        type: 'supplement'
                    }
                },
            },
            "Early Morning Awakening": {
                paragraphs: [
                    'Early morning awakening is waking up too early and being unable to return to sleep. This pattern can be particularly distressing, especially if it leads to daytime fatigue.',
                    'Mood changes, hormonal fluctuations, and disruptions in your circadian rhythm are common contributors. Try to maintain a regular sleep schedule and get exposure to natural light in the morning to help reset your body clock.',
                    'Mindfulness practices and gentle morning routines can ease the transition from sleep to wakefulness. Avoid checking your phone or engaging in stressful activities immediately upon waking.',
                    'If early morning awakening becomes a persistent issue, consider seeking guidance from a sleep specialist or mental health professional.'
                ],
                productFormulations: {
                    "St. John's Wort": {
                        name: 'St. John\'s Wort',
                        description: 'Traditional herb with evidence for mood support and circadian rhythm regulation.',
                        affiliateLink: 'https://amzn.to/st-johns-wort-sleep',
                        price: '$20-30',
                        type: 'herb'
                    },
                    "L-Theanine": {
                        name: '5-HTP',
                        description: 'Precursor to serotonin and melatonin. Supports mood and sleep regulation.',
                        affiliateLink: 'https://amzn.to/5htp-sleep',
                        price: '$20-30',
                        type: 'supplement'
                    }
                },
            }
        },
        symptoms: [
            'Persistent sad or empty mood',
            'Loss of interest in activities',
            'Changes in appetite or weight',
            'Sleep problems',
            'Fatigue or loss of energy',
            'Feelings of worthlessness'
        ],
        causes: [
            'Biological factors',
            'Environmental stressors',
            'Life events',
            'Medical conditions',
            'Medications',
            'Substance use'
        ],
        naturalSolutions: [
            {
                type: 'supplement',
                name: 'Omega-3 EPA/DHA',
                description: 'Essential anti-inflammatory fats. EPA specifically supports mood regulation.',
                affiliateLink: 'https://amzn.to/omega3-depression',
                price: '$25-40',
                clinicalEvidence: '2-3g daily EPA/DHA shows significant benefits for depression in multiple studies'
            },
            {
                type: 'supplement',
                name: 'Vitamin D3',
                description: 'Sunshine vitamin. Deficiency strongly linked to depression and seasonal affective disorder.',
                affiliateLink: 'https://amzn.to/vitamin-d-depression',
                price: '$15-25',
                clinicalEvidence: '2000-5000 IU daily improves mood, especially in deficient individuals'
            },
            {
                type: 'supplement',
                name: 'B-Complex Vitamins',
                description: 'Essential for neurotransmitter production. B12 and folate particularly important for mood.',
                affiliateLink: 'https://amzn.to/b-complex-depression',
                price: '$18-28',
                clinicalEvidence: 'B12 and folate deficiency linked to depression. Supplementation improves symptoms'
            },
            {
                type: 'supplement',
                name: 'S-Adenosyl Methionine (SAMe)',
                description: 'Natural compound that supports methylation and neurotransmitter production.',
                affiliateLink: 'https://amzn.to/same-depression',
                price: '$30-50',
                clinicalEvidence: '400-1600mg daily shows antidepressant effects comparable to prescription medications'
            },
            {
                type: 'supplement',
                name: '5-HTP',
                description: 'Precursor to serotonin. Supports natural mood regulation and sleep.',
                affiliateLink: 'https://amzn.to/5htp-depression',
                price: '$20-30',
                clinicalEvidence: '100-300mg daily increases serotonin levels and improves depression scores'
            },
            {
                type: 'herb',
                name: 'St. John\'s Wort',
                description: 'Traditional herb with extensive clinical research for mild to moderate depression.',
                affiliateLink: 'https://amzn.to/st-johns-wort-depression',
                price: '$20-30',
                clinicalEvidence: '900mg daily extract shows effectiveness comparable to prescription antidepressants'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null,
    },
    'depression': {
        name: 'Depression',
        title: 'Depression',
        description: 'Persistent feelings of sadness and loss of interest',
        variants: {
            'Default': {
                paragraphs: [
                    'Depression is a complex mental health condition that affects how you feel, think, and behave. It is more than just feeling sad or having the blues for a few days. This condition can impact every aspect of your life, from work and relationships to your physical health.',
                    'Many factors contribute to depression, including genetics, brain chemistry, environmental stressors, and life events. Recognizing the symptoms early and seeking support can make a significant difference in recovery. Remember, you are not alone—many people experience depression at some point in their lives.',
                    'Treatment for depression is highly individualized. It may include therapy, medication, lifestyle changes, and natural approaches such as nutrition and exercise. Building a strong support network and practicing self-care are essential steps on the path to healing.',
                    'If you or someone you know is struggling with depression, reaching out to a healthcare professional is a wise and courageous step. Early intervention can lead to better outcomes and a brighter future.'
                ]
            }
        },
        // Move symptoms, causes, naturalSolutions, etc. to the Symptom level if needed
        symptoms: [
            'Persistent sad or empty mood',
            'Loss of interest in activities',
            'Changes in appetite or weight',
            'Sleep problems',
            'Fatigue or loss of energy',
            'Feelings of worthlessness'
        ],
        causes: [
            'Biological factors',
            'Environmental stressors',
            'Life events',
            'Medical conditions',
            'Medications',
            'Substance use'
        ],
        naturalSolutions: [
            {
                type: 'supplement',
                name: 'Omega-3 EPA/DHA',
                description: 'Essential anti-inflammatory fats. EPA specifically supports mood regulation.',
                affiliateLink: 'https://amzn.to/omega3-depression',
                price: '$25-40',
                clinicalEvidence: '2-3g daily EPA/DHA shows significant benefits for depression in multiple studies'
            },
            {
                type: 'supplement',
                name: 'Vitamin D3',
                description: 'Sunshine vitamin. Deficiency strongly linked to depression and seasonal affective disorder.',
                affiliateLink: 'https://amzn.to/vitamin-d-depression',
                price: '$15-25',
                clinicalEvidence: '2000-5000 IU daily improves mood, especially in deficient individuals'
            },
            {
                type: 'supplement',
                name: 'B-Complex Vitamins',
                description: 'Essential for neurotransmitter production. B12 and folate particularly important for mood.',
                affiliateLink: 'https://amzn.to/b-complex-depression',
                price: '$18-28',
                clinicalEvidence: 'B12 and folate deficiency linked to depression. Supplementation improves symptoms'
            },
            {
                type: 'supplement',
                name: 'S-Adenosyl Methionine (SAMe)',
                description: 'Natural compound that supports methylation and neurotransmitter production.',
                affiliateLink: 'https://amzn.to/same-depression',
                price: '$30-50',
                clinicalEvidence: '400-1600mg daily shows antidepressant effects comparable to prescription medications'
            },
            {
                type: 'supplement',
                name: '5-HTP',
                description: 'Precursor to serotonin. Supports natural mood regulation and sleep.',
                affiliateLink: 'https://amzn.to/5htp-depression',
                price: '$20-30',
                clinicalEvidence: '100-300mg daily increases serotonin levels and improves depression scores'
            },
            {
                type: 'herb',
                name: 'St. John\'s Wort',
                description: 'Traditional herb with extensive clinical research for mild to moderate depression.',
                affiliateLink: 'https://amzn.to/st-johns-wort-depression',
                price: '$20-30',
                clinicalEvidence: '900mg daily extract shows effectiveness comparable to prescription antidepressants'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'anxiety': {
        name: 'Anxiety',
        title: 'Anxiety',
        description: 'Excessive worry and nervousness',
        variants: {
            'Default': {
                paragraphs: [
                    'Anxiety is a normal response to stress, but when it becomes excessive or chronic, it can significantly impact your quality of life. It is characterized by persistent worry, nervousness, and sometimes physical symptoms like a racing heart or muscle tension.',
                    'Everyone experiences anxiety from time to time, but for some, it can become overwhelming and interfere with daily activities. Learning to recognize your triggers and practicing relaxation techniques can help you manage anxious feelings.',
                    'Support from friends, family, or a mental health professional can make a big difference. Remember, seeking help is a sign of strength, not weakness.',
                    'With the right strategies and support, most people can learn to manage anxiety effectively and lead fulfilling lives.'
                ],
                productFormulations: {
                    Passionflower: {
                        name: 'Passionflower',
                        description: 'Traditional nervine herb that enhances GABA activity naturally',
                        affiliateLink: 'https://amzn.to/passionflower-anxiety',
                        price: '$15-25'
                    },
                    Ashwagandha: {
                        name: 'Ashwagandha',
                        description: 'Adaptogenic herb with multiple RCTs showing cortisol reduction and stress relief',
                        affiliateLink: 'https://amzn.to/ashwagandha-anxiety',
                        price: '$20-35'
                    }
                },
            }
        },
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'memory-loss': {
        name: 'Memory Loss',
        title: 'Memory Loss',
        description: 'Difficulty remembering information or events',
        variants: {
            'Default': {
                paragraphs: [
                    'Memory loss can be unsettling, whether it is occasional forgetfulness or more persistent difficulties. It is a common experience as we age, but can also be influenced by stress, lack of sleep, or medical conditions.',
                    'Staying mentally active, maintaining social connections, and getting regular physical exercise are all important for brain health. Simple lifestyle changes, such as keeping a routine and using reminders, can help manage mild memory issues.',
                    'If memory loss is sudden, severe, or accompanied by other symptoms, it is important to seek medical advice promptly. Early intervention can sometimes prevent further decline.',
                    'Remember, everyone forgets things from time to time. Being proactive about your brain health is a positive and empowering step.'
                ],
                productFormulations: {
                    "Bacopa Monnieri": {
                        name: 'Bacopa Monnieri',
                        description: 'Traditional nootropic herb with extensive clinical research for memory enhancement.',
                        affiliateLink: 'https://amzn.to/bacopa-memory',
                        price: '$20-35'
                    },
                    "Alpha-GPC": {
                        name: 'Alpha-GPC',
                        description: 'Bioavailable choline source. Essential for acetylcholine production and memory.',
                        affiliateLink: 'https://amzn.to/alpha-gpc-memory',
                        price: '$25-40'
                    }
                },
            }
        },
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'muscle-tension': {
        name: 'Muscle Tension / Tension Headaches',
        title: 'Muscle Tension / Tension Headaches',
        description: 'Muscle tightness, tension, or headaches related to stress or posture.',
        variants: {
            'Default': {
                paragraphs: [
                    'Muscle tension and tension headaches are common complaints that can be caused by stress, poor posture, overuse, or dehydration. These sensations may range from mild discomfort to more persistent pain.',
                    'Taking regular breaks, practicing good posture, and staying hydrated can help prevent and relieve muscle tension. Gentle stretching, massage, and relaxation exercises are also beneficial.',
                    'If you experience frequent or severe tension headaches, it is wise to consult a healthcare provider to rule out underlying causes. Sometimes, simple changes in your daily routine can make a significant difference.',
                    'Listening to your body and addressing tension early can help you maintain comfort and mobility throughout your day.'
                ],
                productFormulations: {
                    Skullcap: {
                        name: 'Skullcap',
                        description: 'Traditionally used for muscle tension and nervous headaches',
                        affiliateLink: 'https://amzn.to/example-skullcap',
                        price: '$15-25'
                    },
                    "Cramp Bark": {
                        name: 'Cramp Bark (Viburnum opulus)',
                        description: 'Skeletal muscle relaxant and nerve relaxant. Traditionally used for pain, pinched nerves, muscle cramps, and menstrual cramps.',
                        affiliateLink: 'https://amzn.to/example-cramp-bark',
                        price: '$14-22'
                    }
                },
            }
        },
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'neck-tension': {
        name: 'Neck Tension',
        title: 'Neck Tension',
        description: 'Muscle tightness, pain, or stiffness in the neck and upper shoulders.',
        variants: {
            'Default': {
                paragraphs: [
                    'Neck tension is a common complaint, often caused by stress, poor posture, prolonged computer use, or muscle strain. It can also be associated with headaches, jaw pain, or upper back discomfort.',
                    'Natural approaches to neck tension focus on muscle relaxation, stress reduction, and supporting healthy circulation. Regular stretching, mindful posture, and taking breaks from screens can help prevent and relieve discomfort.',
                    'Applying gentle heat, practicing relaxation techniques, and staying hydrated are simple yet effective ways to support neck comfort. If pain persists or is severe, consult a healthcare provider to rule out underlying issues.',
                    'Listening to your body and addressing tension early can help you maintain comfort and mobility throughout your day.'
                ],
                productFormulations: {
                    Lavender: {
                        name: 'Lavender',
                        description: 'Traditional herb for muscle relaxation and stress relief.',
                        affiliateLink: 'https://amzn.to/lavender-neck',
                        price: '$15-22'
                    },
                    Magnesium: {
                        name: 'Magnesium',
                        description: 'Essential mineral for muscle relaxation and nerve function.',
                        affiliateLink: 'https://amzn.to/magnesium-neck',
                        price: '$18-28'
                    }
                },
                relatedSymptoms: [
                    { name: 'Muscle Tension', href: '/symptoms/muscle-tension', color: 'green' },
                    { name: 'Migraine', href: '/symptoms/migraine', color: 'purple' },
                    { name: 'Stress', href: '/symptoms/stress', color: 'blue' }
                ],
            }
        },
        relatedSymptoms: [
            { name: 'Muscle Tension', href: '/symptoms/muscle-tension', color: 'green' },
            { name: 'Migraine', href: '/symptoms/migraine', color: 'purple' },
            { name: 'Stress', href: '/symptoms/stress', color: 'blue' }
        ],
        disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'blood-pressure': {
        name: 'Blood Pressure Balance',
        title: 'Blood Pressure Balance',
        description: 'Support for healthy blood pressure levels.',
        variants: {
            'Default': {
                paragraphs: [
                    "Blood pressure is a vital sign that reflects the force of blood against the walls of your arteries. Both high and low blood pressure can have significant health implications, so it is important to monitor and manage your levels appropriately.",
                    'Lifestyle factors such as diet, exercise, stress, and sleep all play a role in maintaining healthy blood pressure. Regular check-ups and self-monitoring can help you stay on top of any changes.',
                    'If you experience symptoms like dizziness, headaches, or fatigue, it may be related to blood pressure fluctuations. Do not hesitate to consult a healthcare provider for personalized advice.',
                    'Remember, small adjustments in your daily routine can make a meaningful difference in your cardiovascular health.'
                ]
            }
        },
        symptoms: [
            'High or low blood pressure',
            'Dizziness',
            'Headaches',
            'Fatigue'
        ],
        causes: [
            'Diet',
            'Stress',
            'Genetics',
            'Medical conditions'
        ],
        naturalSolutions: [
            {
                type: 'herb',
                name: 'Hawthorn',
                description: 'Traditionally used for cardiovascular support',
                affiliateLink: 'https://amzn.to/example-hawthorn',
                price: '$15-25',
                productLink: '/herbs/hawthorn'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'heart-support': {
        name: 'Heart Muscle Support',
        title: 'Heart Muscle Support',
        description: 'Support for heart muscle function and cardiovascular health.',
        variants: {
            'Default': {
                paragraphs: [
                    'Heart health is crucial for overall well-being. Fatigue, shortness of breath, chest discomfort, and palpitations are common symptoms of heart-related issues. Understanding the causes and symptoms of heart muscle support is important for addressing the underlying cause and finding effective natural solutions.',
                    'Maintaining a balanced diet, regular physical activity, and managing stress are foundational for cardiovascular health. It is also important to monitor blood pressure and cholesterol levels as part of routine care.',
                    'If you experience persistent symptoms or have a family history of heart disease, consult a healthcare provider for personalized advice. Early intervention can make a significant difference in outcomes.',
                    'Remember, small lifestyle changes can have a big impact on your heart health over time.'
                ]
            }
        },
        symptoms: [
            'Fatigue',
            'Shortness of breath',
            'Chest discomfort',
            'Palpitations'
        ],
        causes: [
            'Cardiovascular conditions',
            'Nutrient deficiencies',
            'Stress'
        ],
        naturalSolutions: [
            {
                type: 'supplement',
                name: 'CoQ10',
                description: 'Supports heart muscle energy and function',
                affiliateLink: 'https://amzn.to/example-coq10',
                price: '$20-35'
            },
            {
                type: 'herb',
                name: 'Hawthorn (Crataegus oxyacantha)',
                description: 'Traditional cardiovascular herb useful for heart palpitations, flutters, panic-related tachycardia, and overall heart support',
                affiliateLink: 'https://amzn.to/example-hawthorn-heart',
                price: '$15-25'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'liver-detox': {
        name: 'Liver Function Support / Toxicity',
        title: 'Liver Function Support / Toxicity',
        description: 'Support for liver detoxification and function.',
        variants: {
            'Default': {
                paragraphs: [
                    "The liver is one of the body's most important organs, responsible for detoxification, metabolism, and hormone regulation. When liver function is compromised, it cannot effectively clear toxins and metabolic byproducts from the bloodstream, leading to hormonal imbalances and other health issues. Understanding the causes and symptoms of poor liver function is crucial for addressing the underlying cause and finding effective natural solutions.",
                    'Supporting your liver involves a combination of healthy eating, regular exercise, and minimizing exposure to toxins. Foods rich in antioxidants, such as leafy greens and berries, can help protect liver cells.',
                    'If you notice symptoms like persistent fatigue, digestive issues, or yellowing of the skin, it is important to seek medical advice. Early detection and intervention can prevent further complications.',
                    'Remember, your liver works hard every day to keep your body in balance. Treating it with care is an investment in your long-term health.'
                ]
            }
        },
        symptoms: [
            'Fatigue',
            'Digestive issues',
            'Skin problems',
            'Brain fog'
        ],
        causes: [
            'Genetic predisposition',
            'Chronic illness',
            'Medications',
            'Infections',
            'Nutrient deficiencies'
        ],
        naturalSolutions: [
            {
                type: 'supplement',
                name: 'Milk Thistle',
                description: 'Traditional liver herb with strong evidence for supporting detoxification and liver cell regeneration.',
                affiliateLink: 'https://amzn.to/milk-thistle-liver',
                price: '$18-28'
            },
            {
                type: 'supplement',
                name: 'NAC (N-Acetyl Cysteine)',
                description: 'Amino acid supplement that boosts glutathione, the body’s master antioxidant for liver health.',
                affiliateLink: 'https://amzn.to/nac-liver',
                price: '$20-30'
            },
            {
                type: 'supplement',
                name: 'Dandelion Root',
                description: 'Herbal bitter that stimulates bile flow and supports digestion and detoxification.',
                affiliateLink: 'https://amzn.to/dandelion-liver',
                price: '$15-22'
            },
            {
                type: 'supplement',
                name: 'Alpha Lipoic Acid',
                description: 'Powerful antioxidant that supports liver cell protection and regeneration.',
                affiliateLink: 'https://amzn.to/ala-liver',
                price: '$18-28'
            }
        ],
        relatedSymptoms: [
            { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'purple' },
            { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
            { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' }
        ],
        disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'digestive-health': {
        name: 'Hormonal Imbalances / Digestive Health',
        title: 'Hormonal Imbalances / Digestive Health',
        description: 'Support for hormone balance and digestive function.',
        variants: {
            'Default': {
                paragraphs: [
                    'Hormonal imbalances and digestive health are closely linked. Poor gut health can lead to hormonal dysregulation, which in turn can affect mood, energy, and overall wellbeing. Understanding the causes and symptoms of digestive health issues is important for addressing the underlying cause and finding effective natural solutions.',
                    'Maintaining a balanced diet, managing stress, and getting regular exercise are key strategies for supporting both digestive and hormonal health. Probiotics and fiber-rich foods can also play a supportive role.',
                    'If you experience persistent digestive discomfort or irregular cycles, consult a healthcare provider for a thorough evaluation. Early intervention can help restore balance and prevent complications.',
                    'Remember, small daily habits can have a profound impact on your digestive and hormonal wellbeing.'
                ]
            }
        },
        symptoms: [
            'Bloating',
            'Irregular cycles',
            'Digestive discomfort',
            'Mood swings'
        ],
        causes: [
            'Hormonal fluctuations',
            'Gut dysbiosis',
            'Diet',
            'Stress'
        ],
        naturalSolutions: [
            {
                type: 'herb',
                name: 'Vitex',
                description: 'Supports hormone balance',
                affiliateLink: 'https://amzn.to/example-vitex',
                price: '$12-20'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'adrenal-overload': {
        name: 'Adrenal Overload',
        title: 'Adrenal Overload',
        description: 'Symptoms of excess stress and adrenal hormone output.',
        variants: {
            'Default': {
                paragraphs: [
                    'Adrenal overload, or hyperadrenalism, is a state where the adrenal glands produce excessive amounts of stress hormones. This can lead to feelings of wiredness, trouble sleeping, irritability, and cravings for salt or sugar. Understanding the causes and symptoms of adrenal overload is important for addressing the underlying cause and finding effective natural solutions.',
                    'Managing stress through relaxation techniques, adequate sleep, and balanced nutrition is essential for adrenal health. Reducing caffeine and sugar intake can also help regulate energy levels.',
                    'If you notice persistent symptoms of adrenal overload, such as chronic fatigue or mood swings, consult a healthcare provider for personalized guidance. Early support can prevent further imbalance.',
                    'Remember, your body is resilient. With the right support, it can recover from periods of stress and restore balance.'
                ]
            }
        },
        symptoms: [
            'Feeling wired',
            'Trouble sleeping',
            'Irritability',
            'Cravings for salt or sugar'
        ],
        causes: [
            'Chronic stress',
            'Overwork',
            'Poor sleep'
        ],
        naturalSolutions: [
            {
                type: 'herb',
                name: 'Rhodiola',
                description: 'Adaptogen for stress resilience',
                affiliateLink: 'https://amzn.to/example-rhodiola',
                price: '$18-28'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'adrenal-exhaustion': {
        name: 'Adrenal Exhaustion',
        title: 'Adrenal Exhaustion',
        description: 'Symptoms of depleted adrenal function from chronic stress.',
        variants: {
            'Default': {
                paragraphs: [
                    "Adrenal exhaustion, or adrenal fatigue, is a state where the adrenal glands are unable to produce sufficient stress hormones to meet the body's needs. This can lead to fatigue, low motivation, brain fog, cravings for salt, and low blood pressure. Understanding the causes and symptoms of adrenal exhaustion is important for addressing the underlying cause and finding effective natural solutions.",
                    'Supporting adrenal health involves prioritizing rest, managing stress, and ensuring adequate nutrition. Adaptogenic herbs and gentle exercise can also be beneficial.',
                    'If you experience ongoing symptoms of adrenal exhaustion, seek advice from a healthcare provider. Early intervention can help restore energy and prevent further depletion.',
                    'Remember, recovery from adrenal exhaustion is a gradual process. Be patient with yourself and celebrate small improvements along the way.'
                ]
            }
        },
        symptoms: [
            'Fatigue',
            'Low motivation',
            'Brain fog',
            'Cravings for salt',
            'Low blood pressure'
        ],
        causes: [
            'Prolonged stress',
            'Poor sleep',
            'Nutrient deficiencies'
        ],
        naturalSolutions: [
            {
                type: 'herb',
                name: 'Licorice Root',
                description: 'Traditionally used for adrenal support',
                affiliateLink: 'https://amzn.to/example-licorice',
                price: '$12-20'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'circadian-support': {
        name: 'Circadian Support',
        title: 'Circadian Support',
        description: 'Support for healthy sleep-wake cycles and circadian rhythm.',
        variants: {
            'Default': {
                paragraphs: [
                    "Circadian rhythm, or the body's internal clock, plays a crucial role in regulating sleep, wakefulness, and many other physiological processes. Disruptions in circadian rhythm can lead to difficulties falling asleep, daytime sleepiness, irregular sleep patterns, and mood changes. Understanding the causes and symptoms of circadian support is important for addressing the underlying cause and finding effective natural solutions.",
                    'Maintaining a consistent sleep schedule, getting exposure to natural light during the day, and limiting screen time at night are key strategies for supporting circadian health.',
                    'If you struggle with sleep issues or mood changes, consider consulting a healthcare provider for personalized advice. Early support can help restore your natural rhythms.',
                    'Remember, your body thrives on routine. Small adjustments to your daily habits can make a big difference in your sleep and overall wellbeing.'
                ]
            }
        },
        symptoms: [
            'Difficulty falling asleep',
            'Daytime sleepiness',
            'Irregular sleep patterns',
            'Mood changes'
        ],
        causes: [
            'Shift work',
            'Jet lag',
            'Screen time at night',
            'Irregular routines'
        ],
        naturalSolutions: [
            {
                type: 'supplement',
                name: 'Melatonin',
                description: 'Supports healthy sleep onset and circadian rhythm',
                affiliateLink: 'https://amzn.to/example-melatonin',
                price: '$10-18'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'vagus-nerve': {
        name: 'Vagus Nerve Support',
        title: 'Vagus Nerve Support',
        description: 'Understanding and supporting your body\'s most important nerve for overall health and well-being',
        paragraphs: [
            'The vagus nerve is the longest cranial nerve in your body, running from your brainstem through your neck and into your chest and abdomen. It\'s often called the "wandering nerve" because of its extensive reach throughout your body.',
            'This nerve is crucial for your parasympathetic nervous system - the "rest and digest" system that helps your body relax, recover, and maintain homeostasis. It controls many vital functions including heart rate, digestion, breathing, and immune response.'
        ],
        symptoms: [
            'Digestive issues (bloating, constipation, acid reflux)',
            'Heart rate variability problems',
            'Difficulty relaxing or feeling constantly stressed',
            'Poor immune function and frequent illness',
            'Inflammation throughout the body',
            'Mood disorders and anxiety',
            'Sleep disturbances',
            'Chronic fatigue'
        ],
        naturalSolutions: [
            { name: 'Omega-3 Fish Oil', description: 'High-quality fish oil supports nerve function and reduces inflammation', affiliateLink: 'https://amzn.to/3example1', price: '' },
            { name: 'Probiotics', description: 'Support gut-brain axis and vagus nerve communication', affiliateLink: 'https://amzn.to/3example2', price: '' },
            { name: 'Magnesium', description: 'Essential mineral for nerve function and relaxation', affiliateLink: 'https://amzn.to/3example3', price: '' },
            { name: 'L-Theanine', description: 'Amino acid that promotes relaxation and reduces stress', affiliateLink: 'https://amzn.to/3example4', price: '' }
        ],
        disclaimer: 'This information is for educational purposes only. Always consult with a healthcare provider before starting any new supplement regimen, especially if you have underlying health conditions or are taking medications.'
    },
    'dysbiosis': {
        name: 'Dysbiosis',
        title: 'Dysbiosis',
        description: 'Imbalance of gut bacteria affecting health.',
        variants: {
            'Default': {
                paragraphs: [
                    "Dysbiosis, or an imbalance of gut bacteria, can lead to various health issues, including digestive discomfort, brain fog, and food sensitivities. Understanding the causes and symptoms of dysbiosis is important for addressing the underlying cause and finding effective natural solutions.",
                    "Common symptoms of dysbiosis include bloating, digestive discomfort, brain fog, and food sensitivities. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including antibiotic use, poor diet, stress, and infections."
                ]
            }
        },
        symptoms: [
            'Bloating',
            'Digestive discomfort',
            'Brain fog',
            'Food sensitivities'
        ],
        causes: [
            'Antibiotic use',
            'Poor diet',
            'Stress',
            'Infections'
        ],
        naturalSolutions: [
            {
                type: 'supplement',
                name: 'Probiotics',
                description: 'Supports healthy gut flora balance',
                affiliateLink: 'https://amzn.to/example-probiotics',
                price: '$18-30'
            }
        ],
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'leaky-gut': {
        name: 'Leaky Gut / Leaky Brain',
        title: 'Leaky Gut / Leaky Brain',
        description: 'Understanding the connection between gut health and brain function',
        paragraphs: [
            'Leaky gut, or increased intestinal permeability, occurs when the tight junctions between cells in your intestinal lining become compromised, allowing undigested food particles, toxins, and bacteria to pass through into your bloodstream.',
            'This can trigger an immune response and inflammation throughout your body, potentially affecting your brain function and contributing to various health issues.',
            'Your gut and brain are connected through the gut-brain axis, a complex communication network involving the vagus nerve, immune system, and various signaling molecules. When your gut barrier is compromised, it can affect brain function and contribute to brain fog, mood disorders, inflammation, and more.'
        ],
        symptoms: [
            'Bloating and gas',
            'Food sensitivities',
            'IBS-like symptoms',
            'Chronic diarrhea or constipation',
            'Fatigue and low energy',
            'Joint pain and inflammation',
            'Skin issues (eczema, acne)',
            'Autoimmune conditions',
            'Brain fog and poor concentration',
            'Mood swings and anxiety',
            'Memory problems',
            'Headaches and migraines',
            'Nutrient deficiencies',
            'Weakened immune system',
            'Chronic inflammation',
            'Sleep disturbances'
        ],
        naturalSolutions: [
            { name: 'L-Glutamine', description: 'Supports gut lining repair and integrity', affiliateLink: 'https://amzn.to/3example10', price: '' },
            { name: 'Collagen Peptides', description: 'Supports gut lining structure and repair', affiliateLink: 'https://amzn.to/3example11', price: '' },
            { name: 'Probiotics', description: 'Support healthy gut microbiome and gut-brain axis', affiliateLink: 'https://amzn.to/3example12', price: '' },
            { name: 'Omega-3 Fish Oil', description: 'Reduces inflammation and supports brain health', affiliateLink: 'https://amzn.to/3example13', price: '' },
            { name: 'Zinc', description: 'Essential mineral for gut lining integrity and immune function', affiliateLink: 'https://amzn.to/3example14', price: '' },
            { name: 'Curcumin', description: 'Powerful anti-inflammatory that may help with gut and brain inflammation', affiliateLink: 'https://amzn.to/3example15', price: '' }
        ],
        disclaimer: 'This information is for educational purposes only. Leaky gut is a complex condition that requires proper medical evaluation. Always consult with a healthcare provider for diagnosis and treatment recommendations.'
    },
    'ibs': {
        name: 'IBS (Irritable Bowel Syndrome)',
        title: 'IBS (Irritable Bowel Syndrome)',
        description: 'Digestive disorder with abdominal pain and changes in bowel habits.',
        variants: {
            'IBS-D (Diarrhea-predominant)': {
                paragraphs: [
                    'IBS-D is characterized by frequent loose stools and abdominal discomfort. Management focuses on calming the gut, reducing triggers, and supporting healthy digestion.',
                    'Content coming soon!'
                ]
            },
            'IBS-C (Constipation-predominant)': {
                paragraphs: [
                    'IBS-C is characterized by infrequent, hard stools and abdominal discomfort. Management focuses on improving motility, fiber intake, and gut health.',
                    'Content coming soon!'
                ]
            },
            'IBS-M (Mixed type)': {
                paragraphs: [
                    'IBS-M involves alternating diarrhea and constipation. Management focuses on balancing the gut, reducing stress, and identifying dietary triggers.',
                    'Content coming soon!'
                ]
            }
        },
        disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.'
    },
    'migraine': {
        name: 'Migraine Relief',
        title: 'Migraine Relief',
        description: 'Natural solutions for migraine management and prevention.',
        variants: {
            'Default': {
                paragraphs: [
                    "Migraines are complex neurological conditions that can be debilitating. They involve changes in brain chemistry, blood vessel dilation, and inflammation. Common triggers include hormonal changes, food sensitivities, stress, sleep disturbances, environmental factors, and dehydration.",
                    "Natural approaches to migraine relief focus on reducing frequency, intensity, and duration of attacks through evidence-based herbs, supplements, and lifestyle changes."
                ],
                productFormulations: {
                    Feverfew: {
                        name: 'Feverfew',
                        description: 'Traditional migraine herb with anti-inflammatory properties.',
                        affiliateLink: 'https://amzn.to/feverfew-migraine',
                        price: '$15-22'
                    },
                    Butterbur: {
                        name: 'Butterbur',
                        description: 'Clinically proven to reduce migraine frequency.',
                        affiliateLink: 'https://amzn.to/butterbur-migraine',
                        price: '$18-28'
                    }
                },
                cautions: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
                relatedSymptoms: [
                    { name: 'Nausea & Vomiting', href: '/symptoms/nausea', color: 'purple' },
                    { name: 'Light Sensitivity', href: '/symptoms/light-sensitivity', color: 'blue' },
                    { name: 'Sound Sensitivity', href: '/symptoms/sound-sensitivity', color: 'green' }
                ],
                emergencyNote: 'If you experience a severe, sudden headache unlike any you\'ve had before, seek immediate medical attention. Call emergency services or go to the nearest emergency room.',
                herb: null,
                extract: null,
                supplements: null,
                related: null,
                faq: null
            }
        },
        relatedSymptoms: [
            { name: 'Nausea & Vomiting', href: '/symptoms/nausea', color: 'purple' },
            { name: 'Light Sensitivity', href: '/symptoms/light-sensitivity', color: 'blue' },
            { name: 'Sound Sensitivity', href: '/symptoms/sound-sensitivity', color: 'green' }
        ],
        emergencyNote: 'If you experience a severe, sudden headache unlike any you\'ve had before, seek immediate medical attention. Call emergency services or go to the nearest emergency room.',
        disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'burnout': {
        name: 'Emotional Burnout',
        title: 'Emotional Burnout',
        description: 'Chronic stress and emotional exhaustion affecting mood, energy, and motivation.',
        variants: {
            'Default': {
                paragraphs: [
                    "Burnout is a state of chronic stress and emotional exhaustion that can affect mood, energy, motivation, and overall wellbeing. It is common in high-pressure jobs, caregiving roles, and during prolonged periods of stress.",
                    "Natural approaches to burnout focus on stress reduction, nervous system support, and restoring energy and resilience."
                ],
                productFormulations: {
                    "Rhodiola Rosea": {
                        name: 'Rhodiola Rosea',
                        description: 'Adaptogenic herb that improves energy, reduces fatigue, and enhances stress resilience.',
                        affiliateLink: 'https://amzn.to/rhodiola-burnout',
                        price: '$25-35'
                    },
                    Ashwagandha: {
                        name: 'Ashwagandha',
                        description: 'Adaptogenic herb that reduces stress hormones and supports adrenal function.',
                        affiliateLink: 'https://amzn.to/ashwagandha-burnout',
                        price: '$18-28'
                    }
                },
            }
        },
        relatedSymptoms: [
            { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
            { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
            { name: 'Depression', href: '/symptoms/depression', color: 'blue' }
        ],
        disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'thyroid-issues': {
        name: 'Thyroid Health Support',
        title: 'Thyroid Health Support',
        description: 'Understanding and supporting thyroid function for energy and metabolism',
        variants: {
            'Default': {
                paragraphs: [
                    'Your thyroid gland regulates metabolism, energy production, body temperature, and many other vital functions. When thyroid function is compromised, it can affect every system in your body, leading to a wide range of symptoms.',
                    'Thyroid issues can be caused by nutrient deficiencies, stress, environmental factors, autoimmune conditions, and other health imbalances. Supporting thyroid health through diet, lifestyle, and targeted supplements can help restore balance.'
                ],
                productFormulations: {
                    Ashwagandha: {
                        name: 'Ashwagandha',
                        description: 'Adaptogenic herb that may support thyroid function',
                        affiliateLink: 'https://amzn.to/3thyroid-ashwagandha',
                        price: ''
                    },
                    Iodine: {
                        name: 'Iodine',
                        description: 'Essential mineral for thyroid hormone production',
                        affiliateLink: 'https://amzn.to/3thyroid-iodine',
                        price: ''
                    },
                    Selenium: {
                        name: 'Selenium',
                        description: 'Critical for thyroid hormone conversion and function',
                        affiliateLink: 'https://amzn.to/3thyroid-selenium',
                        price: ''
                    },
                    Zinc: {
                        name: 'Zinc',
                        description: 'Essential for thyroid hormone synthesis and conversion',
                        affiliateLink: 'https://amzn.to/3thyroid-zinc',
                        price: ''
                    }
                },
                cautions: 'This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting any new supplement regimen, especially if you have underlying health conditions or are taking medications. The product links are affiliate links that support this educational content.'
            }
        },
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'poor-focus': {
        name: 'Poor Focus',
        title: 'Poor Focus',
        description: 'Difficulty concentrating, maintaining attention, or staying focused on tasks.',
        variants: {
            'Default': {
                paragraphs: [
                    "Poor focus can manifest as difficulty concentrating, easily getting distracted, or having trouble completing tasks. This can be caused by stress, poor sleep, nutrient deficiencies, or underlying health conditions.",
                    "Brain fog specifically refers to a feeling of mental cloudiness, confusion, or difficulty thinking clearly. It's often associated with fatigue, stress, or hormonal imbalances.",
                    "Poor memory involves difficulty recalling information, learning new things, or retaining details. This can be age-related or due to stress, sleep issues, or nutrient deficiencies.",
                    "Natural approaches to improving focus and memory often involve supporting brain health through specific herbs and supplements that enhance blood flow, neurotransmitter function, and cellular energy production."
                ],
                productFormulations: {
                    "Ginkgo Biloba": {
                        name: 'Ginkgo Biloba',
                        description: 'Traditional herb that improves blood flow to the brain and clears mental fog.',
                        affiliateLink: 'https://amzn.to/ginkgo-brain-fog',
                        price: '$20-30'
                    },
                    "L-Theanine": {
                        name: 'L-Theanine',
                        description: 'Amino acid that promotes calm focus and reduces mental fatigue.',
                        affiliateLink: 'https://amzn.to/theanine-brain-fog',
                        price: '$15-25'
                    },
                    "Bacopa Monnieri": {
                        name: 'Bacopa Monnieri',
                        description: 'Ayurvedic herb that enhances memory and cognitive clarity.',
                        affiliateLink: 'https://amzn.to/bacopa-brain-fog',
                        price: '$25-35'
                    },
                    "Phosphatidylserine": {
                        name: 'Phosphatidylserine',
                        description: 'Essential brain phospholipid that supports cognitive function.',
                        affiliateLink: 'https://amzn.to/phosphatidylserine-brain-fog',
                        price: '$25-35'
                    }
                },
            },
            'Poor Memory': {
                productFormulations: {
                    "Bacopa Monnieri": {
                        name: 'Bacopa Monnieri',
                        description: 'Ayurvedic herb that enhances memory, learning, and information retention.',
                        affiliateLink: 'https://amzn.to/bacopa-memory',
                        price: '$25-35'
                    },
                    "Phosphatidylserine": {
                        name: 'Phosphatidylserine',
                        description: 'Essential brain phospholipid that supports memory formation and recall.',
                        affiliateLink: 'https://amzn.to/phosphatidylserine-memory',
                        price: '$25-35'
                    },
                    "Acetyl-L-Carnitine": {
                        name: 'Acetyl-L-Carnitine',
                        description: 'Amino acid that supports brain energy and memory function.',
                        affiliateLink: 'https://amzn.to/acetyl-carnitine-memory',
                        price: '$20-30'
                    },
                    "Omega-3 DHA": {
                        name: 'Omega-3 DHA',
                        description: 'Essential brain fat that supports memory and cognitive performance.',
                        affiliateLink: 'https://amzn.to/omega3-memory',
                        price: '$25-40'
                    }
                }
            },
        },
        disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'fatigue': {
        name: 'Fatigue',
        title: 'Fatigue',
        description: 'Persistent tiredness and lack of energy.',
        variants: {
            'Default': {
                paragraphs: [
                    'Fatigue is a common symptom with many possible causes, including stress, poor sleep, nutritional deficiencies, and underlying health conditions.',
                    'Content coming soon!'
                ],
            }
        },
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'hormonal-imbalances': {
        name: 'Hormonal Imbalances',
        title: 'Hormonal Imbalances',
        description: 'Disruptions in hormone levels affecting health and wellbeing.',
        variants: {
            'Default': {
                paragraphs: [
                    'Hormonal imbalances can cause a wide range of symptoms, from mood swings to fatigue and more.',
                    'Content coming soon!'
                ],
            }
        },
        herb: null,
        extract: null,
        supplements: null,
        related: null,
        faq: null
    },
    'mood-swings': {
        name: 'Mood Swings',
        title: 'Mood Swings',
        description: 'Rapid or unpredictable changes in mood, energy, or emotional state.',
        variants: {
            Default: {
                paragraphs: [
                    "Mood swings can be caused by hormonal fluctuations, stress, sleep disturbances, blood sugar imbalances, or underlying mental health conditions. They can affect relationships, work, and overall quality of life.",
                    "Stabilizing mood involves supporting healthy brain chemistry, hormone balance, and stress resilience. Lifestyle changes, therapy, and targeted supplements can all play a role.",
                    "If mood swings are severe, persistent, or associated with thoughts of self-harm, seek professional help immediately.",
                    "The following recommendations are designed to support emotional balance and resilience to stress."
                ],
                productFormulations: {
                    "St. John's Wort": {
                        name: "St. John's Wort",
                        description: "Traditional herb with clinical evidence for supporting mood stability and emotional balance. May interact with medications—consult your doctor before use.",
                        affiliateLink: 'https://amzn.to/st-johns-wort-mood',
                        price: '$20-30'
                    },
                    "Standardized Saffron Extract": {
                        name: 'Standardized Saffron Extract',
                        description: 'Saffron extract (standardized for crocin and safranal) has been shown in clinical trials to improve mood and reduce symptoms of mild to moderate depression and mood swings.',
                        affiliateLink: 'https://amzn.to/saffron-mood',
                        price: '$24-40'
                    },
                    "Omega-3 EPA/DHA": {
                        name: 'Omega-3 EPA/DHA',
                        description: 'Essential fatty acids for brain health and mood stability. EPA in particular is linked to improved emotional balance.',
                        affiliateLink: 'https://amzn.to/omega3-mood',
                        price: '$25-40'
                    },
                    "Magnesium Glycinate": {
                        name: 'Magnesium Glycinate',
                        description: 'Supports nervous system balance and may help reduce mood swings, irritability, and anxiety.',
                        affiliateLink: 'https://amzn.to/magnesium-mood',
                        price: '$18-28'
                    }
                },
            }
        },
        disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen."
    },
    'stress': {
        name: 'Stress',
        title: 'Stress',
        description: 'Physical and emotional responses to challenging or demanding situations.',
        variants: {
            Default: {
                paragraphs: [
                    "Stress is a natural response to perceived threats or demands, but chronic stress can negatively impact health, mood, and well-being. It can manifest as tension, irritability, sleep problems, digestive issues, and more.",
                    "Effective stress management involves a combination of lifestyle changes, relaxation techniques, and, when appropriate, targeted supplements or herbal remedies.",
                    "If stress feels overwhelming or persistent, consider seeking support from a healthcare professional or counselor."
                ],
                productFormulations: {
                    "Ashwagandha": {
                        name: 'Ashwagandha',
                        description: 'Herb for stress.',
                        affiliateLink: '#',
                        price: '$15-25'
                    },
                    "Rhodiola Extract": {
                        name: 'Rhodiola Extract',
                        description: 'Standardized extract for stress.',
                        affiliateLink: '#',
                        price: '$18-28'
                    },
                    "Magnesium Glycinate": {
                        name: 'Magnesium Glycinate',
                        description: 'Supplement for stress.',
                        affiliateLink: '#',
                        price: '$12-22'
                    },
                    "L-Theanine": {
                        name: 'L-Theanine',
                        description: 'Supplement for stress.',
                        affiliateLink: '#',
                        price: '$12-22'
                    },
                    "B-Complex Vitamins": {
                        name: 'B-Complex Vitamins',
                        description: 'Supplement for stress.',
                        affiliateLink: '#',
                        price: '$12-22'
                    }
                }
            }
        }
    }
};
