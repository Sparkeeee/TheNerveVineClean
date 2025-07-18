export default function sitemap() {
    const baseUrl = 'https://thenervevine.com';
    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
    // Dynamic herb pages (you can expand this based on your herbs data)
    const herbPages = [
        'ashwagandha',
        'valerian-root',
        'chamomile',
        'passionflower',
        'lemon-balm',
        'skullcap',
        'st-johns-wort',
        'lavender',
        'magnolia-bark',
        'rhodiola',
    ].map(herb => ({
        url: `${baseUrl}/herbs/${herb}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));
    // Dynamic symptom pages
    const symptomPages = [
        'anxiety',
        'insomnia',
        'stress',
        'depression',
        'adhd',
        'panic-attacks',
        'nervous-tension',
        'burnout',
        'adrenal-fatigue',
        'circadian-rhythm',
    ].map(symptom => ({
        url: `${baseUrl}/symptoms/${symptom}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));
    // Dynamic supplement pages
    const supplementPages = [
        'sleep-aids',
        'anxiety-relief',
        'stress-support',
        'mood-enhancers',
        'nervous-system-support',
        'cognitive-enhancement',
        'adrenal-support',
        'circadian-support',
    ].map(supplement => ({
        url: `${baseUrl}/supplements/${supplement}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));
    return [...staticPages, ...herbPages, ...symptomPages, ...supplementPages];
}
