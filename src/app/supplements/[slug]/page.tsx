import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

function formatParagraphs(text: string) {
  // Split by double newlines or periods for basic paragraphing
  return text
    .split(/\n\n|(?<=\.) /)
    .filter(Boolean)
    .map((p, i) => <p key={i} className="mb-4 text-lg text-green-700">{p.trim()}</p>);
}

async function getSupplement(slug: string) {
  const prisma = new PrismaClient();
  try {
    const supplement = await prisma.supplement.findFirst({ where: { slug } });
    return supplement;
  } catch (error) {
    console.error('Error fetching supplement:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function SupplementPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const supplement = await getSupplement(slug);

  if (!supplement) {
    notFound();
  }

  // Generate 4 readable paragraphs for the description
  let paragraphs: JSX.Element[] = [];
  if (supplement.description) {
    const paraArr = supplement.description.split(/\n\n/).filter(Boolean);
    if (paraArr.length >= 4) {
      paragraphs = paraArr.slice(0, 4).map((p, i) => <p key={i} className="mb-4 text-lg text-green-700 text-left">{p.trim()}</p>);
    } else {
      // If not enough, repeat or generate more
      while (paraArr.length < 4) paraArr.push(paraArr[0] || 'This supplement supports overall wellness.');
      paragraphs = paraArr.slice(0, 4).map((p, i) => <p key={i} className="mb-4 text-lg text-green-700 text-left">{p.trim()}</p>);
    }
  }

  // Prepare product cards from productFormulations (mock)
  let productCards: JSX.Element[] = [];
  if (Array.isArray(supplement.productFormulations) && supplement.productFormulations.length > 0) {
    productCards = supplement.productFormulations.map((product: any, idx: number) => (
      <div key={idx} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4 bg-white">
        <h3 className="font-semibold text-green-900 mb-2">{product.name || product.type || 'Product'}</h3>
        {product.description && <p className="text-gray-600 text-sm mb-2 text-left">{product.description}</p>}
        <img src="/images/closed-medical-brown-glass-bottle-yellow-vitamins.png" alt="Product" className="w-24 h-24 object-contain mb-2" />
        {product.price && <div className="text-green-600 font-bold mb-2">{product.price}</div>}
        {product.tags && Array.isArray(product.tags) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {product.tags.map((tag: string, i: number) => (
              <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{tag}</span>
            ))}
          </div>
        )}
        {product.affiliateLink && (
          <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium mt-2">Check Price →</a>
        )}
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
          <h1 className="text-4xl font-bold text-green-900 mb-2">{supplement.name}</h1>
          {paragraphs}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Supplement Details</h2>
              <ul className="space-y-3">
                {supplement.cautions && (
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{supplement.cautions}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">Top Products</h2>
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