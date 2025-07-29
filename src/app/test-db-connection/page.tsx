import prisma from '@/lib/database';

export default async function TestDbConnectionPage() {
  let connectionStatus = 'Unknown';
  let herbCount = 0;
  let sampleHerb = null;
  
  try {
    // Test database connection
    await prisma.$connect();
    connectionStatus = 'Connected';
    
    // Count herbs
    herbCount = await prisma.herb.count();
    
    // Get a sample herb
    sampleHerb = await prisma.herb.findFirst({
      select: { id: true, name: true, slug: true }
    });
    
  } catch (error) {
    connectionStatus = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  } finally {
    try {
      await prisma.$disconnect();
    } catch {
      // Ignore disconnect errors
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Connection Status</h2>
          <p className="text-lg">{connectionStatus}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Herb Count</h2>
          <p className="text-lg">{herbCount}</p>
        </div>
        
        {sampleHerb && (
          <div className="p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">Sample Herb</h2>
            <p><strong>ID:</strong> {sampleHerb.id}</p>
            <p><strong>Name:</strong> {sampleHerb.name}</p>
            <p><strong>Slug:</strong> {sampleHerb.slug}</p>
          </div>
        )}
      </div>
    </div>
  );
}