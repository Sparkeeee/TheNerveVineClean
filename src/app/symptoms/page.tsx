'use client';

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import SymptomHierarchyDiagram from '@/components/SymptomHierarchyDiagram';
import BodyMap from '@/components/BodyMap';

// Component to render hierarchy content directly on the page
function SymptomHierarchyContent() {
  const [hierarchyData, setHierarchyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/symptoms/hierarchy');
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data)) {
          setHierarchyData(result.data);
        } else if (Array.isArray(result)) {
          setHierarchyData(result);
        } else {
          setHierarchyData([]);
        }
      } else {
        setHierarchyData([]);
      }
    } catch (error) {
      setHierarchyData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading symptoms...</span>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm text-gray-700">
      {hierarchyData.map((symptom) => (
        <div key={symptom.id} className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="font-bold text-blue-600 text-base mb-2">
            <Link 
              href={`/symptoms/${symptom.slug}`}
              className="hover:underline"
            >
              {symptom.title}
            </Link>
          </div>
          {symptom.variants && symptom.variants.length > 0 && (
            <div className="ml-4 space-y-1">
              {symptom.variants.map((variant: any, vIndex: number) => (
                <div key={variant.id} className="flex items-center">
                  <span className="text-gray-400 text-sm mr-2">
                    {vIndex === symptom.variants.length - 1 ? '└─ ' : '├─ '}
                  </span>
                  <Link 
                    href={`/symptoms/${symptom.slug}?variant=${variant.name}`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    {variant.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Summary */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="text-center text-sm text-gray-500">
          <span className="font-semibold text-blue-600">{hierarchyData.length}</span> symptoms • 
          <span className="font-semibold text-green-600 ml-1">
            {hierarchyData.reduce((sum: number, symptom: any) => sum + (symptom.variants?.length || 0), 0)}
          </span> variants
        </div>
      </div>
    </div>
  );
}

interface Symptom {
  name: string;
  href: string;
  description: string;
}

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [showBodyMap, setShowBodyMap] = useState(false);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch('/api/symptoms');
      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result); // Debug log
        
        // Handle the API response format: { success: true, data: { symptoms: [...], pagination: {...} } }
        if (result.success && result.data) {
          if (result.data.symptoms && Array.isArray(result.data.symptoms)) {
            setSymptoms(result.data.symptoms);
          } else if (Array.isArray(result.data)) {
            // Fallback if data is array directly
            setSymptoms(result.data);
          } else {
            console.error('Unexpected data format in successful response:', result.data);
            setSymptoms([]);
          }
        } else if (Array.isArray(result)) {
          // Fallback if API returns array directly (old format)
          setSymptoms(result);
        } else {
          console.error('API response not successful or unexpected format:', result);
          setSymptoms([]);
        }
      } else {
        console.error('API response not OK:', response.status, response.statusText);
        setSymptoms([]);
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback symptom list with additional conditions
  const fallbackSymptoms: Symptom[] = [
    { name: "Anxiety", href: "/symptoms/anxiety", description: "Stress, worry, and nervous tension" },
    { name: "Depression", href: "/symptoms/depression", description: "Low mood, sadness, and emotional well-being" },
    { name: "Insomnia", href: "/symptoms/insomnia", description: "Sleep difficulties and restlessness" },
    { name: "Stress", href: "/symptoms/stress", description: "Mental and physical tension management" },
    { name: "Headaches", href: "/symptoms/headaches", description: "Tension and migraine relief" },
    { name: "Multiple Sclerosis (MS)", href: "/symptoms/multiple-sclerosis", description: "Nerve damage, mobility issues" },
    { name: "Parkinson's Disease", href: "/symptoms/parkinsons-disease", description: "Movement disorders, tremors" },
    { name: "Alzheimer's Disease", href: "/symptoms/alzheimers-disease", description: "Memory loss, cognitive decline" },
    { name: "Neuropathy", href: "/symptoms/neuropathy", description: "Nerve pain, numbness, tingling" },
    { name: "Fibromyalgia", href: "/symptoms/fibromyalgia", description: "Chronic pain, fatigue, sleep issues" },
    { name: "Chronic Fatigue Syndrome", href: "/symptoms/chronic-fatigue-syndrome", description: "Extreme fatigue, cognitive issues" },
    { name: "Restless Leg Syndrome", href: "/symptoms/restless-leg-syndrome", description: "Sleep disruption, leg discomfort" },
    { name: "Essential Tremor", href: "/symptoms/essential-tremor", description: "Involuntary shaking" },
    { name: "Peripheral Neuropathy", href: "/symptoms/peripheral-neuropathy", description: "Nerve damage in extremities" },
    { name: "Post-Stroke Recovery", href: "/symptoms/post-stroke-recovery", description: "Cognitive and physical rehabilitation" }
  ];

  const symptomList: Symptom[] = Array.isArray(symptoms) && symptoms.length > 0 ? symptoms.map((symptom: any): Symptom => ({
    name: symptom.title,
    href: `/symptoms/${symptom.slug}`,
    description: symptom.description ? 
      (symptom.description.length > 100 ? 
        symptom.description.substring(0, 100) + '...' : 
        symptom.description) : 
      'Natural solutions for health and wellness'
  })) : fallbackSymptoms;

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative flex items-center justify-center" style={{
        backgroundImage: "url('/images/RoseWPWM.PNG')",
        backgroundSize: "110%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}>
        <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
        <div className="relative text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading symptoms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10" style={{
        backgroundImage: "url('/images/RoseWPWM.PNG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      </div>
      
      {/* ALL Symptoms/Variants Button with Dropdown - Hidden at 515px and below */}
      <div className="hidden sm:block fixed top-40 left-6 z-50" style={{ transform: 'translateZ(0)' }}>
        <div className="relative">
          <button
            onClick={() => setShowHierarchy(!showHierarchy)}
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            ALL Symptoms/Variants
            <svg className={`w-4 h-4 ml-2 transition-transform ${showHierarchy ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Hierarchy */}
          <SymptomHierarchyDiagram 
            isOpen={showHierarchy}
            onClose={() => setShowHierarchy(false)}
          />
        </div>
      </div>

      {/* View BodyMap Button - Top Right (Symmetrical) - Hidden at 515px and below */}
      <div className="hidden sm:block fixed top-40 right-6 z-50" style={{ transform: 'translateZ(0)' }}>
        <button
          onClick={() => setShowBodyMap(!showBodyMap)}
          className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7z" />
          </svg>
          View BodyMap
        </button>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-0 pb-8">
        {/* Hero Section - Hidden at 515px and below */}
        <div className="hidden sm:block rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Symptoms & Conditions</h1>
          
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore natural solutions for various health concerns. Each symptom page provides 
            targeted herbal and supplement recommendations to support your wellness journey.
          </p>
        </div>
        
        {/* Symptom Cards Grid - Hidden at 515px and below */}
        <div className="hidden sm:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptomList.map((symptom: Symptom, index: number) => (
            <Link 
              key={index} 
              href={symptom.href}
              className="rounded-xl p-6 shadow-sm border-2 border-gray-300 transition-all duration-200 bg-white hover:bg-amber-50 hover:border-gray-400 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{symptom.name}</h3>
              <p className="text-gray-600 text-sm">{symptom.description}</p>
            </Link>
          ))}
        </div>
        
        {/* Back Button - Hidden at 515px and below */}
        <div className="hidden sm:block mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
          >
            ← Back to NerveVine
          </Link>
        </div>

        {/* Full Page Hierarchy Content - Visible only at 515px and below */}
        <div className="block sm:hidden">
          {/* Hero Section for Mobile - Same as larger screens but smaller padding */}
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300 mb-6" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Symptoms & Conditions</h1>
            
            <p className="text-base text-gray-700 text-center max-w-3xl mx-auto">
              Explore natural solutions for various health concerns. Each symptom page provides 
              targeted herbal and supplement recommendations to support your wellness journey.
            </p>
          </div>
          
          {/* Mobile BodyMap Button - Below hero, centered */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowBodyMap(!showBodyMap)}
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7z" />
              </svg>
              View BodyMap
            </button>
          </div>
          
          {/* Tree Diagram Container - No additional text above */}
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <SymptomHierarchyContent />
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
            >
              ← Back to NerveVine
            </Link>
          </div>
        </div>

        {/* BodyMap Modal */}
        {showBodyMap && (
          <BodyMap startLive={true} />
        )}
      </div>
    </div>
  );
} 