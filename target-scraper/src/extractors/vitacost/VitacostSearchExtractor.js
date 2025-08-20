// Vitacost Search Results Page Extractor
// Extracts product information from Vitacost search results pages

class VitacostSearchExtractor {
    constructor() {
        this.name = 'VitacostSearchExtractor';
        this.version = '1.0.0';
    }

    async extract(page, options = {}) {
        try {
            console.log('🔍 Extracting data from Vitacost search results page...');
            
            // Wait for the product listing to load
            await page.waitForSelector('.productWrapper, .product-block', { timeout: 10000 });
            
            // Extract pagination information
            const paginationInfo = await this.extractPaginationInfo(page);
            
            // Extract product listings
            const products = await this.extractProducts(page);
            
            // Extract search metadata
            const searchMetadata = await this.extractSearchMetadata(page);
            
            const results = {
                extractor: this.name,
                version: this.version,
                timestamp: new Date().toISOString(),
                url: page.url(),
                pagination: paginationInfo,
                searchMetadata,
                products,
                totalProducts: products.length
            };
            
            console.log(`✅ Extracted ${products.length} products from Vitacost search page`);
            return results;
            
        } catch (error) {
            console.error('❌ Error extracting from Vitacost search page:', error.message);
            throw error;
        }
    }

    async extractPaginationInfo(page) {
        try {
            const paginationInfo = await page.evaluate(() => {
                const info = {
                    currentPage: 1,
                    totalPages: 1,
                    totalProducts: 0,
                    productsPerPage: 60,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    nextPageUrl: null,
                    previousPageUrl: null
                };

                // Extract current page info
                const activePage = document.querySelector('.srListingNavPages .active');
                if (activePage) {
                    info.currentPage = parseInt(activePage.textContent.trim()) || 1;
                }

                // Extract total products info
                const productsText = document.querySelector('.srListingNavProducts');
                if (productsText) {
                    const text = productsText.textContent;
                    const match = text.match(/of\s+<strong>(\d+)<\/strong>/);
                    if (match) {
                        info.totalProducts = parseInt(match[1]) || 0;
                    }
                }

                // Extract pagination links
                const nextButton = document.querySelector('.srListingNavPages .icon-right-open:not(.disabled)');
                if (nextButton) {
                    info.hasNextPage = true;
                    info.nextPageUrl = nextButton.href;
                }

                const prevButton = document.querySelector('.srListingNavPages .icon-left-open:not(.disabled)');
                if (prevButton) {
                    info.hasPreviousPage = true;
                    info.previousPageUrl = prevButton.href;
                }

                // Calculate total pages
                if (info.totalProducts > 0) {
                    info.totalPages = Math.ceil(info.totalProducts / info.productsPerPage);
                }

                return info;
            });

            return paginationInfo;
        } catch (error) {
            console.warn('⚠️ Could not extract pagination info:', error.message);
            return {
                currentPage: 1,
                totalPages: 1,
                totalProducts: 0,
                productsPerPage: 60,
                hasNextPage: false,
                hasPreviousPage: false
            };
        }
    }

