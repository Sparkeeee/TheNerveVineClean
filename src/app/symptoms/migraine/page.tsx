import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Migraine Relief - Natural Solutions & Herbs | NerveVine',
  description: 'Discover natural migraine relief with herbs, supplements, and lifestyle changes. Learn about feverfew, butterbur, magnesium, and other evidence-based solutions.',
  keywords: 'migraine relief, natural migraine treatment, feverfew, butterbur, migraine herbs, migraine supplements',
};

export default function MigrainePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Migraine Relief</h1>
          <p className="text-xl text-purple-700 mb-4">Natural Solutions for Migraine Management</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Migraines are complex neurological conditions that can be debilitating. 
            Discover evidence-based natural approaches to reduce frequency, intensity, and duration of migraine attacks.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Understanding Migraines */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Understanding Migraines</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Migraines are more than just headaches - they&apos;re complex neurological events involving 
                  changes in brain chemistry, blood vessel dilation, and inflammation. Common triggers include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hormonal changes (especially in women)</li>
                  <li>Food sensitivities (tyramine, MSG, artificial sweeteners)</li>
                  <li>Stress and emotional factors</li>
                  <li>Sleep disturbances</li>
                  <li>Environmental factors (bright lights, strong smells)</li>
                  <li>Weather changes</li>
                  <li>Dehydration</li>
                </ul>
              </div>
            </div>

            {/* Natural Solutions */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Natural Solutions</h2>
              
              {/* Herbs */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🌿 Herbal Medicines</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Feverfew</h4>
                    <p className="text-sm text-gray-600 mb-2">Traditional migraine herb with anti-inflammatory properties</p>
                    <Link href="/herbs/feverfew" className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Learn more →
                    </Link>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Butterbur</h4>
                    <p className="text-sm text-gray-600 mb-2">Clinically proven to reduce migraine frequency</p>
                    <Link href="/herbs/butterbur" className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Learn more →
                    </Link>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Ginger</h4>
                    <p className="text-sm text-gray-600 mb-2">Natural anti-inflammatory and nausea relief</p>
                    <Link href="/herbs/ginger" className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Learn more →
                    </Link>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Peppermint</h4>
                    <p className="text-sm text-gray-600 mb-2">Topical application for tension relief</p>
                    <Link href="/herbs/peppermint" className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Supplements */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">💊 Supplements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Magnesium</h4>
                    <p className="text-sm text-gray-600 mb-2">Essential mineral for nerve function and muscle relaxation</p>
                    <Link href="/supplements/magnesium" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Learn more →
                    </Link>
                  </div>
                  <div className="border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Riboflavin (B2)</h4>
                    <p className="text-sm text-gray-600 mb-2">High-dose B2 reduces migraine frequency</p>
                    <Link href="/supplements/b-complex" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Learn more →
                    </Link>
                  </div>
                  <div className="border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Coenzyme Q10</h4>
                    <p className="text-sm text-gray-600 mb-2">Supports cellular energy production</p>
                    <span className="text-gray-500 text-sm">Coming soon</span>
                  </div>
                  <div className="border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Melatonin</h4>
                    <p className="text-sm text-gray-600 mb-2">Regulates sleep cycles and may prevent migraines</p>
                    <span className="text-gray-500 text-sm">Coming soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle & Prevention */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Lifestyle & Prevention</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-700 mb-2">Sleep Hygiene</h3>
                  <p className="text-gray-700 text-sm">
                    Maintain consistent sleep schedule, avoid screens before bed, create a dark, cool sleep environment.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-700 mb-2">Stress Management</h3>
                  <p className="text-gray-700 text-sm">
                    Practice meditation, deep breathing, yoga, or progressive muscle relaxation techniques.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-700 mb-2">Dietary Considerations</h3>
                  <p className="text-gray-700 text-sm">
                    Keep a food diary to identify triggers, stay hydrated, avoid skipping meals, limit caffeine and alcohol.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-700 mb-2">Exercise</h3>
                  <p className="text-gray-700 text-sm">
                    Regular moderate exercise can reduce migraine frequency, but avoid intense exercise during attacks.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety & Warnings */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-yellow-800 mb-4">⚠️ Important Safety Information</h2>
              <div className="space-y-3 text-yellow-800">
                <p className="text-sm">
                  <strong>Consult your healthcare provider</strong> before starting any new supplements, especially if you:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Take prescription medications</li>
                  <li>Have underlying health conditions</li>
                  <li>Are pregnant or breastfeeding</li>
                  <li>Experience severe or frequent migraines</li>
                </ul>
                <p className="text-sm">
                  <strong>Seek immediate medical attention</strong> if you experience:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Worst headache of your life</li>
                  <li>Headache with fever and stiff neck</li>
                  <li>Headache with confusion or loss of consciousness</li>
                  <li>Headache following head injury</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/symptoms/anxiety" className="block">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 hover:from-purple-100 hover:to-blue-100 transition-colors cursor-pointer">
                    <div className="text-purple-800 font-medium text-sm">Anxiety & Stress</div>
                  </div>
                </Link>
                <Link href="/symptoms/insomnia" className="block">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 hover:from-blue-100 hover:to-indigo-100 transition-colors cursor-pointer">
                    <div className="text-blue-800 font-medium text-sm">Sleep Issues</div>
                  </div>
                </Link>
                <Link href="/symptoms/muscle-tension" className="block">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 hover:from-green-100 hover:to-emerald-100 transition-colors cursor-pointer">
                    <div className="text-green-800 font-medium text-sm">Muscle Tension</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Related Symptoms */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Related Symptoms</h3>
              <div className="space-y-2">
                <Link href="/symptoms/nausea" className="block text-purple-600 hover:text-purple-800 text-sm">
                  Nausea & Vomiting
                </Link>
                <Link href="/symptoms/light-sensitivity" className="block text-purple-600 hover:text-purple-800 text-sm">
                  Light Sensitivity
                </Link>
                <Link href="/symptoms/sound-sensitivity" className="block text-purple-600 hover:text-purple-800 text-sm">
                  Sound Sensitivity
                </Link>
                <Link href="/symptoms/aura" className="block text-purple-600 hover:text-purple-800 text-sm">
                  Visual Aura
                </Link>
              </div>
            </div>

            {/* Emergency Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">🚨 Emergency</h3>
              <p className="text-red-700 text-sm mb-3">
                If you experience a severe, sudden headache unlike any you&apos;ve had before, seek immediate medical attention.
              </p>
              <p className="text-red-700 text-sm">
                Call emergency services or go to the nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 