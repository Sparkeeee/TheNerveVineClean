'use client';

import React, { useState } from 'react';

interface Citation {
  id: string;
  text: string;
  fullReference?: string;
}

interface InteractiveCitationsProps {
  content: string;
}

export default function InteractiveCitations({ content }: InteractiveCitationsProps) {
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());

  // Extract citations from content
  const extractCitations = (text: string): Citation[] => {
    const citationRegex = /\[([^\]]+)\]\(#citation-([^)]+)\)/g;
    const citations: Citation[] = [];
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
      citations.push({
        id: match[2],
        text: match[1],
        fullReference: match[1] // For now, use the citation text as the reference
      });
    }

    return citations;
  };

  // Generate a more detailed reference based on the citation text
  const generateReference = (citationText: string): string => {
    // This is a simple implementation - in a real system, you'd have a database of references
    // For now, we'll format the citation text as a proper reference
    const parts = citationText.split(',');
    if (parts.length >= 2) {
      const authors = parts[0].trim();
      const year = parts[1].trim();
      
      // Handle "et al." format
      if (authors.includes('et al.')) {
        const firstAuthor = authors.replace('et al.', '').trim();
        return `${firstAuthor} et al. (${year}). [Full reference would be displayed here in a complete system].`;
      }
      
      // Handle multiple authors with "&"
      if (authors.includes('&')) {
        return `${authors} (${year}). [Full reference would be displayed here in a complete system].`;
      }
      
      // Single author
      return `${authors} (${year}). [Full reference would be displayed here in a complete system].`;
    }
    
    return citationText;
  };

  // Function to process tables
  const processTables = (text: string): string => {
    const lines = text.split('\n');
    const result = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this line starts a table (has | at start and end)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines = [];
        
        // Collect all table lines (including multi-line content)
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        
        // Check if we have a valid table (at least 3 lines: header, separator, data)
        if (tableLines.length >= 3) {
          const headerLine = tableLines[0];
          const separatorLine = tableLines[1];
          const dataLines = tableLines.slice(2);
          
          // Parse headers
          const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
          
          // Generate table HTML
          let tableHtml = '<div class="overflow-x-auto mb-6"><table class="min-w-full border border-gray-300 bg-white">';
          tableHtml += '<thead><tr class="bg-gray-50">';
          
          headers.forEach(header => {
            tableHtml += `<th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-900">${header}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
          
          dataLines.forEach(row => {
            const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
            if (cells.length > 0) {
              tableHtml += '<tr>';
              cells.forEach(cell => {
                // Clean up the cell content - remove extra whitespace and newlines
                const cleanCell = cell.replace(/\s+/g, ' ').trim();
                tableHtml += `<td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${cleanCell}</td>`;
              });
              tableHtml += '</tr>';
            }
          });
          
          tableHtml += '</tbody></table></div>';
          result.push(tableHtml);
        } else {
          // Not a valid table, add lines as-is
          result.push(...tableLines);
        }
      } else {
        result.push(line);
        i++;
      }
    }
    
    return result.join('\n');
  };

  // Convert Markdown to HTML for better formatting
  const convertMarkdownToHtml = (text: string): string => {
    // First, process tables
    let processedText = processTables(text);
    
    // Function to detect and reconstruct broken tables
    const reconstructBrokenTable = (text: string): string => {
      // Look for patterns that indicate broken table structure
      const brokenTablePattern = /^(\s*\([^)]+\)\s+)([^\n]+)\n(\s+)([^\n]+)\n(\s+)([^\n]+)/gm;
      
      return text.replace(brokenTablePattern, (match, citation, firstRow, indent1, secondRow, indent2, thirdRow) => {
        // Extract citation properly - only get the citation part, not the content
        const citationMatch = citation.match(/\(([^)]+)\)/);
        const citationText = citationMatch ? citationMatch[1] : citation.trim();
        
        // Combine all rows to get the full content, but exclude the citation from content
        const allContent = `${firstRow} ${secondRow} ${thirdRow}`;
        
        // Remove the citation from the content if it appears at the beginning
        const contentWithoutCitation = allContent.replace(/^\([^)]+\)\s*/, '');
        
        // Split content by significant spacing (3+ spaces)
        const contentParts = contentWithoutCitation.split(/\s{3,}/);
        
        // Clean up each part
        const cleanedParts = contentParts.map(part => part.trim()).filter(part => part.length > 0);
        
        // If we have enough parts, create a table
        if (cleanedParts.length >= 3) {
          let tableHtml = '<div class="overflow-x-auto mb-6"><table class="min-w-full border border-gray-300 bg-white">';
          tableHtml += '<thead><tr class="bg-gray-50">';
          
          // Create header row
          const headers = ['Reference', 'Efficacy', 'Tolerability', 'Interactions', 'Compounds', 'Risks'];
          headers.forEach(header => {
            tableHtml += `<th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-900">${header}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
          
          // Create data row
          tableHtml += '<tr>';
          
          // Add citation as first column
          tableHtml += `<td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">(${citationText})</td>`;
          
          // Add the remaining content parts
          cleanedParts.forEach((part, index) => {
            if (index < 5) { // Limit to 5 additional columns
              tableHtml += `<td class="border border-gray-300 px-4 py-2 text-sm text-gray-800">${part}</td>`;
            }
          });
          
          // Fill remaining columns if needed
          const remainingColumns = 5 - cleanedParts.length;
          for (let i = 0; i < remainingColumns; i++) {
            tableHtml += '<td class="border border-gray-300 px-4 py-2 text-sm text-gray-800"></td>';
          }
          
          tableHtml += '</tr></tbody></table></div>';
          return tableHtml;
        }
        
        // If we can't create a proper table, return as formatted text
        return `<div class="bg-gray-50 p-4 rounded-lg mb-4"><p class="text-sm text-gray-700 mb-2"><strong>Research Summary:</strong></p><p class="text-sm text-gray-800">${citation.trim()} ${firstRow.trim()}</p><p class="text-sm text-gray-800">${secondRow.trim()}</p><p class="text-sm text-gray-800">${thirdRow.trim()}</p></div>`;
      });
    };
    
    // Then reconstruct any broken tables
    processedText = reconstructBrokenTable(processedText);
    
    return processedText
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-900">$1</em>')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800">$1. $2</li>')
      // Wrap lists in ul/ol
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4">$1</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-800 leading-relaxed">')
      // Wrap in paragraph tags
      .replace(/^(?!<[h|u|o|d]|<p>)(.*)$/gm, '<p class="mb-4 text-gray-800 leading-relaxed">$1</p>')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '')
      .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '');
  };

  // Replace citations with interactive components while preserving Markdown
  const renderInteractiveContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const citationRegex = /\[([^\]]+)\]\(#citation-([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    let citationIndex = 0; // Add index to ensure unique keys

    while ((match = citationRegex.exec(text)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          // Convert Markdown in the text before citation
          const htmlBefore = convertMarkdownToHtml(textBefore);
          parts.push(
            <span 
              key={`text-${citationIndex}`} 
              dangerouslySetInnerHTML={{ __html: htmlBefore }}
            />
          );
        }
      }

      const citationId = match[2];
      const citationText = match[1];
      const uniqueKey = `${citationId}-${citationIndex}`; // Create unique key
      const isExpanded = expandedCitations.has(uniqueKey);
      const fullReference = generateReference(citationText);

      parts.push(
        <span key={uniqueKey} className="relative inline-block">
          <button
            onClick={() => {
              const newExpanded = new Set(expandedCitations);
              if (isExpanded) {
                newExpanded.delete(uniqueKey);
              } else {
                newExpanded.add(uniqueKey);
              }
              setExpandedCitations(newExpanded);
            }}
            className="inline-flex items-center px-2 py-1 mx-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {citationText}
            <svg
              className={`ml-1 w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="absolute z-10 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-600 font-medium">Reference</span>
                <button
                  onClick={() => {
                    const newExpanded = new Set(expandedCitations);
                    newExpanded.delete(uniqueKey);
                    setExpandedCitations(newExpanded);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-800 leading-relaxed">
                {fullReference}
              </div>
            </div>
          )}
        </span>
      );

      lastIndex = match.index + match[0].length;
      citationIndex++; // Increment index for next citation
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        const htmlRemaining = convertMarkdownToHtml(remainingText);
        parts.push(
          <span 
            key={`text-end-${citationIndex}`} 
            dangerouslySetInnerHTML={{ __html: htmlRemaining }}
          />
        );
      }
    }

    return parts;
  };

  // Extract body content from HTML documents
  const extractBodyContent = (htmlContent: string): string => {
    // Clean the content first
    let cleanedContent = htmlContent.trim();
    
    // Remove DOCTYPE and HTML structure
    cleanedContent = cleanedContent.replace(/<!DOCTYPE[^>]*>/i, '');
    cleanedContent = cleanedContent.replace(/<html[^>]*>([\s\S]*?)<\/html>/i, '$1');
    cleanedContent = cleanedContent.replace(/<head[^>]*>([\s\S]*?)<\/head>/i, '');
    
    // Extract body content
    if (cleanedContent.includes('<body')) {
      const bodyMatch = cleanedContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        return bodyMatch[1].trim();
      }
    }
    
    // If no body tag, return the cleaned content
    return cleanedContent.trim();
  };

  // Check if content is HTML (not just starts with DOCTYPE)
  const isHtmlContent = (content: string): boolean => {
    return content.includes('<html') || 
           content.includes('<body') || 
           content.includes('<div') || 
           content.includes('<p>') ||
           content.startsWith('<!DOCTYPE html>');
  };

  return (
    <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed">
      <style jsx global>{`
        /* Only apply table styles to actual table elements */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
          table-layout: fixed !important;
          margin: 1.5rem 0 !important;
        }
        th, td {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          text-align: left !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 200px !important;
        }
        th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
        }
        
                 /* Preserve original HTML formatting for non-table content */
         .prose p {
           margin-bottom: 1rem !important;
           line-height: 1.6 !important;
           text-align: justify !important;
         }
         .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
           margin-top: 2rem !important;
           margin-bottom: 1rem !important;
           font-weight: 600 !important;
         }
         .prose ul, .prose ol {
           margin-bottom: 1rem !important;
           padding-left: 1.5rem !important;
           list-style-type: disc !important;
         }
         .prose li {
           margin-bottom: 0.5rem !important;
           display: list-item !important;
           list-style-type: inherit !important;
         }
         .prose blockquote {
           margin: 1.5rem 0 !important;
           padding-left: 1rem !important;
           border-left: 4px solid #e5e7eb !important;
         }
         
         /* Ensure bullets are visible for all list items */
         ul {
           list-style-type: disc !important;
           padding-left: 1.5rem !important;
         }
         li {
           display: list-item !important;
           list-style-type: inherit !important;
         }
      `}</style>
             <span>
         {isHtmlContent(content) ? (
           // Handle HTML content directly - extract body content
           <div 
             className="overflow-x-auto pl-12 text-justify"
             dangerouslySetInnerHTML={{ __html: extractBodyContent(content) }} 
           />
         ) : (
           // Handle Markdown content with interactive citations
           renderInteractiveContent(content)
         )}
       </span>
    </div>
  );
} 