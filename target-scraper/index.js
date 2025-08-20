// Target Scraper - Main Index File
// Exports all main components for easy importing

// Core extractors
const VitacostSearchExtractor = require('./src/extractors/vitacost/VitacostSearchExtractor');

// Test runners
const VitacostExtractorTest = require('./src/test-runners/VitacostExtractorTest');

// Example usage
const VitacostExample = require('./example-usage');

// Main exports
module.exports = {
    // Extractors
    extractors: {
        VitacostSearchExtractor
    },
    
    // Test runners
    testRunners: {
        VitacostExtractorTest
    },
    
    // Examples
    examples: {
        VitacostExample
    },
    
    // Version info
    version: '1.0.0',
    description: 'Modular web scraping framework with site-specific extractors'
};

// Convenience exports
module.exports.VitacostSearchExtractor = VitacostSearchExtractor;
module.exports.VitacostExtractorTest = VitacostExtractorTest;
module.exports.VitacostExample = VitacostExample;

