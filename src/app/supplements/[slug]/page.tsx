import Link from 'next/link';
import Image from 'next/image';
import { getCachedSupplement } from '@/lib/database';

export default async function SupplementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch supplement data directly from database instead of API
  let supplement;
  try {
    supplement = await getCachedSupplement(slug);
  } catch (error) {
    console.error('Error in supplement page:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Temporarily Unavailable</h1>
          <p className="text-gray-600 mb-4">We&apos;re experiencing technical difficulties. Please try again later.</p>
          <Link 
            href="/supplements" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Supplements
          </Link>
        </div>
      </div>
    );
  }

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Supplement Not Found</h1>
          <p className="text-gray-600 mb-4">The supplement &quot;{slug}&quot; could not be found.</p>
          <Link 
            href="/supplements" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Supplements
          </Link>
        </div>
      </div>
    );
  }

  // Process description with error handling
  let description;
  try {
    description = supplement.description || 'This supplement supports overall wellness.';
  } catch (error) {
    console.error('Error processing supplement description:', error);
    description = 'This supplement supports overall wellness.';
  }

  // Process products with error handling
  let products;
  try {
    products = supplement.products || [];
  } catch (error) {
    console.error('Error processing supplement products:', error);
    products = [];
  }

  // Prepare product cards from DB with error handling
  let productCards: JSX.Element[] = [];
  try {
    if (Array.isArray(products) && products.length > 0) {
      productCards = products.map((product: any, idx: number) => (
        <div key={idx} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4 bg-white">
          <h3 className="font-semibold text-lime-900 mb-2">{product.name || 'Product'}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description || 'Product description coming soon.'}</p>
          {product.price && (
            <p className="text-lime-700 font-medium">${product.price}</p>
          )}
        </div>
      ));
    }
  } catch (error) {
    console.error('Error processing product cards:', error);
    productCards = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {supplement.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Multiple Molecular Structure Images - Database-driven with error handling */}
          {supplement.galleryImages && (() => {
            try {
              // Handle JSON data from database
              let imageUrls: string[] = [];
              
              if (typeof supplement.galleryImages === 'string') {
                // Try to parse JSON string
                try {
                  const parsed = JSON.parse(supplement.galleryImages);
                  if (Array.isArray(parsed)) {
                    imageUrls = parsed;
                  } else if (typeof parsed === 'string') {
                    imageUrls = parsed.split(',').map((url: string) => url.trim()).filter((url: string) => url);
                  }
                } catch {
                  // If JSON parsing fails, treat as comma-separated string
                  imageUrls = supplement.galleryImages.split(',').map((url: string) => url.trim()).filter((url: string) => url);
                }
              } else if (Array.isArray(supplement.galleryImages)) {
                // Already an array
                imageUrls = supplement.galleryImages;
              } else if (typeof supplement.galleryImages === 'object' && supplement.galleryImages !== null) {
                // JSON object - try to extract URLs
                const obj = supplement.galleryImages as any;
                if (obj.urls && Array.isArray(obj.urls)) {
                  imageUrls = obj.urls;
                } else if (obj.images && Array.isArray(obj.images)) {
                  imageUrls = obj.images;
                } else {
                  // Try to convert object values to array
                  imageUrls = Object.values(obj).filter((val: any) => typeof val === 'string');
                }
              }
              
              // Only render if we have actual image URLs
              if (imageUrls.length > 0) {
                return (
                  <div className="flex justify-center mb-6">
                    <div className="flex gap-4 flex-wrap justify-center">
                      {imageUrls.map((imageUrl: string, index: number) => (
                        <Image 
                          key={index}
                          src={imageUrl} 
                          alt={`${supplement.name} molecular structure ${index + 1}`} 
                          width={400} 
                          height={300} 
                          className={`rounded-lg shadow-md w-auto h-auto object-contain ${
                            supplement.name?.toLowerCase().includes('l-tryptophan') 
                              ? 'max-w-xs max-h-48' 
                              : 'max-w-md max-h-80'
                          }`}
                          priority
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            } catch (error) {
              console.error('Error processing gallery images:', error);
            }
            return null;
          })()}
          
          {/* Single Molecular Structure Image - Fallback */}
          {supplement.heroImageUrl && (!supplement.galleryImages || (() => {
            try {
              // Check if galleryImages is empty
              if (Array.isArray(supplement.galleryImages)) {
                return supplement.galleryImages.length === 0;
              } else if (typeof supplement.galleryImages === 'string') {
                return !supplement.galleryImages.trim();
              }
              return true; // If galleryImages is null/undefined, show heroImageUrl
            } catch (error) {
              console.error('Error checking gallery images:', error);
              return true; // Fallback to showing heroImageUrl
            }
          })()) && (
            <div className="flex justify-center mb-6">
              <Image 
                src={supplement.heroImageUrl} 
                alt={`${supplement.name} molecular structure`} 
                width={400} 
                height={300} 
                className={`rounded-lg shadow-md w-auto h-auto object-contain ${
                  supplement.name?.toLowerCase().includes('l-tryptophan') 
                    ? 'max-w-xs max-h-48' 
                    : 'max-w-md max-h-80'
                }`}
                priority
              />
            </div>
          )}
          
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-lime-800 mb-4">Supplement Details</h2>
              <ul className="space-y-3">
                {supplement.cautions && (
                  <li className="flex items-start">
                    <span className="text-lime-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{supplement.cautions}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-semibold text-lime-800 mb-6">Top Products</h2>
            <div className="space-y-4">{productCards}</div>
          </div>
        </div>
        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Disclaimer:</strong> These statements have not been evaluated by the FDA. 
            This product is not intended to diagnose, treat, cure, or prevent any disease. 
            Always consult with a healthcare professional before starting any new supplement regimen.
          </p>
        </div>
      </div>
    </div>
  );
} 