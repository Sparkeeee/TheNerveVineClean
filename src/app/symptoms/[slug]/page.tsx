'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VariantSymptomPage from './VariantSymptomPage';
import { Symptom as SymptomType } from '@/types/symptom';

export default function SymptomPage({ params }: { params: { slug: string } }) {
  const [symptom, setSymptom] = React.useState<any>(null);
  const [markdownArticle, setMarkdownArticle] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      const { slug } = params;
      
      // Fetch symptom data via API
      try {
        const symptomResponse = await fetch(`/api/symptoms/by-slug/${slug}`);
        if (symptomResponse.ok) {
          const symptomData = await symptomResponse.json();
          
          setSymptom(symptomData);
          
          // Use comprehensiveArticle from database if available
          if (symptomData.comprehensiveArticle) {
            setMarkdownArticle(symptomData.comprehensiveArticle);
          } else {
            // Fallback to file-based system
            try {
              const articleResponse = await fetch(`/api/articles/${slug}`);
              if (articleResponse.ok) {
                const article = await articleResponse.text();
                setMarkdownArticle(article);
              }
            } catch (error) {
              console.log('No markdown article found for this symptom');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching symptom data:', error);
      }
      
      setLoading(false);
    }

    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!symptom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Symptom Not Found</h1>
          <p className="text-gray-600 mb-4">The symptom could not be found.</p>
          <Link 
            href="/symptoms" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Symptoms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <VariantSymptomPage 
      symptom={symptom}
      selectedVariant={selectedVariant}
      onVariantSelect={setSelectedVariant}
      markdownArticle={markdownArticle}
      products={symptom.products || []}
    />
  );
} 