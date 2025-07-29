import Link from 'next/link';
import Image from 'next/image';
import { getCachedHerb } from '@/lib/database';

export default async function HerbPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  console.log(`[DEBUG] Herb page called with slug: ${slug}`);
  
  // Fetch herb data directly from database instead of API
  let herb;
  try {
    herb = await getCachedHerb(slug);
    console.log(`[DEBUG] Herb query result:`, herb ? 'Found' : 'Not found');
  } catch (error) {
    console.error('Error in herb page:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Temporarily Unavailable</h1>
          <p className="text-gray-600 mb-4">We&apos;re experiencing technical difficulties. Please try again later.</p>
          <Link 
            href="/herbs" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Herbs
          </Link>
        </div>
      </div>
    );
  }

  if (!herb) {
    console.log(`[DEBUG] Herb not found for slug: ${slug}`);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Herb Not Found</h1>
          <p className="text-gray-600 mb-4">The herb &quot;{slug}&quot; could not be found.</p>
          <Link 
            href="/herbs" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Herbs
          </Link>
        </div>
      </div>
    );
  }

  // Process products with error handling
  let products;
  try {
    products = herb.products || [];
  } catch (error) {
    console.error('Error processing herb products:', error);
    products = [];
  }

  // Process indications with error handling
  let indications;
  try {
    indications = herb.indications || [];
  } catch (error) {
    console.error('Error processing herb indications:', error);
    indications = [];
  }

  // Prepare product cards from DB with error handling
  let productCards: JSX.Element[] = [];
  try {
    if (Array.isArray(products) && products.length > 0) {
      productCards = products.map((product: any, idx: number) => (
        <div key={idx} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4 bg-white">
          <h3 className="font-semibold text-lime-900 mb-2">{product.name || 'Product'}</h3>
          {product.description && <p className="text-gray-600 text-sm mb-2 text-left">{product.description}</p>}
          <Image src={product.imageUrl || "/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"} alt="Product" width={96} height={96} className="w-24 h-24 object-contain mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-lime-900">{product.price ? `$${product.price}` : ''}</span>
            {product.affiliateLink && (
              <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="ml-2 px-3 py-1 bg-lime-700 text-white rounded hover:bg-lime-800 text-xs">Buy</a>
            )}
          </div>
        </div>
      ));
    } else {
      productCards = [<div key="coming-soon" className="text-gray-500">(Product list coming soon)</div>];
    }
  } catch (error) {
    console.error('Error processing herb products:', error);
    productCards = [<div key="error" className="text-gray-500">(Products temporarily unavailable)</div>];
  }

  // Indications (symptoms) with error handling
  let indicationLinks: JSX.Element[] = [];
  try {
    if (Array.isArray(indications) && indications.length > 0) {
      indicationLinks = indications
        .filter((indication: any): indication is string => typeof indication === 'string')
        .map((indication: string, idx: number) => (
          <Link
            key={idx}
            href={`/symptoms/${indication}`}
            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 transition"
          >
            {indication}
          </Link>
        ));
    }
  } catch (error) {
    console.error('Error processing herb indications:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex-shrink-0">
            <Image
              src={herb.heroImageUrl || '/images/placeholder.png'}
              alt={herb.name || 'Herb image'}
              width={200}
              height={200}
              className="rounded-full object-cover shadow-lg border-4 border-white"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-purple-900 mb-2">{herb.name}</h1>
            {herb.latinName && (
              <p className="text-xl text-gray-600 italic mb-4">{herb.latinName}</p>
            )}
            <div className="text-lg text-gray-600 max-w-3xl space-y-4">
              {herb.description && herb.description.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Images - Database-driven with error handling */}
        {herb.galleryImages && (() => {
          try {
            // Handle JSON data from database
            let imageUrls: string[] = [];
            
            if (typeof herb.galleryImages === 'string') {
              // Try to parse JSON string
              try {
                const parsed = JSON.parse(herb.galleryImages);
                if (Array.isArray(parsed)) {
                  imageUrls = parsed;
                } else if (typeof parsed === 'string') {
                  imageUrls = parsed.split(',').map((url: string) => url.trim()).filter((url: string) => url);
                }
              } catch {
                // If JSON parsing fails, treat as comma-separated string
                imageUrls = herb.galleryImages.split(',').map((url: string) => url.trim()).filter((url: string) => url);
              }
            } else if (Array.isArray(herb.galleryImages)) {
              // Already an array
              imageUrls = herb.galleryImages;
            } else if (typeof herb.galleryImages === 'object' && herb.galleryImages !== null) {
              // JSON object - try to extract URLs
              const obj = herb.galleryImages as any;
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
                        alt={`${herb.name} herb image ${index + 1}`} 
                        width={400} 
                        height={300} 
                        className="rounded-lg shadow-md w-auto h-auto object-contain max-w-md max-h-80"
                        priority
                      />
                    ))}
                  </div>
                </div>
              );
            }
          } catch (error) {
            console.error('Error processing herb gallery images:', error);
          }
          return null;
        })()}

        {indicationLinks.length > 0 && (
          <div className="my-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Common Uses</h3>
            <div className="flex flex-wrap gap-2">
              {indicationLinks}
            </div>
          </div>
        )}

        {/* Traditional Uses Section with error handling */}
        {herb.traditionalUses && Array.isArray(herb.traditionalUses) && herb.traditionalUses.length > 0 && (
          <div className="bg-gradient-to-r from-lime-50 to-blue-50 rounded-lg p-4 my-4">
            <h3 className="font-semibold text-lime-800 mb-2">Traditional Wisdom</h3>
            <ul className="space-y-1">
              {herb.traditionalUses
                .filter((use: any): use is string => typeof use === 'string')
                .map((use: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lime-500 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{use}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Safety Section */}
        {herb.cautions && (
          <div className="bg-white rounded-lg p-6 shadow-lg my-4">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4"> Safety & Usage Guidelines</h2>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2"> Specific Considerations</h3>
                <p className="text-orange-700 text-sm">{herb.cautions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
          <h2 className="text-2xl font-semibold text-lime-800 mb-6">Top Products</h2>
          <div className="space-y-4">{productCards}</div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Disclaimer:</strong> These statements have not been evaluated by the FDA.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Always consult with a healthcare professional before starting any new herbal regimen,
            especially if you are pregnant, nursing, or taking medications.
          </p>
        </div>
      </div>
    </div>
  );
}
