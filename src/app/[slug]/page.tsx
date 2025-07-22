import { notFound } from 'next/navigation';

interface PageParams {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageParams) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Symptom: {slug}</h1>
          <p className="text-xl text-blue-700 mb-6">This is a test page for the {slug} symptom.</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Test Content</h2>
          <p className="text-gray-700">This is a minimal test page to verify the routing works correctly.</p>
        </div>
      </div>
    </div>
  );
} 