import { getCachedSupplement, getCachedHerb, getCachedSymptom } from '@/lib/database';

export default async function TestRealContent() {
  // Test with known slugs
  const lTheanine = await getCachedSupplement('l-theanine');
  const ashwagandha = await getCachedHerb('ashwagandha');
  const anxiety = await getCachedSymptom('anxiety');
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Real Content Test</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">L-Theanine Supplement</h2>
            <div className="bg-gray-50 p-4 rounded">
              {lTheanine ? (
                <div>
                  <p><strong>Name:</strong> {lTheanine.name}</p>
                  <p><strong>Slug:</strong> {lTheanine.slug}</p>
                  <p><strong>Description:</strong> {lTheanine.description?.substring(0, 100)}...</p>
                  <p><strong>Gallery Images:</strong> {lTheanine.galleryImages ? 'Present' : 'Missing'}</p>
                  <p><strong>Products:</strong> {lTheanine.products?.length || 0} products</p>
                </div>
              ) : (
                <p className="text-red-600">L-Theanine not found in database!</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Ashwagandha Herb</h2>
            <div className="bg-gray-50 p-4 rounded">
              {ashwagandha ? (
                <div>
                  <p><strong>Name:</strong> {ashwagandha.name}</p>
                  <p><strong>Slug:</strong> {ashwagandha.slug}</p>
                  <p><strong>Description:</strong> {ashwagandha.description?.substring(0, 100)}...</p>
                  <p><strong>Gallery Images:</strong> {ashwagandha.galleryImages ? 'Present' : 'Missing'}</p>
                  <p><strong>Products:</strong> {ashwagandha.products?.length || 0} products</p>
                </div>
              ) : (
                <p className="text-red-600">Ashwagandha not found in database!</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Anxiety Symptom</h2>
            <div className="bg-gray-50 p-4 rounded">
              {anxiety ? (
                <div>
                  <p><strong>Title:</strong> {anxiety.title}</p>
                  <p><strong>Slug:</strong> {anxiety.slug}</p>
                  <p><strong>Description:</strong> {anxiety.description?.substring(0, 100)}...</p>
                  <p><strong>Products:</strong> {anxiety.products?.length || 0} products</p>
                </div>
              ) : (
                <p className="text-red-600">Anxiety not found in database!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}