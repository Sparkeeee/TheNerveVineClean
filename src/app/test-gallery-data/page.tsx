import { getCachedSupplement } from '@/lib/database';

export default async function TestGalleryData() {
  // Test with a known supplement
  const supplement = await getCachedSupplement('l-theanine');
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Gallery Images Data Test</h1>
        
        {supplement ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Supplement: {supplement.name}</h2>
              <p>Slug: {supplement.slug}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Gallery Images Raw Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(supplement.galleryImages, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">Gallery Images Type:</h3>
              <p>Type: {typeof supplement.galleryImages}</p>
              <p>Is Array: {Array.isArray(supplement.galleryImages) ? 'Yes' : 'No'}</p>
              <p>Is String: {typeof supplement.galleryImages === 'string' ? 'Yes' : 'No'}</p>
              <p>Is Null: {supplement.galleryImages === null ? 'Yes' : 'No'}</p>
              <p>Is Undefined: {supplement.galleryImages === undefined ? 'Yes' : 'No'}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Hero Image:</h3>
              <p>{supplement.heroImageUrl || 'No hero image'}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">All Supplement Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(supplement, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-red-600">Supplement not found!</h2>
            <p>Could not fetch supplement data from database.</p>
          </div>
        )}
      </div>
    </div>
  );
}