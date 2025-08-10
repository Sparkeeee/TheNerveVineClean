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
    const citations: Citation[] = [];
    
    // Pattern 1: [citation-text](#citation-id)
    const citationRegex1 = /\[([^\]]+)\]\(#citation-([^)]+)\)/g;
    let match;
    while ((match = citationRegex1.exec(text)) !== null) {
      citations.push({
        id: match[2],
        text: match[1],
        fullReference: match[1]
      });
    }
    
    // Pattern 2: (Author & Author, Year) or (Author et al., Year)
    const citationRegex2 = /\(([^)]+)\)/g;
    while ((match = citationRegex2.exec(text)) !== null) {
      const citationText = match[1];
      // Check if it looks like a citation (contains year and author patterns)
      if (citationText.match(/\d{4}/) && citationText.match(/[A-Z][a-z]+/)) {
        citations.push({
          id: citationText.replace(/\s+/g, '-').toLowerCase(),
          text: citationText,
          fullReference: citationText
        });
      }
    }

    return citations;
  };

  // Extract actual references from the article content
  const extractReferencesFromContent = (content: string): Map<string, string> => {
    const references = new Map<string, string>();
    
    // Look for "References" heading in various formats
    const referencesPatterns = [
      /<strong>References<\/strong><\/p>/i,
      /<em><strong>References<\/strong><\/em>/i,
      /<h\d[^>]*>References<\/h\d>/i,
      /<p[^>]*><strong>References<\/strong><\/p>/i,
      /<p[^>]*><em><strong>References<\/strong><\/em><\/p>/i,
      /References\s*$/m,
      /## References/i,
      /# References/i,
      /References:/i,
      /<p[^>]*>References<\/p>/i
    ];
    
    let referencesMatch = null;
    for (const pattern of referencesPatterns) {
      referencesMatch = content.match(pattern);
      if (referencesMatch) break;
    }
    
    if (referencesMatch) {
      console.log('References pattern matched:', referencesMatch[0]);
      // Get everything after "References"
      const afterReferences = content.substring(referencesMatch.index! + referencesMatch[0].length);
      
      // Convert </a> tags to newlines before removing other HTML tags
      let cleanText = afterReferences.replace(/<\/a>/g, '</a>\n');
      // Remove remaining HTML tags
      cleanText = cleanText.replace(/<[^>]*>/g, '');
      
      console.log('Text after References (first 500 chars):', cleanText.substring(0, 500));
      
      // Debug: Log the raw text after References
      if (process.env.NODE_ENV === 'development') {
        console.log('Raw text after References (first 1000 chars):', cleanText.substring(0, 1000));
      }
      
                    // Process line by line to find individual references
       const lines = cleanText.split(/\n/);
       const referenceBlocks = [];
       let currentBlock = '';
       
       for (let i = 0; i < lines.length; i++) {
         const line = lines[i].trim();
         
         // Check if this line starts a new reference (contains author pattern and year)
         if ((line.match(/[A-Z][a-z]+,\s*[A-Z]/) || line.match(/[A-Z][a-z]+\s+[A-Z]/) || line.match(/[A-Z][a-z]+,\s*[A-Z]\.\s*&/)) && line.match(/\d{4}/)) {
           // If we have a previous block, save it
           if (currentBlock.trim().length > 30) {
             referenceBlocks.push(currentBlock.trim());
           }
           // Start new block
           currentBlock = line;
         } else if (line.length > 0) {
           // Continue the current block
           currentBlock += (currentBlock ? ' ' : '') + line;
         } else if (line.length === 0 && currentBlock.trim().length > 30) {
           // Empty line after a block - save the current block
           referenceBlocks.push(currentBlock.trim());
           currentBlock = '';
         }
       }
       
       // Don't forget the last block
       if (currentBlock.trim().length > 30) {
         referenceBlocks.push(currentBlock.trim());
       }
       
       console.log('Number of blocks found:', referenceBlocks.length);
       referenceBlocks.forEach((block, index) => {
         console.log(`Block ${index + 1} (${block.length} chars):`, block.substring(0, 100));
       });
       
       let counter = 1;
       referenceBlocks.forEach(block => {
         const cleanBlock = block.trim();
         
         // Skip empty blocks and non-reference content
         if (cleanBlock.length > 30 && 
             cleanBlock.match(/[A-Z][a-z]+,\s*[A-Z]/) && 
             cleanBlock.match(/\d{4}/)) {
           
           // Clean up the reference text
           const cleanReference = cleanBlock
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'")
             .replace(/\s+/g, ' ')
             .trim();
           
           references.set(counter.toString(), cleanReference);
           counter++;
         }
       });
      
      console.log('Final references extracted:', references.size);
      references.forEach((ref, key) => {
        console.log(`Reference ${key}:`, ref.substring(0, 100));
      });
    }
    
    return references;
  };

  // Generate a reference based on the citation text and actual references from content
  const generateReference = (citationText: string): string => {
    // First, try to extract references from the content
    const references = extractReferencesFromContent(content);
    
    // Debug: Log what we're trying to match
    if (process.env.NODE_ENV === 'development') {
      console.log('Trying to match citation:', citationText);
      console.log('Available references count:', references.size);
    }
    
    // Clean up the citation text (remove brackets if present)
    let cleanCitation = citationText;
    if (citationText.startsWith('[') && citationText.endsWith(']')) {
      cleanCitation = citationText.slice(1, -1);
    }
    
    // Extract year from citation
    const yearMatch = cleanCitation.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : null;
    
    // Extract author names from citation (everything before the year)
    let authors = '';
    if (year) {
      authors = cleanCitation.substring(0, cleanCitation.indexOf(year)).trim();
      // Remove trailing punctuation
      authors = authors.replace(/[,\s]+$/, '');
    } else {
      // If no year, try to extract authors differently
      authors = cleanCitation.replace(/[,\s]+$/, '');
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Extracted year:', year);
      console.log('Extracted authors:', authors);
    }
    
    // Try to find the BEST matching reference by year and author
    let bestMatch: string | null = null;
    let bestScore = 0;
    
    for (const [refNumber, refText] of references.entries()) {
      let score = 0;
      
      // Check if reference contains the year
      if (year && refText.includes(year)) {
        score += 10;
        
        // Check if reference contains the authors (case insensitive)
        const authorWords = authors.toLowerCase()
          .replace(/et\s+al\.?/g, '') // Remove "et al." for matching
          .split(/\s+/)
          .filter(word => word.length > 1 && word !== 'et' && word !== 'al');
        const refTextLower = refText.toLowerCase();
        
        let matchingAuthorWords: string[] = [];
        
        // For "et al." citations, focus on first author's last name
        if (authors.toLowerCase().includes('et al')) {
          const firstAuthor = authors.split(/[\s,]/)[0].toLowerCase().trim();
          // Try different variations of the author name
          const authorVariations = [
            firstAuthor,
            firstAuthor.charAt(0).toUpperCase() + firstAuthor.slice(1), // Capitalized
            firstAuthor + ',', // With comma
            firstAuthor + ' ', // With space
          ];
          
          let authorFound = false;
          for (const variation of authorVariations) {
            if (refTextLower.includes(variation.toLowerCase())) {
              authorFound = true;
              break;
            }
          }
          
          if (authorFound && firstAuthor.length > 1) {
            score += 50; // Much higher score for first author match in et al. citations
            matchingAuthorWords = [firstAuthor]; // For logging purposes
          } else if (firstAuthor.length > 1) {
            score += 10; // Still give some points for year match even if author doesn't match perfectly
          }
        } else {
          // For non-et al. citations, be more flexible with author matching
          matchingAuthorWords = authorWords.filter(word => {
            // Try multiple variations of each word
            const wordVariations = [
              word,
              word + ',',
              word + '.',
              word.charAt(0).toUpperCase() + word.slice(1)
            ];
            return wordVariations.some(variation => refTextLower.includes(variation.toLowerCase()));
          });
          
          if (matchingAuthorWords.length > 0) {
            score += matchingAuthorWords.length * 20; // Higher weight for author matches
          } else {
            score += 5; // Small score for year match even without author match
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Ref ${refNumber} score: ${score} (${matchingAuthorWords.length}/${authorWords.length} author words)`);
        }
        
        // If this is a better match, update best match
        if (score > bestScore) {
          bestScore = score;
          bestMatch = refText;
        }
      }
    }
    
    // Return the best match if found and score is high enough
    if (bestMatch && bestScore >= 10) { // Require minimum score of 10 for a valid match
      if (process.env.NODE_ENV === 'development') {
        console.log('Best match found with score:', bestScore);
      }
      return bestMatch;
    }
    
    // If no good match found, don't fall back to year-only matching
    if (process.env.NODE_ENV === 'development') {
      console.log('No adequate match found. Best score was:', bestScore);
    }
    
    // If still no match, return a fallback message
    return `${citationText} - Reference not found in document.`;
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
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800 text-justify">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800 text-justify">$1. $2</li>')
      // Wrap lists in ul/ol
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4 pl-8">$1</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-800 leading-relaxed text-justify pl-12">')
      // Wrap in paragraph tags
      .replace(/^(?!<[h|u|o|d]|<p>)(.*)$/gm, '<p class="mb-4 text-gray-800 leading-relaxed text-justify pl-12">$1</p>')
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
             className="inline-flex items-center mx-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
           >
             [{citationText}]
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

  // Extract body content from HTML documents and apply formatting
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
        cleanedContent = bodyMatch[1].trim();
      }
    }
    
    // COMPLETE STACKEDIT OVERRIDE: Strip all external stylesheets and rebuild content
    // Based on StackOverflow findings, StackEdit's external CSS is blocking our styles
    
    // Remove ALL external stylesheet links (this is the key issue)
    cleanedContent = cleanedContent.replace(/<link[^>]*>/gi, '');
    
    // Remove ALL script tags that might interfere
    cleanedContent = cleanedContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Remove ALL StackEdit-specific classes and styles
    cleanedContent = cleanedContent
      .replace(/class="[^"]*"/gi, '')
      .replace(/class='[^']*'/gi, '')
      .replace(/style="[^"]*"/gi, '')
      .replace(/style='[^']*'/gi, '');
    
    // Extract only the actual content (remove container divs)
    if (cleanedContent.includes('<div class="container">')) {
      const containerMatch = cleanedContent.match(/<div class="container">([\s\S]*?)<\/div>/i);
      if (containerMatch) {
        cleanedContent = containerMatch[1].trim();
      }
    }
    
    // CONVERT CITATIONS IN HTML CONTENT TO INTERACTIVE BUTTONS
    // Replace citation patterns with interactive button HTML
    cleanedContent = cleanedContent.replace(
      /\[([^\]]+)\]\(#citation-([^)]+)\)/g,
      '<button class="inline-flex items-center mx-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors citation-button" data-citation-id="$2" data-citation-text="$1">[$1]</button>'
    );
    
    // Convert "Author et al. (Year)" format citations - handle multiple authors
    cleanedContent = cleanedContent.replace(
      /\b([A-Z][a-z]+(?:\s*&\s*[A-Z][a-z]+)*(?:\s+et\s+al\.?)?)\s+\((\d{4}[a-z]?)\)/g,
      (match, authors, year) => {
        const citationText = `${authors}, ${year}`;
        const citationId = citationText.replace(/\s+/g, '-').toLowerCase();
        return `<button class="inline-flex items-center mx-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors citation-button" data-citation-id="${citationId}" data-citation-text="${citationText}">${authors} (${year})</button>`;
      }
    );
    
    // Also convert parenthetical citations like (K & L, 2008)
    cleanedContent = cleanedContent.replace(
      /\(([^)]+)\)/g,
      (match, citationText) => {
        // Check if it looks like a citation (contains year and author patterns)
        if (citationText.match(/\d{4}/) && citationText.match(/[A-Z][a-z]+/)) {
          const citationId = citationText.replace(/\s+/g, '-').toLowerCase();
          return `<button class="inline-flex items-center mx-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors citation-button" data-citation-id="${citationId}" data-citation-text="${citationText}">(${citationText})</button>`;
        }
        return match; // Keep original if not a citation
      }
    );
    
         // Apply consistent, generic styling for any document format
     const formattedContent = cleanedContent
        // Clean up existing classes EXCEPT citation buttons
        .replace(/class="(?!.*citation-button)[^"]*"/gi, '')
        .replace(/style="[^"]*"/gi, '')
        // Add consistent paragraph styling
        .replace(/<p([^>]*)>/gi, '<p$1 class="mb-4 leading-relaxed text-gray-800 text-base">')
        // Add consistent list styling
        .replace(/<li([^>]*)>/gi, '<li$1 class="ml-4 mb-1 text-gray-800">')
        // Add consistent div styling
        .replace(/<div([^>]*)>/gi, '<div$1 class="text-gray-800">')
        // Add consistent heading styles
        .replace(/<h1([^>]*)>/gi, '<h1$1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">')
        .replace(/<h2([^>]*)>/gi, '<h2$1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">')
        .replace(/<h3([^>]*)>/gi, '<h3$1 class="text-xl font-bold text-gray-900 mt-6 mb-3">')
        // Keep tables consistently styled
        .replace(/<table([^>]*)>/gi, '<table$1 class="w-full border-collapse mt-6 mb-6">')
        .replace(/<td([^>]*)>/gi, '<td$1 class="border border-gray-300 px-3 py-2 text-left">')
        .replace(/<th([^>]*)>/gi, '<th$1 class="border border-gray-300 px-3 py-2 text-left bg-gray-50 font-semibold">')
       // FIX THE BR TAG ISSUE - replace <br> tags with spaces to prevent word-per-line
       .replace(/<br\s*\/?>\s*/gi, ' ')
       // Also remove any remaining line breaks and normalize whitespace
       .replace(/\r?\n/g, ' ')
       // Remove any HTML entities that might cause spacing issues
       .replace(/&nbsp;/g, ' ')
       .replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       // Clean up multiple spaces
       .replace(/\s+/g, ' ')
       .trim()
       // Clean up any existing malformed DOI links first (defensive)
       .replace(/<a[^>]*href="(https:\/\/doi\.org\/[^"]*)"[^>]*>.*?<\/a>/gi, '$1')
       .replace(/href="(https:\/\/doi\.org\/[^"]*)"[^>]*>/gi, '$1')
       // Now safely convert clean DOI URLs to proper links
       .replace(/(?<!href="|>)\b(https:\/\/doi\.org\/10\.\d+\/[^\s<>]+?)(?=[\s<>]|$)/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all">$1</a>')
       // Remove only specific StackEdit attribution text
       .replace(/\britten with <a[^>]*>StackEdit<\/a>\./gi, '')
       .replace(/\bWritten with StackEdit\./gi, '');
    
    return formattedContent;
  };

  // Check if content is HTML (not just starts with DOCTYPE)
  const isHtmlContent = (content: string): boolean => {
    return content.includes('<html') || 
           content.includes('<body') || 
           content.includes('<div') || 
           content.includes('<p>') ||
           content.startsWith('<!DOCTYPE html>');
  };

  // Debug: Log content type and citation detection (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Content type:', isHtmlContent(content) ? 'HTML' : 'Markdown');
    console.log('Content length:', content.length);
    console.log('Citations found:', extractCitations(content).length);
    
               // Debug references extraction
      const references = extractReferencesFromContent(content);
      console.log('References found:', references.size);
      if (references.size > 0) {
        console.log('Sample references:', Array.from(references.entries()).slice(0, 3));
        // Debug the first reference specifically
        const firstRef = Array.from(references.values())[0];
        console.log('First reference (full):', firstRef);
        console.log('First reference length:', firstRef.length);
        console.log('First reference ends with:', firstRef.substring(firstRef.length - 50));
      } else {
        console.log('NO REFERENCES EXTRACTED!');
        // Debug the extraction process
        const refMatch = content.match(/<strong>References<\/strong><\/p>/);
        console.log('References match found:', refMatch ? 'YES' : 'NO');
        if (refMatch) {
          const afterRef = content.substring(refMatch.index! + refMatch[0].length);
          console.log('Content after References (first 500 chars):', afterRef.substring(0, 500));
        }
      }
    
    // Debug content structure
    console.log('Content sample (first 500 chars):', content.substring(0, 500));
    console.log('Content sample (last 500 chars):', content.substring(content.length - 500));
    
    // Debug: Look for "References" heading specifically
    const referencesIndex = content.indexOf('References');
    console.log('References found at index:', referencesIndex);
    if (referencesIndex !== -1) {
      console.log('Context around References:', content.substring(referencesIndex - 50, referencesIndex + 100));
    }
    
    // Debug: Check for different reference heading formats
    const refPatterns = [
      /References\s*\n/,
      /^References$/m,
      /## References/,
      /# References/,
      /References:/,
      /References\s*$/m
    ];
    
    refPatterns.forEach((pattern, index) => {
      const match = content.match(pattern);
      console.log(`Pattern ${index} (${pattern}):`, match ? 'MATCHED' : 'no match');
    });
  }
  
    // Handle citation clicks using document event listener
  React.useEffect(() => {
    const handleCitationClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('citation-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        // Visual feedback (subtle)
        target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        setTimeout(() => {
          target.style.backgroundColor = '';
        }, 300);
        
        const citationId = target.getAttribute('data-citation-id');
        const citationText = target.getAttribute('data-citation-text');
        
        if (citationId && citationText) {
          // Remove existing dropdowns first
          document.querySelectorAll('.citation-dropdown').forEach(d => d.remove());
          
          // Generate the correct reference for this specific citation
          const correctReference = generateReference(citationText);
          
          // Convert DOIs to clickable links in the reference text
          const referenceWithLinks = correctReference.replace(
            /(https:\/\/doi\.org\/10\.\d+\/[^\s<>]+?)(?=[\s<>]|$)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
          );
          
          // Show dropdown with ONLY this reference
          const dropdown = document.createElement('div');
          dropdown.className = 'citation-dropdown fixed z-[9999] mt-2 w-[32rem] bg-white border border-gray-200 rounded-lg shadow-lg p-4';
          dropdown.innerHTML = `
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs text-gray-600 font-medium">Reference</span>
              <button class="text-gray-400 hover:text-gray-600 close-dropdown">×</button>
            </div>
            <div class="text-sm text-gray-800 leading-relaxed max-h-96 overflow-y-auto whitespace-normal">
              ${referenceWithLinks}
            </div>
          `;
        
          // Position dropdown with comprehensive overflow detection
          const rect = target.getBoundingClientRect();
          const dropdownWidth = 512; // 32rem = 512px
          const dropdownHeight = 300; // Estimated height (will auto-adjust with max-height)
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const margin = 20; // Margin from viewport edges
          
          // Calculate horizontal position
          let leftPos = rect.left;
          let rightPos = 'auto';
          
          // Check right overflow
          if (rect.left + dropdownWidth > viewportWidth - margin) {
            // Try positioning from the right edge of the button
            if (rect.right - dropdownWidth >= margin) {
              leftPos = rect.right - dropdownWidth;
            } else {
              // Not enough space on either side, position from right viewport edge
              leftPos = viewportWidth - dropdownWidth - margin;
              rightPos = `${margin}px`;
            }
          }
          
          // Check left overflow
          if (leftPos < margin) {
            leftPos = margin;
          }
          
          // Calculate vertical position
          let topPos = rect.bottom + 5;
          let maxHeight = '24rem'; // Default max-height
          
          // Check bottom overflow
          if (rect.bottom + dropdownHeight > viewportHeight - margin) {
            // Try positioning above the button
            if (rect.top - dropdownHeight >= margin) {
              topPos = rect.top - dropdownHeight - 5;
            } else {
              // Not enough space above or below, position at top and limit height
              topPos = margin;
              maxHeight = `${viewportHeight - margin * 2}px`;
            }
          }
          
          // Apply positioning
          dropdown.style.left = rightPos === 'auto' ? `${leftPos}px` : 'auto';
          dropdown.style.right = rightPos === 'auto' ? 'auto' : rightPos;
          dropdown.style.top = `${topPos}px`;
          dropdown.style.maxHeight = maxHeight;
          
          // Add close functionality
          dropdown.querySelector('.close-dropdown')?.addEventListener('click', (closeEvent) => {
            closeEvent.preventDefault();
            closeEvent.stopPropagation();
            dropdown.remove();
          });
          
          // Close on outside click
          const handleOutsideClick = (outsideEvent: Event) => {
            if (!dropdown.contains(outsideEvent.target as Node)) {
              dropdown.remove();
              document.removeEventListener('click', handleOutsideClick);
            }
          };
          
          // Add small delay to prevent immediate outside click
          setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
          }, 100);
          
          document.body.appendChild(dropdown);
        }
      }
    };

    // Add event listener to document
    document.addEventListener('click', handleCitationClick, true); // Use capture phase
    
    // Cleanup on component unmount
    return () => {
      document.removeEventListener('click', handleCitationClick, true);
      // Remove any remaining dropdowns
      document.querySelectorAll('.citation-dropdown').forEach(d => d.remove());
    };
  }, [generateReference]); // Simplified dependencies

  // Additional cleanup effect to handle navigation
  React.useEffect(() => {
    // Cleanup function to remove all citation dropdowns
    const cleanupDropdowns = () => {
      document.querySelectorAll('.citation-dropdown').forEach(d => d.remove());
    };
    
    // Handle navigation events (Next.js router events)
    const handleRouteChange = () => {
      cleanupDropdowns();
    };
    
    // Listen for Next.js route changes
    if (typeof window !== 'undefined') {
      // Clean up on page unload
      window.addEventListener('beforeunload', cleanupDropdowns);
      
      // Clean up on popstate (back/forward navigation)
      window.addEventListener('popstate', cleanupDropdowns);
      
      // Clean up on hashchange
      window.addEventListener('hashchange', cleanupDropdowns);
    }
    
    // Clean up dropdowns when component unmounts or when expandedCitations changes
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', cleanupDropdowns);
        window.removeEventListener('popstate', cleanupDropdowns);
        window.removeEventListener('hashchange', cleanupDropdowns);
      }
      cleanupDropdowns();
    };
  }, [expandedCitations]);
  
  return (
    <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed">
      <style jsx global>{`
        /* Clean styling without debugging */
        
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
        
        /* Ensure table cells are NEVER justified */
        table td, table th, td, th {
          text-align: left !important;
          text-align-last: left !important;
        }
        th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
        }
        
        /* Basic prose styles */
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
        
                 /* Basic text alignment - keeping it simple for now */
         p {
           text-align: left;
         }
         
         /* Justification fix using :after pseudo-element trick */
         .justify-text {
           text-align: justify !important;
         }
         .justify-text:after {
           content: "";
           display: inline-block;
           width: 100%;
         }
         
         /* Keep tables left-aligned */
         table, th, td {
           text-align: left !important;
         }
         
         /* Target only the content area to prevent page-wide issues */
         .prose p, .prose div, .prose span {
           word-break: normal !important;
           word-wrap: normal !important;
           overflow-wrap: normal !important;
           white-space: normal !important;
           max-width: none !important;
           width: auto !important;
         }
         
         /* Ensure proper text flow */
         .prose {
           max-width: none !important;
           width: 100% !important;
         }
      `}</style>
      
             <span>
                  {isHtmlContent(content) ? (
                        // Handle HTML content directly - extract body content
             <div 
               className="overflow-x-auto"
               style={{ 
                 width: '100%', 
                 maxWidth: 'none', 
                 wordBreak: 'normal', 
                 wordWrap: 'normal'
               }}
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