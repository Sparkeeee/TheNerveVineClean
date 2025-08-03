'use client';

import React from 'react';
import InteractiveCitations from './InteractiveCitations';

interface InteractiveMarkdownRendererProps {
  content: string;
}

export default function InteractiveMarkdownRenderer({ content }: InteractiveMarkdownRendererProps) {
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

  // Check if content has interactive citations
  const hasInteractiveCitations = /\[([^\]]+)\]\(#citation-([^)]+)\)/.test(content);

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
             {isHtmlContent(content) ? (
         // Handle HTML content directly - extract body content
         <div 
           className="overflow-x-auto pl-12 text-justify"
           dangerouslySetInnerHTML={{ __html: extractBodyContent(content) }} 
         />
       ) : hasInteractiveCitations ? (
         <InteractiveCitations content={content} />
       ) : (
         <div
           className="prose prose-lg max-w-none text-gray-900 leading-relaxed overflow-x-auto pl-12 text-justify"
           dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
         />
       )}
    </div>
  );
} 