    async extractProducts(page) {
        try {
            const products = await page.evaluate(() => {
                const productBlocks = document.querySelectorAll('.product-block');
                const extractedProducts = [];

                productBlocks.forEach((block, index) => {
                    try {
                        const product = {
                            index: index + 1,
                            name: '',
                            url: '',
                            price: '',
                            pricePerServing: '',
                            rating: '',
                            reviewCount: '',
                            brand: '',
                            sku: '',
                            imageUrl: '',
                            availability: '',
                            badges: [],
                            extractedAt: new Date().toISOString()
                        };

                        // Extract product name and URL
                        const nameLink = block.querySelector('.pb-description a, .description a');
                        if (nameLink) {
                            product.name = nameLink.textContent.trim();
                            product.url = nameLink.href;
                            
                            // Extract SKU from URL if possible
                            const skuMatch = nameLink.href.match(/sku=(\d+)/);
                            if (skuMatch) {
                                product.sku = skuMatch[1];
                            }
                        }

                        // Extract price
                        const priceEl = block.querySelector('.pOurPriceM, .price, [itemprop="price"]');
                        if (priceEl) {
                            product.price = priceEl.textContent.trim();
                        }

                        // Extract price per serving
                        const ppuEl = block.querySelector('.ppu');
                        if (ppuEl) {
                            product.pricePerServing = ppuEl.textContent.trim();
                        }

                        // Extract rating
                        const ratingEl = block.querySelector('.rating, .stars');
                        if (ratingEl) {
                            const ratingText = ratingEl.textContent.trim();
                            const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
                            if (ratingMatch) {
                                product.rating = ratingMatch[1];
                            }
                        }

                        // Extract review count
                        const reviewEl = block.querySelector('.review-count');
                        if (reviewEl) {
                            const reviewText = reviewEl.textContent.trim();
                            const reviewMatch = reviewText.match(/\((\d+)\)/);
                            if (reviewMatch) {
                                product.reviewCount = reviewMatch[1];
                            }
                        }

                        // Extract brand (from product name or other elements)
                        const brandMatch = product.name.match(/^([^-]+)/);
                        if (brandMatch) {
                            product.brand = brandMatch[1].trim();
                        }

                        // Extract image URL
                        const imgEl = block.querySelector('.pb-img, img');
                        if (imgEl) {
                            product.imageUrl = imgEl.src;
                        }

                        // Extract badges and special features
                        const badges = [];
                        const badgeElements = block.querySelectorAll('.pb-icons span, .pb-callout li');
                        badgeElements.forEach(badge => {
                            const badgeText = badge.textContent.trim();
                            const badgeTitle = badge.getAttribute('title') || badge.getAttribute('tooltiptitle');
                            if (badgeText || badgeTitle) {
                                badges.push({
                                    text: badgeText,
                                    title: badgeTitle,
                                    className: badge.className
                                });
                            }
                        });
                        product.badges = badges;

                        // Extract variety/size information
                        const varietyEl = block.querySelector('.variety-ab-wrapper .pb-callout');
                        if (varietyEl) {
                            const varietyText = varietyEl.textContent.trim();
                            if (varietyText) {
                                product.variety = varietyText;
                            }
                        }

                        // Only add products with at least a name
                        if (product.name) {
                            extractedProducts.push(product);
                        }

                    } catch (productError) {
                        console.warn(`⚠️ Error extracting product ${index + 1}:`, productError.message);
                    }
                });

                return extractedProducts;
            });

            return products;
        } catch (error) {
            console.error('❌ Error extracting products:', error.message);
            return [];
        }
    }

    async extractSearchMetadata(page) {
        try {
            const metadata = await page.evaluate(() => {
                const meta = {
                    searchTerm: '',
                    sortBy: '',
                    filters: [],
                    breadcrumbs: []
                };

                // Extract search term from URL or page elements
                const urlParams = new URLSearchParams(window.location.search);
                meta.searchTerm = urlParams.get('t') || '';

                // Extract sort option
                const sortSelect = document.querySelector('#psSortBy');
                if (sortSelect) {
                    meta.sortBy = sortSelect.value || '';
                }

                // Extract breadcrumbs if available
                const breadcrumbElements = document.querySelectorAll('.breadcrumb a, .breadcrumbs a');
                breadcrumbElements.forEach(breadcrumb => {
                    meta.breadcrumbs.push({
                        text: breadcrumb.textContent.trim(),
                        url: breadcrumb.href
                    });
                });

                return meta;
            });

            return metadata;
        } catch (error) {
            console.warn('⚠️ Could not extract search metadata:', error.message);
            return {
                searchTerm: '',
                sortBy: '',
                filters: [],
                breadcrumbs: []
            };
        }
    }

    async extractNextPageUrl(page) {
        try {
            const nextPageUrl = await page.evaluate(() => {
                const nextButton = document.querySelector('.srListingNavPages .icon-right-open:not(.disabled)');
                return nextButton ? nextButton.href : null;
            });
            
            return nextPageUrl;
        } catch (error) {
            console.warn('⚠️ Could not extract next page URL:', error.message);
            return null;
        }
    }

    // Helper method to check if page has more results
    async hasMoreResults(page) {
        try {
            const hasMore = await page.evaluate(() => {
                const nextButton = document.querySelector('.srListingNavPages .icon-right-open:not(.disabled)');
                return nextButton !== null;
            });
            
            return hasMore;
        } catch (error) {
            console.warn('⚠️ Could not determine if more results exist:', error.message);
            return false;
        }
    }

    // Method to get all available page URLs for pagination
    async getAllPageUrls(page) {
        try {
            const pageUrls = await page.evaluate(() => {
                const urls = [];
                const pageLinks = document.querySelectorAll('.srListingNavPages a[href*="pg="]');
                
                pageLinks.forEach(link => {
                    const url = link.href;
                    const pageMatch = url.match(/pg=(\d+)/);
                    if (pageMatch) {
                        urls.push({
                            page: parseInt(pageMatch[1]),
                            url: url
                        });
                    }
                });

                // Sort by page number
                return urls.sort((a, b) => a.page - b.page);
            });

            return pageUrls;
        } catch (error) {
            console.warn('⚠️ Could not extract all page URLs:', error.message);
            return [];
        }
    }
}

module.exports = VitacostSearchExtractor;

