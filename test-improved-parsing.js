// Test the improved reference parsing logic
function convertReferencesToJson(referencesText) {
  if (!referencesText.trim()) return [];

  // If it's already JSON, try to parse it
  if (referencesText.trim().startsWith('[')) {
    try {
      return JSON.parse(referencesText);
    } catch {
      // If JSON parsing fails, treat as complex reference string
    }
  }

  const references = [];

  // First, try to split by numbered references (1., 2., 3., etc.)
  // Use a regex that matches numbered references but doesn't include them in the split
  const numberedMatches = referencesText.match(/(?:^|\s)(\d+)\.\s+([^]*?)(?=(?:^|\s)\d+\.\s+|$)/g);
  
  if (numberedMatches && numberedMatches.length > 1) {
    // We have numbered references, process each one
    numberedMatches.forEach((match) => {
      // Extract the content after the number
      const content = match.replace(/^(?:^|\s)\d+\.\s+/, '').trim();
      if (content) {
        let type = 'study';
        let value = content;

        // Determine type based on content
        if (content.includes('Journal Article') || referencesText.substring(0, referencesText.indexOf(match)).includes('Journal Article')) {
          type = 'journal';
        } else if (content.includes('Book Chapter') || referencesText.substring(0, referencesText.indexOf(match)).includes('Book Chapter')) {
          type = 'book';
        } else if (content.includes('10.')) {
          type = 'doi';
        }

        // Clean up the value
        value = value.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
        
        // Remove any remaining type indicators from the value
        value = value.replace(/Journal Article[•\s]*/g, '').replace(/Book Chapter[•\s]*/g, '');
        
        // Note: Removed automatic line break insertion to avoid conflicts with DOIs

        references.push({ type, value });
      }
    });
  } else {
    // No numbered references, try to split by type sections
    const journalArticleMatch = referencesText.match(/Journal Article[•\s]*([\s\S]*?)(?=Book Chapter|$)/);
    const bookChapterMatch = referencesText.match(/Book Chapter[•\s]*([\s\S]*?)(?=Journal Article|$)/);
    
    // Process Journal Article section
    if (journalArticleMatch) {
      const journalContent = journalArticleMatch[1].trim();
      if (journalContent) {
        // Split by numbered references within journal section
        const journalRefs = journalContent.split(/\d+\.\s+/).filter(ref => ref.trim().length > 0);
        journalRefs.forEach(ref => {
          const cleanedRef = ref.trim().replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
          if (cleanedRef) {
            references.push({ 
              type: 'journal', 
              value: cleanedRef
            });
          }
        });
      }
    }

    // Process Book Chapter section
    if (bookChapterMatch) {
      const bookContent = bookChapterMatch[1].trim();
      if (bookContent) {
        // Split by numbered references within book section
        const bookRefs = bookContent.split(/\d+\.\s+/).filter(ref => ref.trim().length > 0);
        bookRefs.forEach(ref => {
          const cleanedRef = ref.trim().replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
          if (cleanedRef) {
            references.push({ 
              type: 'book', 
              value: cleanedRef
            });
          }
        });
      }
    }
  }

  return references;
}

// Test with the problematic reference format
const testReferences = `Journal Article•10.22038/ijbms.2022.65112.14338
1. Hypericum perforatum: Traditional uses, clinical trials, and drug interactions.
1 Sep 2022`;

console.log('=== Testing Improved Reference Parsing ===');
console.log('Input:', testReferences);
console.log('\nParsed References:');
const result = convertReferencesToJson(testReferences);
result.forEach((ref, index) => {
  console.log(`${index + 1}. Type: ${ref.type}`);
  console.log(`   Value: ${ref.value}`);
  console.log('');
});

console.log('Total references found:', result.length); 