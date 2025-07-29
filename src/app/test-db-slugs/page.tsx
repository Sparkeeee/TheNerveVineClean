import { getCachedHerbs, getCachedSupplements, getCachedSymptoms } from '@/lib/database';

export default async function TestDbSlugs() {
  // Fetch all data from database
  const herbs = await getCachedHerbs();
  const supplements = await getCachedSupplements();
  const symptoms = await getCachedSymptoms();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Database Slugs Test</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Herbs ({herbs.length})</h2>
            <div className="bg-gray-50 p-4 rounded">
              {herbs.length > 0 ? (
                <ul className="space-y-1">
                  {herbs.map((herb: any) => (
                    <li key={herb.id} className="text-sm">
                      <strong>{herb.name}</strong> - <code>{herb.slug}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600">No herbs found in database!</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Supplements ({supplements.length})</h2>
            <div className="bg-gray-50 p-4 rounded">
              {supplements.length > 0 ? (
                <ul className="space-y-1">
                  {supplements.map((supplement: any) => (
                    <li key={supplement.id} className="text-sm">
                      <strong>{supplement.name}</strong> - <code>{supplement.slug}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600">No supplements found in database!</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Symptoms ({symptoms.length})</h2>
            <div className="bg-gray-50 p-4 rounded">
              {symptoms.length > 0 ? (
                <ul className="space-y-1">
                  {symptoms.map((symptom: any) => (
                    <li key={symptom.id} className="text-sm">
                      <strong>{symptom.title}</strong> - <code>{symptom.slug}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600">No symptoms found in database!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}