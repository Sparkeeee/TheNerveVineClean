import { getCachedHerbs, getCachedSupplements, getCachedSymptoms } from '@/lib/database';

export default async function TestDbDataPage() {
  let herbs = [];
  let supplements = [];
  let symptoms = [];
  
  try {
    herbs = await getCachedHerbs();
  } catch (error) {
    console.error('Error fetching herbs:', error);
  }
  
  try {
    supplements = await getCachedSupplements();
  } catch (error) {
    console.error('Error fetching supplements:', error);
  }
  
  try {
    symptoms = await getCachedSymptoms();
  } catch (error) {
    console.error('Error fetching symptoms:', error);
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Database Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Herbs ({herbs.length})</h2>
          <div className="space-y-2">
            {herbs.map((herb: any, index: number) => (
              <div key={index} className="p-2 border rounded">
                <strong>{herb.name}</strong><br/>
                Slug: {herb.slug}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Supplements ({supplements.length})</h2>
          <div className="space-y-2">
            {supplements.map((supplement: any, index: number) => (
              <div key={index} className="p-2 border rounded">
                <strong>{supplement.name}</strong><br/>
                Slug: {supplement.slug}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Symptoms ({symptoms.length})</h2>
          <div className="space-y-2">
            {symptoms.map((symptom: any, index: number) => (
              <div key={index} className="p-2 border rounded">
                <strong>{symptom.title}</strong><br/>
                Slug: {symptom.slug}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}