import React from 'react';
import Link from 'next/link';
import { getCachedSupplement } from '@/lib/database';
import fs from 'fs';
import path from 'path';
import ResearchPageWrapper from '@/components/ResearchPageWrapper';
import ContentProtection from '@/components/ContentProtection';

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

// Simple Markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800">$1. $2</li>')
    // Wrap lists in ul/ol
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4">$1</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-800 leading-relaxed">')
    // Wrap in paragraph tags
    .replace(/^(?!<[h|u|o]|<p>)(.*)$/gm, '<p class="mb-4 text-gray-800 leading-relaxed">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '')
    .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '');
}

export default async function SupplementResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch supplement data from database
  const supplement = await getCachedSupplement(slug);
  
  // Use comprehensiveArticle from database if available, otherwise fallback to file
  let markdownArticle = supplement?.comprehensiveArticle || null;
  if (!markdownArticle) {
    markdownArticle = await getMarkdownArticle(slug);
  }

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Supplement Not Found</h1>
          <p className="text-gray-600 mb-4">The supplement could not be found.</p>
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

  return (
    <ResearchPageWrapper>
      <ContentProtection 
        pageType="research" 
        shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/supplements/${slug}/research`}
        shareTitle={`Scientific Research: ${supplement.name}`}
      >
        <div className="min-h-screen bg-[url('/images/WMherbsBG.PNG')] bg-cover bg-center bg-fixed bg-no-repeat">

          {/* Sticky Back Button */}
          <div className="fixed top-4 right-4 z-50">
            <Link 
              href={`/supplements/${slug}`}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base sm:px-4"
            >
              ← Back to Overview
            </Link>
          </div>

          <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {supplement.name}
                </h1>
              </div>
            </div>

            {/* Comprehensive Article */}
            {markdownArticle && (
              <div className="mb-8 bg-white rounded-lg shadow-lg p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdownArticle) }}
                />
              </div>
            )}

            {/* References */}
            {supplement.references && Array.isArray(supplement.references) && supplement.references.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">References</h2>
                <div className="space-y-4">
                  {supplement.references.map((reference: any, index: number) => (
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
                href={`/supplements/${slug}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to {supplement.name} Overview
              </Link>
            </div>
          </div>
        </div>
      </ContentProtection>
    </ResearchPageWrapper>
  );
} 