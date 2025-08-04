import React from 'react';
import Link from 'next/link';
import { getCachedHerb } from '@/lib/database';
import fs from 'fs';
import path from 'path';
import ResearchPageWrapper from '@/components/ResearchPageWrapper';
import ContentProtection from '@/components/ContentProtection';
import InteractiveCitations from '@/components/InteractiveCitations';
import SaveArticleButton from '@/components/SaveArticleButton';

// Function to read Markdown file
async function getMarkdownArticle(slug: string): Promise<string | null> {
  try {
    const articlePath = path.join(process.cwd(), 'public', 'articles', `${slug}-article.md`);
    const content = await fs.promises.readFile(articlePath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}



export default async function HerbResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch herb data from database
  const herb = await getCachedHerb(slug);
  
  // Use comprehensiveArticle from database if available, otherwise fallback to file
  let markdownArticle = herb?.comprehensiveArticle || null;
  if (!markdownArticle) {
    markdownArticle = await getMarkdownArticle(slug);
  }

  if (!herb) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Herb Not Found</h1>
          <p className="text-gray-600 mb-4">The herb could not be found.</p>
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

  return (
    <ResearchPageWrapper>
      <ContentProtection 
        pageType="research" 
        shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/herbs/${slug}/research`}
        shareTitle={`Scientific Research: ${herb.name}`}
      >
        <div className="min-h-screen bg-[url('/images/WMherbsBG.PNG')] bg-cover bg-center bg-fixed bg-no-repeat">
          {/* Sticky Back Button */}
          <div className="fixed top-4 right-4 z-50">
            <Link 
              href={`/herbs/${slug}`}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base sm:px-4"
            >
              ← Back to Overview
            </Link>
          </div>

          <div className="w-3/4 mx-auto px-4 pt-20 pb-8 min-h-screen">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-6">
                {herb.latinName && (
                  <p className="text-base sm:text-lg text-gray-700 italic">
                    {herb.latinName}
                  </p>
                )}
              </div>
              
              {/* Save to Research Library Button */}
              <div className="mb-6 flex justify-center">
                <SaveArticleButton 
                  slug={slug} 
                  title={`Research: ${herb.name}`}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Comprehensive Article */}
            {markdownArticle && (
              <div className="mb-8 bg-white/95 rounded-lg shadow-lg p-8 overflow-x-auto w-full mx-4">
                <InteractiveCitations content={markdownArticle} />
              </div>
            )}

            {/* References */}
            {herb.references && Array.isArray(herb.references) && herb.references.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">References</h2>
                <div className="space-y-4">
                  {herb.references.map((reference: any, index: number) => (
                    <div key={index} className="text-sm text-gray-800 leading-relaxed p-4 bg-gray-50 rounded">
                      {reference.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 text-center">
              <Link 
                href={`/herbs/${slug}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to {herb.name} Overview
              </Link>
            </div>
          </div>
        </div>
      </ContentProtection>
    </ResearchPageWrapper>
  );
} 