'use client';

import { useState } from 'react';

export default function TestLinkHerb() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const linkGinkgoToAlzheimers = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // First, let's find Ginkgo's slug
      const herbsResponse = await fetch('/api/herbs');
      const herbsData = await herbsResponse.json();
      
      if (!herbsData.success) {
        throw new Error('Failed to fetch herbs');
      }
      
      // The API returns { herbs, pagination } structure
      const herbs = herbsData.data.herbs || herbsData.data;
      
      if (!Array.isArray(herbs)) {
        console.error('Herbs data structure:', herbsData);
        throw new Error('Herbs data is not an array');
      }
      
      const ginkgo = herbs.find((herb: any) => 
        herb.name?.toLowerCase().includes('ginkgo')
      );
      
      if (!ginkgo) {
        throw new Error('Ginkgo not found in herbs');
      }
      
      console.log('Found Ginkgo:', ginkgo);
      
      // Now link Ginkgo to Alzheimer's indication (ID: 1)
      const linkResponse = await fetch(`/api/herbs/${ginkgo.slug}/indications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          indicationIds: [1] // Alzheimer's Disease
        }),
      });
      
      const linkData = await linkResponse.json();
      
      if (linkData.success) {
        setMessage(`✅ Successfully linked ${ginkgo.name} to Alzheimer&apos;s indication!`);
      } else {
        throw new Error(linkData.error || 'Failed to link herb to indication');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Test Herb-Indication Link</h1>
        
        <button
          onClick={linkGinkgoToAlzheimers}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Linking...' : 'Link Ginkgo to Alzheimer&apos;s'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>This will:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Find Ginkgo Biloba in the herbs database</li>
            <li>Link it to the &quot;Alzheimer&apos;s Disease&quot; indication</li>
            <li>Make the blue tag appear on Ginkgo&apos;s herb card</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
