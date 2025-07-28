import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCachedSupplement } from '@/lib/database';

export default async function SupplementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplement = await getCachedSupplement(slug);

  if (!supplement) {
    notFound();
  }

  // Generate 4 readable paragraphs for the description
  let paragraphs: JSX.Element[] = [];
  if (supplement.description) {
    const paraArr = supplement.description.split(/\n\n/).filter(Boolean);
    if (paraArr.length >= 4) {
      paragraphs = paraArr.slice(0, 4).map((p: string, i: number) => <p key={i} className="mb-4 text-lg text-lime-700 text-left">{p.trim()}</p>);
    } else {
      while (paraArr.length < 4) paraArr.push(paraArr[0] || 'This supplement supports overall wellness.');
      paragraphs = paraArr.slice(0, 4).map((p: string, i: number) => <p key={i} className="mb-4 text-lg text-lime-700 text-left">{p.trim()}</p>);
    }
  }

  // Prepare product cards from DB
  let productCards: JSX.Element[] = [];
  if (Array.isArray(supplement.products) && supplement.products.length > 0) {
    productCards = supplement.products.map((product: any, idx: number) => (
      <div key={idx} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4 bg-white">
        <h3 className="font-semibold text-lime-900 mb-2">{product.name || 'Product'}</h3>
        {product.description && <p className="text-gray-600 text-sm mb-2 text-left">{product.description}</p>}
        <Image src={product.imageUrl || "/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"} alt="Product" width={96} height={96} className="w-24 h-24 object-contain mb-2" />
        {/* Removed tags display as Product does not have tags property */}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-900 mb-2">{supplement.name}</h1>
          
          {/* Multiple Molecular Structure Images - Database-driven */}
          {supplement.galleryImages && (() => {
            // Handle both JSON array and comma-separated string
            let imageUrls: string[] = [];
            if (Array.isArray(supplement.galleryImages)) {
              imageUrls = supplement.galleryImages;
            } else if (typeof supplement.galleryImages === 'string' && supplement.galleryImages.trim()) {
              imageUrls = supplement.galleryImages.split(',').map((url: string) => url.trim()).filter((url: string) => url);
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
            return null;
          })()}
          
          {/* Single Molecular Structure Image - Fallback */}
          {supplement.heroImageUrl && (!supplement.galleryImages || (() => {
            // Check if galleryImages is empty
            if (Array.isArray(supplement.galleryImages)) {
              return supplement.galleryImages.length === 0;
            } else if (typeof supplement.galleryImages === 'string') {
              return !supplement.galleryImages.trim();
            }
            return true; // If galleryImages is null/undefined, show heroImageUrl
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
          
          {paragraphs}
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