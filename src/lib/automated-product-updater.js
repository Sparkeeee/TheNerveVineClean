var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { herbs } from '../data/herbs';
import { ProductAutomation, ContentGenerator } from './product-automation';
// Automated product updater that works with your existing structure
export class AutomatedProductUpdater {
    constructor(automation) {
        this.automation = automation;
    }
    // Update products for a specific herb
    updateHerbProducts(herbSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const herb = herbs.find(h => h.slug === herbSlug);
            if (!herb)
                return null;
            // Define search criteria based on herb properties
            const criteria = {
                symptoms: (_a = herb.indications) !== null && _a !== void 0 ? _a : [],
                herbs: herb.slug ? [herb.slug.replace('-', ' ')] : [],
                supplements: Array.isArray(herb.productFormulations) ? herb.productFormulations.map((p) => typeof p === 'string' ? p : p.name) : [],
                priceRange: { min: 5, max: 100 },
                rating: 4.0
            };
            // Find relevant products
            const products = yield this.automation.findProductsForCriteria(criteria);
            // Update herb with new products
            const enhancedHerb = Object.assign(Object.assign({}, herb), { automatedProducts: {
                    lastUpdated: new Date(),
                    products: products.slice(0, 5),
                    criteria
                } });
            return enhancedHerb;
        });
    }
    // Update all herbs
    updateAllHerbProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const enhancedHerbs = [];
            for (const herb of herbs) {
                if (herb.slug) {
                    const enhanced = yield this.updateHerbProducts(herb.slug);
                    if (enhanced) {
                        enhancedHerbs.push(enhanced);
                    }
                }
            }
            return enhancedHerbs;
        });
    }
    // Generate content for herb pages
    generateHerbPageContent(enhancedHerb) {
        var _a;
        if (!((_a = enhancedHerb.automatedProducts) === null || _a === void 0 ? void 0 : _a.products.length)) {
            return '';
        }
        const products = enhancedHerb.automatedProducts.products;
        return `
## Recommended Products for ${enhancedHerb.name}

${products.map(product => ContentGenerator.generateProductRecommendation({
            id: product.id || product.name.replace(/\s+/g, '-').toLowerCase(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            currency: product.currency || 'USD',
            affiliateUrl: product.affiliateUrl,
            imageUrl: product.imageUrl || '',
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            availability: product.availability !== undefined ? product.availability : true,
            categories: product.categories || [],
            tags: product.tags || [],
            brand: product.brand || ''
        }, enhancedHerb.name)).join('\n\n')}

*Last updated: ${enhancedHerb.automatedProducts.lastUpdated.toLocaleDateString()}*
    `.trim();
    }
}
// Scheduled automation service
export class ProductAutomationScheduler {
    constructor(updater, updateIntervalHours = 24) {
        this.updater = updater;
        this.updateInterval = updateIntervalHours;
    }
    // Start automated updates
    startScheduledUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Starting automated product updates...');
            // Initial update
            yield this.performUpdate();
            // Schedule regular updates
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield this.performUpdate();
            }), this.updateInterval * 60 * 60 * 1000);
        });
    }
    performUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Performing automated product update...');
                const updatedHerbs = yield this.updater.updateAllHerbProducts();
                // Here you would save the updated data to your database or file system
                yield this.saveUpdatedData(updatedHerbs);
                console.log(`Updated ${updatedHerbs.length} herbs with new products`);
                // Using updatedHerbs to avoid ESLint warning
                console.log('Enhanced herbs:', updatedHerbs.map(h => h.name));
            }
            catch (error) {
                console.error('Error during automated product update:', error);
            }
        });
    }
    saveUpdatedData(enhancedHerbs) {
        return __awaiter(this, void 0, void 0, function* () {
            // This would integrate with your data storage system
            // For now, we'll just log the updates
            console.log('Saving updated herb data...');
            console.log('Enhanced herbs to save:', enhancedHerbs.map(h => h.name));
            // In a real implementation, you might:
            // 1. Save to a database
            // 2. Update your herbs.ts file
            // 3. Trigger a rebuild of your site
            // 4. Send notifications about updates
        });
    }
}
// API endpoint for manual updates
export function updateProductsForHerb(herbSlug) {
    return __awaiter(this, void 0, void 0, function* () {
        // This would be called from an API route
        const providers = [
            {
                name: 'Amazon',
                apiKey: process.env.AMAZON_ASSOCIATES_API_KEY || '',
                baseUrl: 'https://amazon.com',
                commission: 0.04
            },
            {
                name: 'iHerb',
                apiKey: process.env.IHERB_API_KEY || '',
                baseUrl: 'https://iherb.com',
                commission: 0.05
            }
        ];
        const automation = new ProductAutomation(providers);
        const updater = new AutomatedProductUpdater(automation);
        return yield updater.updateHerbProducts(herbSlug);
    });
}
// Example usage in your Next.js API route
export function handleProductUpdate(herbSlug) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const enhancedHerb = yield updateProductsForHerb(herbSlug);
            if (enhancedHerb) {
                // Generate new content
                const content = new AutomatedProductUpdater(new ProductAutomation([]))
                    .generateHerbPageContent(enhancedHerb);
                return {
                    success: true,
                    herb: enhancedHerb,
                    content
                };
            }
            return {
                success: false,
                error: 'Herb not found'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    });
}
